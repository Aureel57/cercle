function CGUModal({onClose}){
  return <div className="bk" onClick={onClose}><div className="md" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
    <div className="mh"><button className="mx" onClick={onClose}><I.X/></button><h2>Conditions Générales d'Utilisation</h2></div>
    <div className="mb" style={{overflowY:'auto',maxHeight:'65vh',fontSize:13,lineHeight:1.75,color:'var(--tx)'}}>
      <p style={{color:'var(--g)',fontSize:11,marginBottom:16}}>Dernière mise à jour : 28 avril 2026</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>1. Objet</h3>
      <p>Cercle est une plateforme de mise en relation entre particuliers et professionnels pour la location d'objets. Les présentes CGU régissent l'utilisation du service accessible sur cercle.fr.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>2. Inscription et compte</h3>
      <p>L'inscription est gratuite. L'utilisateur s'engage à fournir des informations exactes, sincères et à jour. Il est responsable de la confidentialité de ses identifiants. Cercle se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU, d'abus ou de comportement frauduleux.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>3. Annonces et locations</h3>
      <p>Les annonces doivent décrire fidèlement les objets proposés. Sont interdits : les objets illégaux, dangereux, contrefaits ou soumis à réglementation spéciale. Le propriétaire fixe librement son prix journalier. Toute réservation acceptée constitue un engagement contractuel entre les deux parties.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>4. Paiements et commissions</h3>
      <p>Cercle perçoit une commission sur chaque transaction selon le grade de l'utilisateur (de 3% pour les Fondateurs Cercle à 12% pour les Voisins). Les paiements sont sécurisés SSL. La caution est bloquée pendant la location et restituée sous 48h après confirmation de retour en bon état.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>5. Responsabilités</h3>
      <p>Cercle est une plateforme d'intermédiation et n'est pas partie aux contrats de location. Une protection jusqu'à 2 000 € est incluse pour les objets loués via Cercle. En cas de litige, Cercle peut intervenir en médiateur sans obligation de résultat.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>6. Résiliation</h3>
      <p>L'utilisateur peut supprimer son compte à tout moment depuis les paramètres. Cercle peut résilier un compte sans préavis en cas de violation grave des présentes CGU.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>7. Contact</h3>
      <p>Pour toute question relative aux CGU : <a href="mailto:support@cercle.fr" style={{color:'var(--p)'}}>support@cercle.fr</a></p>
      <button className="bp" style={{width:'100%',marginTop:24}} onClick={onClose}>J'ai lu et compris ✓</button>
    </div>
  </div></div>
}

function PrivacyModal({onClose}){
  return <div className="bk" onClick={onClose}><div className="md" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
    <div className="mh"><button className="mx" onClick={onClose}><I.X/></button><h2>Politique de Confidentialité</h2></div>
    <div className="mb" style={{overflowY:'auto',maxHeight:'65vh',fontSize:13,lineHeight:1.75,color:'var(--tx)'}}>
      <p style={{color:'var(--g)',fontSize:11,marginBottom:16}}>Dernière mise à jour : 28 avril 2026 — Conforme RGPD</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>1. Données collectées</h3>
      <p>Nous collectons : prénom, nom, email, date de naissance, adresse postale, téléphone, photo de profil, historique des transactions et préférences de communication. Ces données sont nécessaires au fonctionnement du service.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>2. Utilisation des données</h3>
      <p>Vos données sont utilisées exclusivement pour : gérer votre compte, traiter les transactions, vous envoyer des notifications liées à votre activité, et améliorer nos services. Elles ne sont jamais revendues à des tiers.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>3. Emails promotionnels</h3>
      <p>Vous ne recevrez des emails promotionnels que si vous avez explicitement coché la case correspondante lors de l'inscription. Vous pouvez vous désabonner à tout moment via le lien de désinscription présent dans chaque email.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>4. Conservation des données</h3>
      <p>Vos données sont conservées pendant toute la durée de votre compte actif, puis 3 ans après suppression du compte pour des raisons légales et comptables.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>5. Vos droits (RGPD)</h3>
      <p>Conformément au Règlement Général sur la Protection des Données, vous disposez d'un droit d'accès, de rectification, d'effacement (droit à l'oubli), de portabilité, de limitation du traitement et d'opposition. Ces droits s'exercent auprès de notre DPO.</p>
      <h3 style={{fontWeight:700,marginBottom:6,marginTop:16}}>6. Contact DPO</h3>
      <p>Délégué à la Protection des Données : <a href="mailto:dpo@cercle.fr" style={{color:'var(--p)'}}>dpo@cercle.fr</a> — Délai de réponse : 30 jours maximum.</p>
      <button className="bp" style={{width:'100%',marginTop:24}} onClick={onClose}>J'ai compris ✓</button>
    </div>
  </div></div>
}

function AuthModal({onClose,dispatch,mode:im}){
  const[mode,setMode]=useState(im||"login");const[step,setStep]=useState(0);const[acctType,setAcctType]=useState("perso");
  const[f,setF]=useState({firstName:"",lastName:"",dobDay:"",dobMonth:"",dobYear:"",email:"",password:"",city:"",address:"",postalCode:"",phone:"",bio:"",company:"",siret:"",sector:"",tva:"",website:""});
  const[avatarPreview,setAvatarPreview]=useState(null);
  const[addrSugg,setAddrSugg]=useState([]);const addrTimer=React.useRef(null);
  const[cguOk,setCguOk]=useState(false);const[privacyOk,setPrivacyOk]=useState(false);const[marketingOk,setMarketingOk]=useState(false);
  const[showCGU,setShowCGU]=useState(false);const[showPrivacy,setShowPrivacy]=useState(false);
  const[err,setErr]=useState("");const[loading,setLoading]=useState("");
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const go=()=>{
    if(mode==="login"){
      if(!f.email||!f.password){setErr("Remplissez tous les champs");return}
      // Essai demo users d'abord
      const demo=USERS.find(u=>u.email===f.email&&u.password===f.password)||PRO_USERS.find(u=>u.email===f.email&&u.password===f.password);
      if(demo){dispatch({type:"LOGIN",payload:demo});onClose();return}
      // Sinon Firebase Auth ou fallback localStorage
      if(!window.auth){
        // Fallback : vérifier le compte dans localStorage
        try{
          const saved=localStorage.getItem('cercle_user_'+f.email.toLowerCase());
          if(saved){
            const u=JSON.parse(saved);
            if(u._pwd===f.password){
              const {_pwd,...profile}=u;
              dispatch({type:"LOGIN",payload:profile});onClose();
            }else{setErr("Mot de passe incorrect");}
          }else{setErr("Aucun compte trouvé avec cet email. Inscris-toi d'abord.");}
        }catch(e){setErr("Erreur de connexion");}
        return;
      }
      setLoading("login");setErr("");
      window.auth.signInWithEmailAndPassword(f.email,f.password)
        .then(cred=>{
          // Auth réussie — charger le profil Firestore, sans bloquer la connexion si ça échoue
          const uid=cred.user.uid;
          const loadProfile=window.db
            ?window.db.collection('users').doc(uid).get().then(doc=>{
                if(doc&&doc.exists)return doc.data();
                const ls=localStorage.getItem('cercle_user_'+f.email.toLowerCase())||localStorage.getItem('cercle_user_'+f.email);
                if(ls){const{_pwd,...p}=JSON.parse(ls);return{...p,id:uid};}
                return{id:uid,email:cred.user.email,name:cred.user.email.split('@')[0],avatar:'😊',verified:false,since:new Date().getFullYear(),rating:0,rentals:0,responseTime:'~1h',isPro:false};
              }).catch(()=>{
                const ls=localStorage.getItem('cercle_user_'+f.email.toLowerCase())||localStorage.getItem('cercle_user_'+f.email);
                if(ls){const{_pwd,...p}=JSON.parse(ls);return{...p,id:uid};}
                return{id:uid,email:cred.user.email,name:cred.user.email.split('@')[0],avatar:'😊',verified:false,since:new Date().getFullYear(),rating:0,rentals:0,responseTime:'~1h',isPro:false};
              })
            :Promise.resolve({id:uid,email:cred.user.email,name:cred.user.email.split('@')[0],avatar:'😊',verified:false,since:new Date().getFullYear(),rating:0,rentals:0,responseTime:'~1h',isPro:false});
          return loadProfile.then(profile=>{dispatch({type:'LOGIN',payload:profile});});
        })
        .then(()=>{setLoading("");onClose();})
        .catch(e=>{
          setLoading("");
          if(e.code==="auth/user-not-found"||e.code==="auth/invalid-credential"||e.code==="auth/wrong-password"||e.code==="auth/invalid-email"||e.code==="auth/invalid-login-credentials"){
            // Compte localStorage uniquement → fallback
            try{
              const saved=localStorage.getItem('cercle_user_'+f.email.toLowerCase())||localStorage.getItem('cercle_user_'+f.email);
              if(saved){
                const u=JSON.parse(saved);
                if(u._pwd===f.password){
                  const{_pwd,...profile}=u;
                  window.auth.createUserWithEmailAndPassword(f.email,f.password)
                    .then(cred=>{const up={...profile,id:cred.user.uid};if(window.db)window.db.collection('users').doc(cred.user.uid).set(up).catch(()=>{});dispatch({type:'LOGIN',payload:up});})
                    .catch(()=>{dispatch({type:'LOGIN',payload:profile});});
                  onClose();return;
                }else{setErr("Mot de passe incorrect");return;}
              }
            }catch(le){}
            setErr("Email ou mot de passe incorrect");
          }else if(e.code==="auth/network-request-failed"){
            setErr("Pas de connexion internet. Réessaie.");
          }else if(e.code==="auth/too-many-requests"){
            setErr("Trop de tentatives. Réessaie dans quelques minutes.");
          }else{setErr("Erreur de connexion ("+e.code+")");}
        });
    }else{
      if(step===0)return setStep(1);
      if(acctType==="perso"){
        if(!f.firstName||!f.lastName||!f.email||!f.password){setErr("Remplissez tous les champs obligatoires");return}
        if(!cguOk||!privacyOk){setErr("Veuillez accepter les CGU et la Politique de confidentialité");return}
        const dob=f.dobDay&&f.dobMonth&&f.dobYear?`${f.dobDay}/${f.dobMonth}/${f.dobYear}`:"";
        const userData={name:`${f.firstName} ${f.lastName}`,email:f.email,avatar:"😊",verified:false,since:new Date().getFullYear(),bio:f.bio||"",location:f.city||"",city:f.city,address:f.address,postalCode:f.postalCode,phone:f.phone,dob,marketingEmails:marketingOk,avatarUrl:avatarPreview||null,rating:0,rentals:0,responseTime:"~1h",isPro:false};
        if(window.auth){
          setLoading("register");setErr("");
          window.auth.createUserWithEmailAndPassword(f.email,f.password)
            .then(cred=>{
              const u={...userData,id:cred.user.uid};
              if(window.db)window.db.collection('users').doc(cred.user.uid).set(u).catch(()=>{});
              try{localStorage.setItem('cercle_user_'+f.email,JSON.stringify(u));}catch(e){}
              dispatch({type:"LOGIN",payload:u});setLoading("");onClose();
            })
            .catch(e=>{
              setLoading("");
              if(e.code==="auth/email-already-in-use")setErr("Cet email est déjà utilisé. Connecte-toi.");
              else if(e.code==="auth/weak-password")setErr("Mot de passe trop court (6 caractères minimum)");
              else setErr("Erreur lors de la création du compte");
            });
        }else{
          // Fallback localStorage : vérifier si email déjà utilisé
          const existing=localStorage.getItem('cercle_user_'+f.email.toLowerCase());
          if(existing){setErr("Cet email est déjà utilisé. Connecte-toi.");return;}
          const newUser={...userData,id:uid()};
          try{localStorage.setItem('cercle_user_'+f.email.toLowerCase(),JSON.stringify({...newUser,_pwd:f.password}));}catch(e){}
          dispatch({type:"LOGIN",payload:newUser});onClose();
        }
      }else{
        if(!f.company||!f.siret||!f.email||!f.password){setErr("Remplissez les champs obligatoires");return}
        const userData={name:f.company,email:f.email,avatar:"🏢",verified:true,since:new Date().getFullYear(),bio:f.sector?`Secteur : ${f.sector}`:"Professionnel",location:f.city||"",rating:0,rentals:0,responseTime:"~15 min",isPro:true,company:f.company,siret:f.siret,tva:f.tva,phone:f.phone,website:f.website,sector:f.sector};
        if(window.auth){
          setLoading("register");setErr("");
          window.auth.createUserWithEmailAndPassword(f.email,f.password)
            .then(cred=>{
              const u={...userData,id:cred.user.uid};
              if(window.db)window.db.collection('users').doc(cred.user.uid).set(u).catch(()=>{});
              try{localStorage.setItem('cercle_user_'+f.email,JSON.stringify(u));}catch(e){}
              dispatch({type:"LOGIN",payload:u});setLoading("");onClose();
            })
            .catch(e=>{
              setLoading("");
              if(e.code==="auth/email-already-in-use")setErr("Cet email est déjà utilisé. Connecte-toi.");
              else setErr("Erreur lors de la création du compte");
            });
        }else{
          const existing=localStorage.getItem('cercle_user_'+f.email.toLowerCase());
          if(existing){setErr("Cet email est déjà utilisé. Connecte-toi.");return;}
          const newUser={...userData,id:uid()};
          try{localStorage.setItem('cercle_user_'+f.email.toLowerCase(),JSON.stringify({...newUser,_pwd:f.password}));}catch(e){}
          dispatch({type:"LOGIN",payload:newUser});onClose();
        }
      }
    }
  };
  const socialLogin=(provider,name,avatar)=>{
    setLoading(provider);
    setTimeout(()=>{
      dispatch({type:"LOGIN",payload:{id:uid(),name,email:name.toLowerCase().replace(/ /g,".")+"@"+provider+".com",avatar,verified:true,since:2026,bio:"Connecté via "+provider,location:"Paris",rating:0,rentals:0,responseTime:"~30 min",isPro:false}});
      onClose();
    },800);
  };
  const sBtn={width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"11px 16px",borderRadius:10,fontSize:13,fontWeight:600,border:"1.5px solid var(--bd)",background:"var(--w)",color:"var(--dk)",marginBottom:8,transition:"all .15s",cursor:"pointer",position:"relative"};
  return <><div className="bk" onClick={onClose}><div className="md" onClick={e=>e.stopPropagation()} style={{maxWidth:440}}>
    <div className="mh"><button className="mx" onClick={onClose}><I.X/></button><h2>{mode==="login"?"Connexion":step===0?"Type de compte":"Inscription"}</h2></div>
    <div className="mb">
      {mode==="login"?<>
        <div style={{textAlign:"center",fontSize:36,marginBottom:10}}>👋</div>
        <p style={{textAlign:"center",fontSize:13,color:"var(--g)",marginBottom:16}}>Bon retour sur Cercle !</p>
        <button style={{...sBtn,background:loading==="Google"?"var(--bgw)":undefined}} onClick={()=>socialLogin("Google","Marie Leclerc","👩‍🦰")}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {loading==="Google"?"Connexion...":"Continuer avec Google"}
        </button>
        <button style={{...sBtn,background:loading==="Apple"?"#333":"#000",color:"#fff",borderColor:"#000"}} onClick={()=>socialLogin("Apple","Thomas Durand","👨")}>
          <svg width="16" height="18" viewBox="0 0 17 20" fill="white"><path d="M13.34 10.05c-.02-2.14 1.75-3.17 1.83-3.22-1-1.46-2.55-1.66-3.1-1.68-1.32-.13-2.57.77-3.24.77-.67 0-1.7-.75-2.8-.73A4.13 4.13 0 0 0 2.54 7.6c-1.49 2.58-.38 6.4 1.07 8.49.71 1.02 1.56 2.17 2.67 2.13 1.07-.04 1.47-.69 2.77-.69 1.29 0 1.66.69 2.78.67 1.15-.02 1.88-1.05 2.58-2.08.81-1.19 1.15-2.34 1.17-2.4-.03-.01-2.24-.86-2.26-3.41zM11.24 3.9c.59-.71 .99-1.7.88-2.69-.85.03-1.88.57-2.49 1.27-.55.63-1.03 1.64-.9 2.6.95.08 1.92-.48 2.51-1.18z"/></svg>
          {loading==="Apple"?"Connexion...":"Continuer avec Apple"}
        </button>
        <button style={{...sBtn,background:loading==="Facebook"?"#1877F2":"var(--w)",color:loading==="Facebook"?"#fff":"var(--dk)",borderColor:loading==="Facebook"?"#1877F2":"var(--bd)"}} onClick={()=>socialLogin("Facebook","Julie Martin","👩")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.87v2.26h3.32l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
          {loading==="Facebook"?"Connexion...":"Continuer avec Facebook"}
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"14px 0"}}><div style={{flex:1,height:1,background:"var(--bd)"}}/><span style={{fontSize:11,color:"var(--gl)",fontWeight:600}}>OU</span><div style={{flex:1,height:1,background:"var(--bd)"}}/></div>
        <div className="fg"><label>Email</label><input type="email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="jean@email.com"/></div>
        <div className="fg"><label>Mot de passe</label><input type="password" value={f.password} onChange={e=>u("password",e.target.value)} placeholder="••••••••"/></div>
        {err&&<p style={{color:"var(--p)",fontSize:12,marginBottom:8}}>{err}</p>}
        <button className="bp" style={{width:"100%",marginBottom:10}} onClick={go}>Se connecter</button>
        <p style={{textAlign:"center",fontSize:12,color:"var(--g)"}}>Pas de compte ? <button className="cl" onClick={()=>{setMode("register");setStep(0);setErr("")}}>S'inscrire</button></p>
      </>:step===0?<>
        {/* Step 0: Choose account type */}
        <div style={{textAlign:"center",fontSize:36,marginBottom:10}}>🎉</div>
        <p style={{textAlign:"center",fontSize:13,color:"var(--g)",marginBottom:20}}>Quel type de compte souhaitez-vous créer ?</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div onClick={()=>setAcctType("perso")} style={{border:`2px solid ${acctType==="perso"?"var(--p)":"var(--bd)"}`,borderRadius:14,padding:18,cursor:"pointer",transition:"all .2s",background:acctType==="perso"?"#F5F3FF":"var(--w)",boxShadow:acctType==="perso"?"0 4px 20px rgba(108,99,255,0.15)":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:48,height:48,borderRadius:12,background:acctType==="perso"?"linear-gradient(135deg,#6C63FF,#8b5cf6)":"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,transition:"all .2s",flexShrink:0}}>👤</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15}}>Particulier</div>
                <div style={{fontSize:12,color:"var(--g)",lineHeight:1.4,marginTop:2}}>Louez et proposez des objets entre particuliers. Inscription gratuite et rapide.</div>
              </div>
              {acctType==="perso"&&<span style={{color:"var(--p)",fontSize:18,fontWeight:700}}>✓</span>}
            </div>
            <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>{["🏷️ Annonces","❤️ Favoris","💬 Messages","🏅 Grades","⭐ Avis"].map(t=><span key={t} style={{fontSize:9,padding:"2px 8px",borderRadius:5,background:"#EDE9FE",color:"#5B21B6",fontWeight:600}}>{t}</span>)}</div>
          </div>
          <div onClick={()=>setAcctType("pro")} style={{border:`2px solid ${acctType==="pro"?"#D97706":"var(--bd)"}`,borderRadius:14,padding:18,cursor:"pointer",transition:"all .2s",background:acctType==="pro"?"#FFFBEB":"var(--w)",boxShadow:acctType==="pro"?"0 4px 20px rgba(217,119,6,0.15)":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:48,height:48,borderRadius:12,background:acctType==="pro"?"linear-gradient(135deg,#F59E0B,#D97706)":"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,transition:"all .2s",flexShrink:0}}>⭐</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{fontWeight:700,fontSize:15}}>Professionnel</div>
                  <span style={{background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"#fff",fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:20,letterSpacing:".04em"}}>PRO</span>
                </div>
                <div style={{fontSize:12,color:"var(--g)",lineHeight:1.4,marginTop:2}}>Pour les entreprises et loueurs pro. Espace dédié, facturation, calendrier.</div>
              </div>
              {acctType==="pro"&&<span style={{color:"#D97706",fontSize:18,fontWeight:700}}>✓</span>}
            </div>
            <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>{["🧾 Factures PDF","🏗️ Mon parc","📊 Dashboard Pro","📅 Calendrier","💛 Visibilité prioritaire"].map(t=><span key={t} style={{fontSize:9,padding:"2px 8px",borderRadius:5,background:"#FEF3C7",color:"#92400E",fontWeight:600}}>{t}</span>)}</div>
          </div>
        </div>
        <button className="bp" style={{width:"100%",marginTop:16}} onClick={()=>setStep(1)}>Continuer →</button>
        <p style={{textAlign:"center",fontSize:12,color:"var(--g)",marginTop:8}}>Déjà un compte ? <button className="cl" onClick={()=>{setMode("login");setErr("")}}>Se connecter</button></p>
      </>:<>
        {/* Step 1: Form fields */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <button className="cl" style={{display:"flex",alignItems:"center",gap:4}} onClick={()=>setStep(0)}><I.Back/></button>
          <span style={{fontSize:13,fontWeight:600}}>{acctType==="pro"?"🏢 Compte Professionnel":"👤 Compte Particulier"}</span>
        </div>
        {acctType==="pro"?<>
          {/* Pro fields */}
          <div style={{background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",borderRadius:10,padding:12,marginBottom:14,fontSize:11,color:"#1E40AF"}}>
            <strong>Avantages Pro :</strong> Espace dédié, Dashboard avancé, Facturation auto, Visibilité prioritaire, Gestion de flotte
          </div>
          <div className="fg"><label>Nom de l'entreprise <span style={{color:"var(--p)"}}>*</span></label><input value={f.company} onChange={e=>u("company",e.target.value)} placeholder="Ex: Loxam, Mon Entreprise SAS"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div className="fg"><label>N° SIRET <span style={{color:"var(--p)"}}>*</span></label><input value={f.siret} onChange={e=>{const v=e.target.value.replace(/\D/g,"").slice(0,14);u("siret",v.replace(/(\d{3})(?=\d)/g,"$1 ").trim())}} placeholder="123 456 789 00012" maxLength="17"/></div>
            <div className="fg"><label>N° TVA intracommunautaire</label><input value={f.tva} onChange={e=>u("tva",e.target.value)} placeholder="FR 12 345678901"/></div>
          </div>
          <div className="fg"><label>Secteur d'activité <span style={{color:"var(--p)"}}>*</span></label><select value={f.sector} onChange={e=>u("sector",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1.5px solid var(--bd)",borderRadius:9,fontSize:13}}>
            <option value="">Sélectionner...</option>
            <option>BTP & Construction</option><option>Événementiel</option><option>Transport & Logistique</option><option>Audiovisuel & Photo</option><option>Espaces verts & Jardinage</option><option>Industrie & Manufacture</option><option>Restauration & Cuisine</option><option>Sport & Loisirs</option><option>Autre</option>
          </select></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div className="fg"><label>Téléphone</label><input value={f.phone} onChange={e=>u("phone",e.target.value)} placeholder="01 23 45 67 89"/></div>
            <div className="fg"><label>Site web</label><input value={f.website} onChange={e=>u("website",e.target.value)} placeholder="www.monentreprise.fr"/></div>
          </div>
          <div className="fg"><label>Email professionnel <span style={{color:"var(--p)"}}>*</span></label><input type="email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="contact@entreprise.fr"/></div>
          <div className="fg"><label>Mot de passe <span style={{color:"var(--p)"}}>*</span></label><input type="password" value={f.password} onChange={e=>u("password",e.target.value)} placeholder="••••••••"/></div>
          <div className="fg"><label>Ville</label><select value={f.location} onChange={e=>u("location",e.target.value)}>{LOCS.map(l=><option key={l}>{l}</option>)}</select></div>
        </>:<>
          {/* Particulier fields */}
          <div className="auth-wrap">
            {/* Photo */}
            <div className="auth-avatar-zone">
              <div className="auth-avatar-circle" onClick={()=>document.getElementById('av-upload').click()}>
                {avatarPreview?<img src={avatarPreview} alt="avatar"/>:<><span style={{fontSize:28}}>📷</span><span style={{fontSize:10,color:"var(--g)",marginTop:2}}>Photo</span></>}
              </div>
              <span className="auth-avatar-hint">Photo de profil (optionnel)</span>
              <input id="av-upload" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files[0];if(file){const r=new FileReader();r.onload=ev=>setAvatarPreview(ev.target.result);r.readAsDataURL(file);}}}/>
            </div>
            {/* Identité */}
            <div className="auth-section"><span className="auth-section-label">Identité</span><hr/></div>
            <div className="auth-row">
              <div className="auth-field"><label>Prénom <span style={{color:"var(--p)"}}>*</span></label><input value={f.firstName} onChange={e=>u("firstName",e.target.value)} placeholder="Jean"/></div>
              <div className="auth-field"><label>Nom <span style={{color:"var(--p)"}}>*</span></label><input value={f.lastName} onChange={e=>u("lastName",e.target.value)} placeholder="Dupont"/></div>
            </div>
            <div className="auth-field"><label>Date de naissance</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 2fr 1fr',gap:8}}>
                <select className="auth-sel" value={f.dobDay} onChange={e=>u('dobDay',e.target.value)} style={{padding:'11px 8px',border:'1.5px solid #e5e7eb',borderRadius:12,fontSize:14,background:'var(--w)',color:'var(--dk)',outline:'none'}}>
                  <option value="">Jour</option>
                  {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={String(d).padStart(2,'0')}>{String(d).padStart(2,'0')}</option>)}
                </select>
                <select className="auth-sel" value={f.dobMonth} onChange={e=>u('dobMonth',e.target.value)} style={{padding:'11px 8px',border:'1.5px solid #e5e7eb',borderRadius:12,fontSize:14,background:'var(--w)',color:'var(--dk)',outline:'none'}}>
                  <option value="">Mois</option>
                  {['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'].map((m,i)=><option key={i} value={String(i+1).padStart(2,'0')}>{m}</option>)}
                </select>
                <select className="auth-sel" value={f.dobYear} onChange={e=>u('dobYear',e.target.value)} style={{padding:'11px 8px',border:'1.5px solid #e5e7eb',borderRadius:12,fontSize:14,background:'var(--w)',color:'var(--dk)',outline:'none'}}>
                  <option value="">Année</option>
                  {Array.from({length:100},(_,i)=>new Date().getFullYear()-18-i).map(y=><option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            {/* Accès */}
            <div className="auth-section"><span className="auth-section-label">Accès</span><hr/></div>
            <div className="auth-field"><label>Email <span style={{color:"var(--p)"}}>*</span></label><input type="email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="jean@email.com"/></div>
            <div className="auth-field"><label>Mot de passe <span style={{color:"var(--p)"}}>*</span></label><input type="password" value={f.password} onChange={e=>u("password",e.target.value)} placeholder="••••••••"/></div>
            {/* Localisation */}
            <div className="auth-section"><span className="auth-section-label">Localisation</span><hr/></div>
            <div className="auth-field"><label>Téléphone</label><input type="tel" value={f.phone} onChange={e=>u("phone",e.target.value)} placeholder="06 12 34 56 78"/></div>
            <div className="auth-field" style={{position:'relative'}}><label>Adresse <span style={{fontWeight:400,color:'var(--g)'}}>(numéro + rue)</span></label>
              <input value={f.address} onChange={e=>{u("address",e.target.value);clearTimeout(addrTimer.current);if(e.target.value.length>=3){addrTimer.current=setTimeout(()=>{const cityParam=f.city?`&city=${encodeURIComponent(f.city)}`:"";const pcParam=f.postalCode?`&postcode=${encodeURIComponent(f.postalCode)}`:"";fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(e.target.value)}&limit=5&type=housenumber${pcParam||cityParam}`).then(r=>r.json()).then(d=>setAddrSugg(d.features||[])).catch(()=>{})},400);}else setAddrSugg([]);}} onBlur={()=>setTimeout(()=>setAddrSugg([]),200)} placeholder="Ex : 12 rue des Lilas"/>
              <span style={{fontSize:11,color:'var(--g)',marginTop:3,display:'block'}}>Suggestions optionnelles — vous pouvez taper librement</span>
              {addrSugg.length>0&&<div style={{position:'absolute',top:'calc(100% - 4px)',left:0,right:0,background:'var(--w)',border:'1px solid #e5e7eb',borderRadius:10,boxShadow:'0 4px 16px rgba(0,0,0,.1)',zIndex:200,overflow:'hidden'}}>
                {addrSugg.map((feat,i)=><div key={i} style={{padding:'10px 14px',cursor:'pointer',fontSize:13,borderBottom:'1px solid #f3f4f6'}} onMouseEnter={e=>e.currentTarget.style.background='#f5f3ff'} onMouseLeave={e=>e.currentTarget.style.background=''} onClick={()=>{u('address',feat.properties.name);u('postalCode',feat.properties.postcode||'');u('city',feat.properties.city||'');setAddrSugg([]);}}>
                  <span style={{fontWeight:600}}>{feat.properties.name}</span> <span style={{color:'var(--g)',fontSize:12}}>{feat.properties.postcode} {feat.properties.city}</span>
                </div>)}
              </div>}
            </div>
            <div className="auth-row">
              <div className="auth-field"><label>Code postal</label><input value={f.postalCode} onChange={e=>u("postalCode",e.target.value.replace(/\D/g,"").slice(0,5))} placeholder="75001" maxLength="5"/></div>
              <div className="auth-field"><label>Ville</label><input value={f.city} onChange={e=>u("city",e.target.value)} placeholder="Votre ville ou village"/></div>
            </div>
            {/* Consentements */}
            <div className="auth-section"><span className="auth-section-label">Consentements</span><hr/></div>
            <label className="auth-check"><input type="checkbox" checked={cguOk} onChange={e=>setCguOk(e.target.checked)}/><span className="auth-check-box">{cguOk&&<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span><span className="auth-check-text">J'accepte les <button style={{background:"none",border:"none",padding:0,margin:0,color:"var(--p)",fontWeight:700,fontSize:13,textDecoration:"underline",cursor:"pointer",display:"inline"}} onClick={e=>{e.preventDefault();e.stopPropagation();setShowCGU(true)}}>CGU</button> <span style={{color:"var(--p)"}}>*</span></span></label>
            <label className="auth-check"><input type="checkbox" checked={privacyOk} onChange={e=>setPrivacyOk(e.target.checked)}/><span className="auth-check-box">{privacyOk&&<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span><span className="auth-check-text">J'accepte la <button style={{background:"none",border:"none",padding:0,margin:0,color:"var(--p)",fontWeight:700,fontSize:13,textDecoration:"underline",cursor:"pointer",display:"inline"}} onClick={e=>{e.preventDefault();e.stopPropagation();setShowPrivacy(true)}}>Politique de confidentialité</button> <span style={{color:"var(--p)"}}>*</span></span></label>
            <label className="auth-check"><input type="checkbox" checked={marketingOk} onChange={e=>setMarketingOk(e.target.checked)}/><span className="auth-check-box">{marketingOk&&<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span><span className="auth-check-text opt">J'accepte de recevoir des emails promotionnels de Cercle <span style={{fontSize:11,color:"var(--gl)"}}>(optionnel)</span></span></label>
          </div>
        </>}
        {err&&<p style={{color:"#ef4444",fontSize:12,marginBottom:8,padding:"6px 10px",background:"#fef2f2",borderRadius:8}}>{err}</p>}
        <button className="auth-submit" disabled={acctType==="perso"&&(!cguOk||!privacyOk)} style={{background:acctType==="pro"?"linear-gradient(135deg,#2563EB,#1d4ed8)":undefined}} onClick={go}>{acctType==="pro"?"Créer mon compte Pro 🏢":"Créer mon compte 🎉"}</button>
        <p style={{textAlign:'center',fontSize:11,color:'var(--gl)',marginTop:8,lineHeight:1.5}}>🔒 Vos données sont protégées et ne seront jamais revendues.</p>
      </>}
    </div>
  </div></div>
  {showCGU&&<CGUModal onClose={()=>setShowCGU(false)}/>}
  {showPrivacy&&<PrivacyModal onClose={()=>setShowPrivacy(false)}/>}
</>
}


/* ===== ONBOARDING ===== */
function Onboarding({onClose}){
  const[step,setStep]=useState(0);
  const steps=[
    {icon:"🎉",title:"Bienvenue sur Cercle !",desc:"La plateforme de location entre particuliers et pros. Louez ce dont vous avez besoin, rentabilisez ce que vous n'utilisez pas."},
    {icon:"🔍",title:"Trouvez facilement",desc:"2 400+ annonces disponibles. Filtrez par catégorie, localisation et prix. Réservez en quelques clics, depuis n'importe où."},
    {icon:"💰",title:"Rentabilisez vos objets",desc:"Proposez vos affaires inutilisées en 2 minutes. Définissez votre prix et vos disponibilités, les demandes arrivent directement."},
    {icon:"🛡️",title:"Louer en toute sécurité",desc:"Paiement sécurisé SSL, caution automatique et protection jusqu'à 2 000 €. Vous êtes protégé à chaque location."},
  ];
  const s=steps[step];
  return <div className="bk" style={{zIndex:600}} onClick={onClose}>
    <div className="md" style={{maxWidth:440,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
      <div style={{padding:"36px 28px 12px"}} className="ob-step" key={step}>
        <div style={{fontSize:60,marginBottom:16}}>{s.icon}</div>
        <h2 style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:700,marginBottom:10,letterSpacing:"-.02em"}}>{s.title}</h2>
        <p style={{fontSize:14,color:"var(--g)",lineHeight:1.65,maxWidth:340,margin:"0 auto"}}>{s.desc}</p>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20,marginTop:8}}>
        {steps.map((_,i)=><div key={i} style={{width:i===step?24:6,height:6,borderRadius:3,background:i===step?"var(--p)":"var(--bd)",transition:"all .3s var(--ease)"}}/>)}
      </div>
      <div style={{padding:"0 24px 28px",display:"flex",gap:8}}>
        {step===0
          ?<button className="bs" style={{flex:1}} onClick={onClose}>Passer</button>
          :<button className="bs" style={{flex:1}} onClick={()=>setStep(s=>s-1)}>← Retour</button>}
        {step<steps.length-1
          ?<button className="bp" style={{flex:2}} onClick={()=>setStep(s=>s+1)}>Suivant →</button>
          :<button className="bp" style={{flex:2,background:"var(--acc)"}} onClick={onClose}>C'est parti 🚀</button>}
      </div>
    </div>
  </div>
}

/* ===== QR CODE MODAL ===== */
