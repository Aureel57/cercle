function CreateListing({state,dispatch,setPage,mode,editItem}){
  const[f,setF]=useState(editItem?{title:editItem.title||"",cat:editItem.cat||"tools",price:editItem.price||"",location:editItem.location||state.user?.location||"Paris 11e",condition:editItem.condition||"Comme neuf",description:editItem.description||"",deposit:editItem.deposit||""}:{title:"",cat:"tools",price:"",location:state.user?.location||"Paris 11e",condition:"Comme neuf",description:"",deposit:""});
  const[photos,setPhotos]=useState(editItem?.images||[]);
  const[drag,setDrag]=useState(false);
  const fileRef=useRef(null);
  const camRef=useRef(null);
  const u=(k,v)=>setF(p=>({...p,[k]:v}));

  const [saving,setSaving]=useState(false);
  const [showSimilar,setShowSimilar]=useState(true);

  const allItems = useMemo(()=>{const seen=new Set();return [...(state.items||[]),...(state.proItems||[]),...(state.userItems||[]),...(state.cloudItems||[])].filter(i=>{if(seen.has(i.id))return false;seen.add(i.id);return true;});},[state.items,state.proItems,state.userItems,state.cloudItems]);

  const similar = useMemo(()=>{
    const words=(f.title||'').toLowerCase().split(/\s+/).filter(w=>w.length>2);
    return allItems.filter(i=>{
      if(i.cat!==f.cat)return false;
      if(words.length===0)return true;
      return words.some(w=>i.title.toLowerCase().includes(w));
    }).sort((a,b)=>a.price-b.price).slice(0,6);
  },[f.cat,f.title,allItems]);

  const simPrices=similar.map(i=>+i.price);
  const simMin=simPrices.length?Math.min(...simPrices):0;
  const simMax=simPrices.length?Math.max(...simPrices):0;
  const simAvg=simPrices.length?Math.round(simPrices.reduce((a,b)=>a+b,0)/simPrices.length):0;

  // Compresse une image base64 à max 800px, JPEG 75% (~60-120KB)
  const compressImg=(dataUrl,maxW=800,quality=0.75)=>new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{
      const ratio=Math.min(1,maxW/img.width,maxW/img.height);
      const cnv=document.createElement('canvas');
      cnv.width=Math.round(img.width*ratio);
      cnv.height=Math.round(img.height*ratio);
      cnv.getContext('2d').drawImage(img,0,0,cnv.width,cnv.height);
      resolve(cnv.toDataURL('image/jpeg',quality));
    };
    img.onerror=()=>resolve(dataUrl);
    img.src=dataUrl;
  });

  const addPhotos=(files)=>{
    const remaining=5-photos.length;
    Array.from(files).slice(0,remaining).forEach(file=>{
      const reader=new FileReader();
      reader.onload=async ev=>{
        const compressed=await compressImg(ev.target.result);
        setPhotos(p=>[...p,compressed]);
      };
      reader.readAsDataURL(file);
    });
  };

  const go=async()=>{
    if(!f.title||!f.price)return;
    setSaving(true);
    // Compresse les photos uploadées (déjà compressées), sinon génère images de catégorie
    const imgs=photos.length>0?photos:[mkImg(f.cat,99,0),mkImg(f.cat,99,1),mkImg(f.cat,99,2)];
    const payload={...f,price:+f.price,deposit:+f.deposit||+f.price*3,photos:imgs,images:imgs,isPro:!!state.user?.isPro};
    // Tester si localStorage peut stocker avant dispatch
    try{
      const testKey='cercle_test_'+Date.now();
      localStorage.setItem(testKey,JSON.stringify(payload));
      localStorage.removeItem(testKey);
    }catch(e){
      // Quota dépassé : compresser encore plus
      const smallImgs=await Promise.all(imgs.map(i=>compressImg(i,400,0.6)));
      payload.images=smallImgs;payload.photos=smallImgs;
    }
    if(editItem){dispatch({type:"EDIT_ITEM",payload:{...payload,id:editItem.id}});}
    else{dispatch({type:"ADD_ITEM",payload});}
    setSaving(false);
    setPage("profile");
  };

  const canSubmit = f.title.trim() && f.price;
  const catEmoji=CE[f.cat]||'📦';
  const catColors=CC[f.cat]||['#5B4EE8','#3A30D8'];

  return <div className="cl-page">
    {/* Sticky header */}
    <div className="cl-header">
      <button onClick={()=>setPage("profile")} style={{background:'none',border:'none',padding:'4px',cursor:'pointer',display:'flex',alignItems:'center',color:'var(--dk)',borderRadius:10,flexShrink:0}}><I.Back/></button>
      {/* Desktop steps progress */}
      <div className="cl-steps">
        {[{n:'1',l:'Photos',done:photos.length>0},{n:'2',l:'Informations',done:!!f.title},{n:'3',l:'Prix',done:!!f.price},{n:'4',l:'Localisation',done:!!f.location},{n:'5',l:'Publier',done:false}].map((s,i)=>(
          <React.Fragment key={s.n}>
            {i>0&&<div className="cl-step-line"/>}
            <div className={"cl-step"+(s.done?" done":(i===(!f.title?1:!f.price?2:!f.location?3:0))?" active":"")}>
              <div className="cl-step-dot">{s.done?'✓':s.n}</div>
              <span>{s.l}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
        {saving&&<div style={{fontSize:12,color:'var(--p)',fontWeight:600}}>Enregistrement…</div>}
        {!saving&&<div style={{fontSize:13,fontWeight:700,fontFamily:'var(--fd)',color:'var(--dk)'}}>{editItem?"Modifier":"Nouvelle annonce"}</div>}
      </div>
    </div>

    {/* Two-column layout */}
    <div className="cl-layout">
      <div className="cl-form-col">
      <div className="cl-body">
      {/* Section 1: Infos de base */}
      <div className="cl-section">
        <div className="cl-section-title"><span>📝</span> L'essentiel</div>
        <div className="fg2">
          <label>Titre de l'annonce *</label>
          <input value={f.title} onChange={e=>u("title",e.target.value)} placeholder="Ex: Perceuse Bosch Pro 800W"/>
        </div>
        <div className="cl-row">
          <div className="fg2" style={{marginBottom:0}}>
            <label>Catégorie</label>
            <select value={f.cat} onChange={e=>u("cat",e.target.value)}>{CATS.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}</select>
          </div>
          <div className="fg2" style={{marginBottom:0}}>
            <label>État</label>
            <select value={f.condition} onChange={e=>u("condition",e.target.value)}><option>Comme neuf</option><option>Très bon état</option><option>Bon état</option></select>
          </div>
        </div>
      </div>

      {/* Section 2: Prix */}
      <div className="cl-section">
        <div className="cl-section-title"><span>💰</span> Prix &amp; caution</div>
        <div className="cl-price-row">
          <div className="fg2" style={{marginBottom:0}}>
            <label>Prix par jour (€) *</label>
            <input type="number" value={f.price} onChange={e=>u("price",e.target.value)} placeholder="15" min="1"/>
          </div>
          <div className="fg2" style={{marginBottom:0}}>
            <label>Caution (€)</label>
            <input type="number" value={f.deposit} onChange={e=>u("deposit",e.target.value)} placeholder="Calculée auto"/>
          </div>
        </div>
        {f.price&&<div style={{marginTop:12,padding:'10px 14px',background:'rgba(108,99,255,.07)',borderRadius:12,fontSize:12,color:'var(--p)',fontWeight:600}}>
          💡 Vos gains estimés : <strong>{Math.round(f.price*0.88)}€/jour</strong> après commission Cercle (12%)
        </div>}
      </div>

      {/* Section 2b: Annonces similaires */}
      {similar.length>0&&(
        <div className="cl-section" style={{background:'linear-gradient(135deg,rgba(108,99,255,0.04),rgba(139,92,246,0.04))',border:'1.5px solid rgba(108,99,255,0.18)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <div className="cl-section-title" style={{margin:0}}><span>📊</span> Prix du marché</div>
            <button onClick={()=>setShowSimilar(p=>!p)} style={{background:'none',border:'none',fontSize:12,color:'var(--g)',cursor:'pointer',fontWeight:600}}>{showSimilar?'Masquer':'Afficher'}</button>
          </div>
          {showSimilar&&<>
            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:16}}>
              {[{label:'Min',val:simMin,c:'#10b981',bg:'#f0fdf4',bc:'#86efac'},{label:'Moyenne',val:simAvg,c:'#6C63FF',bg:'rgba(108,99,255,0.08)',bc:'rgba(108,99,255,0.35)'},{label:'Max',val:simMax,c:'#f59e0b',bg:'#fefce8',bc:'#fde68a'}].map(s=>(
                <div key={s.label} onClick={()=>u('price',String(s.val))} style={{textAlign:'center',padding:'12px 8px',background:s.bg,borderRadius:14,border:'1.5px solid '+s.bc,cursor:'pointer',transition:'transform .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.transform='scale(1.04)'} onMouseLeave={e=>e.currentTarget.style.transform=''}>
                  <div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.val}€</div>
                  <div style={{fontSize:10,fontWeight:700,color:s.c,textTransform:'uppercase',letterSpacing:'.04em'}}>{s.label}</div>
                  <div style={{fontSize:9,color:'var(--g)',marginTop:1}}>cliquer pour appliquer</div>
                </div>
              ))}
            </div>
            {/* Comparateur si prix saisi */}
            {f.price&&simAvg>0&&(()=>{
              const ratio=+f.price/simAvg;
              const msg=ratio<0.75?{t:'Très bas · attire plus de locataires',c:'#2563eb',bg:'#dbeafe'}:ratio>1.35?{t:'Élevé · réduire pour plus de réservations',c:'#d97706',bg:'#fef3c7'}:{t:'Dans la fourchette ✓',c:'#059669',bg:'#d1fae5'};
              return <div style={{padding:'9px 14px',background:msg.bg,borderRadius:12,fontSize:12,fontWeight:600,color:msg.c,marginBottom:14,display:'flex',alignItems:'center',gap:6}}>
                <span>Votre prix ({f.price}€/j) ·</span><span>{msg.t}</span>
              </div>;
            })()}
            {/* Liste */}
            <div>{similar.map((item,i)=>(
              <div key={item.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<similar.length-1?'1px solid var(--bg)':'none'}}>
                <img src={item.images&&item.images[0]} alt="" style={{width:42,height:42,borderRadius:10,objectFit:'cover',flexShrink:0,background:'var(--bg)'}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--dk)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.title}</div>
                  <div style={{fontSize:11,color:'var(--g)'}}>📍 {item.location} · ⭐ {item.rating||'4.8'}</div>
                </div>
                <div style={{flexShrink:0,textAlign:'right'}}>
                  <div style={{fontSize:15,fontWeight:800,color:'var(--p)'}}>{item.price}€</div>
                  <div style={{fontSize:10,color:'var(--g)'}}>/jour</div>
                </div>
              </div>
            ))}</div>
          </>}
        </div>
      )}

      {/* Section 3: Localisation */}
      <div className="cl-section">
        <div className="cl-section-title"><span>📍</span> Localisation</div>
        <div className="fg2" style={{marginBottom:0}}>
          <label>Ville</label>
          <input value={f.location} onChange={e=>u("location",e.target.value)} placeholder="Paris, Lyon, Bordeaux…"/>
        </div>
      </div>

      {/* Section 4: Description */}
      <div className="cl-section">
        <div className="cl-section-title"><span>📄</span> Description</div>
        <div className="fg2" style={{marginBottom:0}}>
          <label>Décrivez votre objet</label>
          <textarea value={f.description} onChange={e=>u("description",e.target.value)} placeholder="Dimensions, accessoires inclus, conditions d'utilisation…" rows={4}/>
        </div>
        <div style={{fontSize:11,color:'var(--gl)',marginTop:6}}>{(f.description||'').length}/500 caractères</div>
      </div>

      {/* Section 5: Photos */}
      <div className="cl-section">
        <div className="cl-section-title"><span>📸</span> Photos <span style={{fontSize:12,fontWeight:500,textTransform:'none',letterSpacing:0,color:'var(--g)'}}>{photos.length}/5</span></div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{addPhotos(e.target.files);e.target.value=""}}/>
        <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{addPhotos(e.target.files);e.target.value=""}}/>
        <div
          className={"photo-grid"}
          onDrop={e=>{e.preventDefault();setDrag(false);addPhotos(e.dataTransfer.files)}}
          onDragOver={e=>{e.preventDefault();setDrag(true)}}
          onDragLeave={()=>setDrag(false)}
        >
          {photos.map((src,i)=><div key={i} className="photo-cell">
            <img src={src} alt=""/>
            <button className="photo-cell-del" onClick={()=>setPhotos(p=>p.filter((_,j)=>j!==i))}>✕</button>
          </div>)}
          {photos.length<5&&<div className={"photo-cell-add"+(drag?" drag":"")} onClick={()=>fileRef.current&&fileRef.current.click()}>
            <span style={{fontSize:24}}>+</span>
            <span style={{fontSize:11,fontWeight:600}}>{photos.length===0?"Ajouter":"Plus"}</span>
          </div>}
        </div>
        {photos.length===0&&<p style={{fontSize:12,color:'var(--g)',marginTop:10,textAlign:'center'}}>Les annonces avec photos reçoivent 3× plus de demandes</p>}
        <button onClick={e=>{e.stopPropagation();camRef.current&&camRef.current.click()}} style={{marginTop:12,width:'100%',padding:'10px',background:'var(--bg)',border:'1.5px solid var(--bd)',borderRadius:12,fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,color:'var(--dk)'}}>📷 Prendre une photo</button>
      </div>
    </div>
      {/* Sticky CTA */}
      <div className="cl-submit">
        <button className="cl-cta" onClick={go} disabled={saving||!canSubmit}>
          {saving?<><span style={{animation:'spin 1s linear infinite',display:'inline-block'}}>⏳</span> Enregistrement…</>:editItem?<><span>💾</span> Enregistrer les modifications</>:<><span>🚀</span> Publier l'annonce</>}
        </button>
      </div>
      </div>{/* end cl-form-col */}

      {/* Desktop preview column */}
      <div className="cl-preview-col">
        <div className="cl-preview-label">👁 Aperçu de votre annonce</div>
        <div className="cl-preview-card">
          <div className="cl-preview-img" style={{background:`linear-gradient(135deg,${catColors[0]},${catColors[1]})`}}>
            {catEmoji}
          </div>
          <div className="cl-preview-body">
            {f.title?<div className="cl-preview-title">{f.title}</div>:<div className="cl-preview-title" style={{color:'var(--gl)',fontStyle:'italic'}}>Titre de l'annonce…</div>}
            <div style={{fontSize:13,color:'var(--g)',marginBottom:12}}>📍 {f.location||'Localisation'} · {CATS.find(c=>c.id===f.cat)?.icon} {CATS.find(c=>c.id===f.cat)?.label}</div>
            {f.price?<div className="cl-preview-price">{f.price}€<span style={{fontSize:14,fontWeight:400,color:'var(--g)'}}>/jour</span></div>:<div style={{fontSize:20,color:'var(--gl)',fontWeight:700}}>Prix/jour…</div>}
            <div style={{marginTop:10,fontSize:12,color:'var(--g)',background:'var(--bg)',padding:'8px 12px',borderRadius:10}}>💡 Gains estimés : <strong style={{color:'var(--p)'}}>{f.price?Math.round(+f.price*.88)+'€':'-'}€/jour</strong> après commission</div>
          </div>
        </div>
        <ul className="cl-tips">
          <div className="cl-tips-title">✨ Conseils pour bien louer</div>
          <li><span>📸</span>Ajoutez 3+ photos pour +40% de vues</li>
          <li><span>💰</span>Regardez les prix similaires pour rester compétitif</li>
          <li><span>✍️</span>Une description détaillée rassure les locataires</li>
        </ul>
      </div>
    </div>{/* end cl-layout */}
  </div>
}

