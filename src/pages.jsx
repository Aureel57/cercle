function SearchM({onClose,onSearch,allItems,filters,setFilters}){
  const[q,setQ]=useState("");const[w,setW]=useState("");const[af,setAf]=useState("what");const[searchDate,setSearchDate]=useState(filters?.searchDate||"");
  const sugg=useMemo(()=>!q||q.length<2?[]:allItems.filter(i=>i.title.toLowerCase().includes(q.toLowerCase())).slice(0,5),[q,allItems]);
  return <><div className="smbg" onClick={onClose}/><div className="sm"><div className="smin">
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
  return <div className="bk" onClick={onClose}><div className="md" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
    <div className="mh"><button className="mx" onClick={onClose}><I.X/></button><h2>Filtres</h2></div>
    <div className="mb">
      <div style={{marginBottom:18}}><h3 style={{fontSize:14,fontWeight:700,fontFamily:"var(--fd)",marginBottom:8}}>Trier par</h3>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{[["pertinence","Pertinence"],["price_asc","Prix ↑"],["price_desc","Prix ↓"],["rating","Note ↓"],["recent","Récent"]].map(([id,label])=>
          <button key={id} className={"pill"+((l.sort||"pertinence")===id?" on":"")} onClick={()=>up("sort",id)}>{label}</button>
        )}</div>
      </div>
      <div style={{marginBottom:18}}><h3 style={{fontSize:14,fontWeight:700,fontFamily:"var(--fd)",marginBottom:8}}>Prix / jour</h3><div style={{display:"flex",gap:10,alignItems:"center"}}><div className="fg" style={{flex:1,margin:0}}><label>Min €</label><input type="number" value={l.priceMin} onChange={e=>up("priceMin",+e.target.value)}/></div><span style={{color:"var(--gl)"}}>–</span><div className="fg" style={{flex:1,margin:0}}><label>Max €</label><input type="number" value={l.priceMax} onChange={e=>up("priceMax",+e.target.value)}/></div></div></div>
      <div style={{marginBottom:18}}><h3 style={{fontSize:14,fontWeight:700,fontFamily:"var(--fd)",marginBottom:8}}>Catégorie</h3>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{CATS.map(c=><button key={c.id} className={"pill"+((l.filterCat||"all")===c.id?" on":"")} onClick={()=>up("filterCat",c.id)}>{c.icon} {c.label}</button>)}</div>
      </div>
      <div style={{marginBottom:18}}><h3 style={{fontSize:14,fontWeight:700,fontFamily:"var(--fd)",marginBottom:8}}>État</h3><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["Tous","Comme neuf","Très bon état","Bon état"].map(c=><button key={c} className={"pill"+(l.condition===c?" on":"")} onClick={()=>up("condition",c)}>{c}</button>)}</div></div>
      <div style={{marginBottom:18}}><h3 style={{fontSize:14,fontWeight:700,fontFamily:"var(--fd)",marginBottom:8}}>Note minimale</h3>
        <div style={{display:"flex",gap:5}}>{[0,4,4.5,4.8].map(r=><button key={r} className={"pill"+((l.minRating||0)===r?" on":"")} onClick={()=>up("minRating",r)}>{r===0?"Toutes":"≥ "+r+" ★"}</button>)}</div>
      </div>
      <div style={{marginBottom:18}}><h3 style={{fontSize:14,fontWeight:700,fontFamily:"var(--fd)",marginBottom:8}}>Options</h3><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["Propriétaire vérifié","Livraison","Annulation flexible"].map(o=><button key={o} className={"pill"+((l.options||[]).includes(o)?" on":"")} onClick={()=>{const os=l.options||[];up("options",os.includes(o)?os.filter(x=>x!==o):[...os,o])}}>{o}</button>)}</div></div>
    </div>
    <div className="mf"><button className="cl" onClick={()=>setL({priceMin:0,priceMax:500,condition:"Tous",options:[],sort:"pertinence",filterCat:"all",minRating:0})}>Effacer</button><button className="bd" onClick={()=>{setFilters(l);onClose()}}>Afficher {count} résultats</button></div>
  </div></div>
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
  newsletter:{title:"Newsletter",icon:"📧",sections:[["Restez informé","Recevez chaque semaine nos meilleures annonces et conseils."],["Contenu","Top 5 annonces, conseils, codes promo exclusifs, nouveautés."],["Inscription","Entrez votre email. Désabonnement en un clic."]]}
};
function InfoPage({id,setPage}){
  const pg=INFO_PAGES[id];if(!pg)return null;
  return <div style={{maxWidth:720,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:20,display:"flex",alignItems:"center",gap:5}} onClick={()=>setPage("home")}><I.Back/> Retour</button>
    <div style={{textAlign:"center",marginBottom:28}}><span style={{fontSize:48}}>{pg.icon}</span><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:700,marginTop:8}}>{pg.title}</h1></div>
    {pg.sections.map((s,i)=><div key={i} style={{marginBottom:16,padding:20,background:"var(--bg)",borderRadius:16,border:"1px solid var(--bd)"}}>
      <h3 style={{fontSize:15,fontWeight:700,marginBottom:6}}>{s[0]}</h3>
      <p style={{fontSize:14,lineHeight:1.7,color:"var(--g)"}}>{s[1]}</p>
    </div>)}
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
function NotifCenter({state,dispatch,setPage}){
  const kinds={booking:"📅",deposit:"🔒",listing:"📦",referral:"🎁",dispute:"⚖️",system:"⚙️"};
  return <div className="nc">
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={()=>setPage("home")}><I.Back/> Retour</button>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <h1 style={{fontFamily:"var(--fd)",fontSize:22}}>🔔 Notifications</h1>
      {state.notifications.some(n=>!n.read)&&<button className="cl" onClick={()=>dispatch({type:"READ_N"})}>Tout marquer lu</button>}
    </div>
    {state.notifications.length===0?<div className="empty"><span>🔔</span><h2>Aucune notification</h2></div>:
    state.notifications.map(n=><div key={n.id} className={"nc-i"+(n.read?"":" unread")} onClick={()=>dispatch({type:"READ_ONE",id:n.id})}>
      <div className="nc-ic" style={{background:n.read?"var(--bgw)":"#FEF2F2"}}>{kinds[n.kind]||"📌"}</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:n.read?400:600}}>{n.text}</div><div style={{fontSize:10,color:"var(--g)"}}>{ds(n.at)}</div></div>
      {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"var(--p)",flexShrink:0}}/>}
    </div>)}
  </div>
}

/* ===== DASHBOARD ===== */
/* ========== GESTION PRO ========== */
function GestionPro({state,dispatch,setPage}){
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
    if(!window.jspdf){alert('jsPDF non disponible');return;}
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
    }catch(e){alert('Erreur export PDF');}
    finally{document.body.removeChild(wrapper);}
  };

  const card={background:'var(--w)',borderRadius:18,boxShadow:'0 2px 20px rgba(0,0,0,0.07)',overflow:'hidden'};
  const tabSt=active=>({padding:'10px 16px',fontSize:13,fontWeight:600,border:'none',background:'none',borderBottom:active?'2.5px solid #D97706':'2.5px solid transparent',color:active?'#D97706':'var(--g)',cursor:'pointer',transition:'all .2s'});

  return <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#92400E 0%,#B45309 30%,#D97706 65%,#F59E0B 100%)',backgroundAttachment:'fixed',paddingBottom:90,animation:'fadeSlideUp 0.4s both'}}>
    {/* Header */}
    <div style={{padding:'52px 20px 28px',position:'relative'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.1) 1px,transparent 1px)',backgroundSize:'22px 22px',pointerEvents:'none'}}/>
      <div style={{position:'relative',maxWidth:860,margin:'0 auto'}}>
        <button onClick={()=>setPage('home')} style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',borderRadius:20,padding:'6px 14px',color:'white',fontSize:13,fontWeight:600,marginBottom:20,cursor:'pointer',backdropFilter:'blur(8px)'}}><I.Back/> Retour</button>
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

function Dashboard({state,dispatch,setPage}){
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
  const hasReal=monthlyRevenue.some(v=>v>0);
  // If no real data yet, generate realistic demo data from seed
  const seed=revenue||320;
  const monthlyVals=hasReal?monthlyRevenue:months.map((_,i)=>Math.max(0,Math.floor(seed/12*(0.3+Math.sin(i*0.9+1)*0.5+0.2))));
  const maxVal=Math.max(...monthlyVals,1);
  const totalYear=monthlyVals.reduce((s,v)=>s+v,0);
  const catData=Object.entries(myItems.reduce((acc,it)=>{acc[it.cat]=(acc[it.cat]||0)+1;return acc},{}));
  const monthlyCounts=new Array(12).fill(0);
  myBookAsOwner.forEach(b=>{const d=new Date(b.createdAt||b.date||Date.now());if(d.getFullYear()===new Date().getFullYear())monthlyCounts[d.getMonth()]++;});
  const hasRealCounts=monthlyCounts.some(v=>v>0);
  const seedCnt=myBookAsOwner.filter(b=>b.status==="confirmed").length||8;
  const monthlyCountVals=hasRealCounts?monthlyCounts:months.map((_,i)=>Math.max(0,Math.round(seedCnt/12*(0.4+Math.sin(i*0.9+1)*0.5))));
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
    if(!window.jspdf){alert("jsPDF non disponible.");return}
    if(!window.html2canvas){alert("html2canvas non disponible.");return}
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
      alert("Erreur lors de l'export PDF.");
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
  return(
  <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#6C63FF 0%,#7c5ce7 28%,#5a7fff 62%,#4ECDC4 100%)",backgroundAttachment:"fixed",overflowX:"hidden",paddingBottom:90,animation:"fadeSlideUp 0.4s both"}}>
    {/* ── Header ── */}
    <div style={{padding:"52px 20px 28px",position:"relative"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.1) 1px,transparent 1px)",backgroundSize:"22px 22px",pointerEvents:"none"}}/>
      <div style={{position:"relative",maxWidth:860,margin:"0 auto"}}>
        <button onClick={()=>setPage("home")} style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:20,padding:"6px 14px",color:"white",fontSize:13,fontWeight:600,marginBottom:20,cursor:"pointer",backdropFilter:"blur(8px)"}}>
          <I.Back/> Retour
        </button>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",fontWeight:500,marginBottom:6,textTransform:"uppercase",letterSpacing:1,animation:"fadeSlideIn 0.5s both"}}>Tableau de bord</div>
            <h1 style={{fontSize:28,fontWeight:800,color:"white",margin:0,letterSpacing:-0.5,lineHeight:1.1,animation:"fadeSlideIn 0.5s 0.08s both"}}>Bonjour {u.name.split(" ")[0]} 👋</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",margin:"8px 0 0"}}>
              {totalYear>0?`${totalYear}€ générés cette année · `:""}
              {myItems.length} annonce{myItems.length!==1?"s":""} en ligne
            </p>
          </div>
          <button onClick={exportPDF} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:12,padding:"9px 16px",color:"white",fontSize:12,fontWeight:600,cursor:"pointer",backdropFilter:"blur(8px)"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:13,height:13}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF
          </button>
        </div>
      </div>
    </div>

    <div style={{maxWidth:860,margin:"0 auto",padding:"0 14px",display:"flex",flexDirection:"column",gap:14}}>

      {/* ── PRO EXTRA KPIs ── */}
      {u.isPro&&<div style={{...card,padding:'16px 18px',background:'linear-gradient(135deg,#FFFBEB,#FEF3C7)',border:'1.5px solid #FDE68A'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
          <span style={{background:'linear-gradient(135deg,#F59E0B,#D97706)',color:'#fff',fontSize:10,fontWeight:800,padding:'3px 10px',borderRadius:20,letterSpacing:'.04em'}}>⭐ PRO</span>
          <div style={{fontSize:13,fontWeight:700,color:'#92400E'}}>Indicateurs Professionnels</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
          {[
            {icon:'💛',val:monthlyVals[curMonth]+'€',label:'CA mensuel',sub:months[curMonth],col:'#D97706'},
            {icon:'🔄',val:myBookAsOwner.filter(b=>b.status==='confirmed').length,label:'Locations actives',sub:'confirmées',col:'#059669'},
            {icon:'📊',val:myItems.length>0?Math.min(100,Math.round(myBookAsOwner.filter(b=>b.status==='confirmed').length/Math.max(myItems.length,1)*100))+'%':'—',label:"Taux d'occupation",sub:'du parc',col:'#6C63FF'},
            {icon:'⭐',val:myItems.length>0&&myItems.some(i=>i.rating>0)?(myItems.reduce((s,i)=>s+i.rating,0)/myItems.length).toFixed(1):'–',label:'Note moyenne',sub:'locataires',col:'#D97706'},
          ].map((k,i)=>(
            <div key={i} style={{textAlign:'center',padding:'10px 6px',background:'rgba(255,255,255,0.6)',borderRadius:12}}>
              <div style={{fontSize:20,marginBottom:4}}>{k.icon}</div>
              <div style={{fontSize:18,fontWeight:800,color:k.col,lineHeight:1,letterSpacing:-.5}}>{k.val}</div>
              <div style={{fontSize:10,fontWeight:600,color:'#92400E',marginTop:3}}>{k.label}</div>
              <div style={{fontSize:9,color:'#B45309',marginTop:1}}>{k.sub}</div>
            </div>
          ))}
        </div>
      </div>}

      {/* ── KPIs ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
        {kpis.map((k,i)=>(
          <div key={i} style={{...card,padding:"16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{width:40,height:40,borderRadius:12,background:k.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>{k.icon}</div>
              <span style={{fontSize:10,fontWeight:700,color:k.color,background:k.bg,padding:"3px 8px",borderRadius:20}}>{k.sub}</span>
            </div>
            <div style={{fontSize:26,fontWeight:800,color:"var(--dk)",letterSpacing:-0.5,lineHeight:1}}>{k.val}</div>
            <div style={{fontSize:12,color:"var(--g)",marginTop:4}}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Revenue chart ── */}
      <div style={{...card,padding:"18px 16px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"var(--dk)"}}>Revenus & activité</div>
            <div style={{fontSize:11,color:"var(--g)",marginTop:2}}>{new Date().getFullYear()} · {hasReal?"données réelles":"données de démonstration"}</div>
            <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
              {[{m:"monthly",label:"Par mois",icon:"📅"},{m:"revenue",label:"Revenus/catégorie",icon:"💰"},{m:"count",label:"Locations/catégorie",icon:"📦"}].map(({m,label,icon})=>(
                <button key={m} onClick={()=>toggleMetric(m)} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,border:"1.5px solid",fontSize:10,fontWeight:600,cursor:"pointer",transition:"all 0.2s ease",outline:"none",borderColor:chartMetrics.includes(m)?"#6C63FF":dark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)",background:chartMetrics.includes(m)?"#6C63FF":"transparent",color:chartMetrics.includes(m)?"#fff":dark?"#a0a0b8":"#6b7280"}}>
                  <span style={{fontSize:10}}>{icon}</span>{label}
                </button>
              ))}
            </div>
            {chartMetrics.includes('monthly')&&(
              <div style={{display:"flex",gap:4,marginTop:6}}>
                {[{t:"bar",label:"Barres",icon:"▬"},{t:"line",label:"Courbe",icon:"〜"}].map(({t,label,icon})=>(
                  <button key={t} onClick={()=>setChartType(t)} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,border:"1.5px solid",fontSize:10,fontWeight:600,cursor:"pointer",transition:"all 0.2s ease",outline:"none",borderColor:chartType===t?"#6C63FF":dark?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)",background:chartType===t?"rgba(108,99,255,0.15)":"transparent",color:chartType===t?"#6C63FF":dark?"#a0a0b8":"#6b7280"}}>
                    <span style={{fontSize:11}}>{icon}</span>{label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:18,fontWeight:800,color:"#6C63FF",letterSpacing:-0.5}}>{monthlyVals[curMonth]}€</div>
            <div style={{fontSize:10,color:"var(--g)"}}>ce mois</div>
          </div>
        </div>
        {window.Chart
          ? <div style={{height:170,position:"relative"}}><canvas ref={barRef}/></div>
          : <div style={{height:170,display:"flex",alignItems:"flex-end",gap:3,padding:"8px 0 0"}}>
              {monthlyVals.map((v,i)=>(
                <div key={i} title={months[i]+": "+v+"€"} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer"}}>
                  <div style={{width:"100%",borderRadius:"4px 4px 0 0",transition:"height .5s ease",
                    background:i===curMonth?"#6C63FF":i<curMonth?"rgba(108,99,255,0.4)":"rgba(108,99,255,0.12)",
                    height:Math.max(3,Math.round(v/maxVal*140))}}/>
                  <div style={{fontSize:7,color:i===curMonth?"#6C63FF":"#9ca3af",fontWeight:i===curMonth?700:400}}>{months[i].slice(0,1)}</div>
                </div>
              ))}
            </div>
        }
      </div>

      {/* ── Category chart + Quick actions ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="dboard-grid">
        <div style={{...card,padding:"18px 16px"}}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--dk)",marginBottom:3}}>Par catégorie</div>
          <div style={{fontSize:11,color:"var(--g)",marginBottom:12}}>Annonces par type</div>
          {catData.length>0&&window.Chart
            ? <div style={{height:150,position:"relative"}}><canvas ref={pieRef}/></div>
            : catData.length===0
              ? <div style={{height:140,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,color:"var(--g)"}}>
                  <span style={{fontSize:28}}>📦</span><span style={{fontSize:12}}>Aucune annonce</span>
                </div>
              : <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {catData.slice(0,5).map(([cat,cnt],i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:chartColors[i%8],flexShrink:0}}/>
                      <div style={{flex:1,fontSize:11,color:"var(--dk)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat}</div>
                      <div style={{width:50,height:5,background:"var(--bgw)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:Math.round(cnt/myItems.length*100)+"%",height:"100%",background:chartColors[i%8],borderRadius:3}}/>
                      </div>
                      <div style={{fontSize:11,fontWeight:700,color:"var(--dk)",minWidth:14,textAlign:"right"}}>{cnt}</div>
                    </div>
                  ))}
                </div>
          }
        </div>
        <div style={{...card,padding:"18px 16px"}}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--dk)",marginBottom:14}}>Actions rapides</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              {icon:"➕",label:"Nouvelle annonce",color:"#6C63FF",bg:"#ede9fe",action:()=>setPage("create")},
              {icon:"📅",label:"Réservations",color:"#0ea5e9",bg:"#e0f2fe",action:()=>setPage("profile")},
              {icon:"🆔",label:"Vérifier identité",color:"#10b981",bg:"#d1fae5",action:()=>setPage("verify")},
            ].map((a,i)=>(
              <button key={i} onClick={a.action} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:"none",borderRadius:12,background:a.bg,cursor:"pointer",textAlign:"left",transition:"opacity .15s"}}
                onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <span style={{fontSize:16}}>{a.icon}</span>
                <span style={{fontSize:12,fontWeight:600,color:a.color}}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Listings ── */}
      <div style={{...card,padding:"18px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--dk)"}}>Mes annonces</div>
          <button onClick={()=>setPage("create")} style={{fontSize:12,fontWeight:600,color:"#6C63FF",background:"#ede9fe",border:"none",borderRadius:20,padding:"5px 12px",cursor:"pointer"}}>+ Ajouter</button>
        </div>
        {myItems.length===0
          ? <div style={{textAlign:"center",padding:"24px 0",color:"var(--g)"}}>
              <div style={{fontSize:28,marginBottom:6}}>📦</div>
              <div style={{fontSize:13,fontWeight:600,color:"var(--dk)",marginBottom:4}}>Aucune annonce</div>
              <button className="bp" style={{marginTop:10,fontSize:12,padding:"7px 18px"}} onClick={()=>setPage("create")}>Créer une annonce</button>
            </div>
          : <div style={{display:"flex",flexDirection:"column"}}>
              {myItems.slice(0,6).map((it,idx)=>(
                <div key={it.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:idx<Math.min(myItems.length,6)-1?"1px solid var(--bd)":"none",animation:`fadeSlideUp 0.4s ${0.55+idx*0.05}s both`}}>
                  <img src={it.images[0]} alt="" style={{width:42,height:34,objectFit:"cover",borderRadius:8,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--dk)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.title}</div>
                    <div style={{fontSize:11,color:"var(--g)",marginTop:1}}>{it.price}€/j · {CATS_FR[it.cat]||it.cat}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                    <button onClick={()=>dispatch({type:"TOGGLE_AVAIL",id:it.id})} style={{fontSize:11,fontWeight:700,padding:"5px 11px",borderRadius:20,border:"none",cursor:"pointer",
                      background:it.available?"#d1fae5":"#f3f4f6",color:it.available?"#065f46":"#6b7280"}}>
                      {it.available?"✓ Dispo":"Indispo"}
                    </button>
                    <button onClick={()=>setQrItem(it)} style={{fontSize:10,fontWeight:700,padding:"4px 8px",borderRadius:20,border:"1.5px solid #d1c9ff",background:"#f5f3ff",color:"#6C63FF",cursor:"pointer"}}>📱 QR</button>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
      {qrItem&&<QRModal item={qrItem} onClose={()=>setQrItem(null)}/>}

    </div>
  </div>
  );
}

/* ===== REFERRAL ===== */
function ReferralPage({state,dispatch,setPage}){
  const[copied,setCopied]=useState(false);const[friendName,setFriendName]=useState("");
  const code=state.user?.refCode||"CERCLE";
  const totalBonus=state.referrals.reduce((s,r)=>s+r.bonus,0);
  const copy=()=>{navigator.clipboard?.writeText(code).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2000)};
  const invite=()=>{if(!friendName)return;dispatch({type:"REFERRAL",name:friendName});setFriendName("")};
  return <div style={{maxWidth:540,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={()=>setPage("home")}><I.Back/> Retour</button>
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
    <div className="fg"><label>Simuler un parrainage</label><div style={{display:"flex",gap:6}}><input value={friendName} onChange={e=>setFriendName(e.target.value)} placeholder="Nom de votre ami"/><button className="bp" style={{fontSize:12,padding:"8px 14px",flexShrink:0}} onClick={invite}>Inviter</button></div></div>
    {state.referrals.length>0&&<><h3 style={{fontFamily:"var(--fd)",fontSize:15,marginTop:12,marginBottom:8}}>Historique</h3>
    {state.referrals.map(r=><div key={r.id} style={{display:"flex",justifyContent:"space-between",padding:10,border:"1px solid var(--bd)",borderRadius:8,marginBottom:4,fontSize:13}}><span>👤 {r.name} · {ds(r.date)}</span><span style={{color:"var(--acc)",fontWeight:700}}>+{r.bonus}€</span></div>)}</>}
  </div>
}

/* ===== VERIFY ID ===== */
function VerifyId({state,dispatch,setPage}){
  const[step,setStep]=useState(state.user?.verified?3:0);const[doc,setDoc]=useState("cni");
  useEffect(()=>{if(step===1){const t=setTimeout(()=>setStep(2),1500);return()=>clearTimeout(t)}},[step]);
  return <div style={{maxWidth:500,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={()=>setPage("profile")}><I.Back/> Retour</button>
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
function DisputePage({state,dispatch,setPage}){
  const[reason,setReason]=useState("");const[bookId,setBookId]=useState("");const[desc,setDesc]=useState("");
  const myBook=state.bookings.filter(b=>b.userId===state.user?.id||b.ownerId===state.user?.id);
  const submit=()=>{if(!reason||!bookId)return;dispatch({type:"DISPUTE",payload:{id:uid(),bookingId:bookId,reason,desc,status:"open",by:state.user.id,date:new Date()}});setReason("");setDesc("")};
  return <div style={{maxWidth:540,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={()=>setPage("profile")}><I.Back/> Retour</button>
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
  return <div className="gallery-fs" onClick={onClose}>
    <button className="gf-close" onClick={onClose}><I.X/></button>
    <button className="gf-nav l" onClick={e=>{e.stopPropagation();setIdx(i=>(i-1+images.length)%images.length)}}>‹</button>
    <img src={images[idx]} alt="" onClick={e=>e.stopPropagation()}/>
    <button className="gf-nav r" onClick={e=>{e.stopPropagation();setIdx(i=>(i+1)%images.length)}}>›</button>
    <div className="gf-counter">{idx+1} / {images.length}</div>
  </div>
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
      {m.items&&<div style={{display:"flex",flexDirection:"column",gap:4,marginTop:6}}>{m.items.map(it=><div key={it.id} style={{display:"flex",gap:8,padding:8,background:"var(--bg)",borderRadius:12,cursor:"pointer",fontSize:12,transition:"all .15s",border:"1px solid var(--bd)"}} onClick={()=>onOpen(it)} onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.borderColor="var(--p)"}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.borderColor="var(--bd)"}}><img src={it.images[0]} alt="" style={{width:48,height:36,objectFit:"cover",borderRadius:8,flexShrink:0}}/><div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.title}</div><div style={{display:"flex",justifyContent:"space-between",marginTop:2}}><span style={{color:"var(--p)",fontWeight:700}}>{it.price}€/j</span><span style={{color:"var(--g)"}}>★ {it.rating}</span></div></div></div>)}</div>}
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
function WalletPage({state,dispatch,setPage}){
  const[amount,setAmount]=useState("");
  return <div style={{maxWidth:540,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={()=>setPage("profile")}><I.Back/> Retour</button>
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
function BadgesPage({state,setPage}){
  return <div style={{maxWidth:540,margin:"0 auto",padding:28}}>
    <button className="cl" style={{marginBottom:14,display:"flex",alignItems:"center",gap:5}} onClick={()=>setPage("profile")}><I.Back/> Retour</button>
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
