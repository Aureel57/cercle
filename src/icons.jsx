const I={
  Search:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{width:15,height:15}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Heart:({f})=><svg viewBox="0 0 24 24" fill={f?"#E85D4A":"rgba(0,0,0,.4)"} stroke={f?"#E85D4A":"#fff"} strokeWidth="2" style={{width:20,height:20}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Star:()=><svg viewBox="0 0 24 24" fill="currentColor" style={{width:12,height:12}}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Chv:({d})=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{width:13,height:13}}><polyline points={d==="l"?"15 18 9 12 15 6":"9 18 15 12 9 6"}/></svg>,
  X:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{width:18,height:18}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Menu:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:16,height:16}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  User:()=><svg viewBox="0 0 24 24" fill="#8C7B6B" style={{width:20,height:20}}><circle cx="12" cy="8" r="4"/><path d="M12 14c-6 0-8 3-8 5v1h16v-1c0-2-2-5-8-5z"/></svg>,
  Send:()=><svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>,
  Msg:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Plus:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{width:15,height:15}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Back:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{width:16,height:16}}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Flt:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><line x1="4" y1="6" x2="20" y2="6"/><circle cx="8" cy="6" r="2" fill="currentColor"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="16" cy="18" r="2" fill="currentColor"/></svg>,
  Home:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  Bell:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22}}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  MapPin:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Prof:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:22,height:22}}><circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>,
  Share:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{width:15,height:15}}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
};

/* ========== STYLES ========== */
const css=`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fraunces:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}:root{--p:#6C63FF;--pd:#5a4ee0;--acc:#4ECDC4;--dk:#222;--tx:#484848;--g:#767676;--gl:#B0B0B0;--bd:#EBEBEB;--bg:#F7F7F7;--bgw:#F0F0F0;--w:#FFF;--sh:0 1px 2px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.03);--shm:0 2px 8px rgba(0,0,0,.06),0 8px 20px rgba(0,0,0,.05);--shl:0 8px 28px rgba(0,0,0,.1),0 2px 4px rgba(0,0,0,.04);--glass:rgba(255,255,255,.75);--blur:blur(20px);--r:16px;--rl:24px;--f:'Inter',system-ui,-apple-system,sans-serif;--fd:'Fraunces',Georgia,serif;--ease:cubic-bezier(.4,0,.2,1)}
body,html,#root{font-family:var(--f);color:var(--tx);background:var(--bg);-webkit-font-smoothing:antialiased;letter-spacing:-.015em}button{font-family:var(--f);cursor:pointer}input,select,textarea{font-family:var(--f)}
/* Header */
.hdr{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(108,99,255,0.1);box-shadow:0 2px 20px rgba(108,99,255,0.08);transition:box-shadow 0.3s ease;will-change:box-shadow}
.hdr.scrolled{box-shadow:0 4px 30px rgba(108,99,255,0.18)}
.hi{display:flex;align-items:center;justify-content:space-between;padding:0 28px;max-width:1520px;margin:0 auto;height:72px;gap:12px}
.logo{display:flex;align-items:center;gap:10px;cursor:pointer;flex-shrink:0}
.lc{width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,var(--p),#FF8A5C);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:17px;font-family:var(--fd);transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);will-change:transform}
.logo:hover .lc{transform:rotate(-6deg) scale(1.08)}.lt{font-family:var(--fd);font-size:22px;font-weight:700;color:var(--dk);letter-spacing:-.02em}
/* Search bar */
.sb{display:flex;align-items:center;border:1.5px solid var(--bd);border-radius:40px;box-shadow:var(--sh);cursor:pointer;height:48px;max-width:520px;flex:1;margin:0 20px;background:var(--w);transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);will-change:box-shadow,border-color}
.sb:hover{box-shadow:0 4px 16px rgba(108,99,255,.15);border-color:#d1c9ff;transform:translateY(-2px)}
.ss{padding:0 18px;font-size:13px;font-weight:500;white-space:nowrap;color:var(--dk);border-right:1px solid var(--bd);height:100%;display:flex;align-items:center}.ss.m{color:var(--gl);font-weight:400}.ss:last-of-type{border:none}
.sbb{background:linear-gradient(135deg,var(--p),#FF8A5C);border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:#fff;margin-right:8px;flex-shrink:0;transition:all .2s var(--ease)}.sbb:hover{transform:scale(1.08);box-shadow:0 4px 12px rgba(255,90,95,.3)}
/* Nav right */
.nr{display:flex;align-items:center;gap:6px;flex-shrink:0}
.nb{background:none;border:none;font-size:13px;font-weight:600;color:var(--dk);padding:8px 14px;border-radius:24px;transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);position:relative;will-change:transform,background}
.nb:hover{background:var(--bg);transform:translateY(-1px)}
.nb:first-child{background:linear-gradient(135deg,rgba(108,99,255,0.08),rgba(255,138,92,0.08));animation:glowPulse 3s ease-in-out infinite;color:var(--p);font-weight:700}.ndot{position:absolute;top:4px;right:4px;width:7px;height:7px;border-radius:50%;background:var(--p);border:2px solid var(--w)}
.pb{display:flex;align-items:center;gap:8px;border:1px solid var(--bd);border-radius:24px;padding:5px 5px 5px 12px;background:var(--w);transition:all .25s var(--ease);position:relative}.pb:hover{box-shadow:var(--shm)}.pav{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--bg),var(--bgw));display:flex;align-items:center;justify-content:center;font-size:15px}
/* Dropdown */
.dd{position:absolute;top:calc(100% + 8px);right:0;background:var(--w);border-radius:var(--rl);box-shadow:var(--shl);min-width:240px;padding:8px 0;z-index:200;animation:din .15s var(--ease);border:1px solid rgba(0,0,0,.04)}@keyframes din{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.di{padding:11px 18px;font-size:13px;cursor:pointer;transition:all .15s var(--ease);display:flex;align-items:center;gap:10px;border-radius:8px;margin:0 6px}.di:hover{background:var(--bg)}.di.b{font-weight:700}.dsp{height:1px;background:var(--bd);margin:6px 12px}
/* Categories */
.cw{display:flex;align-items:center;gap:8px;padding:8px 28px;max-width:1520px;margin:0 auto}.cts{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;flex:1}.cts::-webkit-scrollbar{display:none}
.ct{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 14px;cursor:pointer;border-bottom:2.5px solid transparent;opacity:.45;transition:all .2s var(--ease);white-space:nowrap;flex-shrink:0}.ct:hover{opacity:.7}.ct.on{opacity:1;border-bottom-color:var(--dk)}
.cti{font-size:20px}.ctl{font-size:10px;font-weight:600;color:var(--g);letter-spacing:.02em}.ct.on .ctl{color:var(--dk)}
.fb{display:flex;align-items:center;gap:7px;padding:10px 16px;border:1px solid var(--bd);border-radius:12px;background:var(--w);font-size:12px;font-weight:600;flex-shrink:0;color:var(--dk);transition:all .2s}.fb:hover{border-color:var(--dk);box-shadow:var(--sh)}
/* Grid & Cards */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px;padding:24px 28px 60px;max-width:1520px;margin:0 auto}
.grid > *{animation:fadeSlideUp 0.5s ease both}
.grid > *:nth-child(1){animation-delay:0.05s}
.grid > *:nth-child(2){animation-delay:0.1s}
.grid > *:nth-child(3){animation-delay:0.15s}
.grid > *:nth-child(4){animation-delay:0.2s}
.grid > *:nth-child(5){animation-delay:0.25s}
.grid > *:nth-child(6){animation-delay:0.3s}
.grid > *:nth-child(7){animation-delay:0.35s}
.grid > *:nth-child(8){animation-delay:0.4s}
.grid > *:nth-child(n+9){animation-delay:0.45s}
.card{cursor:pointer;position:relative;transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.3s ease;background:var(--w);border-radius:var(--rl);box-shadow:0 2px 8px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04);overflow:hidden;isolation:isolate;animation:scaleIn 0.4s ease both;will-change:transform,box-shadow}
.card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 20px 60px rgba(108,99,255,0.2),0 8px 20px rgba(0,0,0,.1)}.ciw{position:relative;width:100%;aspect-ratio:4/3;border-radius:var(--rl) var(--rl) 0 0;overflow:hidden;background:var(--bg)}.cimg{width:100%;height:100%;object-fit:cover;transition:transform .6s var(--ease)}.card:hover .cimg{transform:scale(1.08)}
.card-cta{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(108,99,255,.94) 0%,rgba(108,99,255,.7) 70%,transparent 100%);color:#fff;text-align:center;padding:32px 12px 16px;transform:translateY(100%);transition:transform .35s var(--ease);font-size:14px;font-weight:700;letter-spacing:.02em;pointer-events:none}.card:hover .card-cta{transform:translateY(0)}
.cfav{position:absolute;top:10px;right:10px;background:none;border:none;z-index:2;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3));transition:transform .2s var(--ease)}.cfav:hover{transform:scale(1.2)}
.cbdg{position:absolute;top:10px;left:10px;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);color:#fff;padding:4px 10px;border-radius:8px;font-size:10px;font-weight:700;z-index:2;letter-spacing:.02em}
.nav{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);border:none;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh);opacity:0;transition:all .2s var(--ease);z-index:2}.card:hover .nav{opacity:1}.nav:hover{transform:translateY(-50%) scale(1.1)}.nav.l{left:8px}.nav.r{right:8px}
.dts{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:2}.dt{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.45);transition:all .2s}.dt.on{background:#fff;transform:scale(1.3)}
.cbo{padding:14px 16px 16px}.cbt{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}.cbn{font-size:15px;font-weight:700;color:var(--dk);line-height:1.35;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:-.02em}.cbr{display:flex;align-items:center;gap:3px;font-size:12px;font-weight:700;flex-shrink:0;color:var(--dk)}.cbl{font-size:13px;color:var(--g);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}.cbc{font-size:11px;color:var(--acc);font-weight:600;margin-top:2px}.cbp{font-size:18px;font-weight:800;color:var(--p);letter-spacing:-.01em}.cbp span{color:var(--g);font-size:12px;font-weight:500}.cbp-row{display:flex;justify-content:space-between;align-items:center;margin-top:10px;flex-wrap:wrap;gap:6px}.cond-badge{font-size:10px;color:var(--acc);font-weight:700;background:rgba(78,205,196,.14);padding:4px 9px;border-radius:8px;flex-shrink:0;letter-spacing:.01em}
/* Overlays & Modals */
.ov{position:fixed;inset:0;z-index:200;background:var(--w);overflow-y:auto;animation:si .4s var(--ease)}@keyframes si{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
.bk{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(6px);z-index:300;display:flex;align-items:center;justify-content:center}.md{background:var(--w);border-radius:var(--rl);width:92%;max-width:560px;max-height:88vh;overflow-y:auto;animation:mi .3s var(--ease);box-shadow:0 20px 60px rgba(0,0,0,.3);border:1px solid rgba(0,0,0,.04)}@keyframes mi{from{opacity:0;transform:scale(.94) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
.mh{display:flex;align-items:center;justify-content:center;padding:16px 20px;border-bottom:1px solid var(--bd);position:sticky;top:0;background:var(--w);z-index:2;border-radius:var(--rl) var(--rl) 0 0}.mh h2{font-size:16px;font-weight:700;font-family:var(--fd);letter-spacing:-.02em}.mx{position:absolute;left:14px;background:none;border:none;padding:6px;border-radius:50%;display:flex;color:var(--dk);transition:background .15s}.mx:hover{background:var(--bg)}
.mb{padding:20px 24px}.mf{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;border-top:1px solid var(--bd);background:var(--bgw)}
/* Form elements */
.fg{margin-bottom:18px}.fg label{display:block;font-size:11px;font-weight:700;margin-bottom:7px;color:var(--dk);text-transform:uppercase;letter-spacing:.05em}.fg input,.fg textarea,.fg select{width:100%;padding:12px 16px;border:1.5px solid var(--bd);border-radius:14px;font-size:13px;outline:none;transition:all .25s var(--ease);background:var(--w)}.fg input:focus,.fg textarea:focus,.fg select:focus{border-color:var(--p);box-shadow:0 0 0 4px rgba(108,99,255,.08)}.fg textarea{resize:vertical;min-height:80px}
/* Buttons */
.bp{padding:12px 26px;background:linear-gradient(135deg,var(--p),#FF8A5C);color:#fff;border:none;border-radius:14px;font-size:14px;font-weight:700;transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);letter-spacing:-.01em;box-shadow:0 4px 12px rgba(108,99,255,.2);will-change:transform,box-shadow}.bp:hover{opacity:.96;transform:scale(1.04);box-shadow:0 8px 24px rgba(108,99,255,.32)}.bp:disabled{opacity:.35;cursor:default;transform:none;box-shadow:none}
.bs{padding:12px 24px;background:var(--w);color:var(--dk);border:1.5px solid var(--bd);border-radius:14px;font-size:13px;font-weight:600;transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);will-change:transform,box-shadow}.bs:hover{border-color:var(--dk);background:var(--bg);box-shadow:0 2px 8px rgba(0,0,0,.06);transform:scale(1.04)}
.bd{background:var(--dk);color:#fff;border:none;border-radius:14px;padding:12px 26px;font-size:13px;font-weight:700;transition:all .25s var(--ease);box-shadow:0 4px 12px rgba(0,0,0,.15)}.bd:hover{opacity:.92;transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.25)}
.cl{background:#fff;border:none;font-size:13px;font-weight:600;color:#374151;cursor:pointer;border-radius:50px;padding:8px 16px;box-shadow:0 2px 8px rgba(0,0,0,.10);display:inline-flex;align-items:center;gap:6px;transition:all .18s ease;text-decoration:none}.cl:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.15);background:#fff}
.ov-close{width:40px;height:40px;border-radius:50%;background:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 16px rgba(0,0,0,.15);transition:all .15s ease;color:#374151;flex-shrink:0;line-height:1}.ov-close:hover{background:#f3f4f6;transform:scale(1.05)}
.pill{padding:8px 16px;border-radius:28px;border:1.5px solid var(--bd);background:var(--w);font-size:12px;font-weight:500;cursor:pointer;transition:all .25s var(--ease);color:var(--dk)}.pill:hover{border-color:var(--dk);box-shadow:0 2px 6px rgba(0,0,0,.08)}.pill.on{background:var(--dk);color:#fff;border-color:var(--dk);box-shadow:0 4px 12px rgba(0,0,0,.2)}
/* Detail page */
.dimgs{display:grid;grid-template-columns:2fr 1fr;grid-template-rows:220px 220px;gap:6px;padding:0 28px;border-radius:var(--rl);overflow:hidden}
.dimg0{grid-row:1/3;border-radius:var(--rl) 0 0 var(--rl);overflow:hidden}
.dimgs .dimg1{border-radius:0 var(--rl) 0 0;overflow:hidden}
.dimgs .dimg2{border-radius:0 0 var(--rl) 0;overflow:hidden}
.dimgs img{width:100%;height:100%;object-fit:cover;display:block;cursor:pointer;transition:filter .2s,transform .3s}
.dimgs img:hover{filter:brightness(.93);transform:scale(1.02)}
.dc{display:grid;grid-template-columns:1fr 380px;gap:40px;padding:28px;max-width:1520px;margin:0 auto;align-items:start}.bc{position:sticky;top:90px;align-self:start;border:1px solid var(--bd);border-radius:var(--rl);padding:24px;box-shadow:0 8px 32px rgba(0,0,0,.10);background:var(--w)}.bcp{font-family:var(--fd);font-size:24px;font-weight:700;margin-bottom:4px;letter-spacing:-.02em}.bci{margin:12px 0}.bcr{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}.bcf{flex:1}.bcf label{display:block;font-size:10px;font-weight:700;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}.bcf input,.bcf select{width:100%;padding:10px 12px;border:1.5px solid var(--bd);border-radius:12px;font-size:13px;outline:none;transition:border .2s}.bcf input:focus{border-color:var(--dk)}
.bcb{margin:14px 0;padding:14px 0;border-top:1px solid var(--bd)}.bcl{display:flex;justify-content:space-between;padding:4px 0;font-size:13px;color:var(--g)}.bcl.tot{font-weight:700;font-size:15px;color:var(--dk);padding:10px 0 0;margin-top:8px;border-top:1px solid var(--bd)}
/* Profile */
.prof{padding:28px;max-width:900px;margin:0 auto;animation:fadeSlideUp 0.6s ease}
.ph{display:flex;gap:24px;align-items:center;margin-bottom:20px}
.pav-l{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--bg),var(--bgw));display:flex;align-items:center;justify-content:center;font-size:40px;flex-shrink:0;border:3px solid var(--w);box-shadow:var(--sh);animation:float 3s ease-in-out infinite;will-change:transform}
.pav-edit{position:relative;cursor:pointer}
/* Grade system */
.grade-card{border-radius:var(--rl);padding:20px;margin-bottom:20px;position:relative;overflow:hidden;animation:scaleIn 0.5s ease}
.grade-card::before{content:'';position:absolute;inset:0;opacity:.06;background:radial-gradient(circle at 30% 50%,currentColor,transparent 70%)}
.grade-progress{margin-top:14px}
.grade-progress-bar{height:6px;border-radius:3px;background:var(--bd);overflow:hidden;margin:6px 0}
.grade-progress-fill{height:100%;border-radius:3px;transition:width 0.8s cubic-bezier(0.34,1.56,0.64,1);will-change:width}
.grade-progress-fill.voisin{background:linear-gradient(90deg,#6b7280,#9ca3af)}.grade-progress-fill.habitant{background:linear-gradient(90deg,#3b82f6,#60a5fa)}.grade-progress-fill.pilier{background:linear-gradient(90deg,#F59E0B,#FCD34D)}.grade-progress-fill.gardien{background:linear-gradient(90deg,#7C3AED,#A78BFA)}.grade-progress-fill.legende{background:linear-gradient(90deg,#06B6D4,#67E8F9)}.grade-progress-fill.fondateur{background:linear-gradient(90deg,#1a1a1a,#B8860B,#FFD700,#B8860B,#1a1a1a);background-size:300% auto;animation:shimmerGold 2s linear infinite}
@keyframes shimmerGold{0%{background-position:0% center}100%{background-position:300% center}}
@keyframes fondateurBorder{0%,100%{border-color:#D4AF37;box-shadow:0 0 18px rgba(212,175,55,0.5)}50%{border-color:#FFD700;box-shadow:0 0 36px rgba(255,215,0,0.7)}}
@keyframes shimmerCard{0%{background-position:-200% center}100%{background-position:200% center}}
.savings-card{border:1px solid var(--bd);border-radius:var(--rl);padding:20px;margin-bottom:20px;background:linear-gradient(135deg,#F0FDF4,#ECFDF5);display:flex;align-items:center;gap:16px}
.savings-amount{font-family:var(--fd);font-size:28px;font-weight:700;color:var(--acc)}
.all-grades{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:14px}
.all-grade{text-align:center;padding:12px 6px;border-radius:14px;border:1.5px solid var(--bd);font-size:10px;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);cursor:default;animation:fadeSlideUp 0.5s ease both;will-change:transform}
.all-grade:nth-child(1){animation-delay:0.1s}
.all-grade:nth-child(2){animation-delay:0.2s}
.all-grade:nth-child(3){animation-delay:0.3s}
.all-grade:nth-child(4){animation-delay:0.4s}
.all-grade:nth-child(5){animation-delay:0.5s}
.all-grade:nth-child(6){animation-delay:0.6s}
.all-grade.current{border-color:var(--dk);background:var(--bg);transform:scale(1.08)}.all-grade .ag-icon{font-size:24px;display:block;margin-bottom:4px}.all-grade .ag-name{font-weight:700;display:block}.all-grade .ag-range{color:var(--g);font-size:9px}
/* Profile tab animations */
.prof-listing-card:hover{transform:scale(1.02)!important;box-shadow:0 8px 28px rgba(0,0,0,0.13)!important}
.prof-fav-card:hover{transform:scale(1.02)!important;box-shadow:0 8px 28px rgba(0,0,0,0.11)!important}
@keyframes statusPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.8;transform:scale(1.04)}}
.prof-badge-pulse{animation:statusPulse 2.2s ease-in-out infinite}
@keyframes gradeGlow{0%,100%{box-shadow:0 8px 32px rgba(0,0,0,0.18)}50%{box-shadow:0 8px 48px rgba(0,0,0,0.28),0 0 40px currentColor}}
/* Tabs */
.tabs{display:flex;gap:4px;border-bottom:1px solid var(--bd);margin-bottom:20px}.tab{padding:10px 18px;font-size:13px;font-weight:600;border:none;border-bottom:2.5px solid transparent;color:var(--g);background:none;transition:all .2s var(--ease)}.tab:hover{color:var(--dk)}.tab.on{color:var(--dk);border-bottom-color:var(--dk)}
/* Messages */
.ml{display:grid;grid-template-columns:300px 1fr;flex:1;overflow:hidden}.mls{border-right:1px solid var(--bd);overflow-y:auto;background:var(--w)}
.mc{padding:14px 16px;display:flex;gap:10px;cursor:pointer;border-bottom:1px solid var(--bd);transition:all .15s var(--ease)}.mc:hover,.mc.on{background:var(--bg)}.mca{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--bg),var(--bgw));display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}.mci{flex:1;min-width:0}.mcn{font-size:13px;font-weight:600}.mcl{font-size:11.5px;color:var(--g);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mch{display:flex;flex-direction:column;height:100%;background:var(--bg)}.mchd{padding:14px 18px;border-bottom:1px solid var(--bd);font-weight:600;font-size:14px;display:flex;align-items:center;gap:10px;background:var(--w)}
.mcbd{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:8px}.bub{max-width:70%;padding:11px 16px;border-radius:20px;font-size:13px;line-height:1.5}.bub.me{background:linear-gradient(135deg,var(--p),#FF8A5C);color:#fff;align-self:flex-end;border-bottom-right-radius:4px;box-shadow:0 2px 8px rgba(108,99,255,.2)}.bub.th{background:var(--w);color:var(--dk);align-self:flex-start;border-bottom-left-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.06)}.bub .bt{font-size:10px;opacity:.5;margin-top:4px;display:block}
.mip{display:flex;gap:8px;padding:14px 18px;border-top:1px solid var(--bd);background:var(--w)}.mip input{flex:1;padding:10px 16px;border:1.5px solid var(--bd);border-radius:24px;outline:none;font-size:13px;transition:all .2s}.mip input:focus{border-color:var(--dk);box-shadow:0 0 0 3px rgba(34,34,34,.06)}.mip button{background:linear-gradient(135deg,var(--p),#FF8A5C);color:#fff;border:none;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .2s}.mip button:hover{transform:scale(1.05)}
/* Toast */
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--dk);color:#fff;padding:14px 32px;border-radius:18px;font-size:13px;font-weight:600;z-index:500;box-shadow:0 8px 32px rgba(0,0,0,.3);display:flex;align-items:center;gap:10px;animation:tu .4s var(--ease);white-space:nowrap}@keyframes tu{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.empty{text-align:center;padding:100px 20px;color:var(--g)}.empty span{font-size:64px;display:block;margin-bottom:18px;opacity:.9}.empty h2{font-size:22px;font-weight:700;color:var(--dk);margin-bottom:10px;font-family:var(--fd);letter-spacing:-.01em}.empty p{font-size:14px;color:var(--g);line-height:1.6;margin-bottom:24px}
/* Footer */
.ft{background:var(--w);border-top:1px solid var(--bd);padding:48px 28px 24px}.ftg{max-width:1520px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:36px;padding-bottom:32px;border-bottom:1px solid var(--bd)}.ftc h4{font-size:12px;font-weight:700;margin-bottom:14px;text-transform:uppercase;letter-spacing:.08em;color:var(--dk);font-family:var(--fd)}.ftc a{display:block;font-size:13px;color:var(--g);padding:5px 0;cursor:pointer;transition:color .2s;line-height:1.6;font-weight:500}.ftc a:hover{color:var(--p)}.ftb{max-width:1520px;margin:0 auto;padding-top:18px;display:flex;justify-content:space-between;font-size:12px;color:var(--gl);font-weight:500;line-height:1.6}
.ft-promo{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:24px}
.ft-legal{display:flex;flex-wrap:wrap;gap:12px}
.ft-legal-bottom{display:flex;align-items:center;gap:12px}
/* Search modal */
.smbg{position:fixed;inset:0;background:rgba(0,0,0,.15);backdrop-filter:blur(4px);z-index:140}.sm{position:fixed;top:0;left:0;right:0;background:var(--w);z-index:150;box-shadow:var(--shl);border-bottom-left-radius:var(--rl);border-bottom-right-radius:var(--rl);animation:sd .2s var(--ease)}@keyframes sd{from{opacity:0;transform:translateY(-8px)}to{opacity:1}}
.smin{max-width:760px;margin:0 auto;padding:20px 28px 28px}.smr{display:flex;background:var(--bg);border-radius:40px;padding:4px;align-items:center;border:1px solid var(--bd)}.smf{flex:1;padding:12px 20px;border-radius:32px;cursor:pointer;transition:all .2s var(--ease)}.smf:hover,.smf.on{background:var(--w);box-shadow:var(--shm)}.smf label{font-size:9px;font-weight:700;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:.06em;color:var(--g)}.smf input{border:none;background:none;font-size:13px;color:var(--dk);outline:none;width:100%;font-weight:500}
.smgo{background:linear-gradient(135deg,var(--p),#FF8A5C);color:#fff;border:none;border-radius:32px;padding:12px 22px;font-size:13px;font-weight:700;display:flex;align-items:center;gap:6px;transition:all .2s}.smgo:hover{transform:scale(1.03)}
.ac{position:absolute;top:100%;left:0;right:0;background:var(--w);border-radius:0 0 var(--r) var(--r);box-shadow:var(--shm);max-height:240px;overflow-y:auto;z-index:10}.aci{padding:10px 16px;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background .1s}.aci:hover{background:var(--bg)}
.smtg{margin-top:16px}.smtg p{font-size:10px;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em;color:var(--g)}.smtl{display:flex;gap:6px;flex-wrap:wrap}.smt{padding:8px 14px;border:1px solid var(--bd);border-radius:12px;background:var(--w);font-size:12px;font-weight:500;transition:all .15s}.smt:hover{border-color:var(--dk);background:var(--bg)}
@media(max-width:768px){
  .smin{padding:14px 16px 22px}
  .smr{flex-direction:column;border-radius:var(--rl);padding:4px 8px;gap:0;align-items:stretch}
  .smf{padding:12px 14px;border-radius:10px}
  .smf+.smf{border-top:1px solid var(--bd)}
  .smgo{width:100%;justify-content:center;margin-top:8px;border-radius:12px;padding:14px 24px}
  .smtl{gap:5px}
  .smt{font-size:11px;padding:7px 11px}
}
/* Reviews */
.rev{padding:14px 0;border-bottom:1px solid var(--bd)}.revh{display:flex;align-items:center;gap:10px;margin-bottom:5px}.reva{width:34px;height:34px;border-radius:50%;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:18px}.revn{font-size:13px;font-weight:600}.revd{font-size:10px;color:var(--gl)}.revs{color:var(--p);font-size:12px}.revt{font-size:13px;line-height:1.5}
@media(max-width:1024px){.dc{grid-template-columns:1fr;gap:24px}.bc{position:relative;top:0}.ml{grid-template-columns:1fr}}
/* Dark mode — variables */
html.dark,html.dark body,html.dark #root{background:#0f0f13 !important;color:#f1f1f5}
.dark{--p:#7c74ff;--pd:#6a63f0;--acc:#4FD1C5;--dk:#f1f1f5;--tx:#e0e0f0;--g:#a0a0b8;--gl:#7070a0;--bd:#2d2d3d;--bg:#0f0f13;--bgw:#1a1a24;--w:#1e1e2e;--sh:0 2px 8px rgba(0,0,0,.5);--shm:0 2px 16px rgba(0,0,0,.55);--shl:0 8px 32px rgba(0,0,0,.65),0 2px 8px rgba(0,0,0,.45)}
.dark .card{background:#1e1e2e !important;box-shadow:0 2px 12px rgba(0,0,0,.4) !important}
.dark .reco,.dark .reco-c{background:#1a1a24 !important}
.dark .grid{background:transparent}
/* Dark mode — component overrides */
.dark .hdr{background:rgba(17,17,17,.94);border-bottom:1px solid rgba(255,255,255,.06)}
.dark .sb{background:#1E1E1E;border-color:rgba(255,255,255,.14)}
.dark .sb:hover{box-shadow:0 2px 12px rgba(0,0,0,.4);border-color:rgba(255,255,255,.22)}
.dark .ss{color:#F5F5F5;border-right-color:rgba(255,255,255,.08)}
.dark .bs{border-color:rgba(255,255,255,.16)}
.dark .bs:hover{background:#242424;border-color:rgba(255,255,255,.28)}
.dark .pill{border-color:rgba(255,255,255,.1)}
.dark .pill.on{background:var(--p);color:#fff;border-color:var(--p)}
.dark .pill:hover{border-color:rgba(255,255,255,.3)}
.dark .fg input,.dark .fg textarea,.dark .fg select{background:#1E1E1E;border-color:rgba(255,255,255,.14);color:#F5F5F5}
.dark .fg input:focus,.dark .fg textarea:focus{border-color:rgba(255,255,255,.4);box-shadow:0 0 0 3px rgba(255,255,255,.06)}
.dark .dd{border-color:rgba(255,255,255,.08);background:#1A1A1A}
.dark .di:hover{background:#242424}
.dark .dsp{background:rgba(255,255,255,.06)}
.dark .bk{background:rgba(0,0,0,.75)}
.dark .md{background:#1A1A1A;border:1px solid rgba(255,255,255,.08)}
.dark .mh{border-bottom-color:rgba(255,255,255,.08)}
.dark .sm{background:#1A1A1A}
.dark .smr{background:#1E1E1E;border-color:rgba(255,255,255,.12)}
.dark .smf:hover,.dark .smf.on{background:#2A2A2A}
.dark .smf input{color:#F5F5F5}
.dark .smf+.smf{border-top-color:rgba(255,255,255,.08)}
.dark .smt{background:#1E1E1E;border-color:rgba(255,255,255,.1);color:#E5E7EB}
.dark .smt:hover{background:#2A2A2A;border-color:rgba(255,255,255,.22)}
.dark .ac{background:#1E1E1E;border:1px solid rgba(255,255,255,.1)}
.dark .aci:hover{background:#242424}
.dark .map-side,.dark .map-side-hd{background:#1A1A1A}
.dark .map-card{background:#1A1A1A;border-color:rgba(255,255,255,.08)}
.dark .map-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.5);border-color:rgba(255,255,255,.16);transform:translateY(-1px)}
.dark .map-breadcrumb{background:rgba(13,148,136,.18);border-bottom-color:rgba(255,255,255,.08)}
.dark .dboard-chart{background:#1A1A1A;border-color:rgba(255,255,255,.08)}
.dark .nc-i{border-bottom-color:rgba(255,255,255,.06)}
.dark .nc-i.unread{background:rgba(255,90,95,.08)}
.dark .rev{border-bottom-color:rgba(255,255,255,.06)}
.dark .chatbot-bd{background:#0F0F0F}
.dark .chatbot-msg.bot{background:#1E1E1E;color:#F5F5F5}
.dark .mip input{background:#1E1E1E;border-color:rgba(255,255,255,.14);color:#F5F5F5}
/* Dark mode — button .bd becomes purple (dark --dk is near-white, would make white-on-white) */
.dark .bd{background:var(--p);color:#fff}
/* Dark mode — hamburger icon + nav buttons: browsers reset button color, force inherit */
.dark .pb{color:var(--dk)}
.dark .nb{color:var(--dk)}
/* Dark mode — dropdown items need explicit color */
.dark .di{color:var(--dk)}
/* Dark mode — category tabs: boost opacity and fix label color */
.dark .ct{opacity:.7}
.dark .ctl{color:rgba(255,255,255,.7)}
.dark .ct.on .ctl{color:#fff}
.dark .ct.on{border-bottom-color:rgba(255,255,255,.9)}
/* Dark mode — filter button */
.dark .fb{background:var(--w);color:var(--dk);border-color:var(--bd)}
/* Photo upload */
.photo-drop{border:2px dashed var(--p);border-radius:14px;padding:28px 16px;text-align:center;background:rgba(108,99,255,0.04);cursor:pointer;transition:all 0.2s}
.photo-drop:hover,.photo-drop.drag{border-style:solid;box-shadow:0 4px 16px rgba(108,99,255,0.15);background:rgba(108,99,255,0.08)}
.photo-thumbs{display:grid;grid-template-columns:repeat(auto-fill,80px);gap:8px;margin-top:12px}
.photo-thumb{position:relative;width:80px;height:80px}
.photo-thumb img{width:80px;height:80px;object-fit:cover;border-radius:10px;display:block}
.photo-thumb-del{position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:#e85d4a;color:#fff;border:none;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.2)}
.avatar-edit-wrap{position:relative;cursor:pointer;display:inline-flex;border-radius:50%}
.avatar-edit-badge{position:absolute;bottom:4px;right:4px;width:26px;height:26px;border-radius:50%;background:var(--p);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.2);z-index:3}
.dark .photo-drop{background:rgba(108,99,255,0.08);border-color:rgba(124,116,255,0.5)}
.dark .photo-drop:hover,.dark .photo-drop.drag{background:rgba(108,99,255,0.16)}
/* Bottom nav */
.bnav{display:none;position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.95);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid rgba(0,0,0,.08);z-index:90;padding:8px 0 max(8px,env(safe-area-inset-bottom));box-shadow:0 -4px 16px rgba(0,0,0,.08)}
.dark .bnav{background:rgba(21,21,21,.96);border-top:1px solid rgba(255,255,255,.08)}
.bnav-in{display:flex;justify-content:space-around;align-items:center;max-width:500px;margin:0 auto}
.bn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 14px;background:none;border:none;color:var(--gl);font-size:9px;font-weight:600;transition:all .2s var(--ease);position:relative;font-family:var(--f)}
.bn.on{color:var(--p)}.bn.on svg{stroke:var(--p)}
.bn .bnd{position:absolute;top:2px;right:10px;width:6px;height:6px;border-radius:50%;background:var(--p)}
@media(max-width:768px){.bnav{display:block}body{padding-bottom:calc(68px + env(safe-area-inset-bottom,0px))}.nr .nb{display:none}}
@media(max-width:768px){
  .ft-promo{grid-template-columns:repeat(2,1fr);gap:12px}
  .ft-legal{flex-direction:column;gap:6px}
  .ft-legal-bottom{flex-direction:column;align-items:flex-start;gap:6px}
}
@media(max-width:480px){.ftg{grid-template-columns:1fr}}
/* Map */
.map-w{height:calc(100vh - 130px);background:var(--bg);overflow:hidden;display:flex;flex-direction:column}
.map-filters{padding:8px 12px;display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;background:var(--w);border-bottom:1px solid var(--bd);flex-shrink:0}
.map-filters::-webkit-scrollbar{display:none}
.map-layout{flex:1;display:grid;grid-template-columns:1fr 340px;grid-template-rows:1fr;overflow:hidden;position:relative;min-height:0}
.leaflet-container{width:100%!important;height:100%!important}
.leaflet-popup-content-wrapper{border-radius:12px!important;box-shadow:0 4px 20px rgba(0,0,0,.18)!important;font-family:'DM Sans',system-ui!important;padding:4px 2px!important}
.leaflet-popup-tip-container{display:none!important}
.leaflet-popup-close-button{font-size:16px!important;color:#9CA3AF!important}
.map-pin{background:var(--p);color:#fff;border-radius:20px;padding:5px 12px;font-size:12px;font-weight:700;box-shadow:0 2px 10px rgba(0,0,0,.3);border:2.5px solid #fff;white-space:nowrap;transition:all .15s;min-height:32px;display:flex;align-items:center;gap:4px}
.map-pin:hover{transform:scale(1.08)}.map-pin.active{transform:scale(1.15);background:var(--pd)}
.map-side{border-left:1px solid var(--bd);overflow-y:auto;background:var(--w);display:flex;flex-direction:column}
.map-side-hd{padding:12px 14px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;font-family:var(--fd);font-size:14px;font-weight:600;gap:8px}
.map-breadcrumb{display:flex;align-items:center;gap:8px;padding:8px 14px;background:rgba(13,148,136,.08);border-bottom:1px solid var(--bd);flex-shrink:0}
.map-breadcrumb-label{font-size:12px;font-weight:700;color:var(--p);flex:1}
.map-breadcrumb-reset{background:none;border:1px solid var(--p);color:var(--p);border-radius:20px;padding:2px 10px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap}
.map-card{display:flex;gap:12px;padding:12px 12px;margin:8px 10px;background:var(--w);border:1px solid var(--bd);border-radius:10px;cursor:pointer;transition:box-shadow .15s,transform .15s}
.map-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.10);transform:translateY(-1px)}
.map-card img{width:80px;height:80px;border-radius:8px;object-fit:cover;flex-shrink:0}
.map-card-body{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:4px}
.map-card-title{font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3}
.map-card-meta{font-size:11px;color:var(--g);display:flex;align-items:center;gap:4px}
.map-card-price{font-size:16px;font-weight:800;color:var(--p);line-height:1}
.map-card-price span{font-size:11px;font-weight:400;color:var(--g)}
@media(max-width:768px){
  .map-card{margin:6px 8px;padding:10px}
  .map-card img{width:60px;height:60px}
  .map-card-title{font-size:13px}
  .map-card-price{font-size:14px}
}
.map-list-btn{display:none}
.map-drawer-handle{display:none}
.map-drawer-close{background:none;border:none;font-size:18px;cursor:pointer;color:var(--gl);padding:2px;line-height:1}
.map-search-area-btn{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:var(--dk);color:#fff;border:none;border-radius:24px;padding:10px 20px;font-size:13px;font-weight:700;z-index:1000;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.3);white-space:nowrap;display:flex;align-items:center;gap:6px;animation:fadeIn .2s}
@media(max-width:768px){
  .map-w{height:calc(100vh - 58px - 68px)}
  .map-layout{grid-template-columns:1fr!important}
  .map-pin{padding:8px 16px;font-size:13px;min-height:40px;min-width:56px;justify-content:center}
  .map-side{position:absolute;bottom:0;left:0;right:0;height:58%;transform:translateY(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);border-left:none;border-top:1px solid var(--bd);border-radius:16px 16px 0 0;box-shadow:0 -6px 28px rgba(0,0,0,.14);z-index:10;overflow-y:auto}
  .map-side.open{transform:translateY(0)}
  .map-list-btn{display:flex;position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:var(--dk);color:#fff;border:none;border-radius:24px;padding:12px 22px;font-size:13px;font-weight:700;z-index:5;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.28);align-items:center;gap:7px;white-space:nowrap}
  .map-drawer-handle{display:block;width:36px;height:4px;background:var(--bd);border-radius:2px;margin:10px auto 2px;cursor:pointer;flex-shrink:0}
  .map-drawer-close{display:block}
}
/* Notif center */
.nc{max-width:640px;margin:0 auto;padding:24px 28px}
.nc-i{display:flex;gap:12px;padding:14px;border-radius:14px;margin-bottom:8px;cursor:pointer;transition:all .15s var(--ease);align-items:center}
.nc-i:hover{background:var(--bg)}
.nc-i.unread{background:var(--bg);border-left:3px solid var(--p)}
.nc-ic{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;background:var(--bgw)}
/* Mode switch */
.mode-sw{display:flex;background:var(--bg);border-radius:28px;padding:3px;border:1px solid var(--bd);gap:2px}
.mode-btn{padding:8px 16px;border-radius:24px;border:none;font-size:12px;font-weight:600;background:none;color:var(--g);cursor:pointer;transition:all .2s var(--ease);font-family:var(--f);display:flex;align-items:center;gap:5px}
.mode-btn.on{background:var(--w);color:var(--dk);box-shadow:var(--sh)}
.mode-btn.pro-on{background:linear-gradient(135deg,#1E3A5F,#2563EB);color:#fff;box-shadow:0 2px 8px rgba(37,99,235,.25)}
/* Pro */
.pro-hdr{background:linear-gradient(135deg,#0F172A,#1E293B) !important;backdrop-filter:none !important;border-bottom:1px solid rgba(255,255,255,.06)}
.pro-hdr .logo .lc{background:linear-gradient(135deg,#2563EB,#3B82F6)}
.pro-hdr .lt{color:#fff !important}
.pro-hdr .sb{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.1)}.pro-hdr .sb .ss{color:rgba(255,255,255,.7)}
.pro-hdr .nr .nb{color:rgba(255,255,255,.8);border-color:rgba(255,255,255,.1)}.pro-hdr .nr .nb:hover{background:rgba(255,255,255,.08)}
.pro-hdr .pb{border-color:rgba(255,255,255,.15)}.pro-hdr .mode-sw{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.08)}
.pro-badge{position:absolute;top:10px;left:10px;background:linear-gradient(135deg,#F59E0B,#D97706);color:#fff;padding:4px 10px;border-radius:8px;font-size:9px;font-weight:700;z-index:2;letter-spacing:.04em;box-shadow:0 2px 8px rgba(217,119,6,.35)}
.pro-card{border:1.5px solid rgba(108,99,255,.2);border-radius:var(--rl)}.pro-card:hover{border-color:#6C63FF;box-shadow:0 0 0 2px rgba(108,99,255,.1)}
.pro-banner{background:linear-gradient(135deg,#0F172A,#1E293B);color:#fff;padding:28px;text-align:center;border-radius:0 0 var(--rl) var(--rl);margin-bottom:12px}
/* Animations */
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes popIn{0%{opacity:0;transform:scale(.85)}60%{transform:scale(1.03)}100%{opacity:1;transform:scale(1)}}
.anim-fi{animation:fadeIn .3s var(--ease)}.anim-su{animation:slideUp .4s var(--ease)}.anim-pop{animation:popIn .3s var(--ease)}
.card{animation:fadeIn .35s var(--ease) both}.card:nth-child(2){animation-delay:.04s}.card:nth-child(3){animation-delay:.08s}.card:nth-child(4){animation-delay:.12s}.card:nth-child(5){animation-delay:.16s}.card:nth-child(6){animation-delay:.2s}
/* Fullscreen gallery */
.gallery-fs{position:fixed;inset:0;background:rgba(0,0,0,.96);z-index:300;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease}
.gallery-fs img{max-width:90vw;max-height:85vh;object-fit:contain;border-radius:12px;animation:popIn .3s ease}
.gallery-fs .gf-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.1);backdrop-filter:blur(12px);border:none;color:#fff;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;transition:background .2s}.gallery-fs .gf-nav:hover{background:rgba(255,255,255,.2)}
.gallery-fs .gf-nav.l{left:20px}.gallery-fs .gf-nav.r{right:20px}
.gallery-fs .gf-close{position:absolute;top:20px;right:20px;background:rgba(255,255,255,.1);backdrop-filter:blur(12px);border:none;color:#fff;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s}.gallery-fs .gf-close:hover{background:rgba(255,255,255,.2)}
.gallery-fs .gf-counter{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.6);font-size:13px;font-weight:600}
/* Chatbot */
.chatbot-btn{position:fixed;bottom:84px;right:20px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--p),#FF8A5C);color:#fff;border:none;box-shadow:0 8px 28px rgba(255,90,95,.35);cursor:pointer;z-index:80;display:flex;align-items:center;justify-content:center;font-size:24px;transition:all .3s var(--ease);animation:popIn .5s ease}
.chatbot-btn:hover{transform:scale(1.12);box-shadow:0 12px 36px rgba(255,90,95,.4)}
.chatbot-w{position:fixed;bottom:84px;right:20px;width:360px;max-height:500px;background:var(--w);border-radius:var(--rl);box-shadow:var(--shl);z-index:85;display:flex;flex-direction:column;overflow:hidden;animation:slideUp .3s var(--ease);border:1px solid rgba(0,0,0,.04)}
.chatbot-hd{padding:16px 18px;background:linear-gradient(135deg,var(--p),#FF8A5C);color:#fff;display:flex;align-items:center;justify-content:space-between;border-radius:var(--rl) var(--rl) 0 0}
.chatbot-bd{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;max-height:360px}
.chatbot-msg{max-width:85%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.45;animation:fadeIn .2s ease}
.chatbot-msg.bot{background:var(--bg);color:var(--dk);align-self:flex-start;border-bottom-left-radius:4px}
.chatbot-msg.user{background:linear-gradient(135deg,var(--p),#FF8A5C);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.chatbot-ft{padding:12px;border-top:1px solid var(--bd);display:flex;gap:8px}
.chatbot-ft input{flex:1;border:1.5px solid var(--bd);border-radius:20px;padding:10px 14px;font-size:12px;outline:none;transition:border .2s}.chatbot-ft input:focus{border-color:var(--dk)}
.chatbot-ft button{background:linear-gradient(135deg,var(--p),#FF8A5C);color:#fff;border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;transition:transform .2s}.chatbot-ft button:hover{transform:scale(1.05)}
/* Shop */
.shop-hd{padding:32px;background:linear-gradient(135deg,var(--bg),var(--w));border-bottom:1px solid var(--bd);text-align:center}
.shop-av{width:72px;height:72px;border-radius:50%;background:var(--w);display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 10px;border:3px solid var(--bd)}
/* Badges */
.badge-g{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;font-size:10px;font-weight:700}
/* Recommendations */
.reco{padding:24px 28px;border-top:1px solid var(--bd);margin-top:12px;max-width:1520px;margin-left:auto;margin-right:auto;box-sizing:border-box}
.reco-sc{display:flex;gap:16px;overflow-x:auto;padding-bottom:12px;scrollbar-width:none}
.reco-sc::-webkit-scrollbar{display:none}
.reco-c{min-width:200px;cursor:pointer;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);border-radius:16px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.05);animation:fadeSlideIn 0.5s ease both;will-change:transform}
.reco-c:nth-child(1){animation-delay:0.05s}
.reco-c:nth-child(2){animation-delay:0.1s}
.reco-c:nth-child(3){animation-delay:0.15s}
.reco-c:nth-child(4){animation-delay:0.2s}
.reco-c:nth-child(5){animation-delay:0.25s}
.reco-c:nth-child(6){animation-delay:0.3s}
.reco-c:nth-child(7){animation-delay:0.35s}
.reco-c:nth-child(8){animation-delay:0.4s}
.reco-c:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 12px 32px rgba(108,99,255,0.25)}
.reco-ci{width:200px;height:140px;border-radius:16px;object-fit:cover;display:block;transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);will-change:transform}
.reco-c:hover .reco-ci{transform:scale(1.08)}
/* Push notification */
.push{position:fixed;top:20px;right:20px;background:var(--w);border-radius:var(--rl);box-shadow:0 12px 40px rgba(0,0,0,.15);padding:16px 20px;z-index:400;max-width:360px;display:flex;gap:14px;align-items:center;animation:slideUp .4s var(--ease);border:1px solid rgba(0,0,0,.06)}
.push-close{background:none;border:none;color:var(--gl);cursor:pointer;font-size:16px;flex-shrink:0}
/* Stats */
.stat-bar{display:flex;align-items:flex-end;gap:3px;height:80px}.stat-b{flex:1;background:linear-gradient(var(--acc),var(--p));border-radius:4px 4px 0 0;min-height:4px;transition:height .6s var(--ease)}
/* Wallet */
.wallet-c{background:linear-gradient(135deg,#1A1A2E,#16213E);color:#fff;border-radius:var(--rl);padding:24px;margin-bottom:20px;box-shadow:var(--shm)}
.wallet-bal{font-family:var(--fd);font-size:36px;font-weight:700;letter-spacing:-.02em}
/* Splash */
.splash{position:fixed;inset:0;background:linear-gradient(160deg,#6C63FF 0%,#7c5ce7 35%,#5a7fff 65%,#4ECDC4 100%);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column}
.splash-logo{width:88px;height:88px;background:#fff;border-radius:24px;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;color:#6C63FF;font-family:var(--fd);box-shadow:0 16px 48px rgba(0,0,0,.15);animation:pulse 1.5s ease infinite}
.splash h2{color:#fff;font-family:var(--fd);font-size:28px;margin-top:20px;letter-spacing:-.01em}
.splash p{color:rgba(255,255,255,.75);font-size:13px;margin-top:8px}
/* Page transitions */
.page-tr{animation:pageIn .4s var(--ease)}@keyframes pageIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
/* Time slots */
.ts{display:flex;gap:5px;flex-wrap:wrap;margin:8px 0}.ts-btn{padding:6px 12px;border:1.5px solid var(--bd);border-radius:10px;font-size:11px;font-weight:600;background:var(--w);cursor:pointer;transition:all .2s var(--ease)}.ts-btn:hover{border-color:var(--dk)}.ts-btn.on{background:var(--dk);color:#fff;border-color:var(--dk)}
/* Chat enhanced */
.typing{display:flex;gap:4px;padding:10px 14px;align-self:flex-start}.typing span{width:6px;height:6px;border-radius:50%;background:var(--gl);animation:typing 1.2s ease infinite}.typing span:nth-child(2){animation-delay:.2s}.typing span:nth-child(3){animation-delay:.4s}@keyframes typing{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-5px)}}
.online-dot{width:9px;height:9px;border-radius:50%;background:#22C55E;border:2px solid var(--w);position:absolute;bottom:-1px;right:-1px}
/* Bid */
.bid-bar{display:flex;gap:8px;align-items:center;padding:10px 14px;background:linear-gradient(135deg,#FEF3C7,#FFFBEB);border-radius:12px;margin:8px 0}
/* History */
.hist-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--bd);align-items:center;font-size:12px}
/* Range slider */
.range-sl{-webkit-appearance:none;width:100%;height:4px;border-radius:4px;background:var(--bd);outline:none}.range-sl::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--p);cursor:pointer;box-shadow:0 2px 8px rgba(255,90,95,.3)}
@media(max-width:768px){
  /* Chatbot */
  .chatbot-w{right:10px;left:10px;width:auto;bottom:74px}
  .chatbot-btn{bottom:76px;right:14px;width:50px;height:50px;font-size:20px}
  /* Header simplifié : logo + search réduite + profil seulement */
  .hi{padding:0 12px;height:58px;gap:8px}
  .mode-sw{display:none}
  .sb{margin:0;max-width:none;flex:1;height:42px}
  .sb .ss:first-child{font-size:12px;padding:0 10px;border-right:none}
  .ss:nth-child(2),.ss:nth-child(3){display:none}
  .sbb{width:28px;height:28px;margin-right:6px}
  .nr .nb{display:none}
  /* Logo */
  .lt{font-size:18px}
  .lc{width:30px;height:30px;font-size:14px}
  /* Catégories : chips lisibles avec scroll horizontal */
  .cw{padding:2px 10px 6px}
  .ct{padding:8px 12px;min-width:58px;border-bottom-width:2px}
  .cti{font-size:22px}
  .ctl{font-size:10px}
  .fb{padding:8px 12px;font-size:11px}
  /* Grille 2 colonnes fixes */
  .grid{padding:10px 10px 80px;gap:10px;grid-template-columns:repeat(2,1fr)}
  /* Cards sur mobile */
  .cbn{font-size:13px}.cbp{font-size:13px}.cbl{font-size:11px}
  /* Detail */
  .dimgs{grid-template-columns:1fr;grid-template-rows:260px;padding:0;border-radius:var(--r)}.dimg0{grid-row:auto;border-radius:var(--r);height:260px}.dimgs .dimg1,.dimgs .dimg2{display:none}
  .dc{padding:12px;gap:14px}.dh{padding:10px 12px}
  /* Hero stats */
  .hero-stats{gap:14px;padding:12px}
  .hero-stat-n{font-size:17px}
  /* Footer */
  .ftg{grid-template-columns:1fr 1fr}.ft{padding:20px 12px}
  /* Profile */
  .prof{padding:14px}.ph{flex-direction:column;text-align:center}
  /* Dashboard KPIs : 2 colonnes sur mobile */
  .dboard-grid{grid-template-columns:repeat(2,1fr) !important}
}
/* Onboarding */
.ob-step{animation:popIn .35s var(--ease)}
/* Hero stats */
.hero-stats{display:flex;justify-content:center;gap:32px;padding:18px 28px;background:rgba(0,0,0,.18);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);flex-wrap:wrap}
.hero-stat{text-align:center;color:#fff;animation:fadeSlideUp 0.6s ease both;will-change:transform}
.hero-stat:nth-child(1){animation-delay:0.1s}
.hero-stat:nth-child(2){animation-delay:0.2s}
.hero-stat:nth-child(3){animation-delay:0.3s}
.hero-stat:nth-child(4){animation-delay:0.4s}
.hero-stat-n{font-family:var(--fd);font-size:22px;font-weight:800;display:block;letter-spacing:-.02em;line-height:1.1;background:linear-gradient(270deg,#fff,rgba(255,255,255,0.8),#fff);background-size:300% 100%;animation:gradShift 3s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-stat-l{font-size:11px;opacity:.75;font-weight:500;display:block;margin-top:2px}
@media(max-width:600px){.hero-stats{gap:18px;padding:14px 16px}.hero-stat-n{font-size:18px}}
/* Toast stack */
.toast-stack{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);z-index:500;display:flex;flex-direction:column-reverse;gap:8px;align-items:center;pointer-events:none}
.t2{padding:12px 18px;border-radius:14px;font-size:13px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.2);display:flex;align-items:center;gap:9px;animation:tu .35s var(--ease);white-space:nowrap;pointer-events:all;max-width:360px}
.t2-s{background:#059669;color:#fff}.t2-b{background:linear-gradient(135deg,#FF5A5F,#FF8A5C);color:#fff}.t2-i{background:var(--dk);color:#fff}.t2-e{background:#DC2626;color:#fff}.t2-w{background:#D97706;color:#fff}
@media(max-width:768px){.toast-stack{bottom:80px;max-width:88vw}.t2{white-space:normal;justify-content:center}}
/* Detail map */
.detail-map{border-radius:12px;overflow:hidden;border:1px solid var(--bd);margin-top:8px}
/* Dashboard charts */
.dboard-chart{background:var(--w);border:1px solid var(--bd);border-radius:var(--rl);padding:20px;margin-bottom:0}
/* PRO badge on avatar */
.pro-avatar-badge{position:absolute;bottom:-4px;right:-4px;background:linear-gradient(135deg,#F59E0B,#D97706);color:#fff;font-size:9px;font-weight:800;padding:3px 7px;border-radius:20px;border:2px solid #fff;letter-spacing:.05em;box-shadow:0 2px 8px rgba(217,119,6,.4);z-index:3}
/* Auth PRO card amber */
.auth-pro-card-active{border-color:#D97706!important;background:#FFFBEB!important}
.auth-pro-tag{background:#FEF3C7;color:#92400E;font-size:9px;padding:2px 7px;border-radius:5px;font-weight:600}
/* Gestion Pro */
.gestion-tab-active{border-bottom:2.5px solid #D97706!important;color:#D97706!important}
/* Distance badge on card */
.card-dist{position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.6);color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;backdrop-filter:blur(6px);z-index:4;letter-spacing:.02em}
/* Footer responsive */
.footer-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:32px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.15)}
.footer-sec-links{}
@media(max-width:680px){.footer-grid{grid-template-columns:repeat(2,1fr);gap:20px;}.footer-grid-full{grid-template-columns:1fr!important;}.footer-sec-hdr{cursor:pointer;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:8px;margin-bottom:0!important;}.footer-sec-links{overflow:hidden;max-height:0;transition:max-height .3s ease;}.footer-sec-links.open{max-height:300px;}}
`;

/* ========== COMPONENTS ========== */
function Carousel({images,onClick}){const[c,setC]=useState(0);return <div className="ciw"><img className="cimg" src={images[c]} alt="" loading="lazy" onClick={onClick}/>{images.length>1&&<><button className="nav l" onClick={e=>{e.stopPropagation();setC(x=>(x-1+images.length)%images.length)}}><I.Chv d="l"/></button><button className="nav r" onClick={e=>{e.stopPropagation();setC(x=>(x+1)%images.length)}}><I.Chv d="r"/></button><div className="dts">{images.map((_,i)=><div key={i} className={"dt"+(i===c?" on":"")}/>)}</div></>}</div>}

function Card({item,onOpen,favs,dispatch,onAuthRequired,userLocation}){
  const dist=(userLocation&&LL[item.location])?Math.round(haversine(userLocation.lat,userLocation.lng,LL[item.location][0],LL[item.location][1])):null;
  return <div className={"card"+(item.isPro?" pro-card":"")} onClick={()=>onOpen(item)}>
  <Carousel images={item.images} onClick={()=>onOpen(item)}/>
  <button className="cfav" onClick={e=>{e.stopPropagation();if(onAuthRequired){onAuthRequired();return;}dispatch({type:"TOG_FAV",id:item.id,ownerId:item.owner?.id,title:item.title})}}><I.Heart f={favs.has(item.id)}/></button>
  {item.isPro&&<div className="pro-badge">PRO</div>}
  {item.owner?.verified&&<div className="cbdg">✓</div>}
  {dist!==null&&<div className="card-dist">📍 {dist} km</div>}
  <div className="card-cta">Voir l'annonce →</div>
  <div className="cbo">
    <div className="cbt"><span className="cbn">{item.title}</span><span className="cbr">⭐ {item.rating}</span></div>
    <div className="cbl">📍 {item.location}</div>
    <div className="cbp-row">
      <div className="cbp">{item.price} €<span> / jour</span></div>
      <span className="cond-badge">{item.condition}</span>
    </div>
  </div>
</div>}

