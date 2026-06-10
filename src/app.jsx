const LOGO_SRC="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAAAXNSR0IArs4c6QAAAUBlWElmTU0AKgAAAAgABgEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAExAAIAAACjAAAAZgE7AAIAAAAMAAABCodpAAQAAAABAAABFgAAAAAAAABgAAAAAQAAAGAAAAABQ2FudmEgKFJlbmRlcmVyKSBkb2M9REFISUpJRkJrQ28gdXNlcj1VQUdOUWlaNjZtdyBicmFuZD1CQUdOUXBwR21fZyB0ZW1wbGF0ZT1CbGFjayBXaGl0ZSBNaW5pbWFsIFNpbXBsZSBCb2xkICBNb2Rlcm4gUHJvZmVzc2lvbmFsIFBob3RvZ3JhcGh5IExldHRlciBLIE11c2V1bSBMb2dvAABjbGFyYV9zbjI5NQAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAyKADAAQAAAABAAAAyAAAAAAG+a/5AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEFGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj45NjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+OTY8L3RpZmY6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";
function PremiumSplash({onDone}){
  const containerRef=useRef(null);
  const logoRef=useRef(null);
  const textRef=useRef(null);
  useEffect(()=>{
    // Garde-fou : si l'onglet est en arrière-plan, GSAP (rAF) est gelé et
    // l'animation ne finirait jamais — on force la fin après 3s quoi qu'il arrive.
    let done=false;
    const finish=()=>{if(!done){done=true;onDone();}};
    const failsafe=setTimeout(finish,3000);
    const gsap=G();
    if(!gsap){setTimeout(finish,2200);return()=>clearTimeout(failsafe);}
    gsap.set(logoRef.current,{autoAlpha:0,scale:.82,y:6});
    gsap.set(textRef.current,{autoAlpha:0,y:10,rotationX:12});
    const tl=gsap.timeline({onComplete:finish});
    tl.to(logoRef.current,{autoAlpha:1,scale:1,y:0,duration:.55,ease:'back.out(1.5)'},0)
      .to(textRef.current,{autoAlpha:1,y:0,rotationX:0,duration:.36,ease:'back.out(1.4)'},0.45)
      .to(logoRef.current,{scale:1.05,duration:.44,ease:'sine.inOut'},1.0)
      .to(logoRef.current,{scale:1,duration:.38,ease:'sine.inOut'},1.44)
      .to(containerRef.current,{autoAlpha:0,duration:.3,ease:'power2.in'},1.88);
    return()=>{clearTimeout(failsafe);tl.kill();};
  },[]);
  return(
    <div ref={containerRef} style={{position:'fixed',inset:0,background:'#F7F6F3',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:20}}>
        <img ref={logoRef} src={LOGO_SRC} alt="Cercle" style={{width:96,height:96,objectFit:'contain'}}/>
        <div ref={textRef} style={{fontFamily:'Georgia,serif',letterSpacing:'0.28em',fontSize:13,fontWeight:400,color:'#1a1a1a',textTransform:'uppercase'}}>Cercle</div>
      </div>
    </div>
  );
}

function OnboardingModal({dispatch,user,onClose}){
  const[sel,setSel]=useState([]);
  const cats=CATS.filter(c=>c.id!=='all');
  const toggle=id=>setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const confirm=()=>{
    const chosen=sel.length>0?sel:[];
    if(chosen.length)dispatch({type:'SET_FAV_CATS',cats:chosen});
    onClose();
  };
  const prenom=user?.name?.split(' ')[0]||'';
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(15,10,30,.55)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',backdropFilter:'blur(4px)'}}>
      <div style={{background:'var(--w)',borderRadius:28,width:'100%',maxWidth:540,padding:'36px 28px 24px',boxShadow:'0 32px 100px rgba(0,0,0,.22)',maxHeight:'92vh',overflowY:'auto',position:'relative'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:44,marginBottom:12}}>🎉</div>
          <h2 style={{fontFamily:'var(--fd)',fontSize:24,fontWeight:800,color:'var(--dk)',letterSpacing:'-.02em',marginBottom:8}}>Bienvenue{prenom?', '+prenom:''} !</h2>
          <p style={{color:'var(--g)',fontSize:14,lineHeight:1.5,maxWidth:360,margin:'0 auto'}}>Quelles catégories t'intéressent ? On personnalise tes recommandations dès maintenant.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:28}}>
          {cats.map(c=>{
            const on=sel.includes(c.id);
            return(
              <button key={c.id} onClick={()=>toggle(c.id)} style={{padding:'16px 8px 12px',borderRadius:16,border:on?'2px solid var(--p)':'1.5px solid var(--bd)',background:on?'rgba(124,58,237,.07)':'var(--bg)',cursor:'pointer',textAlign:'center',transition:'all .18s',outline:'none'}}>
                <div style={{fontSize:26,marginBottom:6}}>{c.icon}</div>
                <div style={{fontSize:11.5,fontWeight:700,color:on?'var(--p)':'var(--dk)',letterSpacing:'.01em'}}>{c.label}</div>
                {on&&<div style={{width:6,height:6,borderRadius:'50%',background:'var(--p)',margin:'6px auto 0'}}/>}
              </button>
            );
          })}
        </div>
        <button onClick={confirm} style={{width:'100%',padding:'14px',borderRadius:14,border:'none',background:sel.length>0?'var(--p)':'var(--dk)',color:'#fff',fontWeight:700,fontSize:15,cursor:'pointer',transition:'all .2s',marginBottom:10,boxShadow:sel.length>0?'0 6px 20px rgba(124,58,237,.35)':'none'}}>
          {sel.length>0?`Voir mes recommandations (${sel.length} catégorie${sel.length>1?'s':''})`:'Continuer sans préférence'}
        </button>
        <button onClick={onClose} style={{width:'100%',border:'none',background:'none',color:'var(--g)',fontSize:13,cursor:'pointer',padding:'6px'}}>Passer pour l'instant</button>
      </div>
    </div>
  );
}

function HeroTypewriter({show}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!show)return;
    const gsap=G();
    if(!gsap||!ref.current)return;
    const chars=ref.current.querySelectorAll('.tw-c');
    if(!chars.length)return;
    const tl=gsap.timeline({delay:.15,repeat:-1,repeatDelay:.8});
    tl.to(chars,{opacity:1,stagger:.055,duration:.01,ease:'none'})
      .to({},{duration:2.5})
      .to(Array.from(chars).reverse(),{opacity:0,stagger:.025,duration:.01,ease:'none'})
      .to({},{duration:.5});
    return()=>{tl.kill();};
  },[show]);
  const mkc=(s,col)=>[...s].map((c,i)=>(
    <span key={i} className="tw-c" style={{opacity:0,color:col?'var(--p)':undefined}}>{c}</span>
  ));
  return(
    <h1 ref={ref} className="hero-el" style={{fontFamily:"var(--fd)",fontSize:"clamp(34px,6vw,58px)",fontWeight:800,color:"var(--dk)",letterSpacing:"-.035em",marginBottom:16,lineHeight:1.05}}>
      {mkc("Louez, partagez,",false)}<br/>{mkc("économisez.",true)}
    </h1>
  );
}

function ToastItem({toast}){
  const icons={s:"✅",b:"🔔",i:"💬",e:"⚠️",w:"🎁"};
  return <div className={"t2 t2-"+(toast.type||"i")}><span>{icons[toast.type]||"💬"}</span><span>{toast.text}</span></div>;
}

function App(){
  // Persist login
  const[loaded,setLoaded]=useState(false);
  const[splash,setSplash]=useState(true);

  
  const[state,dispatch]=useReducer(reducer,init);
  const[page,_setPage]=useState("home");
  const navStackRef=useRef([]);
  const setPage=(p)=>{const np=(typeof p==='function')?p(page):p;if(np!==page)navStackRef.current.push(page);_setPage(np);};
  const goBack=()=>{const st=navStackRef.current;let prev=st.length?st.pop():"home";setInfoPage(null);_setPage(prev);window.scrollTo({top:0,behavior:'smooth'});};
  const[profTab,setProfTab]=useState("annonces");
  const[editItem,setEditItem]=useState(null);
  const[cat,setCat]=useState("all");
  const[sel,setSel]=useState(null);
  const prevPageRef=useRef("home");
  const openDetail=(item)=>{prevPageRef.current=page;setSel(item);};
  const closeDetail=()=>{setSel(null);setPage(prevPageRef.current);};
  const[showF,setShowF]=useState(false);
  const[showS,setShowS]=useState(false);
  const[showA,setShowA]=useState(null);
  const[showOnboarding,setShowOnboarding]=useState(false);
  const[menu,setMenu]=useState(false);
  const[q,setQ]=useState("");const[lq,setLq]=useState("");
  const[toasts,setToasts]=useState([]);
  const addToast=(text,type='i')=>{const id=uid();setToasts(t=>[...t,{id,text,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500)};
  const[confirmPage,setConfirmPage]=useState(()=>{try{const p=new URLSearchParams(window.location.search);const a=p.get('annonce'),ac=p.get('action');return(a&&ac==='confirm')?{annonce:a}:null}catch{return null}});
  const[cid,setCid]=useState(null);
  const[dark,setDark]=useState(false);
  useEffect(()=>{document.documentElement.classList.toggle('dark',dark);document.body.style.background=dark?'#0f0f13':''},[dark]);
  const[mode,setMode]=useState('perso'); // 'perso' or 'pro'
  const[listingTab,setListingTab]=useState('particuliers'); // 'particuliers' or 'professionnels'
  const[showChat,setShowChat]=useState(false);
  const[showGallery,setShowGallery]=useState(null);
  const[showShop,setShowShop]=useState(null);
  const[infoPage,setInfoPage]=useState(null);
  const goInfo=(id)=>{setInfoPage(id);setPage("info");window.scrollTo(0,0);};
  const[pushNotif,setPushNotif]=useState(null);
  const[openSection,setOpenSection]=useState(null);
  const toggleSection=(name)=>setOpenSection(prev=>prev===name?null:name);
  const[lang,setLang]=useState('fr');
  const[filters,setFilters]=useState({priceMin:0,priceMax:500,condition:"Tous",options:[],sort:"pertinence",filterCat:"all",minRating:0,searchDate:"",userLocation:null,maxDistance:20});
  const activeFilterCount=(filters.priceMin>0?1:0)+(filters.priceMax<500?1:0)+(filters.condition!=="Tous"?1:0)+(filters.options.length?1:0)+(filters.sort!=="pertinence"?1:0)+(filters.filterCat!=="all"?1:0)+(filters.minRating>0?1:0)+(filters.searchDate?1:0)+(filters.userLocation?1:0);

  const allPerso=useMemo(()=>{const seen=new Set();return[...state.items,...state.userItems,...state.cloudItems].filter(i=>{if(i.isPro||i.owner?.isPro)return false;if(seen.has(i.id))return false;seen.add(i.id);return true;});},[state.items,state.userItems,state.cloudItems]);
  const allPro=useMemo(()=>{const seen=new Set();return[...state.proItems,...state.userItems.filter(i=>i.isPro||i.owner?.isPro),...state.cloudItems.filter(i=>i.isPro||i.owner?.isPro)].filter(i=>{if(seen.has(i.id))return false;seen.add(i.id);return true;});},[state.proItems,state.userItems,state.cloudItems]);
  const all=mode==='pro'?allPro:(listingTab==='professionnels'?allPro:allPerso);
  const unread=state.notifications.filter(n=>!n.read).length;

  const filtered=useMemo(()=>{
    let r=all;
    if(cat!=="all")r=r.filter(i=>i.cat===cat);
    if(filters.filterCat&&filters.filterCat!=="all")r=r.filter(i=>i.cat===filters.filterCat);
    if(filters.searchDate)r=r.filter(i=>i.available!==false);
    if(q){const s=q.toLowerCase();r=r.filter(i=>i.title.toLowerCase().includes(s)||i.cat.includes(s)||i.location.toLowerCase().includes(s))}
    if(lq){const s=lq.toLowerCase();r=r.filter(i=>i.location.toLowerCase().includes(s))}
    r=r.filter(i=>i.price>=filters.priceMin&&i.price<=filters.priceMax);
    if(filters.condition!=="Tous")r=r.filter(i=>i.condition===filters.condition);
    if(filters.minRating>0)r=r.filter(i=>i.rating>=filters.minRating);
    if((filters.options||[]).includes("Propriétaire vérifié"))r=r.filter(i=>i.owner?.verified);
    // Filtre proximité
    if(filters.userLocation&&filters.maxDistance>0){const{lat,lng}=filters.userLocation;r=r.filter(i=>{const c=LL[i.location];if(!c)return true;return haversine(lat,lng,c[0],c[1])<=filters.maxDistance;});}
    // Sort
    if(filters.sort==="price_asc")r=[...r].sort((a,b)=>a.price-b.price);
    else if(filters.sort==="price_desc")r=[...r].sort((a,b)=>b.price-a.price);
    else if(filters.sort==="rating")r=[...r].sort((a,b)=>b.rating-a.rating);
    else if(filters.sort==="nearest"&&filters.userLocation){const{lat,lng}=filters.userLocation;r=[...r].sort((a,b)=>{const ca=LL[a.location];const cb=LL[b.location];const da=ca?haversine(lat,lng,ca[0],ca[1]):9999;const db=cb?haversine(lat,lng,cb[0],cb[1]):9999;return da-db;});}
    return r;
  },[all,cat,q,lq,filters]);

  const search=(query,loc)=>{setQ(query);setLq(loc||"");setCat("all");setPage("home")};
  useEffect(()=>{if(state.notifications.length){const l=state.notifications[0];if(!l.read){const type=l.kind==="badge"?"s":l.kind==="wallet"?"s":l.kind==="referral"?"w":l.kind==="dispute"?"e":"b";addToast(l.text,type);setPushNotif(l);setTimeout(()=>setPushNotif(null),4000)}}},[state.notifications.length]);
  useEffect(()=>{if(!state.user)return;const b=state.bookings.filter(x=>x.userId===state.user.id);if(b.length>=1&&!state.badges.includes("first_rental"))dispatch({type:"EARN_BADGE",badge:"first_rental"});if(b.length>=5&&!state.badges.includes("super_renter"))dispatch({type:"EARN_BADGE",badge:"super_renter"});const BADGE_KEY='cercle_badge_verifie_notified';if(state.user.verified&&!state.badges.includes("verified")&&!localStorage.getItem(BADGE_KEY)){dispatch({type:"EARN_BADGE",badge:"verified"});localStorage.setItem(BADGE_KEY,'1');}if(state.favorites.size>=10&&!state.badges.includes("collector"))dispatch({type:"EARN_BADGE",badge:"collector"});if(state.referrals.length>=1&&!state.badges.includes("ambassador"))dispatch({type:"EARN_BADGE",badge:"ambassador"});if(state.reviews.length>=1&&!state.badges.includes("reviewer"))dispatch({type:"EARN_BADGE",badge:"reviewer"});const gr=getGrade((state.user.rentals||0)+b.length);if(["pilier","gardien","legende","fondateur"].includes(gr.id)&&!state.badges.includes("loyal"))dispatch({type:"EARN_BADGE",badge:"loyal"})},[state.bookings.length,state.favorites.size,state.referrals.length,state.reviews.length,state.user?.verified]);
  // Restore session via Firebase Auth + localStorage fallback
  useEffect(()=>{
    if(window.auth){
      const unsub=window.auth.onAuthStateChanged(firebaseUser=>{
        if(firebaseUser){
          // Firebase session active, fetch profile from Firestore
          // Défauts robustes : garantit id/name/avatar même si le doc Firestore est incomplet
          const base={id:firebaseUser.uid,email:firebaseUser.email||"",name:firebaseUser.displayName||(firebaseUser.email?firebaseUser.email.split('@')[0]:"Utilisateur"),avatar:"😊",avatarUrl:firebaseUser.photoURL||null,verified:!!firebaseUser.emailVerified,since:new Date().getFullYear(),bio:"",location:"",rating:0,rentals:0,responseTime:"~1h",isPro:false};
          const fromLS=()=>{try{const s=localStorage.getItem('cercle_user_'+firebaseUser.email)||localStorage.getItem('cercle_user_'+(firebaseUser.email||'').toLowerCase());if(s){const{_pwd,...p}=JSON.parse(s);return p;}}catch(e){}return null;};
          if(window.db){
            window.db.collection('users').doc(firebaseUser.uid).get()
              .then(doc=>{
                if(doc.exists)dispatch({type:'LOGIN',payload:{...base,...doc.data(),id:firebaseUser.uid}});
                else{const p=fromLS();dispatch({type:'LOGIN',payload:p?{...base,...p,id:firebaseUser.uid}:base});}
              })
              .catch(()=>{const p=fromLS();dispatch({type:'LOGIN',payload:p?{...base,...p,id:firebaseUser.uid}:base});})
              .finally(()=>setLoaded(true));
          }else{setLoaded(true);}
        }else{
          // No Firebase session, try localStorage fallback
          try{const s=window.storage;if(s){s.get('cercle_user').then(r=>{if(r&&r.value)dispatch({type:'LOGIN',payload:JSON.parse(r.value)})}).catch(()=>{}).finally(()=>setLoaded(true))}else setLoaded(true);}catch(e){setLoaded(true);}
        }
      });
      return ()=>unsub();
    }else{
      try{const s=window.storage;if(s){s.get('cercle_user').then(r=>{if(r&&r.value)dispatch({type:'LOGIN',payload:JSON.parse(r.value)})}).catch(()=>{}).finally(()=>setLoaded(true))}else setLoaded(true);}catch(e){setLoaded(true);}
    }
  },[]);
  // Save user to storage on login/logout — uniquement APRÈS que la session est restaurée
  useEffect(()=>{
    if(!loaded)return; // évite de supprimer l'utilisateur sauvegardé avant la restauration async
    try{const s=window.storage;if(s){if(state.user)s.set('cercle_user',JSON.stringify(state.user)).catch(()=>{});else s.delete('cercle_user').catch(()=>{})}}catch(e){}
    // Sync Firestore si Firebase est actif
    if(state.user&&window.db){window.db.collection('users').doc(state.user.id).set(state.user,{merge:true}).catch(()=>{});}
  },[state.user,loaded]);
  // Persister bookings, favoris, wallet, badges, etc.
  useEffect(()=>{if(!loaded)return;try{localStorage.setItem('cercle_bookings',JSON.stringify(state.bookings));}catch(e){}},[state.bookings,loaded]);
  useEffect(()=>{if(!loaded)return;try{localStorage.setItem('cercle_payments',JSON.stringify(state.payments));}catch(e){}},[state.payments,loaded]);
  useEffect(()=>{if(!loaded)return;try{localStorage.setItem('cercle_reviews',JSON.stringify(state.reviews));}catch(e){}},[state.reviews,loaded]);
  useEffect(()=>{if(!loaded)return;try{localStorage.setItem('cercle_badges',JSON.stringify(state.badges));}catch(e){}},[state.badges,loaded]);
  useEffect(()=>{if(!loaded)return;try{localStorage.setItem('cercle_wallet',JSON.stringify(state.wallet));}catch(e){}},[state.wallet,loaded]);
  useEffect(()=>{if(!loaded)return;try{localStorage.setItem('cercle_favs',JSON.stringify([...state.favorites]));}catch(e){}},[state.favorites,loaded]);
  // Listener Firestore temps réel sur toutes les annonces publiées
  useEffect(()=>{
    if(!window.db)return;
    const unsub=window.db.collection('items').onSnapshot(snap=>{
      const docs=snap.docs.map(d=>({...d.data(),id:d.id}));
      dispatch({type:'SET_CLOUD_ITEMS',payload:docs});
    },()=>{});
    return()=>unsub();
  },[]);
  // Sync des annonces locales vers Firestore (items créés avant Firebase)
  useEffect(()=>{
    if(!window.db||!loaded||!state.user||!state.userItems.length)return;
    const compressForCloud=(dataUrl)=>new Promise(resolve=>{
      if(!dataUrl||!dataUrl.startsWith('data:'))return resolve('');
      const img=new Image();
      img.onload=()=>{
        const max=300;const ratio=Math.min(1,max/img.width,max/img.height);
        const c=document.createElement('canvas');c.width=Math.round(img.width*ratio);c.height=Math.round(img.height*ratio);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        resolve(c.toDataURL('image/jpeg',0.55));
      };
      img.onerror=()=>resolve('');img.src=dataUrl;
    });
    const firebaseUid=state.user.id;
    state.userItems.forEach(async(item)=>{
      try{
        const thumbs=await Promise.all((item.images||[]).slice(0,3).map(compressForCloud));
        const owner={...(item.owner||{}),id:firebaseUid};
        const firestoreItem={...item,owner,images:thumbs.filter(Boolean),photos:[]};
        window.db.collection('items').doc(item.id).set(firestoreItem).catch(()=>{});
      }catch(e){}
    });
  },[loaded,state.userItems]);
  // Mise à jour immédiate owner.id dans Firestore au login
  useEffect(()=>{
    if(!window.db||!state.user||!state.userItems.length)return;
    const fuid=state.user.id;const femail=state.user.email;
    state.userItems.forEach(item=>{
      if(item.owner?.id!==fuid){
        window.db.collection('items').doc(item.id).update({
          'owner.id':fuid,'owner.email':femail
        }).catch(()=>{
          // Si le doc n'existe pas encore, on le crée sans images
          window.db.collection('items').doc(item.id).set({...item,owner:{...(item.owner||{}),id:fuid,email:femail},images:[],photos:[]}).catch(()=>{});
        });
      }
    });
  },[state.user?.id]);
  // Listener messages Firestore temps réel (messages reçus)
  useEffect(()=>{
    if(!window.db||!state.user)return;
    const uid=state.user.id;
    const unsub=window.db.collection('messages').where('to','==',uid).limit(50).onSnapshot(snap=>{
      snap.docChanges().forEach(change=>{
        if(change.type==='added'){
          const m={...change.doc.data(),id:change.doc.id,_fromCloud:true};
          dispatch({type:'MSG',payload:m});
        }
      });
    },()=>{});
    return()=>unsub();
  },[state.user?.id]);
  // Listener notifications Firestore temps réel
  useEffect(()=>{
    if(!window.db||!state.user)return;
    const uid=state.user.id;
    const unsub=window.db.collection('notifications').where('userId','==',uid).where('read','==',false).limit(30).onSnapshot(snap=>{
      snap.docChanges().forEach(change=>{
        if(change.type==='added'){
          const n={...change.doc.data(),id:change.doc.id};
          dispatch({type:'PUSH_NOTIF',payload:n});
          // Marquer comme lu dans Firestore après affichage
          setTimeout(()=>window.db.collection('notifications').doc(change.doc.id).update({read:true}).catch(()=>{}),5000);
        }
      });
    },()=>{});
    return()=>unsub();
  },[state.user?.id]);
  // Auto-switch mode when pro user logs in
  useEffect(()=>{if(state.user?.isPro)setMode('pro')},[state.user?.isPro]);

  // Header scroll effect
  useEffect(()=>{const hdr=document.querySelector('.hdr');if(!hdr)return;const onScroll=()=>{if(window.scrollY>20){hdr.classList.add('scrolled')}else{hdr.classList.remove('scrolled')}};window.addEventListener('scroll',onScroll);return()=>window.removeEventListener('scroll',onScroll)},[]);


  const home=()=>{setInfoPage(null);setPage("home");setQ("");setLq("");setCat("all");setSel(null)};

  if(confirmPage){const allIt=[...state.items,...state.proItems,...state.userItems];return <Ctx.Provider value={{dark,setDark,lang,setLang}}><div className={(dark?"dark":"")}><style>{css}</style><ConfirmDeliveryPage annonceId={confirmPage.annonce} allItems={allIt} onBack={()=>setConfirmPage(null)}/></div></Ctx.Provider>;}

  // ── GSAP: page transition ──
  const pageRef=useRef(null);
  const recoRef=useRef(null);
  useEffect(()=>{
    const gsap=G();if(!gsap||!pageRef.current)return;
    gsap.from(pageRef.current,{autoAlpha:0,y:12,duration:.35,ease:'power2.out',clearProps:'opacity,visibility,transform'});
  },[page]);

  // ── GSAP: reco auto-scroll ticker ──
  useEffect(()=>{
    if(page!=='home'||!state.user)return;
    const gsap=G();if(!gsap)return;
    let tl,raf;
    const start=()=>{
      const el=recoRef.current;
      if(!el||el._recoTicker)return;
      const mid=el.children[el.children.length>>1];
      const half=mid?mid.offsetLeft:el.scrollWidth/2;
      if(half<=0)return;
      gsap.set(el,{x:0});
      tl=gsap.to(el,{x:-half,duration:28,ease:'none',repeat:-1,
        onRepeat:()=>gsap.set(el,{x:0})
      });
      el._recoTicker=tl;
      const pause=()=>tl&&tl.pause();
      const resume=()=>tl&&tl.play();
      el.addEventListener('mouseenter',pause);
      el.addEventListener('mouseleave',resume);
    };
    raf=requestAnimationFrame(()=>requestAnimationFrame(start));
    return()=>{
      cancelAnimationFrame(raf);
      if(tl){tl.kill();}
      const el=recoRef.current;
      if(el){el._recoTicker=null;gsap.set(el,{clearProps:'transform'});}
    };
  },[page,state.user]);

  // ── GSAP: hero stagger ──
  useEffect(()=>{
    if(page!=="home")return;
    const gsap=G();if(!gsap)return;
    requestAnimationFrame(()=>{
      gsap.from('.hero-el',{autoAlpha:0,y:22,duration:.55,stagger:.08,ease:'power2.out',clearProps:'opacity,visibility,transform',overwrite:'auto'});
    });
  },[page]);

  // ── GSAP: cards stagger on category/page change ──
  useEffect(()=>{
    if(page!=="home")return;
    const gsap=G();if(!gsap)return;
    requestAnimationFrame(()=>{
      gsap.from('.card',{autoAlpha:0,y:18,duration:.38,stagger:{each:.04,from:'start'},ease:'power2.out',clearProps:'opacity,visibility,transform',overwrite:'auto'});
    });
  },[cat,page]);

  // ── GSAP: dropdown ──
  useEffect(()=>{
    if(!menu)return;
    const gsap=G();if(!gsap)return;
    requestAnimationFrame(()=>{
      gsap.from('.dd',{autoAlpha:0,y:-8,scale:.97,duration:.18,ease:'power2.out',clearProps:'opacity,visibility,transform'});
    });
  },[menu]);


  return <Ctx.Provider value={{dark,setDark,lang,setLang}}><div className={(dark?"dark":"")}><style>{css}</style>
    {/* Premium Splash Screen */}
    {splash&&<PremiumSplash onDone={()=>setSplash(false)}/>}
    {page!=="messages"&&page!=="notifs"&&page!=="dashboard"&&page!=="gestion"&&page!=="referral"&&page!=="verify"&&page!=="dispute"&&page!=="wallet"&&page!=="badges"&&<header className={"hdr"+(mode==="pro"?" pro-hdr":"")}><div className="hi">
      <a className="logo" onClick={()=>{home();window.scrollTo({top:0,behavior:'smooth'})}} style={{textDecoration:'none',display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}><img src={LOGO_SRC} alt="Cercle" style={{height:44,width:44,objectFit:'contain'}}/><span className="lt" style={{color:mode==='pro'?'#2563EB':'var(--dk)'}}>{mode==='pro'?'Cercle Pro':'Cercle'}</span></a>
      <div className="mode-sw">
        <button className={"mode-btn"+(mode==='perso'?' on':'')} onClick={()=>setMode('perso')}>👤 Particulier</button>
        <button className={"mode-btn"+(mode==='pro'?' pro-on':'')} onClick={()=>setMode('pro')}>🏢 Professionnel</button>
      </div>
      <div className="sb" onClick={()=>setShowS(true)}><div className="ss"><span style={{marginRight:4}}>🔍</span>{q||"Rechercher un objet..."}</div><div className="ss m">{lq||"Partout"}</div><div className="ss m">{filters.searchDate||"Quand ?"}</div><button className="sbb"><I.Search/></button></div>
      <div className="nr">
        {state.user&&<button className="nb" onClick={()=>setPage("create")}><I.Plus/> Proposer</button>}
        {state.user&&<button className="nb" onClick={()=>{setPage("messages");dispatch({type:"READ_N"})}}><I.Msg/>{unread>0&&<span className="ndot"/>}</button>}
        <button className="pb" onClick={()=>setMenu(!menu)} style={{position:"relative"}}>
          <I.Menu/><div className="pav">{state.user?state.user.avatar:<I.User/>}</div>
          {menu&&<div className="dd" onClick={e=>e.stopPropagation()}>
            {state.user?<><div className="di b" onClick={()=>{setProfTab("annonces");setPage("profile");setMenu(false)}}>👤 Mon profil</div><div className="di" onClick={()=>{setPage("messages");setMenu(false);dispatch({type:"READ_N"})}}>💬 Messages{unread>0&&<span style={{background:"var(--p)",color:"#fff",borderRadius:8,padding:"1px 6px",fontSize:10,fontWeight:700,marginLeft:4}}>{unread}</span>}</div><div className="di" onClick={()=>{setPage("create");setMenu(false)}}>➕ Proposer</div>
              <div className="di" onClick={()=>{setPage("dashboard");setMenu(false)}}>📊 Dashboard</div>
              <div className="di" onClick={()=>{setPage("plus");setMenu(false)}} style={{color:'#7C3AED',fontWeight:700}}>✦ Cercle+{state.subscription?.active&&<span style={{background:"#7C3AED",color:"#fff",borderRadius:8,padding:"1px 6px",fontSize:10,fontWeight:700,marginLeft:4}}>ACTIF</span>}</div>
              {state.user?.isPro&&<div className="di" onClick={()=>{setPage("gestion");setMenu(false)}} style={{color:'#D97706',fontWeight:700}}>⭐ Gestion Pro</div>}
              <div className="di" onClick={()=>{setPage("notifs");setMenu(false);dispatch({type:"READ_N"})}}>🔔 Notifications{unread>0&&<span style={{background:"var(--p)",color:"#fff",borderRadius:8,padding:"1px 6px",fontSize:10,fontWeight:700}}>{unread}</span>}</div>
              <div className="di" onClick={()=>{setDark(!dark);setMenu(false)}}>{dark?"☀️ Mode clair":"🌙 Mode sombre"}</div>
              <div className="dsp"/><div className="di" onClick={()=>{if(window.auth)window.auth.signOut().catch(()=>{});dispatch({type:"LOGOUT"});setMenu(false);home()}}>🚪 Déconnexion</div></>:
            <><div className="di b" onClick={()=>{setShowA("login");setMenu(false)}}>Se connecter</div><div className="di" onClick={()=>{setShowA("register");setMenu(false)}}>S'inscrire</div><div className="dsp"/><div className="di" onClick={()=>{setPage("plus");setMenu(false)}} style={{color:'#7C3AED',fontWeight:700}}>✦ Découvrir Cercle+</div></>}
          </div>}
        </button>
      </div>
    </div>
    {page==="home"&&<div className="cw"><div className="cts">{CATS.map(c=><div key={c.id} className={"ct"+(cat===c.id?" on":"")} onClick={()=>{setCat(c.id);setFilters(f=>({...f,filterCat:'all'}));}}><span className="cti">{c.icon}</span><span className="ctl">{c.label}</span></div>)}</div><button className="fb" onClick={()=>setShowF(true)}><I.Flt/> Filtres{activeFilterCount>0&&<span style={{background:"var(--p)",color:"#fff",borderRadius:"50%",width:18,height:18,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,marginLeft:4}}>{activeFilterCount}</span>}</button></div>}
    </header>}

    <div ref={pageRef}>
    {page==="home"&&<main className="page-tr">
      {mode!=='pro'&&!q&&cat==='all'&&<div className="hero-wrap" style={{background:"transparent",padding:"clamp(40px,7vw,72px) 28px clamp(34px,5vw,52px)",textAlign:"center",marginBottom:0,position:"relative",overflow:"hidden",borderRadius:"0 0 40px 40px"}}>
        {/* ── Vidéo de fond ── */}
        <video autoPlay muted loop playsInline ref={el=>{if(el&&!el._wired){el._wired=true;el.muted=true;const tryPlay=()=>{const p=el.play();if(p&&p.catch)p.catch(()=>{});};el.addEventListener('canplay',tryPlay,{once:true});tryPlay();}}} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0}}><source src="hero.mp4" type="video/mp4"/></video>
        {/* ── Overlay léger bas pour lisibilité ── */}
        <div style={{position:"absolute",inset:0,background:dark?"linear-gradient(180deg,rgba(15,15,19,0.45) 0%,rgba(15,15,19,0.6) 100%)":"linear-gradient(180deg,rgba(255,255,255,0.35) 0%,rgba(255,255,255,0.55) 100%)",zIndex:1,pointerEvents:"none"}}/>
        {/* halo violet doux + blobs animés */}
        <div style={{position:"absolute",top:"-200px",left:"50%",transform:"translateX(-50%)",width:620,height:400,background:"radial-gradient(ellipse at center,rgba(124,58,237,.14),transparent 70%)",pointerEvents:"none",filter:"blur(10px)",zIndex:2}}/>
        <div className="hero-blob hero-blob-a" style={{zIndex:2}}/><div className="hero-blob hero-blob-b" style={{zIndex:2}}/>
        <div style={{position:"relative",zIndex:3,maxWidth:660,margin:"0 auto"}}>
          <div className="hero-el" style={{display:"inline-flex",alignItems:"center",gap:8,color:"var(--p)",fontSize:11.5,fontWeight:700,letterSpacing:".12em",marginBottom:20,textTransform:"uppercase",animationDelay:".05s"}}><span style={{position:"relative",display:"inline-flex",width:6,height:6}}><span style={{position:"absolute",inset:0,borderRadius:"50%",background:"var(--green)",animation:"pulse 1.8s ease infinite",opacity:.55}}/><span style={{width:6,height:6,borderRadius:"50%",background:"var(--green)"}}/></span>Location entre voisins</div>
          <HeroTypewriter show={!splash}/>
          <p className="hero-el" style={{color:"var(--g)",fontSize:"clamp(15px,2vw,17px)",maxWidth:500,margin:"0 auto 26px",lineHeight:1.6,fontWeight:450,animationDelay:".19s"}}>Des milliers d'objets près de chez vous, entre particuliers et pros. Plus simple, plus malin que d'acheter.</p>
          <form className="hero-el hero-search" onSubmit={e=>{e.preventDefault();const v=(e.target.hq.value||"").trim();if(v)search(v);}} style={{display:"flex",alignItems:"center",gap:8,background:"var(--w)",border:"1px solid var(--bd)",borderRadius:16,padding:"8px 8px 8px 18px",maxWidth:540,margin:"0 auto 12px",boxShadow:"var(--sh)",animationDelay:".26s"}}>
            <span style={{fontSize:17,opacity:.6}}>🔎</span>
            <input name="hq" placeholder="Perceuse, vélo, caméra…" style={{flex:1,border:"none",outline:"none",fontFamily:"var(--f)",fontSize:15,color:"var(--dk)",background:"none",minWidth:0}}/>
            <button type="submit" className="hero-go" style={{background:"var(--p)",color:"#fff",border:"none",borderRadius:11,padding:"11px 20px",fontWeight:700,fontSize:14,cursor:"pointer",flexShrink:0,transition:"transform .15s,box-shadow .2s",boxShadow:"0 6px 18px rgba(124,58,237,.3)"}}>Rechercher</button>
          </form>
        </div>
      </div>}
      {mode==='pro'&&<div className="pro-banner"><h2 style={{fontFamily:"var(--fd)",fontSize:22,marginBottom:4}}>🏢 Espace Professionnel</h2><p style={{fontSize:13,opacity:.8}}>Matériel pro certifié · Grandes quantités · Livraison chantier · Facturation entreprise</p></div>}
      {q&&<div style={{padding:"6px 28px 0",fontSize:12,color:"var(--g)"}}>{filtered.length} résultat{filtered.length!==1?"s":""} pour <strong>"{q}"</strong>{lq&&<> à <strong>{lq}</strong></>}<button className="cl" style={{marginLeft:6}} onClick={()=>{setQ("");setLq("")}}>✕</button></div>}
      {!q&&mode==='pro'&&<div style={{padding:"36px 28px 0",maxWidth:1520,margin:"0 auto"}}>
        <h2 style={{fontFamily:"var(--fd)",fontSize:24,fontWeight:800,letterSpacing:"-.02em",color:"var(--dk)",marginBottom:4}}>Matériel professionnel</h2>
        <p style={{fontSize:13,color:"var(--g)"}}>{filtered.length} équipements certifiés disponibles</p>
      </div>}
      {!q&&cat!=='all'&&<div style={{padding:"36px 28px 0",maxWidth:1520,margin:"0 auto"}}>
        <h2 style={{fontFamily:"var(--fd)",fontSize:24,fontWeight:800,letterSpacing:"-.02em",color:"var(--dk)",marginBottom:4}}>{CATS.find(c=>c.id===cat)?.icon} {CATS.find(c=>c.id===cat)?.label}</h2>
        <p style={{fontSize:13,color:"var(--g)"}}>{filtered.length} annonce{filtered.length!==1?"s":""} dans cette catégorie</p>
      </div>}
      {!q&&cat==="all"&&state.user&&<div className="reco"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:700,letterSpacing:"-.01em"}}>{mode==="pro"?"Sélection Pro":"Recommandé pour vous"}</h3><button className="cl" style={{color:"var(--p)"}} onClick={()=>window.scrollTo({top:document.querySelector('.grid')?.offsetTop||600,behavior:'smooth'})}>Voir tout →</button></div>
        {(()=>{
          const favCats=state.user?.favCats||[];
          const ri=favCats.length>0
            ?[...all.filter(i=>favCats.includes(i.category)).sort(()=>Math.random()-.5),...all.filter(i=>!favCats.includes(i.category)).sort(()=>Math.random()-.5)].slice(0,8)
            :all.sort(()=>Math.random()-.5).slice(0,8);
          return <div ref={recoRef} className="reco-sc">{[...ri,...ri].map((i,idx)=><div key={idx} className="reco-c" onClick={()=>openDetail(i)}><img className="reco-ci" src={i.images[0]} alt=""/><div style={{padding:"4px 8px 8px"}}><div style={{fontSize:12,fontWeight:600,marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.title}</div><div style={{fontSize:12,fontWeight:800,color:"var(--green)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.price}€<span style={{fontWeight:400,color:"var(--g)"}}>/j</span></div></div></div>)}</div>;
        })()}
      </div>}
      {mode!=='pro'&&<div style={{padding:"16px 28px 0",maxWidth:1520,margin:"0 auto"}}>
        <div style={{display:"flex",gap:4,background:"var(--bg)",borderRadius:28,padding:3,border:"1px solid var(--bd)",width:"fit-content"}}>
          <button onClick={()=>setListingTab('particuliers')} style={{padding:"8px 18px",borderRadius:24,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s",
            background:listingTab==='particuliers'?"var(--w)":"transparent",
            color:listingTab==='particuliers'?"var(--dk)":"var(--g)",
            boxShadow:listingTab==='particuliers'?"var(--sh)":"none"}}>👤 Particuliers</button>
          <button onClick={()=>setListingTab('professionnels')} style={{padding:"8px 18px",borderRadius:24,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s",
            background:listingTab==='professionnels'?"linear-gradient(135deg,#1E3A5F,#2563EB)":"transparent",
            color:listingTab==='professionnels'?"#fff":"var(--g)",
            boxShadow:listingTab==='professionnels'?"0 2px 8px rgba(37,99,235,.25)":"none"}}>🏢 Professionnels</button>
        </div>
      </div>}
      {filtered.length===0?<div className="empty"><span>🔍</span><h2>Aucun résultat trouvé</h2><p style={{maxWidth:320,margin:"6px auto 16px",lineHeight:1.5}}>Essayez d'élargir votre recherche ou de modifier vos filtres.</p><button className="bs" onClick={()=>{setQ("");setCat("all")}}>Réinitialiser la recherche</button></div>:
      <div className="grid" style={{paddingTop:16}}>{filtered.map(i=><Card key={i.id} item={i} onOpen={openDetail} favs={state.favorites} dispatch={dispatch} onAuthRequired={state.user?null:()=>setShowA("login")} userLocation={filters.userLocation}/>)}</div>}
    </main>}

    {page==="info"&&infoPage&&<InfoPage id={infoPage} setPage={p=>{setInfoPage(null);setPage(p);}} goBack={goBack}/>}
    {page==="profile"&&state.user&&<Profile state={state} dispatch={dispatch} setPage={setPage} setSelected={openDetail} initTab={profTab} onEditItem={(item)=>{setEditItem(item);setPage("create");}}/>}
    {page==="messages"&&state.user&&<Messages state={state} dispatch={dispatch} cid={cid} setCid={setCid} setPage={setPage} onOpenItem={openDetail}/>}
    {page==="create"&&state.user&&<CreateListing state={state} dispatch={dispatch} setPage={(p)=>{setEditItem(null);setPage(p);}} goBack={()=>{setEditItem(null);goBack();}} mode={mode} editItem={editItem}/>}
    {(page==="create"||page==="profile"||page==="messages"||page==="dashboard"||page==="referral"||page==="verify"||page==="dispute"||page==="wallet"||page==="badges")&&!state.user&&<div className="empty" style={{paddingTop:100}}><span>🔒</span><h2>Connectez-vous</h2><p>Vous devez être connecté pour accéder à cette page.</p><button className="bp" style={{marginTop:14}} onClick={()=>setShowA("login")}>Se connecter</button></div>}

    {page==="home"&&<footer id="site-footer" style={{background:"var(--bg)",borderTop:"1px solid var(--bd)",marginTop:0}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"52px 24px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:40}}>
          <div>
            <div onClick={()=>{home();window.scrollTo({top:0,behavior:'smooth'})}} style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,cursor:"pointer"}}>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAAAXNSR0IArs4c6QAAAUBlWElmTU0AKgAAAAgABgEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAExAAIAAACjAAAAZgE7AAIAAAAMAAABCodpAAQAAAABAAABFgAAAAAAAABgAAAAAQAAAGAAAAABQ2FudmEgKFJlbmRlcmVyKSBkb2M9REFISUpJRkJrQ28gdXNlcj1VQUdOUWlaNjZtdyBicmFuZD1CQUdOUXBwR21fZyB0ZW1wbGF0ZT1CbGFjayBXaGl0ZSBNaW5pbWFsIFNpbXBsZSBCb2xkICBNb2Rlcm4gUHJvZmVzc2lvbmFsIFBob3RvZ3JhcGh5IExldHRlciBLIE11c2V1bSBMb2dvAABjbGFyYV9zbjI5NQAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAyKADAAQAAAABAAAAyAAAAAAG+a/5AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEFGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj45NjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+OTY8L3RpZmY6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" alt="Cercle" style={{height:36,width:36,objectFit:"contain"}}/>
              <span style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:700,color:"var(--dk)",letterSpacing:"-.02em"}}>Cercle</span>
            </div>
            <p style={{fontSize:13,color:"var(--g)",lineHeight:1.6,maxWidth:210}}>Location entre voisins — simple, sécurisée, responsable.</p>
          </div>
          {[
            {label:"Explorer",links:[{t:"Toutes les annonces",a:home},{t:"Carte interactive",a:()=>setPage("map")},{t:"Proposer un objet",a:()=>{if(state.user)setPage("create");else setShowA("login")}}]},
            {label:"Aide",links:[{t:"Centre d'aide",a:()=>setShowChat(true)},{t:"Guide démarrage",a:()=>goInfo("guide")},{t:"Sécurité",a:()=>goInfo("security")},{t:"Nous contacter",a:()=>goInfo("contact")}]},
            {label:"Cercle",links:[{t:"À propos",a:()=>goInfo("about")},{t:"Mission",a:()=>goInfo("mission")},{t:"Parrainage",a:()=>{if(state.user)setPage("referral");else setShowA("login")}},{t:"Carrières",a:()=>goInfo("careers")}]},
          ].map(col=>(
            <div key={col.label}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--g)",marginBottom:14}}>{col.label}</div>
              {col.links.map(l=><div key={l.t} onClick={l.a} style={{fontSize:13,color:"var(--dk)",padding:"5px 0",cursor:"pointer",opacity:.65,transition:"opacity .15s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.65}>{l.t}</div>)}
            </div>
          ))}
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"20px 24px 28px",borderTop:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <span style={{fontSize:11,color:"var(--g)"}}>© 2026 Cercle · Tous droits réservés</span>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          {[["CGU","cgu"],["Confidentialité","privacy"],["Mentions légales","legal"],["Cookies","cookies"]].map(([t,pid])=><span key={t} onClick={()=>goInfo(pid)} style={{fontSize:11,color:"var(--g)",cursor:"pointer",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color="var(--p)"} onMouseLeave={e=>e.currentTarget.style.color="var(--g)"}>{t}</span>)}
        </div>
      </div>
    </footer>}

    {sel&&<Detail item={sel} onClose={closeDetail} state={state} dispatch={dispatch} setPage={setPage} setConvId={setCid} setShowShop={setShowShop} setProfTab={setProfTab} onAuthRequired={()=>setShowA("login")}/>}
    {showF&&<FilterM onClose={()=>setShowF(false)} filters={filters} setFilters={setFilters} count={filtered.length}/>}
    {showS&&<SearchM onClose={()=>setShowS(false)} onSearch={search} allItems={all} filters={filters} setFilters={setFilters}/>}
    {showA&&<AuthModal onClose={()=>setShowA(null)} dispatch={dispatch} mode={showA} onRegisterDone={()=>{setShowA(null);setShowOnboarding(true);}}/>}
    {showOnboarding&&<OnboardingModal dispatch={dispatch} user={state.user} onClose={()=>{setShowOnboarding(false);try{localStorage.setItem('cercle_ob','1')}catch{}}}/>}
    <div className="toast-stack">{toasts.map(t=><ToastItem key={t.id} toast={t}/>)}</div>
    {page==="map"&&<MapPage items={filtered} onOpen={openDetail} favs={state.favorites} dispatch={dispatch} mode={mode}/>}
    {page==="notifs"&&state.user&&<NotifCenter state={state} dispatch={dispatch} setPage={setPage} goBack={goBack}/>}
    {page==="dashboard"&&state.user&&<Dashboard state={state} dispatch={dispatch} setPage={setPage} goBack={goBack} setProfTab={setProfTab}/>}
    {page==="gestion"&&state.user&&state.user.isPro&&<GestionPro state={state} dispatch={dispatch} setPage={setPage} goBack={goBack}/>}
    {page==="gestion"&&state.user&&!state.user.isPro&&<div className="empty" style={{paddingTop:100}}><span>⭐</span><h2>Réservé aux Pro</h2><p>Créez un compte professionnel pour accéder à la Gestion Pro.</p><button className="bp" style={{marginTop:14}} onClick={()=>setShowA("register")}>Passer en Pro</button></div>}
    {page==="referral"&&state.user&&<ReferralPage state={state} dispatch={dispatch} setPage={setPage} goBack={goBack}/>}
    {page==="verify"&&state.user&&<VerifyId state={state} dispatch={dispatch} setPage={setPage} goBack={goBack}/>}
    {page==="dispute"&&state.user&&<DisputePage state={state} dispatch={dispatch} setPage={setPage} goBack={goBack}/>}
    {page==="wallet"&&state.user&&<WalletPage state={state} dispatch={dispatch} setPage={setPage} goBack={goBack}/>}
    {page==="badges"&&state.user&&<BadgesPage state={state} setPage={setPage} goBack={goBack}/>}
    {page==="plus"&&<PlusPage state={state} dispatch={dispatch} setPage={setPage} goBack={goBack} onAuthRequired={()=>setShowA("login")}/>}
    </div>
    {showShop&&<Shop owner={showShop} items={all} onClose={()=>setShowShop(null)} onOpen={i=>{setShowShop(null);openDetail(i);}} state={state} dispatch={dispatch} onAuthRequired={()=>setShowA("login")}/>}
    {showGallery&&<Gallery images={showGallery.imgs} start={showGallery.idx||0} onClose={()=>setShowGallery(null)}/>}
    {/* Chatbot */}
    {showChat?<Chatbot items={all} onOpen={i=>{setShowChat(false);openDetail(i);}} onClose={()=>setShowChat(false)}/>:<button className="chatbot-btn" onClick={()=>setShowChat(true)}>🤖</button>}
    {/* Push notification */}
    {pushNotif&&<div className="push"><span style={{fontSize:16}}>🔔</span><div style={{flex:1,fontSize:12}}><div style={{fontWeight:700}}>Cercle</div>{pushNotif.text}</div><button className="push-close" onClick={()=>setPushNotif(null)}>✕</button></div>}
    {menu&&<div style={{position:"fixed",inset:0,zIndex:99}} onClick={()=>setMenu(false)}/>}
    {/* Bottom Nav Mobile */}
    <nav className="bnav"><div className="bnav-in">
      <button className={"bn"+(page==="home"?" on":"")} onClick={home}><I.Home/><span>Accueil</span></button>
      <button className={"bn"+(page==="map"?" on":"")} onClick={()=>setPage("map")}><I.MapPin/><span>Carte</span></button>
      {state.user&&<button className={"bn"+(page==="messages"?" on":"")} onClick={()=>setPage("messages")}><I.Msg/><span>Messages</span></button>}
      {state.user&&<button className={"bn"+(page==="notifs"?" on":"")} onClick={()=>{setPage("notifs");dispatch({type:"READ_N"})}}><I.Bell/>{unread>0&&<span className="bnd"/>}<span>Notifs</span></button>}
      {state.user?.isPro&&<button className={"bn"+(page==="gestion"?" on":"")} onClick={()=>setPage("gestion")} style={{color:page==="gestion"?"#D97706":undefined}}><span style={{fontSize:18}}>⭐</span><span>Gestion</span></button>}
      <button className={"bn"+((page==="profile"||page==="dashboard")?" on":"")} onClick={()=>state.user?(setProfTab("annonces"),setPage("profile")):setShowA("login")}><I.Prof/><span>Profil</span></button>
    </div></nav>
  </div></Ctx.Provider>
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));

