/* ═══════════════════════════════════════════════════════════════════
   Cercle — Cloud Functions des emails transactionnels.

   Envoi via Gmail SMTP authentifié (bonne délivrabilité → moins de spam).
   Les gabarits vivent dans emails.js ; ici, seulement QUAND et À QUI.

     sendVerifEmail      appel   inscription (site + app)
     registerDevice      appel   connexion — alerte si appareil inconnu
     onReservationCreate Firestore  demande envoyée (locataire) + reçue (propriétaire)
     onReservationUpdate Firestore  demande acceptée (locataire)
     rentalReminders     tous les jours 8 h  rappel du jour J (les deux)
   ═══════════════════════════════════════════════════════════════════ */
const path = require("path");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const E = require("./emails");

admin.initializeApp();
const db = admin.firestore();

// Identifiants Gmail lus depuis functions/.env (GMAIL_EMAIL, GMAIL_PASSWORD)
const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_EMAIL, pass: GMAIL_PASSWORD },
});

const SITE_URL = "https://aureel57.github.io/cercle/";
const TZ = "Europe/Paris";

// Logo joint à chaque email et appelé par cid : pas d'hébergement externe,
// et il s'affiche même quand le client bloque les images distantes.
const LOGO = { filename: "cercle.png", path: path.join(__dirname, "assets/logo.png"), cid: "logo@cercle" };

function send(to, { subject, html, text }) {
  return transporter.sendMail({ from: `Cercle <${GMAIL_EMAIL}>`, to, subject, html, text, attachments: [LOGO] });
}

/** Adresse et nom d'un membre, ou null (compte supprimé, annonce de démonstration…). */
async function member(uid) {
  if (!uid) return null;
  try {
    const u = await admin.auth().getUser(uid);
    return u.email ? { email: u.email, name: u.displayName || "" } : null;
  } catch (e) {
    return null;
  }
}

/** Un échec d'envoi ne doit jamais faire échouer la réservation : on le journalise. */
async function safely(label, fn) {
  try { await fn(); } catch (e) { console.error(`[email] ${label} :`, e && (e.code || e.message)); }
}

/* ─────────────────────────── inscription ─────────────────────────── */

// Réservée aux comptes connectés, et l'adresse est TOUJOURS celle du compte
// appelant — jamais celle fournie par le client. Sans cela, n'importe qui
// pouvait faire envoyer des emails à n'importe quelle adresse depuis notre Gmail,
// et le code d'erreur renvoyé révélait si une adresse était inscrite chez nous.
exports.sendVerifEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token || !context.auth.token.email) {
    throw new functions.https.HttpsError("unauthenticated", "Connexion requise.");
  }
  const email = context.auth.token.email;
  const name = String((data && data.name) || "voisin").slice(0, 60);
  try {
    const link = await admin.auth().generateEmailVerificationLink(email, { url: SITE_URL });
    await send(email, E.verify({ name, link }));
    return { ok: true };
  } catch (err) {
    // Détail en log serveur uniquement — le client n'a pas besoin de savoir pourquoi.
    console.error("sendVerifEmail error:", err);
    throw new functions.https.HttpsError("internal", "L'envoi a échoué — réessayez plus tard.");
  }
});

/* ─────────────────────────── nouvel appareil ─────────────────────────── */

// Chaque appareil (app) ou navigateur (site) tire un identifiant aléatoire au
// premier lancement et l'annonce ici à chaque ouverture de session. Les
// appareils connus vivent dans users/{uid}/devices, que seul le serveur lit
// et écrit (les règles refusent tout au client).
//
// Le tout premier appareil d'un compte est enregistré sans email : à
// l'inscription, c'est forcément le sien — et pour les comptes antérieurs à
// cette fonction, la première connexion après la mise en ligne sert de base.
exports.registerDevice = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Connexion requise.");
  const id = String((data && data.deviceId) || "");
  if (!/^[A-Za-z0-9_-]{12,64}$/.test(id)) {
    throw new functions.https.HttpsError("invalid-argument", "Identifiant d'appareil invalide.");
  }
  const label = String((data && data.label) || "Appareil inconnu").replace(/[<>\n\r]/g, "").slice(0, 80);
  const uid = context.auth.uid;
  const devices = db.collection("users").doc(uid).collection("devices");
  const now = admin.firestore.FieldValue.serverTimestamp();

  const known = await devices.doc(id).get();
  if (known.exists) {
    await devices.doc(id).update({ lastSeen: now, label });
    return { known: true };
  }
  const any = await devices.limit(1).get();
  await devices.doc(id).set({ label, firstSeen: now, lastSeen: now });
  if (any.empty) return { known: false, alerted: false };

  const email = context.auth.token && context.auth.token.email;
  if (!email) return { known: false, alerted: false };
  await safely("nouvel appareil", async () => {
    const when = new Date().toLocaleString("fr-FR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZone: TZ,
    });
    const resetLink = await admin.auth().generatePasswordResetLink(email, { url: SITE_URL });
    await send(email, E.newDevice({ name: context.auth.token.name || "", device: label, when, resetLink }));
  });
  return { known: false, alerted: true };
});

/* ─────────────────────────── réservations ─────────────────────────── */

exports.onReservationCreate = functions.firestore
  .document("v2_reservations/{id}")
  .onCreate(async (snap) => {
    const r = snap.data();
    if (!r || r.status !== "pending") return;
    const [renter, owner] = await Promise.all([member(r.renterUid), member(r.ownerUid)]);
    await Promise.all([
      renter && safely("demande envoyée", () => send(renter.email, E.bookingRequested({ r, url: SITE_URL }))),
      owner && safely("demande reçue", () => send(owner.email, E.rentalRequested({ r, url: SITE_URL }))),
    ]);
  });

exports.onReservationUpdate = functions.firestore
  .document("v2_reservations/{id}")
  .onUpdate(async (change) => {
    const before = change.before.data(), r = change.after.data();
    if (before.status === "confirmed" || r.status !== "confirmed") return;
    const renter = await member(r.renterUid);
    if (renter) await safely("réservation confirmée", () => send(renter.email, E.bookingConfirmed({ r, url: SITE_URL })));
  });

/** Date du jour à Paris, au format des réservations (« 2026-10-11 »). */
function todayInParis() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

// Deux égalités seulement : Firestore les sert sans index composite.
// `reminderSent` évite un second envoi si l'exécution est rejouée.
exports.rentalReminders = functions.pubsub
  .schedule("0 8 * * *").timeZone(TZ)
  .onRun(async () => {
    const snap = await db.collection("v2_reservations")
      .where("status", "==", "confirmed")
      .where("startDate", "==", todayInParis())
      .get();
    for (const doc of snap.docs) {
      const r = doc.data();
      if (r.reminderSent) continue;
      const [renter, owner] = await Promise.all([member(r.renterUid), member(r.ownerUid)]);
      if (renter) await safely("rappel locataire", () => send(renter.email, E.rentalReminder({ r, role: "renter", url: SITE_URL })));
      if (owner) await safely("rappel propriétaire", () => send(owner.email, E.rentalReminder({ r, role: "owner", url: SITE_URL })));
      await doc.ref.update({ reminderSent: true });
    }
    console.log(`[email] rappels : ${snap.size} location(s) commencent aujourd'hui`);
  });
