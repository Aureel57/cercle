function Messages({state,dispatch,cid,setCid,setPage,openDetail}){
  const[msg,setMsg]=useState("");
  const[searchQ,setSearchQ]=useState("");
  const ref=useRef(null);
  const inputRef=useRef(null);
  const[typing,setTyping]=useState(false);
  const[showList,setShowList]=useState(!cid);

  const convs=state.conversations.slice().sort((a,b)=>new Date(b.at)-new Date(a.at));
  const ac=convs.find(c=>c.id===cid);
  const msgs=state.messages.filter(m=>m.cid===cid).sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp));

  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs.length,cid]);

  const unreadCount=cv=>{
    const cvMsgs=state.messages.filter(m=>m.cid===cv.id&&m.to===state.user?.id);
    return cvMsgs.length>0?1:0;
  };

  const fmtTime=ts=>{
    if(!ts)return'';
    const d=new Date(ts);const now=new Date();
    const diff=(now-d)/1000;
    if(diff<60)return'maintenant';
    if(diff<3600)return Math.floor(diff/60)+'min';
    if(d.toDateString()===now.toDateString())return d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    return d.toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
  };

  const send=()=>{
    if(!msg.trim()||!ac)return;
    const other=ac.parts.find(p=>p!==state.user.id);
    dispatch({type:"MSG",payload:{id:uid(),cid,from:state.user.id,fromName:state.user.name||'',fromAvatar:state.user.avatar||'😊',to:other,toName:ac.otherName||'',toAvatar:ac.otherAvatar||'😊',itemId:ac.itemId||'',itemTitle:ac.itemTitle||'',text:msg.trim(),timestamp:new Date()}});
    setMsg("");
    if(inputRef.current)inputRef.current.focus();
    setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      const reps=["Bonjour ! Oui c'est disponible 😊","Bien sûr, on s'arrange.","Super, quand voulez-vous le récupérer ?","Envoyez-moi une demande !","Merci pour votre intérêt !"];
      dispatch({type:"MSG",payload:{id:uid(),cid,from:other,to:state.user.id,text:reps[Math.floor(Math.random()*reps.length)],timestamp:new Date(),_fromCloud:true}});
    },1200+Math.random()*2e3);
  };

  const AV_COLS=[['#10B972','#059669'],['#4A90E2','#2563EB'],['#F59E0B','#D97706'],['#8B5CF6','#7C3AED'],['#E85D4A','#BE3B28']];
  const getAvCol=name=>{const ci=Math.abs((name||'?').charCodeAt(0))%5;return AV_COLS[ci];};

  const getO=cv=>{
    const oid=cv.parts.find(p=>p!==state.user?.id);
    const demo=USERS.find(u=>u.id===oid);if(demo)return demo;
    const msgFrom=state.messages.find(m=>m.cid===cv.id&&m.from!==state.user?.id);
    const n=cv.otherName||msgFrom?.fromName||'Utilisateur';
    const av=cv.otherAvatar||msgFrom?.fromAvatar||'😊';
    return{name:n,avatar:av};
  };

  const openConv=id=>{setCid(id);setShowList(false);};
  const backToList=()=>{setCid(null);setShowList(true);};

  const o=ac?getO(ac):null;
  const oCol=o?getAvCol(o.name):AV_COLS[0];
  const totalUnread=convs.reduce((s,cv)=>s+unreadCount(cv),0);

  const goToItem=()=>{
    const all=[...state.items,...(state.userItems||[]),...(state.cloudItems||[])];
    const item=all.find(i=>i.id===ac?.itemId);
    if(item&&openDetail)openDetail(item);else setPage("home");
  };

  return <div className="msp">
    {/* Header */}
    <div className="msp-hd">
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <img src={CERCLE_LOGO} alt="Cercle" style={{width:40,height:40,objectFit:'contain',flexShrink:0}}/>
        <span style={{fontSize:22,fontWeight:800,color:'var(--dk)',fontFamily:'var(--f)',letterSpacing:'-.02em'}}>Cercle</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:18,fontWeight:700,color:'var(--dk)',fontFamily:'var(--f)'}}>💬 Messages</span>
        {totalUnread>0&&<div style={{background:'#FF6B6B',borderRadius:100,minWidth:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#fff',padding:'0 5px'}}>{totalUnread}</div>}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {state.user&&<div style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,#5B4EE8,#3A30D8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:800,color:'#fff',flexShrink:0}}>{(state.user.name||'N')[0].toUpperCase()}</div>}
      </div>
    </div>

    {/* Body */}
    <div className="msp-body">

      {/* Conversations list */}
      <div className={"msp-list"+((!showList&&ac)?" hidden":"")}>
        <div style={{padding:'16px 20px 12px'}}>
          <div style={{background:'#F5F4FA',border:'1px solid #E6E5EF',borderRadius:100,height:40,display:'flex',alignItems:'center',padding:'0 14px',gap:8}}>
            <span style={{fontSize:14,lineHeight:1}}>🔍</span>
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Rechercher..." style={{flex:1,border:'none',outline:'none',background:'transparent',fontSize:13,color:'var(--dk)',fontFamily:'var(--f)'}} />
          </div>
        </div>
        <div className="msp-convs">
          {convs.length===0&&<div style={{padding:'48px 20px',textAlign:'center',color:'var(--g)'}}>
            <div style={{fontSize:40,marginBottom:12}}>💬</div>
            <div style={{fontWeight:600,color:'var(--dk)',marginBottom:6}}>Aucune conversation</div>
            <div style={{fontSize:13}}>Contactez un propriétaire pour commencer</div>
          </div>}
          {(searchQ?convs.filter(c=>{const o2=getO(c);return o2.name.toLowerCase().includes(searchQ.toLowerCase())||(c.itemTitle||'').toLowerCase().includes(searchQ.toLowerCase());}):convs).map(c=>{
            const o2=getO(c);
            const ub=unreadCount(c);
            const isActive=cid===c.id;
            const[c1,c2]=getAvCol(o2.name);
            return <div key={c.id} className={"msp-cv"+(isActive?" active":"")} onClick={()=>openConv(c.id)}>
              <div style={{position:'relative',flexShrink:0}}>
                <div style={{width:46,height:46,borderRadius:'50%',background:`linear-gradient(135deg,${c1},${c2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontWeight:800,color:'#fff',fontFamily:'var(--f)'}}>
                  {(o2.name||'?')[0].toUpperCase()}
                </div>
                <div style={{position:'absolute',width:12,height:12,borderRadius:'50%',background:'#22C55E',border:'2.5px solid #fff',top:-1,right:-1}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:2}}>
                  <span style={{fontSize:14,fontWeight:700,color:'var(--dk)',fontFamily:'var(--f)'}}>{o2.name}</span>
                  <span style={{fontSize:11,color:'var(--g)',flexShrink:0,marginLeft:8}}>{fmtTime(c.at)}</span>
                </div>
                {c.itemTitle&&<div style={{fontSize:11,fontWeight:600,color:'var(--p)',marginBottom:3}}>📦 {c.itemTitle}</div>}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12,color:'var(--g)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:210}}>{c.last||'Démarrer la conversation'}</span>
                  {ub>0&&!isActive&&<div style={{background:'var(--p)',borderRadius:100,minWidth:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#fff',padding:'0 5px',flexShrink:0,marginLeft:6}}>{ub}</div>}
                </div>
              </div>
            </div>;
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className={"msp-chat"+(showList&&!ac?" hidden":"")}>
        {!ac?
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--g)',textAlign:'center',padding:24}}>
            <div style={{fontSize:52,marginBottom:16,opacity:.45}}>💬</div>
            <div style={{fontWeight:700,fontSize:16,color:'var(--dk)',marginBottom:8}}>Vos conversations</div>
            <div style={{fontSize:13,lineHeight:1.6,maxWidth:280}}>Sélectionnez une conversation dans la liste pour commencer à échanger</div>
          </div>
        :<>
          {/* Chat header */}
          <div className="msp-ch-hd">
            <button onClick={backToList} className="msp-back-btn"><I.Back/></button>
            <div style={{position:'relative',flexShrink:0}}>
              <div style={{width:46,height:46,borderRadius:'50%',background:`linear-gradient(135deg,${oCol[0]},${oCol[1]})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:'#fff',fontFamily:'var(--f)'}}>
                {(o.name||'?')[0].toUpperCase()}
              </div>
              <div style={{position:'absolute',width:12,height:12,borderRadius:'50%',background:'#22C55E',border:'2.5px solid #fff',top:-1,right:-1}}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:16,fontWeight:700,color:'var(--dk)',fontFamily:'var(--f)',lineHeight:1.2,marginBottom:3}}>{o.name}</div>
              <div style={{fontSize:12,fontWeight:600,lineHeight:1}}>
                {ac.itemTitle&&<span style={{color:'var(--p)'}}>📦 {ac.itemTitle} · </span>}
                <span style={{color:'#22C55E'}}>🟢 En ligne</span>
              </div>
            </div>
            {ac.itemTitle&&<button onClick={goToItem} className="msp-view-btn">Voir l'annonce →</button>}
          </div>

          {/* Messages */}
          <div className="msp-msgs" ref={ref}>
            {msgs.length===0&&<div style={{textAlign:'center',color:'var(--g)',fontSize:13,marginTop:24}}>Commencez la conversation !</div>}
            {msgs.length>0&&<div className="msp-day-sep">─── Aujourd'hui ───</div>}
            {msgs.map((m,idx)=>{
              const isMe=m.from===state.user?.id;
              const showTime=idx===0||idx===msgs.length-1||(new Date(msgs[idx].timestamp)-new Date(msgs[idx-1]?.timestamp))>300000;
              return <React.Fragment key={m.id}>
                <div style={{display:'flex',justifyContent:isMe?'flex-end':'flex-start',marginBottom:showTime?4:8}}>
                  <div className={"msp-bubble"+(isMe?" me":" them")}>{m.text}</div>
                </div>
                {showTime&&<div style={{fontSize:10,color:'#8F8CA6',textAlign:isMe?'right':'left',marginBottom:12,paddingRight:isMe?4:0,paddingLeft:isMe?0:4}}>
                  {fmtTime(m.timestamp)}{isMe?' ✓✓':''}
                </div>}
              </React.Fragment>;
            })}
            {typing&&<div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0 8px'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${oCol[0]},${oCol[1]})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff'}}>{(o.name||'?')[0].toUpperCase()}</div>
              <div className="chat-typing-dots"><span/><span/><span/></div>
            </div>}
          </div>

          {/* Input */}
          <div className="msp-input">
            <div style={{flex:1,background:'#F5F4FA',border:'1.5px solid #E6E5EF',borderRadius:100,height:44,display:'flex',alignItems:'center',padding:'0 18px',gap:10}}>
              <textarea ref={inputRef} className="msp-ta" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Écrivez votre message..." rows={1} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} />
              <span style={{fontSize:18,flexShrink:0,opacity:.45}}>📎</span>
            </div>
            <button onClick={send} disabled={!msg.trim()} className="msp-send">→</button>
          </div>
        </>}
      </div>
    </div>

    {/* Bottom nav bar */}
    <nav className="msp-nav-bot">
      <button className="msp-nav-btn" onClick={()=>setPage('home')}>
        <span className="msp-nav-ic">🏠</span>
        <span className="msp-nav-lbl">Accueil</span>
      </button>
      <button className="msp-nav-btn" onClick={()=>setPage('home')}>
        <span className="msp-nav-ic">🔍</span>
        <span className="msp-nav-lbl">Explorer</span>
      </button>
      <button className="msp-nav-btn active">
        <span className="msp-nav-ic">💬</span>
        <span className="msp-nav-lbl">Messages</span>
      </button>
      <button className="msp-nav-btn" onClick={()=>setPage('profile')}>
        <span className="msp-nav-ic">👤</span>
        <span className="msp-nav-lbl">Profil</span>
      </button>
    </nav>
  </div>;
}
