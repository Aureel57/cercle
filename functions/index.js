/* ═══════════════════════════════════════════════════════════════════
   Cercle — Cloud Function d'envoi d'email de vérification aux couleurs
   de la DA « Quartier Libre ».
   Génère le lien de vérification (Admin SDK) et l'envoie dans un email
   HTML sur mesure via Gmail SMTP (bonne délivrabilité → moins de spam).
   ═══════════════════════════════════════════════════════════════════ */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Identifiants Gmail définis via :
//   firebase functions:config:set gmail.email="..." gmail.password="MOT_DE_PASSE_APPLICATION"
const GMAIL = (functions.config().gmail || {});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL.email, pass: GMAIL.password },
});

const SITE_URL = "https://aureel57.github.io/cercle/v2/";

// Échappe le prénom pour éviter toute injection HTML
function esc(s) {
  return String(s || "voisin").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ─── Template email « Quartier Libre » (table-based, compatible Gmail/Outlook) ───
function emailHTML(name, link) {
  const n = esc(name);
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F3EA;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EA;">
    <tr><td align="center" style="padding:36px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Marque -->
        <tr><td style="padding:0 4px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;padding-right:10px;">
              <div style="width:30px;height:30px;border:5px solid #2C50C8;border-radius:50%;border-right-color:transparent;"></div>
            </td>
            <td style="vertical-align:middle;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:bold;color:#20242F;letter-spacing:-.5px;">
              cercle<span style="color:#DA6740;">.</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Carte principale (bordure encre + ombre franche) -->
        <tr><td style="background:#FFFFFF;border:2px solid #20242F;border-radius:18px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:30px 32px;">

            <h1 style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:25px;line-height:1.2;color:#20242F;">
              Bienvenue dans le cercle, ${n}&nbsp;!
            </h1>
            <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#343A46;">
              Il ne reste qu'un geste pour que vos voisins sachent à qui ils prêtent&nbsp;:
              confirmez votre adresse e-mail.
            </p>

            <!-- Bouton terracotta (bulletproof) -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 22px;"><tr>
              <td align="center" bgcolor="#DA6740" style="border-radius:12px;">
                <a href="${link}" target="_blank"
                   style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:12px;">
                  Confirmer mon adresse ✦
                </a>
              </td>
            </tr></table>

            <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:13.5px;line-height:1.6;color:#6A7078;">
              Une fois le tampon posé, vous pourrez emprunter et proposer des objets
              <strong style="color:#20242F;">à deux rues</strong> de chez vous — assuré jusqu'à 2&nbsp;000&nbsp;€,
              caution séquestrée.
            </p>
            <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#A39B89;">
              Le bouton ne marche pas&nbsp;? Copiez ce lien&nbsp;:<br>
              <a href="${link}" target="_blank" style="color:#2C50C8;word-break:break-all;">${link}</a>
            </p>

          </td></tr></table>
        </td></tr>

        <!-- Pied -->
        <tr><td style="padding:18px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11.5px;line-height:1.7;color:#A39B89;">
          Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement ce message.<br>
          <strong style="color:#6A7078;">Cercle</strong> — la location entre voisins. Tout est à deux rues.
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ─── Fonction appelable depuis le site ───
exports.sendVerifEmail = functions.https.onCall(async (data) => {
  const email = data && data.email;
  const name = (data && data.name) || "voisin";
  if (!email) {
    throw new functions.https.HttpsError("invalid-argument", "Adresse e-mail manquante.");
  }
  // Lien de vérification officiel Firebase (retour sur le site après clic)
  const link = await admin.auth().generateEmailVerificationLink(email, { url: SITE_URL });
  await transporter.sendMail({
    from: `Cercle <${GMAIL.email}>`,
    to: email,
    subject: "Bienvenue dans le cercle — confirmez votre adresse ✦",
    html: emailHTML(name, link),
  });
  return { ok: true };
});
