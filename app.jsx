const{useState,useEffect,useRef,useMemo}=React;

/* ═══════════ DONNÉES DÉMO ═══════════ */
const CATS=[
 {id:"all",label:"Tout"},
 {id:"brico",label:"Bricolage"},
 {id:"photo",label:"Photo & son"},
 {id:"velo",label:"Vélos & mobilité"},
 {id:"sport",label:"Sport & plein air"},
 {id:"jardin",label:"Jardin"},
 {id:"cuisine",label:"Cuisine & maison"},
];
/* seed → image. Les vraies photos (data:/http/blob) passent telles quelles, les graines de démo deviennent une image picsum stable. */
const isUrl=s=>/^(data:|https?:|blob:)/.test(String(s||""));
const seed=(s,w=560,h=420)=>isUrl(s)?String(s):`https://picsum.photos/seed/${s}/${w}/${h}`;
/* Galerie à partir d'une graine/photo : une vraie photo unique = 1 image, une graine de démo = 3 vues distinctes. */
const imgsFromSeed=sd=>isUrl(sd)?[sd]:[sd,sd+"b",sd+"c"];
/* Redimensionne une photo choisie (côté navigateur) en JPEG compact pour le stockage/affichage. */
function fileToDataURL(file,max=900,q=0.72){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();
  im.onload=()=>{let w=im.width,h=im.height;if(w>h&&w>max){h=Math.round(h*max/w);w=max;}else if(h>=w&&h>max){w=Math.round(w*max/h);h=max;}
    const cv=document.createElement("canvas");cv.width=w;cv.height=h;cv.getContext("2d").drawImage(im,0,0,w,h);URL.revokeObjectURL(u);res(cv.toDataURL("image/jpeg",q));};
  im.onerror=e=>{URL.revokeObjectURL(u);rej(e);};im.src=u;});}
const ITEMS=[
 {id:"p1",t:"Perceuse visseuse Bosch Pro 18V",c:"brico",p:12,img:["atelier","outils2","etabli3"],own:"Léa",city:"rue de Charonne",note:4.9,rev:42,d:"Perceuse professionnelle 18V, 2 batteries + coffret 34 embouts. Elle dort dans mon garage 360 jours par an — autant qu'elle serve. Remise en main propre devant la boulangerie Petit."},
 {id:"p2",t:"Vélo cargo électrique",c:"velo",p:18,img:["velo22","rue4","cargo7"],own:"Maxime",city:"rue Haute",note:4.8,rev:31,d:"Vélo cargo électrique, idéal courses et enfants. Casque et antivol fournis. Autonomie 60 km."},
 {id:"p3",t:"Canon EOS R6 + 24-70 mm",c:"photo",p:45,img:["foret9","camera5","photo12"],own:"Chloé",city:"av. de la Gare",note:5.0,rev:18,d:"Boîtier plein format + zoom 24-70 f/2.8. Parfait mariages et week-ends. 2 batteries, carte 128 Go."},
 {id:"p4",t:"Tente 4 places Quechua",c:"sport",p:15,img:["camp4","montagne8","tente2"],own:"Sarah",city:"rue du Sablon",note:4.7,rev:26,d:"Tente 4 places, montage 10 minutes, étanche. Sac de transport, sardines et maillet inclus."},
 {id:"p5",t:"Ponceuse orbitale Makita",c:"brico",p:9,img:["bois3","atelier6","ponce1"],own:"Karim",city:"rue des Tanneurs",note:4.8,rev:22,d:"Ponceuse orbitale 125 mm + 20 disques. Idéale meubles et volets."},
 {id:"p6",t:"Sono JBL PartyBox 310",c:"photo",p:22,img:["fete7","sono2","soiree9"],own:"Emma",city:"pl. Saint-Louis",note:4.6,rev:35,d:"240 W, batterie 18 h, micro inclus. Vos voisins l'entendront — prévenez-les ou invitez-les."},
 {id:"p7",t:"Taille-haie électrique",c:"jardin",p:11,img:["jardin5","haie3","vert8"],own:"Paul",city:"rue Verlaine",note:4.7,rev:14,d:"Lame 55 cm, rallonge 20 m fournie. Léger et maniable."},
 {id:"p8",t:"Appareil à raclette 8 pers.",c:"cuisine",p:6,img:["table9","cuisine4","repas2"],own:"Inès",city:"rue du Pont",note:4.9,rev:51,d:"Huit poêlons, pierre de cuisson. L'objet le plus loué du quartier en hiver."},
 {id:"p9",t:"Paddle gonflable + pagaie",c:"sport",p:16,img:["lac6","eau3","paddle8"],own:"Hugo",city:"quai des Saules",note:4.5,rev:12,d:"Paddle 320 cm, pompe et leash inclus. Gilet en option."},
 {id:"p10",t:"Vidéoprojecteur 4K Epson",c:"photo",p:19,img:["cine2","salon7","ecran4"],own:"Léa",city:"rue de Charonne",note:4.8,rev:29,d:"3000 lumens, HDMI + Chromecast. Écran 100 pouces pliable fourni."},
 {id:"p11",t:"Échelle télescopique 3,8 m",c:"brico",p:8,img:["mur5","echelle2","facade6"],own:"Marc",city:"imp. des Lilas",note:4.6,rev:9,d:"Alu, se range dans un coffre de voiture. Sangle de sécurité incluse."},
 {id:"p12",t:"Barbecue Weber + plancha",c:"jardin",p:14,img:["bbq3","terrasse6","grill1"],own:"Nadia",city:"rue des Vignes",note:4.9,rev:38,d:"Weber 57 cm + plancha fonte. Charbon non fourni, bonne humeur obligatoire."},
];
/* Caution : mêmes règles que l'application — ~5 jours de location, bornée 20–2 000 €. */
const CAUTION_MIN=20,CAUTION_MAX=2000;
const cautionSuggest=p=>Math.min(CAUTION_MAX,Math.max(CAUTION_MIN,Math.round(((+p||0)*5)/5)*5));
function distFor(id){const h=String(id).split("").reduce((a,c)=>(a*31+c.charCodeAt(0))%997,7);const m=150+(h%9)*100;return{m,min:Math.max(2,Math.round(m/80))}}
const distLabel=id=>{const d=distFor(id);return `à ${d.m} m · ${d.min} min à pied`};
/* Persistance locale */
const LSKEY="cercle_v2";
const loadLS=()=>{try{return JSON.parse(localStorage.getItem(LSKEY))||{}}catch(e){return{}}};
const saveLS=o=>{try{localStorage.setItem(LSKEY,JSON.stringify(o))}catch(e){}};
const AUTO_REPLIES=["Pas de souci, à bientôt !","Ça marche, je vous le mets de côté.","Parfait — remise en main propre devant la boulangerie ?","Top, à tout à l'heure !","Avec plaisir, c'est ça le cercle."];
/* Firebase helpers */
const fbAuth=()=>{try{return window.__fbOK?firebase.auth():null}catch(e){return null}};
const fbDb=()=>{try{return window.__fbOK?firebase.firestore():null}catch(e){return null}};
const fbUserToUser=fu=>({uid:fu.uid,name:fu.displayName||(fu.email||"Voisin").split("@")[0],email:fu.email||"",phone:fu.phoneNumber||"",quartier:"Metz Sablon",verified:!!fu.emailVerified,phoneVerified:!!fu.phoneNumber,photo:fu.photoURL||null});
const FB_ERR={"auth/invalid-credential":"Email ou mot de passe incorrect.","auth/wrong-password":"Email ou mot de passe incorrect.","auth/user-not-found":"Aucun compte avec cet email — rejoignez le cercle !","auth/email-already-in-use":"Un compte existe déjà avec cet email — connectez-vous.","auth/weak-password":"Mot de passe trop court (6 caractères minimum).","auth/password-does-not-meet-requirements":"Mot de passe trop simple : 6 caractères min, avec une majuscule, un chiffre et un caractère spécial (ex. ! ? @).","auth/invalid-email":"Cet email ne semble pas valide.","auth/missing-password":"Entrez votre mot de passe.","auth/too-many-requests":"Trop d'essais — réessayez dans quelques minutes.","auth/operation-not-allowed":"L'inscription par email n'est pas activée pour le moment.","auth/network-request-failed":"Connexion internet interrompue — réessayez.","auth/internal-error":"Petit souci côté serveur — réessayez dans un instant.","auth/popup-closed-by-user":"Fenêtre Google fermée avant la fin.","auth/popup-blocked":"Popup bloquée par le navigateur — autorisez les popups.","auth/account-exists-with-different-credential":"Un compte existe déjà avec cet email — connectez-vous."};
const fbMsg=e=>FB_ERR[e&&e.code]||"Petit souci de connexion — réessayez.";
/* App native (Capacitor) : les popups OAuth ne marchent pas en WebView → on masque les boutons sociaux */
const IS_NATIVE=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
/* Détecte « cet email a déjà un compte » même si le code varie (protection anti-énumération) */
const isExistingAccount=e=>{const c=(e&&e.code)||"";const m=((e&&e.message)||"").toLowerCase();return c==="auth/email-already-in-use"||c==="auth/account-exists-with-different-credential"||m.includes("already in use")||m.includes("email-already")||m.includes("already exists");};
/* Règles de mot de passe du projet : longueur, majuscule, chiffre, caractère spécial */
const pwChecks=p=>({len:(p||"").length>=6,upper:/[A-Z]/.test(p||""),digit:/[0-9]/.test(p||""),special:/[^A-Za-z0-9]/.test(p||"")});
const pwScore=p=>{const c=pwChecks(p);return c.len+c.upper+c.digit+c.special;};
const PW_LVL=[{t:"",c:"var(--bd)"},{t:"Très faible",c:"var(--ter)"},{t:"Faible",c:"var(--sun)"},{t:"Correct",c:"var(--sun)"},{t:"Solide",c:"var(--green)"}];
/* Indicateur de force en direct (4 critères = 4 segments) */
function PwMeter({value}){
  if(!value)return <div className="hint">6 caractères min, avec une majuscule, un chiffre et un caractère spécial (ex. ! ? @).</div>;
  const c=pwChecks(value),s=pwScore(value),lvl=PW_LVL[s]||PW_LVL[0];
  const item=(ok,label)=><span className={ok?"ok":""}><b>{ok?"✓":"○"}</b>{label}</span>;
  return <div className="pwm">
    <div className="pwm-bar">{[0,1,2,3].map(i=><div key={i} className="pwm-seg" style={{background:i<s?lvl.c:"var(--bd)"}}/>)}</div>
    <div className="pwm-lvl" style={{color:lvl.c}}><span>{lvl.t}</span></div>
    <div className="pwm-checks">{item(c.len,"6 caractères")}{item(c.upper,"Une majuscule")}{item(c.digit,"Un chiffre")}{item(c.special,"Un caractère spécial")}</div>
  </div>;
}
const VERIF_SETTINGS={url:"https://aureel57.github.io/cercle/",handleCodeInApp:false};
/* Envoie l'email de vérif : email DA via Cloud Function si déployée, sinon email Firebase standard */
async function sendVerif(user,name,email){
  try{
    if(window.__fbOK&&firebase.functions){
      await firebase.functions().httpsCallable("sendVerifEmail")({email,name});
      return;
    }
  }catch(e){/* fonction non déployée / erreur → repli */}
  try{await user.sendEmailVerification(VERIF_SETTINGS)}catch(_){}
}
const GRADES=[
 {id:"nouveau",nom:"Nouveau voisin",court:"NOUVEAU",min:0,fee:12,sym:"○",adv:"On vous prête déjà tout le cercle"},
 {id:"palier",nom:"Voisin de palier",court:"PALIER",min:50,fee:11,sym:"◔",adv:"Badge profil + 1 annonce mise en avant"},
 {id:"habitue",nom:"Habitué du quartier",court:"HABITUÉ",min:500,fee:9,sym:"◑",adv:"3 annonces mises en avant"},
 {id:"figure",nom:"Figure du quartier",court:"FIGURE",min:2000,fee:7,sym:"◕",adv:"6 mises en avant + support prioritaire"},
 {id:"memoire",nom:"Mémoire du quartier",court:"MÉMOIRE",min:5000,fee:5,sym:"●",adv:"12 mises en avant + accès anticipé"},
 {id:"maire",nom:"Maire du quartier",court:"MAIRE",min:15000,fee:3,sym:"✪",adv:"L'écharpe : ambassadeur officiel Cercle"},
];
const getGrade=n=>[...GRADES].reverse().find(g=>n>=g.min)||GRADES[0];
const getNextGrade=n=>GRADES[GRADES.indexOf(getGrade(n))+1]||null;
const feeRate=(n,plus)=>Math.max(0.02,getGrade(n).fee/100-(plus?0.01:0));
const LEGALS={
 cgu:{t:"Conditions générales d'utilisation",lead:"Les règles du cercle, écrites pour être lues.",maj:"16 juin 2026",sections:[
   {h:"1. Objet",p:["Cercle est une plateforme qui met en relation des voisins pour la location d'objets du quotidien. En créant un compte, vous acceptez les présentes conditions."]},
   {h:"2. Inscription & compte",p:["L'inscription est gratuite et réservée aux personnes majeures. Vous vous engagez à fournir des informations exactes et à confirmer votre adresse e-mail.","Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité sur votre compte."]},
   {h:"3. Le rôle de Cercle",p:["Cercle est un intermédiaire technique : la location est un contrat entre voisins. Cercle facilite la mise en relation, encadre la caution et propose une assurance, mais n'est pas propriétaire des objets."]},
   {h:"4. Vos engagements",p:["Prêter et emprunter avec le soin que vous porteriez à vos propres affaires. Décrire honnêtement vos objets, respecter les dates convenues, et signaler tout incident sans tarder.","Sont interdits : objets illégaux, dangereux, ou contraires à l'ordre public."]},
   {h:"5. Location, caution & commission",p:["Chaque location donne lieu à une caution séquestrée, restituée sous 48 h après le retour de l'objet en bon état.","La commission de service est de 11 %, réduite par votre grade et votre abonnement Cercle+, avec un plancher de 2 %."]},
   {h:"6. Résiliation",p:["Vous pouvez supprimer votre compte à tout moment depuis vos paramètres. Cercle peut suspendre un compte en cas de manquement grave aux présentes conditions."]},
 ]},
 mentions:{t:"Mentions légales",lead:"Qui édite et héberge Cercle.",maj:"16 juin 2026",sections:[
   {h:"Éditeur du site",p:["Cercle — [raison sociale à compléter], [forme juridique] au capital de [montant] €.","Siège social : [adresse à compléter]. SIREN/SIRET : [à compléter]. RCS : [à compléter].","E-mail : support@cercle.fr."]},
   {h:"Directeur de la publication",p:["[Nom du responsable de la publication à compléter]."]},
   {h:"Hébergement",p:["Le site est hébergé par GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.","Les données de compte et d'annonces sont gérées via Google Firebase (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande)."]},
   {h:"Propriété intellectuelle",p:["La marque, le logo et l'identité visuelle « Quartier Libre » de Cercle sont protégés. Les photos et descriptions d'annonces restent la propriété de leurs auteurs."]},
 ]},
 cgv:{t:"Conditions de location",lead:"Prix, paiement, annulation — sans surprise.",maj:"16 juin 2026",sections:[
   {h:"Prix & commission",p:["Le prix de location par jour est fixé librement par le propriétaire de l'objet. Cercle prélève une commission de service (11 %, réduite selon le grade et Cercle+, plancher 2 %), affichée avant toute réservation."]},
   {h:"Paiement & caution",p:["Le paiement est demandé à la réservation mais n'est débité qu'à la confirmation du propriétaire. La caution est séquestrée (bloquée, non débitée) le temps de la location.","Le montant de la caution est fixé par le propriétaire et affiché avant que vous confirmiez."]},
   {h:"Annulation",p:["L'annulation est gratuite jusqu'à 24 h avant le début de la location. Passé ce délai, le premier jour peut être retenu."]},
   {h:"Litiges & assurance",p:["Chaque location est couverte jusqu'à 2 000 € (casse, perte, vol pendant la location). En cas de litige, notre équipe examine les preuves (photos avant/après, échanges) avant toute retenue sur la caution.","Voir aussi la page « Assurance & caution »."]},
 ]},
 assurance:{t:"Assurance & caution",lead:"Comment vous êtes protégé, des deux côtés du prêt.",p:["Chaque location sur Cercle est couverte jusqu'à 2 000 € : si un objet prêté est cassé, perdu ou volé pendant la location, le propriétaire est indemnisé — sans avance de frais.","La caution est séquestrée par Cercle au moment de la réservation : ni vous ni le propriétaire ne la touchez. Elle est bloquée, jamais débitée tant que tout se passe bien.","Au retour de l'objet en bon état, la caution est libérée automatiquement sous 48 h. En cas de litige, notre équipe regarde les preuves (photos avant/après, échanges) avant toute retenue.","Le montant de la caution est fixé par le propriétaire, en général l'équivalent de 5 jours de location (entre 20 € et 2 000 €). Il est toujours affiché avant que vous confirmiez."],mail:"assurance@cercle.fr",mailLabel:"Une question sur l'assurance ?"},
 conf:{t:"Politique de confidentialité",lead:"Vos données restent dans le cercle. On vous explique tout.",maj:"16 juin 2026",sections:[
   {h:"Données que nous collectons",p:["Votre prénom, e-mail, quartier, et éventuellement votre numéro de téléphone. Vos annonces, réservations, messages et avis. Vos préférences (mode nuit, abonnement)."]},
   {h:"Pourquoi (finalités)",p:["Pour faire fonctionner le service : vous connecter, vous montrer les objets près de chez vous, gérer les locations et la messagerie, et assurer la sécurité du cercle.","Votre adresse exacte n'est jamais affichée aux autres — uniquement une distance à pied."]},
   {h:"Base légale & sous-traitants",p:["Le traitement repose sur l'exécution du contrat (les CGU) et votre consentement. Vos données sont hébergées chez Google Firebase (UE/Irlande) et ne sont jamais vendues à des tiers."]},
   {h:"Durée de conservation",p:["Vos données sont conservées tant que votre compte est actif. À la suppression du compte, elles sont effacées (hors obligations légales de conservation, ex. facturation)."]},
   {h:"Vos droits (RGPD)",p:["Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition. Vous pouvez exporter ou supprimer vos données à tout moment depuis Paramètres › Mes données.","Pour toute demande : ecrire@cercle.fr. Vous pouvez aussi saisir la CNIL (cnil.fr)."]},
 ]},
 cookies:{t:"Cookies & traceurs",lead:"Le strict minimum, et rien pour la pub.",maj:"16 juin 2026",sections:[
   {h:"Ce que nous utilisons",p:["Un stockage local pour vous garder connecté (session Firebase) et mémoriser vos préférences (mode nuit, quartier, abonnement)."]},
   {h:"Pas de publicité",p:["Aucun cookie publicitaire, aucun traceur tiers, aucun revente de données. Pas de Google Analytics ni de pixels marketing."]},
   {h:"Gérer",p:["Vous pouvez à tout moment vider le stockage local depuis votre navigateur. Le bandeau de consentement vous laisse aussi accepter ou refuser à l'arrivée."]},
 ]},
 contact:{t:"Nous écrire",lead:"Une question, un souci, une idée ? On lit tout.",p:["Pour toute question sur une location, un litige, votre compte ou l'assurance, écrivez-nous : on répond en général sous 24 h ouvrées.","Besoin d'aide en pleine location ? Précisez le nom de l'objet et la date — ça nous aide à vous répondre vite."],mail:"support@cercle.fr",mailLabel:"Écrire au support"},
};

/* ═══════════ ICÔNES ═══════════ */
const S=(p,vw="0 0 24 24")=>({size=16,...r})=><svg viewBox={vw} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:size,height:size}} {...r}>{p}</svg>;
const I={
 search:S(<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>),
 pin:S(<><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>),
 heart:S(<path d="M19 14c1.5-1.5 2-3.2 2-5a5 5 0 0 0-9-3 5 5 0 0 0-9 3c0 1.8.5 3.5 2 5l7 7 7-7Z"/>),
 star:({size=13})=><svg viewBox="0 0 24 24" fill="currentColor" style={{width:size,height:size}}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
 plus:S(<path d="M12 5v14M5 12h14"/>),
 back:S(<><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>),
 shield:S(<path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z"/>),
 lock:S(<><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>),
 clock:S(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></>),
 msg:S(<path d="M21 12c0 4-4 7-9 7a10 10 0 0 1-3-.4L3 20l1.6-4A6.6 6.6 0 0 1 3 12c0-4 4-7 9-7s9 3 9 7Z"/>),
 user:S(<><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"/></>),
 home:S(<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/></>),
 moon:S(<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>),
 sun:S(<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>),
 send:S(<><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>),
 walk:S(<><circle cx="13" cy="4" r="1.5"/><path d="M10 22l2-7 2 2v5M7 12l3-3 2 1 2 3h3"/></>),
 bell:S(<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>),
};

/* ═══════════ LOGO ═══════════ */
const Logo=({size=38})=><svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Cercle">
  <circle cx="24" cy="24" r="19" fill="none" stroke="var(--p)" strokeWidth="5" strokeLinecap="round" strokeDasharray="89 31" transform="rotate(35 24 24)"/>
  <circle cx="24" cy="24" r="6.5" fill="var(--ter)"/>
</svg>;

/* ═══════════ GSAP helpers ═══════════ */
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function useReveal(deps){
  useEffect(()=>{
    if(typeof gsap==="undefined")return;
    if(reduced()){document.querySelectorAll('.reveal').forEach(el=>{el.style.opacity=1;el.style.transform='none'});return;}
    const els=document.querySelectorAll('.reveal');
    gsap.to(els,{opacity:1,y:0,duration:.6,stagger:.05,ease:"power3.out",overwrite:"auto"});
  },deps);
}

/* ═══════════ HERO RADAR ═══════════ */
function Hero({items,open,onSearch,user}){
  const ref=useRef(null);
  const picks=useMemo(()=>items.slice(0,5),[items]);
  const POS=[{x:20,y:16},{x:79,y:22},{x:86,y:64},{x:22,y:72},{x:58,y:90}];
  useEffect(()=>{
    if(typeof gsap==="undefined"||!ref.current||reduced())return;
    const ctx=gsap.context(()=>{
      gsap.from(".h-el",{y:22,autoAlpha:0,duration:.7,stagger:.09,ease:"power3.out"});
      gsap.from(".rings circle",{scale:.55,transformOrigin:"50% 50%",autoAlpha:0,duration:.9,stagger:.12,ease:"power2.out"});
      gsap.from(".ping",{scale:0,autoAlpha:0,duration:.55,stagger:.15,delay:.45,ease:"back.out(2.2)"});
      gsap.utils.toArray(".ping").forEach((p,i)=>gsap.to(p,{y:"+=7",duration:2.8+i*.5,yoyo:true,repeat:-1,ease:"sine.inOut",delay:1.2+i*.3}));
      const sp=ref.current.querySelector(".sould path");
      if(sp){const L=sp.getTotalLength();gsap.fromTo(sp,{strokeDasharray:L,strokeDashoffset:L},{strokeDashoffset:0,duration:.7,delay:.85,ease:"power2.out"});}
    },ref);
    return()=>ctx.revert();
  },[]);
  return <div className="hero" ref={ref}>
    <div>
      <div className="eyebrow h-el"><span className="dot"/>{(user&&user.quartier)||"Metz Sablon"} · {ITEMS.length*18} objets autour de vous</div>
      <h1>
        <span className="h-el" style={{display:"block"}}>Arrêtez d'acheter.</span>
        <span className="h-el" style={{display:"block"}}>Tout dort déjà</span>
        <span className="h-el bl" style={{display:"block"}}><span className="sould">à deux rues<svg viewBox="0 0 200 10" preserveAspectRatio="none"><path d="M3 7 Q 50 2 100 6 T 197 5"/></svg></span>.</span>
      </h1>
      <p className="sub h-el">Perceuse, vélo cargo, sono, appareil photo… Vos voisins les ont, ils les prêtent. Assuré jusqu'à 2 000 €, caution séquestrée.</p>
      <form className="hsearch h-el" onSubmit={e=>{e.preventDefault();onSearch(e.target.q.value)}}>
        <I.search size={18}/>
        <input name="q" placeholder="De quoi avez-vous besoin ?" aria-label="Rechercher un objet"/>
        <button type="submit" className="btn btn-p">Chercher</button>
      </form>
      <div className="proof h-el">
        <div><b>2 412</b><span>objets partagés</span></div><div className="sep"/>
        <div><b>12 000+</b><span>voisins inscrits</span></div><div className="sep"/>
        <div><b style={{color:"var(--sun)"}}>★ 4,8</b><span>note moyenne</span></div>
      </div>
    </div>
    <div className="radar">
      <svg className="rings" viewBox="0 0 460 430" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <circle cx="230" cy="215" r="198" className="dash"/>
        <circle cx="230" cy="215" r="136"/>
        <circle cx="230" cy="215" r="74" className="dash"/>
        <text x="356" y="206">1 km</text><text x="298" y="148">500 m</text>
      </svg>
      <div className="you">Chez vous<i/></div>
      {picks.map((it,i)=>{const p=POS[i];return(
        <button key={it.id} className="ping" style={{left:p.x+"%",top:p.y+"%"}} onClick={()=>open(it)} aria-label={it.t}>
          <span className="ph"><img src={seed(it.img[0],160,160)} alt=""/><span className="pt"/></span>
          <span className="lbl">{it.t.length>15?it.t.slice(0,14)+"…":it.t} · <b>{it.p} €/j</b></span>
        </button>);})}
    </div>
  </div>;
}

/* ═══════════ CARTE ═══════════ */
function Card({it,open,fav,togFav}){
  return <article className="card reveal" onClick={()=>open(it)}>
    <div className="ph">
      <img src={seed(it.img[0])} alt={it.t} loading="lazy"/>
      <div className="stamp"><span className="ck">✓</span><span>VÉRIFIÉ</span></div>
      <div className="dist"><I.walk size={11}/>{distLabel(it.id)}</div>
      <button className={"fav"+(fav?" on":"")} aria-label="Favori" onClick={e=>{e.stopPropagation();togFav(it.id)}}>
        <svg viewBox="0 0 24 24" fill={fav?"currentColor":"none"} stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" style={{width:16,height:16}}><path d="M19 14c1.5-1.5 2-3.2 2-5a5 5 0 0 0-9-3 5 5 0 0 0-9 3c0 1.8.5 3.5 2 5l7 7 7-7Z"/></svg>
      </button>
    </div>
    <div className="in">
      <div className="tt"><h3>{it.t}</h3>{it.rev>0?<span className="note"><I.star/>{it.note.toFixed(1)}</span>:<span className="note" style={{background:"color-mix(in srgb,var(--p) 12%,transparent)",color:"var(--p)"}}>Nouveau</span>}</div>
      <div className="own">{it.own}{it.ownerPro&&<span className="propill">PRO</span>} · {it.city}</div>
      <div className="foot"><span className="prix">{it.p} € <small>/jour</small></span><span className="marche">{distFor(it.id).min} min à pied</span></div>
    </div>
  </article>;
}

/* ═══════════ DÉTAIL ═══════════ */
const isoLocal=d=>{const p=n=>(n<10?"0":"")+n;return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate());};
/* Calendrier de réservation : clic date de début puis de fin, jours passés/réservés grisés */
function Cal({booked=[],sel,onPick,today}){
  const t0=new Date(today+"T00:00:00");
  const[mon,setMon]=useState(new Date(t0.getFullYear(),t0.getMonth(),1));
  const isBooked=ds=>booked.some(b=>b&&b.start&&b.end&&ds>=b.start&&ds<b.end);
  const crosses=(a,b)=>{const s=new Date(a+"T00:00:00"),e=new Date(b+"T00:00:00");for(let d=new Date(s);d<e;d.setDate(d.getDate()+1)){if(isBooked(isoLocal(d)))return true;}return false;};
  const click=ds=>{
    if(ds<today||isBooked(ds))return;
    if(!sel.start||sel.end){onPick({start:ds,end:""});return;}
    if(ds<=sel.start){onPick({start:ds,end:""});return;}
    if(crosses(sel.start,ds)){onPick({start:ds,end:""});return;}
    onPick({start:sel.start,end:ds});
  };
  const y=mon.getFullYear(),m=mon.getMonth();
  const startDow=(new Date(y,m,1).getDay()+6)%7,nDays=new Date(y,m+1,0).getDate();
  const cells=[];for(let i=0;i<startDow;i++)cells.push(null);for(let d=1;d<=nDays;d++)cells.push(new Date(y,m,d));
  const prevOff=(y<t0.getFullYear())||(y===t0.getFullYear()&&m<=t0.getMonth());
  return <div className="cal">
    <div className="cal-h">
      <button type="button" disabled={prevOff} onClick={()=>setMon(new Date(y,m-1,1))} aria-label="Mois précédent">‹</button>
      <b>{mon.toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}</b>
      <button type="button" onClick={()=>setMon(new Date(y,m+1,1))} aria-label="Mois suivant">›</button>
    </div>
    <div className="cal-dow">{["L","M","M","J","V","S","D"].map((d,i)=><span key={i}>{d}</span>)}</div>
    <div className="cal-grid">{cells.map((d,i)=>{
      if(!d)return <span key={i}/>;
      const ds=isoLocal(d),past=ds<today,bk=isBooked(ds);
      const isStart=ds===sel.start,isEnd=ds===sel.end,inRng=sel.start&&sel.end&&ds>sel.start&&ds<sel.end;
      const cls=["cal-d"];if(past||bk)cls.push("off");if(isStart||isEnd)cls.push("sel");if(inRng)cls.push("rng");if(ds===today&&!isStart&&!isEnd)cls.push("tdy");
      return <button key={i} type="button" className={cls.join(" ")} disabled={past||bk} onClick={()=>click(ds)}>{d.getDate()}</button>;
    })}</div>
  </div>;
}
function Detail({it,backHome,fav,togFav,toast,reserve,openChat,plus,reviews=[],rentals=0}){
  const d=distFor(it.id);
  const[main,setMain]=useState(0);
  useEffect(()=>{setMain(0)},[it.id]);
  const itemReviews=reviews.filter(r=>r.itemId===it.id);
  const myGrade=getGrade(rentals);
  const rate=feeRate(rentals,plus);
  const todayISO=isoLocal(new Date());
  const[sel,setSel]=useState({start:"",end:""});
  useEffect(()=>{setSel({start:"",end:""})},[it.id]);
  const booked=it.booked||[];
  const fmtFr=dt=>dt.toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});
  const days=(sel.start&&sel.end)?Math.max(1,Math.round((new Date(sel.end+"T00:00:00")-new Date(sel.start+"T00:00:00"))/864e5)):0;
  const base=+(it.p*days).toFixed(2);
  const fee=+(it.p*days*rate).toFixed(2);
  const totNum=+(base+fee).toFixed(2);
  const tot=totNum.toFixed(2).replace(".",",");
  const range=(sel.start&&sel.end)?`${fmtFr(new Date(sel.start+"T00:00:00"))} → ${fmtFr(new Date(sel.end+"T00:00:00"))}`:"";
  const startISO=sel.start,endISO=sel.end;
  const[licChk,setLicChk]=useState(false);
  const[licNum,setLicNum]=useState("");
  useEffect(()=>{setLicChk(false);setLicNum("")},[it.id]);
  const licOk=!it.needsLicense||(licChk&&licNum.trim().length>=4);
  const canReserve=days>0&&licOk;
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});
    if(typeof gsap!=="undefined"&&!reduced()){
      gsap.from(".gal, .det-body > div",{y:20,autoAlpha:0,duration:.6,stagger:.12,ease:"power3.out"});
    }
  },[it.id]);
  return <div className="det">
    <button className="back" onClick={backHome}><I.back size={14}/>Retour</button>
    <div className="gal">
      <div className="g0"><img src={seed(it.img[main]||it.img[0],900,560)} alt={it.t}/>
        <div className="stamp" style={{width:56,height:56,fontSize:7.5}}><span className="ck" style={{fontSize:13}}>✓</span><span>VÉRIFIÉ</span></div>
      </div>
      {it.img.length>1&&<div className="gthumbs">
        {it.img.map((im,i)=><button key={i} type="button" className={"gth"+(i===main?" on":"")} onClick={()=>setMain(i)} aria-label={"Photo "+(i+1)}><img src={seed(im,200,140)} alt=""/></button>)}
      </div>}
    </div>
    <div className="det-body">
      <div>
        <h1>{it.t}</h1>
        <div className="meta">
          {it.rev>0
            ?<><span className="st"><I.star size={14}/></span><b>{it.note.toFixed(1)}</b><span style={{textDecoration:"underline"}}>{it.rev} avis</span><span>·</span></>
            :<><b style={{color:"var(--p)"}}>Nouvelle annonce</b><span>·</span></>}
          <span>{it.own} · répond en ~15 min</span>
        </div>
        <div className="trajet"><I.walk size={15}/>à {d.m} m de chez vous — {d.min} minutes à pied, {it.city}</div>
        <div className="guars">
          <div className="guar"><b><I.shield size={14}/>Protégé 2 000 €</b><span>par Cercle</span></div>
          <div className="guar"><b><I.lock size={14}/>Caution séquestrée</b><span>rendue sous 48 h</span></div>
          <div className="guar"><b><I.clock size={14}/>Annulation 24 h</b><span>gratuite</span></div>
        </div>
        <h3 className="sh">Description</h3>
        <p className="desc">{it.d}</p>
        <div className="owner-card">
          <div className="avat">{it.own[0]}</div>
          <div><div className="nm">{it.own}{it.ownerPro&&<span className="propill">PRO</span>}</div><div className="sb">{it.ownerPro?"Loueur professionnel":"Voisin·e vérifié·e"}{it.rev>0?` · ★ ${it.note.toFixed(1)} · ${it.rev} avis`:""}</div></div>
          <button className="btn btn-ghost" style={{padding:"9px 15px",minHeight:38,fontSize:13}} onClick={()=>openChat(it)}><I.msg size={14}/>Contacter</button>
        </div>
        {itemReviews.length>0&&<>
          <h3 className="sh">Avis des voisins <small style={{fontWeight:500,color:"var(--gl)"}}>· {itemReviews.length}</small></h3>
          <div className="rows">{itemReviews.map(r=><div key={r.id} className="rev">
            <div className="rh">
              <div className="avat" style={{width:34,height:34,fontSize:13}}>{(r.by||"V")[0]}</div>
              <b style={{color:"var(--dk)",fontSize:14}}>{r.by}</b>
              <span className="stars">{[...Array(r.note)].map((_,j)=><I.star key={j} size={11}/>)}</span>
              <span style={{marginLeft:"auto",fontSize:11.5,color:"var(--gl)"}}>{r.when}</span>
            </div>
            <p style={{fontSize:13.5}}>{r.txt}</p>
          </div>)}</div>
        </>}
      </div>
      <aside className="ticket">
        <div className="th">
          <span className="prix">{it.p} € <small>/jour</small></span>
          <span className="caution">CAUTION {it.cau||it.p*6} €</span>
        </div>
        <div className="perfo"/>
        <div className="tb" style={{paddingTop:18}}>
          <div style={{fontSize:12,fontWeight:700,color:"var(--dk)",marginBottom:8}}>{!sel.start?"Choisissez la date de début":!sel.end?"Choisissez la date de fin":`Du ${range.replace(" → "," au ")} · ${days} jour${days>1?"s":""}`}</div>
          <Cal booked={booked} sel={sel} onPick={setSel} today={todayISO}/>
          <div className="cal-lg">
            <span><i style={{background:"var(--ter)"}}/>Sélection</span>
            <span><i style={{background:"color-mix(in srgb,var(--gl) 40%,transparent)"}}/>Indisponible</span>
          </div>
          <div className="calc" style={{marginTop:12}}>
            {days>0?<>
            <div className="row"><span>{it.p} € × {days} jour{days>1?"s":""}</span><b>{(it.p*days).toFixed(2).replace(".",",")} €</b></div>
            <div className="row"><span>Frais de service ({Math.round(rate*100)} %) · grade {myGrade.nom}</span><b>{fee.toFixed(2).replace(".",",")} €</b></div>
            {plus&&<div className="row" style={{color:"var(--plus)"}}><span>✦ Cercle+ inclus</span><b style={{color:"var(--plus)"}}>−1 %</b></div>}
            <div className="tot"><span>Total</span><b>{tot} €</b></div>
            </>:<div style={{fontSize:12.5,color:"var(--g)",textAlign:"center",padding:"4px 0"}}>Sélectionnez vos dates pour voir le total.</div>}
          </div>
          {it.needsLicense&&<div style={{marginTop:12}}>
            <label className="chk" style={{marginBottom:8}}><input type="checkbox" checked={licChk} onChange={e=>setLicChk(e.target.checked)}/><span><b>Permis de conduire</b><small>Ce bien est un véhicule. Je certifie détenir un permis valide.</small></span></label>
            <input value={licNum} onChange={e=>setLicNum(e.target.value)} placeholder="Numéro de permis" aria-label="Numéro de permis" style={{width:"100%",padding:"11px 14px",border:"1.5px solid var(--bd)",borderRadius:12,fontSize:14,background:"var(--bg)",color:"var(--dk)",outline:"none"}}/>
          </div>}
          <button className="btn btn-green" disabled={!canReserve} style={!canReserve?{opacity:.5,cursor:"not-allowed",marginTop:12}:{marginTop:12}} onClick={()=>{if(days<1){toast("Choisissez vos dates de location");return;}if(!licOk){toast("Attestez votre permis et saisissez son numéro");return;}reserve(it,days,totNum,base,fee,range,startISO,endISO,licNum.trim());}}><I.lock size={15}/>{days<1?"Choisir les dates":!licOk?"Attestez votre permis":`Réserver — ${tot} €`}</button>
          <p className="note">Débité seulement à la confirmation de {it.own}</p>
          <button className={"btn btn-ghost"} style={{width:"100%",marginTop:8,fontSize:13}} onClick={()=>togFav(it.id)}>{fav?"♥ Retiré des favoris ?":"♡ Ajouter aux favoris"}</button>
        </div>
      </aside>
    </div>
  </div>;
}

/* ═══════════ PAGES ═══════════ */
const PHOTO_PH="data:image/svg+xml,"+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='#F7F3EA'/><g fill='none' stroke='#C9BFA8' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><rect x='150' y='112' width='100' height='76' rx='10'/><circle cx='176' cy='140' r='9'/><path d='M150 174l30-26 22 18 24-22 24 24'/></g><text x='200' y='214' font-family='sans-serif' font-size='17' fill='#A39B89' text-anchor='middle'>Ajoutez votre photo</text></svg>");
function Create({toast,backHome,addItem}){
  const HINTS={brico:"les outils du quartier se louent 8–15 €/j",photo:"photo & son : 15–45 €/j",velo:"vélos & mobilité : 12–20 €/j",sport:"sport & plein air : 10–18 €/j",jardin:"jardin : 8–14 €/j",cuisine:"cuisine & maison : 5–10 €/j"};
  const MAXP=4;
  const[t,setT]=useState("");
  const[c,setC]=useState("brico");
  const[pr,setPr]=useState("");
  const[d,setD]=useState("");
  const[photos,setPhotos]=useState([]);
  const[cau,setCau]=useState("");
  const[lic,setLic]=useState(false);
  const[upBusy,setUpBusy]=useState(false);
  const price=Math.max(0,+pr||0);
  const cauVal=cau===""?(price?cautionSuggest(price):""):Math.min(CAUTION_MAX,Math.max(0,+cau||0));
  const prev={id:"prev",t:t||"Votre objet",c,p:price||8,img:photos.length?photos:[PHOTO_PH],own:"Vous",city:"rue du Sablon",note:0,rev:0,d,cau:+cauVal||0};
  const addPhoto=p=>setPhotos(ps=>ps.length>=MAXP||ps.includes(p)?ps:[...ps,p]);
  const removePhoto=i=>setPhotos(ps=>ps.filter((_,j)=>j!==i));
  const onUpload=async e=>{const f=e.target.files&&e.target.files[0];if(!f){return;}e.target.value="";
    if(!/^image\//.test(f.type)){toast("Choisissez un fichier image");return;}
    if(f.size>12*1024*1024){toast("Photo trop lourde (12 Mo max)");return;}
    if(photos.length>=MAXP){toast("4 photos maximum");return;}
    setUpBusy(true);try{const u=await fileToDataURL(f);addPhoto(u);}catch(_){toast("Impossible de lire cette photo");}setUpBusy(false);};
  return <div className="page" style={{maxWidth:1180}}>
    <h1>Proposer un objet</h1>
    <p className="lead">Il dort chez vous ? Il peut servir à deux rues. Photo, prix — en ligne en 2 minutes.</p>
    <div className="create-grid">
      <div className="panel">
        <form onSubmit={e=>{e.preventDefault();if(!photos.length){toast("Ajoutez au moins une photo");return;}
          addItem({t,c,p:price||5,d:d||"Proposé par un voisin du Sablon, avec soin.",imgs:photos,cau:+cauVal||0,needsLicense:lic});
          toast("Annonce publiée — bienvenue dans le cercle !");backHome();}}>
          <div className="fg"><label>Titre de l'annonce</label><input required value={t} onChange={e=>setT(e.target.value)} placeholder="Ex. Perceuse visseuse Bosch Pro 18V"/></div>
          <div className="fr">
            <div className="fg"><label>Catégorie</label><select value={c} onChange={e=>setC(e.target.value)}>{CATS.filter(x=>x.id!=="all").map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></div>
            <div className="fg"><label>Prix par jour (€)</label><input type="number" min="1" required value={pr} onChange={e=>setPr(e.target.value)} placeholder="12"/><div className="hint">{HINTS[c]}</div></div>
          </div>
          <div className="fg"><label>Caution (€)</label><input type="number" min={CAUTION_MIN} max={CAUTION_MAX} value={cau} onChange={e=>setCau(e.target.value)} placeholder={price?String(cautionSuggest(price)):"Ex. 60"}/><div className="hint">Séquestrée par Cercle, rendue sous 48 h. {price>0&&cau===""?`Suggéré : ${cautionSuggest(price)} € (≈ 5 jours de location).`:"Laissez vide pour la suggestion automatique (≈ 5 jours de location, entre 20 et 2 000 €)."}</div></div>
          <div className="fg"><label>Description</label><textarea value={d} onChange={e=>setD(e.target.value)} placeholder="État, accessoires fournis, lieu de remise en main propre…"/></div>
          <label className="chk"><input type="checkbox" checked={lic} onChange={e=>setLic(e.target.checked)}/><span><b>Véhicule — permis de conduire requis</b><small>Le locataire devra attester d'un permis valide et saisir son numéro avant de réserver.</small></span></label>
          <div className="fg"><label>Vos photos <small style={{fontWeight:500,color:"var(--gl)"}}>· jusqu'à {MAXP}</small></label>
            {photos.length>0&&<div className="photo-sel">
              {photos.map((p,i)=><div key={i} className="psel">
                <img src={seed(p,160,160)} alt=""/>
                {i===0&&<span className="cov">Couverture</span>}
                <button type="button" className="prm" onClick={()=>removePhoto(i)} aria-label="Retirer la photo">×</button>
              </div>)}
            </div>}
            <div className="photo-pick">
              <label className={"photo-up"+(photos.length>=MAXP?" full":"")} title="Importer une photo">
                <I.plus size={16}/><span>{upBusy?"…":"Importer"}</span>
                <input type="file" accept="image/*" onChange={onUpload} disabled={photos.length>=MAXP}/>
              </label>
            </div>
            <div className="hint">Importez vos vraies photos depuis votre appareil (recadrées et allégées automatiquement). La première sera la couverture.</div>
          </div>
          {price>0&&<div className="gain"><I.star size={14}/>Louée 2 week-ends par mois ≈ {price*4} €/mois dans votre poche · caution : {cauVal||cautionSuggest(price)} €</div>}
          <button type="submit" className="btn btn-ter" disabled={!photos.length} style={{width:"100%",padding:14,fontSize:15,marginTop:12,opacity:photos.length?1:.5}}>Publier mon annonce</button>
          {!photos.length&&<p className="hint" style={{textAlign:"center"}}>Ajoutez au moins une photo pour publier.</p>}
        </form>
      </div>
      <aside className="cprev">
        <div className="plabel">Aperçu — votre annonce dans le cercle</div>
        <Card it={prev} open={()=>{}} fav={false} togFav={()=>{}}/>
      </aside>
    </div>
  </div>;
}

function Messages({convs,setConvs,openId,setOpenId,user}){
  const cid=openId;
  const c=convs.find(x=>x.id===cid)||null;
  const endRef=useRef(null);
  const[fsMsgs,setFsMsgs]=useState([]);
  const myUid=user&&user.uid;
  /* conversation réelle ouverte → écoute les messages en temps réel */
  useEffect(()=>{
    if(!c||!c.fs){setFsMsgs([]);return;}
    const d=fbDb();if(!d)return;
    return d.collection("v2_conversations").doc(c.id).collection("messages").orderBy("at","asc").limit(300).onSnapshot(snap=>{
      const arr=[];snap.forEach(doc=>{const m=doc.data();arr.push([m.from===myUid?"me":"th",m.text]);});setFsMsgs(arr);
    },err=>console.warn("[Cercle] messages indisponibles:",err&&err.code));
  },[c&&c.id,c&&c.fs,myUid]);
  const msgs=c?(c.fs?fsMsgs:(c.msgs||[])):[];
  useEffect(()=>{if(endRef.current)endRef.current.scrollIntoView({behavior:reduced()?"instant":"smooth",block:"end"})},[msgs.length]);
  const send=txt=>{
    if(!txt.trim()||!c)return;
    if(c.fs){
      const d=fbDb();if(!d)return;
      const cref=d.collection("v2_conversations").doc(c.id);
      cref.collection("messages").add({from:myUid,text:txt,at:firebase.firestore.FieldValue.serverTimestamp()}).catch(e=>console.warn("[Cercle] envoi message échoué:",e&&e.code));
      cref.set({last:txt,lastAt:firebase.firestore.FieldValue.serverTimestamp(),lastFrom:myUid},{merge:true}).catch(()=>{});
      return;
    }
    setConvs(cs=>cs.map(x=>x.id===cid?{...x,msgs:[...x.msgs,["me",txt]],last:txt,when:"maintenant"}:x));
    setTimeout(()=>{
      const rep=AUTO_REPLIES[(Math.random()*AUTO_REPLIES.length)|0];
      setConvs(cs=>cs.map(x=>x.id===cid?{...x,msgs:[...x.msgs,["th",rep]],last:rep,when:"maintenant"}:x));
    },1400);
  };
  if(c)return <div className="page">
    <button className="back" onClick={()=>setOpenId(null)}><I.back size={14}/>Conversations</button>
    <h1 style={{fontSize:24,marginTop:6}}>{c.who}{c.fs&&<span style={{fontSize:12,fontWeight:600,color:"var(--green)",marginLeft:8,verticalAlign:"middle"}}>● en direct</span>}</h1>
    <div className="bubs">
      {msgs.length===0&&<p style={{fontSize:13,color:"var(--g)",fontStyle:"italic"}}>Dites bonjour à {c.who} — c'est un voisin, pas un service client.</p>}
      {msgs.map((m,i)=><div key={i} className={"bub "+m[0]}>{m[1]}</div>)}
      <div ref={endRef}/>
    </div>
    <form className="mip" onSubmit={e=>{e.preventDefault();const v=e.target.m.value;e.target.reset();send(v)}}>
      <input name="m" placeholder={"Écrire à "+c.who+"…"} autoComplete="off"/>
      <button className="btn btn-p" style={{borderRadius:999,width:46,height:46,padding:0}} aria-label="Envoyer"><I.send size={16}/></button>
    </form>
  </div>;
  return <div className="page">
    <h1>Courrier du quartier</h1>
    <p className="lead">Vos conversations avec les voisins.</p>
    {convs.length===0&&<div className="empty" style={{padding:"30px 12px"}}><div className="big">Pas encore de message</div>Ouvrez une fiche objet et touchez « Contacter » pour écrire à un voisin.</div>}
    <div className="msg-l">{convs.map(cv=>
      <button key={cv.id} className="conv" onClick={()=>setOpenId(cv.id)}>
        <div className="avat">{(cv.who||"V")[0]}</div>
        <div style={{minWidth:0}}><div className="nm">{cv.who}{cv.fs&&<span style={{fontSize:10,color:"var(--green)",marginLeft:6}}>●</span>}</div><div className="lm">{cv.last}</div></div>
        <span className="when">{cv.when}</span>
      </button>)}
    </div>
  </div>;
}
function Favs({items,open,fav,togFav}){
  const list=items.filter(i=>fav.has(i.id));
  useReveal([list.length]);
  return <div className="page" style={{maxWidth:1180}}>
    <h1>Mes favoris</h1>
    <p className="lead">{list.length?list.length+" objet"+(list.length>1?"s":"")+" sous le coude.":""}</p>
    {list.length===0
      ?<div className="empty"><div className="big">Rien pour l'instant</div>Touchez le cœur d'une annonce pour la garder ici.</div>
      :<div className="grid">{list.map(it=><Card key={it.id} it={it} open={open} fav={true} togFav={togFav}/>)}</div>}
  </div>;
}
function Profile({dark,setDark,toast,go,plus,user,logout,stats={}}){
  const noteStr=stats.note?stats.note.toFixed(1).replace(".",","):"—";
  const g=getGrade(stats.rentals||0);
  return <div className="page">
    <h1>Mon profil</h1>
    <p className="lead">{user.name} — membre vérifié de Cercle.</p>
    <div className="prof-h">
      <div className="avat">{user.photo?<img src={user.photo} alt=""/>:user.name[0].toUpperCase()}</div>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,color:"var(--dk)",fontSize:17,fontFamily:"var(--fd)"}}>{user.name}</div>
        <div style={{fontSize:12.5,color:"var(--g)"}}>{user.email}{user.phone?" · "+user.phone:""} · {user.quartier}</div>
      </div>
      <div className="stamp" style={{position:"static",width:52,height:52,transform:"rotate(-8deg)"}}><span className="ck">✓</span><span>VÉRIFIÉ</span></div>
    </div>
    <div className="prof-stats">
      <div className="pstat"><b>{stats.annonces||0}</b><span>objets proposés</span></div>
      <div className="pstat"><b>{stats.locations||0}</b><span>locations</span></div>
      <div className="pstat"><b style={{color:"var(--sun)"}}>{noteStr}</b><span>note moyenne</span></div>
    </div>
    <div className="plus-line">{plus?"✦ Cercle+ actif — vos frais de service sont réduits de 1 %":"✦ Cercle+ — commission réduite à 10 %, −1 % par année d'ancienneté"}<button className="btn" style={{marginLeft:"auto",background:"var(--plus)",color:"#fff",padding:"8px 14px",minHeight:36,fontSize:12.5}} onClick={()=>go("plus")}>{plus?"Gérer":"Découvrir"}</button></div>
    <div className="hub">
      {[...(isAdminUser(user)?[["admin","Administration","Vue d'ensemble app + site",I.shield]]:[]),
        ["activite","Mon activité","Revenus, réservations, annonces",I.clock],
        ["notifs","Notifications","Ce qui bouge dans le cercle",I.bell],
        ["avis","Mes avis",stats.avisCount?`${noteStr} — ${stats.avisCount} avis reçu${stats.avisCount>1?"s":""}`:"Pas encore d'avis reçu",I.star],
        ["grade","Mon grade",g.nom+" · "+(stats.rentals||0)+" location"+((stats.rentals||0)>1?"s":"")+" · "+g.fee+" %",I.shield],
        ["revenus","Revenus & justificatifs","Relevé annuel, reçus à télécharger",I.clock],
        ["params","Paramètres","Compte & préférences",I.user],
      ].map(([id,t,s,Ic])=><button key={id} onClick={()=>go(id)}><span className="ic"><Ic size={17}/></span><span>{t}<small>{s}</small></span></button>)}
    </div>
    <div className="panel" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,marginTop:14}}>
      <div><div style={{fontWeight:700,color:"var(--dk)"}}>Nuit de quartier</div><div style={{fontSize:12.5,color:"var(--g)"}}>Encre bleue, lampadaires — jamais de noir pur.</div></div>
      <button className="icon-btn" onClick={()=>setDark(!dark)} aria-label="Basculer le mode nuit">{dark?<I.sun size={17}/>:<I.moon size={17}/>}</button>
    </div>
    <button className="btn btn-ghost" style={{width:"100%",marginTop:14,borderColor:"var(--ter)",color:"var(--ter)"}} onClick={logout}>Se déconnecter</button>
  </div>;
}

function StarPick({value,onChange}){
  const[hov,setHov]=useState(0);
  return <div className="star-pick" role="radiogroup" aria-label="Note">
    {[1,2,3,4,5].map(n=><button key={n} type="button" className={(hov||value)>=n?"on":""} aria-label={n+" étoile"+(n>1?"s":"")} aria-checked={value===n} role="radio"
      onMouseEnter={()=>setHov(n)} onMouseLeave={()=>setHov(0)} onClick={()=>onChange(n)}><I.star size={22}/></button>)}
  </div>;
}
function LeaveReview({resa,addReview,done}){
  const[open,setOpen]=useState(false);
  const[note,setNote]=useState(5);
  const[txt,setTxt]=useState("");
  if(done)return <span className="badge sand">Avis laissé ✓</span>;
  if(!open)return <button className="btn btn-ghost" style={{minHeight:34,padding:"7px 12px",fontSize:12}} onClick={()=>setOpen(true)}><I.star size={13}/>Laisser un avis</button>;
  return <div className="rev-form" style={{flexBasis:"100%",order:9}}>
    <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <b style={{fontSize:13,color:"var(--dk)"}}>Votre avis sur « {resa.it.t} »</b>
      <StarPick value={note} onChange={setNote}/>
    </div>
    <textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Comment s'est passée la location ? (objet, échange avec le voisin…)"/>
    <div style={{display:"flex",gap:8,marginTop:10}}>
      <button className="btn btn-ter" style={{minHeight:36,padding:"8px 16px",fontSize:13}} disabled={!txt.trim()}
        onClick={()=>{addReview({itemId:resa.it.id,itemTitle:resa.it.t,owner:resa.it.own,note,txt});setOpen(false);}}>Publier l'avis</button>
      <button className="btn btn-ghost" style={{minHeight:36,padding:"8px 14px",fontSize:13}} onClick={()=>setOpen(false)}>Annuler</button>
    </div>
  </div>;
}
function Activite({toast,resas,requests=[],answerRequest,completeRental,myListings=[],stats={},reviews=[],addReview}){
  const reviewedIds=new Set(reviews.map(r=>r.itemId));
  const pending=requests.filter(r=>r.status==="pending");
  const months=stats.months||[];
  const max=Math.max(1,...months.map(r=>r.v));
  const noteStr=stats.note?stats.note.toFixed(1).replace(".",","):"—";
  return <div className="page">
    <h1>Mon activité</h1>
    <p className="lead">Vos revenus, réservations et annonces — le cercle en un coup d'œil.</p>
    <div className="kpis">
      <div className="kpi"><b>{stats.revenus||0} €</b><span>revenus encaissés</span></div>
      <div className="kpi"><b>{stats.locations||0}</b><span>location{(stats.locations||0)>1?"s":""}</span></div>
      <div className="kpi"><b>{stats.annonces||0}</b><span>annonce{(stats.annonces||0)>1?"s":""} en ligne</span></div>
      <div className="kpi"><b style={{color:"var(--sun)"}}>{noteStr}</b><span>note moyenne{stats.avisCount?` · ${stats.avisCount} avis`:""}</span></div>
    </div>
    <div className="chart">
      <div className="sec-t" style={{fontSize:18}}>Revenus <small>6 derniers mois</small></div>
      {stats.revenus>0
        ?<div className="bars">{months.map(r=><div key={r.key} className={"bar"+(r.cur?" cur":"")} style={{height:(r.v/max*100)+"%"}}><b>{r.v} €</b><i>{r.m}</i></div>)}</div>
        :<div className="empty" style={{padding:"24px 12px"}}><div className="big">Pas encore de revenus</div>Vos gains apparaîtront ici dès votre première location confirmée.</div>}
    </div>
    {pending.length>0&&<>
      <div className="sec-t" style={{fontSize:18,margin:"4px 0 10px"}}>Demandes reçues <small>{pending.length}</small></div>
      <div className="rows" style={{marginBottom:22}}>
        {pending.map(r=><div key={r.id} className="row-card">
          <img src={seed(r.it.img[0],120,120)} alt=""/>
          <div style={{flex:1,minWidth:0}}>
            <div className="ti">{r.it.t}</div>
            <div className="su"><b style={{color:"var(--dk)"}}>{r.renterName}</b> · {r.range} · {r.total} €</div>
            {r.license&&<div className="su" style={{color:"var(--p)"}}>🪪 Permis : {r.license}</div>}
          </div>
          <button className="btn btn-green" style={{minHeight:34,padding:"7px 14px",fontSize:12}} onClick={()=>answerRequest(r,true)}>Accepter</button>
          <button className="btn btn-ghost" style={{minHeight:34,padding:"7px 12px",fontSize:12}} onClick={()=>answerRequest(r,false)}>Décliner</button>
        </div>)}
      </div>
    </>}
    <div className="sec-t" style={{fontSize:18,margin:"4px 0 10px"}}>Réservations</div>
    <div className="rows" style={{marginBottom:22}}>
      {resas.length===0&&<div className="empty" style={{padding:"26px 12px"}}><div className="big">Aucune réservation</div>Réservez un objet près de chez vous depuis l'accueil.</div>}
      {resas.map(r=><div key={r.id} className="row-card">
        <img src={seed(r.it.img[0],120,120)} alt=""/>
        <div style={{flex:1,minWidth:0}}>
          <div className="ti">{r.it.t}</div><div className="su">{r.range} · chez {r.it.own}</div>
          {r.st==="en-cours"&&<div className="prog"><i style={{width:r.prog+"%"}}/></div>}
        </div>
        <span className={"badge "+(r.st==="en-cours"?"green":r.st==="a-venir"?"blue":"sand")}>{r.lbl}</span>
        {r.status==="confirmed"&&completeRental&&<button className="btn btn-ghost" style={{minHeight:34,padding:"7px 12px",fontSize:12}} onClick={()=>completeRental(r)}><I.clock size={13}/>Marquer comme rendu</button>}
        {r.st==="fini"&&addReview&&<LeaveReview resa={r} addReview={addReview} done={reviewedIds.has(r.it.id)}/>}
      </div>)}
    </div>
    <div className="sec-t" style={{fontSize:18,margin:"4px 0 10px"}}>Mes annonces <small>{myListings.length}</small></div>
    <div className="rows">
      {myListings.length===0&&<div className="empty" style={{padding:"26px 12px"}}><div className="big">Aucune annonce</div>Proposez un objet qui dort chez vous depuis le bouton « Proposer ».</div>}
      {myListings.map(it=>{const locs=(stats.perItem&&stats.perItem[it.id])||0;return <div key={it.id} className="row-card">
        <img src={seed(it.img[0],120,120)} alt=""/>
        <div style={{flex:1,minWidth:0}}><div className="ti">{it.t}</div><div className="su">{locs} location{locs>1?"s":""} · {it.p} €/j</div></div>
        <span className="badge green">EN LIGNE</span>
      </div>;})}
    </div>
  </div>;
}

/* ═══════════ NOTIFICATIONS ═══════════ */
function Notifs({notifs,markRead,markAll}){
  const meta={resa:{c:"var(--green)",Ic:I.lock},msg:{c:"var(--p)",Ic:I.msg},avis:{c:"var(--sun)",Ic:I.star},info:{c:"var(--ter)",Ic:I.pin}};
  return <div className="page">
    <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
      <h1>Notifications</h1>
      <button className="back" style={{marginBottom:0}} onClick={markAll}>Tout marquer lu</button>
    </div>
    <p className="lead">Ce qui bouge dans votre cercle.</p>
    {notifs.length===0&&<div className="empty" style={{padding:"34px 12px"}}><div className="big">Rien de neuf</div>Vos réservations, messages et avis apparaîtront ici.</div>}
    <div className="rows">
      {notifs.map(n=>{const m=meta[n.k]||meta.info;const Ic=m.Ic;return(
        <button key={n.id} className={"notif"+(n.unread?" unread":"")} onClick={()=>markRead(n.id)}>
          <span className="nic" style={{background:`color-mix(in srgb,${m.c} 12%,transparent)`,color:m.c}}><Ic size={16}/></span>
          <span style={{flex:1}}>
            <span style={{display:"block",fontSize:13.5,color:"var(--dk)",fontWeight:n.unread?700:500,lineHeight:1.45}}>{n.txt}</span>
            <span style={{fontSize:11.5,color:"var(--gl)"}}>{n.when}</span>
          </span>
          {n.unread&&<span className="dot"/>}
        </button>);})}
    </div>
  </div>;
}

/* ═══════════ MES AVIS ═══════════ */
function Avis({reviews=[],user,myListings=[]}){
  const myIds=new Set(myListings.map(i=>i.id));
  const received=reviews.filter(r=>myIds.has(r.itemId));
  const tot=received.length;
  const avg=tot?received.reduce((s,r)=>s+(r.note||0),0)/tot:0;
  const dist=[5,4,3,2,1].map(n=>received.filter(r=>r.note===n).length);
  const mine=reviews.filter(r=>r.by&&user&&r.by===(user.name||"Vous"));
  return <div className="page">
    <h1>Mes avis</h1>
    <p className="lead">{tot?`${tot} voisin${tot>1?"s ont":" a"} noté vos objets — c'est ça, la réputation de quartier.`:"Vos avis reçus apparaîtront ici dès qu'un voisin notera l'un de vos objets."}</p>
    {tot>0&&<div className="avg">
      <div>
        <div className="n">{avg.toFixed(1).replace(".",",")}</div>
        <div style={{color:"var(--sun)",display:"flex",gap:2,marginTop:8}}>{[...Array(5)].map((_,i)=><I.star key={i} size={15} style={{opacity:i<Math.round(avg)?1:.25}}/>)}</div>
      </div>
      <div className="distb">{dist.map((v,i)=><div key={i} className="l">
        <span style={{width:26}}>{5-i} ★</span>
        <span className="t"><i style={{width:(tot?v/tot*100:0)+"%"}}/></span>
        <span style={{width:20,textAlign:"right"}}>{v}</span>
      </div>)}</div>
    </div>}
    <div className="sec-t" style={{fontSize:18,margin:"6px 0 10px"}}>Avis reçus <small>{tot}</small></div>
    {tot===0
      ?<div className="empty" style={{padding:"26px 12px"}}><div className="big">Aucun avis reçu</div>Proposez des objets et soignez vos locations — les avis viendront.</div>
      :<div className="rows">{received.map(r=><div key={r.id} className="rev">
        <div className="rh">
          <div className="avat" style={{width:34,height:34,fontSize:13}}>{(r.by||"V")[0]}</div>
          <b style={{color:"var(--dk)",fontSize:14}}>{r.by}</b>
          <span className="stars">{[...Array(r.note)].map((_,j)=><I.star key={j} size={11}/>)}</span>
          <span style={{marginLeft:"auto",fontSize:11.5,color:"var(--gl)"}}>{r.when}</span>
        </div>
        <p style={{fontSize:13.5}}>{r.txt}</p>
        <div style={{fontSize:12,color:"var(--gl)",marginTop:4}}>sur « {r.itemTitle} »</div>
      </div>)}</div>}
    <div className="sec-t" style={{fontSize:18,margin:"22px 0 10px"}}>Avis que vous avez laissés <small>{mine.length}</small></div>
    {mine.length===0
      ?<div className="empty" style={{padding:"26px 12px"}}><div className="big">Aucun avis pour l'instant</div>Après une location terminée, laissez un avis depuis <b>Mon activité</b>.</div>
      :<div className="rows">{mine.map(r=><div key={r.id} className="rev">
        <div className="rh">
          <span className="stars">{[...Array(r.note)].map((_,j)=><I.star key={j} size={11}/>)}</span>
          <b style={{color:"var(--dk)",fontSize:14}}>{r.itemTitle}</b>
          <span style={{marginLeft:"auto",fontSize:11.5,color:"var(--gl)"}}>{r.when}</span>
        </div>
        <p style={{fontSize:13.5}}>{r.txt}</p>
        <div style={{fontSize:12,color:"var(--gl)",marginTop:4}}>chez {r.owner}</div>
      </div>)}</div>}
  </div>;
}

/* ═══════════ MON GRADE ═══════════ */
function Grade({plus,rentals=0}){
  const g=getGrade(rentals),next=getNextGrade(rentals),gi=GRADES.indexOf(g);
  const prog=next?Math.round((rentals-g.min)/(next.min-g.min)*100):100;
  const eff=Math.round(feeRate(rentals,plus)*100);
  return <div className="page">
    <h1>Mon grade</h1>
    <p className="lead">Plus vous partagez, moins le cercle vous coûte — la commission descend avec le grade.</p>
    <div className="panel" style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
      <div className="stamp" style={{position:"static",width:76,height:76,fontSize:9.5,transform:"rotate(-8deg)",flexShrink:0}}><span className="ck" style={{fontSize:19}}>✓</span><span>{g.court}</span></div>
      <div style={{flex:1,minWidth:230}}>
        <b style={{fontFamily:"var(--fd)",fontSize:19,color:"var(--dk)"}}>{g.nom} — commission {g.fee} %{plus&&<span style={{color:"var(--plus)"}}> → {eff} % avec ✦</span>}</b>
        <div style={{fontSize:13,color:"var(--g)",margin:"3px 0 10px"}}>{rentals} location{rentals>1?"s":""}{next?` — plus que ${(next.min-rentals).toLocaleString("fr-FR")} avant le grade ${next.nom} (${next.fee} %)`:" — grade maximal atteint"}</div>
        <div className="prog" style={{marginTop:0}}><i style={{width:prog+"%"}}/></div>
      </div>
    </div>
    <div className="tiers">{GRADES.map((t,i)=><div key={t.id} className={"tier"+(i===gi?" cur":i<gi?" done":"")}>
      <div className="tic" style={{color:i<=gi?"var(--green)":"var(--gl)",fontSize:22}}>{t.sym}</div>
      <b>{t.nom}</b>{t.min.toLocaleString("fr-FR")}+ locations
      <span className="fee">{t.fee} %</span>
      <div style={{marginTop:5,fontSize:11,color:i===gi?"var(--green)":"var(--gl)",fontWeight:600,lineHeight:1.35}}>{t.adv}</div>
    </div>)}</div>
    <p style={{fontSize:12.5,color:"var(--g)"}}>Cumulable avec Cercle+ (−1 %, puis −1 % par année complète) — sans jamais descendre sous le plancher de 2 %.</p>
  </div>;
}

/* ═══════════ CERCLE+ ═══════════ */
function Plus({toast,plus,subscribe}){
  const[yrs,setYrs]=useState(1);
  const taux=Math.max(2,11-1-yrs);
  return <div className="page">
    <h1>Cercle<span style={{color:"var(--plus)"}}>+</span></h1>
    <p className="lead">L'abonnement de ceux qui font tourner le quartier.</p>
    <div className="plus-hero">
      <h2>Moins de commission. Chaque année, un peu moins.</h2>
      <p style={{opacity:.88,fontSize:14,maxWidth:"54ch"}}>−1 % de frais de service dès l'abonnement, puis −1 % par année complète d'ancienneté. Cumulable avec votre grade. Plancher : 2 %.</p>
      {/* Offre de lancement alignée sur l'application : −50 % les 3 premiers mois. */}
      <div style={{marginTop:14,display:"inline-block",background:"rgba(255,255,255,.18)",borderRadius:999,padding:"5px 12px",fontSize:12.5,fontWeight:800}}>−50 % les 3 premiers mois</div>
      <div className="pp" style={{marginTop:8}}><s style={{opacity:.6,fontSize:"60%",fontWeight:600}}>11,99 €</s> 5,99 € <small>/mois les 3 premiers mois, puis 11,99 € · sans engagement</small></div>
      <button className="btn" style={{background:"#fff",color:"#5B21B6",marginTop:14}} onClick={subscribe}>{plus?"✓ Vous êtes membre Cercle+":"✦ Rejoindre Cercle+"}</button>
    </div>
    <div className="panel">
      <div className="sec-t" style={{fontSize:18}}>Votre commission dans le temps</div>
      <div className="sim">
        <span style={{fontSize:13,color:"var(--g)"}}>Ancienneté : <b style={{color:"var(--dk)"}}>{yrs} an{yrs>1?"s":""}</b></span>
        <input type="range" min="0" max="5" value={yrs} onChange={e=>setYrs(+e.target.value)} aria-label="Années d'ancienneté"/>
        <span className="out">{taux} %</span>
      </div>
      <p style={{fontSize:12,color:"var(--gl)",marginTop:6}}>Base 11 % − 1 % (abonnement) − 1 % par an — sans jamais descendre sous 2 %.</p>
      <div style={{marginTop:14}}>
        <div className="plus-feat"><span className="pk">✦</span><span><b style={{color:"var(--dk)"}}>−1 % immédiat</b> sur tous vos frais de service</span></div>
        <div className="plus-feat"><span className="pk">✦</span><span><b style={{color:"var(--dk)"}}>−1 % par année complète</b> — la fidélité paye</span></div>
        <div className="plus-feat"><span className="pk">✦</span><span><b style={{color:"var(--dk)"}}>Cumulable avec votre grade</b> (Pilier −1 %, Gardien −2 %)</span></div>
        <div className="plus-feat"><span className="pk">✦</span><span><b style={{color:"var(--dk)"}}>Plancher 2 %</b> — l'assurance et la caution séquestrée restent incluses</span></div>
      </div>
    </div>
  </div>;
}

/* ═══════════ PARAMÈTRES ═══════════ */
function Params({dark,setDark,toast,user,plus,logout,saveQuartier,saveProfile,exportData,deleteAccount,openLegal}){
  const u=user||{name:"Voisin",email:"",quartier:"Metz Sablon",verified:false};
  const[q,setQ]=useState(u.quartier||"");
  const[nm,setNm]=useState(u.name||"");
  const[tel,setTel]=useState(u.phone||"");
  const[ll,setLL]=useState(null);
  const[t1,setT1]=useState(true);
  const[t2,setT2]=useState(false);
  useEffect(()=>{setQ(u.quartier||"")},[u.quartier]);
  useEffect(()=>{setNm(u.name||"")},[u.name]);
  useEffect(()=>{setTel(u.phone||"")},[u.phone]);
  const memberSince=(()=>{try{const fu=fbAuth()&&fbAuth().currentUser;const t=fu&&fu.metadata&&fu.metadata.creationTime;return t?new Date(t).toLocaleDateString("fr-FR",{month:"long",year:"numeric"}):null;}catch(e){return null}})();
  const profileDirty=nm.trim()!==(u.name||"")||tel.trim()!==(u.phone||"");
  const SectionT=({children})=><div style={{fontFamily:"var(--fd)",fontSize:17,color:"var(--dk)",margin:"22px 0 10px"}}>{children}</div>;
  return <div className="page">
    <h1>Paramètres</h1>
    <p className="lead">Votre compte, vos préférences.</p>

    <div className="panel" style={{display:"flex",alignItems:"center",gap:14}}>
      <div className="avat" style={{width:54,height:54,fontSize:21}}>{u.photo?<img src={u.photo} alt=""/>:(u.name||"V")[0].toUpperCase()}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,color:"var(--dk)",fontSize:16}}>{u.name}</div>
        <div style={{fontSize:12.5,color:"var(--g)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
        {memberSince&&<div style={{fontSize:11.5,color:"var(--gl)"}}>Membre depuis {memberSince}</div>}
      </div>
      <span className="badge" style={u.verified?{background:"color-mix(in srgb,var(--green) 14%,transparent)",color:"var(--green)"}:{background:"color-mix(in srgb,var(--ter) 14%,transparent)",color:"var(--ter)"}}>{u.verified?"✓ Vérifié":"Non vérifié"}</span>
    </div>

    <SectionT>Mes informations</SectionT>
    <div className="panel">
      <div className="fg" style={{marginBottom:12}}><label>Nom complet</label>
        <input value={nm} onChange={e=>setNm(e.target.value)} placeholder="Prénom Nom" autoComplete="name"/>
      </div>
      <div className="fg" style={{marginBottom:12}}><label>Téléphone</label>
        <PhoneInput value={tel} onChange={v=>setTel(v)}/>
        <div className="hint">Pour la remise en main propre. Partagé seulement avec un voisin lors d'une location.</div>
      </div>
      <div className="fg" style={{marginBottom:12}}><label>Email</label>
        <input value={u.email} readOnly style={{opacity:.7,cursor:"not-allowed"}}/>
        <div className="hint">L'email de connexion ne se modifie pas ici.</div>
      </div>
      <button className="btn btn-p" disabled={!profileDirty||!nm.trim()} style={{opacity:(!profileDirty||!nm.trim())?.5:1}} onClick={()=>saveProfile({name:nm,phone:tel})}>Enregistrer mes informations</button>
    </div>

    <SectionT>Mon adresse</SectionT>
    <div className="panel">
      <div className="fg" style={{marginBottom:8}}><label>Adresse</label>
        <AddressInput value={q} onChange={(v,coords)=>{setQ(v);if(coords)setLL(coords);}} placeholder="Commencez à taper votre adresse…"/>
        <div className="hint">Centre votre carte et calcule la distance des objets. Jamais affichée aux autres voisins, seulement la distance à pied.</div>
      </div>
      <button className="btn btn-p" disabled={!q.trim()||q.trim()===(u.quartier||"")} style={{opacity:(!q.trim()||q.trim()===(u.quartier||""))?.5:1}} onClick={()=>saveQuartier(q.trim(),ll)}>Enregistrer mon adresse</button>
    </div>

    <SectionT>Préférences</SectionT>
    <div className="panel">
      <div className="set-row"><div><b style={{color:"var(--dk)"}}>Notifications du cercle</b><div style={{fontSize:12.5,color:"var(--g)"}}>Réservations, messages, nouveaux objets à 500 m</div></div><button className={"tgl"+(t1?" on":"")} onClick={()=>setT1(!t1)} aria-label="Notifications"><i/></button></div>
      <div className="set-row"><div><b style={{color:"var(--dk)"}}>Nuit automatique</b><div style={{fontSize:12.5,color:"var(--g)"}}>Suivre le coucher du soleil</div></div><button className={"tgl"+(t2?" on":"")} onClick={()=>setT2(!t2)} aria-label="Nuit automatique"><i/></button></div>
      <div className="set-row"><div><b style={{color:"var(--dk)"}}>Nuit de quartier</b><div style={{fontSize:12.5,color:"var(--g)"}}>Encre bleue, jamais de noir pur</div></div><button className={"tgl"+(dark?" on":"")} onClick={()=>setDark(!dark)} aria-label="Mode nuit"><i/></button></div>
    </div>

    <SectionT>Abonnement</SectionT>
    <div className="plus-line" style={{margin:0}}>{plus?"✦ Cercle+ actif — frais de service réduits":"✦ Cercle+ — réduisez votre commission"}<span style={{marginLeft:"auto",fontSize:12.5,fontWeight:700}}>{plus?"Membre":"Non abonné"}</span></div>

    <SectionT>Mes données</SectionT>
    <div className="panel">
      <div className="set-row"><div><b style={{color:"var(--dk)"}}>Exporter mes données</b><div style={{fontSize:12.5,color:"var(--g)"}}>Profil, annonces, avis, réservations — fichier JSON (RGPD).</div></div>
        <button className="btn btn-ghost" style={{minHeight:38,padding:"8px 14px",fontSize:13,flexShrink:0}} onClick={exportData}>Télécharger</button></div>
      <p style={{fontSize:12,color:"var(--gl)",marginTop:10}}>Vos droits d'accès, de rectification et d'effacement sont détaillés dans la <a style={{color:"var(--p)",cursor:"pointer"}} onClick={()=>openLegal&&openLegal("conf")}>politique de confidentialité</a>.</p>
    </div>

    <SectionT>Compte</SectionT>
    <div className="panel" style={{display:"flex",flexDirection:"column",gap:10}}>
      <button className="btn btn-ghost" onClick={logout}>Se déconnecter</button>
      <div style={{borderTop:"1px dashed var(--bd)",paddingTop:12}}>
        <b style={{color:"var(--ter)",fontSize:14}}>Quitter le cercle</b>
        <p style={{fontSize:12.5,color:"var(--g)",margin:"4px 0 10px"}}>Supprime définitivement votre compte, vos annonces et vos données. Irréversible.</p>
        <button className="btn btn-ghost" style={{borderColor:"var(--ter)",color:"var(--ter)"}} onClick={deleteAccount}>Supprimer mon compte</button>
      </div>
    </div>
  </div>;
}

/* ═══════════ LÉGAL ═══════════ */
function Legal({id}){
  const L=LEGALS[id]||LEGALS.cgu;
  return <div className="page legal">
    <h1>{L.t}</h1>
    <p className="lead">{L.lead||"Version courte, écrite pour être lue."}</p>
    <div className="panel">
      {L.sections
        ?L.sections.map((s,i)=><div key={i}>{s.h&&<h3>{s.h}</h3>}{s.p.map((p,j)=><p key={j}>{p}</p>)}</div>)
        :L.p.map((p,i)=><p key={i}>{p}</p>)}
      {L.maj&&<p style={{fontSize:12,color:"var(--gl)",marginTop:14}}>Dernière mise à jour : {L.maj}</p>}
    </div>
    {L.mail&&<a className="btn btn-ter" href={"mailto:"+L.mail} style={{marginTop:18,display:"inline-flex"}}><I.msg size={14}/>{L.mailLabel||"Nous écrire"} · {L.mail}</a>}
  </div>;
}

/* ═══════════ JUSTIFICATIFS (relevé / reçu imprimable → PDF) ═══════════ */
const escH=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const docDate=ca=>{const t=ca&&ca.seconds?new Date(ca.seconds*1000):new Date();return t.toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"});};
const eurF=n=>(+n||0).toFixed(2).replace(".",",")+" €";
function openDoc(filename,kind,inner){
  const css="@page{margin:12mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}"
   +"body{font-family:'Instrument Sans',system-ui,sans-serif;color:#20242F;background:#F7F3EA;margin:0;padding:30px 22px;line-height:1.55}"
   +".bd{max-width:680px;margin:0 auto;background:#fff;border:2px solid #20242F;border-radius:18px;box-shadow:6px 6px 0 rgba(32,36,47,.13);padding:30px 32px;position:relative;overflow:hidden}"
   +".brand{display:flex;align-items:center;gap:11px;margin-bottom:20px}"
   +".ring{width:30px;height:30px;border:5px solid #2C50C8;border-radius:50%;border-right-color:transparent}"
   +".bn{font-family:'Bricolage Grotesque',Georgia,serif;font-size:23px;font-weight:800;letter-spacing:-.5px}.bn span{color:#DA6740}"
   +".pill{margin-left:auto;background:#DA6740;color:#fff;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:5px 12px;border-radius:20px}"
   +"h1{font-family:'Bricolage Grotesque',Georgia,serif;font-size:23px;line-height:1.15;margin:0 0 4px;letter-spacing:-.4px;max-width:78%}"
   +".sub{color:#6A7078;font-size:13px;margin:0 0 18px}"
   +"table{width:100%;border-collapse:collapse;margin:14px 0;font-size:13.5px}"
   +"th{text-align:left;border-bottom:2px solid #20242F;padding:9px 6px;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:#6A7078}"
   +"td{padding:9px 6px;border-bottom:1px solid #E8E1D2}.r{text-align:right}.c{text-align:center}"
   +".tot{margin-top:18px;font-family:'Bricolage Grotesque',Georgia,serif;font-size:18px;background:#F7F3EA;border:2px solid #20242F;border-radius:12px;box-shadow:4px 4px 0 rgba(32,36,47,.12);padding:14px 18px}.tot b{color:#1F8150}"
   +".kv td:first-child{color:#6A7078;width:42%}"
   +".emet{font-size:12.5px;color:#343A46;background:#F7F3EA;border:1.5px solid #E8E1D2;border-radius:10px;padding:11px 14px;margin-bottom:16px;line-height:1.55}"
   +".note{font-size:11px;color:#A39B89;line-height:1.6;margin-top:22px;border-top:1px solid #E8E1D2;padding-top:12px}"
   +".tampon{position:absolute;top:74px;right:28px;width:74px;height:74px;border:2.5px solid #1F8150;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1F8150;transform:rotate(-9deg);font-size:8px;font-weight:800;letter-spacing:.07em;text-align:center;line-height:1.15;opacity:.92}";
  const fonts="<link rel=preconnect href='https://fonts.googleapis.com'><link rel=preconnect href='https://fonts.gstatic.com' crossorigin><link href='https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Instrument+Sans:wght@400;500;600;700&display=swap' rel=stylesheet>";
  const tampon="<div class=tampon><span style='font-size:17px;line-height:1'>✓</span><span>ÉMIS PAR<br>CERCLE</span></div>";
  const head="<div class=brand><div class=ring></div><div class=bn>cercle<span>.</span></div><div class=pill>"+escH(kind||"Justificatif")+"</div></div>";
  const html="<!doctype html><html lang=fr><head><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>"+escH(filename)+"</title>"+fonts+"<style>"+css+"</style></head><body><div class=bd>"+tampon+head+inner+"</div></body></html>";
  /* impression via iframe cachée (pas de popup bloquée) ; repli téléchargement HTML */
  try{
    const ifr=document.createElement("iframe");
    ifr.setAttribute("aria-hidden","true");
    ifr.style.cssText="position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0";
    document.body.appendChild(ifr);
    const cw=ifr.contentWindow,cd=cw.document;
    cd.open();cd.write(html);cd.close();
    let done=false;
    const go=()=>{if(done)return;done=true;try{cw.focus();cw.print();}catch(e){}
      setTimeout(()=>{try{document.body.removeChild(ifr)}catch(e){}},90000);};
    ifr.onload=()=>setTimeout(go,650);
    setTimeout(go,1400); // sécurité si onload ne se déclenche pas
  }catch(e){
    const blob=new Blob([html],{type:"text/html"});const u=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=u;a.download=filename+".html";document.body.appendChild(a);a.click();
    setTimeout(()=>{try{document.body.removeChild(a);URL.revokeObjectURL(u)}catch(_){}}, 1000);
  }
}

/* ═══════════ ADMINISTRATION ═══════════
   Page de pilotage, réservée aux identifiants listés ci-dessous ET dans les
   règles Firestore. Les deux doivent concorder : cette liste ne fait que
   masquer l'entrée, c'est la règle serveur qui protège réellement les données.
   ⚠ Le second identifiant est le compte de test — à retirer avant la mise en ligne. */
/* Taux de base, aligné sur la page Cercle+. Sert de repli quand une
   réservation ancienne ne porte pas son champ `fee`. */
const COMMISSION = 11;

const ADMIN_UIDS = [
  "owoNOYG8SShhC90Uc7QihbmBAt43",
  "DcBpXP2FmjUkspq3kehissJwk0G3",
];
const isAdminUser = u => !!u && ADMIN_UIDS.indexOf(u.uid || "") >= 0;

const srcOf = d => d.source === "app" ? "app" : "web";   // sans champ = écrit par le site
const dayKey = t => { const d = new Date(t); return d.toISOString().slice(0, 10); };
const tsMs = v => v && v.seconds ? v.seconds * 1000 : (v && v.toMillis ? v.toMillis() : 0);

function Admin({ user }) {
  const [tab, setTab] = useState("vue");
  const [q, setQ] = useState("");
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const d = fbDb();
    if (!d) { setErr("Firestore indisponible."); return; }
    let alive = true;
    Promise.all([
      d.collection("v2_listings").get(),
      d.collection("v2_reservations").get(),
      d.collection("users").get(),
      d.collection("v2_reviews").get(),
    ]).then(([L, R, U, A]) => {
      if (!alive) return;
      setData({
        listings: L.docs.map(x => ({ id: x.id, ...x.data() })),
        resas:    R.docs.map(x => ({ id: x.id, ...x.data() })),
        users:    U.docs.map(x => ({ id: x.id, ...x.data() })),
        reviews:  A.docs.map(x => ({ id: x.id, ...x.data() })),
      });
    }).catch(e => {
      // Une erreur de permission ici veut dire que les règles et la liste
      // ci-dessus ne concordent plus.
      setErr(e && e.code === "permission-denied"
        ? "Accès refusé par les règles Firestore. Vérifiez que votre identifiant y figure."
        : "Lecture impossible : " + (e && e.code || "erreur inconnue"));
    });
    return () => { alive = false; };
  }, []);

  if (!isAdminUser(user)) {
    return <div className="page"><h1>Page réservée</h1>
      <p className="lead">Cet espace est réservé à l'administration de Cercle.</p></div>;
  }
  if (err) return <div className="page"><h1>Administration</h1><p className="lead">{err}</p></div>;
  if (!data) return <div className="page"><h1>Administration</h1><p className="lead">Chargement…</p></div>;

  const since = Date.now() - days * 864e5;
  const ALL = days >= 3650;
  /* Un document sans date n'appartient à aucune période : l'inclure dans
     « 7 derniers jours » rendrait le sélecteur mensonger. On ne le compte donc
     que sur « Tout », et on annonce combien il y en a. */
  const inWindow = arr => arr.filter(x => {
    const t = tsMs(x.createdAt);
    return t ? t >= since : ALL;
  });
  const undatedUsers = data.users.filter(x => !tsMs(x.createdAt)).length;

  const L = inWindow(data.listings), R = inWindow(data.resas);
  const split = arr => {
    const app = arr.filter(x => srcOf(x) === "app").length;
    return { app, web: arr.length - app, total: arr.length };
  };
  const sl = split(L), sr = split(R);
  const volume = R.reduce((s, r) => s + (+r.total || 0), 0);

  /* Ce que Cercle encaisse réellement. On ne compte QUE les réservations
     confirmées : une demande en attente n'a rien rapporté, l'afficher dans le
     chiffre d'affaires serait se mentir. */
  const confirmed = R.filter(r => r.status === "confirmed" || r.status === "completed");
  const revenue = confirmed.reduce((s, r) => s + ((+r.fee) || (+r.total || 0) * COMMISSION / 100), 0);

  // Répartition des états : c'est là qu'on voit si les propriétaires répondent.
  const byStatus = {};
  R.forEach(r => { const k = r.status || "pending"; byStatus[k] = (byStatus[k] || 0) + 1; });
  const pending = byStatus.pending || 0;

  /* Entonnoir : combien de comptes vont jusqu'au bout. Les deux marches qui
     comptent sont « a publié » et « a réservé » — le reste est du trafic. */
  const uidsWithListing = new Set(data.listings.map(x => x.uid).filter(Boolean));
  const uidsWithResa = new Set(data.resas.map(x => x.renterUid).filter(Boolean));
  const funnel = [
    { label: "Comptes créés", n: data.users.length },
    { label: "Ont publié un objet", n: uidsWithListing.size },
    { label: "Ont réservé", n: uidsWithResa.size },
  ];

  // File d'attente de vérification d'identité : une tâche qui t'attend.
  const toVerify = data.users.filter(u => u.verification && u.verification.status === "pending");
  const unverified = data.users.filter(u => !u.verified && !(u.verification && u.verification.status === "approved")).length;

  // Répartition des annonces par catégorie
  const byCat = {};
  data.listings.forEach(x => { const k = x.cat || x.c || "?"; byCat[k] = (byCat[k] || 0) + 1; });
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const catMax = Math.max(1, ...cats.map(c => c[1]));

  // Inscriptions : même découpage que le reste
  const su = split(inWindow(data.users));

  // Versions de l'application en circulation
  const versions = {};
  data.listings.concat(data.resas).forEach(x => {
    if (srcOf(x) === "app") { const v = x.appVersion || "?"; versions[v] = (versions[v] || 0) + 1; }
  });

  // Activité par jour, pour la barre de tendance
  const buckets = [];
  for (let k = days - 1; k >= 0; k--) {
    const key = dayKey(Date.now() - k * 864e5);
    buckets.push({
      key,
      app: L.filter(x => srcOf(x) === "app" && dayKey(tsMs(x.createdAt) || Date.now()) === key).length,
      web: L.filter(x => srcOf(x) === "web" && dayKey(tsMs(x.createdAt) || Date.now()) === key).length,
    });
  }
  const peak = Math.max(1, ...buckets.map(b => b.app + b.web));

  const Bar = ({ s }) => (
    <div className="adm-bar" aria-hidden="true">
      <span style={{ flex: Math.max(s.app, 0.001), background: "var(--p)" }} />
      <span style={{ flex: Math.max(s.web, 0.001), background: "var(--ter)" }} />
    </div>
  );

  const Split = ({ label, s, unit }) => (
    <div className="adm-card">
      <div className="adm-k">{label}</div>
      <div className="adm-v">{s.total}{unit ? " " + unit : ""}</div>
      <Bar s={s} />
      <div className="adm-leg">
        <span><i style={{ background: "var(--p)" }} />Application <b>{s.app}</b></span>
        <span><i style={{ background: "var(--ter)" }} />Site <b>{s.web}</b></span>
      </div>
    </div>
  );

  /* Un tableau de bord sans recherche oblige à faire défiler pour retrouver
     quelqu'un. Le filtre balaie tous les champs texte du document. */
  const match = x => !q.trim() || JSON.stringify(x).toLowerCase().includes(q.trim().toLowerCase());
  const recent = arr => arr.filter(match).slice().sort((a, b) => tsMs(b.createdAt) - tsMs(a.createdAt)).slice(0, 12);
  const fmtDate = v => { const t = tsMs(v); return t ? new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—"; };

  return <div className="page" style={{ maxWidth: 1080 }}>
    <h1>Administration</h1>
    <p className="lead">Ce qui se passe sur Cercle, application et site réunis.</p>

    <div className="radius-chips" role="tablist" aria-label="Période">
      {[[7, "7 jours"], [30, "30 jours"], [90, "90 jours"], [3650, "Tout"]].map(([v, l]) =>
        <button key={v} className={"cat" + (days === v ? " on" : "")} onClick={() => setDays(v)}>{l}</button>)}
    </div>

    <div className="adm-grid">
      <Split label="ANNONCES PUBLIÉES" s={sl} />
      <Split label="RÉSERVATIONS" s={sr} />
      <div className="adm-card">
        <div className="adm-k">VOLUME RÉSERVÉ</div>
        <div className="adm-v">{Math.round(volume)} €</div>
        <div className="adm-sub">Sur {sr.total} réservation{sr.total > 1 ? "s" : ""}</div>
      </div>
      <div className="adm-card">
        <div className="adm-k">INSCRIPTIONS</div>
        <div className="adm-v">{su.total}</div>
        <Bar s={su} />
        <div className="adm-leg">
          <span><i style={{ background: "var(--p)" }} />Application <b>{su.app}</b></span>
          <span><i style={{ background: "var(--ter)" }} />Site <b>{su.web}</b></span>
        </div>
        <div className="adm-sub" style={{ marginTop: 7 }}>
          {data.users.length} compte{data.users.length > 1 ? "s" : ""} au total
          {undatedUsers > 0 && !ALL && <> · {undatedUsers} sans date connue, hors période</>}
          {unverified > 0 && <> · {unverified} identité{unverified > 1 ? "s" : ""} non vérifiée{unverified > 1 ? "s" : ""}</>}
        </div>
      </div>
    </div>

    {/* Ce que Cercle encaisse : le chiffre que personne d'autre ne calcule. */}
    <div className="adm-grid" style={{ marginTop: 12 }}>
      <div className="adm-card adm-hero">
        <div className="adm-k">COMMISSION ENCAISSÉE</div>
        <div className="adm-v" style={{ color: "var(--green)" }}>{Math.round(revenue)} €</div>
        <div className="adm-sub">
          Sur {confirmed.length} réservation{confirmed.length > 1 ? "s" : ""} confirmée{confirmed.length > 1 ? "s" : ""}
          {" · "}{Math.round(volume)} € de volume
        </div>
        <div className="adm-sub" style={{ marginTop: 6, color: "var(--gl)" }}>
          Les demandes en attente ne sont pas comptées : elles n'ont rien rapporté.
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-k">ÉTAT DES RÉSERVATIONS</div>
        {Object.keys(byStatus).length === 0
          ? <div className="adm-sub" style={{ marginTop: 8 }}>Aucune réservation sur la période.</div>
          : Object.entries(byStatus).sort((a, b) => b[1] - a[1]).map(([k, n]) =>
              <div key={k} className="adm-row">
                <span className={"adm-st " + k}>{k}</span><b>{n}</b>
              </div>)}
      </div>

      <div className="adm-card">
        <div className="adm-k">DU COMPTE À LA RÉSERVATION</div>
        {funnel.map((f, i) => {
          const pct = funnel[0].n ? Math.round(f.n / funnel[0].n * 100) : 0;
          return <div key={f.label} style={{ marginTop: i ? 10 : 8 }}>
            <div className="adm-row" style={{ borderBottom: 0, padding: 0 }}>
              <span>{f.label}</span><b>{f.n} · {pct} %</b>
            </div>
            <div className="adm-track"><i style={{ width: pct + "%" }} /></div>
          </div>;
        })}
      </div>
    </div>

    {/* Une file d'attente, donc une action à mener — pas seulement un chiffre. */}
    {toVerify.length > 0 && <div className="panel adm-todo" style={{ marginTop: 14 }}>
      <div className="sec-t" style={{ fontSize: 15 }}>
        {toVerify.length} identité{toVerify.length > 1 ? "s" : ""} en attente de votre validation
      </div>
      {toVerify.slice(0, 8).map(u =>
        <div key={u.id} className="adm-row">
          <span>{u.name || u.email || u.id} · {(u.verification && u.verification.document) || "document"}</span>
          <b style={{ color: "var(--ter)" }}>à vérifier</b>
        </div>)}
      <p style={{ fontSize: 11.5, color: "var(--gl)", marginTop: 10 }}>
        Les pièces sont dans Storage, volontairement illisibles depuis le navigateur.
        La validation se fait en console, le temps qu'un vrai parcours existe.
      </p>
    </div>}

    {cats.length > 0 && <div className="panel" style={{ marginTop: 14 }}>
      <div className="sec-t" style={{ fontSize: 15 }}>Annonces par catégorie</div>
      {cats.map(([k, n]) =>
        <div key={k} style={{ marginTop: 9 }}>
          <div className="adm-row" style={{ borderBottom: 0, padding: 0 }}>
            <span style={{ textTransform: "capitalize" }}>{k}</span><b>{n}</b>
          </div>
          <div className="adm-track"><i style={{ width: (n / catMax * 100) + "%", background: "var(--p)" }} /></div>
        </div>)}
    </div>}

    {sl.total > 0 && <div className="panel" style={{ marginTop: 18 }}>
      <div className="sec-t" style={{ fontSize: 15 }}>Publications par jour</div>
      <div className="adm-spark">
        {buckets.map((b, i) => <span key={i} className="adm-col" title={b.key + " · " + (b.app + b.web)}>
          <i style={{ height: (b.app / peak * 100) + "%", background: "var(--p)" }} />
          <i style={{ height: (b.web / peak * 100) + "%", background: "var(--ter)" }} />
        </span>)}
      </div>
      <div className="adm-axis"><span>il y a {days === 3650 ? "…" : days} j</span><span>aujourd'hui</span></div>
    </div>}

    {Object.keys(versions).length > 0 && <div className="panel" style={{ marginTop: 14 }}>
      <div className="sec-t" style={{ fontSize: 15 }}>Versions de l'application en circulation</div>
      {Object.entries(versions).sort((a, b) => b[1] - a[1]).map(([v, n]) =>
        <div key={v} className="adm-row"><span>Version {v}</span><b>{n} écriture{n > 1 ? "s" : ""}</b></div>)}
    </div>}

    <div className="radius-chips" style={{ marginTop: 22 }} role="tablist">
      {[["vue", "Annonces"], ["resa", "Réservations"], ["gens", "Comptes"], ["avis", "Avis"]].map(([v, l]) =>
        <button key={v} className={"cat" + (tab === v ? " on" : "")} onClick={() => setTab(v)}>{l}</button>)}
    </div>

    <div className="adm-search">
      <input
        type="search"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Rechercher un objet, un nom, un email…"
        aria-label="Rechercher dans le tableau"
      />
      {!!q && <button type="button" onClick={() => setQ("")} aria-label="Effacer">✕</button>}
    </div>

    <div className="panel" style={{ marginTop: 10, overflowX: "auto" }}>
      {tab === "vue" && <table className="adm-t">
        <thead><tr><th>Objet</th><th>Propriétaire</th><th>Prix</th><th>Origine</th><th>Date</th></tr></thead>
        <tbody>{recent(data.listings).map(x =>
          <tr key={x.id}>
            <td>{x.t || "—"}</td><td>{x.own || "—"}</td><td>{x.p || 0} €/j</td>
            <td><span className={"adm-tag " + srcOf(x)}>{srcOf(x) === "app" ? "Application" : "Site"}</span></td>
            <td>{fmtDate(x.createdAt)}</td>
          </tr>)}</tbody>
      </table>}

      {tab === "resa" && <table className="adm-t">
        <thead><tr><th>Objet</th><th>Locataire</th><th>Montant</th><th>État</th><th>Origine</th><th>Date</th></tr></thead>
        <tbody>{recent(data.resas).map(x =>
          <tr key={x.id}>
            <td>{x.itemTitle || "—"}</td><td>{x.renterName || "—"}</td><td>{x.total || 0} €</td>
            <td><span className={"adm-st " + (x.status || "pending")}>{x.status || "pending"}</span></td>
            <td><span className={"adm-tag " + srcOf(x)}>{srcOf(x) === "app" ? "Application" : "Site"}</span></td>
            <td>{fmtDate(x.createdAt)}</td>
          </tr>)}</tbody>
      </table>}

      {tab === "gens" && <table className="adm-t">
        <thead><tr><th>Nom</th><th>Email</th><th>Ville</th><th>Origine</th><th>Objets</th><th>Identité</th></tr></thead>
        <tbody>{data.users.filter(match).slice(0, 60).map(u =>
          <tr key={u.id}>
            <td>{u.name || "—"}</td><td>{u.email || "—"}</td><td>{u.quartier || u.city || "—"}</td>
            <td><span className={"adm-tag " + srcOf(u)}>{srcOf(u) === "app" ? "Application" : "Site"}</span></td>
            <td>{data.listings.filter(x => x.uid === u.id).length}</td>
            <td>{u.verification
              ? <span className={"adm-st " + (u.verification.status === "approved" ? "confirmed" : "pending")}>
                  {u.verification.status}</span>
              : u.verified
                ? <span className="adm-st confirmed">vérifié</span>
                : <span style={{ color: "var(--gl)" }}>non engagée</span>}</td>
          </tr>)}</tbody>
      </table>}

      {tab === "avis" && (data.reviews.length === 0
        ? <p style={{ fontSize: 13, color: "var(--g)" }}>Aucun avis pour l'instant.</p>
        : <table className="adm-t">
            <thead><tr><th>Objet</th><th>Note</th><th>Avis</th><th>Auteur</th><th>Date</th></tr></thead>
            <tbody>{recent(data.reviews).map(r =>
              <tr key={r.id}>
                <td>{r.itemTitle || "—"}</td>
                <td>{"★".repeat(Math.round(+r.note || 0)) || "—"}</td>
                <td style={{ maxWidth: 320 }}>{r.txt || "—"}</td>
                <td>{r.by || "—"}</td><td>{fmtDate(r.createdAt)}</td>
              </tr>)}</tbody>
          </table>)}
    </div>

    <p style={{ fontSize: 12, color: "var(--gl)", marginTop: 14 }}>
      Les documents créés avant le 28 septembre 2026 n'ont pas de champ d'origine :
      ils viennent tous du site, l'application n'écrivait rien avant cette date.
    </p>
  </div>;
}

const ownerGain=r=>+r.base||((+r.total||0)-(+r.fee||0))||0;
function Revenus({user,stats={}}){
  const year=new Date().getFullYear();
  const conf=(stats.confirmed||[]).filter(r=>{const t=r.createdAt&&r.createdAt.seconds?new Date(r.createdAt.seconds*1000):null;return t?t.getFullYear()===year:true;});
  const total=conf.reduce((s,r)=>s+ownerGain(r),0);
  const owner=(user&&user.name)||"Voisin";
  const pro=!!(user&&user.pro),co=(user&&user.company)||owner,siret=(user&&user.siret)||"";
  const emet=pro?"<div class=emet><b>"+escH(co)+"</b>"+(siret?"<br>SIRET "+escH(siret):"")+"<br>Loueur professionnel — émis via Cercle</div>":"";
  const TVA="TVA non applicable, art. 293 B du CGI.";
  const NOTE=pro
    ?"Facture émise par "+escH(co)+(siret?" (SIRET "+escH(siret)+")":"")+" via la plateforme Cercle. "+TVA+" Montant net perçu, hors commission de service Cercle."
    :"Document fourni à titre indicatif pour vous aider à déclarer vos revenus de location entre particuliers. Les montants correspondent aux sommes perçues, hors commission de service prélevée par Cercle. Cercle est un intermédiaire de mise en relation ; l'identité de l'éditeur figure dans les mentions légales.";
  const annual=()=>openDoc((pro?"Recapitulatif-facturation-":"Releve-revenus-Cercle-")+year,pro?"Récap "+year:"Relevé "+year,
    emet+"<h1>"+(pro?"Récapitulatif de facturation "+year:"Relevé annuel de revenus "+year)+"</h1><p class=sub>"+(pro?"Locations facturées via Cercle":"Établi pour <b>"+escH(owner)+"</b> · locations confirmées sur Cercle")+"</p>"
    +"<table><thead><tr><th>Date</th><th>Objet</th><th>Client</th><th class=c>Jours</th><th class=r>Montant "+(pro?"facturé":"perçu")+"</th></tr></thead><tbody>"
    +conf.map(r=>"<tr><td>"+docDate(r.createdAt)+"</td><td>"+escH(r.it.t)+"</td><td>"+escH(r.renterName)+"</td><td class=c>"+(r.days||"–")+"</td><td class=r>"+eurF(ownerGain(r))+"</td></tr>").join("")
    +"</tbody></table><div class=tot>Total "+(pro?"facturé":"perçu")+" en "+year+" : <b>"+eurF(total)+"</b> · "+conf.length+" location"+(conf.length>1?"s":"")+"</div><p class=note>"+NOTE+"</p>");
  const receipt=r=>openDoc((pro?"Facture-Cercle-":"Recu-Cercle-")+r.id.slice(0,6),pro?"Facture":"Reçu",
    emet+"<h1>"+(pro?"Facture":"Reçu de location")+"</h1><p class=sub>"+(pro?"Facture":"Reçu")+" n° "+r.id.slice(0,8).toUpperCase()+" · émis le "+docDate(r.createdAt)+"</p>"
    +"<table class=kv><tbody>"
    +"<tr><td>"+(pro?"Émetteur":"Bénéficiaire")+"</td><td><b>"+escH(co)+"</b></td></tr>"
    +"<tr><td>"+(pro?"Client":"Locataire")+"</td><td>"+escH(r.renterName)+"</td></tr>"
    +"<tr><td>Objet loué</td><td>"+escH(r.it.t)+"</td></tr>"
    +"<tr><td>Période</td><td>"+escH(r.range||"–")+"</td></tr>"
    +"<tr><td>Durée</td><td>"+(r.days||"–")+" jour"+((r.days||0)>1?"s":"")+"</td></tr>"
    +(r.pricePerDay?"<tr><td>Prix par jour</td><td>"+eurF(r.pricePerDay)+"</td></tr>":"")
    +"</tbody></table><div class=tot>"+(pro?"Total à régler":"Montant perçu")+" : <b>"+eurF(ownerGain(r))+"</b></div><p class=note>"+NOTE+"</p>");
  return <div className="page">
    <h1>Revenus &amp; justificatifs</h1>
    <p className="lead">Vos documents pour déclarer vos revenus de location.</p>
    <div className="panel" style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
      <div style={{flex:1,minWidth:180}}>
        <div style={{fontSize:12.5,color:"var(--g)"}}>Total perçu en {year}</div>
        <div style={{fontFamily:"var(--fd)",fontSize:28,color:"var(--dk)"}}>{eurF(total)}</div>
        <div style={{fontSize:12.5,color:"var(--gl)"}}>{conf.length} location{conf.length>1?"s":""} confirmée{conf.length>1?"s":""}</div>
      </div>
      <button className="btn btn-ter" style={{padding:"12px 18px"}} disabled={!conf.length} onClick={annual}>Télécharger le relevé {year}</button>
    </div>
    <div className="sec-t" style={{fontSize:18,margin:"6px 0 10px"}}>Détail des locations</div>
    {conf.length===0
      ?<div className="empty" style={{padding:"26px 12px"}}><div className="big">Aucune location confirmée</div>Vos justificatifs apparaîtront ici dès qu'une location de vos objets sera confirmée.</div>
      :<div className="rows">{conf.map(r=><div key={r.id} className="row-card">
        <img src={seed(r.it.img[0],120,120)} alt=""/>
        <div style={{flex:1,minWidth:0}}><div className="ti">{r.it.t}</div><div className="su">{docDate(r.createdAt)} · {r.renterName} · {eurF(ownerGain(r))}</div></div>
        <button className="btn btn-ghost" style={{minHeight:34,padding:"7px 14px",fontSize:12}} onClick={()=>receipt(r)}>Reçu</button>
      </div>)}</div>}
    <p style={{fontSize:12,color:"var(--gl)",marginTop:14,lineHeight:1.6}}>Les montants correspondent aux sommes perçues (hors commission). Cercle est un intermédiaire ; vous restez responsable de votre déclaration. Voir la <b>politique de confidentialité</b> et les <b>mentions légales</b>.</p>
  </div>;
}

function CookieBanner({onChoice,openLegal}){
  return <div className="ckb" role="dialog" aria-label="Consentement aux cookies">
    <p>Cercle utilise le strict minimum pour fonctionner (connexion, préférences) — <b style={{color:"var(--dk)"}}>aucun traceur publicitaire</b>. <a onClick={()=>openLegal("cookies")}>En savoir plus</a></p>
    <div className="ckb-btns">
      <button className="btn btn-ghost" style={{minHeight:38,padding:"8px 14px",fontSize:13}} onClick={()=>onChoice("refused")}>Refuser</button>
      <button className="btn btn-ter" style={{minHeight:38,padding:"8px 16px",fontSize:13}} onClick={()=>onChoice("accepted")}>Accepter</button>
    </div>
  </div>;
}

/* ═══════════ INSCRIPTION / CONNEXION ═══════════ */
const GIcon=()=><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"/><path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3a7.18 7.18 0 0 1-10.8-3.77H1.27v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.26 14.32a7.2 7.2 0 0 1 0-4.62V6.6H1.27a12 12 0 0 0 0 10.8l3.99-3.08z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.97 11.97 0 0 0 1.27 6.6l3.99 3.1A7.17 7.17 0 0 1 12 4.75z"/></svg>;
const AIcon=()=><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 20.28c-.96.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.88-.18 2.05-.86 3.46-.73 1.7.14 2.97.81 3.81 2.04-3.5 2.1-2.94 6.71.45 8.06-.64 1.67-1.47 2.32-2.8 2.8zM12.03 7.25c-.17-2.5 1.86-4.56 4.19-4.75.32 2.89-2.62 5.04-4.19 4.75z"/></svg>;
function SocialBtns({onDone,toast}){
  if(IS_NATIVE)return null; // en app native, les popups OAuth sont bloquées → email uniquement
  const google=async()=>{
    const a=fbAuth();
    if(!a){onDone({name:"Noah",email:"noah@google.demo",phone:"",quartier:"Metz Sablon",verified:true,phoneVerified:false});return}
    try{const res=await a.signInWithPopup(new firebase.auth.GoogleAuthProvider());onDone(fbUserToUser(res.user));}
    catch(e){if(e.code!=="auth/popup-closed-by-user"&&e.code!=="auth/cancelled-popup-request")toast(fbMsg(e));}
  };
  const apple=()=>{
    const a=fbAuth();
    if(!a){onDone({name:"Noah",email:"noah@apple.demo",phone:"",quartier:"Metz Sablon",verified:true,phoneVerified:false});return}
    toast("Connexion Apple — à activer dans la console Firebase");
  };
  return <div className="social-btns">
    <button type="button" onClick={google}><GIcon/>Continuer avec Google</button>
    <button type="button" onClick={apple}><AIcon/>Continuer avec Apple</button>
  </div>;
}
function CodeInput({onFull,autoFocus}){
  const refs=useRef([]);
  useEffect(()=>{if(autoFocus&&refs.current[0])refs.current[0].focus()},[autoFocus]);
  const collect=()=>{const c=refs.current.map(r=>r&&r.value||"").join("");if(c.length===6)onFull(c)};
  return <div className="codes" onPaste={e=>{
      const v=(e.clipboardData.getData("text")||"").replace(/\D/g,"").slice(0,6);
      if(!v)return;e.preventDefault();
      v.split("").forEach((ch,i)=>{if(refs.current[i])refs.current[i].value=ch});
      if(v.length===6)onFull(v);else if(refs.current[v.length])refs.current[v.length].focus();
    }}>
    {[...Array(6)].map((_,i)=><input key={i} maxLength={1} inputMode="numeric" aria-label={"Chiffre "+(i+1)}
      ref={el=>refs.current[i]=el}
      onChange={e=>{const v=e.target.value.replace(/\D/g,"");e.target.value=v;
        if(v&&i<5)refs.current[i+1].focus();collect();}}
      onKeyDown={e=>{if(e.key==="Backspace"&&!e.target.value&&i>0)refs.current[i-1].focus()}}/>)}
  </div>;
}
/* Champ adresse avec autocomplétion OSM (suggestions pendant la frappe) */
function AddressInput({name,value,onChange,placeholder,required,autoFocus}){
  const[q,setQ]=useState(value!=null?value:"");
  const[sug,setSug]=useState([]);
  const[open,setOpen]=useState(false);
  const[load,setLoad]=useState(false);
  const tRef=useRef(),boxRef=useRef();
  useEffect(()=>{if(value!=null&&value!==q)setQ(value)},[value]);
  const search=v=>{
    clearTimeout(tRef.current);
    if(!v||v.trim().length<3){setSug([]);setOpen(false);return;}
    setLoad(true);
    tRef.current=setTimeout(async()=>{
      try{
        const r=await fetch("https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=fr&q="+encodeURIComponent(v));
        const a=await r.json();setSug(Array.isArray(a)?a.slice(0,5):[]);setOpen(true);
      }catch(e){setSug([]);}
      setLoad(false);
    },450);
  };
  const update=(v)=>{setQ(v);onChange&&onChange(v,null);search(v);};
  const pick=s=>{const label=s.display_name;setQ(label);setSug([]);setOpen(false);onChange&&onChange(label,[+s.lat,+s.lon]);};
  return <div className="addr" ref={boxRef}>
    <input name={name} value={q} required={required} autoFocus={autoFocus} autoComplete="off" placeholder={placeholder}
      onChange={e=>update(e.target.value)} onFocus={()=>{if(sug.length)setOpen(true)}} onBlur={()=>setTimeout(()=>setOpen(false),180)}/>
    {load&&<span className="addr-load">…</span>}
    {open&&sug.length>0&&<div className="addr-sug">
      {sug.map((s,i)=><button type="button" key={i} onMouseDown={e=>e.preventDefault()} onClick={()=>pick(s)}><I.pin size={13}/><span>{s.display_name}</span></button>)}
    </div>}
  </div>;
}
/* Téléphone auto-formaté : 06 12 34 56 78 */
const fmtPhone=v=>String(v||"").replace(/\D/g,"").slice(0,10).replace(/(\d{2})(?=\d)/g,"$1 ").trim();
function PhoneInput({name,value,onChange,placeholder,required}){
  const[p,setP]=useState(fmtPhone(value||""));
  useEffect(()=>{if(value!=null)setP(fmtPhone(value))},[value]);
  return <input name={name} type="tel" inputMode="numeric" value={p} required={required} placeholder={placeholder||"06 12 34 56 78"} autoComplete="tel"
    onChange={e=>{const f=fmtPhone(e.target.value);setP(f);onChange&&onChange(f);}}/>;
}
function Auth({onDone,toast}){
  const FB=!!fbAuth();
  const[mode,setMode]=useState("signup");
  const[prefill,setPrefill]=useState("");
  const[pwVal,setPwVal]=useState("");
  const[acct,setAcct]=useState("particulier");
  const[step,setStep]=useState(0);
  const[form,setForm]=useState({});
  const[code,setCode]=useState("");
  const[phoneSent,setPhoneSent]=useState(false);
  const[phoneOk,setPhoneOk]=useState(false);
  const[busy,setBusy]=useState(false);
  const genCode=()=>String(Math.floor(100000+Math.random()*900000));
  const start=async e=>{e.preventDefault();const f=new FormData(e.target);
    const fn=(f.get("n")||"").trim(),ln=(f.get("ln")||"").trim(),email=f.get("e"),pw=f.get("p"),quartier=(f.get("q")||"").trim(),phone=(f.get("tel")||"").trim();
    const pro=acct==="pro",company=(f.get("co")||"").trim(),siret=(f.get("siret")||"").trim();
    const name=pro&&company?company:(fn+" "+ln).trim();
    if(FB){
      setBusy(true);
      try{
        const res=await fbAuth().createUserWithEmailAndPassword(email,pw);
        try{await res.user.updateProfile({displayName:name})}catch(_){}
        try{const d=fbDb();if(d)await d.collection("users").doc(res.user.uid).set({name,firstName:fn,lastName:ln,email,quartier,phone,accountType:acct,pro,company,siret,source:"web",createdAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true})}catch(_){}
        await sendVerif(res.user,fn||name,email);
        onDone({...fbUserToUser(res.user),name,quartier,phone,pro,company,siret});
      }catch(err){
        console.warn("[Cercle] inscription échouée:",err&&err.code,err&&err.message);
        if(isExistingAccount(err)){setPrefill(email);setStep(0);setMode("login");toast("Vous avez déjà un compte avec cet email — connectez-vous.");}
        else toast(fbMsg(err));
      }
      setBusy(false);
    }else{
      setForm({name,email,phone,quartier:quartier||"Metz Sablon"});setCode(genCode());setStep(1);
    }
  };
  const login=async e=>{e.preventDefault();const f=new FormData(e.target);
    const email=f.get("e"),pw=f.get("p");
    if(FB){
      setBusy(true);
      try{const res=await fbAuth().signInWithEmailAndPassword(email,pw);onDone(fbUserToUser(res.user));}
      catch(err){toast(fbMsg(err))}
      setBusy(false);
    }else{
      onDone({name:(email||"Voisin").split("@")[0],email,phone:"",quartier:"Metz Sablon",verified:true,phoneVerified:false});
    }
  };
  const forgot=async()=>{
    if(FB){const em=prompt("Votre email :");if(em){try{await fbAuth().sendPasswordResetEmail(em);toast("Email de réinitialisation envoyé à "+em)}catch(e){toast(fbMsg(e))}}}
    else toast("Email de réinitialisation envoyé (démo)");
  };
  const resendVerif=async()=>{const u=fbAuth()&&fbAuth().currentUser;if(u){try{await sendVerif(u,u.displayName||"voisin",u.email);toast("Email de vérification renvoyé")}catch(e){toast(fbMsg(e))}}};
  const finishFb=()=>{const u=fbAuth()&&fbAuth().currentUser;onDone(u?fbUserToUser(u):{...form,verified:false,phoneVerified:false});};
  const checkEmail=c=>{if(c!==code){toast("Code incorrect — regardez l'encart jaune");return}setStep(2);};
  const sendSms=e=>{e.preventDefault();const f=new FormData(e.target);
    setForm(o=>({...o,phone:f.get("ph")}));setCode(genCode());setPhoneSent(true);};
  const checkPhone=c=>{if(c!==code){toast("Code incorrect — regardez l'encart jaune");return}setPhoneOk(true);setStep(3);};
  const finish=()=>onDone({...form,verified:true,phoneVerified:phoneOk});
  if(mode==="login")return <div className="page auth-wrap">
    <h1>Bon retour</h1>
    <p className="lead">Le quartier ne vous a pas oublié.</p>
    <div className="panel">
      <SocialBtns onDone={onDone} toast={toast}/>
      {!IS_NATIVE&&<div className="or-sep">OU PAR EMAIL</div>}
      <form onSubmit={login}>
        <div className="fg"><label>Email</label><input name="e" type="email" required autoFocus={!prefill} defaultValue={prefill} placeholder="vous@exemple.fr"/></div>
        <div className="fg"><label>Mot de passe</label><input name="p" type="password" required autoFocus={!!prefill} placeholder="••••••••"/></div>
        <button className="btn btn-p" disabled={busy} style={{width:"100%",padding:13,opacity:busy?.6:1}}>{busy?"Connexion…":"Se connecter"}</button>
      </form>
      <p style={{textAlign:"center",fontSize:13,color:"var(--g)",marginTop:12}}>
        <a style={{color:"var(--g)",cursor:"pointer",textDecoration:"underline"}} onClick={forgot}>Mot de passe oublié ?</a>
        {" · "}Pas de compte ? <a style={{color:"var(--p)",fontWeight:700,cursor:"pointer"}} onClick={()=>{setMode("signup");setStep(0)}}>Rejoindre le cercle</a>
      </p>
    </div>
  </div>;
  return <div className="page auth-wrap">
    <h1>Rejoindre le cercle</h1>
    <p className="lead">Un clic suffit — ou trois petits champs.</p>
    {!FB&&<div className="stepper">
      {["Compte","Email","Téléphone","Bienvenue"].map((l,i)=><React.Fragment key={l}>
        {i>0&&<div className={"sline"+(step>=i?" done":"")}/>}
        <div className={"step"+(step===i?" on":step>i?" done":"")}><span className="sdot">{step>i?"✓":i+1}</span>{l}{i===2&&<span style={{fontSize:8.5,color:"var(--gl)",textTransform:"none",letterSpacing:0}}>optionnel</span>}</div>
      </React.Fragment>)}
    </div>}
    {step===0&&<div className="panel">
      <SocialBtns onDone={onDone} toast={toast}/>
      {!IS_NATIVE&&<div className="or-sep">OU PAR EMAIL</div>}
      <form onSubmit={start}>
        <div className="seg" role="tablist" aria-label="Type de compte">
          <button type="button" className={acct==="particulier"?"on":""} onClick={()=>setAcct("particulier")}>Particulier</button>
          <button type="button" className={acct==="pro"?"on":""} onClick={()=>setAcct("pro")}>Professionnel</button>
        </div>
        <div className="fr">
          <div className="fg"><label>Prénom</label><input name="n" required autoFocus autoComplete="given-name" placeholder="Noah"/></div>
          <div className="fg"><label>Nom</label><input name="ln" required autoComplete="family-name" placeholder="Mouloud"/></div>
        </div>
        {acct==="pro"&&<>
          <div className="fg"><label>Raison sociale</label><input name="co" required autoComplete="organization" placeholder="Ex. Loca Outils SARL"/></div>
          <div className="fg"><label>SIRET</label><input name="siret" required inputMode="numeric" placeholder="14 chiffres"/><div className="hint">Pour émettre de vraies factures à vos clients. Votre annonce affichera un badge « Pro ».</div></div>
        </>}
        <div className="fg"><label>Email</label><input name="e" type="email" required autoComplete="email" placeholder="vous@exemple.fr"/></div>
        <div className="fg"><label>Mot de passe</label><input name="p" type="password" required minLength={6} autoComplete="new-password" placeholder="6 caractères minimum" value={pwVal} onChange={e=>setPwVal(e.target.value)}/><PwMeter value={pwVal}/></div>
        <p className="hint" style={{textAlign:"center"}}>Adresse et téléphone à compléter plus tard, en 30 secondes.</p>
        <button className="btn btn-ter" disabled={busy} style={{width:"100%",padding:13,opacity:busy?.6:1}}>{busy?"Création…":"Créer mon compte"}</button>
        <p style={{fontSize:11.5,color:"var(--gl)",textAlign:"center",marginTop:9,lineHeight:1.5}}>Un email de confirmation vous sera envoyé. <b style={{color:"var(--g)"}}>Vous devrez le valider</b> pour entrer dans le cercle.</p>
        <p style={{textAlign:"center",fontSize:13,color:"var(--g)",marginTop:10}}>Déjà membre ? <a style={{color:"var(--p)",fontWeight:700,cursor:"pointer"}} onClick={()=>setMode("login")}>Se connecter</a></p>
      </form>
    </div>}
    {step===9&&<div className="panel" style={{textAlign:"center",padding:34}}>
      <div className="stamp" style={{position:"static",width:84,height:84,fontSize:9,margin:"0 auto 16px",transform:"rotate(-8deg)"}}><span className="ck" style={{fontSize:22}}>✉</span><span>ENVOYÉ</span></div>
      <h3 style={{fontFamily:"var(--fd)",fontSize:22}}>Compte créé, {form.name} !</h3>
      <p style={{fontSize:13.5,color:"var(--g)",margin:"6px 0 18px"}}>On vous a envoyé un lien de vérification à <b style={{color:"var(--dk)"}}>{form.email}</b>. Cliquez dessus quand vous voulez — vous pouvez déjà explorer le quartier.</p>
      <button className="btn btn-green" style={{width:"100%",padding:13}} onClick={finishFb}>Explorer le quartier</button>
      <p style={{fontSize:12,color:"var(--gl)",marginTop:12}}>Rien reçu ? <a style={{color:"var(--p)",cursor:"pointer"}} onClick={resendVerif}>Renvoyer l'email</a> · pensez aux spams.</p>
    </div>}
    {step===1&&<div className="panel" style={{textAlign:"center"}}>
      <h3 style={{fontFamily:"var(--fd)",fontSize:20,marginBottom:4}}>Vérifions votre email</h3>
      <p style={{fontSize:13.5,color:"var(--g)"}}>Un code à 6 chiffres a été envoyé à <b style={{color:"var(--dk)"}}>{form.email}</b></p>
      <div className="demo-code">Démo — votre code : <b>{code}</b></div>
      <CodeInput autoFocus onFull={checkEmail}/>
      <button className="btn btn-ghost" style={{width:"100%",marginBottom:10}} onClick={()=>checkEmail(code)}>Valider automatiquement (démo)</button>
      <p style={{fontSize:12,color:"var(--gl)"}}>Rien reçu ? <a style={{color:"var(--p)",cursor:"pointer"}} onClick={()=>{setCode(genCode());toast("Nouveau code envoyé")}}>Renvoyer</a> — vous pouvez aussi coller le code d'un coup.</p>
    </div>}
    {step===2&&<div className="panel" style={{textAlign:"center"}}>
      <h3 style={{fontFamily:"var(--fd)",fontSize:20,marginBottom:4}}>Votre téléphone <span style={{fontSize:13,color:"var(--gl)",fontFamily:"var(--f)"}}>(optionnel)</span></h3>
      {!phoneSent&&<>
        <p style={{fontSize:13.5,color:"var(--g)",marginBottom:14}}>Il rassure vos voisins — mais rien ne presse, vous pourrez le faire plus tard.</p>
        <form onSubmit={sendSms}>
          <div className="fg" style={{textAlign:"left"}}><label>Téléphone</label><input name="ph" type="tel" required autoFocus placeholder="06 12 34 56 78"/></div>
          <button className="btn btn-p" style={{width:"100%",padding:12}}>Recevoir le code par SMS</button>
        </form>
        <button className="btn btn-ghost" style={{width:"100%",marginTop:10}} onClick={()=>setStep(3)}>Plus tard — rejoindre le cercle</button>
      </>}
      {phoneSent&&<>
        <p style={{fontSize:13.5,color:"var(--g)"}}>Un SMS a été envoyé au <b style={{color:"var(--dk)"}}>{form.phone}</b></p>
        <div className="demo-code">Démo — votre code : <b>{code}</b></div>
        <CodeInput autoFocus onFull={checkPhone}/>
        <button className="btn btn-ghost" style={{width:"100%",marginBottom:10}} onClick={()=>checkPhone(code)}>Valider automatiquement (démo)</button>
        <button className="btn btn-ghost" style={{width:"100%"}} onClick={()=>setStep(3)}>Plus tard</button>
      </>}
    </div>}
    {step===3&&<div className="panel" style={{textAlign:"center",padding:34}}>
      <div className="stamp" style={{position:"static",width:84,height:84,fontSize:10,margin:"0 auto 16px",transform:"rotate(-8deg)"}}><span className="ck" style={{fontSize:22}}>✓</span><span>VÉRIFIÉ</span></div>
      <h3 style={{fontFamily:"var(--fd)",fontSize:22}}>Bienvenue dans le cercle, {form.name} !</h3>
      <p style={{fontSize:13.5,color:"var(--g)",margin:"6px 0 18px"}}>{phoneOk?"Email et téléphone vérifiés — le tampon est posé.":"Email vérifié — vous pourrez ajouter votre téléphone depuis les paramètres."}</p>
      <button className="btn btn-green" style={{width:"100%",padding:13}} onClick={finish}>Explorer le quartier</button>
    </div>}
  </div>;
}

/* ═══════════ APP ═══════════ */
/* « carte » n'existe plus : les anciens liens #/carte retombent sur l'accueil. */
const ROUTES=["home","admin","favs","messages","profile","create","activite","notifs","avis","grade","plus","params","revenus","legal","detail","auth"];
/* ═══════════ BLOCAGE TANT QUE L'EMAIL N'EST PAS VÉRIFIÉ ═══════════ */
function VerifyGate({user,onRefresh,onResend,onLogout}){
  return <>
    <header className="hdr"><div className="wrap">
      <button className="logo"><Logo/><span className="lt">Cercle</span></button>
    </div></header>
    <div className="page auth-wrap">
      <div className="panel" style={{textAlign:"center",padding:34}}>
        <div className="stamp" style={{position:"static",width:88,height:88,fontSize:9,margin:"0 auto 18px",transform:"rotate(-8deg)"}}><span className="ck" style={{fontSize:24}}>✉</span><span>À VÉRIFIER</span></div>
        <h1 style={{fontSize:26}}>Confirmez votre adresse</h1>
        <p style={{fontSize:14,color:"var(--g)",margin:"8px 0 6px",lineHeight:1.6}}>On a envoyé un email à <b style={{color:"var(--dk)"}}>{user.email}</b>. Cliquez sur le lien <b>Confirmer mon adresse</b> pour entrer dans le cercle.</p>
        <p style={{fontSize:12.5,color:"var(--gl)",marginBottom:20}}>Pensez à regarder dans les spams. Le voisinage, c'est la confiance — on vérifie qui rejoint.</p>
        <button className="btn btn-green" style={{width:"100%",padding:14}} onClick={onRefresh}>J'ai confirmé — entrer</button>
        <div style={{display:"flex",gap:10,marginTop:10}}>
          <button className="btn btn-ghost" style={{flex:1}} onClick={onResend}>Renvoyer l'email</button>
          <button className="btn btn-ghost" style={{flex:1}} onClick={onLogout}>Se déconnecter</button>
        </div>
      </div>
    </div>
  </>;
}

/* Titres d'onglet par page — seul levier de référencement d'une SPA à ancres. */
const PAGE_TITLES={
  home:"Cercle — Tout est à deux rues",
  favs:"Mes favoris — Cercle",
  messages:"Courrier — Cercle",
  profile:"Mon profil — Cercle",
  create:"Proposer un objet — Cercle",
  activite:"Mon activité — Cercle",
  notifs:"Notifications — Cercle",
  avis:"Mes avis — Cercle",
  grade:"Mon grade — Cercle",
  plus:"Cercle+ — moins de commission",
  params:"Paramètres — Cercle",
  revenus:"Revenus & justificatifs — Cercle",
  legal:"Textes légaux — Cercle",
  auth:"Connexion — Cercle",
};

function App(){
  const P=useMemo(loadLS,[]);
  const[page,setPage]=useState("home");
  const[sel,setSel]=useState(null);
  const[cat,setCat]=useState("all");
  const[q,setQ]=useState("");
  const[fav,setFav]=useState(()=>new Set(P.fav||[]));
  const[dark,setDark]=useState(P.dark||false);
  const[toastMsg,setToastMsg]=useState(null);
  const[legal,setLegal]=useState("cgu");
  const[cookie,setCookie]=useState(()=>{try{return localStorage.getItem("cercle_cookie")||""}catch(e){return ""}});
  const[nudgeHide,setNudgeHide]=useState(false);
  const[notifs,setNotifs]=useState(P.notifs||[]);
  const[readNotifs,setReadNotifs]=useState(()=>new Set(P.readNotifs||[])); // ids de notifs réelles déjà lues
  const[myItems,setMyItems]=useState(P.myItems||[]);
  const[resas,setResas]=useState(P.resas||[]);
  const[reviews,setReviews]=useState(P.reviews||[]);
  const[convs,setConvs]=useState(P.convs||[]);
  const[plus,setPlus]=useState(P.plus||false);
  const[user,setUser]=useState(fbAuth()?null:(P.user||null));
  const[openConv,setOpenConv]=useState(null);
  const[fbItems,setFbItems]=useState([]);
  const[fbReviews,setFbReviews]=useState([]);
  const[fbResas,setFbResas]=useState([]);      // mes réservations (côté locataire)
  const[fbRequests,setFbRequests]=useState([]); // demandes reçues (côté propriétaire)
  const[fbConvs,setFbConvs]=useState([]);       // conversations réelles (Firestore)
  const items=useMemo(()=>fbDb()?[...fbItems,...myItems,...ITEMS]:[...myItems,...ITEMS],[fbItems,myItems]);
  /* avis : ceux du serveur (cross-utilisateurs) + ceux écrits localement, dédupliqués */
  const allReviews=useMemo(()=>{const seen=new Set(),out=[];for(const r of [...fbReviews,...reviews]){if(r&&!seen.has(r.id)){seen.add(r.id);out.push(r);}}return out;},[fbReviews,reviews]);
  /* réservations affichées au locataire : celles du serveur (réelles) + les démos locales */
  const allResas=useMemo(()=>[...fbResas,...resas],[fbResas,resas]);
  /* conversations affichées : réelles (Firestore) + démos locales */
  const allConvs=useMemo(()=>[...fbConvs,...convs],[fbConvs,convs]);
  /* mes annonces réelles (publiées par moi) */
  const myListings=useMemo(()=>{const uid=user&&user.uid;return uid?items.filter(i=>i.uid===uid):[];},[items,user&&user.uid]);
  /* statistiques réelles dérivées des données live */
  const stats=useMemo(()=>{
    const confirmed=fbRequests.filter(r=>r.status==="confirmed"||r.status==="completed");
    const gain=r=>(+r.base||((+r.total||0)-(+r.fee||0))||0); // montant perçu par le propriétaire
    const revenus=Math.round(confirmed.reduce((s,r)=>s+gain(r),0));
    const myIds=new Set(myListings.map(i=>i.id));
    const recv=allReviews.filter(r=>myIds.has(r.itemId));
    const note=recv.length?recv.reduce((s,r)=>s+(r.note||0),0)/recv.length:0;
    const now=new Date(),months=[];
    for(let k=5;k>=0;k--){const dt=new Date(now.getFullYear(),now.getMonth()-k,1);months.push({key:dt.getFullYear()+"-"+dt.getMonth(),m:dt.toLocaleDateString("fr-FR",{month:"short"}).replace(".",""),v:0});}
    confirmed.forEach(r=>{const t=r.createdAt&&r.createdAt.seconds?new Date(r.createdAt.seconds*1000):null;if(!t)return;const key=t.getFullYear()+"-"+t.getMonth();const b=months.find(x=>x.key===key);if(b)b.v+=gain(r);});
    months.forEach(m=>m.v=Math.round(m.v));
    if(months.length)months[months.length-1].cur=true;
    const perItem={};confirmed.forEach(r=>{perItem[r.it.id]=(perItem[r.it.id]||0)+1;});
    return {revenus,locations:confirmed.length,annonces:myListings.length,avisCount:recv.length,note,months,rentals:confirmed.length,perItem,confirmed};
  },[fbRequests,myListings,allReviews]);
  const itemsRef=useRef(items);useEffect(()=>{itemsRef.current=items},[items]);

  /* persistance */
  useEffect(()=>{saveLS({fav:[...fav],dark,notifs,readNotifs:[...readNotifs],myItems,resas,reviews,convs,plus,user})},[fav,dark,notifs,readNotifs,myItems,resas,reviews,convs,plus,user]);
  useEffect(()=>{document.documentElement.classList.toggle("dark",dark)},[dark]);
  /* Firebase : restauration de session */
  useEffect(()=>{
    const a=fbAuth();if(!a)return;
    return a.onAuthStateChanged(fu=>{ if(fu)setUser(u=>u||fbUserToUser(fu)); else setUser(null); });
  },[]);
  /* Firebase : récupère les infos du membre (adresse, téléphone) depuis Firestore */
  useEffect(()=>{
    const d=fbDb();if(!d||!user||!user.uid)return;
    d.collection("users").doc(user.uid).get().then(doc=>{
      if(!doc.exists)return;const x=doc.data();
      setUser(u=>{if(!u||u.uid!==user.uid)return u;const n={...u};if(x.quartier)n.quartier=x.quartier;if(x.phone&&!u.phone)n.phone=x.phone;if(isFinite(+x.lat)&&isFinite(+x.lon)){n.lat=+x.lat;n.lon=+x.lon;}if(x.pro!==undefined)n.pro=!!x.pro;if(x.company)n.company=x.company;if(x.siret)n.siret=x.siret;return n;});
    }).catch(()=>{});
  },[user&&user.uid]);
  /* met à jour l'adresse (paramètres) — stocke aussi les coords si fournies (carte instantanée) */
  const saveQuartier=async(q,ll)=>{
    const valid=ll&&isFinite(+ll[0])&&isFinite(+ll[1]);
    setUser(u=>u?{...u,quartier:q,...(valid?{lat:+ll[0],lon:+ll[1]}:{})}:u);
    const d=fbDb();if(d&&user&&user.uid){try{await d.collection("users").doc(user.uid).set(valid?{quartier:q,lat:+ll[0],lon:+ll[1]}:{quartier:q},{merge:true})}catch(_){}}
    toast("Adresse mise à jour");
  };
  /* met à jour nom + téléphone (paramètres) */
  const saveProfile=async({name,phone})=>{
    name=(name||"").trim();phone=(phone||"").trim();
    setUser(u=>u?{...u,name:name||u.name,phone}:u);
    const a=fbAuth(),fu=a&&a.currentUser;
    if(fu&&name){try{await fu.updateProfile({displayName:name})}catch(_){}}
    const d=fbDb();if(d&&user&&user.uid){try{await d.collection("users").doc(user.uid).set({name:name||user.name,phone},{merge:true})}catch(_){}}
    toast("Profil mis à jour");
  };
  /* recharge l'état de vérification email */
  const refreshVerif=async()=>{
    const a=fbAuth();const fu=a&&a.currentUser;if(!fu)return;
    try{await fu.reload()}catch(_){}
    if(fu.emailVerified){setUser(u=>u?{...u,verified:true}:u);toast("Adresse confirmée — bienvenue !");}
    else toast("Pas encore confirmée — cliquez le lien reçu par email");
  };
  /* Firebase : annonces partagées (Firestore) */
  useEffect(()=>{
    const d=fbDb();if(!d)return;
    try{
      return d.collection("v2_listings").orderBy("createdAt","desc").limit(40).onSnapshot(snap=>{
        const arr=[];snap.forEach(doc=>{const x=doc.data();const sd=x.seed||"voisin1";
          const img=(x.imgs&&x.imgs.length)?x.imgs:imgsFromSeed(sd);
          arr.push({id:doc.id,t:x.t,c:x.c,p:x.p,d:x.d,img,own:x.own||"Voisin",city:x.city||"rue du Sablon",note:(x.note==null?0:x.note),rev:x.rev||0,cau:x.cau||0,uid:x.uid||"",booked:x.booked||[],needsLicense:!!x.needsLicense,ownerPro:!!x.ownerPro,ownerCompany:x.ownerCompany||""});});
        setFbItems(arr);
      },err=>console.warn("[Cercle] Firestore lecture indisponible:",err&&err.code));
    }catch(e){console.warn("[Cercle] Firestore off:",e&&e.code)}
  },[]);
  /* Firebase : avis partagés (Firestore) — repli silencieux si règles absentes */
  useEffect(()=>{
    const d=fbDb();if(!d)return;
    try{
      return d.collection("v2_reviews").orderBy("createdAt","desc").limit(60).onSnapshot(snap=>{
        const arr=[];snap.forEach(doc=>{const x=doc.data();
          arr.push({id:doc.id,itemId:x.itemId,itemTitle:x.itemTitle,owner:x.owner,note:x.note||5,txt:x.txt||"",by:x.by||"Voisin",when:x.when||"récemment"});});
        setFbReviews(arr);
      },err=>console.warn("[Cercle] avis Firestore indisponibles:",err&&err.code));
    }catch(e){console.warn("[Cercle] avis off:",e&&e.code)}
  },[]);
  /* mapping doc réservation → objet d'affichage */
  const resaView=(id,x)=>{const st=x.status==="completed"?"fini":x.status==="declined"?"refus":"a-venir";
    const lbl=x.status==="confirmed"?"✓ Confirmée":x.status==="declined"?"Refusée":x.status==="completed"?"Terminée":"⏳ En attente";
    const total=+x.total||0,fee=+x.fee||0,base=+x.base||(total-fee)||total;
    return {id,fs:true,status:x.status,it:{id:x.itemId,t:x.itemTitle,img:imgsFromSeed(x.itemSeed||"voisin1"),own:x.ownerName||"Voisin"},
      range:x.range||"",total,base,fee,pricePerDay:+x.pricePerDay||0,days:x.days||0,startDate:x.startDate||"",endDate:x.endDate||"",license:x.license||"",createdAt:x.createdAt,renterName:x.renterName||"Voisin",renterUid:x.renterUid,st,lbl};};
  /* Firebase : mes réservations (côté locataire) */
  useEffect(()=>{
    const d=fbDb();if(!d||!user||!user.uid)return;
    try{
      return d.collection("v2_reservations").where("renterUid","==",user.uid).onSnapshot(snap=>{
        const arr=[];snap.forEach(doc=>arr.push(resaView(doc.id,doc.data())));
        arr.sort((a,b)=>(b.id>a.id?1:-1));setFbResas(arr);
      },err=>console.warn("[Cercle] réservations indisponibles:",err&&err.code));
    }catch(e){console.warn("[Cercle] réservations off:",e&&e.code)}
  },[user&&user.uid]);
  /* Firebase : demandes reçues (côté propriétaire) */
  useEffect(()=>{
    const d=fbDb();if(!d||!user||!user.uid)return;
    try{
      return d.collection("v2_reservations").where("ownerUid","==",user.uid).onSnapshot(snap=>{
        const arr=[];snap.forEach(doc=>arr.push(resaView(doc.id,doc.data())));
        arr.sort((a,b)=>(b.id>a.id?1:-1));setFbRequests(arr);
      },err=>console.warn("[Cercle] demandes indisponibles:",err&&err.code));
    }catch(e){console.warn("[Cercle] demandes off:",e&&e.code)}
  },[user&&user.uid]);
  /* Firebase : conversations réelles (où je suis membre) */
  useEffect(()=>{
    const d=fbDb();if(!d||!user||!user.uid)return;
    try{
      return d.collection("v2_conversations").where("members","array-contains",user.uid).onSnapshot(snap=>{
        const arr=[];snap.forEach(doc=>{const x=doc.data();const other=(x.members||[]).find(u=>u!==user.uid)||"";
          arr.push({id:doc.id,fs:true,who:(x.names&&x.names[other])||"Voisin",otherUid:other,last:x.last||"Nouvelle conversation",when:"",lastAt:x.lastAt,lastFrom:x.lastFrom||""});});
        arr.sort((a,b)=>((b.lastAt&&b.lastAt.seconds||0)-(a.lastAt&&a.lastAt.seconds||0)));setFbConvs(arr);
      },err=>console.warn("[Cercle] conversations indisponibles:",err&&err.code));
    }catch(e){console.warn("[Cercle] conversations off:",e&&e.code)}
  },[user&&user.uid]);

  /* actions */
  const toast=m=>{setToastMsg(m);setTimeout(()=>setToastMsg(null),2600)};
  const togFav=id=>setFav(f=>{const n=new Set(f);n.has(id)?n.delete(id):n.add(id);return n});
  const open=it=>{setSel(it);setPage("detail")};
  const goHome=()=>{setPage("home");setSel(null)};
  const addNotif=n=>setNotifs(ns=>[{id:Date.now(),when:"à l'instant",unread:true,...n},...ns]);
  /* notifications RÉELLES dérivées des données live (aucune collection/règle en plus) */
  const realNotifs=useMemo(()=>{
    const out=[];const uid=user&&user.uid;
    fbRequests.forEach(r=>{if(r.status==="pending")out.push({id:"req-"+r.id,k:"resa",txt:`${r.renterName} souhaite réserver « ${r.it.t} » (${r.total} €).`,when:"récemment"});});
    fbResas.forEach(r=>{if(r.status==="confirmed")out.push({id:"resa-"+r.id+"-c",k:"resa",txt:`Votre réservation de « ${r.it.t} » est confirmée ✓`,when:"récemment"});
      else if(r.status==="declined")out.push({id:"resa-"+r.id+"-d",k:"info",txt:`Votre demande pour « ${r.it.t} » a été déclinée.`,when:"récemment"});});
    fbConvs.forEach(c=>{if(c.lastFrom&&c.lastFrom!==uid)out.push({id:"msg-"+c.id+"-"+((c.lastAt&&c.lastAt.seconds)||0),k:"msg",txt:`Nouveau message de ${c.who} : « ${c.last} »`,when:"récemment"});});
    return out.map(n=>({...n,unread:!readNotifs.has(n.id),real:true}));
  },[fbRequests,fbResas,fbConvs,readNotifs,user&&user.uid]);
  const allNotifs=useMemo(()=>[...realNotifs,...notifs],[realNotifs,notifs]);
  const markRead=id=>{setReadNotifs(s=>{const n=new Set(s);n.add(id);return n});setNotifs(ns=>ns.map(n=>n.id===id?{...n,unread:false}:n));};
  const markAll=()=>{setReadNotifs(s=>{const n=new Set(s);realNotifs.forEach(r=>n.add(r.id));return n});setNotifs(ns=>ns.map(n=>({...n,unread:false})));};
  const openLegal=id=>{setLegal(id);setPage("legal")};
  const chooseCookie=v=>{try{localStorage.setItem("cercle_cookie",v)}catch(e){}setCookie(v);};
  const unread=allNotifs.filter(n=>n.unread).length;
  const addItem=async({t,c,p,d,imgs,img,cau,needsLicense})=>{
    const nl=!!needsLicense;const isPro=!!(user&&user.pro);const ownerCo=(user&&user.company)||"";
    const arr=(imgs&&imgs.length?imgs:[img||("voisin"+(Date.now()%9973))]).slice(0,4);
    const sd=arr[0];
    const dd=d||"Proposé par un voisin du Sablon, avec soin.";
    const cc=Math.min(CAUTION_MAX,Math.max(0,+cau||0));
    const db=fbDb();
    if(db&&user){
      try{
        await db.collection("v2_listings").add({t,c,p,d:dd,seed:sd,imgs:arr,cau:cc,needsLicense:nl,ownerPro:isPro,ownerCompany:ownerCo,own:user.name||"Voisin",uid:user.uid||"",city:"rue du Sablon",note:0,rev:0,source:"web",createdAt:firebase.firestore.FieldValue.serverTimestamp()});
        addNotif({k:"info",txt:`Votre annonce « ${t} » est en ligne dans le cercle.`});
        return;
      }catch(e){console.warn("[Cercle] écriture Firestore échouée, repli local:",e&&e.code);}
    }
    const it={id:"u"+Date.now(),t,c,p,img:arr,own:"Vous",city:"rue du Sablon",note:0,rev:0,d:dd,cau:cc,uid:user&&user.uid||"",needsLicense:nl,ownerPro:isPro,ownerCompany:ownerCo};
    setMyItems(m=>[it,...m]);
    addNotif({k:"info",txt:`Votre annonce « ${t} » est en ligne dans le cercle.`});
  };
  const reserve=(it,days,tot,base,fee,range,startDate,endDate,license)=>{
    range=range||`${days} jour${days>1?"s":""}`;
    base=+base||+it.p*days||0;fee=+fee||0;tot=+tot||base+fee;
    const db=fbDb();
    if(db&&user){
      db.collection("v2_reservations").add({itemId:it.id,itemTitle:it.t,itemSeed:it.img&&it.img[0]||"voisin1",
        ownerName:it.own||"Voisin",ownerUid:it.uid||"",renterUid:user.uid||"",renterName:user.name||"Voisin",
        days,pricePerDay:+it.p||0,base,fee,total:tot,range,startDate:startDate||"",endDate:endDate||"",license:license||"",status:"pending",source:"web",createdAt:firebase.firestore.FieldValue.serverTimestamp()})
        .catch(e=>{console.warn("[Cercle] réservation Firestore échouée, repli local:",e&&e.code);
          setResas(rs=>[{id:Date.now(),it,range,st:"a-venir",lbl:"⏳ En attente"},...rs]);});
    }else{
      setResas(rs=>[{id:Date.now(),it,range,st:"a-venir",lbl:"⏳ En attente"},...rs]);
    }
    addNotif({k:"resa",txt:`Demande envoyée à ${it.own} pour « ${it.t} » (${tot} €) — débit à sa confirmation.`});
    toast("Demande envoyée à "+it.own+" — suivez-la dans Mon activité");
  };
  /* propriétaire : répondre à une demande reçue */
  const answerRequest=(r,accept)=>{
    const d=fbDb();if(!d)return;
    const id=r&&r.id?r.id:r; // tolère un id brut
    d.collection("v2_reservations").doc(id).update({status:accept?"confirmed":"declined"})
      .then(()=>{
        addNotif({k:"resa",txt:accept?"Vous avez accepté une demande de réservation.":"Vous avez décliné une demande."});
        toast(accept?"Réservation confirmée ✓":"Demande déclinée");
        /* bloque la période sur l'annonce (lisible par tous) */
        if(accept&&r&&r.it&&r.it.id&&r.startDate&&r.endDate){
          d.collection("v2_listings").doc(r.it.id).update({booked:firebase.firestore.FieldValue.arrayUnion({start:r.startDate,end:r.endDate})}).catch(()=>{});
        }
      })
      .catch(e=>{console.warn("[Cercle] réponse demande échouée:",e&&e.code);toast("Action impossible — réessayez");});
  };
  /* locataire : marquer la location comme rendue (→ débloque l'avis) */
  const completeRental=r=>{
    if(r&&r.fs){
      const d=fbDb();if(!d)return;
      d.collection("v2_reservations").doc(r.id).update({status:"completed"})
        .then(()=>{addNotif({k:"resa",txt:`Location de « ${r.it.t} » terminée — vous pouvez laisser un avis.`});toast("Location terminée ✓");})
        .catch(e=>{console.warn("[Cercle] clôture location échouée:",e&&e.code);toast("Action impossible — réessayez");});
    }else if(r){
      setResas(rs=>rs.map(x=>x.id===r.id?{...x,st:"fini",lbl:"Terminée"}:x));
      addNotif({k:"resa",txt:`Location de « ${r.it.t} » terminée — vous pouvez laisser un avis.`});toast("Location terminée ✓");
    }
  };
  const addReview=({itemId,itemTitle,owner,note,txt})=>{
    const rv={id:"r"+Date.now(),itemId,itemTitle,owner,note,txt:txt.trim(),by:(user&&user.name)||"Vous",when:"juin 2026"};
    setReviews(rs=>[rv,...rs]);
    addNotif({k:"avis",txt:`Vous avez laissé un avis ${"★".repeat(note)} sur « ${itemTitle} ».`});
    toast("Merci pour votre avis !");
    /* écriture Firestore best-effort (active dès que les règles v2_reviews existent) */
    const db=fbDb();
    if(db&&user)db.collection("v2_reviews").add({itemId,itemTitle,owner,note,txt:rv.txt,by:rv.by,when:rv.when,uid:user.uid||"",createdAt:firebase.firestore.FieldValue.serverTimestamp()}).catch(()=>{});
  };
  /* openChat accepte un nom (démo) ou un objet annonce (avec uid → vraie conversation Firestore) */
  const openChat=arg=>{
    const d=fbDb();
    const ownerUid=arg&&typeof arg==="object"?(arg.uid||""):"";
    const ownerName=arg&&typeof arg==="object"?(arg.own||"Voisin"):arg;
    /* vraie conversation entre deux membres réels */
    if(d&&user&&user.uid&&ownerUid&&ownerUid!==user.uid){
      const members=[user.uid,ownerUid].sort();const cid=members.join("_");
      d.collection("v2_conversations").doc(cid).set({members,names:{[user.uid]:user.name||"Voisin",[ownerUid]:ownerName},
        last:"Nouvelle conversation",lastAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true})
        .catch(e=>console.warn("[Cercle] ouverture conversation échouée:",e&&e.code));
      setOpenConv(cid);setPage("messages");return;
    }
    /* repli local : propriétaire de démo (sans compte) ou Firestore indisponible */
    const target=ownerName==="Vous"?"Léa":ownerName;
    let cv=convs.find(c=>c.who===target);
    if(!cv){cv={id:"c"+Date.now(),who:target,last:"Nouvelle conversation",when:"maintenant",msgs:[]};setConvs(cs=>[cv,...cs]);}
    setOpenConv(cv.id);setPage("messages");
  };
  const subscribe=()=>{
    if(plus){toast("Vous êtes déjà membre Cercle+ ✦");return}
    setPlus(true);
    addNotif({k:"info",txt:"Bienvenue dans Cercle+ ✦ — vos frais de service passent à 10 %."});
    toast("Abonnement Cercle+ activé ✦");
  };
  const go=p=>{if(p!=="messages")setOpenConv(null);setPage(p)};
  const onAuth=u=>{setUser(u);addNotif({k:"info",txt:`Bienvenue dans le cercle, ${u.name} — profil vérifié ✓`});toast("Bienvenue, "+u.name+" !");go("home")};
  const logout=()=>{const a=fbAuth();if(a)try{a.signOut()}catch(e){}setUser(null);toast("À bientôt dans le quartier");go("home")};
  /* RGPD : export de mes données (téléchargement JSON) */
  const exportData=()=>{
    const data={exportéLe:new Date().toISOString(),profil:user||null,
      mesAnnonces:myListings,mesAvis:allReviews.filter(r=>user&&r.by===user.name),
      mesReservations:fbResas,mesDemandesRecues:fbRequests};
    try{
      const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob);const a=document.createElement("a");
      a.href=url;a.download="mes-donnees-cercle.json";a.click();URL.revokeObjectURL(url);
      toast("Vos données ont été téléchargées");
    }catch(e){toast("Export impossible — réessayez")}
  };
  /* RGPD : suppression réelle du compte (Auth + Firestore) */
  const deleteAccount=async()=>{
    if(!window.confirm("Supprimer définitivement votre compte, vos annonces et vos données ? Cette action est irréversible."))return;
    const a=fbAuth(),d=fbDb(),fu=a&&a.currentUser;
    if(!fu){setUser(null);toast("Compte supprimé");go("home");return;}
    try{
      if(d&&user&&user.uid){
        for(const it of myListings){if(it.id&&!/^u\d/.test(it.id)){try{await d.collection("v2_listings").doc(it.id).delete()}catch(_){}}}
        try{await d.collection("users").doc(user.uid).delete()}catch(_){}
      }
      await fu.delete();
      setUser(null);toast("Votre compte a été supprimé — à bientôt, peut-être.");go("home");
    }catch(e){
      if(e&&e.code==="auth/requires-recent-login"){toast("Pour des raisons de sécurité, reconnectez-vous puis réessayez.");logout();}
      else toast(fbMsg(e));
    }
  };
  const need=fn=>(...a)=>{if(!user){toast("Rejoignez le cercle pour continuer");go("auth");return}return fn(...a)};

  /* filtre grille */
  const filtered=useMemo(()=>items.filter(i=>(cat==="all"||i.c===cat)&&(!q||i.t.toLowerCase().includes(q.toLowerCase()))),[items,cat,q]);
  useReveal([page,cat,q]);
  useEffect(()=>{if(page!=="detail")window.scrollTo({top:0,behavior:"instant"})},[page]);

  /* titre d'onglet suivant la page — la fiche annonce prend le nom de l'objet */
  useEffect(()=>{
    document.title=page==="detail"&&sel?`${sel.t} — Cercle`:(PAGE_TITLES[page]||PAGE_TITLES.home);
  },[page,sel]);

  /* routing navigateur (hash + back/forward) */
  const popRef=useRef(false);
  useEffect(()=>{
    const h=(location.hash.slice(2)||"").split("/");
    if(h[0]==="detail"&&h[1]){const it=itemsRef.current.find(i=>i.id===h[1]);if(it){setSel(it);setPage("detail");return}}
    if(ROUTES.includes(h[0]))setPage(h[0]);
  },[]);
  useEffect(()=>{
    if(popRef.current){popRef.current=false;return}
    const target=page==="detail"&&sel?`#/detail/${sel.id}`:`#/${page}`;
    if(location.hash!==target)history.pushState(null,"",target);
  },[page,sel]);
  useEffect(()=>{
    const onPop=()=>{
      popRef.current=true;
      const h=(location.hash.slice(2)||"home").split("/");
      if(h[0]==="detail"&&h[1]){const it=itemsRef.current.find(i=>i.id===h[1]);if(it){setSel(it);setPage("detail");return}}
      setPage(ROUTES.includes(h[0])?h[0]:"home");
    };
    window.addEventListener("popstate",onPop);
    return()=>window.removeEventListener("popstate",onPop);
  },[]);

  /* transition de page GSAP */
  useEffect(()=>{
    if(typeof gsap==="undefined"||reduced())return;
    gsap.fromTo("#pagewrap",{autoAlpha:0,y:12},{autoAlpha:1,y:0,duration:.32,ease:"power2.out",clearProps:"all"});
  },[page]);

  const NavBtn=({id,label})=><button className={page===id?"on":""} onClick={()=>go(id)}>{label}</button>;
  if(user&&fbAuth()&&user.verified===false)
    return <VerifyGate user={user} onRefresh={refreshVerif} onLogout={logout}
      onResend={async()=>{const fu=fbAuth().currentUser;if(fu){await sendVerif(fu,user.name||"voisin",user.email);toast("Email de confirmation renvoyé");}}}/>;
  return <>
    <header className="hdr">
      <div className="wrap">
        <button className="logo" onClick={goHome} aria-label="Accueil Cercle"><Logo/><span className="lt">Cercle{plus&&<span style={{color:"var(--plus)",fontSize:15,verticalAlign:"super"}}>✦</span>}</span></button>
        <nav className="nav-d" aria-label="Navigation">
          <NavBtn id="home" label="Autour"/>
          <NavBtn id="favs" label="Favoris"/>
          <NavBtn id="messages" label="Courrier"/>
          <NavBtn id="profile" label="Profil"/>
        </nav>
        <div className="hdr-r">
          {user&&<button className="icon-btn bell" onClick={()=>go("notifs")} aria-label={"Notifications"+(unread?` (${unread} non lues)`:"")}>
            <I.bell size={16}/>{unread>0&&<span className="bdg">{unread}</span>}
          </button>}
          <button className="icon-btn" onClick={()=>setDark(!dark)} aria-label="Mode nuit">{dark?<I.sun size={16}/>:<I.moon size={16}/>}</button>
          {user
            ?<button className="btn btn-ter" onClick={()=>go("create")} aria-label="Proposer un objet"><I.plus size={14}/><span className="cta-txt">Proposer un objet</span></button>
            :<button className="btn btn-ter" onClick={()=>go("auth")} aria-label="Rejoindre le cercle"><I.user size={14}/><span className="cta-txt">Rejoindre le cercle</span></button>}
          {user&&<button className="icon-btn" onClick={()=>go("profile")} aria-label="Mon profil" style={{background:"var(--p)",color:"#fff",borderColor:"var(--p)",fontWeight:800,fontFamily:"var(--fd)",overflow:"hidden",padding:0}}>{user.photo?<img src={user.photo} alt=""/>:user.name[0].toUpperCase()}</button>}
        </div>
      </div>
    </header>

    <div id="pagewrap">
    {page==="home"&&<>
      {user&&!nudgeHide&&(!user.quartier||!user.phone)&&<div className="wrap"><div className="nudge">
        <span style={{fontSize:20}}>👋</span>
        <div style={{flex:1,minWidth:160}}><b style={{color:"var(--dk)"}}>Complétez votre profil</b><div style={{fontSize:12.5,color:"var(--g)"}}>Ajoutez votre adresse et votre téléphone (30 s) pour des locations plus fluides.</div></div>
        <button className="btn btn-ter" style={{minHeight:38,padding:"8px 16px",fontSize:13}} onClick={()=>go("params")}>Compléter</button>
        <button className="icon-btn" style={{width:34,height:34}} aria-label="Plus tard" onClick={()=>setNudgeHide(true)}>✕</button>
      </div></div>}
      <Hero items={items} user={user} open={open} onSearch={v=>{setQ(v);document.getElementById("grille")?.scrollIntoView({behavior:reduced()?"instant":"smooth"})}}/>
      <div className="cats" role="tablist" aria-label="Catégories">
        {CATS.map(c=><button key={c.id} role="tab" aria-selected={cat===c.id} className={"cat"+(cat===c.id?" on":"")} onClick={()=>setCat(c.id)}>{c.label}</button>)}
      </div>
      <main className="wrap" id="grille">
        <div className="sec-t">Dans votre cercle de 500 m <small>{filtered.length} objet{filtered.length>1?"s":""}{q?` pour « ${q} »`:""}</small>
          {q&&<button className="back" style={{marginLeft:"auto",marginBottom:0}} onClick={()=>setQ("")}>✕ Effacer</button>}
        </div>
        {filtered.length===0
          ?<div className="empty"><div className="big">Rien trouvé par ici</div>Essayez un autre mot, ou élargissez le cercle.</div>
          :<div className="grid">{filtered.map(it=><Card key={it.id} it={it} open={open} fav={fav.has(it.id)} togFav={togFav}/>)}</div>}
        <div className="cta-banner reveal">
          <div className="big">12 min<small>PAR AN</small></div>
          <div style={{flex:1,minWidth:240}}>
            <h3>Une perceuse s'utilise 12 minutes par an.</h3>
            <p>Le reste du temps, elle dort dans un garage. La vôtre pourrait dépanner toute la rue — et payer vos cafés.</p>
          </div>
          <button className="btn btn-ter" style={{padding:"13px 24px"}} onClick={()=>user?go("create"):go("auth")}>Proposer la mienne</button>
        </div>
      </main>
    </>}

    {page==="detail"&&sel&&<Detail it={sel} backHome={goHome} fav={fav.has(sel.id)} togFav={togFav} toast={toast} reserve={need(reserve)} openChat={need(openChat)} plus={plus} reviews={allReviews} rentals={stats.rentals}/>}
    {page==="create"&&(user?<Create toast={toast} backHome={goHome} addItem={addItem}/>:<Auth onDone={onAuth} toast={toast}/>)}
    {page==="messages"&&(user?<Messages convs={allConvs} setConvs={setConvs} openId={openConv} setOpenId={setOpenConv} user={user}/>:<Auth onDone={onAuth} toast={toast}/>)}
    {page==="favs"&&<Favs items={items} open={open} fav={fav} togFav={togFav}/>}
    {page==="profile"&&(user?<Profile dark={dark} setDark={setDark} toast={toast} go={go} plus={plus} user={user} logout={logout} stats={stats}/>:<Auth onDone={onAuth} toast={toast}/>)}
    {page==="activite"&&<Activite toast={toast} resas={allResas} requests={fbRequests} answerRequest={answerRequest} completeRental={completeRental} myListings={myListings} stats={stats} reviews={allReviews} addReview={addReview}/>}
    {page==="notifs"&&<Notifs notifs={allNotifs} markRead={markRead} markAll={markAll}/>}
    {page==="avis"&&<Avis reviews={allReviews} user={user} myListings={myListings}/>}
    {page==="grade"&&<Grade plus={plus} rentals={stats.rentals}/>}
    {page==="revenus"&&(user?<Revenus user={user} stats={stats}/>:<Auth onDone={onAuth} toast={toast}/>)}
    {page==="admin"&&(user?<Admin user={user}/>:<Auth onDone={onAuth} toast={toast}/>)}
    {page==="plus"&&<Plus toast={toast} plus={plus} subscribe={need(subscribe)}/>}
    {page==="params"&&<Params dark={dark} setDark={setDark} toast={toast} user={user} plus={plus} logout={logout} saveQuartier={saveQuartier} saveProfile={saveProfile} exportData={exportData} deleteAccount={deleteAccount} openLegal={openLegal}/>}
    {page==="legal"&&<Legal id={legal}/>}
    {page==="auth"&&<Auth onDone={onAuth} toast={toast}/>}
    </div>

    <footer>
      <div className="wrap">
        <div className="f-grid">
          <div>
            <button className="logo" onClick={goHome} style={{marginBottom:10}}><Logo size={32}/><span className="lt" style={{fontSize:19}}>Cercle</span></button>
            <p style={{fontSize:13,color:"var(--g)",maxWidth:"24ch"}}>Location entre voisins — simple, assurée, à deux rues.</p>
          </div>
          <div><h4>Explorer</h4><a onClick={goHome}>Toutes les annonces</a><a onClick={()=>go("create")}>Proposer un objet</a><a onClick={()=>go("favs")}>Mes favoris</a></div>
          <div><h4>Aide</h4><a onClick={()=>openLegal("assurance")}>Assurance & caution</a><a onClick={()=>openLegal("cgu")}>Conditions générales</a><a onClick={()=>openLegal("contact")}>Nous écrire</a></div>
          <div><h4>Cercle</h4><a onClick={()=>go("grade")}>Les grades</a><a style={{color:"var(--plus)"}} onClick={()=>go("plus")}>✦ Cercle+</a></div>
        </div>
        <div className="f-low"><span>© 2026 Cercle · Tout est à deux rues.</span><span style={{display:"flex",flexWrap:"wrap",gap:"4px 0"}}>{[["cgu","CGU"],["cgv","CGV"],["conf","Confidentialité"],["cookies","Cookies"],["mentions","Mentions légales"]].map(([id,lbl],i)=><React.Fragment key={id}>{i>0&&<span>&nbsp;·&nbsp;</span>}<a style={{display:"inline",cursor:"pointer"}} onClick={()=>openLegal(id)}>{lbl}</a></React.Fragment>)}</span></div>
      </div>
    </footer>

    <nav className="mnav" aria-label="Navigation mobile">
      <button className={page==="home"?"on":""} onClick={goHome}><I.home size={20}/>Autour</button>
      <button className={page==="favs"?"on":""} onClick={()=>go("favs")}><I.heart size={20}/>Favoris</button>
      <button className="fab" onClick={()=>go("create")} aria-label="Proposer un objet"><I.plus size={22}/></button>
      <button className={page==="messages"?"on":""} onClick={()=>go("messages")}><I.msg size={20}/>Courrier</button>
      <button className={page==="profile"?"on":""} onClick={()=>go("profile")}><I.user size={20}/>Profil</button>
    </nav>

    {toastMsg&&<div className="toast" role="status">{toastMsg}</div>}
    {!cookie&&<CookieBanner onChoice={chooseCookie} openLegal={openLegal}/>}
  </>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
