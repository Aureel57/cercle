/* ═══════════════════════════════════════════════════════════════════
   Cercle — gabarits des emails transactionnels.

   Un seul habillage pour tous : fond crème, carte blanche, logo en image
   (Gmail n'affiche ni SVG ni police web — sans image, le logotype
   retomberait en Arial), bouton bleu de marque, montants en vert.
   Schibsted Grotesk / Instrument Sans s'affichent dans Apple Mail et
   iOS ; ailleurs, repli sur Helvetica/Arial.

   Chaque gabarit renvoie { subject, html, text } : la version texte brut
   compte pour la délivrabilité (un email HTML seul sent le spam).
   ═══════════════════════════════════════════════════════════════════ */

const C = {
  bg: "#F7F3EA", card: "#FFFFFF", border: "#E8E1D2", ink: "#20242F",
  text: "#343A46", muted: "#746A58", primary: "#2C50C8", terra: "#DA6740",
  green: "#1F8150", greenBg: "#E1F1E7", pending: "#B5711F", pendingBg: "#FBEBD4",
};
const F_TITLE = "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif";
const F_TEXT = "'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif";

/** Logo joint à l'email (cid) — voir index.js. L'aperçu le remplace par une data-URI. */
const LOGO_SRC = "cid:logo@cercle";

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const first = (name) => esc(String(name || "").trim().split(/\s+/)[0] || "voisin");
const euros = (n) => `${Number(n || 0).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;

/** « 2026-10-11 » → « sam. 11 oct. » (date pure, sans fuseau). */
function day(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ""))) return "";
  return new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR",
    { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}
/** Période lisible : dates réelles si présentes, sinon le libellé stocké par le site. */
function period(r) {
  const a = day(r.startDate), b = day(r.endDate);
  if (a && b && a !== b) return `${a} → ${b}`;
  if (a) return a;
  return r.range || `${r.days || 1} jour${(r.days || 1) > 1 ? "s" : ""}`;
}

/* ─────────────────────────── briques ─────────────────────────── */

function pill(label, fg, bg) {
  return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${bg};color:${fg};font-family:${F_TEXT};font-size:12px;font-weight:600;letter-spacing:.02em;">${label}</span>`;
}

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 4px;"><tr>
  <td bgcolor="${C.primary}" style="border-radius:12px;">
    <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:14px 26px;font-family:${F_TEXT};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:12px;">${label}</a>
  </td></tr></table>`;
}

/** Récapitulatif façon ticket : lignes libellé / valeur, la dernière peut être mise en avant. */
function details(rows) {
  const tr = rows.filter(Boolean).map(([k, v, strong], i) => `<tr>
      <td style="padding:${i ? "9px" : "0"} 0 0;font-family:${F_TEXT};font-size:13.5px;color:${C.muted};">${k}</td>
      <td align="right" style="padding:${i ? "9px" : "0"} 0 0;font-family:${strong ? F_TITLE : F_TEXT};font-size:${strong ? "17px" : "14px"};font-weight:${strong ? 700 : 600};color:${strong ? C.green : C.ink};">${v}</td>
    </tr>`).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;background:${C.bg};border-radius:14px;">
    <tr><td style="padding:18px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${tr}</table></td></tr></table>`;
}

function p(html, extra = "") {
  return `<p style="margin:12px 0 0;font-family:${F_TEXT};font-size:15px;line-height:1.6;color:${C.text};${extra}">${html}</p>`;
}
function note(html) {
  return `<p style="margin:18px 0 0;font-family:${F_TEXT};font-size:13px;line-height:1.6;color:${C.muted};">${html}</p>`;
}

/** Habillage commun. `preheader` = la ligne d'aperçu affichée dans la boîte de réception. */
function layout({ preheader, eyebrow, title, body, footer }) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@700;800&family=Instrument+Sans:wght@400;600&display=swap" rel="stylesheet">
<title>${esc(title.replace(/<[^>]+>/g, ""))}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};">
  <tr><td align="center" style="padding:32px 16px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="padding:0 4px 18px;">
        <img src="${LOGO_SRC}" width="121" height="34" alt="Cercle" style="display:block;border:0;width:121px;height:34px;">
      </td></tr>
      <tr><td style="background:${C.card};border:1px solid ${C.border};border-radius:20px;padding:32px 30px 30px;">
        ${eyebrow ? `<div style="margin:0 0 14px;">${eyebrow}</div>` : ""}
        <h1 style="margin:0;font-family:${F_TITLE};font-size:25px;line-height:1.22;font-weight:700;letter-spacing:-.01em;color:${C.ink};">${title}</h1>
        ${body}
      </td></tr>
      <tr><td style="padding:20px 8px 0;font-family:${F_TEXT};font-size:12px;line-height:1.7;color:${C.muted};">
        ${footer ? footer + "<br>" : ""}<strong style="color:${C.ink};font-weight:600;">Cercle</strong> — la location entre voisins.
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
}

/* ─────────────────────────── gabarits ─────────────────────────── */

/** 1. Inscription — confirmer l'adresse. */
function verify({ name, link }) {
  return {
    subject: "Confirmez votre adresse pour rejoindre Cercle",
    html: layout({
      preheader: "Un clic et votre compte est actif.",
      title: `Bienvenue, ${first(name)}`,
      body:
        p("Votre compte Cercle est créé. Il reste à confirmer votre adresse e-mail : c'est ce qui permet à vos voisins de savoir à qui ils prêtent.") +
        button(link, "Confirmer mon adresse") +
        note(`Le bouton ne fonctionne pas&nbsp;? Copiez ce lien dans votre navigateur&nbsp;:<br><a href="${esc(link)}" style="color:${C.primary};word-break:break-all;">${esc(link)}</a>`),
      footer: "Vous n'êtes pas à l'origine de cette inscription ? Ignorez ce message, aucun compte ne sera activé.",
    }),
    text: `Bienvenue, ${String(name || "voisin").split(" ")[0]}.\n\nVotre compte Cercle est créé. Confirmez votre adresse e-mail en ouvrant ce lien :\n${link}\n\nVous n'êtes pas à l'origine de cette inscription ? Ignorez ce message.`,
  };
}

/** 2. Sécurité — connexion depuis un appareil jamais vu. */
function newDevice({ name, device, when, resetLink }) {
  return {
    subject: "Nouvelle connexion à votre compte Cercle",
    html: layout({
      preheader: `${device} — ${when}`,
      eyebrow: pill("Sécurité", C.primary, "#E4E9FA"),
      title: "Nouvelle connexion à votre compte",
      body:
        p(`Bonjour ${first(name)}, votre compte vient d'être ouvert depuis un appareil que nous ne connaissions pas encore.`) +
        details([["Appareil", esc(device)], ["Date", esc(when)]]) +
        p("<strong style=\"color:" + C.ink + ";\">C'était vous&nbsp;?</strong> Vous n'avez rien à faire.", "margin-top:22px;") +
        p("<strong style=\"color:" + C.ink + ";\">Ce n'était pas vous&nbsp;?</strong> Changez votre mot de passe tout de suite : la personne sera déconnectée.") +
        button(resetLink, "Changer mon mot de passe"),
      footer: "Ce lien est valable une heure. Cercle ne vous demandera jamais votre mot de passe par e-mail.",
    }),
    text: `Nouvelle connexion à votre compte Cercle.\n\nAppareil : ${device}\nDate : ${when}\n\nC'était vous ? Rien à faire.\nCe n'était pas vous ? Changez votre mot de passe :\n${resetLink}`,
  };
}

/** 3. Réservation (locataire) — demande envoyée, en attente du propriétaire. */
function bookingRequested({ r, url }) {
  const owner = esc(r.ownerName || "le propriétaire");
  return {
    subject: `Demande envoyée : ${r.itemTitle}`,
    html: layout({
      preheader: `${r.ownerName || "Le propriétaire"} a reçu votre demande. Rien n'est débité avant sa réponse.`,
      eyebrow: pill("En attente de réponse", C.pending, C.pendingBg),
      title: `Votre demande pour «&nbsp;${esc(r.itemTitle)}&nbsp;» est partie`,
      body:
        p(`Bonjour ${first(r.renterName)}, ${owner} a reçu votre demande. Vous serez prévenu par e-mail dès sa réponse.`) +
        details([
          ["Objet", esc(r.itemTitle)],
          ["Prêté par", owner],
          ["Période", esc(period(r))],
          r.deposit ? ["Caution", euros(r.deposit)] : null,
          r.ref ? ["Référence", esc(r.ref)] : null,
          ["Total", euros(r.total), true],
        ]) +
        note(`Le paiement est seulement <strong>autorisé</strong> : rien n'est débité tant que ${owner} n'a pas accepté.`) +
        button(url, "Suivre ma demande"),
    }),
    text: `Votre demande pour « ${r.itemTitle} » est partie.\n\nPrêté par : ${r.ownerName}\nPériode : ${period(r)}\nTotal : ${euros(r.total)}\n\nRien n'est débité tant que le propriétaire n'a pas accepté.\n${url}`,
  };
}

/** 4. Location (propriétaire) — un voisin veut louer son objet. */
function rentalRequested({ r, url }) {
  const renter = esc(r.renterName || "Un voisin");
  const amount = r.base || r.total;
  return {
    subject: `${r.renterName || "Un voisin"} veut louer « ${r.itemTitle} »`,
    html: layout({
      preheader: `${period(r)} — à vous d'accepter ou de refuser.`,
      eyebrow: pill("Nouvelle demande", C.terra, "#FBE6DD"),
      title: `${renter} veut louer «&nbsp;${esc(r.itemTitle)}&nbsp;»`,
      body:
        p(`Bonjour ${first(r.ownerName)}, vous avez une nouvelle demande de location. Elle reste en attente tant que vous n'avez pas répondu.`) +
        details([
          ["Demandé par", renter],
          ["Période", esc(period(r))],
          r.days ? ["Durée", `${r.days} jour${r.days > 1 ? "s" : ""}`] : null,
          ["Prix de la location", euros(amount), true],
        ]) +
        note("Le montant est autorisé sur la carte du locataire et débité seulement si vous acceptez. La commission Cercle est déduite au versement.") +
        button(url, "Répondre à la demande"),
    }),
    text: `${r.renterName || "Un voisin"} veut louer « ${r.itemTitle} ».\n\nPériode : ${period(r)}\nPrix de la location : ${euros(amount)}\n\nRépondre : ${url}`,
  };
}

/** 5. Réservation confirmée (locataire). */
function bookingConfirmed({ r, url }) {
  const owner = esc(r.ownerName || "Le propriétaire");
  return {
    subject: `C'est confirmé : ${r.itemTitle}`,
    html: layout({
      preheader: `${r.ownerName || "Le propriétaire"} a accepté. Rendez-vous le ${period(r).split(" →")[0]}.`,
      eyebrow: pill("Confirmée", C.green, C.greenBg),
      title: `${owner} a accepté votre demande`,
      body:
        p(`Bonne nouvelle, ${first(r.renterName)} : «&nbsp;${esc(r.itemTitle)}&nbsp;» est réservé pour vous. Écrivez à ${owner} depuis la messagerie pour convenir du lieu et de l'heure de remise.`) +
        details([
          ["Objet", esc(r.itemTitle)],
          ["Période", esc(period(r))],
          r.deposit ? ["Caution", euros(r.deposit)] : null,
          ["Total", euros(r.total), true],
        ]) +
        note("Pensez à vérifier l'objet avec le propriétaire au moment de la remise. Vous recevrez un rappel le premier jour de la location.") +
        button(url, "Voir ma réservation"),
    }),
    text: `${r.ownerName || "Le propriétaire"} a accepté votre demande pour « ${r.itemTitle} ».\n\nPériode : ${period(r)}\nTotal : ${euros(r.total)}\n\n${url}`,
  };
}

/** 6. Rappel du jour J — `role` = "renter" (récupérer) ou "owner" (remettre). */
function rentalReminder({ r, role, url }) {
  const renter = role === "renter";
  const other = esc(renter ? (r.ownerName || "le propriétaire") : (r.renterName || "le locataire"));
  const title = renter
    ? `C'est aujourd'hui : «&nbsp;${esc(r.itemTitle)}&nbsp;»`
    : `${other} passe récupérer «&nbsp;${esc(r.itemTitle)}&nbsp;» aujourd'hui`;
  return {
    subject: renter ? `Aujourd'hui : vous récupérez « ${r.itemTitle} »` : `Aujourd'hui : remise de « ${r.itemTitle} »`,
    html: layout({
      preheader: renter ? `Votre location commence aujourd'hui avec ${r.ownerName || "votre voisin"}.` : `${r.renterName || "Votre voisin"} vient chercher l'objet aujourd'hui.`,
      eyebrow: pill("Aujourd'hui", C.primary, "#E4E9FA"),
      title,
      body:
        p(renter
          ? `Bonjour ${first(r.renterName)}, votre location commence aujourd'hui. Si l'heure de remise n'est pas encore fixée, écrivez à ${other}.`
          : `Bonjour ${first(r.ownerName)}, la location commence aujourd'hui. Si l'heure de remise n'est pas encore fixée, écrivez à ${other}.`) +
        details([
          ["Objet", esc(r.itemTitle)],
          ["Période", esc(period(r))],
          [renter ? "Prêté par" : "Loué par", other],
        ]) +
        note(renter
          ? "Au moment de la remise, faites le tour de l'objet ensemble et prenez quelques photos avant de partir."
          : "Au moment de la remise, faites le tour de l'objet ensemble et prenez quelques photos : un défaut noté avant le départ ne se discute plus au retour.") +
        button(url, "Ouvrir la messagerie"),
    }),
    text: `${renter ? "Votre location commence aujourd'hui" : "Remise prévue aujourd'hui"} : « ${r.itemTitle} ».\nPériode : ${period(r)}\n${url}`,
  };
}

module.exports = { verify, newDevice, bookingRequested, rentalRequested, bookingConfirmed, rentalReminder, LOGO_SRC };
