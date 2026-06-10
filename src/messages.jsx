function Messages({state,dispatch,cid,setCid,setPage,onOpenItem}){
  const[msg,setMsg]=useState("");
  const[searchQ,setSearchQ]=useState("");
  const allItemsM=[...(state.items||[]),...(state.proItems||[]),...(state.userItems||[]),...(state.cloudItems||[])];
  const openAnnonce=it=>{const found=allItemsM.find(x=>x.id===it);if(found&&onOpenItem)onOpenItem(found);};
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
    // Réponse simulée : uniquement pour les profils de démonstration (u1…u6, p1…p4).
    // Les vrais utilisateurs répondent via Firestore — pas de faux messages en leur nom.
    if(/^[up]\d+$/.test(String(other||''))){
      setTyping(true);
      setTimeout(()=>{
        setTyping(false);
        const reps=["Bonjour ! Oui c'est disponible 😊","Bien sûr, on s'arrange.","Super, quand voulez-vous le récupérer ?","Envoyez-moi une demande !","Merci pour votre intérêt !"];
        dispatch({type:"MSG",payload:{id:uid(),cid,from:other,to:state.user.id,text:reps[Math.floor(Math.random()*reps.length)],timestamp:new Date(),_fromCloud:true}});
      },1200+Math.random()*2e3);
    }
  };

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
  const fileRef=useRef(null);
  const onAttach=e=>{
    const f=e.target.files&&e.target.files[0];if(!f||!ac)return;
    const other=ac.parts.find(p=>p!==state.user.id);
    dispatch({type:"MSG",payload:{id:uid(),cid,from:state.user.id,fromName:state.user.name||'',fromAvatar:state.user.avatar||'😊',to:other,toName:ac.otherName||'',toAvatar:ac.otherAvatar||'😊',itemId:ac.itemId||'',itemTitle:ac.itemTitle||'',text:`📎 ${f.name}`,timestamp:new Date()}});
    e.target.value="";
  };

  const o=ac?getO(ac):null;

  const totalUnread=convs.reduce((s,c)=>s+(unreadCount(c)>0?1:0),0);

  return <div className="msg-page">
    {/* Header */}
    <div className="msg-header">
      {ac&&<button className="chat-back-btn" onClick={backToList}><I.Back/></button>}
      <a className="msg-logo" onClick={()=>setPage("home")}>
        <img src={LOGO} alt="Cercle" style={{height:38,width:38,objectFit:'contain'}}/>
        <span className="lt">Cercle</span>
      </a>
      <div className="msg-title">💬 Messages{totalUnread>0&&<span className="msg-title-badge">{totalUnread}</span>}</div>
      <div className="msg-header-av">{state.user?.avatar||'😊'}</div>
    </div>

    {/* Body */}
    <div className="msg-body">
      {/* Conversation list */}
      <div className={"conv-list"+((!showList&&ac)?" hidden":"")}>
        <div className="conv-search">
          <input placeholder="🔍  Rechercher une conversation…" value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
        </div>
        <div className="conv-items">
          {convs.length===0&&<div className="conv-empty"><div><div style={{fontSize:42,marginBottom:12}}>💬</div><div style={{fontWeight:600,color:'var(--dk)',marginBottom:6}}>Aucune conversation</div><div style={{fontSize:13}}>Contactez un propriétaire pour commencer</div></div></div>}
          {convs.length>0&&searchQ&&convs.filter(c=>{const o2=getO(c);return o2.name.toLowerCase().includes(searchQ.toLowerCase())||(c.itemTitle||'').toLowerCase().includes(searchQ.toLowerCase());}).length===0&&<div className="conv-empty"><div><div style={{fontSize:36,marginBottom:10}}>🔍</div><div style={{fontWeight:600,color:'var(--dk)',marginBottom:4}}>Aucun résultat</div><div style={{fontSize:12,color:'var(--g)'}}>Aucune conversation avec "{searchQ}"</div></div></div>}
          {(searchQ?convs.filter(c=>{const o2=getO(c);return o2.name.toLowerCase().includes(searchQ.toLowerCase())||(c.itemTitle||'').toLowerCase().includes(searchQ.toLowerCase());}):convs).map(c=>{
            const o2=getO(c);
            const ub=unreadCount(c);
            const isActive=cid===c.id;
            return <div key={c.id} className={"conv-item"+(isActive?" active":"")} onClick={()=>openConv(c.id)}>
              <div className="conv-av">
                {o2.avatar}
                <span className="conv-av-online"/>
              </div>
              <div className="conv-info">
                <div className="conv-name">{o2.name}</div>
                {c.itemTitle&&<div className="conv-item-link">📦 {c.itemTitle}</div>}
                <div className="conv-last">{c.last||'Démarrer la conversation'}</div>
              </div>
              <div className="conv-meta">
                <span className="conv-time">{fmtTime(c.at)}</span>
                {ub>0&&!isActive&&<span className="conv-badge">{ub}</span>}
              </div>
            </div>;
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className={"chat-area"+(showList&&!ac?" hidden":"")}>
        {!ac?<div className="chat-empty">
          <div className="chat-empty-icon">💬</div>
          <div style={{fontWeight:700,fontSize:16,color:'var(--dk)',marginBottom:6}}>Vos conversations</div>
          <div style={{fontSize:13,lineHeight:1.6}}>Sélectionnez une conversation dans la liste pour commencer à échanger</div>
        </div>:<>
          {/* Chat header */}
          <div className="chat-header">
            <div className="chat-header-av">{o.avatar}<span className="conv-av-online"/></div>
            <div style={{flex:1,minWidth:0}}>
              <div className="chat-header-name">{o.name}</div>
              <div className="chat-header-sub">
                {ac.itemTitle&&<span style={{color:'var(--p)',fontWeight:600}}>📦 {ac.itemTitle}</span>}
                <span style={{color:'#16A34A',fontWeight:600}}>● En ligne</span>
              </div>
            </div>
            {ac.itemId&&<button className="chat-voir" onClick={()=>openAnnonce(ac.itemId)}>Voir l'annonce →</button>}
          </div>

          {/* Messages */}
          <div className="chat-msgs" ref={ref}>
            {msgs.length===0&&<div style={{textAlign:'center',color:'var(--g)',fontSize:13,marginTop:24}}>Commencez la conversation !</div>}
            {msgs.map((m,idx)=>{
              const isMe=m.from===state.user?.id;
              const showTime=idx===0||idx===msgs.length-1||(new Date(msgs[idx].timestamp)-new Date(msgs[idx-1]?.timestamp))>300000;
              return <React.Fragment key={m.id}>
                {showTime&&<div className="msg-day-sep"><span>{fmtTime(m.timestamp)}</span></div>}
                <div className={"msg-bubble"+(isMe?" me":" them")}>
                  {m.text}
                  {isMe&&<span className="msg-time">✓✓</span>}
                  {!isMe&&<span className={"msg-time left"}>{new Date(m.timestamp).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>}
                </div>
              </React.Fragment>;
            })}
            {typing&&<div className="chat-typing">
              <div className="chat-typing-av">{o.avatar}</div>
              <div className="chat-typing-dots"><span/><span/><span/></div>
            </div>}
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input ref={fileRef} type="file" style={{display:'none'}} onChange={onAttach}/>
            <button className="chat-attach" title="Joindre un fichier" onClick={()=>fileRef.current&&fileRef.current.click()}>📎</button>
            <textarea
              ref={inputRef}
              className="chat-input"
              value={msg}
              onChange={e=>setMsg(e.target.value)}
              placeholder="Écrire un message…"
              rows={1}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            />
            <button className="chat-send" onClick={send} disabled={!msg.trim()}><I.Send/></button>
          </div>
        </>}
      </div>
    </div>
  </div>;
}

