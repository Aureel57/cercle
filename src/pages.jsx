function SearchM({onClose,onSearch,allItems,filters,setFilters}){
  const[q,setQ]=useState("");const[w,setW]=useState("");const[af,setAf]=useState("what");const[searchDate,setSearchDate]=useState(filters?.searchDate||"");
  const sugg=useMemo(()=>!q||q.length<2?[]:allItems.filter(i=>i.title.toLowerCase().includes(q.toLowerCase())).slice(0,5),[q,allItems]);
  const smRef=useRef(null);
  useEffect(()=>{const gsap=G();if(!gsap||!smRef.current)return;const ctx=gsap.context(()=>{gsap.from(smRef.current,{autoAlpha:0,y:-14,duration:.22,ease:'power2.out',clearProps:'opacity,visibility,transform'});},smRef);return()=>ctx.revert();},[]);
  return <><div className="smbg" onClick={onClose}/><div className="sm" ref={smRef}><div className="smin">
    <div className="smr">
      <div className={"smf"+(af==="what"?" on":"")} onClick={()=>setAf("what")} style={{position:"relative"}}><label>Quoi ?</label><input placeholder="Perceuse, drone…" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){onSearch(q,w);onClose()}}} autoFocus/>{sugg.length>0&&af==="what"&&<div className="ac">{sugg.map(s=><div key={s.id} className="aci" onClick={()=>{onSearch(s.title,"");onClose()}}><span>{CE[s.cat]||"📦"}</span>{s.title}<span style={{marginLeft:"auto",fontSize:10,color:"var(--g)"}}>{s.price}€/j</span></div>)}</div>}</div>
      <div className={"smf"+(af==="where"?" on":"")} onClick={()=>setAf("where")} style={{position:"relative"}}><label>Où ?</label><input placeholder="Ville…" value={w} onChange={e=>setW(e.target.value)}/>{af==="where"&&w&&<div className="ac">{LOCS.filter(l=>l.toLowerCase().includes(w.toLowerCase())).slice(0,5).map(l=><div key={l} className="aci" onClick={()=>setW(l)}>📍 {l}</div>)}</div>}</div>
      <div className={"smf"+(af==="when"?" on":"")} onClick={()=>setAf("when")}><label>Quand ?</label><input type="date" value={searchDate} onChange={e=>setSearchDate(e.target.value)}/></div>
      <button className="smgo" onClick={()=>{setFilters&&setFilters(p=>({...p,searchDate}));onSearch(q,w);onClose()}}><I.Search/> Chercher</button>
    </div>
    {af==="what"&&!q&&<><div style={{margin:"10px 0"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,fontWeight:700,marginBottom:4}}><span>Prix max</span><span>{filters?.priceMax||500}€/j</span></div><input type="range" className="range-sl" min="5" max="500" value={filters?.priceMax||500} onChange={e=>setFilters&&setFilters(p=>({...p,priceMax:+e.target.value}))}/></div><div className="smtg"><p>Populaires</p><div className="smtl">{["Perceuse","Drone","Vélo électrique","Vidéoprojecteur","Paddle","Enceinte","Appareil photo","Coudre"].map(t=><button key={t} className="smt" onClick={()=>{onSearch(t,"");onClose()}}>{t}</button>)}</div></div></>}
  </div></div></>
}

function FilterM({onClose,filters,setFilters,count}){
  const[l,setL]=useState({...filters});const up=(k,v)=>setL(p=>({...p,[k]:v}));
  const[geoLoading,setGeoLoading]=useState(false);
  const[starHover,setStarHover]=useState(0);
  const requestGeo=()=>{
    if(!navigator.geolocation)return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos=>{up('userLocation',{lat:pos.coords.latitude,lng:pos.coords.longitude});setGeoLoading(false);},
      ()=>setGeoLoading(false),{timeout:8000}
    );
  };
  const OPTS=[
    {key:"verified",label:"Propriétaire vérifié",ic:"🪪"},
    {key:"delivery",label:"Livraison disponible",ic:"🚚"},
    {key:"flexible",label:"Annulation flexible",ic:"🔄"},
    {key:"instant",label:"Réservation instantanée",ic:"⚡"},
  ];
  const toggleOpt=o=>{const os=l.options||[];up("options",os.includes(o)?os.filter(x=>x!==o):[...os,o])};
  const activeCount=[
    l.filterCat&&l.filterCat!=="all"?1:0,
    l.condition&&l.condition!=="Tous"?1:0,
    l.minRating>0?1:0,
    (l.priceMin>0||l.priceMax<500)?1:0,
    (l.options||[]).length,
    l.userLocation?1:0,
    (l.sort&&l.sort!=="pertinence")?1:0,
  ].reduce((a,b)=>a+b,0);

  const fv2Ref=useRef(null);
  useEffect(()=>{const gsap=G();if(!gsap||!fv2Ref.current)return;const ctx=gsap.context(()=>{gsap.from(fv2Ref.current,{autoAlpha:0,x:'100%',duration:.3,ease:'power3.out',clearProps:'opacity,visibility,transform'});},fv2Ref);return()=>ctx.revert();},[]);
  return <div className="fv2">
    <div className="fv2-bg" onClick={onClose}/>
    <div className="fv2-panel" ref={fv2Ref}>

      {/* ── En-tête ── */}
      <div className="fv2-head">
        <div>
          <h2 style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800,color:"var(--dk)",margin:0}}>Filtres</h2>
          {activeCount>0&&<span style={{fontSize:11,color:"var(--p)",fontWeight:700}}>{activeCount} actif{activeCount>1?"s":""}</span>}
        </div>
        <button className="dv2-icon-btn" onClick={onClose}><I.X/></button>
      </div>

      {/* ── Corps ── */}
      <div className="fv2-body">

        {/* Trier par */}
        <div className="fv2-sec">
          <div className="fv2-lbl">Trier par</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {[["pertinence","Pertinence"],["price_asc","Prix croissant"],["price_desc","Prix décroissant"],["rating","Mieux notés"],["recent","Plus récents"]].map(([id,label])=>
              <button key={id} className={"fv2-sort-btn"+((l.sort||"pertinence")===id?" on":"")} onClick={()=>up("sort",id)}>{label}</button>
            )}
            {l.userLocation&&<button className={"fv2-sort-btn"+(l.sort==="nearest"?" on":"")} onClick={()=>up("sort","nearest")}>📍 Plus proche</button>}
          </div>
        </div>

        {/* Catégorie */}
        <div className="fv2-sec">
          <div className="fv2-lbl">Catégorie</div>
          <div className="fv2-cat-grid">
            {CATS.map(c=><button key={c.id} className={"fv2-cat-btn"+((l.filterCat||"all")===c.id?" on":"")} onClick={()=>up("filterCat",c.id)}>
              <div style={{fontSize:22,marginBottom:4}}>{c.icon}</div>
              <div style={{fontSize:10}}>{c.label}</div>
            </button>)}
          </div>
        </div>

        {/* État */}
        <div className="fv2-sec">
          <div className="fv2-lbl">État de l'objet</div>
          <div className="fv2-cond">
            {[["Tous","✦","Tous états"],["Comme neuf","✨","Impeccable"],["Très bon état","👍","Quelques traces"],["Bon état","👌","Usage normal"],["Usé mais fonctionnel","🔧","Fonctionnel"]].map(([v,ic,sub])=>
              <button key={v} className={"fv2-cond-btn"+(l.condition===v?" on":"")} onClick={()=>up("condition",v)}>
                <div style={{fontSize:20,marginBottom:3}}>{ic}</div>
                <div style={{fontSize:10,fontWeight:700,marginBottom:1}}>{v==="Tous"?"Tous":v}</div>
                <div style={{fontSize:9,color:l.condition===v?"var(--p)":"var(--g)",lineHeight:1.2}}>{sub}</div>
              </button>
            )}
          </div>
        </div>

        {/* Prix */}
        <div className="fv2-sec">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div className="fv2-lbl" style={{margin:0}}>Prix / jour</div>
            <span style={{fontSize:11,fontWeight:700,color:"var(--p)"}}>{l.priceMin||0} € – {l.priceMax||500} €</span>
          </div>
          <input type="range" className="range-sl" min="0" max="500" value={l.priceMax||500} onChange={e=>up("priceMax",+e.target.value)} style={{width:"100%",marginBottom:10}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div className="fv2-pfield">
              <div style={{fontSize:9,fontWeight:700,color:"var(--g)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>Min</div>
              <div style={{display:"flex",alignItems:"center",gap:3}}><input type="number" value={l.priceMin||0} onChange={e=>up("priceMin",+e.target.value)} style={{width:"100%",border:"none",background:"none",fontSize:14,fontWeight:700,outline:"none",color:"var(--dk)",fontFamily:"var(--f)"}}/><span style={{fontSize:11,color:"var(--g)"}}>€</span></div>
            </div>
            <div className="fv2-pfield">
              <div style={{fontSize:9,fontWeight:700,color:"var(--g)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>Max</div>
              <div style={{display:"flex",alignItems:"center",gap:3}}><input type="number" value={l.priceMax||500} onChange={e=>up("priceMax",+e.target.value)} style={{width:"100%",border:"none",background:"none",fontSize:14,fontWeight:700,outline:"none",color:"var(--dk)",fontFamily:"var(--f)"}}/><span style={{fontSize:11,color:"var(--g)"}}>€</span></div>
            </div>
          </div>
        </div>

        {/* Note minimale */}
        <div className="fv2-sec">
          <div className="fv2-lbl">Note minimale</div>
          <div style={{display:"flex",gap:0,marginBottom:8}}>
            {[1,2,3,4,5].map(n=><button key={n} className={"fv2-star"+(n<=(starHover||l.minRating||0)?" lit":"")}
              onMouseEnter={()=>setStarHover(n)} onMouseLeave={()=>setStarHover(0)}
              onClick={()=>up("minRating",n===l.minRating?0:n)}>★</button>)}
          </div>
          <div style={{fontSize:11,color:"var(--g)"}}>
            {l.minRating>0?`Minimum ${l.minRating} étoile${l.minRating>1?"s":""}`:starHover>0?`Minimum ${starHover} étoile${starHover>1?"s":""}`:"Toutes les notes"}
          </div>
        </div>

        {/* Options */}
        <div className="fv2-sec">
          <div className="fv2-lbl">Options</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {OPTS.map(o=>{
              const on=(l.options||[]).includes(o.label);
              return <div key={o.key} style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:38,height:38,borderRadius:10,background:on?"rgba(124,58,237,.12)":"var(--bgw)",border:"1.5px solid "+(on?"var(--p)":"var(--bd)"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0,transition:"all .15s"}}>{o.ic}</div>
                <span style={{flex:1,fontSize:13,fontWeight:600,color:"var(--dk)"}}>{o.label}</span>
                <button className={"fv2-tog "+(on?"on":"off")} onClick={()=>toggleOpt(o.label)}>
                  <span style={{position:"absolute",top:3,left:on?22:3,width:20,height:20,borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,.2)",transition:"left .18s var(--ease)"}}/>
                </button>
              </div>;
            })}
          </div>
        </div>

        {/* Proximité */}
        <div className="fv2-sec" style={{borderBottom:"none"}}>
          <div className="fv2-lbl">📍 Position</div>
          {!l.userLocation
            ?<button onClick={requestGeo} disabled={geoLoading}
                style={{width:"100%",padding:"12px 16px",borderRadius:14,border:"1.5px dashed var(--bd)",background:"var(--bgw)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:13,fontWeight:600,color:"var(--dk)",transition:"all .15s"}}>
                {geoLoading?"⏳ Localisation…":"📍 Utiliser ma position"}
              </button>
            :<div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:12,color:"#059669",fontWeight:700}}>✓ Position obtenue</span>
                  <button onClick={()=>{up('userLocation',null);up('sort',l.sort==='nearest'?'pertinence':l.sort);}} style={{fontSize:11,color:"var(--g)",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Retirer</button>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
                  <span style={{color:"var(--dk)",fontWeight:600}}>Rayon</span>
                  <span style={{color:"var(--p)",fontWeight:700}}>{l.maxDistance||20} km</span>
                </div>
                <input type="range" className="range-sl" min="1" max="100" value={l.maxDistance||20} onChange={e=>up('maxDistance',+e.target.value)} style={{width:"100%"}}/>
              </div>
          }
        </div>
      </div>

      {/* ── Pied ── */}
      <div className="fv2-foot">
        <button className="cl" style={{flex:1}} onClick={()=>setL({priceMin:0,priceMax:500,condition:"Tous",options:[],sort:"pertinence",filterCat:"all",minRating:0,userLocation:null,maxDistance:20})}>Tout effacer</button>
        <button className="bd" style={{flex:2}} onClick={()=>{setFilters(l);onClose()}}>Afficher {count} résultats</button>
      </div>
    </div>
  </div>
}



/* ===== INFO PAGES ===== */
const INFO_PAGES={
  guide:{title:"Guide de demarrage",icon:"📖",sections:[["Comment ca marche ?","Cercle connecte ceux qui ont des objets avec ceux qui en ont besoin. Recherchez, reservez, profitez, restituez."],["Etape 1","Recherchez un objet par mot-cle ou categorie."],["Etape 2","Reservez en ligne et payez de maniere securisee."],["Etape 3","Recuperez l'objet chez le proprietaire."],["Etape 4","Rendez-le en bon etat. Caution restituee sous 48h."]]},

  security:{title:"Sécurité des paiements",icon:"🔒",sections:[["Paiements protégés","Chiffrement SSL 256 bits. Visa, Mastercard, Google Pay, Apple Pay, PayPal acceptés."],["Caution séquestrée","Jamais transmise directement au propriétaire. Restituée automatiquement après validation du retour."],["Transparence","Le prix affiché inclut tout : location + frais de service."]]},
  contact:{title:"Nous contacter",icon:"📞",sections:[["Chat IA","Notre assistant est disponible 24/7. Cliquez sur le bouton en bas à droite."],["Email","support@cercle.fr — Réponse sous 24h ouvrées."],["Réseaux","Instagram @cercle.app, Twitter @cercle_app, Facebook /cercleapp"]]},
  blog:{title:"Blog Cercle",icon:"📝",sections:[["Cercle Pro lancé","Découvrez l'espace professionnel avec gestion de flotte et facturation automatique."],["Impact écologique","Un objet loué remplace 4 achats neufs. 12 tonnes de CO2 économisées cette année."],["5 astuces","Photos de qualité, prix compétitif, réponse rapide, flexibilité, bonne description."]]},
  forum:{title:"Forum d'entraide",icon:"💬",sections:[["Bienvenue","Posez vos questions et partagez vos expériences avec la communauté."],["Sujet populaire","Comment fixer le bon prix ? Regardez les annonces similaires et ajustez."],["Sujet populaire","Que faire en cas de retard ? Contactez via messagerie, puis ouvrez un litige si besoin."]]},
  guides:{title:"Guides pratiques",icon:"📚",sections:[["Guide locataire","Trouvez les meilleures offres, vérifiez l'état des objets, laissez des avis constructifs."],["Guide propriétaire","Optimisez vos annonces avec photos pro et descriptions détaillées."],["Guide caution","Tout sur le blocage, conditions de retenue et processus de restitution."]]},
  impact:{title:"Impact environnemental",icon:"🌱",sections:[["Notre engagement","L'économie du partage réduit la production, le gaspillage et l'empreinte carbone."],["Nos chiffres","45 000 objets partagés, 12 tonnes de CO2 économisées, 8 000 achats évités."],["Objectif 2027","100 000 locations/mois et première plateforme neutre en carbone du secteur."]]},
  temoignages:{title:"Témoignages",icon:"📣",sections:[["Marie, Paris","J'ai loué une perceuse pour 12 euros au lieu de l'acheter 90. Simple et rapide !"],["Thomas, Lyon","Je gagne 200 euros/mois en louant mes outils. Cercle s'occupe de tout."],["Julie, Bordeaux","Pour mon mariage, tout loué sur Cercle. Économie de 1 500 euros !"]]},
  conseils:{title:"Conseils pour louer",icon:"💡",sections:[["Le bon prix","Analysez les annonces similaires dans votre zone pour vous positionner."],["Belles photos","Lumière naturelle, plusieurs angles, fond neutre et propre."],["Réactivité","Visez un temps de réponse inférieur à 1 heure pour maximiser les réservations."]]},
  revenus:{title:"Maximiser ses revenus",icon:"📈",sections:[["Avis 5 étoiles","Chaque avis 5 étoiles augmente votre taux de réservation de 15%."],["Calendrier","Activez les réservations instantanées et proposez des tarifs dégressifs."],["Fidélité","Montez en grade pour réduire vos commissions de 10% à 2%."]]},
  photos:{title:"Prendre de bonnes photos",icon:"📸",sections:[["Éclairage","Lumière naturelle, près d'une fenêtre. Évitez le flash."],["Angles","Minimum 3 photos : vue d'ensemble, détail, objet en contexte."],["Mise en scène","Fond neutre, pas de désordre. La présentation fait la différence."]]},
  superproprio:{title:"Devenir Super Proprio",icon:"⭐",sections:[["Critères","Note > 4.8, taux de réponse > 90%, 0 annulation, 20+ locations."],["Avantages","Badge visible, priorité dans les résultats, commission réduite."],["Comment","Maintenez vos performances pendant 3 mois consécutifs."]]},
  about:{title:"À propos de Cercle",icon:"🏢",sections:[["Notre histoire","Né en 2024, Cercle part du constat que la plupart des objets sont sous-utilisés."],["L'équipe","25 passionnés à Paris, Lyon et Bordeaux. Tech, design, économie circulaire."],["Investisseurs","Soutenus par des fonds engagés dans l'économie durable."]]},
  mission:{title:"Notre mission",icon:"🎯",sections:[["Accessibilité","Louer aussi simplement qu'acheter, pour tous, partout."],["Anti-gaspillage","Chaque objet loué est un objet qui n'est pas fabriqué."],["Lien social","La location entre voisins crée de la confiance dans les quartiers."]]},
  careers:{title:"Carrières",icon:"💼",sections:[["Pourquoi nous rejoindre ?","Impact réel, équipe bienveillante, télétravail flexible, stock-options."],["Postes ouverts","Dev Full-Stack, Product Designer, Growth Manager, Customer Success, Data Engineer."],["Postuler","Envoyez CV et motivation à careers@cercle.fr"]]},
  press:{title:"Espace presse",icon:"📰",sections:[["Kit presse","Logo, photos, captures et chiffres clés sur demande à press@cercle.fr"],["Médias","Mentionné dans Les Echos, TechCrunch France, Maddyness, BFM Business."],["Contact","press@cercle.fr — Réponse sous 24h pour les journalistes."]]},
  partners:{title:"Partenariats",icon:"🤝",sections:[["Devenez partenaire","Entreprises, collectivités, associations : intégrez Cercle dans votre offre."],["Nos partenaires","Mairies, bailleurs, coworking, entreprises du CAC 40."],["Contact","partenariats@cercle.fr"]]},
  newsletter:{title:"Newsletter",icon:"📧",sections:[["Restez informé","Recevez chaque semaine nos meilleures annonces et conseils."],["Contenu","Top 5 annonces, conseils, codes promo exclusifs, nouveautés."],["Inscription","Entrez votre email. Désabonnement en un clic."]]},
  cgu:{title:"Conditions Générales d'Utilisation",icon:"📜",sections:[["1. Objet","Cercle est une plateforme de mise en relation entre particuliers et professionnels pour la location d'objets. Les présentes CGU régissent l'utilisation du service."],["2. Inscription et compte","L'inscription est gratuite. L'utilisateur s'engage à fournir des informations exactes et à jour. Il est responsable de la confidentialité de ses identifiants. Cercle peut suspendre tout compte en cas de violation des CGU, d'abus ou de fraude."],["3. Annonces et locations","Les annonces doivent décrire fidèlement les objets proposés. Sont interdits : objets illégaux, dangereux, contrefaits ou soumis à réglementation spéciale. Toute réservation acceptée constitue un engagement contractuel entre les deux parties."],["4. Paiements et commissions","Cercle perçoit une commission sur chaque transaction selon le grade de l'utilisateur (de 3% à 12%). La caution est bloquée pendant la location et restituée sous 48h après confirmation de retour en bon état."],["5. Responsabilités","Cercle est une plateforme d'intermédiation et n'est pas partie aux contrats de location. Une protection jusqu'à 2 000 € est incluse pour les objets loués via Cercle."],["6. Résiliation","Vous pouvez supprimer votre compte à tout moment depuis les paramètres. Cercle peut résilier un compte sans préavis en cas de violation grave."],["7. Contact","Pour toute question relative aux CGU : support@cercle.fr"]]},
  privacy:{title:"Politique de confidentialité",icon:"🔐",sections:[["1. Données collectées","Prénom, nom, email, date de naissance, adresse, téléphone, photo de profil, historique des transactions et préférences de communication. Ces données sont nécessaires au fonctionnement du service."],["2. Utilisation des données","Vos données servent exclusivement à gérer votre compte, traiter les transactions, vous notifier de votre activité et améliorer nos services. Elles ne sont jamais revendues à des tiers."],["3. Emails promotionnels","Vous ne recevez des emails promotionnels que si vous avez coché la case correspondante à l'inscription. Désabonnement possible à tout moment."],["4. Conservation","Vos données sont conservées pendant la durée de vie de votre compte, puis 3 ans après suppression pour des raisons légales et comptables."],["5. Vos droits (RGPD)","Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité, de limitation et d'opposition. Ces droits s'exercent auprès de notre DPO."],["6. Contact DPO","dpo@cercle.fr — Réponse sous 30 jours maximum."]]},
  legal:{title:"Mentions légales",icon:"⚖️",sections:[["Éditeur du site","Cercle — Plateforme de location d'objets entre particuliers et professionnels. Contact : support@cercle.fr"],["Directeur de la publication","Le représentant légal de Cercle."],["Hébergement","Site hébergé par Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, USA — netlify.com. Données stockées par Google Firebase (Google Ireland Ltd, Gordon House, Barrow Street, Dublin 4, Irlande)."],["Propriété intellectuelle","L'ensemble des contenus du site (logo, textes, design, code) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite."],["Signalement","Pour signaler un contenu illicite : support@cercle.fr"]]},
  cookies:{title:"Politique cookies",icon:"🍪",sections:[["Ce que nous utilisons","Cercle utilise uniquement le stockage local de votre navigateur (localStorage) et les services Google Firebase pour le fonctionnement du compte et la sauvegarde de vos données."],["Pas de cookies publicitaires","Aucun cookie publicitaire ou de pistage tiers n'est déposé. Aucune donnée n'est partagée avec des régies publicitaires."],["Cookies techniques","Firebase peut déposer des identifiants techniques strictement nécessaires à l'authentification et à la session. Ils ne sont pas utilisés à des fins commerciales."],["Gérer vos données locales","Vous pouvez effacer les données locales du site à tout moment via les réglages de votre navigateur (effacer les données de navigation)."]]}
};
function InfoPage({id,setPage,goBack}){
  const pg=INFO_PAGES[id];if(!pg)return null;
  return <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:80}}>
    {/* Header sticky */}
    <div style={{position:'sticky',top:0,zIndex:50,background:'rgba(255,255,255,0.95)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--bd)',padding:'12px 20px',display:'flex',alignItems:'center',gap:12}}>
      <button onClick={goBack} style={{display:'flex',alignItems:'center',gap:6,background:'var(--bg)',border:'1px solid var(--bd)',borderRadius:24,padding:'7px 14px',fontSize:13,fontWeight:600,cursor:'pointer',color:'var(--dk)',flexShrink:0}}>
        <I.Back/> Retour
      </button>
      <span style={{fontSize:15,fontWeight:700,color:'var(--dk)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{pg.icon} {pg.title}</span>
    </div>
    {/* Hero */}
    <div style={{background:'linear-gradient(135deg,#6C63FF,#8b5cf6)',padding:'40px 24px 48px',textAlign:'center',marginBottom:-20}}>
      <div style={{width:72,height:72,borderRadius:20,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,margin:'0 auto 16px'}}>
        {pg.icon}
      </div>
      <h1 style={{fontFamily:'var(--fd)',fontSize:26,fontWeight:800,color:'#fff',letterSpacing:'-.02em',margin:0}}>{pg.title}</h1>
    </div>
    {/* Contenu */}
    <div style={{maxWidth:720,margin:'0 auto',padding:'0 20px'}}>
      {pg.sections.map((s,i)=>(
        <div key={i} style={{background:'var(--w)',borderRadius:20,border:'1px solid var(--bd)',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',padding:'22px 24px',marginBottom:12,animation:'fadeSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:(i*0.06)+'s'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'linear-gradient(135deg,#6C63FF,#8b5cf6)',flexShrink:0}}/>
            <h3 style={{fontSize:15,fontWeight:700,color:'var(--dk)',margin:0}}>{s[0]}</h3>
          </div>
          <p style={{fontSize:14,lineHeight:1.75,color:'var(--g)',margin:0,paddingLeft:18}}>{s[1]}</p>
        </div>
      ))}
      <button onClick={goBack} style={{width:'100%',marginTop:8,padding:'14px',borderRadius:16,background:'linear-gradient(135deg,#6C63FF,#8b5cf6)',border:'none',color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
        <I.Back/> Retour au site
      </button>
    </div>
  </div>
}

/* ===== MAP PAGE ===== */
function MapPage({items,onOpen}){
  const[mapCat,setMapCat]=useState('all');
  const[areaItems,setAreaItems]=useState([]);
  const[drawerOpen,setDrawerOpen]=useState(false);
  const[sel,setSel]=useState(null);
  const mapRef=useRef(null);
  const leafRef=useRef(null);
  const mgRef=useRef(null);
  const rebuildRef=useRef(null);
  const mapCatRef=useRef('all');
  const itemsRef=useRef(items);
  // Always keep itemsRef in sync without triggering effects
  itemsRef.current=items;

  /* ---- helpers ---- */
  const filterByBounds=(map,src)=>{
    try{
      const b=map.getBounds();
      if(!b||!b.isValid())return src;
      return src.filter(i=>typeof i.lat==='number'&&typeof i.lng==='number'&&b.contains([i.lat,i.lng]));
    }catch{return src;}
  };

  const buildMarkers=(map,mg,src)=>{
    mg.clearLayers();
    const cities={};
    src.forEach(i=>{
      if(typeof i.lat!=='number'||typeof i.lng!=='number')return;
      if(!cities[i.location])cities[i.location]={cnt:0,lat:i.lat,lng:i.lng,minPrice:i.price};
      cities[i.location].cnt++;
      if(i.price<cities[i.location].minPrice)cities[i.location].minPrice=i.price;
    });
    Object.entries(cities).forEach(([name,d])=>{
      const short=name.replace(/\s\d+\w?$/,'');
      const icon=window.L.divIcon({
        className:'',
        html:`<div class="map-pin">📍 ${d.cnt} · ${short}</div>`,
        iconSize:[0,0],iconAnchor:[0,16]
      });
      const popup=window.L.popup({maxWidth:200,closeButton:true,className:'map-popup-wrap'}).setContent(
        `<div style="font-family:'DM Sans',system-ui;padding:6px 2px;min-width:140px">
          <div style="font-size:14px;font-weight:700;margin-bottom:4px">📍 ${short}</div>
          <div style="font-size:12px;color:#6B7280">${d.cnt} annonce${d.cnt>1?'s':''} disponible${d.cnt>1?'s':''}</div>
          <div style="font-size:13px;font-weight:600;color:#0D9488;margin-top:4px">À partir de ${d.minPrice}€<span style="font-weight:400;color:#9CA3AF">/jour</span></div>
        </div>`
      );
      const m=window.L.marker([d.lat,d.lng],{icon}).bindPopup(popup);
      m.on('click',()=>{
        setSel(name);
        setDrawerOpen(true);
      });
      mg.addLayer(m);
    });
  };

  /* ---- Init Leaflet (once on mount) ---- */
  useEffect(()=>{
    if(!window.L)return console.warn('[MapPage] Leaflet not loaded');
    if(!mapRef.current)return;
    if(leafRef.current)return;

    const map=window.L.map(mapRef.current,{zoomControl:true,attributionControl:true}).setView([46.8,2.5],6);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution:'© <a href="https://openstreetmap.org/copyright">OSM</a>',
      maxZoom:19
    }).addTo(map);
    const mg=window.L.layerGroup().addTo(map);
    mgRef.current=mg;
    leafRef.current=map;

    // Capture stable refs for event handlers (avoid stale closures)
    rebuildRef.current=(src)=>buildMarkers(map,mg,src);

    const getSrc=()=>{
      const cat=mapCatRef.current;
      return cat==='all'?itemsRef.current:itemsRef.current.filter(i=>i.cat===cat);
    };

    // Initial render — delay filter until map tiles settle
    const initSrc=getSrc();
    buildMarkers(map,mg,initSrc);
    setTimeout(()=>{
      map.invalidateSize();
      setAreaItems(filterByBounds(map,initSrc));
    },200);

    // Both moveend and zoomend → instant list update + reset city selection
    // Note: Leaflet always fires moveend AFTER zoomend, so using both is intentional.
    // zoomend fires first (rebuilds markers+filters), then moveend fires again
    // with the same data — a no-op in practice since getSrc() and bounds are stable.
    // Close popup at zoom START (before animation) so it never survives the transition
    map.on('zoomstart',()=>map.closePopup());

    const onMapChange=()=>{
      map.closePopup();          // belt-and-suspenders: also close on zoomend/moveend
      map.invalidateSize();      // fix grey tiles when container size is recalculated
      const s=getSrc();
      buildMarkers(map,mg,s);
      setAreaItems(filterByBounds(map,s));
      setSel(null);
    };
    map.on('moveend',onMapChange);
    map.on('zoomend',onMapChange);

    return()=>{
      map.remove();
      leafRef.current=null;
      mgRef.current=null;
      rebuildRef.current=null;
    };
  },[]);/* eslint-disable-line react-hooks/exhaustive-deps */

  /* ---- React to category filter changes ---- */
  useEffect(()=>{
    mapCatRef.current=mapCat;
    if(!leafRef.current||!rebuildRef.current)return;
    const src=mapCat==='all'?items:items.filter(i=>i.cat===mapCat);
    rebuildRef.current(src);
    setAreaItems(filterByBounds(leafRef.current,src));
    setSel(null);
    setDrawerOpen(false);
  },[mapCat]);/* eslint-disable-line react-hooks/exhaustive-deps */

  const panelItems=sel?areaItems.filter(i=>i.location===sel):areaItems;
  const closeDrawer=()=>{setSel(null);setDrawerOpen(false);};

  return <div className="map-w">
    {/* Category filter bar */}
    <div className="map-filters">
      {CATS.slice(0,10).map(c=><button key={c.id} className={"pill"+(mapCat===c.id?" on":"")} style={{fontSize:11,whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setMapCat(c.id)}>{c.icon} {c.label}</button>)}
    </div>
    <div className="map-layout">
      {/* Map area */}
      <div style={{position:"relative",minHeight:0}}>
        <div ref={mapRef} style={{position:"absolute",inset:0}}/>
        <button className="map-list-btn" style={{zIndex:1000}} onClick={()=>setDrawerOpen(d=>!d)}>
          📋 {areaItems.length} annonce{areaItems.length!==1?"s":""}
        </button>
      </div>
      {/* Side panel (desktop) / Bottom drawer (mobile) */}
      <div className={"map-side"+(drawerOpen?" open":"")}>
        <div className="map-drawer-handle" onClick={closeDrawer}/>
        <div className="map-side-hd">
          <span>{areaItems.length} annonce{areaItems.length!==1?"s":""} dans cette zone</span>
          <button className="map-drawer-close" onClick={closeDrawer}>✕</button>
        </div>
        {/* Breadcrumb ville sélectionnée */}
        {sel&&<div className="map-breadcrumb">
          <span className="map-breadcrumb-label">📍 {sel} · {panelItems.length} annonce{panelItems.length!==1?"s":""}</span>
          <button className="map-breadcrumb-reset" onClick={()=>setSel(null)}>✕ Tout voir</button>
        </div>}
        {panelItems.length===0
          ?<div style={{padding:32,textAlign:"center",color:"var(--g)"}}><div style={{fontSize:32}}>🗺️</div><p style={{fontSize:12,marginTop:8}}>Aucune annonce dans cette zone</p></div>
          :<div style={{overflowY:"auto",flex:1,paddingBottom:8}}>
            {panelItems.map(i=><div key={i.id} className="map-card" onClick={()=>onOpen(i)}>
              <img src={i.images[0]} alt={i.title}/>
              <div className="map-card-body">
                <div className="map-card-title">{i.title}</div>
                <div className="map-card-meta">📍 {i.location.replace(/\s\d+\w?$/,'')} · ★ {i.rating} ({i.reviews})</div>
                <div style={{display:"flex",alignItems:"baseline",gap:4,marginTop:2}}>
                  <span className="map-card-price">{i.price}€<span>/jour</span></span>
                  {i.condition&&<span style={{fontSize:10,background:"var(--bgw)",border:"1px solid var(--bd)",borderRadius:4,padding:"1px 5px",color:"var(--g)",fontWeight:500}}>{i.condition}</span>}
                </div>
              </div>
            </div>)}
          </div>}
      </div>
    </div>
  </div>;
}

/* ===== NOTIF CENTER ===== */
function NotifCenter({state,dispatch,setPage,goBack}){
  const[filter,setFilter]=useState('all');
  const km={
    booking:{ic:"📅",c:"#3B82F6",bg:"#dbeafe"},
    deposit:{ic:"🔒",c:"#16A34A",bg:"#dcfce7"},
    listing:{ic:"📦",c:"#6C63FF",bg:"#ede9fe"},
    referral:{ic:"🎁",c:"#D97706",bg:"#fef3c7"},
    dispute:{ic:"⚖️",c:"#ef4444",bg:"#fee2e2"},
    badge:{ic:"🏅",c:"#D97706",bg:"#fef3c7"},
    wallet:{ic:"💰",c:"#16A34A",bg:"#dcfce7"},
    system:{ic:"⚙️",c:"#6b7280",bg:"#f3f4f6"},
  };
  const all=state.notifications||[];
  const unread=all.filter(n=>!n.read).length;
  const list=filter==='unread'?all.filter(n=>!n.read):all;
  return <div style={{minHeight:'100vh',background:'var(--bg)',paddingBottom:90}}>
    <div style={{maxWidth:680,margin:'0 auto',padding:'24px 20px'}}>
      <button onClick={goBack} style={{display:'inline-flex',alignItems:'center',gap:6,background:'var(--w)',border:'1px solid var(--bd)',borderRadius:22,padding:'8px 14px',fontSize:13,fontWeight:600,cursor:'pointer',color:'var(--dk)',marginBottom:20}}><I.Back/> Retour</button>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:18,gap:12,flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:26,fontWeight:800,color:'var(--dk)',letterSpacing:'-.02em',margin:0}}>Notifications</h1>
          <p style={{fontSize:13,color:'var(--g)',margin:'4px 0 0'}}>{unread>0?`${unread} non lue${unread>1?'s':''}`:'Tout est à jour'}</p>
        </div>
        {unread>0&&<button onClick={()=>dispatch({type:"READ_N"})} style={{fontSize:13,fontWeight:700,color:'var(--p)',background:'#ede9fe',border:'none',borderRadius:22,padding:'8px 16px',cursor:'pointer'}}>Tout marquer lu</button>}
      </div>

      {/* Filtres */}
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        {[['all','Toutes',all.length],['unread','Non lues',unread]].map(([k,lbl,n])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:22,fontSize:13,fontWeight:700,cursor:'pointer',border:'1px solid '+(filter===k?'var(--p)':'var(--bd)'),background:filter===k?'var(--p)':'var(--w)',color:filter===k?'#fff':'var(--dk)'}}>
            {lbl}<span style={{fontSize:11,fontWeight:700,background:filter===k?'rgba(255,255,255,0.25)':'var(--bg)',color:filter===k?'#fff':'var(--g)',borderRadius:10,padding:'1px 7px'}}>{n}</span>
          </button>
        ))}
      </div>

      {list.length===0
        ? <div style={{textAlign:'center',padding:'60px 20px',background:'var(--w)',border:'1px solid var(--bd)',borderRadius:20}}>
            <div style={{fontSize:48,marginBottom:12,opacity:.5}}>🔔</div>
            <div style={{fontSize:16,fontWeight:700,color:'var(--dk)',marginBottom:4}}>{filter==='unread'?'Aucune notification non lue':'Aucune notification'}</div>
            <div style={{fontSize:13,color:'var(--g)'}}>Vos alertes apparaîtront ici.</div>
          </div>
        : <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {list.map(n=>{const m=km[n.kind]||{ic:'📌',c:'#6C63FF',bg:'#ede9fe'};return(
              <div key={n.id} onClick={()=>dispatch({type:"READ_ONE",id:n.id})} style={{display:'flex',alignItems:'flex-start',gap:13,padding:'15px 16px',background:n.read?'var(--w)':'#faf8ff',border:'1px solid '+(n.read?'var(--bd)':'#ddd6fe'),borderRadius:14,cursor:'pointer',transition:'background .15s'}} onMouseEnter={e=>e.currentTarget.style.background=n.read?'var(--bg)':'#f3eeff'} onMouseLeave={e=>e.currentTarget.style.background=n.read?'var(--w)':'#faf8ff'}>
                <div style={{width:40,height:40,borderRadius:11,background:m.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>{m.ic}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13.5,fontWeight:n.read?400:600,color:'var(--dk)',lineHeight:1.45}}>{n.text}</div>
                  <div style={{fontSize:11,color:'var(--g)',marginTop:4}}>{ds(n.at)}</div>
                </div>
                {!n.read&&<div style={{width:9,height:9,borderRadius:'50%',background:'var(--p)',flexShrink:0,marginTop:6}}/>}
              </div>
            )})}
          </div>}
    </div>
  </div>
}

/* ===== DASHBOARD ===== */
/* ========== GESTION PRO ========== */
function GestionPro({state,dispatch,setPage,goBack}){
  const u=state.user;
  const [gTab,setGTab]=useState('demandes');
  const [calMonth,setCalMonth]=useState(new Date().getMonth());
  const [calYear,setCalYear]=useState(new Date().getFullYear());
  const [requests,setRequests]=useState([
    {id:'r1',item:'Nacelle élévatrice 12m',renter:'Martin Dupuis',dates:'5–8 Mai 2026',days:3,price:360,status:'pending',avatar:'👷'},
    {id:'r2',item:'Groupe électrogène 5kVA',renter:'Sophie Lefebvre',dates:'12–13 Mai 2026',days:2,price:90,status:'pending',avatar:'👩‍🔧'},
    {id:'r3',item:'Échafaudage complet 10m',renter:'Pascal Moreau',dates:'20–25 Mai 2026',days:5,price:325,status:'pending',avatar:'👨'},
    {id:'r4',item:'Bétonnière 350L',renter:'Julie Renard',dates:'3–4 Juin 2026',days:2,price:80,status:'accepted',avatar:'👩'},
    {id:'r5',item:'Compacteur de sol',renter:'Thierry Blanc',dates:'10 Juin 2026',days:1,price:85,status:'refused',avatar:'👨‍🦳'},
  ]);
  const invoices=[
    {id:'F-2026-041',client:'Martin Construction',date:'15 Avr. 2026',amount:720,status:'paid',items:['Nacelle 12m × 3j','Groupe 5kVA × 2j']},
    {id:'F-2026-038',client:'EventPro Lyon',date:'8 Avr. 2026',amount:1200,status:'paid',items:['Sono 2000W × 3j','Barnum 6×12m × 2j']},
    {id:'F-2026-035',client:'BTP Méditerranée',date:'2 Avr. 2026',amount:540,status:'pending',items:['Mini-pelle 1.5T × 3j']},
    {id:'F-2026-031',client:'Cyclez Paris',date:'25 Mar. 2026',amount:1500,status:'paid',items:['Flotte 10 vélos élec. × 10j']},
  ];
  const monthNames=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const bookedDays=new Set([5,6,7,8,12,13,20,21,22,23,24,25]);
  const todayD=new Date().getDate();
  const isCurrentMonth=calMonth===new Date().getMonth()&&calYear===new Date().getFullYear();
  const firstDay=new Date(calYear,calMonth,1).getDay();
  const firstMon=(firstDay===0?6:firstDay-1);
  const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
  const accept=id=>setRequests(r=>r.map(x=>x.id===id?{...x,status:'accepted'}:x));
  const refuse=id=>setRequests(r=>r.map(x=>x.id===id?{...x,status:'refused'}:x));
  const pending=requests.filter(r=>r.status==='pending');
  const accepted=requests.filter(r=>r.status==='accepted');
  const refused=requests.filter(r=>r.status==='refused');

  const genInvoicePDF=async(inv)=>{
    if(!window.jspdf){console.error('jsPDF non chargé');return;}
    const now=new Date().toLocaleDateString('fr-FR');
    const wrapper=document.createElement('div');
    wrapper.style.cssText='position:absolute;left:-9999px;top:0;width:794px;background:#fff;font-family:DM Sans,system-ui,sans-serif;';
    wrapper.innerHTML=`<div style="width:794px;padding:0;font-family:DM Sans,system-ui,sans-serif;">
      <div style="background:linear-gradient(135deg,#F59E0B,#D97706);padding:40px;color:white;">
        <div style="font-size:10px;letter-spacing:2px;opacity:.7;margin-bottom:8px;">FACTURE PRO — CERCLE</div>
        <div style="font-size:28px;font-weight:800;">${inv.id}</div>
        <div style="font-size:14px;opacity:.85;margin-top:6px;">${u.company||u.name} · SIRET ${u.siret||'N/A'}</div>
      </div>
      <div style="padding:32px 40px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:28px;">
          <div><div style="font-size:11px;color:#9ca3af;margin-bottom:4px;">FACTURÉ À</div><div style="font-size:16px;font-weight:700;">${inv.client}</div></div>
          <div style="text-align:right"><div style="font-size:11px;color:#9ca3af;margin-bottom:4px;">DATE</div><div style="font-size:14px;font-weight:600;">${inv.date}</div></div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead><tr style="background:#f9fafb;"><th style="padding:10px 16px;text-align:left;font-size:11px;color:#6b7280;font-weight:600;">DÉSIGNATION</th><th style="padding:10px 16px;text-align:right;font-size:11px;color:#6b7280;font-weight:600;">MONTANT HT</th></tr></thead>
          <tbody>${inv.items.map(it=>`<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:14px 16px;font-size:13px;">${it}</td><td style="padding:14px 16px;font-size:13px;font-weight:600;text-align:right;">${Math.round(inv.amount/inv.items.length)}€</td></tr>`).join('')}</tbody>
        </table>
        <div style="background:#fffbeb;border-left:4px solid #F59E0B;padding:16px 20px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:13px;color:#6b7280;">Total TTC (TVA 20%)</div>
          <div style="font-size:24px;font-weight:800;color:#D97706;">${Math.round(inv.amount*1.2)}€</div>
        </div>
        <div style="margin-top:32px;font-size:10px;color:#d1d5db;border-top:1px solid #f3f4f6;padding-top:16px;text-align:center;">Facture générée le ${now} · Cercle Pro — cercle.app</div>
      </div></div>`;
    document.body.appendChild(wrapper);
    try{
      const canvas=await window.html2canvas(wrapper.firstElementChild,{scale:2,useCORS:true,backgroundColor:'#fff',logging:false});
      const{jsPDF}=window.jspdf;
      const doc=new jsPDF({orientation:'portrait',unit:'px',format:'a4',hotfixes:['px_scaling']});
      const pw=doc.internal.pageSize.getWidth();const ph=doc.internal.pageSize.getHeight();
      const iw=pw;const ih=canvas.height*pw/canvas.width;
      doc.addImage(canvas.toDataURL('image/png'),'PNG',0,0,iw,Math.min(ih,ph));
      doc.save(`${inv.id}.pdf`);
    }catch(e){console.error('Erreur export PDF',e);}
    finally{document.body.removeChild(wrapper);}
  };

  const card={background:'var(--w)',borderRadius:18,boxShadow:'0 2px 20px rgba(0,0,0,0.07)',overflow:'hidden'};
  const tabSt=active=>({padding:'10px 16px',fontSize:13,fontWeight:600,border:'none',background:'none',borderBottom:active?'2.5px solid #D97706':'2.5px solid transparent',color:active?'#D97706':'var(--g)',cursor:'pointer',transition:'all .2s'});

  return <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#92400E 0%,#B45309 30%,#D97706 65%,#F59E0B 100%)',backgroundAttachment:'fixed',paddingBottom:90,animation:'fadeSlideUp 0.4s both'}}>
    {/* Header */}
    <div style={{padding:'52px 20px 28px',position:'relative'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.1) 1px,transparent 1px)',backgroundSize:'22px 22px',pointerEvents:'none'}}/>
      <div style={{position:'relative',maxWidth:860,margin:'0 auto'}}>
        <button onClick={goBack} style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',borderRadius:20,padding:'6px 14px',color:'white',fontSize:13,fontWeight:600,marginBottom:20,cursor:'pointer',backdropFilter:'blur(8px)'}}><I.Back/> Retour</button>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
          <div style={{background:'rgba(255,255,255,0.2)',borderRadius:12,padding:'5px 12px',fontSize:11,fontWeight:800,color:'#fff',letterSpacing:1}}>⭐ PRO</div>
        </div>
        <h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0,letterSpacing:-0.5,lineHeight:1.1}}>Gestion Pro</h1>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',margin:'8px 0 0'}}>{u.company||u.name} · {pending.length} demande{pending.length!==1?'s':''} en attente</p>
      </div>
    </div>

    {/* Stats rapides */}
    <div style={{maxWidth:860,margin:'0 auto',padding:'0 14px 14px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {[{icon:'📋',val:pending.length,label:'En attente',col:'#D97706',bg:'#FEF3C7'},{icon:'✅',val:accepted.length,label:'Acceptées',col:'#059669',bg:'#d1fae5'},{icon:'🧾',val:invoices.filter(i=>i.status==='paid').length,label:'Factures payées',col:'#6C63FF',bg:'#ede9fe'}].map((k,i)=>(
          <div key={i} style={{...card,padding:'14px 12px'}}>
            <div style={{width:36,height:36,borderRadius:10,background:k.bg,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8}}>{k.icon}</div>
            <div style={{fontSize:22,fontWeight:800,color:'var(--dk)',lineHeight:1}}>{k.val}</div>
            <div style={{fontSize:11,color:'var(--g)',marginTop:3}}>{k.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Tabs */}
    <div style={{maxWidth:860,margin:'0 auto',padding:'0 14px 12px'}}>
      <div style={{...card,padding:'0 4px'}}>
        <div style={{display:'flex',overflowX:'auto'}}>
          {[{id:'demandes',label:'Demandes',icon:'📋'},{id:'calendrier',label:'Calendrier',icon:'📅'},{id:'facturation',label:'Facturation',icon:'🧾'}].map(t=>(
            <button key={t.id} onClick={()=>setGTab(t.id)} style={tabSt(gTab===t.id)}>
              {t.icon} {t.label}
              {t.id==='demandes'&&pending.length>0&&<span style={{marginLeft:5,background:'#D97706',color:'#fff',borderRadius:'50%',width:16,height:16,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700}}>{pending.length}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div style={{maxWidth:860,margin:'0 auto',padding:'0 14px',display:'flex',flexDirection:'column',gap:12}}>

      {/* ── DEMANDES ── */}
      {gTab==='demandes'&&<>
        {pending.length>0&&<div style={card}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid var(--bd)',display:'flex',alignItems:'center',gap:8}}>
            <div style={{fontSize:14,fontWeight:700,color:'var(--dk)'}}>En attente</div>
            <span style={{background:'#FEF3C7',color:'#D97706',borderRadius:20,padding:'2px 8px',fontSize:11,fontWeight:700}}>{pending.length}</span>
          </div>
          {pending.map((r,i)=>(
            <div key={r.id} style={{padding:'16px 18px',borderBottom:i<pending.length-1?'1px solid var(--bd)':'none',display:'flex',gap:14,alignItems:'flex-start',animation:`fadeSlideUp 0.35s ${i*0.06}s both`}}>
              <div style={{width:44,height:44,borderRadius:12,background:'#FEF3C7',fontSize:24,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{r.avatar}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:'var(--dk)',marginBottom:2}}>{r.item}</div>
                <div style={{fontSize:12,color:'var(--g)',marginBottom:3}}>👤 {r.renter} · 📅 {r.dates}</div>
                <div style={{fontSize:13,fontWeight:700,color:'#D97706'}}>{r.price}€ <span style={{fontWeight:400,fontSize:11,color:'var(--g)'}}>({r.days}j × {Math.round(r.price/r.days)}€/j)</span></div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
                <button onClick={()=>accept(r.id)} style={{padding:'8px 14px',background:'#10b981',color:'#fff',border:'none',borderRadius:9,fontSize:12,fontWeight:700,cursor:'pointer',transition:'opacity .15s'}} onMouseEnter={e=>e.currentTarget.style.opacity='.8'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>✓ Accepter</button>
                <button onClick={()=>refuse(r.id)} style={{padding:'8px 14px',background:'#f3f4f6',color:'#6b7280',border:'none',borderRadius:9,fontSize:12,fontWeight:600,cursor:'pointer',transition:'opacity .15s'}} onMouseEnter={e=>e.currentTarget.style.opacity='.7'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>✕ Refuser</button>
              </div>
            </div>
          ))}
        </div>}
        {accepted.length>0&&<div style={card}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid var(--bd)',display:'flex',alignItems:'center',gap:8}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--dk)'}}>Confirmées</div>
            <span style={{background:'#d1fae5',color:'#059669',borderRadius:20,padding:'2px 8px',fontSize:11,fontWeight:700}}>{accepted.length}</span>
          </div>
          {accepted.map((r,i)=>(
            <div key={r.id} style={{padding:'14px 18px',borderBottom:i<accepted.length-1?'1px solid var(--bd)':'none',display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:38,height:38,borderRadius:10,background:'#d1fae5',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{r.avatar}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'var(--dk)'}}>{r.item}</div>
                <div style={{fontSize:11,color:'var(--g)'}}>{r.renter} · {r.dates}</div>
              </div>
              <span style={{background:'#d1fae5',color:'#059669',borderRadius:20,padding:'4px 10px',fontSize:11,fontWeight:700,flexShrink:0}}>✓ Confirmée</span>
            </div>
          ))}
        </div>}
        {pending.length===0&&accepted.length===0&&<div style={{...card,padding:'40px',textAlign:'center'}}>
          <div style={{fontSize:36,marginBottom:8}}>📋</div>
          <div style={{fontSize:14,fontWeight:600,color:'var(--dk)',marginBottom:4}}>Aucune demande en attente</div>
          <div style={{fontSize:12,color:'var(--g)'}}>Les nouvelles réservations apparaîtront ici</div>
        </div>}
        {refused.length>0&&<div style={{...card,opacity:.7}}>
          <div style={{padding:'12px 18px',borderBottom:'1px solid var(--bd)',display:'flex',alignItems:'center',gap:8}}>
            <div style={{fontSize:12,fontWeight:700,color:'var(--dk)'}}>Refusées</div>
            <span style={{background:'#fee2e2',color:'#dc2626',borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:700}}>{refused.length}</span>
          </div>
          {refused.map((r,i)=>(
            <div key={r.id} style={{padding:'11px 18px',borderBottom:i<refused.length-1?'1px solid var(--bd)':'none',display:'flex',gap:10,alignItems:'center'}}>
              <div style={{fontSize:18}}>{r.avatar}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:'var(--dk)',textDecoration:'line-through'}}>{r.item}</div>
                <div style={{fontSize:11,color:'var(--g)'}}>{r.renter}</div>
              </div>
              <span style={{background:'#fee2e2',color:'#dc2626',borderRadius:20,padding:'3px 9px',fontSize:10,fontWeight:700,flexShrink:0}}>Refusée</span>
            </div>
          ))}
        </div>}
      </>}

      {/* ── CALENDRIER ── */}
      {gTab==='calendrier'&&<div style={card}>
        <div style={{padding:'14px 18px',borderBottom:'1px solid var(--bd)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button onClick={()=>{let m=calMonth-1,y=calYear;if(m<0){m=11;y--;}setCalMonth(m);setCalYear(y);}} style={{padding:'6px 12px',background:'var(--bg)',border:'none',borderRadius:9,cursor:'pointer',fontSize:14,fontWeight:600}}>‹</button>
          <div style={{fontSize:14,fontWeight:700,color:'var(--dk)'}}>{monthNames[calMonth]} {calYear}</div>
          <button onClick={()=>{let m=calMonth+1,y=calYear;if(m>11){m=0;y++;}setCalMonth(m);setCalYear(y);}} style={{padding:'6px 12px',background:'var(--bg)',border:'none',borderRadius:9,cursor:'pointer',fontSize:14,fontWeight:600}}>›</button>
        </div>
        <div style={{padding:'16px 18px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:8}}>
            {['L','M','M','J','V','S','D'].map((d,i)=>(
              <div key={i} style={{textAlign:'center',fontSize:10,fontWeight:700,color:'var(--g)',padding:'4px 0'}}>{d}</div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}}>
            {Array.from({length:firstMon}).map((_,i)=><div key={'e'+i}/>)}
            {Array.from({length:daysInMonth}).map((_,i)=>{
              const day=i+1;
              const isBooked=bookedDays.has(day);
              const isToday=isCurrentMonth&&day===todayD;
              return <div key={day} style={{height:36,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:9,fontSize:12,fontWeight:isToday?800:500,background:isBooked?'#FDE68A':isToday?'#D97706':'var(--bg)',color:isBooked?'#92400E':isToday?'#fff':'var(--dk)',border:isToday?'2px solid #D97706':'1px solid transparent',cursor:'pointer',transition:'all .15s'}} onMouseEnter={e=>{if(!isBooked&&!isToday)e.currentTarget.style.background='#FEF3C7';}} onMouseLeave={e=>{if(!isBooked&&!isToday)e.currentTarget.style.background='var(--bg)'}}>{day}</div>;
            })}
          </div>
          <div style={{display:'flex',gap:14,marginTop:14,paddingTop:12,borderTop:'1px solid var(--bd)'}}>
            {[['#FDE68A','#92400E','Réservé'],['#D97706','#fff','Aujourd\'hui'],['var(--bg)','var(--dk)','Disponible']].map(([bg,col,lbl])=>(
              <div key={lbl} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--g)'}}>
                <div style={{width:12,height:12,background:bg,borderRadius:3,border:'1px solid var(--bd)'}}/>
                {lbl}
              </div>
            ))}
          </div>
        </div>
      </div>}

      {/* ── FACTURATION ── */}
      {gTab==='facturation'&&<>
        <div style={card}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid var(--bd)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{fontSize:14,fontWeight:700,color:'var(--dk)'}}>Factures</div>
            <div style={{fontSize:12,fontWeight:700,color:'#D97706'}}>CA : {invoices.reduce((s,i)=>s+i.amount,0).toLocaleString()}€ HT</div>
          </div>
          {invoices.map((inv,i)=>(
            <div key={inv.id} style={{padding:'14px 18px',borderBottom:i<invoices.length-1?'1px solid var(--bd)':'none',display:'flex',gap:12,alignItems:'center',animation:`fadeSlideUp 0.35s ${i*0.06}s both`}}>
              <div style={{width:40,height:40,borderRadius:10,background:inv.status==='paid'?'#d1fae5':'#FEF3C7',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{inv.status==='paid'?'✅':'🕐'}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--dk)'}}>{inv.id}</div>
                  <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:20,background:inv.status==='paid'?'#d1fae5':'#FEF3C7',color:inv.status==='paid'?'#059669':'#D97706'}}>{inv.status==='paid'?'Payée':'En attente'}</span>
                </div>
                <div style={{fontSize:11,color:'var(--g)'}}>{inv.client} · {inv.date}</div>
                <div style={{fontSize:10,color:'var(--g)',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{inv.items.join(', ')}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5,flexShrink:0}}>
                <div style={{fontSize:15,fontWeight:800,color:'var(--dk)'}}>{inv.amount}€</div>
                <button onClick={()=>genInvoicePDF(inv)} style={{padding:'5px 10px',background:'#FFFBEB',color:'#D97706',border:'1px solid #FDE68A',borderRadius:7,fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4,transition:'opacity .15s'}} onMouseEnter={e=>e.currentTarget.style.opacity='.7'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:10,height:10}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  PDF
                </button>
              </div>
            </div>
          ))}
          <div style={{padding:'12px 18px',background:'#FFFBEB',borderTop:'1px solid #FDE68A',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontSize:12,color:'#92400E',fontWeight:500}}>Total TTC (TVA 20%)</div>
            <div style={{fontSize:16,fontWeight:800,color:'#D97706'}}>{Math.round(invoices.reduce((s,i)=>s+i.amount,0)*1.2).toLocaleString()}€</div>
          </div>
        </div>
      </>}

    </div>
  </div>;
}

function Dashboard({state,dispatch,setPage,goBack,setProfTab}){
  const u=state.user;
  const[qrItem,setQrItem]=useState(null);
  const myItems=[...state.items.filter(i=>i.owner?.id===u.id||(u.email&&i.owner?.email===u.email)),...state.userItems.filter(i=>i.owner?.id===u.id||(u.email&&i.owner?.email===u.email))];
  const myBookAsOwner=state.bookings.filter(b=>b.ownerId===u.id);
  const revenue=myBookAsOwner.filter(b=>b.status==="confirmed").reduce((s,b)=>s+b.total,0);
  const pending=myBookAsOwner.filter(b=>b.status==="pending").length;
  const months=["Jan","Fév","Mar","Avr","Mai","Juin","Jul","Août","Sep","Oct","Nov","Déc"];
  const curMonth=new Date().getMonth();
  // Dynamic monthly revenue from real bookings data
  const monthlyRevenue=new Array(12).fill(0);
  myBookAsOwner.filter(b=>b.status==="confirmed").forEach(b=>{
    const d=new Date(b.createdAt||b.date||Date.now());
    if(d.getFullYear()===new Date().getFullYear()) monthlyRevenue[d.getMonth()]+=b.total||0;
  });
  // Revenus mensuels réels uniquement (pas de données factices)
  const monthlyVals=monthlyRevenue;
  const maxVal=Math.max(...monthlyVals,1);
  const totalYear=monthlyVals.reduce((s,v)=>s+v,0);
  const catData=Object.entries(myItems.reduce((acc,it)=>{acc[it.cat]=(acc[it.cat]||0)+1;return acc},{}));
  const monthlyCounts=new Array(12).fill(0);
  myBookAsOwner.forEach(b=>{const d=new Date(b.createdAt||b.date||Date.now());if(d.getFullYear()===new Date().getFullYear())monthlyCounts[d.getMonth()]++;});
  const monthlyCountVals=monthlyCounts;
  const cumulativeVals=monthlyVals.reduce((acc,v,i)=>{acc.push((acc[i-1]||0)+v);return acc;},[]);
  const barRef=useRef(null);const pieRef=useRef(null);
  const barInst=useRef(null);const pieInst=useRef(null);
  const [chartType,setChartType]=useState("bar");
  const [chartMetrics,setChartMetrics]=useState(['monthly']);
  const toggleMetric=m=>setChartMetrics(prev=>prev.includes(m)?(prev.length>1?prev.filter(x=>x!==m):prev):[...prev,m]);
  const {dark}=useContext(Ctx);
  const chartColors=["#6C63FF","#4ECDC4","#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#C77DFF","#FF9F1C"];
  useEffect(()=>{
    if(!window.Chart||!barRef.current)return;
    if(barInst.current)barInst.current.destroy();
    const hasMonthly=chartMetrics.includes('monthly');
    const hasCount=chartMetrics.includes('count');
    const hasRevenue=chartMetrics.includes('revenue');
    const isLine=chartType==="line";
    const multiAxis=hasMonthly&&(hasCount||hasRevenue);
    const tooltipBg=dark?"rgba(30,27,75,0.97)":"rgba(255,255,255,0.98)";
    const tooltipTitle=dark?"#c4b5fd":"#6C63FF";
    const tooltipBody=dark?"#e5e7eb":"#111827";
    const tooltipBorder=dark?"rgba(108,99,255,0.4)":"rgba(108,99,255,0.25)";
    const datasets=[];
    if(hasMonthly){datasets.push({label:"Revenus (€)",data:monthlyVals,yAxisID:'y',...(isLine?{borderColor:"#6C63FF",backgroundColor:(ctx)=>{const g=ctx.chart.ctx.createLinearGradient(0,0,0,ctx.chart.height||170);g.addColorStop(0,"rgba(108,99,255,0.28)");g.addColorStop(1,"rgba(108,99,255,0)");return g;},fill:true,tension:0.42,borderWidth:2.5,pointRadius:monthlyVals.map((_,i)=>i===curMonth?8:6),pointHoverRadius:monthlyVals.map((_,i)=>i===curMonth?11:9),pointBackgroundColor:monthlyVals.map((_,i)=>i===curMonth?"#6C63FF":"#fff"),pointBorderColor:monthlyVals.map((_,i)=>i===curMonth?"#fff":"#6C63FF"),pointBorderWidth:monthlyVals.map((_,i)=>i===curMonth?3:2),pointHoverBackgroundColor:"#6C63FF",pointHoverBorderColor:"#fff",pointHoverBorderWidth:3}:{backgroundColor:monthlyVals.map((_,i)=>i===curMonth?"#6C63FF":i<curMonth?"rgba(108,99,255,0.35)":"rgba(108,99,255,0.1)"),borderRadius:6,borderSkipped:false,hoverBackgroundColor:monthlyVals.map((_,i)=>i===curMonth?"#5a53e0":"rgba(108,99,255,0.6)"),})});}
    if(hasCount){datasets.push({label:"Locations",type:"bar",data:monthlyCountVals,yAxisID:multiAxis?'y2':'y',backgroundColor:monthlyCountVals.map((_,i)=>i===curMonth?"#10b981":i<curMonth?"rgba(16,185,129,0.35)":"rgba(16,185,129,0.12)"),borderRadius:6,borderSkipped:false,hoverBackgroundColor:"rgba(16,185,129,0.6)"});}
    if(hasRevenue){datasets.push({label:"Cumul (€)",type:"line",data:cumulativeVals,yAxisID:multiAxis?'y2':'y',borderColor:"#F59E0B",backgroundColor:"rgba(245,158,11,0)",fill:false,tension:0.4,borderWidth:2,pointRadius:4,pointHoverRadius:6,pointBackgroundColor:"#F59E0B"});}
    barInst.current=new window.Chart(barRef.current,{
      type:hasMonthly&&isLine?"line":"bar",
      data:{labels:months,datasets},
      options:{
        responsive:true,maintainAspectRatio:false,
        animation:{duration:800,easing:"easeOutQuart"},
        interaction:{mode:"nearest",axis:"x",intersect:false},
        plugins:{
          legend:{display:datasets.length>1,labels:{font:{size:10},boxWidth:10,padding:12,color:dark?"#e5e7eb":"#374151"}},
          tooltip:{
            enabled:true,backgroundColor:tooltipBg,titleColor:tooltipTitle,bodyColor:tooltipBody,borderColor:tooltipBorder,borderWidth:1,
            padding:{top:10,bottom:10,left:14,right:14},cornerRadius:10,displayColors:datasets.length>1,caretSize:6,
            titleFont:{size:12,weight:"600",family:"'DM Sans',system-ui,sans-serif"},
            bodyFont:{size:15,weight:"800",family:"'DM Sans',system-ui,sans-serif"},
            callbacks:{
              title:t=>{const idx=t[0].dataIndex;const full=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];return full[idx]+(idx===curMonth?" · ce mois":"");},
              label:c=>"  "+(c.dataset.label.includes("€")?c.raw+"€":c.raw+" loc."),
            }
          }
        },
        scales:{
          x:{grid:{display:false},ticks:{font:{size:9},color:"#9ca3af"},border:{display:false}},
          y:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{callback:v=>v===0?"":(hasMonthly?v+"€":v),font:{size:9},color:"#9ca3af",maxTicksLimit:5},border:{display:false}},
          ...(multiAxis?{y2:{position:"right",grid:{display:false},ticks:{font:{size:9},color:"#9ca3af",maxTicksLimit:4},border:{display:false}}}:{}),
        }
      }
    });
    return()=>{if(barInst.current)barInst.current.destroy()};
  },[JSON.stringify(monthlyVals),JSON.stringify(monthlyCountVals),chartType,JSON.stringify(chartMetrics),dark]);
  useEffect(()=>{
    if(!window.Chart||!pieRef.current||catData.length===0)return;
    if(pieInst.current)pieInst.current.destroy();
    pieInst.current=new window.Chart(pieRef.current,{
      type:"doughnut",
      data:{labels:catData.map(([c])=>c),datasets:[{data:catData.map(([,v])=>v),backgroundColor:chartColors.slice(0,catData.length),borderWidth:3,borderColor:"#fff",hoverOffset:6}]},
      options:{responsive:true,maintainAspectRatio:false,animation:{duration:700},plugins:{legend:{position:"bottom",labels:{font:{size:10},boxWidth:8,padding:10,color:"#374151"}}},cutout:"68%"}
    });
    return()=>{if(pieInst.current)pieInst.current.destroy()};
  },[myItems.length]);
  const exportPDF=async()=>{
    if(!window.jspdf||!window.html2canvas){console.error("Dépendances PDF non chargées");return}
    const now=new Date().toLocaleDateString("fr-FR");
    const kpiData=[
      {icon:"💰",val:revenue+"€",label:"Revenus",sub:"confirmés",color:"#6C63FF",lightBg:"#ede9fe"},
      {icon:"📦",val:myItems.length,label:"Annonces",sub:"actives",color:"#0ea5e9",lightBg:"#e0f2fe"},
      {icon:"✅",val:myBookAsOwner.filter(b=>b.status==="confirmed").length,label:"Confirmées",sub:"locations",color:"#10b981",lightBg:"#d1fae5"},
      {icon:"⏳",val:pending,label:"En attente",sub:"à confirmer",color:"#f59e0b",lightBg:"#fef3c7"},
    ];
    const totalAnnuel=monthlyVals.reduce((a,b)=>a+b,0);
    const currentYear=new Date().getFullYear();
    const confirmedCount=myBookAsOwner.filter(b=>b.status==="confirmed").length;
    const pendingCount=myBookAsOwner.filter(b=>b.status==="pending").length;
    const wrapper=document.createElement("div");
    wrapper.style.cssText="position:absolute;left:-9999px;top:0;width:794px;background:#ffffff;font-family:'DM Sans',system-ui,sans-serif;";
    wrapper.innerHTML=`
      <div style="width:794px;background:#ffffff;padding:0;font-family:'DM Sans',system-ui,sans-serif;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#6C63FF 0%,#7c5ce7 50%,#4ECDC4 100%);padding:40px 40px 36px;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.08) 1px,transparent 1px);background-size:22px 22px;pointer-events:none;"></div>
          <div style="position:relative;">
            <div style="font-size:11px;color:rgba(255,255,255,0.65);font-weight:600;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Tableau de bord</div>
            <div style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.1;margin-bottom:6px;">Dashboard Cercle</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.75);font-weight:500;">${u.name} &nbsp;·&nbsp; Exporté le ${now}</div>
          </div>
        </div>
        <!-- Résumé global card -->
        <div style="padding:28px 40px 0;">
          <div style="background:linear-gradient(135deg,#f8f7ff,#f0f4ff);border-left:4px solid #6C63FF;border-radius:16px;padding:28px 32px;box-shadow:0 2px 20px rgba(108,99,255,0.10);display:flex;align-items:center;gap:32px;">
            <div style="font-size:48px;line-height:1;flex-shrink:0;">💰</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:14px;color:#9ca3af;font-weight:500;margin-bottom:4px;">Revenus totaux</div>
              <div style="font-size:42px;font-weight:800;color:#6C63FF;letter-spacing:-1px;line-height:1;">${totalAnnuel}€</div>
              <div style="font-size:12px;color:#9ca3af;font-style:italic;margin-top:4px;">Exercice ${currentYear}</div>
            </div>
            <div style="display:flex;gap:0;flex-shrink:0;">
              <div style="text-align:center;padding:0 24px;border-right:1px solid #e5e7eb;">
                <div style="font-size:11px;color:#9ca3af;margin-bottom:4px;">Annonces</div>
                <div style="font-size:22px;font-weight:700;color:#111827;">${myItems.length}</div>
              </div>
              <div style="text-align:center;padding:0 24px;border-right:1px solid #e5e7eb;">
                <div style="font-size:11px;color:#9ca3af;margin-bottom:4px;">Locations</div>
                <div style="font-size:22px;font-weight:700;color:#10b981;">${confirmedCount}</div>
              </div>
              <div style="text-align:center;padding:0 24px;">
                <div style="font-size:11px;color:#9ca3af;margin-bottom:4px;">En attente</div>
                <div style="font-size:22px;font-weight:700;color:#f59e0b;">${pendingCount}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- KPIs -->
        <div style="padding:24px 40px 24px;">
          <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:16px;">Indicateurs clés</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;">
            ${kpiData.map(k=>`
              <div style="background:#ffffff;border-radius:14px;padding:18px 20px;box-shadow:0 2px 16px rgba(0,0,0,0.07);border:1px solid rgba(0,0,0,0.05);">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                  <div style="width:38px;height:38px;border-radius:11px;background:${k.lightBg};display:flex;align-items:center;justify-content:center;font-size:18px;">${k.icon}</div>
                  <span style="font-size:10px;font-weight:700;color:${k.color};background:${k.lightBg};padding:3px 9px;border-radius:20px;">${k.sub}</span>
                </div>
                <div style="font-size:28px;font-weight:800;color:#111827;letter-spacing:-0.5px;line-height:1;">${k.val}</div>
                <div style="font-size:12px;color:#6b7280;margin-top:5px;">${k.label}</div>
              </div>`).join("")}
          </div>
        </div>
        <!-- Monthly revenue table -->
        <div style="padding:4px 40px 32px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1.2px;">Revenus mensuels — ${currentYear}</div>
            <span style="background:#6C63FF;color:white;border-radius:20px;padding:4px 16px;font-size:11px;font-weight:700;">Total ${currentYear} : ${totalAnnuel}€</span>
          </div>
          <div style="background:#ffffff;border-radius:14px;box-shadow:0 2px 16px rgba(0,0,0,0.07);border:1px solid rgba(0,0,0,0.05);overflow:hidden;">
            <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:0;">
              ${monthlyVals.map((v,i)=>{
                const isCur=i===curMonth;
                const barH=monthlyVals.length?Math.max(4,Math.round(v/Math.max(...monthlyVals,1)*48)):4;
                return`<div style="padding:14px 8px 12px;text-align:center;border-right:${i%6===5?"none":"1px solid #f3f4f6"};border-bottom:${i<6?"1px solid #f3f4f6":"none"};background:${isCur?"#f5f3ff":"#ffffff"};">
                  <div style="font-size:9px;font-weight:${isCur?700:500};color:${isCur?"#6C63FF":"#9ca3af"};margin-bottom:6px;">${months[i]}</div>
                  <div style="height:48px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:6px;">
                    <div style="width:20px;height:${barH}px;background:${isCur?"#6C63FF":v>0?"rgba(108,99,255,0.35)":"rgba(108,99,255,0.1)"};border-radius:4px 4px 0 0;"></div>
                  </div>
                  <div style="font-size:11px;font-weight:${isCur?700:600};color:${isCur?"#6C63FF":"#374151"};">${v}€</div>
                </div>`;
              }).join("")}
            </div>
            <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:0;background:#f3f0ff;border-top:2px solid #e0d9ff;">
              <div style="grid-column:1/5;padding:10px 16px;font-size:11px;font-weight:700;color:#6C63FF;">Total annuel</div>
              <div style="grid-column:5/7;padding:10px 16px;text-align:right;font-size:13px;font-weight:800;color:#6C63FF;">${totalAnnuel}€</div>
            </div>
          </div>
        </div>
        <!-- Footer -->
        <div style="padding:0 40px 32px;text-align:center;">
          <div style="border-top:1px solid #f3f4f6;padding-top:18px;font-size:10px;color:#d1d5db;letter-spacing:0.5px;">
            Généré le ${now} &nbsp;•&nbsp; Cercle — Location entre voisins
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrapper);
    try{
      const canvas=await window.html2canvas(wrapper.firstElementChild,{scale:2,useCORS:true,backgroundColor:"#ffffff",logging:false});
      const{jsPDF}=window.jspdf;
      const doc=new jsPDF({orientation:"portrait",unit:"px",format:"a4",hotfixes:["px_scaling"]});
      const pageW=doc.internal.pageSize.getWidth();
      const pageH=doc.internal.pageSize.getHeight();
      const imgW=pageW;
      const imgH=(canvas.height*pageW)/canvas.width;
      let y=0;
      if(imgH<=pageH){
        doc.addImage(canvas.toDataURL("image/png"),"PNG",0,0,imgW,imgH);
      }else{
        // multi-page if content is taller than one page
        let remaining=imgH;
        while(remaining>0){
          const sliceH=Math.min(remaining,pageH);
          const sliceCanvas=document.createElement("canvas");
          sliceCanvas.width=canvas.width;
          sliceCanvas.height=Math.round(sliceH*(canvas.height/imgH));
          const ctx=sliceCanvas.getContext("2d");
          ctx.drawImage(canvas,0,-Math.round(y*(canvas.height/imgH)));
          doc.addImage(sliceCanvas.toDataURL("image/png"),"PNG",0,0,imgW,sliceH);
          remaining-=sliceH;y+=sliceH;
          if(remaining>0)doc.addPage();
        }
      }
      doc.save(`cercle-dashboard-${now.replace(/\//g,"-")}.pdf`);
    }catch(e){
      console.error("PDF export error:",e);
      console.error("Erreur lors de l'export PDF.", e);
    }finally{
      document.body.removeChild(wrapper);
    }
  };
  const kpis=[
    {icon:"💰",val:revenue+"€",label:"Revenus",sub:"confirmés",color:"#6C63FF",bg:"linear-gradient(135deg,#ede9fe,#ddd6fe)"},
    {icon:"📦",val:myItems.length,label:"Annonces",sub:"actives",color:"#0ea5e9",bg:"linear-gradient(135deg,#e0f2fe,#bae6fd)"},
    {icon:"✅",val:myBookAsOwner.filter(b=>b.status==="confirmed").length,label:"Confirmées",sub:"locations",color:"#10b981",bg:"linear-gradient(135deg,#d1fae5,#a7f3d0)"},
    {icon:"⏳",val:pending,label:"En attente",sub:"à confirmer",color:"#f59e0b",bg:"linear-gradient(135deg,#fef3c7,#fde68a)"},
  ];
  const card={background:"var(--w)",borderRadius:18,boxShadow:"0 2px 20px rgba(0,0,0,0.07)",overflow:"hidden"};
  const dnav=[
    {ic:'📊',label:'Dashboard',active:true,on:null},
    {ic:'🏷️',label:'Mes annonces',on:()=>{setProfTab&&setProfTab('annonces');setPage('profile');}},
    {ic:'📅',label:'Réservations',on:()=>{setProfTab&&setProfTab('reservations');setPage('profile');}},
    {ic:'💬',label:'Messages',on:()=>setPage('messages')},
    {ic:'⭐',label:'Avis',on:()=>{setProfTab&&setProfTab('avis');setPage('profile');}},
    {ic:'🏅',label:'Mon Grade',on:()=>{setProfTab&&setProfTab('grade');setPage('profile');}},
    {ic:'🔔',label:'Notifications',on:()=>setPage('notifs')},
    {ic:'⚙️',label:'Paramètres',on:()=>{setProfTab&&setProfTab('parametres');setPage('profile');}},
  ];
  const confirmedCount=myBookAsOwner.filter(b=>b.status==="confirmed").length;
  const myItemIds=new Set(myItems.map(i=>i.id));
  const myRevs=state.reviews.filter(r=>myItemIds.has(r.itemId));
  const avgR=myRevs.length?(myRevs.reduce((s,r)=>s+r.rating,0)/myRevs.length).toFixed(1):'—';
  const recentBk=[...myBookAsOwner].reverse().slice(0,6);
  const dateStr=new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const statCards=[
    {label:'Locations réalisées',val:confirmedCount,accent:'#6C63FF',trend:confirmedCount>0?'↗ Ce mois-ci':'Aucune pour l\'instant'},
    {label:'Revenu total',val:revenue+' €',accent:'#5A4FE0',trend:revenue>0?'↗ Confirmé':'Vos gains apparaîtront ici'},
    {label:'Note moyenne',val:avgR+' ★',accent:'#F59E0B',trend:'Sur '+myRevs.length+' avis'},
    {label:'Annonces actives',val:myItems.length,accent:'#3B82F6',trend:myItems.length+' en ligne'},
  ];
  const qa=[
    {ic:'➕',title:'Publier une annonce',sub:'Mettez un objet en location',on:()=>setPage('create')},
    {ic:'📅',title:'Réservations',sub:pending+' en attente',on:()=>{setProfTab&&setProfTab('reservations');setPage('profile');}},
    {ic:'💬',title:'Messages',sub:'Voir mes conversations',on:()=>setPage('messages')},
    {ic:'👤',title:'Mon profil',sub:'Gérer mon compte',on:()=>setPage('profile')},
  ];
  const stBadge=(s)=>s==='confirmed'?{t:'Confirmée',c:'#16A34A',bg:'#dcfce7'}:s==='pending'?{t:'En attente',c:'#D97706',bg:'#fef3c7'}:{t:'Nouvelle',c:'#2563EB',bg:'#dbeafe'};
  const dcard={background:'var(--w)',border:'1px solid var(--bd)',borderRadius:18,boxShadow:'0 1px 8px rgba(0,0,0,0.05)'};
  return(
  <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex'}}>
    {/* ── Sidebar ── */}
    <aside style={{width:240,flexShrink:0,background:'var(--w)',borderRight:'1px solid var(--bd)',display:'flex',flexDirection:'column',padding:'20px 14px',position:'sticky',top:0,height:'100vh'}}>
      <a onClick={()=>setPage('home')} style={{display:'flex',alignItems:'center',gap:9,cursor:'pointer',textDecoration:'none',padding:'4px 6px',marginBottom:24}}>
        <img src={LOGO} alt="Cercle" style={{height:34,width:34,objectFit:'contain'}}/>
        <span style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:700,color:'var(--dk)',letterSpacing:'-.02em'}}>Cercle</span>
      </a>
      <nav style={{display:'flex',flexDirection:'column',gap:2,flex:1}}>
        {dnav.map(n=>(
          <button key={n.label} onClick={n.on||undefined} style={{display:'flex',alignItems:'center',gap:11,padding:'11px 12px',borderRadius:11,fontSize:13.5,fontWeight:n.active?700:500,color:n.active?'var(--p)':'var(--dk)',background:n.active?'rgba(108,99,255,0.10)':'transparent',border:'none',cursor:'pointer',textAlign:'left',width:'100%'}}>
            <span style={{fontSize:15}}>{n.ic}</span><span>{n.label}</span>
          </button>
        ))}
      </nav>
      <button onClick={()=>{if(window.auth)window.auth.signOut().catch(()=>{});dispatch({type:"LOGOUT"});setPage('home');}} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 12px',borderRadius:11,fontSize:13.5,fontWeight:600,color:'#ef4444',background:'transparent',border:'none',cursor:'pointer',textAlign:'left',width:'100%'}}><span style={{fontSize:15}}>🚪</span><span>Déconnexion</span></button>
    </aside>

    {/* ── Main ── */}
    <main style={{flex:1,minWidth:0,padding:'28px 32px',overflowY:'auto',height:'100vh'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24,gap:16,flexWrap:'wrap'}}>
        <div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:26,fontWeight:800,color:'var(--dk)',letterSpacing:'-.02em',margin:0}}>Bonjour, {(u.name||'').split(' ')[0]||'vous'} 👋</h1>
          <p style={{fontSize:13,color:'var(--g)',margin:'4px 0 0',textTransform:'capitalize'}}>{dateStr}</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={()=>setPage('notifs')} style={{width:42,height:42,borderRadius:'50%',background:'var(--w)',border:'1px solid var(--bd)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,cursor:'pointer'}}>🔔</button>
          <div onClick={()=>setPage('profile')} style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,#7B6CFF,#4ECDC4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:'#fff',cursor:'pointer'}}>{u.avatar||'👤'}</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
        {statCards.map(s=>(
          <div key={s.label} style={{...dcard,padding:'18px 18px',borderLeft:'4px solid '+s.accent}}>
            <div style={{fontSize:12,color:'var(--g)',fontWeight:500,marginBottom:8}}>{s.label}</div>
            <div style={{fontSize:26,fontWeight:800,color:'var(--dk)',letterSpacing:'-.02em',lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:11,color:s.accent,fontWeight:600,marginTop:8}}>{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Chart + Quick actions */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16,marginBottom:20}}>
        <div style={{...dcard,padding:'20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:4}}>
            <div style={{fontSize:15,fontWeight:700,color:'var(--dk)'}}>Revenus mensuels</div>
            <div style={{fontSize:12,color:'var(--g)'}}>Total {totalYear} €</div>
          </div>
          <div style={{fontSize:12,color:'var(--g)',marginBottom:14}}>Les 12 derniers mois</div>
          <div style={{height:240}}><canvas ref={barRef}/></div>
        </div>
        <div style={{...dcard,padding:'20px'}}>
          <div style={{fontSize:15,fontWeight:700,color:'var(--dk)',marginBottom:14}}>Actions rapides</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {qa.map(a=>(
              <button key={a.title} onClick={a.on} style={{display:'flex',alignItems:'center',gap:12,padding:'12px',borderRadius:13,background:'var(--bg)',border:'1px solid var(--bd)',cursor:'pointer',textAlign:'left',width:'100%',transition:'background .15s'}} onMouseEnter={e=>e.currentTarget.style.background='#f3f1ff'} onMouseLeave={e=>e.currentTarget.style.background='var(--bg)'}>
                <div style={{width:36,height:36,borderRadius:10,background:'#ede9fe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>{a.ic}</div>
                <div style={{minWidth:0}}><div style={{fontSize:13.5,fontWeight:700,color:'var(--dk)'}}>{a.title}</div><div style={{fontSize:11.5,color:'var(--g)'}}>{a.sub}</div></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent reservations */}
      <div style={{...dcard,padding:'20px'}}>
        <div style={{fontSize:15,fontWeight:700,color:'var(--dk)',marginBottom:16}}>Réservations récentes</div>
        {recentBk.length===0
          ? <div style={{textAlign:'center',padding:'30px 0',color:'var(--g)',fontSize:13}}>Aucune réservation pour l'instant.</div>
          : <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead><tr style={{textAlign:'left',color:'var(--g)',fontSize:11,textTransform:'uppercase',letterSpacing:'.05em'}}>
                  <th style={{padding:'0 0 12px',fontWeight:600}}>Objet</th>
                  <th style={{padding:'0 0 12px',fontWeight:600}}>Locataire</th>
                  <th style={{padding:'0 0 12px',fontWeight:600}}>Dates</th>
                  <th style={{padding:'0 0 12px',fontWeight:600}}>Montant</th>
                  <th style={{padding:'0 0 12px',fontWeight:600}}>Statut</th>
                </tr></thead>
                <tbody>
                  {recentBk.map(b=>{const sb=stBadge(b.status);return(
                    <tr key={b.id} style={{borderTop:'1px solid var(--bg)'}}>
                      <td style={{padding:'12px 0',fontWeight:700,color:'var(--dk)'}}>{b.itemTitle||'Objet'}</td>
                      <td style={{padding:'12px 0',color:'var(--g)'}}>{b.userName||'Locataire'}</td>
                      <td style={{padding:'12px 0',color:'var(--g)'}}>{b.startDate?new Date(b.startDate).toLocaleDateString('fr-FR',{day:'numeric',month:'short'}):'—'}{b.endDate?' – '+new Date(b.endDate).toLocaleDateString('fr-FR',{day:'numeric',month:'short'}):''}</td>
                      <td style={{padding:'12px 0',fontWeight:700,color:'var(--dk)'}}>{b.total||0} €</td>
                      <td style={{padding:'12px 0'}}><span style={{fontSize:11,fontWeight:700,color:sb.c,background:sb.bg,padding:'4px 10px',borderRadius:20}}>{sb.t}</span></td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
        }
      </div>
      {qrItem&&<QRModal item={qrItem} onClose={()=>setQrItem(null)}/>}
    </main>
  </div>
  );
}

/* ===== REFERRAL ===== */
function ReferralPage({state,dispatch,setPage,goBack}){
  const[copied,setCopied]=useState(false);const[friendName,setFriendName]=useState("");
  const code=state.user?.refCode||"CERCLE";
  const totalBonus=state.referrals.reduce((s,r)=>s+r.bonus,0);
  const copy=()=>{navigator.clipboard?.writeText(code).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2000)};
  const invite=()=>{if(!friendName)return;dispatch({type:"REFERRAL",name:friendName});setFriendName("")};
  return <div style={{maxWidth:540,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={goBack}><I.Back/> Retour</button>
    <h1 style={{fontFamily:"var(--fd)",fontSize:22,marginBottom:6}}>⭐ Parrainage</h1>
    <p style={{fontSize:13,color:"var(--g)",marginBottom:16}}>Invitez vos amis et gagnez 5€ de crédit par filleul inscrit !</p>
    <div style={{background:"linear-gradient(135deg,#FEF3C7,#FFFBEB)",borderRadius:14,padding:20,textAlign:"center",marginBottom:16}}>
      <div style={{fontSize:11,fontWeight:700,marginBottom:6}}>VOTRE CODE PARRAIN</div>
      <div style={{fontFamily:"var(--fd)",fontSize:32,fontWeight:700,letterSpacing:4,marginBottom:8}}>{code}</div>
      <button className="bp" style={{fontSize:12,padding:"8px 20px"}} onClick={copy}>{copied?"✓ Copié !":"📋 Copier le code"}</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
      <div style={{border:"1.5px solid var(--bd)",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:24}}>👥</div><div style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:700}}>{state.referrals.length}</div><div style={{fontSize:10,color:"var(--g)"}}>Filleuls</div></div>
      <div style={{border:"1.5px solid var(--bd)",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:24}}>💰</div><div style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:700,color:"var(--acc)"}}>{totalBonus}€</div><div style={{fontSize:10,color:"var(--g)"}}>Gagnés</div></div>
    </div>
    <div className="fg"><label>Inviter un ami par email ou lien</label><div style={{display:"flex",gap:6}}><input value={friendName} onChange={e=>setFriendName(e.target.value)} placeholder="Nom de votre ami"/><button className="bp" style={{fontSize:12,padding:"8px 14px",flexShrink:0}} onClick={invite}>Inviter</button></div></div>
    {state.referrals.length>0&&<><h3 style={{fontFamily:"var(--fd)",fontSize:15,marginTop:12,marginBottom:8}}>Historique</h3>
    {state.referrals.map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",padding:10,border:"1px solid var(--bd)",borderRadius:8,marginBottom:4,fontSize:13}}><span>👤 {r.name} · {ds(r.date)}</span><span style={{color:"var(--acc)",fontWeight:700}}>+{r.bonus}€</span></div>)}</>}
  </div>
}

/* ===== VERIFY ID ===== */
function VerifyId({state,dispatch,setPage,goBack}){
  const[step,setStep]=useState(state.user?.verified?3:0);const[doc,setDoc]=useState("cni");
  useEffect(()=>{if(step===1){const t=setTimeout(()=>setStep(2),1500);return()=>clearTimeout(t)}},[step]);
  return <div style={{maxWidth:500,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={goBack}><I.Back/> Retour</button>
    <h1 style={{fontFamily:"var(--fd)",fontSize:22,marginBottom:16}}>🆔 Vérification d'identité</h1>
    {step===3||state.user?.verified?<div style={{textAlign:"center",padding:30}}><span style={{fontSize:48}}>✅</span><h2 style={{fontFamily:"var(--fd)",marginTop:8}}>Identité vérifiée</h2><p style={{fontSize:13,color:"var(--g)",marginTop:4}}>Votre profil affiche maintenant le badge ✓</p></div>:
    step===0?<><p style={{fontSize:13,color:"var(--g)",marginBottom:14}}>Pour la sécurité de la communauté, vérifiez votre identité.</p>
      <div style={{display:"flex",gap:8,marginBottom:16}}>{[["cni","🪪 CNI"],["passport","📘 Passeport"],["license","🚗 Permis"]].map(([id,l])=><button key={id} className={"pill"+(doc===id?" on":"")} onClick={()=>setDoc(id)}>{l}</button>)}</div>
      <div style={{background:"var(--bgw)",borderRadius:12,padding:24,textAlign:"center",marginBottom:16,border:"2px dashed var(--bd)"}}><span style={{fontSize:32}}>📸</span><p style={{fontSize:12,color:"var(--g)",marginTop:6}}>Photo du document (simulé)</p></div>
      <button className="bp" style={{width:"100%"}} onClick={()=>setStep(1)}>Envoyer le document</button></>:
    step===1?<div style={{textAlign:"center",padding:30}}><div style={{fontSize:40,animation:"spin 1s linear infinite"}}>⏳</div><style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      <h2 style={{fontFamily:"var(--fd)",marginTop:12}}>Vérification en cours...</h2><p style={{fontSize:13,color:"var(--g)",marginTop:4}}>Cela prend quelques secondes</p>
      </div>:
    step===2?<div style={{textAlign:"center",padding:30}}><span style={{fontSize:48}}>✅</span><h2 style={{fontFamily:"var(--fd)",marginTop:8}}>Document accepté !</h2>
      <button className="bp" style={{marginTop:14}} onClick={()=>{dispatch({type:"VERIFY_ID"});setStep(3)}}>Finaliser la vérification</button></div>:null}
  </div>
}

/* ===== DISPUTE ===== */
function DisputePage({state,dispatch,setPage,goBack}){
  const[reason,setReason]=useState("");const[bookId,setBookId]=useState("");const[desc,setDesc]=useState("");
  const myBook=state.bookings.filter(b=>b.userId===state.user?.id||b.ownerId===state.user?.id);
  const submit=()=>{if(!reason||!bookId)return;dispatch({type:"DISPUTE",payload:{id:uid(),bookingId:bookId,reason,desc,status:"open",by:state.user.id,date:new Date()}});setReason("");setDesc("")};
  return <div style={{maxWidth:540,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={goBack}><I.Back/> Retour</button>
    <h1 style={{fontFamily:"var(--fd)",fontSize:22,marginBottom:6}}>⚖️ Litiges</h1>
    <p style={{fontSize:13,color:"var(--g)",marginBottom:16}}>Ouvrez un litige si un problème survient lors d'une location.</p>
    <div className="fg"><label>Réservation concernée</label><select value={bookId} onChange={e=>setBookId(e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1.5px solid var(--bd)",borderRadius:9,fontSize:13}}><option value="">Sélectionner...</option>{myBook.map(b=><option key={b.id} value={b.id}>{b.itemTitle} ({b.startDate})</option>)}</select></div>
    <div className="fg"><label>Motif</label><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["Objet endommagé","Non conforme","Non restitué","Caution injustifiée","Autre"].map(r=><button key={r} className={"pill"+(reason===r?" on":"")} onClick={()=>setReason(r)}>{r}</button>)}</div></div>
    <div className="fg"><label>Description</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Décrivez le problème..." rows={3}/></div>
    <button className="bp" style={{width:"100%"}} onClick={submit}>Ouvrir le litige</button>
    {state.disputes.length>0&&<><h3 style={{fontFamily:"var(--fd)",fontSize:15,marginTop:20,marginBottom:8}}>Mes litiges</h3>
    {state.disputes.map(d=><div key={d.id} style={{padding:12,border:"1.5px solid var(--bd)",borderRadius:10,marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600,fontSize:13}}>{d.reason}</span><span style={{fontSize:11,padding:"2px 8px",borderRadius:6,fontWeight:600,background:d.status==="open"?"#FEF3C7":"#ECFDF5",color:d.status==="open"?"#92400E":"var(--acc)"}}>{d.status==="open"?"⏳ En cours":"✓ Résolu"}</span></div>
      <div style={{fontSize:11,color:"var(--g)",marginTop:2}}>{ds(d.date)}{d.desc&&" · "+d.desc}</div>
      {d.status==="open"&&<button className="cl" style={{fontSize:11,marginTop:6}} onClick={()=>dispatch({type:"RESOLVE_DISPUTE",id:d.id})}>Marquer résolu</button>}
    </div>)}</>}
  </div>
}



/* ===== FULLSCREEN GALLERY ===== */
function Gallery({images,start,onClose}){
  const[idx,setIdx]=useState(start||0);
  useEffect(()=>{const h=e=>{if(e.key==="Escape")onClose();if(e.key==="ArrowRight")setIdx(i=>(i+1)%images.length);if(e.key==="ArrowLeft")setIdx(i=>(i-1+images.length)%images.length)};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[]);
  const content=<div className="gallery-fs" onClick={onClose}>
    <button className="gf-close" onClick={onClose}><I.X/></button>
    <button className="gf-nav l" onClick={e=>{e.stopPropagation();setIdx(i=>(i-1+images.length)%images.length)}}>‹</button>
    <img src={images[idx]} alt="" onClick={e=>e.stopPropagation()}/>
    <button className="gf-nav r" onClick={e=>{e.stopPropagation();setIdx(i=>(i+1)%images.length)}}>›</button>
    <div className="gf-counter">{idx+1} / {images.length}</div>
    <div className="gf-dots">{images.map((_,i)=><div key={i} className={"gf-dot"+(i===idx?" on":"")} onClick={e=>{e.stopPropagation();setIdx(i)}}/>)}</div>
  </div>;
  return ReactDOM.createPortal(content,document.body);
}

/* ===== CHATBOT ===== */
function Chatbot({items,onOpen,onClose}){
  const[msgs,setMsgs]=useState([{from:"bot",text:"Bonjour ! 👋 Je suis l'assistant Cercle.\n\nDites-moi ce que vous cherchez à louer !\n\nExemples :\n• \"perceuse\" ou \"bricolage\"\n• \"vélo\" ou \"transport\"\n• \"fête\" ou \"anniversaire\"\n• \"prix\" pour les moins chers\n• \"aide\" pour comprendre le fonctionnement"}]);
  const[input,setInput]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs.length]);
  const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const KW={tools:["bricolage","perceuse","visseuse","ponceuse","echelle","nettoyeur","karcher","outil","percer","poncer","scie","tournevis","marteau","cle","compresseur","meuleuse"],electronics:["electronique","drone","console","ps5","xbox","projecteur","videoprojecteur","enceinte","jbl","bluetooth","tv","ecran","son","haut-parleur","camera"],vehicles:["vehicule","voiture","camion","camionnette","velo","trottinette","scooter","remorque","transport","utilitaire","fourgon","moto"],sports:["sport","paddle","ski","kayak","vtt","velo","surf","planche","raquette","fitness","musculation","boxe","randonnee","escalade"],garden:["jardin","tondeuse","taille-haie","taille haie","motoculteur","arrosage","plante","herbe","pelouse","haie","debroussailleuse","souffleur"],events:["evenement","fete","mariage","anniversaire","chaise","tonnelle","barbe a papa","sono","dj","decoration","party","bapteme","reception"],music:["musique","guitare","piano","platine","dj","instrument","clavier","batterie","micro","ampli","synthetiseur"],gaming:["jeu","gaming","console","casque vr","meta quest","volant","manette","ps5","xbox","nintendo","playstation","jeux video"],baby:["bebe","poussette","siege auto","enfant","landau","berceau","biberon","puericulture"],fashion:["mode","robe","costume","vetement","habit","sezane","hugo boss","tenue","smoking"],camping:["camping","tente","glaciere","sac de couchage","randonnee","bivouac","plein air","hamac","rechaud"],kitchen:["cuisine","robot","kitchenaid","raclette","fondue","patissier","mixer","blender","thermomix","plancha"],photo:["photo","appareil","camera","canon","stabilisateur","trepied","objectif","reflex","video","gopro","nikon","sony"],diy:["creatif","couture","coudre","imprimante 3d","singer","machine","impression","diy","art","broder"]};
  const findItems=(q)=>{
    const words=norm(q).split(/\s+/).filter(w=>w.length>1);
    if(words.length===0)return[];
    let scored=items.map(item=>{let score=0;const t=norm(item.title);const d=norm(item.description||"");const c=item.cat;
      words.forEach(w=>{
        if(t.includes(w))score+=10;
        if(w.length>=3&&t.split(/\s+/).some(tw=>tw.startsWith(w)||w.startsWith(tw)))score+=6;
        if(d.includes(w))score+=3;
        if(c.includes(w))score+=5;
        Object.entries(KW).forEach(([cat,kws])=>{if(kws.some(k=>k.includes(w)||w.includes(k)||(w.length>=3&&k.startsWith(w)))){if(item.cat===cat)score+=8}})
      });
      return{item,score}}).filter(s=>s.score>0).sort((a,b)=>b.score-a.score);
    return scored.slice(0,4).map(s=>s.item);
  };
  const getCatFromQ=(q)=>{const ql=norm(q);let best=null,bestN=0;Object.entries(KW).forEach(([cat,kws])=>{const n=kws.filter(k=>ql.includes(k)||(k.length>=3&&ql.split(/\s+/).some(w=>k.includes(w)||w.includes(k)))).length;if(n>bestN){bestN=n;best=cat}});return best};
  const send=()=>{if(!input.trim())return;const q=input.trim();const ql=norm(q);setMsgs(p=>[...p,{from:"user",text:q}]);setInput("");
    setTimeout(()=>{
      if(["bonjour","salut","hello","hi","hey","coucou","yo"].some(g=>ql.includes(g))){setMsgs(p=>[...p,{from:"bot",text:"Bonjour ! 😊 Comment puis-je vous aider ?\n\nDites-moi ce que vous voulez louer, par exemple :\n\"perceuse\", \"vélo\", \"sono pour une fête\"..."}]);return}
      if(["merci","thanks","super","genial","parfait","cool"].some(g=>ql.includes(g))){setMsgs(p=>[...p,{from:"bot",text:"Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions."}]);return}
      if(["prix","combien","budget","cher","pas cher","moins cher","economique","cheap"].some(g=>ql.includes(g))){const sorted=[...items].sort((a,b)=>a.price-b.price);setMsgs(p=>[...p,{from:"bot",text:`💰 Les prix vont de ${sorted[0]?.price}€ à ${sorted[sorted.length-1]?.price}€ par jour.\n\nVoici les plus abordables :`,items:sorted.slice(0,4)}]);return}
      if(["caution","depot","garantie","remboursement","rembourse"].some(g=>ql.includes(g))){setMsgs(p=>[...p,{from:"bot",text:"🔒 Caution\n\nLa caution est bloquée lors de la réservation et restituée sous 48h après le retour de l'objet en bon état.\n\nLe propriétaire la libère depuis son espace."}]);return}
      if(["aide","comment","fonctionn","utiliser","marche","expliqu"].some(g=>ql.includes(g))){setMsgs(p=>[...p,{from:"bot",text:"📖 Comment ça marche ?\n\n1️⃣ Trouvez un objet à louer\n2️⃣ Réservez et payez en ligne (paiement sécurisé)\n3️⃣ Récupérez l'objet chez le propriétaire\n4️⃣ Profitez-en pendant la durée !\n5️⃣ Rendez-le → caution restituée 🎉\n\nBesoin d'autre chose ?"}]);return}
      if(["populaire","tendance","top","meilleur","mieux note"].some(g=>ql.includes(g))){const top=[...items].sort((a,b)=>b.rating-a.rating).slice(0,4);setMsgs(p=>[...p,{from:"bot",text:"🔥 Top annonces les mieux notées :",items:top}]);return}
      if(["nouveau","recent","dernier","neuf"].some(g=>ql.includes(g))){const recent=items.filter(i=>i.condition==="Comme neuf").slice(0,4);setMsgs(p=>[...p,{from:"bot",text:"✨ Objets en état \"Comme neuf\" :",items:recent.length>0?recent:items.slice(0,4)}]);return}
      const found=findItems(q);
      if(found.length>0){setMsgs(p=>[...p,{from:"bot",text:`J'ai trouvé ${found.length} résultat${found.length>1?"s":""} pour "${q}" 🎯`,items:found}])}
      else{const cat=getCatFromQ(q);
        if(cat){const catItems=items.filter(i=>i.cat===cat).slice(0,4);if(catItems.length>0){setMsgs(p=>[...p,{from:"bot",text:`Dans la catégorie ${CATS.find(c=>c.id===cat)?.label||cat} :`,items:catItems}])}else{setMsgs(p=>[...p,{from:"bot",text:`Hmm, rien trouvé dans cette catégorie. Essayez d'autres mots-clés !`}])}}
        else{const suggestions=items.sort(()=>Math.random()-.5).slice(0,3);setMsgs(p=>[...p,{from:"bot",text:`Je n'ai pas trouvé de résultat pour "${q}" 😅\n\nEssayez avec :\n• Un nom d'objet : perceuse, vélo, drone\n• Une catégorie : bricolage, sport, musique\n• Un mot-clé : fête, photo, camping\n\nVoici quelques suggestions :`,items:suggestions}])}}
    },400+Math.random()*200)};
  return <div className="chatbot-w">
    <div className="chatbot-hd"><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>🤖</span><div><div style={{fontWeight:700,fontSize:14}}>Assistant Cercle</div><div style={{fontSize:10,opacity:.8}}>En ligne · Réponse instantanée</div></div></div><button style={{background:"none",border:"none",color:"#fff",fontSize:18,cursor:"pointer"}} onClick={onClose}>✕</button></div>
    <div className="chatbot-bd" ref={ref}>{msgs.map((m,i)=><div key={i}><div className={"chatbot-msg "+(m.from)} style={{whiteSpace:"pre-line"}}>{m.text}</div>
      {m.items&&<div style={{display:"flex",flexDirection:"column",gap:4,marginTop:6}}>{m.items.map(it=><div key={it.id} style={{display:"flex",gap:8,padding:8,background:"var(--bg)",borderRadius:12,cursor:"pointer",fontSize:12,transition:"all .15s",border:"1px solid var(--bd)"}} onClick={()=>onOpen(it)} onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.borderColor="var(--p)"}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.borderColor="var(--bd)"}}><img src={it.images[0]} alt="" style={{width:48,height:36,objectFit:"cover",borderRadius:8,flexShrink:0}}/><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.title}</div><div style={{display:"flex",justifyContent:"space-between",marginTop:2}}><span style={{color:"var(--p)",fontWeight:700}}>{it.price}€/j</span><span style={{color:"var(--g)"}}>{it.reviews>0?"★ "+it.rating:"✨ Nouveau"}</span></div></div></div>)}</div>}
    </div>)}</div>
    <div className="chatbot-ft"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Que cherchez-vous à louer ?" onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}><I.Send/></button></div>
  </div>
}

/* ===== OWNER SHOP ===== */
function Shop({owner,items,onClose,onOpen,state,dispatch,onAuthRequired}){
  const ownerItems=items.filter(i=>i.owner?.id===owner.id);
  const grade=getGrade(owner.rentals||0);
  const gradeColor=grade.id==="fondateur"?"#D4AF37":grade.id==="legende"?"#06B6D4":grade.id==="gardien"?"#7C3AED":grade.id==="pilier"?"#F59E0B":grade.id==="habitant"?"#3b82f6":"#6C63FF";
  const isFollowing=state.following?.some(f=>f.id===owner.id);
  const avgRating=owner.rating||0;
  return <div className="ov" style={{background:"var(--bg)"}}>
    {/* Header sticky */}
    <div style={{position:"sticky",top:0,zIndex:20,display:"flex",alignItems:"center",padding:"12px 16px",background:"rgba(255,255,255,0.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--bd)"}}>
      <button className="mx" onClick={onClose}><I.X/></button>
    </div>

    {/* Hero */}
    <div style={{background:`linear-gradient(145deg, ${gradeColor}22 0%, #f5f3ff 100%)`,padding:"32px 20px 24px",textAlign:"center",borderBottom:"1px solid var(--bd)"}}>
      <div style={{position:"relative",display:"inline-block",marginBottom:14}}>
        <div style={{width:88,height:88,borderRadius:"50%",border:`3px solid ${gradeColor}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,background:"#fff",boxShadow:`0 0 0 4px ${gradeColor}22`}}>
          {owner.avatarUrl?<img src={owner.avatarUrl} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:owner.avatar||"👤"}
        </div>
        {owner.verified&&<div style={{position:"absolute",bottom:2,right:2,width:22,height:22,borderRadius:"50%",background:"#10b981",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700}}>✓</div>}
      </div>
      <h2 style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:800,color:"var(--dk)",margin:"0 0 4px"}}>{owner.name}</h2>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#fff",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600,color:gradeColor,boxShadow:"0 1px 6px rgba(0,0,0,0.08)",marginBottom:10}}>
        <span>{grade.icon}</span><span>{grade.name}</span>
      </div>
      {owner.bio&&<p style={{fontSize:13,color:"var(--g)",maxWidth:280,margin:"8px auto 0",lineHeight:1.6}}>{owner.bio}</p>}
      {state.user&&state.user.id!==owner.id&&<button onClick={()=>dispatch({type:isFollowing?"UNFOLLOW":"FOLLOW",userId:owner.id,ownerEmail:owner.email,userName:owner.name,userAvatar:owner.avatar,userSince:owner.since})} style={{marginTop:14,padding:"10px 28px",borderRadius:24,border:`1.5px solid ${isFollowing?"#e5e7eb":"var(--p)"}`,background:isFollowing?"var(--bg)":"var(--p)",color:isFollowing?"var(--g)":"#fff",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .15s",boxShadow:isFollowing?"none":"0 4px 14px rgba(108,99,255,0.3)"}}>{isFollowing?"✓ Abonné":"+ Suivre"}</button>}
    </div>

    {/* Stats */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,padding:"16px",background:"var(--w)",borderBottom:"1px solid var(--bd)"}}>
      {[["⭐",avgRating>0?avgRating.toFixed(1):"—","Note"],[  "📦",ownerItems.length,"Annonces"],["🔁",owner.rentals||0,"Locations"]].map(([ic,val,label])=>(
        <div key={label} style={{textAlign:"center",padding:"12px 8px",background:"var(--bg)",borderRadius:14}}>
          <div style={{fontSize:18,marginBottom:2}}>{ic}</div>
          <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800,color:"var(--dk)"}}>{val}</div>
          <div style={{fontSize:10,color:"var(--g)",fontWeight:500}}>{label}</div>
        </div>
      ))}
    </div>

    {/* Annonces */}
    <div style={{padding:"20px 16px"}}>
      <p style={{fontSize:13,fontWeight:700,color:"var(--g)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:14}}>{ownerItems.length} annonce{ownerItems.length!==1?"s":""}</p>
      {ownerItems.length===0
        ?<div style={{textAlign:"center",padding:"40px 0",color:"var(--g)"}}><div style={{fontSize:40,marginBottom:10}}>📭</div><p style={{fontWeight:600}}>Aucune annonce pour l'instant</p></div>
        :<div className="grid" style={{padding:0}}>{ownerItems.map(i=><Card key={i.id} item={i} onOpen={onOpen} favs={state.favorites} dispatch={dispatch} onAuthRequired={state.user?null:onAuthRequired}/>)}</div>
      }
    </div>
  </div>
}

/* ===== WALLET ===== */
function WalletPage({state,dispatch,setPage,goBack}){
  const[amount,setAmount]=useState("");
  return <div style={{maxWidth:540,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={goBack}><I.Back/> Retour</button>
    <h1 style={{fontFamily:"var(--fd)",fontSize:22,marginBottom:16}}>💳 Mon Wallet</h1>
    <div className="wallet-c">
      <div style={{fontSize:11,opacity:.7,marginBottom:4}}>Solde disponible</div>
      <div className="wallet-bal">{state.wallet} €</div>
      <div style={{display:"flex",gap:8,marginTop:14}}>{[10,25,50,100].map(v=><button key={v} style={{flex:1,padding:"8px",background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.2)",borderRadius:8,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}} onClick={()=>dispatch({type:"ADD_WALLET",amount:v})}>+{v}€</button>)}</div>
    </div>
    <div className="fg"><label>Montant personnalisé</label><div style={{display:"flex",gap:6}}><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Ex: 30"/><button className="bp" style={{fontSize:12,padding:"8px 16px",flexShrink:0}} onClick={()=>{if(+amount>0){dispatch({type:"ADD_WALLET",amount:+amount});setAmount("")}}}>Recharger</button></div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
      <div style={{padding:14,border:"1.5px solid var(--bd)",borderRadius:12,textAlign:"center"}}><div style={{fontSize:10,color:"var(--g)"}}>Crédits parrainage</div><div style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:700,color:"var(--acc)"}}>{state.referrals.reduce((s,r)=>s+r.bonus,0)}€</div></div>
      <div style={{padding:14,border:"1.5px solid var(--bd)",borderRadius:12,textAlign:"center"}}><div style={{fontSize:10,color:"var(--g)"}}>Total rechargé</div><div style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:700}}>{state.wallet}€</div></div>
    </div>
  </div>
}

/* ===== BADGES ===== */
const ALL_BADGES=[
  {id:"first_rental",name:"Première location",icon:"🎉",desc:"Réservez votre premier objet"},
  {id:"explorer",name:"Explorateur",icon:"🔍",desc:"Consultez 10 annonces"},
  {id:"social",name:"Social",icon:"💬",desc:"Envoyez votre premier message"},
  {id:"verified",name:"Vérifié",icon:"✅",desc:"Vérifiez votre identité"},
  {id:"super_renter",name:"Super locataire",icon:"⭐",desc:"5 locations confirmées"},
  {id:"ambassador",name:"Ambassadeur",icon:"🎁",desc:"Parrainez un ami"},
  {id:"collector",name:"Collectionneur",icon:"❤️",desc:"10 favoris"},
  {id:"reviewer",name:"Critique",icon:"📝",desc:"Laissez votre premier avis"},
  {id:"big_spender",name:"Gros client",icon:"💎",desc:"Dépensez 500€"},
  {id:"loyal",name:"Fidèle",icon:"🏆",desc:"Atteignez le grade Or"},
];
function BadgesPage({state,setPage,goBack}){
  return <div style={{maxWidth:540,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={goBack}><I.Back/> Retour</button>
    <h1 style={{fontFamily:"var(--fd)",fontSize:22,marginBottom:6}}>🏅 Mes Badges</h1>
    <p style={{fontSize:13,color:"var(--g)",marginBottom:16}}>{state.badges.length}/{ALL_BADGES.length} débloqués</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {ALL_BADGES.map(b=>{const has=state.badges.includes(b.id);return <div key={b.id} style={{padding:16,border:`1.5px solid ${has?"var(--acc)":"var(--bd)"}`,borderRadius:12,textAlign:"center",opacity:has?1:.45,background:has?"#ECFDF5":"var(--w)",transition:"all .2s",animation:has?"popIn .3s ease":"none"}}>
        <div style={{fontSize:28,marginBottom:4}}>{b.icon}</div>
        <div style={{fontSize:13,fontWeight:700}}>{b.name}</div>
        <div style={{fontSize:10,color:"var(--g)",marginTop:2}}>{b.desc}</div>
        {has&&<div style={{fontSize:9,color:"var(--acc)",fontWeight:700,marginTop:4}}>✓ DÉBLOQUÉ</div>}
      </div>})}
    </div>
  </div>
}


/* ===== CERCLE+ — PAGE ABONNEMENT ===== */
function PlusPage({state,dispatch,setPage,goBack,onAuthRequired}){
  const sub=state.subscription;
  const info=getPlusInfo(sub);
  const user=state.user;
  const userRentals=(user?.rentals||0)+state.bookings.filter(b=>b.userId===user?.id).length;
  const userGrade=getGrade(userRentals);
  const PLUS="#7C3AED";
  // Simulateur : grade + années explorables
  const[simGradeId,setSimGradeId]=useState(userGrade.id);
  const[simYears,setSimYears]=useState(info.active?info.years:0);
  const simGrade=GRADES.find(g=>g.id===simGradeId)||GRADES[0];
  const simReduction=PLUS_BASE_REDUCTION+simYears*PLUS_YEARLY_REDUCTION;
  const simEff=Math.max(PLUS_FEE_FLOOR,Math.round((simGrade.feeRate-simReduction)*1000)/1000);
  const simFloorHit=simGrade.feeRate-simReduction<PLUS_FEE_FLOOR;
  const subscribe=()=>{ if(!user){onAuthRequired&&onAuthRequired();return;} dispatch({type:"SUBSCRIBE_PLUS",method:"card"}); };
  const cancel=()=>{ if(window.confirm("Résilier Cercle+ ? Vos réductions d'abonnement seront retirées.")) dispatch({type:"CANCEL_PLUS"}); };

  const Bullet=({icon,title,desc})=>(
    <div style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 16px",background:"var(--w)",border:"1.5px solid var(--bd)",borderRadius:16}}>
      <div style={{width:38,height:38,borderRadius:12,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,background:`linear-gradient(135deg,${PLUS}22,${PLUS}11)`}}>{icon}</div>
      <div><div style={{fontWeight:700,fontSize:14,marginBottom:2,color:"var(--dk)"}}>{title}</div><div style={{fontSize:12.5,color:"var(--g)",lineHeight:1.5}}>{desc}</div></div>
    </div>
  );

  return <div style={{maxWidth:680,margin:"0 auto",padding:"24px 20px 60px"}}>
    <button className="cl" style={{marginBottom:16,display:"flex",alignItems:"center",gap:5}} onClick={goBack}><I.Back/> Retour</button>

    {/* ── HERO ── */}
    <div style={{position:"relative",overflow:"hidden",borderRadius:26,padding:"32px 26px",color:"#fff",marginBottom:18,background:"linear-gradient(135deg,#6C63FF 0%,#7C3AED 55%,#4ECDC4 130%)",boxShadow:"0 18px 50px rgba(124,58,237,.35)"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.14) 50%,transparent 65%)",backgroundSize:"200% 100%",animation:"shimmerCard 4s linear infinite",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,0.18)",padding:"5px 14px",borderRadius:20,fontSize:12,fontWeight:700,letterSpacing:".02em",marginBottom:14,backdropFilter:"blur(6px)"}}>✦ CERCLE+ {info.active&&<span style={{background:"#fff",color:PLUS,padding:"1px 8px",borderRadius:12,fontSize:10,fontWeight:800}}>ACTIF</span>}</div>
        <h1 style={{fontFamily:"var(--fd)",fontSize:30,fontWeight:800,lineHeight:1.1,marginBottom:10,letterSpacing:"-.02em"}}>Moins de commission,<br/>plus vite.</h1>
        <p style={{fontSize:14.5,opacity:.92,lineHeight:1.55,maxWidth:440}}>L'abonnement qui réduit vos frais de service de <strong>−1% immédiatement</strong>, puis <strong>−1% de plus chaque année</strong>. Cumulable avec votre grade.</p>
        <div style={{display:"flex",alignItems:"baseline",gap:8,marginTop:18}}>
          <span style={{fontFamily:"var(--fd)",fontSize:38,fontWeight:800,letterSpacing:"-.02em"}}>5,99&nbsp;€</span>
          <span style={{fontSize:14,opacity:.85}}>/ mois · sans engagement</span>
        </div>
      </div>
    </div>

    {/* ── STATUT / CTA ── */}
    {info.active?(
      <div style={{borderRadius:20,padding:"20px 22px",marginBottom:18,border:`1.5px solid ${PLUS}40`,background:`linear-gradient(135deg,${PLUS}0d,${PLUS}05)`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:12,color:"var(--g)",fontWeight:600}}>Votre réduction Cercle+ actuelle</div>
            <div style={{fontFamily:"var(--fd)",fontSize:32,fontWeight:800,color:PLUS,lineHeight:1.1}}>−{(info.reduction*100).toFixed(0)}%</div>
            <div style={{fontSize:12,color:"var(--g)",marginTop:2}}>Membre depuis {info.months} mois · {info.years} an{info.years>1?"s":""} d'ancienneté</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:"var(--g)",fontWeight:600,marginBottom:2}}>Prochain palier</div>
            <div style={{fontSize:13,fontWeight:700,color:"var(--dk)"}}>−{(info.nextReduction*100).toFixed(0)}% dans {info.monthsToNext} mois</div>
          </div>
        </div>
        {/* progression vers le prochain -1% */}
        <div style={{height:8,borderRadius:4,background:"var(--bd)",overflow:"hidden",margin:"14px 0 6px"}}>
          <div style={{height:"100%",borderRadius:4,width:`${Math.round(((12-info.monthsToNext)/12)*100)}%`,background:`linear-gradient(90deg,${PLUS},#6C63FF)`,transition:"width .8s ease"}}/>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
          <button onClick={cancel} style={{flex:"1 1 auto",padding:"11px",borderRadius:12,border:"1.5px solid var(--bd)",background:"var(--w)",color:"var(--g)",fontWeight:700,fontSize:13,cursor:"pointer"}}>Résilier l'abonnement</button>
          <button onClick={()=>dispatch({type:"PLUS_SIMULATE_YEAR"})} style={{flex:"1 1 auto",padding:"11px",borderRadius:12,border:`1.5px dashed ${PLUS}66`,background:`${PLUS}0d`,color:PLUS,fontWeight:700,fontSize:12,cursor:"pointer"}}>⏩ Simuler +1 an (démo)</button>
        </div>
      </div>
    ):(
      <button onClick={subscribe} className="bp" style={{width:"100%",padding:"16px",fontSize:16,fontWeight:800,borderRadius:16,marginBottom:18,background:`linear-gradient(135deg,#6C63FF,${PLUS})`,boxShadow:"0 8px 28px rgba(124,58,237,.4)"}}>✦ Devenir membre Cercle+ · 5,99 €/mois</button>
    )}

    {/* ── SIMULATEUR ── */}
    <div style={{borderRadius:20,padding:"20px 20px 22px",marginBottom:18,border:"1.5px solid var(--bd)",background:"var(--w)"}}>
      <div style={{fontWeight:800,fontSize:15,marginBottom:4,fontFamily:"var(--fd)",color:"var(--dk)"}}>🧮 Simulateur de commission</div>
      <div style={{fontSize:12.5,color:"var(--g)",marginBottom:16,lineHeight:1.5}}>Combinez votre grade et l'ancienneté de votre abonnement. La commission ne descend jamais sous <strong>2%</strong>.</div>

      <div style={{fontSize:11,fontWeight:700,color:"var(--g)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:7}}>Votre grade</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {GRADES.map(g=>(
          <button key={g.id} onClick={()=>setSimGradeId(g.id)} style={{padding:"7px 11px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:`1.5px solid ${simGradeId===g.id?PLUS:"var(--bd)"}`,background:simGradeId===g.id?`${PLUS}12`:"var(--w)",color:simGradeId===g.id?PLUS:"var(--g)"}}>{g.icon} {g.name} · {Math.round(g.feeRate*100)}%</button>
        ))}
      </div>

      <div style={{fontSize:11,fontWeight:700,color:"var(--g)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:7}}>Ancienneté Cercle+</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
        {[0,1,2,3,4,5].map(y=>(
          <button key={y} onClick={()=>setSimYears(y)} style={{padding:"7px 13px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:`1.5px solid ${simYears===y?PLUS:"var(--bd)"}`,background:simYears===y?`${PLUS}12`:"var(--w)",color:simYears===y?PLUS:"var(--g)"}}>{y===0?"Dès l'abo":`${y} an${y>1?"s":""}`}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,textAlign:"center"}}>
        <div style={{padding:"14px 8px",borderRadius:14,background:"var(--bgw)"}}>
          <div style={{fontSize:10,color:"var(--g)",fontWeight:600,marginBottom:3}}>Grade seul</div>
          <div style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:800,color:"var(--dk)"}}>{Math.round(simGrade.feeRate*100)}%</div>
        </div>
        <div style={{padding:"14px 8px",borderRadius:14,background:`${PLUS}12`,border:`1.5px solid ${PLUS}33`}}>
          <div style={{fontSize:10,color:PLUS,fontWeight:700,marginBottom:3}}>+ Cercle+ (−{(simReduction*100).toFixed(0)}%)</div>
          <div style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:900,color:PLUS}}>{Math.round(simEff*100)}%</div>
        </div>
        <div style={{padding:"14px 8px",borderRadius:14,background:"#f0fdf4"}}>
          <div style={{fontSize:10,color:"#10b981",fontWeight:700,marginBottom:3}}>Vous économisez</div>
          <div style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:800,color:"#10b981"}}>−{Math.round((simGrade.feeRate-simEff)*100)}%</div>
        </div>
      </div>
      {simFloorHit&&<div style={{marginTop:12,fontSize:12,color:PLUS,fontWeight:600,textAlign:"center",background:`${PLUS}0d`,padding:"8px",borderRadius:10}}>🎉 Vous atteignez le plancher minimum de 2% de commission.</div>}
    </div>

    {/* ── COMMENT ÇA MARCHE ── */}
    <div style={{fontWeight:800,fontSize:15,margin:"4px 0 12px",fontFamily:"var(--fd)",color:"var(--dk)"}}>Comment ça marche</div>
    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
      <Bullet icon="⚡" title="−1% dès le premier jour" desc="Dès votre abonnement, votre commission baisse de 1 point, en plus de la réduction de votre grade."/>
      <Bullet icon="📅" title="−1% de plus chaque année" desc="À chaque année complète d'abonnement, vous gagnez 1 point de réduction supplémentaire, à vie tant que vous restez membre."/>
      <Bullet icon="🛡️" title="Plancher garanti à 2%" desc="En cumulant grade et abonnement, votre commission ne descend jamais sous 2% — le taux le plus bas de Cercle."/>
      <Bullet icon="🔓" title="Sans engagement" desc="Résiliable à tout moment. Vous gardez vos avantages jusqu'à la fin de la période en cours."/>
    </div>

    {/* ── EXEMPLE CONCRET ── */}
    <div style={{borderRadius:20,padding:"18px 20px",marginBottom:22,background:"linear-gradient(135deg,#1a1a2e,#2d2150)",color:"#fff"}}>
      <div style={{fontSize:12,opacity:.7,fontWeight:600,marginBottom:8}}>EXEMPLE</div>
      <div style={{fontSize:13.5,lineHeight:1.7}}>
        Un membre <strong>Légende</strong> (5% de commission) abonné à Cercle+ depuis <strong>2 ans</strong> :<br/>
        5% − 1% (abo) − 2% (2 ans) = <strong style={{color:"#A78BFA"}}>2%</strong> de commission seulement.<br/>
        <span style={{opacity:.7,fontSize:12.5}}>Soit le taux minimum, atteint bien plus tôt qu'avec le grade seul.</span>
      </div>
    </div>

    {/* ── CTA bas ── */}
    {!info.active&&<button onClick={subscribe} className="bp" style={{width:"100%",padding:"16px",fontSize:16,fontWeight:800,borderRadius:16,background:`linear-gradient(135deg,#6C63FF,${PLUS})`,boxShadow:"0 8px 28px rgba(124,58,237,.4)"}}>✦ Rejoindre Cercle+ maintenant</button>}
    <p style={{textAlign:"center",fontSize:11,color:"var(--g)",marginTop:12,lineHeight:1.5}}>Paiement simulé pour la démo · Aucune carte réelle débitée.<br/>5,99 €/mois, sans engagement, résiliable en un clic.</p>
  </div>;
}


/* ===== CONFIRMATION REMISE/RETOUR ===== */
function ConfirmDeliveryPage({annonceId, allItems, onBack}){
  const item=allItems.find(i=>String(i.id)===String(annonceId));
  const[confirmed,setConfirmed]=useState(null);
  const[ts,setTs]=useState('');
  const confirm=(type)=>{
    const now=new Date().toLocaleString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
    setConfirmed(type);setTs(now);
  };
  if(confirmed){return(
    <div style={{maxWidth:480,margin:'0 auto',padding:'60px 28px',textAlign:'center',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontSize:72,marginBottom:16}}>✅</div>
      <h2 style={{fontFamily:'var(--fd)',fontSize:22,marginBottom:8}}>Confirmation enregistrée</h2>
      <p style={{fontSize:14,color:'var(--g)',lineHeight:1.6,marginBottom:16}}>
        {confirmed==='received'?<>Vous avez confirmé avoir <strong>reçu</strong> l'objet.</>:<>Vous avez confirmé avoir <strong>récupéré</strong> l'objet.</>}
      </p>
      <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:12,padding:'14px 20px',fontSize:13,color:'#166534',marginBottom:24,width:'100%'}}>
        🕐 Horodatage : <strong>{ts}</strong>
      </div>
      <p style={{fontSize:12,color:'var(--gl)'}}>Cette confirmation peut servir de preuve en cas de litige.</p>
      <button className="bs" style={{marginTop:20}} onClick={onBack}>← Retour à l'accueil</button>
    </div>
  );}
  return(
    <div style={{maxWidth:480,margin:'0 auto',padding:'60px 28px',textAlign:'center',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontSize:52,marginBottom:16}}>📦</div>
      <h2 style={{fontFamily:'var(--fd)',fontSize:22,marginBottom:6}}>{item?item.title:'Annonce #'+annonceId}</h2>
      <p style={{fontSize:14,color:'var(--g)',marginBottom:28,lineHeight:1.6}}>Confirmez la remise ou le retour de cet objet pour protéger les deux parties.</p>
      <div style={{display:'flex',flexDirection:'column',gap:12,width:'100%'}}>
        <button className="bp" style={{width:'100%',padding:'16px',fontSize:15}} onClick={()=>confirm('received')}>
          ✅ Je confirme avoir reçu l'objet
        </button>
        <button className="bs" style={{width:'100%',padding:'16px',fontSize:15}} onClick={()=>confirm('returned')}>
          ✅ Je confirme avoir récupéré l'objet
        </button>
      </div>
      <button className="cl" style={{marginTop:20}} onClick={onBack}>← Retour</button>
    </div>
  );
}

/* ========== MAIN APP ========== */
