function Profile({state, dispatch, setPage, setSelected, initTab, onEditItem}) {
  const user = (state && state.user) || {};
  const userName = user.name || '';
  const userAvatar = user.avatar || null;

  const avatarInputRef = React.useRef(null);
  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => dispatch({type:"SET_AVATAR", avatar: ev.target.result, url: ev.target.result});
    reader.readAsDataURL(file);
  };

  const [tab, setTab] = React.useState(initTab || 'annonces');
  const [editMode, setEditMode] = React.useState(false);
  const [verifModal, setVerifModal] = React.useState(null);
  const [verifData, setVerifData] = React.useState({firstName:'',lastName:'',docType:'CNI',docNum:'',docExp:'',phoneNum:'',smsCode:'',smsSent:false,licNum:'',licDate:'',licCat:'B',bankHolder:'',iban:'',bic:'',bankName:''});
  const vd = (k,v) => setVerifData(p=>({...p,[k]:v}));
  const closeVerif = () => { setVerifModal(null); setVerifData(p=>({...p,smsSent:false,smsCode:''})); };
  const completeVerif = (key) => { dispatch({type:'SET_PROFILE_COMPLETION',payload:{[key]:true}}); if(key==='phone'&&verifData.phoneNum)setProfileData(p=>({...p,phone:verifData.phoneNum})); closeVerif(); };
  const [deleteConfirm, setDeleteConfirm] = React.useState(null);
  const [shareCopied, setShareCopied] = React.useState(false);
  const [gradeBarWidth, setGradeBarWidth] = React.useState(0);
  const [qrItem, setQrItem] = React.useState(null);
  const [calItem, setCalItem] = React.useState(null);
  const [gradeTooltip, setGradeTooltip] = React.useState(null);
  const [profileData, setProfileData] = React.useState({
    name: userName,
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
    notifEmail: true,
    notifPush: true,
  });

  React.useEffect(() => {
    if (tab === 'grade') {
      setGradeBarWidth(0);
      const tid = setTimeout(() => setGradeBarWidth(getDivision(user.rentals||0).prog), 80);
      return () => clearTimeout(tid);
    }
  }, [tab]);

  const isMyItem = i => i.owner?.id === user.id || (user.email && i.owner?.email === user.email);
  const myOwnedItems = (state.items?.filter(isMyItem) || []);
  const myUserItems = (state.userItems?.filter(isMyItem) || []);
  // Enrichir avec likeCount depuis cloudItems (mis à jour par Firestore)
  const withLikes = arr => arr.map(i => {const cloud=(state.cloudItems||[]).find(c=>c.id===i.id);return cloud&&cloud.likeCount?{...i,likeCount:cloud.likeCount}:i;});
  const listings = withLikes([...myOwnedItems, ...myUserItems]);
  const allItems = [...(state.items||[]), ...(state.proItems||[]), ...(state.userItems||[]), ...(state.cloudItems||[])];
  const favItems = allItems.filter(i => state.favorites && state.favorites.has(i.id));
  const favs = state.favorites || new Set();
  const isUserPro = user.isPro;
  const myProItems = listings.filter(i => i.isPro);
  const heroGrade = getGrade(user.rentals || 0);
  const isHeroFondateur = heroGrade.id === 'fondateur';
  const reviewCount = state.reviews.length;
  const avgRating = reviewCount > 0 ? (state.reviews.reduce((s,r)=>s+r.rating,0)/reviewCount).toFixed(1) : '-';
  const [followerCount, setFollowerCount] = React.useState(0);
  React.useEffect(()=>{
    if(!window.db)return;
    const queries=[];
    if(user.id)queries.push(window.db.collection('follows').where('followedId','==',user.id).get());
    if(user.email)queries.push(window.db.collection('follows').where('followedEmail','==',user.email).get());
    if(!queries.length)return;
    Promise.all(queries).then(snaps=>{
      const ids=new Set();
      snaps.forEach(s=>s.docs.forEach(d=>ids.add(d.id)));
      setFollowerCount(ids.size);
    }).catch(()=>{});
  },[user.id,user.email]);

  const displayListings = listings;

  const proParc = [
    {id:'eq1',title:'Nacelle élévatrice 12m',cat:'tools',price:120,status:'available',rentals:34,icon:'🏗️'},
    {id:'eq2',title:'Mini-pelle 1.5T',cat:'tools',price:180,status:'rented',rentals:28,icon:'⛏️'},
    {id:'eq3',title:'Groupe électrogène 5kVA',cat:'tools',price:45,status:'available',rentals:67,icon:'⚡'},
    {id:'eq4',title:'Échafaudage complet 10m',cat:'tools',price:65,status:'maintenance',rentals:19,icon:'🔧'},
    {id:'eq5',title:'Flotte 10 vélos élec.',cat:'vehicles',price:150,status:'available',rentals:52,icon:'🚴'},
    {id:'eq6',title:'Sono complète 2000W',cat:'events',price:80,status:'rented',rentals:41,icon:'🎵'},
  ];
  const tabs = [
    { id: 'annonces', label: 'Annonces', icon: '🏷️', count: displayListings.length || 0 },
    ...(isUserPro ? [{ id: 'parc', label: 'Mon Parc', icon: '🏗️', count: myProItems.length }] : []),
    { id: 'reservations', label: 'Réservations', icon: '📅', count: state.bookings.filter(b=>b.userId===user.id||b.ownerId===user.id).length },
    { id: 'avis', label: 'Avis', icon: '⭐', count: state.reviews.length },
    { id: 'favoris', label: 'Favoris', icon: '❤️', count: favItems.length },
    { id: 'abonnements', label: 'Abonnements', icon: '👥', count: (state.following||[]).length||null },
    { id: 'grade', label: 'Mon Grade', icon: '🏅', count: null },
    { id: 'parametres', label: 'Paramètres', icon: '⚙️', count: null },
  ];

  const S = {
    page: {
      maxWidth: '100%', margin: '0 auto', paddingBottom: 100,
      background: 'var(--bg)', minHeight: '100vh',
    },

    // Header block : dégradé pleine largeur avec fondu bas vers blanc
    headerBlock: {
      position: 'relative',
      background: 'linear-gradient(150deg,#1a0533 0%,#3d2fa0 40%,#6C63FF 75%,#4ECDC4 100%)',
      paddingTop: 32,
      paddingBottom: 80,
      textAlign: 'center',
      overflow: 'hidden',
    },
    headerFade: {
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
      background: 'linear-gradient(to bottom,transparent,var(--bg))',
      pointerEvents: 'none',
    },
    headerDots: {
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.07) 1px,transparent 1px)',
      backgroundSize: '28px 28px',
    },
    headerTopRow: {
      position: 'relative', zIndex: 2,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 16px', marginBottom: 20,
    },

    // Avatar centré
    avatarWrap: {
      position: 'relative', zIndex: 2,
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
    },
    avatarRing: {
      borderRadius: '50%',
      background: isHeroFondateur ? 'linear-gradient(135deg,#D4AF37,#FFD700,#B8860B)' : 'rgba(255,255,255,0.25)',
      padding: isHeroFondateur ? 3 : 3,
      boxShadow: isHeroFondateur ? '0 0 0 4px rgba(212,175,55,0.4),0 12px 40px rgba(0,0,0,0.4)' : '0 0 0 4px rgba(255,255,255,0.3),0 12px 40px rgba(0,0,0,0.3)',
      animation: isHeroFondateur ? 'fondateurBorder 2.5s ease-in-out infinite' : 'none',
      display: 'inline-flex', position: 'relative',
    },
    avatar: {
      width: 100, height: 100, borderRadius: '50%',
      background: 'linear-gradient(135deg,#e0dbff,#c7f0ee)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 40, overflow: 'hidden', position: 'relative',
    },
    verifiedBadge: {
      position: 'absolute', bottom: 2, right: 2,
      width: 28, height: 28, borderRadius: '50%',
      background: isHeroFondateur ? 'linear-gradient(135deg,#D4AF37,#FFD700)' : '#10b981',
      border: '3px solid var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, color: 'white', fontWeight: 900,
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    },

    // Nom + infos sous l'avatar
    name: {
      fontSize: 24, fontWeight: 900, color: 'white',
      margin: '14px 0 4px', letterSpacing: -0.5, textShadow: '0 2px 12px rgba(0,0,0,0.2)',
    },
    gradeBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.25)', borderRadius: 20,
      padding: '4px 12px', fontSize: 12, color: 'white', fontWeight: 700,
      margin: '0 0 10px',
    },
    ratingRow: {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      marginBottom: 12,
    },

    // Stats — 3 colonnes séparées flottantes
    statsFloat: {
      display: 'flex', justifyContent: 'center', gap: 10,
      padding: '0 16px', marginTop: -48, marginBottom: 16,
      position: 'relative', zIndex: 5,
    },
    statCard: {
      flex: 1, maxWidth: 110,
      background: 'var(--w)', borderRadius: 16,
      padding: '14px 8px', textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.10)', border: '1px solid var(--bd)',
    },
    statNum: { fontSize: 22, fontWeight: 900, color: 'var(--dk)', display: 'block', lineHeight: 1 },
    statLbl: { fontSize: 10, color: 'var(--g)', marginTop: 4, display: 'block', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 },

    // Pills sous les stats
    pillsRow: {
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 7,
      padding: '0 16px', marginBottom: 16,
    },
    pill: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'var(--w)', borderRadius: 20, padding: '5px 12px',
      fontSize: 12, color: 'var(--dk)', fontWeight: 500, border: '1px solid var(--bd)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    },
    pillGreen: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#f0fdf4', borderRadius: 20, padding: '5px 12px',
      fontSize: 12, color: '#059669', fontWeight: 600,
      border: '1px solid #bbf7d0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    },
    pillPurple: {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#f5f3ff', borderRadius: 20, padding: '5px 12px',
      fontSize: 12, color: 'var(--p)', fontWeight: 600,
      border: '1px solid #ddd6fe', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    },

    // Bio card
    bioCard: {
      margin: '0 16px 16px', background: 'var(--w)', borderRadius: 16,
      padding: '14px 16px', border: '1px solid var(--bd)',
      fontSize: 14, color: 'var(--g)', lineHeight: 1.65,
    },

    // Boutons d'action
    heroActions: { display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 0 },
    btnEdit: {
      padding: '9px 20px', borderRadius: 22, fontSize: 13, fontWeight: 700,
      background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)',
      color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
      backdropFilter: 'blur(8px)', boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    },
    btnShare: {
      padding: '9px 14px', borderRadius: 22, fontSize: 15,
      background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)',
      color: 'white', cursor: 'pointer',
      backdropFilter: 'blur(8px)', boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    },

    // Trust row
    trustRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 7, padding: '0 16px', marginBottom: 20 },

    // Tabs
    tabsWrap: {
      background: 'var(--w)',
      margin: '0',
      width: '100%',
      borderTop: '1px solid var(--bd)',
      borderBottom: '1px solid var(--bd)',
      position: 'sticky', top: 72, zIndex: 30,
      overflowX: 'auto',
    },
    tabsInner: {
      display: 'flex',
      justifyContent: 'center',
      minWidth: 'max-content',
      margin: '0 auto',
    },
    tab: (active) => ({
      flex: 'none', padding: '13px 16px', fontSize: 12, fontWeight: active ? 700 : 500,
      color: active ? 'var(--p)' : 'var(--g)',
      cursor: 'pointer', whiteSpace: 'nowrap',
      display: 'flex', alignItems: 'center', gap: 5,
      transition: 'color 0.15s',
      background: 'none', border: 'none',
      borderBottom: active ? '2.5px solid var(--p)' : '2.5px solid transparent',
    }),
    tabCount: (active) => ({
      fontSize: 10, fontWeight: 700,
      background: active ? 'rgba(108,99,255,0.12)' : 'var(--bgw)',
      color: active ? 'var(--p)' : 'var(--gl)',
      borderRadius: 10, padding: '1px 6px', minWidth: 18, textAlign: 'center',
    }),

    // Content
    content: { padding: '20px 16px', background: 'var(--bg)', minHeight: 300 },

    // Cards
    card: {
      background: 'var(--w)', borderRadius: 16,
      border: '1px solid var(--bd)',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden', marginBottom: 12,
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'pointer',
    },
    listingGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
    listingImg: {
      height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 40, background: 'var(--bgw)',
    },
    listingBody: { padding: '10px 12px 12px' },
    listingTitle: { fontSize: 13, fontWeight: 700, color: 'var(--dk)', margin: '0 0 4px' },
    listingPrice: { fontSize: 14, fontWeight: 800, color: 'var(--p)', margin: 0 },
    listingRating: { fontSize: 11, color: 'var(--g)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 },

    // Empty state
    empty: {
      textAlign: 'center', padding: '48px 24px',
      background: 'var(--w)', borderRadius: 20,
      border: '2px dashed var(--bd)',
    },
    emptyIllus: { fontSize: 56, marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: 700, color: 'var(--dk)', margin: '0 0 8px' },
    emptyText: { fontSize: 14, color: 'var(--g)', margin: '0 0 24px', lineHeight: 1.6 },
    btnPrimary: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '13px 24px', borderRadius: 14, fontSize: 14, fontWeight: 700,
      background: 'linear-gradient(135deg,#6C63FF,#8b5cf6)', color: 'white',
      border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,99,255,0.35)',
      transition: 'transform 0.15s, box-shadow 0.15s',
    },
    suggestions: {
      display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20,
    },
    suggestionChip: {
      padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
      background: '#f5f3ff', color: '#6C63FF', border: '1px solid #ddd6fe',
      cursor: 'pointer',
    },

    // Reservation card
    resCard: {
      background: 'var(--w)', borderRadius: 16, border: '1px solid var(--bd)',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)', padding: '16px',
      marginBottom: 10, display: 'flex', gap: 14, alignItems: 'flex-start',
    },
    resImgBox: {
      width: 52, height: 52, borderRadius: 12,
      background: 'var(--bgw)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 24, flexShrink: 0,
    },
    resInfo: { flex: 1 },
    resTitle: { fontSize: 14, fontWeight: 700, color: 'var(--dk)', margin: '0 0 3px' },
    resMeta: { fontSize: 12, color: 'var(--g)', margin: '0 0 8px' },
    resFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    resBadge: (color, bg) => ({
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
      background: bg, color: color,
    }),
    resPrice: { fontSize: 15, fontWeight: 800, color: 'var(--dk)' },

    // Reviews
    ratingHero: {
      background: 'var(--w)', borderRadius: 20, padding: '24px',
      border: '1px solid var(--bd)', boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      marginBottom: 16, display: 'flex', gap: 24, alignItems: 'center',
    },
    ratingBig: { fontSize: 52, fontWeight: 900, color: 'var(--dk)', lineHeight: 1 },
    ratingStars: { fontSize: 18, color: '#f59e0b', letterSpacing: 2 },
    ratingTotal: { fontSize: 13, color: 'var(--g)', marginTop: 4 },
    barRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 },
    barLabel: { fontSize: 12, color: 'var(--g)', width: 12, textAlign: 'right' },
    barTrack: { flex: 1, height: 6, background: 'var(--bgw)', borderRadius: 3, overflow: 'hidden' },
    barFill: (w) => ({ width: w, height: '100%', background: '#f59e0b', borderRadius: 3 }),
    reviewCard: {
      background: 'var(--w)', borderRadius: 16, padding: '16px',
      border: '1px solid var(--bd)', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 10,
    },
    reviewTop: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 },
    reviewAvatar: (color) => ({
      width: 40, height: 40, borderRadius: '50%',
      background: color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0,
    }),
    reviewName: { fontSize: 14, fontWeight: 700, color: 'var(--dk)' },
    reviewDate: { fontSize: 12, color: 'var(--g)' },
    reviewText: { fontSize: 13, color: 'var(--g)', lineHeight: 1.65, margin: 0 },

    // Favs
    favCard: {
      background: 'var(--w)', borderRadius: 16, border: '1px solid var(--bd)',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden',
    },
    favImg: {
      height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 38, background: 'var(--bgw)', position: 'relative',
    },
    favHeart: {
      position: 'absolute', top: 8, right: 8,
      width: 28, height: 28, borderRadius: '50%',
      background: 'rgba(255,255,255,0.9)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: 13,
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    },
    favBody: { padding: '10px 12px 12px' },
    favTitle: { fontSize: 13, fontWeight: 700, color: 'var(--dk)', margin: '0 0 2px' },
    favOwner: { fontSize: 11, color: 'var(--g)', margin: '0 0 6px' },
    favBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    favPrice: { fontSize: 14, fontWeight: 800, color: 'var(--p)' },
    favRating: { fontSize: 11, color: 'var(--g)', display: 'flex', alignItems: 'center', gap: 2 },

    // Settings
    settingsSection: { marginBottom: 24 },
    sectionTitle: { fontSize: 11, fontWeight: 700, color: 'var(--dk)', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 10px', opacity:0.6 },
    fieldCard: {
      background: 'var(--w)', borderRadius: 14, border: '1px solid var(--bd)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden',
    },
    fieldRow: {
      padding: '14px 16px', borderBottom: '1px solid var(--bd)',
      display: 'flex', flexDirection: 'column', gap: 2,
    },
    fieldLabel: { fontSize: 11, color: 'var(--g)', fontWeight: 700, textTransform:'uppercase', letterSpacing:'.04em' },
    fieldInput: {
      border: 'none', outline: 'none', fontSize: 14, color: 'var(--dk)',
      background: 'transparent', padding: 0, width: '100%', fontFamily: 'inherit', fontWeight: 500,
    },
    toggleCard: {
      background: 'var(--w)', borderRadius: 14, border: '1px solid var(--bd)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden', marginBottom: 8,
    },
    toggleRow: {
      padding: '14px 16px', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      borderBottom: '1px solid var(--bd)',
    },
    toggleInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
    toggleTitle: { fontSize: 14, fontWeight: 600, color: 'var(--dk)' },
    toggleSub: { fontSize: 12, color: 'var(--g)' },
    toggle: (on) => ({
      width: 46, height: 26, borderRadius: 13, position: 'relative',
      background: on ? '#6C63FF' : '#d1d5db', cursor: 'pointer', transition: 'background 0.2s',
      flexShrink: 0,
    }),
    toggleKnob: (on) => ({
      position: 'absolute', top: 3, left: on ? 23 : 3,
      width: 20, height: 20, borderRadius: '50%',
      background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      transition: 'left 0.2s',
    }),
    savBtn: {
      width: '100%', padding: '15px', borderRadius: 14,
      background: 'linear-gradient(135deg,#6C63FF,#8b5cf6)',
      border: 'none', color: 'white', fontSize: 15, fontWeight: 700,
      cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,99,255,0.3)', marginBottom: 10,
    },
    logoutBtn: {
      width: '100%', padding: '15px', borderRadius: 14,
      background: 'var(--w)', border: '2px solid #fecaca',
      color: '#ef4444', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    },
  };

  const StarRow = ({n=5}) => (
    <span style={{color:'#f59e0b',fontSize:14,letterSpacing:1}}>
      {'★'.repeat(n)}{'☆'.repeat(5-n)}
    </span>
  );

  return (
    <div className="prf-dsk-wrap profile-page-grain">

      {/* ── Desktop sidebar ── */}
      <aside className="prf-sb">
        <div className="prf-avc">
          <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(255,255,255,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:800,color:'#fff',position:'relative',flexShrink:0}}>
            {(profileData.name||'N')[0].toUpperCase()}
            <div style={{position:'absolute',width:14,height:14,borderRadius:'50%',background:'#22C55E',border:'2.5px solid #fff',top:-1,right:-1}}/>
          </div>
          <div style={{fontSize:16,fontWeight:700,color:'#fff',textAlign:'center'}}>{profileData.name||'Utilisateur'}</div>
          <div style={{background:'rgba(255,255,255,.2)',borderRadius:100,padding:'4px 16px',fontSize:11,fontWeight:700,color:'#fff'}}>{heroGrade.icon} {heroGrade.name}</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,.7)',textAlign:'center'}}>Membre depuis {user.since||'2024'}</div>
        </div>
        {[{num:listings.length,lbl:'Annonces'},{num:avgRating!=='-'?avgRating+' ⭐':'-',lbl:'Note moy.'},{num:(state.bookings?.filter(b=>b.userId===user.id)?.length||0)+' locations',lbl:'Réservations'}].map(s=>(
          <div key={s.lbl} className="prf-stb">
            <strong style={{fontSize:20,fontWeight:800,color:'#5B4EE8'}}>{s.num}</strong>
            <span style={{fontSize:12,color:'#8F8CA6'}}>{s.lbl}</span>
          </div>
        ))}
        {[{id:'annonces',icon:'📋',lbl:'Mes annonces'},{id:'reservations',icon:'🗓',lbl:'Réservations'},{id:'avis',icon:'⭐',lbl:'Avis reçus'},{id:'favoris',icon:'❤️',lbl:'Favoris'},{id:'grade',icon:'🏅',lbl:'Mon Grade'},{id:'parametres',icon:'⚙️',lbl:'Paramètres'}].map(item=>(
          <div key={item.id} className={'prf-nv'+(tab===item.id?' on':'')} onClick={()=>setTab(item.id)}>
            <span style={{fontSize:18}}>{item.icon}</span>
            <span>{item.lbl}</span>
          </div>
        ))}
      </aside>

      {/* ── Main area ── */}
      <div className="prf-main">

      {/* Mobile-only: gradient header, stats, pills, tabs */}
      <div className="prf-mob">

      {/* ─── HEADER BLOCK ─── */}
      <div style={S.headerBlock}>
        <div style={S.headerDots}/>
        {/* Ligne du haut : vide à gauche, boutons à droite */}
        <div style={S.headerTopRow}>
          <div/>
          <div style={{display:'flex',gap:8}}>
            <button onClick={() => setTab('parametres')} style={S.btnEdit}>✏️ Modifier</button>
            <button style={{...S.btnShare,position:'relative'}} onClick={()=>{const url=window.location.href;if(navigator.share){navigator.share({title:'Cercle',url}).catch(()=>{})}else{navigator.clipboard.writeText(url).then(()=>{setShareCopied(true);setTimeout(()=>setShareCopied(false),2000);}).catch(()=>{});}}} title="Partager">{shareCopied?<span style={{fontSize:10,fontWeight:700,color:'#10b981'}}>Copié ✓</span>:'↗'}</button>
          </div>
        </div>

        {/* Avatar centré */}
        <div style={{position:'relative',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div style={S.avatarRing}>
            <input ref={avatarInputRef} type="file" accept="image/*" capture="user" style={{display:'none'}} onChange={handleAvatarChange}/>
            <div className="avatar-edit-wrap" onClick={()=>avatarInputRef.current&&avatarInputRef.current.click()} title="Changer la photo de profil">
              <div style={S.avatar}>
                {user.avatarUrl
                  ? <img src={user.avatarUrl} style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}} alt="avatar"/>
                  : (userAvatar || '👤')}
                <div style={S.verifiedBadge}>{isHeroFondateur?'👑':'✓'}</div>
              </div>
              <div className="avatar-edit-badge">📷</div>
            </div>
            {user.isPro && <div className="pro-avatar-badge">PRO</div>}
          </div>

          <h2 style={S.name}>{profileData.name}</h2>

          <div style={S.gradeBadge}>
            <span>{heroGrade.icon}</span>
            <span>{heroGrade.name}</span>
            {isHeroFondateur && <span style={{marginLeft:2}}>👑</span>}
          </div>

          <div style={S.ratingRow}>
            <StarRow n={5}/>
            <span style={{fontSize:14,fontWeight:800,color:'white'}}>{avgRating}</span>
            <span style={{fontSize:13,color:'rgba(255,255,255,0.65)'}}>· {reviewCount} avis</span>
          </div>
        </div>
        <div style={S.headerFade}/>
      </div>

      {/* ─── STATS FLOTTANTES ─── */}
      <div style={S.statsFloat}>
        {[
          {num: listings.length || 0, lbl: 'Annonces', icon: '🏷️'},
          {num: reviewCount, lbl: 'Avis', icon: '⭐'},
          {num: followerCount, lbl: 'Abonnés', icon: '👥'},
        ].map(s => (
          <div key={s.lbl} style={S.statCard}>
            <span style={{fontSize:18,display:'block',marginBottom:4}}>{s.icon}</span>
            <strong style={S.statNum}>{s.num}</strong>
            <span style={S.statLbl}>{s.lbl}</span>
          </div>
        ))}
      </div>

      {/* ─── BADGES / PILLS ─── */}
      <div style={S.pillsRow}>
        {user.verified && <span style={S.pillGreen}>✓ Identité vérifiée</span>}
        {(user.superHost || (state.reviews.length >= 10 && (state.reviews.reduce((s,r)=>s+r.rating,0)/state.reviews.length) >= 4.5)) && <span style={S.pillPurple}>🏅 Super hôte</span>}
        {(user.city||user.location)&&<span style={S.pill}>📍 {user.city||user.location}</span>}
        {user.since&&<span style={S.pill}>🗓️ Membre depuis {user.since}</span>}
        {followerCount>0&&<span style={S.pill}>👥 {followerCount} abonné{followerCount>1?'s':''}</span>}
      </div>

      {/* ─── BIO ─── */}
      {profileData.bio && <div style={S.bioCard}>{profileData.bio}</div>}

      {/* ─── TRUST ─── */}
      <div style={S.trustRow}>
        <span style={S.pill}>⚡ Répond en &lt;1h</span>
        <span style={S.pill}>🔒 Paiement sécurisé</span>
        <span style={S.pill}>🛡️ Caution assurée</span>
      </div>

      {/* ─── TABS ─── */}
      <div style={S.tabsWrap}>
        <div style={S.tabsInner}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{...S.tab(tab===t.id), outline:'none',
                borderTop:'none', borderLeft:'none', borderRight:'none'}}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.count !== null && <span style={S.tabCount(tab===t.id)}>{t.count}</span>}
            </button>
          ))}
        </div>
      </div>

      </div>{/* end prf-mob */}

      {/* Desktop content header */}
      <div className="prf-cnthd">
        <span style={{fontSize:22,fontWeight:700,color:'var(--dk)',fontFamily:'var(--f)'}}>{tabs.find(t=>t.id===tab)?.icon} {tabs.find(t=>t.id===tab)?.label}</span>
        {tab==='annonces'&&<button onClick={()=>setPage('create')} style={{background:'linear-gradient(135deg,#5B4EE8,#2E1FC2)',color:'#fff',border:'none',borderRadius:100,height:44,padding:'0 24px',fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 12px rgba(91,79,232,.28)',fontFamily:'var(--f)'}}>+ Nouvelle annonce</button>}
      </div>

      {/* ─── CONTENT ─── */}
      <div key={tab} style={{...S.content, animation:'fadeSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both'}}>

        {/* ── Annonces ── */}
        {tab === 'annonces' && (
          <div style={displayListings.length===0?{textAlign:'center',padding:'48px 20px',color:'#9ca3af'}:S.listingGrid}>
            {displayListings.length===0&&<><div style={{fontSize:44,marginBottom:12}}>🏷️</div><p style={{fontWeight:700,color:'#374151',fontSize:15,marginBottom:4}}>Aucune annonce pour l'instant</p><p style={{fontSize:13}}>Publie ta première annonce pour commencer à louer !</p></>}
            {displayListings.map((l, i) => (
              <div key={l.id} className="prof-listing-card" style={{...S.card, animation:'fadeSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay:`${i*0.07}s`}} onClick={() => { setSelected && setSelected(l); }}>
                <div style={{...S.listingImg,padding:0,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bgw)'}}>
                  {l.images&&l.images[0]
                    ?<img src={l.images[0]} alt={l.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                    :<span style={{fontSize:32}}>{l.img||'📦'}</span>}
                </div>
                <div style={S.listingBody}>
                  <p style={S.listingTitle}>{l.title}</p>
                  <p style={S.listingPrice}>{l.price}€<span style={{fontWeight:400,fontSize:11,color:'var(--g)'}}>/jour</span></p>
                  <div style={S.listingRating}>⭐ {l.rating || '4.8'} <span>· {l.reviews || 0} avis{(l.likeCount||0)>0?` · ❤️ ${l.likeCount}`:''}</span></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginTop:8}}>
                    <button onClick={e=>{e.stopPropagation();onEditItem&&onEditItem(l);}} style={{padding:'6px 0',border:'1.5px solid #d1fae5',borderRadius:10,background:'#f0fdf4',color:'#059669',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:3}}>✏️ Modifier</button>
                    <button onClick={e=>{e.stopPropagation();setCalItem(l);}} style={{padding:'6px 0',border:'1.5px solid #bfdbfe',borderRadius:10,background:'#eff6ff',color:'#2563eb',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:3}}>📅 Dates</button>
                    <button onClick={e=>{e.stopPropagation();setQrItem(l);}} style={{padding:'6px 0',border:'1.5px solid #d1c9ff',borderRadius:10,background:'#f5f3ff',color:'#6C63FF',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:3}}>📱 QR</button>
                    {deleteConfirm===l.id
                      ?<div style={{display:'flex',gap:3,gridColumn:'span 2'}}>
                          <button onClick={e=>{e.stopPropagation();dispatch({type:'DELETE_ITEM',id:l.id});setDeleteConfirm(null);}} style={{flex:1,padding:'6px 0',border:'none',borderRadius:10,background:'#ef4444',color:'#fff',fontSize:11,fontWeight:700,cursor:'pointer'}}>Confirmer</button>
                          <button onClick={e=>{e.stopPropagation();setDeleteConfirm(null);}} style={{flex:1,padding:'6px 0',border:'1.5px solid var(--bd)',borderRadius:10,background:'var(--w)',color:'var(--dk)',fontSize:11,fontWeight:700,cursor:'pointer'}}>Annuler</button>
                        </div>
                      :<button onClick={e=>{e.stopPropagation();setDeleteConfirm(l.id);}} style={{padding:'6px 0',border:'1.5px solid #fecaca',borderRadius:10,background:'#fff1f2',color:'#ef4444',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:3}}>🗑️ Supp.</button>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {qrItem&&<QRModal item={qrItem} onClose={()=>setQrItem(null)}/>}
        {calItem&&<CalendarModal item={calItem} dispatch={dispatch} onClose={()=>setCalItem(null)}/>}

        {/* ── Mon Parc (Pro only) ── */}
        {tab === 'parc' && (
          <div>
            <p style={{fontSize:13,color:'var(--g)',margin:'0 0 16px',fontWeight:500}}>{myProItems.length} équipement{myProItems.length!==1?'s':''} dans votre parc professionnel</p>
            {myProItems.length === 0 ? (
              <div style={{textAlign:'center',padding:'48px 20px',color:'#9ca3af'}}>
                <div style={{fontSize:44,marginBottom:12}}>🏗️</div>
                <p style={{fontWeight:700,color:'#374151',fontSize:15,marginBottom:4}}>Aucun équipement Pro</p>
                <p style={{fontSize:13}}>Publiez une annonce en mode Professionnel pour l'ajouter ici.</p>
              </div>
            ) : (
              <div style={S.listingGrid}>
                {myProItems.map((l, i) => (
                  <div key={l.id} className="prof-listing-card" style={{...S.card,border:'2px solid #2563EB22',animation:'fadeSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:`${i*0.07}s`}} onClick={() => { setSelected && setSelected(l); }}>
                    <div style={{...S.listingImg,background:'linear-gradient(135deg,#dbeafe,#eff6ff)'}}>
                      {l.images&&l.images[0]?<img src={l.images[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:(l.img||'🏗️')}
                    </div>
                    <div style={S.listingBody}>
                      <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:4}}>
                        <span style={{fontSize:9,fontWeight:700,color:'#2563EB',background:'#dbeafe',padding:'2px 6px',borderRadius:4}}>PRO</span>
                      </div>
                      <p style={S.listingTitle}>{l.title}</p>
                      <p style={S.listingPrice}>{l.price}€<span style={{fontWeight:400,fontSize:11,color:'var(--g)'}}>/jour</span></p>
                      <div style={S.listingRating}>⭐ {l.rating||'—'} <span>· {l.reviews||0} avis</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Réservations ── */}
        {tab === 'reservations' && (()=>{
          const userBookings=state.bookings.filter(b=>b.userId===user.id||b.ownerId===user.id);
          const statusMap={confirmed:{label:'Confirmée',color:'#10b981',bg:'#d1fae5'},cancelled:{label:'Annulée',color:'#ef4444',bg:'#fee2e2'}};
          return <div>
            <p style={{fontSize:13,color:'var(--g)',margin:'0 0 16px',fontWeight:500}}>{userBookings.length} réservation{userBookings.length!==1?'s':''} au total</p>
            {userBookings.length===0?<div style={{textAlign:'center',padding:'40px 0'}}><span style={{fontSize:40}}>📅</span><p style={{fontWeight:700,color:'#374151',fontSize:15,marginTop:12}}>Aucune réservation pour l'instant</p></div>:
            userBookings.map((b, i) => {
              const sm=statusMap[b.status]||{label:'En cours',color:'#3b82f6',bg:'#dbeafe'};
              const other=b.userId===user.id?b.ownerName:b.ownerName;
              return <div key={b.id} style={{...S.resCard, animation:'fadeSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay:`${i*0.07}s`}}>
                <div style={{...S.resImgBox,overflow:'hidden',padding:0}}>
                  {b.itemImg
                    ? <img src={b.itemImg} alt={b.itemTitle} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:12}}/>
                    : <span style={{fontSize:24}}>📦</span>}
                </div>
                <div style={S.resInfo}>
                  <p style={S.resTitle}>{b.itemTitle}</p>
                  <p style={S.resMeta}>📅 {b.startDate} – {b.endDate} · avec {other}</p>
                  <div style={S.resFooter}>
                    <span className="prof-badge-pulse" style={{...S.resBadge(sm.color,sm.bg),animationDelay:`${i*0.1+0.3}s`}}>{sm.label}</span>
                    <span style={S.resPrice}>{b.total} €</span>
                  </div>
                </div>
              </div>;
            })}
          </div>;
        })()}

        {/* ── Avis ── */}
        {tab === 'avis' && (
          <div>
            {reviewCount===0?<div style={{textAlign:'center',padding:'40px 0'}}><span style={{fontSize:44}}>⭐</span><p style={{fontWeight:700,color:'#374151',fontSize:16,marginTop:12}}>Aucun avis pour l'instant</p><p style={{fontSize:13,color:'#9ca3af',marginTop:4}}>Tes premiers avis apparaîtront ici après tes locations.</p></div>:<>
            <div style={S.ratingHero}>
              <div style={{textAlign:'center'}}>
                <div style={S.ratingBig}>{avgRating}</div>
                <div style={S.ratingStars}>{'★'.repeat(Math.round(parseFloat(avgRating)||0))}{'☆'.repeat(5-Math.round(parseFloat(avgRating)||0))}</div>
                <div style={S.ratingTotal}>{reviewCount} avis</div>
              </div>
              <div style={{flex:1}}>
                {[5,4,3,2,1].map(n => {
                  const cnt=state.reviews.filter(r=>Math.round(r.rating)===n).length;
                  const pct=reviewCount>0?Math.round(cnt/reviewCount*100)+'%':'0%';
                  return <div key={n} style={S.barRow}>
                    <span style={S.barLabel}>{n}</span>
                    <div style={S.barTrack}><div style={S.barFill(pct)}/></div>
                    <span style={{fontSize:11,color:'#9ca3af',width:24}}>{cnt}</span>
                  </div>;
                })}
              </div>
            </div>
            {(()=>{const colors=['#8b5cf6','#3b82f6','#10b981','#f59e0b','#06b6d4'];return state.reviews.map((r,i)=>{
              const initials=(r.fromUserName||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
              const dateStr=r.createdAt?new Date(r.createdAt).toLocaleDateString('fr-FR',{month:'short',year:'numeric'}):'';
              return <div key={r.id} style={{...S.reviewCard,animation:'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:`${i*0.08}s`}}>
                <div style={S.reviewTop}>
                  <div style={S.reviewAvatar(colors[i%colors.length])}>{initials}</div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={S.reviewName}>{r.fromUserName}</span>
                      <span style={{fontSize:12,letterSpacing:1}}>{Array.from({length:r.rating}).map((_,si)=><span key={si} style={{color:'#f59e0b',display:'inline-block',animation:'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:`${i*0.08+si*0.06}s`}}>★</span>)}</span>
                    </div>
                    <div style={S.reviewDate}>{dateStr}</div>
                  </div>
                </div>
                <p style={S.reviewText}>"{r.text}"</p>
              </div>;
            });})()}
          </>}
          </div>
        )}

        {/* ── Abonnements ── */}
        {tab === 'abonnements' && (
          <div>
            <p style={{fontSize:13,color:'var(--g)',margin:'0 0 16px',fontWeight:500}}>{(state.following||[]).length} abonnement{(state.following||[]).length!==1?'s':''}</p>
            {(state.following||[]).length===0
              ? <div style={{textAlign:'center',padding:'40px 0'}}><span style={{fontSize:40}}>👥</span><p style={{fontWeight:700,color:'#374151',fontSize:15,marginTop:12}}>Aucun abonnement</p><p style={{fontSize:13,color:'#9ca3af',marginTop:4}}>Suivez des propriétaires depuis leurs annonces.</p></div>
              : (state.following||[]).map((f,i)=>(
                <div key={f.id} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',background:'var(--w)',borderRadius:16,border:'1px solid var(--bd)',marginBottom:10,boxShadow:'0 1px 6px rgba(0,0,0,0.05)',animation:'fadeSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:`${i*0.07}s`}}>
                  <div style={{width:48,height:48,borderRadius:'50%',background:'linear-gradient(135deg,#ede9fe,#ddd6fe)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>{f.avatar||'👤'}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,color:'var(--dk)'}}>{f.name}</div>
                    {f.since&&<div style={{fontSize:11,color:'var(--g)',marginTop:2}}>Membre depuis {f.since}</div>}
                  </div>
                  <button onClick={()=>dispatch({type:'UNFOLLOW',userId:f.id})} style={{padding:'6px 14px',borderRadius:20,border:'1.5px solid #e5e7eb',background:'var(--bg)',color:'var(--g)',fontSize:11,fontWeight:700,cursor:'pointer'}}>Se désabonner</button>
                </div>
              ))
            }
          </div>
        )}

        {/* ── Favoris ── */}
        {tab === 'favoris' && (
          <div key="favoris">
            {favItems.length === 0 ? (
              <div style={{textAlign:'center',padding:'48px 20px',color:'#9ca3af'}}>
                <div style={{fontSize:44,marginBottom:12,animation:'float 3s ease-in-out infinite'}}>❤️</div>
                <p style={{fontWeight:700,color:'#374151',fontSize:15,marginBottom:4}}>Aucun favori pour l'instant</p>
                <p style={{fontSize:13}}>Likez des annonces pour les retrouver ici</p>
              </div>
            ) : (
              <div style={S.listingGrid}>
                {favItems.map((f, i) => (
                  <div key={f.id} className="prof-fav-card" style={{...S.favCard, animation:'fadeSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay:`${i*0.07}s`, cursor:'pointer'}} onClick={()=>{setSelected&&setSelected(f);}}>
                    <div style={{...S.favImg, fontSize:0}}>
                      <img src={f.images&&f.images[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      <div style={{...S.favHeart, animation:'float 3s ease-in-out infinite', animationDelay:`${i*0.3}s`}}>❤️</div>
                      {f.owner?.verified && <div style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,0.5)',color:'#fff',borderRadius:6,padding:'2px 6px',fontSize:11,fontWeight:700}}>✓</div>}
                    </div>
                    <div style={S.favBody}>
                      <p style={S.favTitle}>{f.title}</p>
                      <p style={S.favOwner}>par {f.owner?.name||'Propriétaire'}</p>
                      <div style={S.favBottom}>
                        <span style={S.favPrice}>{f.price}€<span style={{fontWeight:400,fontSize:11,color:'#9ca3af'}}>/j</span></span>
                        <span style={S.favRating}>⭐ {f.rating} <span style={{color:'#d1d5db'}}>·</span> {f.reviews}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Grade ── */}
        {tab === 'grade' && (() => {
          const rentals = user.rentals || 0;
          const currentGradeIdx = GRADES.reduce((acc, g, i) => rentals >= g.min ? i : acc, 0);
          const currentGrade = GRADES[currentGradeIdx];
          const nextGrade = GRADES[currentGradeIdx + 1];
          const fromMin = currentGrade.min;
          const toMin = nextGrade ? nextGrade.min : fromMin + 1;
          const progressPct = nextGrade ? Math.min(100, ((rentals - fromMin) / (toMin - fromMin)) * 100) : 100;
          const grade = currentGrade;
          const next = nextGrade;
          const {div, nextDiv, prog: divProg} = getDivision(rentals);
          const GC = { voisin:'#6b7280', habitant:'#3b82f6', pilier:'#F59E0B', gardien:'#7C3AED', legende:'#06B6D4', fondateur:'#D4AF37' };
          const isFondateur = grade.id === 'fondateur';
          const gc = GC[grade.id] || '#6C63FF';
          const gcLight = gc + '20';
          const fullLabel = `${grade.name} ${div.label}`;
          const nextLabel = nextDiv ? `${grade.name} ${nextDiv.label}` : (nextGrade ? `${nextGrade.name} I` : null);
          const nextMin = nextDiv ? nextDiv.min : (nextGrade ? nextGrade.min : null);
          const divTotal = nextDiv ? nextDiv.min - div.min : (div.max === Infinity ? null : div.max - div.min + 1);
          const divDone = rentals - div.min;
          return (
            <div style={{maxWidth:560,margin:'0 auto'}}>

              {/* Hero */}
              <div style={{borderRadius:22,marginBottom:20,background:isFondateur?'linear-gradient(135deg,#0a0a0a 0%,#1a1200 40%,#2a1f00 60%,#0a0a0a 100%)':`linear-gradient(135deg,${gc},${gc}bb)`,padding:'28px 24px',color:'#fff',position:'relative',overflow:'hidden',animation:isFondateur?'fondateurBorder 2.5s ease-in-out infinite':'glowPulse 3s ease-in-out infinite',border:isFondateur?'2px solid #D4AF37':'none',boxSizing:'border-box'}}>
                {isFondateur&&<div style={{position:'absolute',inset:0,background:'linear-gradient(105deg,transparent 40%,rgba(212,175,55,0.18) 50%,transparent 60%)',backgroundSize:'200% 100%',animation:'shimmerCard 2.5s linear infinite',pointerEvents:'none'}}/>}
                <div style={{position:'absolute',top:-16,right:-16,fontSize:130,opacity:isFondateur?.15:.1,lineHeight:1,pointerEvents:'none'}}>{grade.icon}</div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',opacity:.75,marginBottom:8}}>Votre rang actuel</div>
                <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
                  <span style={{fontSize:48,filter:isFondateur?'drop-shadow(0 0 12px #FFD700)':'none'}}>{grade.icon}</span>
                  <div>
                    <div style={{fontSize:isFondateur?26:32,fontWeight:900,lineHeight:1.1,letterSpacing:'-.02em',background:isFondateur?'linear-gradient(90deg,#FFD700,#FFF8DC,#D4AF37,#FFD700)':'none',backgroundSize:isFondateur?'200% auto':'auto',WebkitBackgroundClip:isFondateur?'text':'unset',WebkitTextFillColor:isFondateur?'transparent':'inherit',animation:isFondateur?'shimmerCard 2s linear infinite':'none'}}>{fullLabel}</div>
                    <div style={{fontSize:13,opacity:.8,marginTop:4}}>{rentals} location{rentals!==1?'s':''} complétée{rentals!==1?'s':''}</div>
                  </div>
                </div>

                {/* Divisions row */}
                <div style={{display:'flex',gap:6,marginBottom:16}}>
                  {grade.divs.map(d=>{
                    const isThis = d.label===div.label;
                    const isPast = grade.divs.indexOf(d) < grade.divs.findIndex(x=>x.label===div.label);
                    return (
                      <div key={d.label} style={{flex:1,textAlign:'center',padding:'6px 4px',borderRadius:10,background:isThis?'rgba(255,255,255,0.3)':isPast?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.08)',border:`1.5px solid ${isThis?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.2)'}`,transition:'all .2s'}}>
                        <div style={{fontSize:11,fontWeight:700,opacity:isThis?1:.6}}>{grade.name} {d.label}</div>
                        <div style={{fontSize:9,opacity:.6,marginTop:1}}>{isPast?'✓ Atteint':isThis?'En cours':'Bloqué'}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                {nextLabel ? (
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:12,opacity:.85,marginBottom:6}}>
                      <span>Vers <strong>{nextLabel}</strong></span>
                      <span style={{fontWeight:700}}>{divDone}{divTotal?`/${divTotal}`:''} loc.</span>
                    </div>
                    <div style={{height:8,borderRadius:4,background:'rgba(255,255,255,0.2)',overflow:'hidden'}}>
                      <div style={{height:'100%',borderRadius:4,background:'#fff',width:`${gradeBarWidth}%`,transition:'width 0.8s ease'}}/>
                    </div>
                    {nextMin && <div style={{fontSize:11,opacity:.7,marginTop:6}}>{nextMin - rentals} location{(nextMin-rentals)!==1?'s':''} pour atteindre {nextLabel}</div>}
                  </div>
                ) : (
                  <div style={{fontSize:14,fontWeight:800,background:'linear-gradient(90deg,#FFD700,#FFF8DC,#D4AF37)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>👑 Félicitations, vous faites partie des légendes de Cercle !</div>
                )}
              </div>

              {/* Stats */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                <div style={{background:'#f8f7ff',borderRadius:16,padding:'16px 18px',border:'1.5px solid #f0eeff'}}>
                  <div style={{fontSize:11,color:'#9ca3af',fontWeight:600,marginBottom:4}}>Commission actuelle</div>
                  <div style={{fontSize:26,fontWeight:900,color:gc}}>{Math.round(grade.feeRate*100)}%</div>
                  <div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>au lieu de 12%</div>
                </div>
                <div style={{background:'#f0fdf4',borderRadius:16,padding:'16px 18px',border:'1.5px solid #d1fae5'}}>
                  <div style={{fontSize:11,color:'#9ca3af',fontWeight:600,marginBottom:4}}>Économie sur les frais</div>
                  <div style={{fontSize:26,fontWeight:900,color:'#10b981'}}>{Math.round((0.12 - grade.feeRate)*100)}%</div>
                  <div style={{fontSize:11,color:'#9ca3af',marginTop:2}}>par rapport au taux de base</div>
                </div>
              </div>

              {/* Perks */}
              <div style={{marginBottom:24}}>
                <div style={{fontSize:15,fontWeight:800,color:isFondateur?'#D4AF37':'#1a1a2e',marginBottom:12}}>{isFondateur?'👑 Récompenses exclusives':'Avantages inclus'}</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {grade.perks.map((p,pi)=>(
                    <div key={p} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',background:isFondateur?`linear-gradient(135deg,#0d0d00,#1a1500)`:'#fff',border:isFondateur?'1.5px solid #D4AF3766':'1.5px solid #f0eeff',borderRadius:14,fontSize:13,color:isFondateur?'#FFF8DC':'#1a1a2e',fontWeight:500,position:'relative',overflow:'hidden',animation:isFondateur?`fadeSlideUp 0.4s ease both`:'none',animationDelay:isFondateur?`${pi*0.08}s`:'0s'}}>
                      {isFondateur&&<div style={{position:'absolute',inset:0,background:'linear-gradient(105deg,transparent 40%,rgba(212,175,55,0.1) 50%,transparent 60%)',backgroundSize:'200% 100%',animation:'shimmerCard 3s linear infinite',pointerEvents:'none'}}/>}
                      <div style={{width:28,height:28,borderRadius:8,background:isFondateur?'linear-gradient(135deg,#D4AF37,#FFD700)':gcLight,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:isFondateur?'0 2px 8px rgba(212,175,55,0.5)':'none'}}>
                        <span style={{fontSize:isFondateur?14:12,color:isFondateur?'#0a0a0a':gc,fontWeight:900}}>{isFondateur?'★':'✓'}</span>
                      </div>
                      <span style={{position:'relative',zIndex:1}}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parcours — grille de cartes */}
              <div>
                <div style={{fontSize:15,fontWeight:800,color:'#1a1a2e',marginBottom:16}}>Tous les rangs</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:10}}>
                  {GRADES.slice(0,5).map((g,gi)=>{
                    const gColor = GC[g.id]||'#6C63FF';
                    const isCurrentGrade = g.id===grade.id;
                    const isUnlocked = rentals >= g.min;
                    const tipOpen = gradeTooltip===g.id;
                    return (
                      <div key={g.id} className={tipOpen?'grade-card-wrap tip-open':'grade-card-wrap'} style={{zIndex:tipOpen?10:1}} onClick={()=>setGradeTooltip(tipOpen?null:g.id)}>
                        <div style={{
                          borderRadius:16,overflow:'hidden',
                          animation:'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay:`${gi*0.07}s`,
                          border:`2px solid ${isCurrentGrade?gColor:isUnlocked?gColor+'60':'#e5e7eb'}`,
                          background:isCurrentGrade
                            ?`linear-gradient(160deg,${gColor},${gColor}cc)`
                            :isUnlocked?`linear-gradient(160deg,${gColor}22,${gColor}08)`:'#f9fafb',
                          boxShadow:isCurrentGrade?`0 6px 20px ${gColor}45`:'0 1px 4px rgba(0,0,0,0.06)',
                          transition:'all .25s',
                          filter:isUnlocked?'none':'grayscale(.65)',
                          opacity:isUnlocked?1:.6
                        }}>
                          <div style={{padding:'14px 8px 16px',textAlign:'center'}}>
                            <div style={{fontSize:28,marginBottom:8,lineHeight:1}}>{g.icon}</div>
                            <div style={{fontSize:12,fontWeight:800,color:isCurrentGrade?'#fff':isUnlocked?gColor:'#9ca3af',marginBottom:8,letterSpacing:'-.01em'}}>{g.name}</div>
                            <div style={{display:'flex',justifyContent:'center',gap:3,marginBottom:8}}>
                              {g.divs.map((d,di)=>{
                                const isThisDot = isCurrentGrade && d.label===div.label;
                                const isPastDot = !isCurrentGrade && isUnlocked || (isCurrentGrade && di < g.divs.findIndex(x=>x.label===div.label));
                                return (
                                  <div key={d.label} style={{
                                    height:5,borderRadius:3,
                                    width:isThisDot?20:isUnlocked||isPastDot?8:6,
                                    background:isThisDot?(isCurrentGrade?'rgba(255,255,255,0.9)':gColor):isPastDot?(isCurrentGrade?'rgba(255,255,255,0.4)':gColor+'66'):'#e5e7eb',
                                    transition:'all .3s',
                                    boxShadow:isThisDot&&isCurrentGrade?`0 0 6px rgba(255,255,255,0.7)`:''
                                  }}/>
                                );
                              })}
                            </div>
                            <div style={{fontSize:11,fontWeight:700,color:isCurrentGrade?'rgba(255,255,255,0.85)':isUnlocked?'#374151':'#c0c0c0',marginBottom:8}}>{Math.round(g.feeRate*100)}% comm.</div>
                            <div>
                              {isCurrentGrade
                                ? <span style={{fontSize:9,fontWeight:800,color:gColor,background:'rgba(255,255,255,0.9)',padding:'3px 8px',borderRadius:20,letterSpacing:'.04em'}}>EN COURS</span>
                                : isUnlocked
                                  ? <span style={{fontSize:9,fontWeight:700,color:'#10b981',background:'#f0fdf4',padding:'3px 7px',borderRadius:20,border:'1px solid #d1fae5'}}>✓ Atteint</span>
                                  : <span style={{fontSize:9,fontWeight:600,color:'#9ca3af',background:'#f3f4f6',padding:'3px 7px',borderRadius:20}}>🔒 {g.min.toLocaleString()}</span>
                              }
                            </div>
                          </div>
                        </div>
                        <div className="grade-tooltip" style={{border:`2px solid ${gColor}`,boxShadow:`0 8px 24px ${gColor}33`}}>
                          <div style={{fontWeight:800,color:gColor,marginBottom:6,fontSize:11,letterSpacing:'.02em'}}>{g.icon} {g.name}</div>
                          {g.avantages.map((a,ai)=>(
                            <div key={ai} style={{fontSize:10,color:'#374151',marginBottom:3,display:'flex',gap:5,alignItems:'flex-start'}}>
                              <span style={{color:gColor,fontWeight:800,flexShrink:0}}>✓</span>
                              <span style={{lineHeight:1.4}}>{a}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* ── Fondateur Cercle — carte pleine largeur ── */}
                {(()=>{
                  const fg = GRADES[5];
                  const isCurrentGrade = fg.id===grade.id;
                  const isUnlocked = rentals >= fg.min;
                  const fTipOpen = gradeTooltip==='fondateur';
                  return (
                    <div>
                      <div onClick={()=>setGradeTooltip(fTipOpen?null:'fondateur')} style={{borderRadius:20,overflow:'hidden',position:'relative',cursor:'pointer',border:isCurrentGrade?'2px solid #FFD700':'2px solid #D4AF3766',background:isUnlocked?'linear-gradient(135deg,#0a0a0a 0%,#1a1200 50%,#0a0a0a 100%)':'#f9fafb',boxShadow:isCurrentGrade?'0 8px 40px rgba(212,175,55,0.5)':'0 1px 6px rgba(0,0,0,0.08)',animation:isCurrentGrade?'fondateurBorder 2.5s ease-in-out infinite':'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.42s both',filter:isUnlocked?'none':'grayscale(.7)',opacity:isUnlocked?1:.55}}>
                        {isUnlocked&&<div style={{position:'absolute',inset:0,background:'linear-gradient(105deg,transparent 35%,rgba(212,175,55,0.15) 50%,transparent 65%)',backgroundSize:'200% 100%',animation:'shimmerCard 2.5s linear infinite',pointerEvents:'none'}}/>}
                        <div style={{padding:'18px 20px',display:'flex',alignItems:'center',gap:16,position:'relative',zIndex:1}}>
                          <div style={{fontSize:40,filter:isUnlocked?'drop-shadow(0 0 10px #FFD700)':'none',flexShrink:0}}>{fg.icon}</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:15,fontWeight:900,marginBottom:3,background:isUnlocked?'linear-gradient(90deg,#FFD700,#FFF8DC,#D4AF37)':'none',WebkitBackgroundClip:isUnlocked?'text':'unset',WebkitTextFillColor:isUnlocked?'transparent':'#9ca3af',backgroundSize:'200% auto',animation:isUnlocked?'shimmerCard 2s linear infinite':'none'}}>{fg.name}</div>
                            <div style={{fontSize:11,color:isUnlocked?'rgba(255,248,220,0.7)':'#9ca3af'}}>Commission {Math.round(fg.feeRate*100)}% · Dès {fg.min.toLocaleString()} locations</div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
                            <span style={{fontSize:10,color:isUnlocked?'rgba(255,248,220,0.5)':'#c0c0c0'}}>Voir avantages {fTipOpen?'▲':'▼'}</span>
                            {isCurrentGrade
                              ? <span style={{fontSize:10,fontWeight:800,color:'#0a0a0a',background:'linear-gradient(90deg,#FFD700,#D4AF37)',padding:'4px 10px',borderRadius:20,letterSpacing:'.04em'}}>EN COURS</span>
                              : isUnlocked
                                ? <span style={{fontSize:10,fontWeight:700,color:'#FFD700',background:'rgba(212,175,55,0.15)',padding:'4px 10px',borderRadius:20,border:'1px solid #D4AF3766'}}>✓ Atteint</span>
                                : <span style={{fontSize:10,fontWeight:600,color:'#9ca3af',background:'#f3f4f6',padding:'4px 10px',borderRadius:20}}>🔒 {fg.min.toLocaleString()}</span>
                            }
                          </div>
                        </div>
                      </div>
                      {fTipOpen&&(
                        <div style={{marginTop:8,borderRadius:16,padding:'16px 18px',background:'linear-gradient(135deg,#0a0a0a,#1a1200)',border:'1.5px solid #D4AF3766',boxShadow:'0 8px 32px rgba(212,175,55,0.25)',animation:'fadeSlideUp 0.2s ease both',position:'relative',overflow:'hidden'}}>
                          <div style={{position:'absolute',inset:0,background:'linear-gradient(105deg,transparent 35%,rgba(212,175,55,0.08) 50%,transparent 65%)',backgroundSize:'200% 100%',animation:'shimmerCard 3s linear infinite',pointerEvents:'none'}}/>
                          <div style={{fontWeight:800,color:'#FFD700',marginBottom:10,fontSize:12,position:'relative',zIndex:1}}>👑 Avantages exclusifs Fondateur</div>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px 16px',position:'relative',zIndex:1}}>
                            {fg.avantages.map((a,ai)=>(
                              <div key={ai} style={{display:'flex',gap:8,alignItems:'flex-start',fontSize:11,color:'#FFF8DC'}}>
                                <span style={{color:'#FFD700',fontWeight:800,flexShrink:0,marginTop:1}}>★</span>
                                <span style={{lineHeight:1.4}}>{a}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>


            </div>
          );
        })()}

        {/* ── Mon Parc (Pro) ── */}
        {tab === 'parc' && user.isPro && (
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
              <div style={{background:'linear-gradient(135deg,#F59E0B,#D97706)',borderRadius:12,padding:'8px 14px',color:'#fff',fontSize:12,fontWeight:700}}>⭐ Parc PRO · {proParc.length} équipements</div>
              <div style={{flex:1}}/>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.7)'}}>
                {proParc.filter(e=>e.status==='available').length} dispo · {proParc.filter(e=>e.status==='rented').length} loués
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {proParc.map((eq,i)=>{
                const statusLabel = eq.status==='available'?'Disponible':eq.status==='rented'?'En location':'Maintenance';
                const statusColor = eq.status==='available'?'#059669':eq.status==='rented'?'#D97706':'#6b7280';
                const statusBg = eq.status==='available'?'#d1fae5':eq.status==='rented'?'#FEF3C7':'#f3f4f6';
                return (
                  <div key={eq.id} style={{background:'rgba(255,255,255,0.95)',borderRadius:16,padding:'14px 16px',display:'flex',gap:14,alignItems:'center',animation:`fadeSlideUp 0.4s ${i*0.06}s both`,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',border:'1px solid rgba(108,99,255,0.08)'}}>
                    <div style={{width:50,height:50,borderRadius:14,background:'linear-gradient(135deg,#FEF3C7,#FDE68A)',fontSize:26,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{eq.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:700,color:'#111827',marginBottom:3}}>{eq.title}</div>
                      <div style={{fontSize:11,color:'#6b7280'}}>{eq.rentals} locations · {eq.price}€/j</div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5}}>
                      <span style={{background:statusBg,color:statusColor,borderRadius:20,padding:'4px 10px',fontSize:10,fontWeight:700}}>{statusLabel}</span>
                      <div style={{fontSize:13,fontWeight:800,color:'#D97706'}}>{eq.price}€<span style={{fontWeight:400,fontSize:10,color:'#9ca3af'}}>/j</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:16,background:'rgba(255,255,255,0.15)',borderRadius:16,padding:'16px',textAlign:'center'}}>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.8)',marginBottom:8}}>CA estimé parc</div>
              <div style={{fontSize:28,fontWeight:800,color:'#fff'}}>{proParc.reduce((s,e)=>s+e.price*e.rentals,0).toLocaleString()}€</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.6)',marginTop:2}}>cumulé depuis l'activation Pro</div>
            </div>
          </div>
        )}

        {/* ── Paramètres ── */}
        {tab === 'parametres' && (
          <div style={{paddingBottom:80}}>

            {/* ── Titre de page ── */}
            <div style={{marginBottom:24,animation:'fadeSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both'}}>
              <h2 style={{fontSize:22,fontWeight:800,color:'var(--dk)',letterSpacing:'-.03em',margin:0}}>Paramètres</h2>
              <p style={{fontSize:13,color:'var(--g)',marginTop:4,margin:'4px 0 0'}}>Gérez votre compte et vos préférences</p>
            </div>

            {/* ── Complétion du profil ── */}
            {(()=>{
              const pc = state.profileCompletion || {identity:false,phone:false,drivingLicense:false,bankAccount:false};
              const steps = [
                {key:'identity', label:'Identité', icon:'🪪', desc:'Pièce d\'identité officielle'},
                {key:'phone', label:'Téléphone', icon:'📱', desc:'Numéro vérifié par SMS'},
                {key:'drivingLicense', label:'Permis', icon:'🚗', desc:'Requis pour louer'},
                {key:'bankAccount', label:'Bancaire', icon:'🏦', desc:'Pour vos paiements'},
              ];
              const doneCount = steps.filter(s=>pc[s.key]).length;
              const pct = Math.round(doneCount/steps.length*100);
              const circ = 188.5;
              const handleComplete = (key)=>{
                if(key==='phone') setVerifData(p=>({...p,phoneNum:profileData.phone||''}));
                setVerifModal(key);
              };
              return (
                <div style={{background:'var(--w)',borderRadius:20,border:'1px solid var(--bd)',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',padding:'20px',marginBottom:16,animation:'fadeSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:'0.04s'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                    <div style={{width:38,height:38,borderRadius:12,background:'linear-gradient(135deg,#6C63FF,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>🧩</div>
                    <div>
                      <div style={{fontSize:15,fontWeight:700,color:'var(--dk)',lineHeight:1.2}}>Complétion du profil</div>
                      <div style={{fontSize:12,color:'var(--g)'}}>Boostez votre visibilité</div>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:20}}>
                    <div style={{position:'relative',flexShrink:0}}>
                      <svg width="76" height="76" viewBox="0 0 76 76">
                        <circle cx="38" cy="38" r="30" fill="none" stroke="#ede9fe" strokeWidth="7"/>
                        <circle cx="38" cy="38" r="30" fill="none" stroke="url(#pgGrad)" strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={`${pct/100*circ} ${circ}`}
                          transform="rotate(-90 38 38)"
                        />
                        <defs>
                          <linearGradient id="pgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6C63FF"/>
                            <stop offset="100%" stopColor="#a78bfa"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <span style={{fontSize:17,fontWeight:800,color:'var(--dk)',lineHeight:1}}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:700,color:'var(--dk)',marginBottom:3}}>{pct===100?'Profil complet ✨':'Profil incomplet'}</div>
                      <div style={{fontSize:13,color:'var(--g)',marginBottom:pct<100?8:0}}>{doneCount}/{steps.length} étapes complétées</div>
                      {pct<100&&<div style={{fontSize:12,color:'#6C63FF',fontWeight:600,background:'#f5f3ff',padding:'5px 10px',borderRadius:8,display:'inline-block'}}>Complétez pour +50% de visibilité</div>}
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                    {steps.map(step=>(
                      <div key={step.key} onClick={!pc[step.key]?()=>handleComplete(step.key):undefined}
                        style={{display:'flex',alignItems:'center',gap:9,padding:'11px 12px',background:pc[step.key]?'#f0fdf4':'var(--bg)',borderRadius:13,border:pc[step.key]?'1.5px solid #86efac':'1.5px solid var(--bd)',cursor:pc[step.key]?'default':'pointer',transition:'all .2s'}}>
                        <span style={{fontSize:18}}>{pc[step.key]?'✅':step.icon}</span>
                        <div style={{minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,color:pc[step.key]?'#15803d':'var(--dk)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{step.label}</div>
                          <div style={{fontSize:10,color:pc[step.key]?'#22c55e':'var(--g)'}}>{pc[step.key]?'Complété':'Ajouter →'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── Mon profil ── */}
            <div style={{background:'var(--w)',borderRadius:20,border:'1px solid var(--bd)',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',padding:'20px',marginBottom:16,animation:'fadeSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:'0.08s'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                <div style={{width:38,height:38,borderRadius:12,background:'linear-gradient(135deg,#3b82f6,#6C63FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>👤</div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'var(--dk)',lineHeight:1.2}}>Mon profil</div>
                  <div style={{fontSize:12,color:'var(--g)'}}>Informations personnelles</div>
                </div>
              </div>
              {[
                {icon:'✏️',label:'Nom complet',key:'name',type:'text',placeholder:'Votre nom'},
                {icon:'📧',label:'Email',key:'email',type:'email',placeholder:'votre@email.fr'},
                {icon:'📱',label:'Téléphone',key:'phone',type:'tel',placeholder:'+33 6 00 00 00 00'},
              ].map((f,i,arr)=>(
                <div key={f.key} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 0',borderBottom:i<arr.length-1?'1px solid var(--bg)':'none'}}>
                  <span style={{fontSize:19,flexShrink:0,width:26,textAlign:'center'}}>{f.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,fontWeight:700,color:'var(--gl)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>{f.label}</div>
                    <input type={f.type} value={profileData[f.key]}
                      onChange={e=>setProfileData({...profileData,[f.key]:e.target.value})}
                      placeholder={f.placeholder}
                      style={{border:'none',outline:'none',fontSize:14,color:'var(--dk)',background:'transparent',padding:0,width:'100%',fontFamily:'inherit',fontWeight:500}}/>
                  </div>
                </div>
              ))}
              <div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'13px 0'}}>
                <span style={{fontSize:19,flexShrink:0,width:26,textAlign:'center',marginTop:2}}>✍️</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:10,fontWeight:700,color:'var(--gl)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>Bio</div>
                  <textarea rows={3} value={profileData.bio}
                    onChange={e=>setProfileData({...profileData,bio:e.target.value})}
                    placeholder="Décrivez-vous en quelques mots..."
                    style={{border:'none',outline:'none',fontSize:14,color:'var(--dk)',background:'transparent',padding:0,width:'100%',fontFamily:'inherit',fontWeight:500,resize:'none',lineHeight:1.5}}/>
                </div>
              </div>
            </div>

            {/* ── Informations Pro ── */}
            {user.isPro && (
              <div style={{background:'var(--w)',borderRadius:20,border:'1px solid var(--bd)',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',padding:'20px',marginBottom:16,animation:'fadeSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:'0.12s'}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                  <div style={{width:38,height:38,borderRadius:12,background:'linear-gradient(135deg,#F59E0B,#D97706)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>🏢</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:700,color:'var(--dk)',lineHeight:1.2}}>Informations Pro</div>
                    <div style={{fontSize:12,color:'var(--g)'}}>Votre compte professionnel</div>
                  </div>
                  <span style={{background:'linear-gradient(135deg,#F59E0B,#D97706)',color:'#fff',fontSize:9,fontWeight:800,padding:'3px 8px',borderRadius:20,letterSpacing:'.04em',flexShrink:0}}>PRO</span>
                </div>
                {[
                  {icon:'🏗️',label:'Entreprise',val:user.company||'—'},
                  {icon:'🔢',label:'N° SIRET',val:user.siret||'—'},
                  {icon:'💶',label:'N° TVA',val:user.tva||'—'},
                  {icon:'📞',label:'Tél. pro',val:user.phone||'—'},
                  {icon:'🌐',label:'Site web',val:user.website||'—'},
                ].map((f,i,arr)=>(
                  <div key={f.label} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 0',borderBottom:i<arr.length-1?'1px solid var(--bg)':'none'}}>
                    <span style={{fontSize:18,flexShrink:0,width:26,textAlign:'center'}}>{f.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:10,fontWeight:700,color:'var(--gl)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:1}}>{f.label}</div>
                      <div style={{fontSize:14,color:'var(--dk)',fontWeight:500}}>{f.val}</div>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:14,padding:'10px 14px',background:'#FFFBEB',borderRadius:12,border:'1px solid #FDE68A',fontSize:12,color:'#92400E',display:'flex',alignItems:'center',gap:8}}>
                  <span>⭐</span> Compte Pro actif — Dashboard, Gestion, Facturation PDF
                </div>
              </div>
            )}

            {/* ── Notifications ── */}
            <div style={{background:'var(--w)',borderRadius:20,border:'1px solid var(--bd)',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',padding:'20px',marginBottom:16,animation:'fadeSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:'0.16s'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                <div style={{width:38,height:38,borderRadius:12,background:'linear-gradient(135deg,#f59e0b,#ef4444)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>🔔</div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'var(--dk)',lineHeight:1.2}}>Notifications</div>
                  <div style={{fontSize:12,color:'var(--g)'}}>Choisissez ce que vous recevez</div>
                </div>
              </div>
              {[
                {key:'notifEmail',icon:'📧',bg:'#FEF9C3',title:'Emails',sub:'Nouvelles réservations et messages'},
                {key:'notifPush',icon:'📲',bg:'#DCFCE7',title:'Notifications push',sub:'Alertes en temps réel sur votre appareil'},
              ].map((f,i,arr)=>(
                <div key={f.key} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:i<arr.length-1?'1px solid var(--bg)':'none'}}>
                  <div style={{width:38,height:38,borderRadius:11,background:f.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>{f.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:'var(--dk)'}}>{f.title}</div>
                    <div style={{fontSize:12,color:'var(--g)',marginTop:1}}>{f.sub}</div>
                  </div>
                  <div style={S.toggle(profileData[f.key])} onClick={()=>setProfileData({...profileData,[f.key]:!profileData[f.key]})}>
                    <div style={S.toggleKnob(profileData[f.key])}/>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Confiance & Sécurité ── */}
            <div style={{background:'var(--w)',borderRadius:20,border:'1px solid var(--bd)',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',padding:'20px',marginBottom:16,animation:'fadeSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:'0.20s'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                <div style={{width:38,height:38,borderRadius:12,background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>🛡️</div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'var(--dk)',lineHeight:1.2}}>Confiance &amp; Sécurité</div>
                  <div style={{fontSize:12,color:'var(--g)'}}>Statut de vos vérifications</div>
                </div>
              </div>
              {[
                {icon:'✅',bg:'#d1fae5',label:'Identité vérifiée',value:'Confirmée',color:'#10b981'},
                {icon:'📱',bg:'#dbeafe',label:'Numéro vérifié',value:profileData.phone||'—',color:'#3b82f6'},
                {icon:'📧',bg:'#ede9fe',label:'Email vérifié',value:profileData.email||'—',color:'#6C63FF'},
              ].map((item,i,arr)=>(
                <div key={item.label} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:i<arr.length-1?'1px solid var(--bg)':'none'}}>
                  <div style={{width:38,height:38,borderRadius:11,background:item.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>{item.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:'var(--dk)'}}>{item.label}</div>
                    <div style={{fontSize:12,color:'var(--g)',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.value}</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,color:item.color,background:item.bg,padding:'4px 10px',borderRadius:20,flexShrink:0}}>Vérifié ✓</span>
                </div>
              ))}
            </div>

            {/* ── Sauvegarder ── */}
            <button style={{width:'100%',padding:'16px',borderRadius:16,background:'linear-gradient(135deg,#6C63FF,#8b5cf6)',border:'none',color:'white',fontSize:15,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 20px rgba(108,99,255,0.35)',marginBottom:12,animation:'fadeSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:'0.28s'}}
              onClick={()=>dispatch({type:"UPD_PROF",payload:{name:profileData.name,email:profileData.email,bio:profileData.bio,phone:profileData.phone}})}>
              Sauvegarder les modifications
            </button>

            {/* ── Déconnexion ── */}
            <button style={{width:'100%',padding:'14px',borderRadius:16,background:'var(--w)',border:'1.5px solid #fecaca',color:'#ef4444',fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,animation:'fadeSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both',animationDelay:'0.32s'}}
              onClick={()=>{dispatch({type:"LOGOUT"});setPage('home');}}>
              🚪 Se déconnecter
            </button>

          </div>
        )}

      </div>

      {/* ── Modals de vérification ── */}
      {verifModal && (
      <div className="bk" onClick={e=>{if(e.target===e.currentTarget)closeVerif();}}>
        <div className="md" style={{width:'92%',maxWidth:440}}>
          <div className="mh">
            <button className="mx" onClick={closeVerif} style={{position:'absolute',left:14}}>←</button>
            <h2 style={{fontSize:16,fontWeight:700}}>
              {verifModal==='identity'&&'Vérification d\'identité'}
              {verifModal==='phone'&&'Vérification du téléphone'}
              {verifModal==='drivingLicense'&&'Permis de conduire'}
              {verifModal==='bankAccount'&&'Compte bancaire'}
            </h2>
          </div>
          <div className="mb">

            {/* ─ Identité ─ */}
            {verifModal==='identity'&&(<div>
              <p style={{fontSize:13,color:'var(--g)',marginBottom:16,lineHeight:1.5}}>Vos informations doivent correspondre exactement à votre pièce d'identité officielle.</p>
              <div className="fg"><label>Prénom</label><input value={verifData.firstName} onChange={e=>vd('firstName',e.target.value)} placeholder="Votre prénom"/></div>
              <div className="fg"><label>Nom de famille</label><input value={verifData.lastName} onChange={e=>vd('lastName',e.target.value)} placeholder="Votre nom"/></div>
              <div className="fg"><label>Type de document</label>
                <select value={verifData.docType} onChange={e=>vd('docType',e.target.value)}>
                  <option value="CNI">Carte nationale d'identité</option>
                  <option value="passeport">Passeport</option>
                  <option value="sejour">Titre de séjour</option>
                </select>
              </div>
              <div className="fg"><label>Numéro du document</label><input value={verifData.docNum} onChange={e=>vd('docNum',e.target.value)} placeholder="Ex : 123456789"/></div>
              <div className="fg"><label>Date d'expiration</label><input type="date" value={verifData.docExp} onChange={e=>vd('docExp',e.target.value)}/></div>
              <div className="fg">
                <label>Photo du document (recto)</label>
                <div style={{border:'2px dashed var(--bd)',borderRadius:14,padding:'24px 16px',textAlign:'center',cursor:'pointer',color:'var(--g)',background:'var(--bg)',fontSize:13}}
                  onClick={()=>document.getElementById('idFileInput').click()}>
                  📎 Cliquez pour joindre une photo
                </div>
                <input id="idFileInput" type="file" accept="image/*,.pdf" style={{display:'none'}} onChange={e=>vd('docFile',e.target.files[0])}/>
                {verifData.docFile&&<p style={{fontSize:12,color:'#10b981',marginTop:6}}>✓ {verifData.docFile.name}</p>}
              </div>
            </div>)}

            {/* ─ Téléphone ─ */}
            {verifModal==='phone'&&(<div>
              <p style={{fontSize:13,color:'var(--g)',marginBottom:16,lineHeight:1.5}}>Entrez votre numéro, nous vous enverrons un code de vérification par SMS.</p>
              <div className="fg"><label>Numéro de téléphone</label><input type="tel" value={verifData.phoneNum} onChange={e=>vd('phoneNum',e.target.value)} placeholder="+33 6 00 00 00 00"/></div>
              {!verifData.smsSent
                ?<button className="bp" style={{width:'100%',marginBottom:8}} onClick={()=>{if(verifData.phoneNum)vd('smsSent',true);}}>Envoyer le code SMS</button>
                :<div>
                  <div style={{padding:'10px 14px',background:'#f0fdf4',borderRadius:12,border:'1px solid #86efac',fontSize:13,color:'#166534',marginBottom:14}}>✓ Code envoyé au {verifData.phoneNum}</div>
                  <div className="fg"><label>Code reçu par SMS</label><input type="number" value={verifData.smsCode} onChange={e=>vd('smsCode',e.target.value)} placeholder="6 chiffres" maxLength={6}/></div>
                </div>
              }
            </div>)}

            {/* ─ Permis ─ */}
            {verifModal==='drivingLicense'&&(<div>
              <p style={{fontSize:13,color:'var(--g)',marginBottom:16,lineHeight:1.5}}>Votre permis est requis pour louer des véhicules et équipements motorisés.</p>
              <div className="fg"><label>Numéro de permis</label><input value={verifData.licNum} onChange={e=>vd('licNum',e.target.value)} placeholder="Ex : 12AB12345"/></div>
              <div className="fg"><label>Date d'obtention</label><input type="date" value={verifData.licDate} onChange={e=>vd('licDate',e.target.value)}/></div>
              <div className="fg"><label>Catégorie principale</label>
                <select value={verifData.licCat} onChange={e=>vd('licCat',e.target.value)}>
                  <option value="B">B — Voiture</option>
                  <option value="A">A — Moto</option>
                  <option value="BE">BE — Voiture + remorque</option>
                  <option value="C">C — Poids lourd</option>
                  <option value="AM">AM — Cyclomoteur</option>
                </select>
              </div>
              <div className="fg">
                <label>Photo du permis (recto)</label>
                <div style={{border:'2px dashed var(--bd)',borderRadius:14,padding:'24px 16px',textAlign:'center',cursor:'pointer',color:'var(--g)',background:'var(--bg)',fontSize:13}}
                  onClick={()=>document.getElementById('licFileInput').click()}>
                  📎 Cliquez pour joindre une photo
                </div>
                <input id="licFileInput" type="file" accept="image/*,.pdf" style={{display:'none'}} onChange={e=>vd('licFile',e.target.files[0])}/>
                {verifData.licFile&&<p style={{fontSize:12,color:'#10b981',marginTop:6}}>✓ {verifData.licFile.name}</p>}
              </div>
            </div>)}

            {/* ─ Compte bancaire ─ */}
            {verifModal==='bankAccount'&&(<div>
              <p style={{fontSize:13,color:'var(--g)',marginBottom:16,lineHeight:1.5}}>Nécessaire pour recevoir vos paiements de locations. Vos données sont chiffrées.</p>
              <div className="fg"><label>Titulaire du compte</label><input value={verifData.bankHolder} onChange={e=>vd('bankHolder',e.target.value)} placeholder="Nom complet du titulaire"/></div>
              <div className="fg"><label>IBAN</label><input value={verifData.iban} onChange={e=>vd('iban',e.target.value.toUpperCase())} placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX" style={{letterSpacing:'0.04em'}}/></div>
              <div className="fg"><label>BIC / SWIFT</label><input value={verifData.bic} onChange={e=>vd('bic',e.target.value.toUpperCase())} placeholder="Ex : BNPAFRPPXXX"/></div>
              <div className="fg"><label>Nom de la banque</label><input value={verifData.bankName} onChange={e=>vd('bankName',e.target.value)} placeholder="Ex : BNP Paribas"/></div>
              <div style={{padding:'10px 14px',background:'#f0fdf4',borderRadius:12,border:'1px solid #86efac',fontSize:12,color:'#166534',display:'flex',gap:8,alignItems:'center'}}>
                🔒 Vos informations bancaires sont sécurisées et chiffrées.
              </div>
            </div>)}

          </div>
          <div className="mf">
            <button className="bs" onClick={closeVerif}>Annuler</button>
            <button className="bp"
              disabled={
                (verifModal==='identity'&&(!verifData.firstName||!verifData.lastName||!verifData.docNum))||
                (verifModal==='phone'&&(!verifData.smsSent||!verifData.smsCode))||
                (verifModal==='drivingLicense'&&(!verifData.licNum||!verifData.licDate))||
                (verifModal==='bankAccount'&&(!verifData.bankHolder||!verifData.iban||!verifData.bic))
              }
              onClick={()=>completeVerif(verifModal)}>
              Valider
            </button>
          </div>
        </div>
      </div>
    )}

      </div>{/* end prf-main */}
    </div>
  );
}

