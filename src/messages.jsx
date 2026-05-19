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

  return <div className="msg-page">
    {/* Header */}
    <div className="msg-header">
      <button onClick={()=>ac?backToList():setPage("home")} style={{background:'none',border:'none',padding:'6px 8px',cursor:'pointer',display:'flex',alignItems:'center',color:'var(--dk)',borderRadius:10,flexShrink:0}}><I.Back/></button>
      <div style={{flex:1}}>
        <div style={{fontSize:17,fontWeight:800,fontFamily:'var(--fd)',color:'var(--dk)'}}>{ac?o.name:'Messages'}</div>
        {ac&&<div style={{fontSize:12,color:'#22c55e',fontWeight:600}}>● En ligne</div>}
        {!ac&&<div style={{fontSize:12,color:'var(--g)'}}>{convs.length} conversation{convs.length!==1?'s':''}</div>}
      </div>
      {ac&&<div style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,#5B4EE8,#3A30D8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,color:'#fff',fontWeight:800,flexShrink:0}}>{(o.name||'?')[0].toUpperCase()}</div>}
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
            const ac=[['#5B4EE8','#3A30D8'],['#10B972','#059669'],['#F59E0B','#D97706'],['#E85D4A','#BE3B28'],['#8B5CF6','#7C3AED']];
            const ci2=Math.abs((o2.name||'?').charCodeAt(0))%5;
            return <div key={c.id} className={"conv-item"+(isActive?" active":"")} onClick={()=>openConv(c.id)}>
              <div className="conv-av" style={{background:`linear-gradient(135deg,${ac[ci2][0]},${ac[ci2][1]})`,color:'#fff',fontWeight:800,fontSize:16}}>
                {(o2.name||'?')[0].toUpperCase()}
                <span className="conv-av-online"/>
              </div>
              <div className="conv-info">
                <div className="conv-name">{o2.name}</div>
                {c.itemTitle&&<div style={{fontSize:11,color:'var(--p)',fontWeight:600,marginBottom:1}}>📦 {c.itemTitle}</div>}
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
            <div style={{width:46,height:46,borderRadius:'50%',background:'linear-gradient(135deg,#5B4EE8,#3A30D8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,color:'#fff',fontWeight:800,flexShrink:0,boxShadow:'0 4px 14px rgba(91,78,232,.4)'}}>
              {(o.name||'?')[0].toUpperCase()}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="chat-header-name">{o.name}</div>
              {ac.itemTitle&&<div className="chat-header-sub" style={{color:'var(--p)',fontWeight:600}}>📦 {ac.itemTitle}</div>}
            </div>
            {ac.itemTitle&&<button onClick={()=>{const all=[...state.items,...(state.userItems||[]),...(state.cloudItems||[])];const item=all.find(i=>i.id===ac.itemId);if(item&&openDetail)openDetail(item);else setPage("home");}} style={{flexShrink:0,background:'var(--bg)',border:'1.5px solid var(--bd)',borderRadius:100,padding:'8px 18px',fontSize:13,fontWeight:700,color:'var(--p)',cursor:'pointer',whiteSpace:'nowrap'}}>
              Voir l'annonce →
            </button>}
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

