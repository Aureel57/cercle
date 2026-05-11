function CreateListing({state,dispatch,setPage,mode,editItem}){
  const[f,setF]=useState(editItem?{title:editItem.title||"",cat:editItem.cat||"tools",price:editItem.price||"",location:editItem.location||state.user?.location||"Paris 11e",condition:editItem.condition||"Comme neuf",description:editItem.description||"",deposit:editItem.deposit||""}:{title:"",cat:"tools",price:"",location:state.user?.location||"Paris 11e",condition:"Comme neuf",description:"",deposit:""});
  const[photos,setPhotos]=useState(editItem?.images||[]);
  const[drag,setDrag]=useState(false);
  const fileRef=useRef(null);
  const camRef=useRef(null);
  const u=(k,v)=>setF(p=>({...p,[k]:v}));

  const [saving,setSaving]=useState(false);

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
  return <div className="cl-page">
    {/* Sticky header */}
    <div className="cl-header">
      <button onClick={()=>setPage("profile")} style={{background:'none',border:'none',padding:'4px',cursor:'pointer',display:'flex',alignItems:'center',color:'var(--dk)',borderRadius:10,flexShrink:0}}><I.Back/></button>
      <div style={{flex:1}}>
        <div style={{fontSize:16,fontWeight:800,fontFamily:'var(--fd)',color:'var(--dk)'}}>{editItem?"Modifier l'annonce":"Nouvelle annonce"}</div>
        <div style={{fontSize:12,color:'var(--g)',marginTop:1}}>{editItem?"Mettez à jour votre annonce":"Proposez votre objet en quelques étapes"}</div>
      </div>
      {saving&&<div style={{fontSize:12,color:'var(--p)',fontWeight:600}}>Enregistrement…</div>}
    </div>

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
  </div>
}

