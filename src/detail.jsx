function QRModal({item,onClose}){
  const qrRef=useRef(null);
  const baseUrl=window.location.href.split('?')[0];
  const url=`${baseUrl}?annonce=${item.id}&action=confirm`;
  useEffect(()=>{
    if(qrRef.current&&window.QRCode){
      qrRef.current.innerHTML='';
      new QRCode(qrRef.current,{text:url,width:200,height:200,colorDark:"#6C63FF",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.H});
    }
  },[]);
  const download=()=>{
    const canvas=qrRef.current?.querySelector('canvas');
    if(canvas){const a=document.createElement('a');a.download=`qrcode-${item.title.replace(/\s+/g,'-')}.png`;a.href=canvas.toDataURL('image/png');a.click();}
  };
  return <div className="bk" onClick={onClose}>
    <div className="md" onClick={e=>e.stopPropagation()} style={{maxWidth:420,textAlign:'center'}}>
      <div className="mh"><button className="mx" onClick={onClose}><I.X/></button><h2>📱 QR Code anti-litige</h2></div>
      <div className="mb" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
        <div style={{fontSize:15,fontWeight:700,color:'var(--dk)',maxWidth:280,lineHeight:1.4}}>{item.title}</div>
        <div ref={qrRef} style={{width:200,height:200,display:'flex',alignItems:'center',justifyContent:'center'}}/>
        <div style={{fontSize:13,color:'var(--tx)',lineHeight:1.65,textAlign:'left',background:'#fef9c3',borderRadius:12,padding:'14px 16px',border:'1px solid #fde68a',margin:0,width:'100%'}}>
          📌 Collez ce QR code sur votre objet. Lors de la remise, le locataire devra scanner ce code pour confirmer qu'il a bien reçu l'objet. Au retour, vous devrez scanner ce code pour confirmer la récupération. Cela protège les deux parties en cas de litige.
        </div>
        <button className="bp" style={{width:'100%'}} onClick={download}>⬇️ Télécharger le QR code</button>
        <button className="bs" style={{width:'100%'}} onClick={onClose}>Fermer</button>
      </div>
    </div>
  </div>
}

/* ===== MINI CALENDAR ===== */
function MiniCal({value,onChange,label,minDate,blockedDates}){
  const d=value?new Date(value):new Date();
  const[viewY,setViewY]=useState(d.getFullYear());const[viewM,setViewM]=useState(d.getMonth());
  const months=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const days=["Lu","Ma","Me","Je","Ve","Sa","Di"];
  const firstDay=new Date(viewY,viewM,1).getDay()||7;
  const daysInMonth=new Date(viewY,viewM+1,0).getDate();
  const today=new Date();today.setHours(0,0,0,0);
  const minD=minDate?new Date(minDate):today;minD.setHours(0,0,0,0);
  const blockedSet=new Set(blockedDates||[]);
  const prev=()=>{if(viewM===0){setViewM(11);setViewY(viewY-1)}else setViewM(viewM-1)};
  const next=()=>{if(viewM===11){setViewM(0);setViewY(viewY+1)}else setViewM(viewM+1)};
  const selDate=value?new Date(value):null;if(selDate)selDate.setHours(0,0,0,0);
  const cells=[];for(let i=1;i<firstDay;i++)cells.push(null);for(let i=1;i<=daysInMonth;i++)cells.push(i);
  return <div style={{background:"var(--w)",borderRadius:12,border:"1.5px solid var(--bd)",overflow:"hidden"}}>
    <div style={{padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--bgw)"}}>
      <button style={{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:"2px 8px",borderRadius:6}} onClick={prev}>‹</button>
      <span style={{fontSize:13,fontWeight:700,fontFamily:"var(--fd)"}}>{months[viewM]} {viewY}</span>
      <button style={{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:"2px 8px",borderRadius:6}} onClick={next}>›</button>
    </div>
    <div style={{padding:"6px 8px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>{days.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:"var(--gl)",padding:2}}>{d}</div>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cells.map((day,i)=>{if(!day)return <div key={i}/>;
          const dt=new Date(viewY,viewM,day);dt.setHours(0,0,0,0);
          const key=`${viewY}-${String(viewM+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isBlocked=blockedSet.has(key);
          const isPast=dt<minD;const isSel=selDate&&dt.getTime()===selDate.getTime();const isToday=dt.getTime()===today.getTime();
          const disabled=isPast||isBlocked;
          return <button key={i} disabled={disabled} onClick={()=>{if(disabled)return;const m=String(viewM+1).padStart(2,"0");const dd=String(day).padStart(2,"0");onChange(`${viewY}-${m}-${dd}`)}}
            title={isBlocked?"Indisponible":undefined}
            style={{width:"100%",aspectRatio:"1",border:isBlocked?"1.5px solid #fecaca":"none",borderRadius:8,fontSize:12,fontWeight:isSel?700:isToday?600:400,
              background:isSel?"var(--p)":isBlocked?"#fee2e2":isToday?"var(--bgw)":"transparent",
              color:isSel?"#fff":isBlocked?"#ef4444":isPast?"var(--gl)":"var(--dk)",
              cursor:disabled?"default":"pointer",transition:"all .1s",textDecoration:isBlocked?"line-through":"none"}}>
            {day}
          </button>
        })}
      </div>
    </div>
    {blockedDates&&blockedDates.length>0&&<div style={{padding:"4px 12px",fontSize:10,color:"#ef4444",display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:2,background:"#fee2e2",border:"1px solid #fca5a5",display:"inline-block"}}/>Jours indisponibles</div>}
    {label&&<div style={{padding:"6px 12px",borderTop:"1px solid var(--bd)",fontSize:11,color:"var(--g)",textAlign:"center"}}>{label}: <strong>{value||"—"}</strong></div>}
  </div>
}

function DetailMap({item}){
  const mapRef=useRef(null);
  const leafletRef=useRef(null);
  const[coords,setCoords]=useState(null);
  const[loading,setLoading]=useState(true);
  const[mapsUrl,setMapsUrl]=useState("#");

  useEffect(()=>{
    // 1. Coordonnées directes sur l'item
    if(item.lat&&item.lng&&!(item.lat===48.86&&item.lng===2.35)){
      setCoords({lat:item.lat,lng:item.lng});setLoading(false);
      setMapsUrl(`https://www.openstreetmap.org/?mlat=${item.lat}&mlon=${item.lng}#map=14/${item.lat}/${item.lng}`);
      return;
    }
    // 2. Table LL pour les villes connues
    const known=LL[item.location];
    if(known){
      setCoords({lat:known[0],lng:known[1]});setLoading(false);
      setMapsUrl(`https://www.openstreetmap.org/?mlat=${known[0]}&mlon=${known[1]}#map=14/${known[0]}/${known[1]}`);
      return;
    }
    // 3. Geocoding Nominatim pour toute autre adresse (Hambach 57910, etc.)
    setLoading(true);
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(item.location)}&format=json&limit=1&accept-language=fr`,{headers:{"Accept-Language":"fr"}})
      .then(r=>r.json())
      .then(data=>{
        if(data&&data[0]){
          const lat=parseFloat(data[0].lat),lng=parseFloat(data[0].lon);
          setCoords({lat,lng});
          setMapsUrl(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`);
        }else{setCoords(null);}
        setLoading(false);
      })
      .catch(()=>{setCoords(null);setLoading(false);});
  },[item.id,item.location]);

  useEffect(()=>{
    if(!coords||!mapRef.current||!window.L)return;
    // Nettoyer la carte précédente
    if(leafletRef.current){leafletRef.current.remove();leafletRef.current=null;}
    const map=window.L.map(mapRef.current,{zoomControl:true,scrollWheelZoom:false,attributionControl:false})
      .setView([coords.lat,coords.lng],14);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
    const icon=window.L.divIcon({
      html:`<div style="width:36px;height:36px;background:linear-gradient(135deg,#6C63FF,#FF8A5C);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 12px rgba(108,99,255,.4)"></div>`,
      className:"",iconSize:[36,36],iconAnchor:[18,36]
    });
    window.L.marker([coords.lat,coords.lng],{icon})
      .addTo(map)
      .bindPopup(`<strong style="font-size:13px">${item.location}</strong><br><span style="font-size:11px;color:#767676">Zone approximative</span>`,{closeButton:false})
      .openPopup();
    leafletRef.current=map;
    return()=>{if(leafletRef.current){leafletRef.current.remove();leafletRef.current=null;}};
  },[coords]);

  return <div style={{marginBottom:24}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
      <h3 style={{fontSize:15,fontWeight:700,fontFamily:"var(--fd)"}}>📍 Localisation</h3>
      {!loading&&coords&&<a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"var(--p)",fontWeight:600,textDecoration:"none"}}>Ouvrir dans Maps ↗</a>}
    </div>
    <p style={{fontSize:12,color:"var(--g)",marginBottom:10}}>Zone approximative · <strong>{item.location}</strong> · adresse exacte après réservation</p>
    <div style={{borderRadius:16,overflow:"hidden",border:"1px solid var(--bd)",boxShadow:"var(--sh)",height:240,background:"var(--bgw)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      {loading&&<div style={{fontSize:13,color:"var(--g)"}}>🗺️ Chargement de la carte...</div>}
      {!loading&&!coords&&<div style={{fontSize:13,color:"var(--g)",textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>📍</div>Localisation : <strong>{item.location}</strong></div>}
      <div ref={mapRef} style={{width:"100%",height:"100%",display:coords&&!loading?"block":"none"}}/>
    </div>
  </div>;
}

function Detail({item,onClose,state,dispatch,setPage,setConvId,setShowShop,setProfTab,onAuthRequired}){
  const[gal,setGal]=useState(null);
  const[days,setDays]=useState(3);const[sd,setSd]=useState(()=>{const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().split('T')[0]});const[ed,setEd]=useState(()=>{const d=new Date();d.setDate(d.getDate()+4);return d.toISOString().split('T')[0]});const[durType,setDurType]=useState("jour");const[timeSlot,setTimeSlot]=useState("");const[booked,setBooked]=useState(false);const[showRF,setShowRF]=useState(false);const[rt,setRt]=useState("");const[rr,setRr]=useState(5);
  const[payStep,setPayStep]=useState(0);const[showBid,setShowBid]=useState(false);const[bidAmt,setBidAmt]=useState('');const[payMethod,setPayMethod]=useState("card");const[cardNum,setCardNum]=useState("");const[cardExp,setCardExp]=useState("");const[cardCvc,setCardCvc]=useState("");
  const[showVerifModal,setShowVerifModal]=useState(false);
  const userRentals=(state.user?.rentals||0)+state.bookings.filter(b=>b.userId===state.user?.id).length;
  const userGrade=getGrade(userRentals);
  const plusInfo=getPlusInfo(state.subscription);
  const effRate=getEffectiveFeeRate(userRentals,state.subscription);
  const base=item.price*days;
  const fee=Math.round(base*effRate*100)/100;
  const feeBase=Math.round(base*0.12*100)/100;
  const feeAtGrade=Math.round(base*userGrade.feeRate*100)/100;
  const gradeSaved=Math.round((feeBase-feeAtGrade)*100)/100;   // économie liée au grade (vs 12%)
  const plusSaved=Math.round((feeAtGrade-fee)*100)/100;         // économie liée à Cercle+ (après plancher)
  const feeSaved=Math.round((feeBase-fee)*100)/100;             // économie totale
  const tot=Math.round((base+fee)*100)/100;
  useEffect(()=>{if(sd&&ed){const d=Math.max(1,Math.round((new Date(ed)-new Date(sd))/864e5));setDays(d)}},[sd,ed]);
  const hasBlockedInRange=React.useMemo(()=>{
    if(!sd||!ed||!item.blockedDates||!item.blockedDates.length)return false;
    const bSet=new Set(item.blockedDates);
    const start=new Date(sd);const end=new Date(ed);
    for(let dt=new Date(start);dt<=end;dt.setDate(dt.getDate()+1)){
      const key=dt.toISOString().slice(0,10);
      if(bSet.has(key))return true;
    }
    return false;
  },[sd,ed,item.blockedDates]);
  const VEHICLE_CATS=["vehicles","vehicle","voiture","moto","transport"];
  const needsDrivingLicense=VEHICLE_CATS.includes((item.cat||"").toLowerCase());
  const pc=state.profileCompletion||{identity:false,phone:false,drivingLicense:false,bankAccount:false};
  const handleReserveClick=()=>{if(!state.user)return;if(needsDrivingLicense&&!pc.drivingLicense){setShowVerifModal(true);return;}setPayStep(1);};
  const book=()=>{if(!state.user)return;dispatch({type:"BOOK",payload:{id:uid(),itemId:item.id,itemTitle:item.title,itemImg:item.images[0],ownerId:item.owner.id,ownerName:item.owner.name,userId:state.user.id,startDate:sd,endDate:ed,status:"confirmed",total:tot,deposit:item.deposit,days,createdAt:new Date(),payMethod}});setBooked(true);setPayStep(0)};
  const startConv=()=>{if(!state.user)return;const cid=`c_${item.owner.id}_${state.user.id}_${item.id}`;dispatch({type:"MSG",payload:{id:uid(),cid,from:state.user.id,fromName:state.user.name||'',fromAvatar:state.user.avatar||'😊',to:item.owner.id,toName:item.owner.name||'',toAvatar:item.owner.avatar||'😊',itemId:item.id,itemTitle:item.title||'',text:`Bonjour ! "${item.title}" est-il disponible ?`,timestamp:new Date()}});onClose();setConvId(cid);setPage("messages")};
  const submitRev=()=>{if(!state.user||!rt)return;dispatch({type:"REVIEW",payload:{id:uid(),itemId:item.id,fromUserId:state.user.id,fromUserName:state.user.name,fromUserAvatar:state.user.avatar,rating:rr,text:rt,createdAt:new Date()}});setShowRF(false);setRt("")};
  const iRevs=state.reviews.filter(r=>r.itemId===item.id);
  const condC=item.condition==="Comme neuf"?{bg:"rgba(22,163,74,.1)",color:"var(--greend)",bd:"rgba(22,163,74,.2)"}:item.condition==="Très bon état"?{bg:"rgba(59,130,246,.1)",color:"#1e40af",bd:"rgba(59,130,246,.2)"}:{bg:"rgba(245,158,11,.1)",color:"#92400e",bd:"rgba(245,158,11,.2)"};
  return <div className="ov" style={{background:"var(--bg)"}}>
    {gal&&<Gallery images={gal.imgs} start={gal.idx||0} onClose={()=>setGal(null)}/>}

    {/* ── Vérif permis ── */}
    {showVerifModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:22,padding:28,maxWidth:380,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
        <div style={{width:52,height:52,background:"#fef3c7",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:16}}>🚗</div>
        <h2 style={{fontSize:18,fontWeight:700,color:"#111827",marginBottom:8}}>Document requis</h2>
        <p style={{fontSize:14,color:"#6b7280",lineHeight:1.6,marginBottom:24}}>Pour louer ce type d'objet, vous devez ajouter votre permis de conduire dans votre profil.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button onClick={()=>{setShowVerifModal(false);onClose();if(setProfTab)setProfTab("parametres");setPage("profile");}} style={{width:"100%",padding:"12px 0",background:"var(--p)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer"}}>Compléter mon profil</button>
          <button onClick={()=>setShowVerifModal(false)} style={{width:"100%",padding:"12px 0",background:"#f9fafb",color:"#374151",border:"1.5px solid #e5e7eb",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer"}}>Annuler</button>
        </div>
      </div>
    </div>}

    {/* ── Paiement overlay ── */}
    {payStep===1&&<div style={{position:"fixed",inset:0,background:"rgba(20,14,40,.65)",zIndex:250,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"var(--w)",borderRadius:24,padding:28,maxWidth:420,width:"100%",boxShadow:"0 24px 80px rgba(0,0,0,.3)",maxHeight:"90dvh",overflowY:"auto"}}>
        <h3 style={{fontFamily:"var(--fd)",fontSize:17,fontWeight:800,marginBottom:16,color:"var(--dk)"}}>🔒 Paiement sécurisé</h3>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>{[["card","💳 Carte"],["gpay","Google Pay"],["apple","🍎 Apple Pay"],["paypal","🅿️ PayPal"]].map(([id,label])=>
          <button key={id} className={"pill"+(payMethod===id?" on":"")} onClick={()=>setPayMethod(id)}>{label}</button>
        )}</div>
        {payMethod==="card"&&<>
          <div className="fg"><label>Numéro de carte</label><input value={cardNum} onChange={e=>setCardNum(e.target.value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim())} placeholder="4242 4242 4242 4242" maxLength={19}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div className="fg"><label>Expiration</label><input value={cardExp} onChange={e=>setCardExp(e.target.value)} placeholder="MM/AA" maxLength={5}/></div>
            <div className="fg"><label>CVC</label><input value={cardCvc} onChange={e=>setCardCvc(e.target.value)} placeholder="123" maxLength={3} type="password"/></div>
          </div>
        </>}
        <div style={{borderRadius:14,overflow:"hidden",marginTop:10,border:"1px solid var(--bd)",marginBottom:16}}>
          <div style={{background:"var(--bgw)",padding:"12px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13}}><span style={{color:"var(--g)"}}>Location ({days}j)</span><strong>{base.toFixed(2)} €</strong></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13}}><span style={{color:"var(--g)"}}>Frais ({(effRate*100).toFixed(0)}%){plusInfo.active?" · ✦ Cercle+":""}</span><strong>{fee.toFixed(2)} €</strong></div>
            <div style={{borderTop:"1px solid var(--bd)",paddingTop:8,marginTop:6,display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:15}}>
              <span>Total</span><span style={{color:"var(--p)"}}>{tot.toFixed(2)} €</span>
            </div>
          </div>
          <div style={{background:"#fffbeb",borderTop:"1px solid #fde68a",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13}}>
            <div><span style={{fontWeight:700,color:"#78350f"}}>🔒 Caution</span><span style={{fontSize:11,color:"#92400e",marginLeft:6}}>Libérée sous 48h</span></div>
            <strong style={{color:"#78350f"}}>{item.deposit} €</strong>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="bs" style={{flex:1}} onClick={()=>setPayStep(0)}>← Retour</button>
          <button className="bp" style={{flex:2}} onClick={book}>🔒 Confirmer {tot.toFixed(2)} €</button>
        </div>
      </div>
    </div>}

    {/* ══════════ HEADER STICKY ══════════ */}
    <div className="dv2-hdr">
      <button className="dv2-back" onClick={onClose}>← Retour</button>
      <span className="dv2-hdr-title">{item.title}</span>
      <div className="dv2-hdr-actions">
        <button className={"dv2-icon-btn"+(state.favorites.has(item.id)?" on":"")}
          onClick={()=>{if(!state.user){onAuthRequired?.();return;}dispatch({type:"TOG_FAV",id:item.id,ownerId:item.owner?.id,title:item.title})}}>
          <I.Heart f={state.favorites.has(item.id)}/>
        </button>
        <button className="dv2-icon-btn"><I.Share/></button>
      </div>
    </div>

    {/* ══════════ GALERIE ══════════ */}
    <div className="dv2-gal">
      <div className="dv2-gal-main" onClick={()=>setGal({imgs:item.images,idx:0})}>
        <img src={item.images[0]} alt={item.title}/>
        <div className="dv2-gal-badge">📷 {item.images.length} photo{item.images.length>1?"s":""}</div>
      </div>
      <div className="dv2-gal-thumbs">
        {item.images[1]&&<div className="dv2-gal-thumb" onClick={()=>setGal({imgs:item.images,idx:1})}><img src={item.images[1]} alt=""/></div>}
        {item.images[2]&&<div className="dv2-gal-thumb" onClick={()=>setGal({imgs:item.images,idx:2})}><img src={item.images[2]} alt=""/></div>}
        {item.images[3]&&<div className="dv2-gal-thumb" onClick={()=>setGal({imgs:item.images,idx:3})}>
          <img src={item.images[3]} alt=""/>
          {item.images.length>4&&<div className="dv2-gal-more">+{item.images.length-3}</div>}
        </div>}
      </div>
    </div>

    {/* ══════════ BODY 2 COLONNES ══════════ */}
    <div className="dv2-body">

      {/* ── COLONNE GAUCHE ── */}
      <div>
        {/* Titre & badges */}
        <div style={{marginBottom:26}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",padding:"4px 10px",borderRadius:8,background:"rgba(124,58,237,.1)",color:"var(--p)"}}>{CATS_FR[item.cat]||item.cat}</span>
            <span style={{fontSize:10,fontWeight:700,padding:"5px 12px",borderRadius:20,background:condC.bg,color:condC.color,border:"1px solid "+condC.bd}}>{item.condition}</span>
            {item.available!==false
              ?<span style={{fontSize:10,fontWeight:700,padding:"5px 12px",borderRadius:20,background:"rgba(22,163,74,.1)",color:"var(--greend)",border:"1px solid rgba(22,163,74,.2)"}}>✓ Disponible</span>
              :<span style={{fontSize:10,fontWeight:700,padding:"5px 12px",borderRadius:20,background:"rgba(220,38,38,.08)",color:"#991b1b",border:"1px solid rgba(220,38,38,.15)"}}>Indisponible</span>}
          </div>
          <h1 style={{fontFamily:"var(--fd)",fontSize:28,fontWeight:800,lineHeight:1.15,marginBottom:10,letterSpacing:"-.03em",color:"var(--dk)"}}>{item.title}</h1>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <span style={{display:"flex",alignItems:"center",gap:3,fontWeight:700,fontSize:14}}><span style={{color:"#f59e0b"}}>★</span>{item.rating}</span>
            <span style={{color:"var(--gl)"}}>·</span>
            <span style={{fontSize:13,textDecoration:"underline",cursor:"pointer",fontWeight:500}}>{item.reviews+iRevs.length} avis</span>
            <span style={{color:"var(--gl)"}}>·</span>
            <span style={{fontSize:13,color:"var(--g)",display:"flex",alignItems:"center",gap:3}}>📍 {item.location}</span>
          </div>
        </div>

        {/* Propriétaire */}
        <div className="dv2-owner" onClick={()=>{onClose();setShowShop&&setShowShop(item.owner)}}>
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,var(--bgw),var(--bd))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,border:"2px solid var(--bd)"}}>{item.owner.avatar}</div>
            {item.owner.verified&&<div style={{position:"absolute",bottom:-2,right:-2,width:18,height:18,borderRadius:"50%",background:"var(--p)",border:"2.5px solid var(--w)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700}}>✓</div>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,color:"var(--g)",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>Proposé par</div>
            <div style={{fontSize:15,fontWeight:800,color:"var(--dk)",marginBottom:2}}>{item.owner.name}</div>
            <div style={{fontSize:11,color:"var(--g)"}}>Membre {item.owner.since} · {item.owner.rentals} locations · ⏱ {item.owner.responseTime}</div>
            {state.user&&state.user.id!==item.owner.id&&(()=>{
              const isF=state.following?.some(f=>f.id===item.owner.id);
              return <button onClick={e=>{e.stopPropagation();dispatch({type:isF?"UNFOLLOW":"FOLLOW",userId:item.owner.id,userName:item.owner.name,userAvatar:item.owner.avatar,userSince:item.owner.since})}}
                style={{marginTop:7,padding:"5px 14px",borderRadius:20,border:"1.5px solid "+(isF?"#e5e7eb":"var(--p)"),background:isF?"var(--bgw)":"var(--p)",color:isF?"var(--g)":"#fff",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all .15s"}}>{isF?"✓ Abonné":"+ Suivre"}</button>;
            })()}
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:18,fontWeight:800,color:"#f59e0b"}}>★ {item.owner.rating}</div>
            <div style={{fontSize:10,color:"var(--g)"}}>proprio</div>
          </div>
        </div>

        {/* Garanties */}
        <div className="dv2-guar">
          {[item.owner.verified&&{ic:"🪪",t:"Identité vérifiée",p:"Propriétaire vérifié par Cercle",c:"#7C3AED"},
            {ic:"💬",t:"Messagerie sécurisée",p:"Chat intégré et chiffré",c:"#3B82F6"},
            {ic:"🔄",t:"Annulation flexible",p:"Gratuite jusqu'à 24h avant",c:"#16A34A"},
            {ic:"🛡️",t:"Caution sécurisée",p:"Restituée sous 48h après retour",c:"#F59E0B"}
          ].filter(Boolean).map((g,i)=><div key={i} className="dv2-guar-item" style={{borderLeftColor:g.c}}>
            <div style={{width:38,height:38,borderRadius:12,background:g.c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{g.ic}</div>
            <div><div style={{fontSize:12,fontWeight:700,color:"var(--dk)",marginBottom:2}}>{g.t}</div><div style={{fontSize:11,color:"var(--g)",lineHeight:1.4}}>{g.p}</div></div>
          </div>)}
        </div>

        {/* Description */}
        <div style={{marginBottom:28,paddingBottom:28,borderBottom:"1px solid var(--bd)"}}>
          <h3 className="dv2-sh">Description</h3>
          <p style={{fontSize:14,lineHeight:1.78,color:"var(--tx)",margin:0}}>{item.description}</p>
        </div>

        {/* Caractéristiques */}
        <div style={{marginBottom:28,paddingBottom:28,borderBottom:"1px solid var(--bd)"}}>
          <h3 className="dv2-sh">Caractéristiques</h3>
          <div className="dv2-chars">
            {[["📦","État",item.condition],["💰","Caution",item.deposit+" €"],["📍","Lieu",item.location],["🚚","Livraison","Disponible"],["📅","Publié","2025"],["⏱️","Durée min.","1 jour"]].map(([ic,l,v],i)=>
              <div key={i} className="dv2-char">
                <div style={{width:34,height:34,borderRadius:10,background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,marginBottom:8,border:"1px solid var(--bd)"}}>{ic}</div>
                <div style={{fontSize:10,fontWeight:700,color:"var(--g)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:3}}>{l}</div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--dk)"}}>{v}</div>
              </div>
            )}
          </div>
        </div>

        {/* Avis */}
        <div style={{marginBottom:28,paddingBottom:28,borderBottom:"1px solid var(--bd)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 className="dv2-sh" style={{margin:0}}>⭐ {item.rating} · {item.reviews+iRevs.length} avis{item.likeCount>0?` · ❤️ ${item.likeCount}`:''}</h3>
            {state.user&&<button className="bs" style={{fontSize:11,padding:"6px 14px"}} onClick={()=>setShowRF(!showRF)}>Laisser un avis</button>}
          </div>
          {showRF&&<div style={{padding:16,background:"var(--bgw)",borderRadius:16,border:"1px solid var(--bd)",marginBottom:16}}>
            <div style={{display:"flex",gap:2,marginBottom:12}}>
              {[1,2,3,4,5].map(n=><button key={n} className="dv2-star-pick" style={{color:n<=rr?"#f59e0b":"var(--bd)"}} onClick={()=>setRr(n)}>★</button>)}
            </div>
            <textarea value={rt} onChange={e=>setRt(e.target.value)} placeholder="Partagez votre expérience..." style={{width:"100%",padding:"10px 14px",border:"1.5px solid var(--bd)",borderRadius:12,fontSize:13,resize:"vertical",minHeight:80,fontFamily:"var(--f)",outline:"none",boxSizing:"border-box",background:"var(--w)"}}/>
            <button className="bp" style={{marginTop:10,fontSize:12,padding:"8px 18px"}} onClick={submitRev}>Publier l'avis</button>
          </div>}
          {iRevs.length===0&&<p style={{fontSize:13,color:"var(--g)"}}>Aucun avis pour l'instant. Soyez le premier !</p>}
          {iRevs.map(r=><div key={r.id} className="dv2-rev">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,var(--bgw),var(--bd))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0,border:"1.5px solid var(--bd)"}}>{r.fromUserAvatar}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"var(--dk)"}}>{r.fromUserName}</div>
                <div style={{fontSize:10,color:"var(--gl)"}}>{ds(r.createdAt)}</div>
              </div>
              <div style={{display:"flex",gap:1}}>
                {[1,2,3,4,5].map(n=><span key={n} style={{fontSize:12,color:n<=r.rating?"#f59e0b":"var(--bd)"}}>★</span>)}
              </div>
            </div>
            <p style={{fontSize:13,lineHeight:1.65,color:"var(--tx)",margin:0,paddingLeft:48}}>{r.text}</p>
          </div>)}
        </div>

        {/* Carte */}
        <DetailMap item={item}/>
      </div>

      {/* ── COLONNE DROITE : Booking card ── */}
      <div className="dv2-sticky">
        <div className="dv2-card">

          {/* Prix + note */}
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:4}}>
            <div>
              <span className="dv2-price-big">{item.price} €</span>
              <span style={{fontSize:14,color:"var(--g)",fontWeight:500,marginLeft:4}}>/ jour</span>
            </div>
            <div style={{background:"var(--bgw)",borderRadius:12,padding:"8px 12px",border:"1px solid var(--bd)",textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:16,fontWeight:800,color:"var(--dk)"}}><span style={{color:"#f59e0b"}}>★</span> {item.rating}</div>
              <div style={{fontSize:10,color:"var(--g)"}}>{item.reviews+iRevs.length} avis</div>
            </div>
          </div>
          <div style={{fontSize:11,color:"var(--g)",marginBottom:14}}>Caution {item.deposit} € · Remboursée en 48h</div>
          <div className="dv2-sep" style={{margin:"0 0 16px"}}/>

          {/* Type de location */}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:"var(--g)",marginBottom:6}}>Type</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {[["jour","📅 Journée"],["demi","☀️ Demi-journée"]].map(([id,l])=>
                <button key={id} onClick={()=>setDurType(id)} style={{padding:"8px 4px",borderRadius:10,border:"1.5px solid "+(durType===id?"var(--p)":"var(--bd)"),background:durType===id?"#f5f3ff":"var(--bgw)",color:durType===id?"var(--p)":"var(--dk)",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>{l}</button>
              )}
            </div>
          </div>

          {/* Créneaux */}
          {durType==="demi"&&<div style={{marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:"var(--g)",marginBottom:6}}>Créneau</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {["Matin (8h-12h)","Après-midi (14h-18h)"].map(s=>
                <button key={s} onClick={()=>setTimeSlot(s)} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid "+(timeSlot===s?"var(--p)":"var(--bd)"),background:timeSlot===s?"#f5f3ff":"var(--bgw)",color:timeSlot===s?"var(--p)":"var(--dk)",fontSize:11,fontWeight:600,cursor:"pointer"}}>{s}</button>
              )}
            </div>
          </div>}

          {/* Dates — champs + mini calendriers */}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:"var(--g)",marginBottom:6}}>Dates · {days} jour{days>1?"s":""}</div>
            <div className="dv2-date-grid">
              <div className="dv2-date-field"><label>Début</label><input type="date" value={sd} onChange={e=>setSd(e.target.value)}/></div>
              <div className="dv2-date-field"><label>Fin</label><input type="date" value={ed} min={sd} onChange={e=>setEd(e.target.value)}/></div>
            </div>
          </div>
          <div style={{marginBottom:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <MiniCal value={sd} onChange={setSd} label="Début" blockedDates={item.blockedDates}/>
            <MiniCal value={ed} onChange={setEd} label="Fin" minDate={sd} blockedDates={item.blockedDates}/>
          </div>

          {/* Retrait */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:"var(--g)",marginBottom:6}}>Retrait</div>
            <select style={{width:"100%",padding:"10px 12px",border:"1.5px solid var(--bd)",borderRadius:12,fontSize:13,background:"var(--bgw)",color:"var(--dk)",outline:"none",fontFamily:"var(--f)"}}>
              <option>📍 En main propre</option><option>🚚 Livraison (+10 €)</option>
            </select>
          </div>

          {/* Résumé */}
          <div className="dv2-summary">
            <div className="dv2-sum-row"><span>{item.price} € × {days} jour{days>1?"s":""}</span><span style={{fontWeight:600}}>{base.toFixed(2)} €</span></div>
            <div className="dv2-sum-row"><span>Frais de service ({(effRate*100).toFixed(0)}%)</span><span style={{fontWeight:600}}>{fee.toFixed(2)} €</span></div>
            {state.user&&gradeSaved>0&&<div className="dv2-sum-sav" style={{color:"#059669"}}><span>{userGrade.icon} Réduction {userGrade.name}</span><span style={{fontWeight:700}}>−{gradeSaved.toFixed(2)} €</span></div>}
            {state.user&&plusInfo.active&&plusSaved>0&&<div className="dv2-sum-sav" style={{color:"var(--p)"}}><span>✦ Cercle+ −{(plusInfo.reduction*100).toFixed(0)}%</span><span style={{fontWeight:700}}>−{plusSaved.toFixed(2)} €</span></div>}
            <div className="dv2-sum-total"><span>Total</span><span style={{color:"var(--p)"}}>{tot.toFixed(2)} €</span></div>
          </div>

          {/* Caution */}
          <div style={{background:"#fffbeb",borderRadius:12,border:"1px solid #fde68a",padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:12,fontWeight:700,color:"#78350f"}}>🔒 Caution (empreinte)</div><div style={{fontSize:11,color:"#92400e",marginTop:1}}>Non débitée · Libérée sous 48h</div></div>
            <span style={{fontWeight:800,fontSize:15,color:"#78350f"}}>{item.deposit} €</span>
          </div>

          {hasBlockedInRange&&<div style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:12,color:"#dc2626",fontWeight:600}}>⛔ Ces dates contiennent des jours indisponibles.</div>}

          {/* CTA Réserver */}
          <button className={"dv2-cta "+(booked?"dv2-cta-done":hasBlockedInRange||!state.user?"dv2-cta-dis":"dv2-cta-go")}
            onClick={()=>state.user&&!hasBlockedInRange&&!booked&&handleReserveClick()}
            disabled={booked||!state.user||hasBlockedInRange}>
            {!state.user?"🔐 Connectez-vous":booked?"✓ Réservé !":hasBlockedInRange?"Dates indisponibles":"Réserver · "+tot.toFixed(2)+" €"}
          </button>

          {!state.user&&<p style={{textAlign:"center",fontSize:11,color:"var(--g)",marginBottom:10}}>Pas encore de compte ? C'est gratuit.</p>}

          {/* Contacter */}
          <button className="dv2-msg-btn" onClick={startConv} disabled={!state.user}><I.Msg/> Contacter {item.owner.name}</button>

          {/* Trust */}
          <div className="dv2-trust">🛡️ Paiement SSL · Fonds sécurisés · Caution restituable</div>
        </div>
      </div>
    </div>
  </div>
}


/* ========== GRADE SYSTEM ========== */
const GRADES = [
  { id:"voisin",   name:"Voisin",   icon:"🤝", min:0,     max:49,    feeRate:0.12, divs:[{label:"I",min:0,max:16},{label:"II",min:17,max:32},{label:"III",min:33,max:49}],           perks:["Commission 12%","Accès à toutes les catégories","Messagerie standard"],           avantages:["Commission 12%","Accès à la plateforme","Support standard"] },
  { id:"habitant", name:"Habitant", icon:"🏠", min:50,    max:499,   feeRate:0.11, divs:[{label:"I",min:50,max:199},{label:"II",min:200,max:349},{label:"III",min:350,max:499}],       perks:["Commission 11%","Badge Habitant sur le profil","1 annonce mise en avant / mois","Priorité légère dans les résultats"],       avantages:["Commission 11%","Badge Habitant sur le profil","Priorité support"] },
  { id:"pilier",   name:"Pilier",   icon:"🏛️", min:500,   max:1999,  feeRate:0.09, divs:[{label:"I",min:500,max:999},{label:"II",min:1000,max:1499},{label:"III",min:1500,max:1999}],  perks:["Commission 9%","Badge Pilier doré","3 annonces mises en avant / mois","Apparition boostée dans la recherche","Statistiques avancées sur ses annonces"],  avantages:["Commission 9%","Mise en avant des annonces","Support prioritaire"] },
  { id:"gardien",  name:"Gardien",  icon:"🛡️", min:2000,  max:4999,  feeRate:0.07, divs:[{label:"I",min:2000,max:2999},{label:"II",min:3000,max:3999},{label:"III",min:4000,max:4999}],perks:["Commission 7%","Badge Gardien premium","6 annonces mises en avant / mois","Boost automatique des nouvelles annonces","Insigne premium visible","Accès aux fonctionnalités bêta"], avantages:["Commission 7%","Annonces boostées","Accès bêta nouvelles fonctionnalités"] },
  { id:"legende",  name:"Légende",  icon:"🌟", min:5000,  max:14999, feeRate:0.05, divs:[{label:"I",min:5000,max:7999},{label:"II",min:8000,max:11999},{label:"III",min:12000,max:14999}],perks:["Commission 5%","Badge Légende ultra-rare","12 annonces mises en avant / mois","Visibilité maximale dans les résultats","Accès aux événements exclusifs Cercle"], avantages:["Commission 5%","Support dédié","Badge Légende exclusif","Accès VIP événements Cercle"] },
  { id:"fondateur",name:"Fondateur Cercle",icon:"👑",min:15000,max:Infinity,feeRate:0.03,divs:[{label:"I",min:15000,max:17999},{label:"II",min:18000,max:21999},{label:"III",min:22000,max:Infinity}],perks:["🏅 Ambassadeur officiel Cercle — représente la plateforme lors d'événements","📊 Parts symboliques dans l'entreprise — participation aux décisions stratégiques","🎟️ 5 à 10 annonces sans aucune commission — pour toujours","🏢 Visite privée et rencontre exclusive avec l'équipe fondatrice","🏆 Trophée physique exclusif envoyé à domicile","⭐ Badge Fondateur doré permanent sur le profil"], avantages:["Commission 3%","Ambassadeur officiel","Parts dans l'entreprise","5-10 annonces sans commission","Visite privée des bureaux","Trophée physique exclusif","Badge doré permanent"] },
];
function getGrade(rentals) { return GRADES.find(g => rentals >= g.min && rentals <= g.max) || GRADES[0]; }
function getNextGrade(rentals) { const i = GRADES.findIndex(g => rentals >= g.min && rentals <= g.max); return i < GRADES.length - 1 ? GRADES[i + 1] : null; }

/* ========== CERCLE+ SUBSCRIPTION ========== */
const PLUS_PRICE = 5.99;          // €/mois
const PLUS_FEE_FLOOR = 0.02;      // plancher absolu : on ne descend jamais sous 2%
const PLUS_BASE_REDUCTION = 0.01; // -1% dès l'abonnement
const PLUS_YEARLY_REDUCTION = 0.01; // -1% supplémentaire à chaque année d'ancienneté
// Nombre d'années complètes d'abonnement (>=0)
function getPlusMonths(sub){
  if(!sub||!sub.active||!sub.startDate)return 0;
  const start=new Date(sub.startDate),now=new Date();
  let m=(now.getFullYear()-start.getFullYear())*12+(now.getMonth()-start.getMonth());
  if(now.getDate()<start.getDate())m--;
  return Math.max(0,m);
}
function getPlusYears(sub){ return Math.floor(getPlusMonths(sub)/12); }
// Réduction de commission apportée par l'abonnement (en points, ex: 0.02 = -2%)
function getPlusReduction(sub){
  if(!sub||!sub.active||!sub.startDate)return 0;
  return PLUS_BASE_REDUCTION + getPlusYears(sub)*PLUS_YEARLY_REDUCTION;
}
// Taux de commission effectif = grade − abonnement, plancher à 2%
function getEffectiveFeeRate(rentals, sub){
  const gradeRate=getGrade(rentals).feeRate;
  return Math.max(PLUS_FEE_FLOOR, Math.round((gradeRate-getPlusReduction(sub))*1000)/1000);
}
// Infos synthétiques pour l'UI
function getPlusInfo(sub){
  const active=!!(sub&&sub.active&&sub.startDate);
  const months=getPlusMonths(sub);
  const years=getPlusYears(sub);
  const reduction=getPlusReduction(sub);
  const monthsToNext=active?(12-(months%12)):null; // mois restants avant le prochain -1%
  const nextReduction=active?(PLUS_BASE_REDUCTION+(years+1)*PLUS_YEARLY_REDUCTION):null;
  return{active,months,years,reduction,monthsToNext,nextReduction,price:PLUS_PRICE,floor:PLUS_FEE_FLOOR};
}
function getDivision(rentals) {
  const g = getGrade(rentals);
  const div = g.divs.find(d => rentals >= d.min && rentals <= d.max) || g.divs[0];
  const nextDiv = g.divs[g.divs.findIndex(d => rentals >= d.min && rentals <= d.max) + 1] || null;
  const prog = nextDiv ? Math.min(100, Math.round(((rentals - div.min) / (nextDiv.min - div.min)) * 100)) : 100;
  return { div, nextDiv, prog };
}
function calcSavings(rentals, avgPrice) {
  const base = GRADES[0].feeRate;
  const current = getGrade(rentals).feeRate;
  return Math.floor(rentals * avgPrice * 3 * (base - current));
}

function CalendarModal({item, dispatch, onClose}) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [month, setMonth] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [blocked, setBlocked] = React.useState(new Set(item.blockedDates||[]));
  const daysInMonth = new Date(month.getFullYear(), month.getMonth()+1, 0).getDate();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const startOffset = (firstDay + 6) % 7;
  const monthLabel = month.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
  function toggleDay(d) {
    const key = `${month.getFullYear()}-${String(month.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    setBlocked(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }
  function save() {
    dispatch({type:'SET_BLOCKED_DATES', id:item.id, dates:[...blocked]});
    onClose();
  }
  const days=['Lu','Ma','Me','Je','Ve','Sa','Di'];
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'var(--w)',borderRadius:20,padding:24,width:340,maxWidth:'95vw',boxShadow:'0 20px 60px rgba(0,0,0,0.25)'}}>
        <h3 style={{margin:'0 0 4px',fontSize:16,fontWeight:700,color:'var(--dk)'}}>📅 Disponibilités</h3>
        <p style={{margin:'0 0 16px',fontSize:12,color:'var(--g)'}}>Touchez les jours pour les bloquer / débloquer</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <button onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))} style={{border:'none',background:'none',fontSize:18,cursor:'pointer',color:'var(--dk)'}}>‹</button>
          <span style={{fontWeight:700,fontSize:14,color:'var(--dk)',textTransform:'capitalize'}}>{monthLabel}</span>
          <button onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))} style={{border:'none',background:'none',fontSize:18,cursor:'pointer',color:'var(--dk)'}}>›</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,marginBottom:12}}>
          {days.map(d=><div key={d} style={{textAlign:'center',fontSize:10,fontWeight:700,color:'var(--g)',padding:'2px 0'}}>{d}</div>)}
          {Array.from({length:startOffset}).map((_,i)=><div key={'e'+i}/>)}
          {Array.from({length:daysInMonth}).map((_,i)=>{
            const d=i+1;
            const key=`${month.getFullYear()}-${String(month.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const date=new Date(month.getFullYear(),month.getMonth(),d);
            const isPast=date<today;
            const isBlocked=blocked.has(key);
            return (
              <div key={d} onClick={()=>!isPast&&toggleDay(d)} style={{textAlign:'center',padding:'6px 2px',borderRadius:8,fontSize:12,fontWeight:600,cursor:isPast?'default':'pointer',background:isBlocked?'#ef4444':isPast?'transparent':'#f0fdf4',color:isBlocked?'#fff':isPast?'#d1d5db':'var(--dk)',opacity:isPast?0.4:1}}>
                {d}
              </div>
            );
          })}
        </div>
        <div style={{display:'flex',gap:8,marginBottom:12}}>
          <div style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--g)'}}><div style={{width:12,height:12,borderRadius:3,background:'#ef4444'}}/>Bloqué</div>
          <div style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--g)'}}><div style={{width:12,height:12,borderRadius:3,background:'#f0fdf4',border:'1px solid #d1fae5'}}/>Libre</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:'10px 0',borderRadius:12,border:'1.5px solid var(--bd)',background:'transparent',color:'var(--dk)',fontWeight:700,cursor:'pointer',fontSize:13}}>Annuler</button>
          <button onClick={save} style={{flex:1,padding:'10px 0',borderRadius:12,border:'none',background:'#6C63FF',color:'#fff',fontWeight:700,cursor:'pointer',fontSize:13}}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

