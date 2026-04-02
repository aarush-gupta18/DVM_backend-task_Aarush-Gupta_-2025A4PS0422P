CAT_COLOR={Music:"#ff6b6b",Tech:"#6bf0ff",Dance:"#d86bff",Party:"#e8ff47"};
MAX_REG=Math.max(...events.map(e=>e.registrations));
totalReg=events.reduce((s,e)=>s+e.registrations,0);
byCat={};
events.forEach(e=>{byCat[e.category]=(byCat[e.category]||0)+e.registrations;});
topCat=Object.keys(byCat).reduce((a,b)=>byCat[a]>byCat[b]?a:b);
hotEv=events.reduce((a,b)=>a.registrations>b.registrations?a:b);
avgReg=Math.round(totalReg/events.length);
dayCount=[0,1,2].map(d=>events.filter(e=>e.day===d).length);
busiestDay=dayCount.indexOf(Math.max(...dayCount));
statCards=[
  {rank:"A", suit:"♥", color:"#ff6b6b", backTitle:"TOTAL EVENTS",backDesc:"Events across all days",icon:"", val:events.length,frontLbl:"Total Events",joker:false},
  {rank:"A", suit:"♠", color:"#e8ff47", backTitle:"MOST POPULAR",backDesc:"Highest single-event signups", icon:"", val:hotEv.name,frontLbl:"Most Popular",joker:false},
  {rank:"",  suit:"★", color:"#ff2d78",backTitle:"DVM JOKER",backDesc:"",icon:"",val:"", frontLbl:"",joker:true},
  {rank:"A", suit:"♦", color:CAT_COLOR[topCat], backTitle:"HOTTEST CATEGORY", backDesc:"Most-registered category",icon:"",val:topCat, frontLbl:"Top Category",joker:false},
  {rank:"A", suit:"♣", color:"#ff6b6b", backTitle:"BUSIEST DAY",backDesc:"Day with the most events",icon:"", val:"Day "+busiestDay,frontLbl:"Busiest Day",joker:false},
];
document.getElementById("deck").innerHTML = statCards.map(s => `
  <div class="poker-card${s.joker?' joker-card':''}" onclick="this.classList.toggle('flipped')">
    <div class="card-inner">

      <div class="card-face card-back" style="${s.joker?`background:linear-gradient(145deg,#1a000c,#0d0006);border-color:rgba(255,45,120,0.5);`:``}">
        <div class="back-pattern"></div>
        <div class="back-frame" style="${s.joker?`border-color:rgba(255,45,120,0.3);`:``}"></div>
        <div class="back-tl">
          ${s.joker
            ? `<span style="font-family:var(--ff-head);font-size:9px;letter-spacing:2px;line-height:1.65;color:${s.color};display:block;font-weight:900">J<br>O<br>K<br>E<br>R</span>`
            : `<span class="c-rank" style="color:${s.color}">${s.rank}</span><span class="c-suit" style="color:${s.color}">${s.suit}</span>`}
        </div>
        <div class="back-body">
          ${s.joker ? `
            <div class="joker-back-text">
              <div class="joker-apogee">APOGEE '26</div>
              <div class="joker-theme">UNDER STEEL SKIES</div>
            </div>
          ` : `
            <div class="back-suit-big" style="color:${s.color};filter:drop-shadow(0 0 10px ${s.color}88)">${s.suit}</div>
            <div class="back-stat-title" style="color:${s.color}">${s.backTitle}</div>
            <div class="back-desc">${s.backDesc}</div>
          `}
        </div>
        ${s.joker
          ? `<div class="back-br"><span style="font-family:var(--ff-head);font-size:10px;letter-spacing:2px;line-height:1.65;color:${s.color};display:block;font-weight:900">J<br>O<br>K<br>E<br>R</span></div>`
          : `<div class="back-br"><span class="c-rank" style="color:${s.color}">${s.rank}</span><span class="c-suit" style="color:${s.color}">${s.suit}</span></div>`}
        <div class="back-tap">tap to reveal ↩</div>
      </div>

      <div class="card-face card-front" style="${s.joker?`background:linear-gradient(145deg,#1a000c,#0d0006);border-color:rgba(255,45,120,0.4);`:``}">
        ${s.joker ? `
          <div class="dvm-front-wrap">
            <img class="dvm-logo-img" src="data:image/png;base64,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"/>
            <div class="dvm-dept-name">DEPARTMENT OF<br>VISUAL MEDIA</div>
          </div>
        ` : `
        <div class="front-tl">
          <span class="f-rank" style="color:${s.color}">${s.rank}</span>
          <span class="f-suit" style="color:${s.color}">${s.suit}</span>
        </div>
        <div class="front-mid">
          <div class="front-icon">${s.icon}</div>
          <div class="front-val" style="color:${s.color};font-size:${String(s.val).length>10?String(s.val).length>14?'14px':'18px':'26px'}">${s.val}</div>
          <div class="front-lbl">${s.frontLbl}</div>
        </div>
        <div class="front-br">
          <span class="f-rank" style="color:${s.color}">${s.rank}</span>
          <span class="f-suit" style="color:${s.color}">${s.suit}</span>
        </div>
        `}
      </div>

    </div>
  </div>
`).join("");
let filter="All", query="", sort="", lineup=[], activeDay=-1;
function renderFilters(){
  cats=["All",...new Set(events.map(e=>e.category))];
  document.getElementById("fbtns").innerHTML=cats
    .map(c=>`<button class="fbtn${c===filter?' active':''}" data-c="${c}">${c}</button>`)
    .join("");
  document.querySelectorAll(".fbtn").forEach(b=>b.addEventListener("click",()=>{
    filter=b.dataset.c;
    renderFilters();
    renderEvents();
  }));
}
function getList(){
  let r=[...events];
  if(activeDay>=0) r=r.filter(e=>e.day===activeDay);
  if(filter!=="All") r=r.filter(e=>e.category===filter);
  if(query.trim())   r=r.filter(e=>e.name.toLowerCase().includes(query.toLowerCase()));
  if(sort==="day")   r.sort((a,b)=>a.day-b.day);
  if(sort==="reg")   r.sort((a,b)=>b.registrations-a.registrations);
  return r;
}
function buildCard(ev){
  saved=lineup.some(e=>e.id===ev.id);
  pct=Math.round((ev.registrations/MAX_REG)*100);
  col=CAT_COLOR[ev.category]||"#e8ff47";
  return `<div class="ev-card">
    <div class="card-top">
      <div class="ev-name">${ev.name}</div>
      <button class="bmbtn${saved?' saved':''}" data-id="${ev.id}">${saved?'★':'☆'}</button>
    </div>
    <div class="badge" style="color:${col};border:1px solid ${col}44">${ev.category}</div>
    <div class="meta">
      <div class="mi">📅 Day <b>${ev.day}</b></div>
      <div class="mi">🕐 <b>${ev.time}</b></div>
      <div class="mi">📍 <b>${ev.venue}</b></div>
    </div>
    <div class="bar-wrap">
      <div class="bar-lbl"><span>Registrations</span><strong>${ev.registrations.toLocaleString()}</strong></div>
      <div class="bar-bg"><div class="bar-fill" style="width:${pct}%;background:linear-gradient(90deg,${col},${col}88)"></div></div>
    </div>
  </div>`;
}
function attachBM(c){
  c.querySelectorAll(".bmbtn").forEach(b=>b.addEventListener("click",()=>{
    const id=parseInt(b.dataset.id);
    const ev=events.find(e=>e.id===id);
    lineup=lineup.some(e=>e.id===id)?lineup.filter(e=>e.id!==id):[...lineup,ev];
    renderEvents(); renderLineup();
  }));
}
function renderEvents(){
  const g=document.getElementById("ev-grid"),e=document.getElementById("empty"),l=getList();
  if(!l.length){g.innerHTML="";e.classList.remove("hidden");}
  else{e.classList.add("hidden");g.innerHTML=l.map(buildCard).join("");}
  attachBM(g);
}
function renderLineup(){
  const g=document.getElementById("lu-grid"),l=document.getElementById("lu-lbl");
  if(!lineup.length){g.innerHTML="";l.classList.add("hidden");return;}
  l.classList.remove("hidden");
  g.innerHTML=lineup.map(buildCard).join("");
  attachBM(g);
}
document.getElementById("srch").addEventListener("input",e=>{query=e.target.value;renderEvents();});
document.getElementById("srt").addEventListener("change",e=>{sort=e.target.value;renderEvents();});
renderFilters(); 
renderEvents();
document.getElementById('day-all').classList.add('active');
function filterDay(d){activeDay=d;document.querySelectorAll('.day').forEach(el=>el.classList.toggle('active',parseInt(el.dataset.d)===d));renderEvents();}
