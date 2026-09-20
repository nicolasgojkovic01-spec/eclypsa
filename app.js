const BASE=['porte','fan','garde','boucher','brasier','graine','mycele','racines','pelerin','veilleur','collect','revenant'];
let S=JSON.parse(localStorage.getItem('eclypsa2')||'null')||{un:1,done:[],col:[...BASE],deck:[...BASE]};
let fi=1,B=null,sel=null;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('eclypsa2',JSON.stringify(S))}
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('on'));$(id).classList.add('on')}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1300)}
function goMap(){show('map');renderMap()}
const factionName=f=>f==='fire'?'Cendres':f==='death'?'Nécropole':'Sylve';

function renderMap(){
 let h='';
 F.forEach((f,i)=>{let n=i+1,cl=S.done.includes(n)?'done':n===S.un?'cur':n>S.un?'lock':'';h+=`<button class="node ${cl}" ${n>S.un?'disabled':''} onclick="openFight(${n})"><span>${n}</span></button>`});
 $('nodes').innerHTML=h;
 let f=F[Math.min(S.un,10)-1];
 $('mapInfo').innerHTML=`<div class="sub">COMBAT ${Math.min(S.un,10)} / 10</div><h2 class="title" style="margin:4px 0">${f.t}</h2><div style="font-size:11px;color:#c5bcaf">${f.o}</div><button class="btn red" style="margin-top:8px" onclick="openFight(${Math.min(S.un,10)})">${S.done.includes(Math.min(S.un,10))?'Rejouer':'Commencer'}</button>`;
}

function openFight(n){
 fi=n;let f=F[n-1];show('pre');$('preN').textContent=`Combat ${n}/10`;$('encHero').className=`encHero ${f.f}`;$('encK').textContent=f.t.toUpperCase();$('encName').textContent=f.e;$('encQ').textContent=n===10?'« Tu pensais avoir compris ce monde. »':'« Chaque victoire laisse un écho. »';$('encM').innerHTML=`<b>Règle spéciale :</b> ${f.m}`;$('encO').textContent=f.o;
}

function unit(id,owner){let c=C[id];return{id,owner,n:c.n,f:c.f,a:c.a,h:c.h,m:c.h,c:c.c,armor:c.armor||0,reb:0}}
function token(owner){return{id:'token',owner,n:'Rejeton du Charnier',f:'death',a:1,h:1,m:1,c:0,armor:0,reb:0}}

function startFight(){
 let f=F[fi-1];sel=null;
 B={r:1,transition:true,p:{hp:30,m:30,res:2,lvl:1,act:3,lan:[null,null,null],hand:S.deck.map(x=>unit(x,'p')),grave:[]},e:{hp:f.hp,m:f.hp,res:f.er||2,lvl:f.lvl||1,act:3,lan:[null,null,null],hand:enemyDeck(f.f).map(x=>unit(x,'e')),grave:[]},phase:0};
 if(f.start)B.e.lan[1]={...unit('garde','e'),h:5,m:5};
 if(f.seals)B.e.lan=[0,1,2].map(()=>({id:'seal',owner:'e',n:'Sceau scellé',f:'death',a:0,h:6,m:6,c:0,armor:0}));
 show('fight');renderFight();announceRound(1,true);
}

function enemyDeck(f){return f==='nature'?['graine','mycele','racines','graine','racines','mycele']:f==='death'?['pelerin','veilleur','collect','revenant','pelerin','mere']:['garde','fan','boucher','brasier','porte','colosse']}
function pips(n){return[0,1,2].map(i=>`<i class="pip ${i<n?'on':''}"></i>`).join('')}

const ART={
porte:{bg:'#1a0907',a:'#ff6a2b',b:'#6b1e11',scene:'<circle cx="155" cy="118" r="42" fill="#ff8a3c" opacity=".16"/><path d="M120 330 L132 180 L151 138 L170 180 L184 330Z" fill="#0b090b"/><circle cx="151" cy="126" r="27" fill="#171013"/><path d="M194 270 C210 222 215 186 202 142 C229 173 236 225 221 282Z" fill="#ff6a2b" opacity=".82"/><path d="M206 151 C197 129 209 112 215 92 C230 120 225 141 216 159Z" fill="#ffd27a" opacity=".9"/>'},
fan:{bg:'#170807',a:'#ff4a26',b:'#4d0e09',scene:'<circle cx="150" cy="92" r="56" fill="#8a170d" opacity=".3"/><path d="M82 346 L112 214 L139 184 L168 201 L209 346Z" fill="#09090b"/><circle cx="151" cy="170" r="24" fill="#151015"/><path d="M90 258 L63 180 L80 133 L99 186Z" fill="#ff5a2b" opacity=".7"/><path d="M213 281 L230 198 L247 165 L239 248Z" fill="#ffb04a" opacity=".65"/><path d="M66 335 Q150 284 238 336" stroke="#ff4a26" stroke-width="7" fill="none" opacity=".5"/>'},
garde:{bg:'#120d0b',a:'#d4773f',b:'#493124',scene:'<circle cx="150" cy="100" r="72" fill="#d4773f" opacity=".1"/><path d="M91 345 L104 208 L125 160 L176 160 L199 208 L212 345Z" fill="#171514"/><path d="M111 208 L150 178 L190 208 L179 302 L150 329 L121 302Z" fill="#33251f" stroke="#d4773f" stroke-width="5"/><path d="M128 149 L150 110 L173 149Z" fill="#0d0c0d"/><path d="M74 320 L97 204" stroke="#f2c28d" stroke-width="8" opacity=".7"/>'},
boucher:{bg:'#1b0707',a:'#ff3828',b:'#5d1510',scene:'<path d="M72 357 L105 206 L132 165 L165 158 L198 215 L225 357Z" fill="#0b090b"/><circle cx="149" cy="146" r="26" fill="#171014"/><path d="M191 98 L213 113 L172 274 L150 263Z" fill="#d7c1a5"/><path d="M207 106 L239 118 L231 143 L201 133Z" fill="#8b8b8b"/><path d="M74 212 C105 183 127 179 150 194" stroke="#ff3828" stroke-width="6" fill="none"/><circle cx="149" cy="146" r="5" fill="#ff4c32"/><circle cx="160" cy="146" r="5" fill="#ff4c32"/>'},
brasier:{bg:'#160909',a:'#ff7a32',b:'#401010',scene:'<circle cx="150" cy="227" r="92" fill="none" stroke="#ff7a32" stroke-width="7" opacity=".38"/><circle cx="150" cy="227" r="62" fill="none" stroke="#ffb24f" stroke-width="3" opacity=".35"/><path d="M150 125 L169 203 L235 229 L169 251 L150 329 L132 251 L65 229 L132 203Z" fill="#ff5729" opacity=".24"/><path d="M124 339 L137 204 L150 171 L165 204 L178 339Z" fill="#08090b"/><circle cx="150" cy="163" r="24" fill="#151014"/><path d="M140 157 L160 157" stroke="#ffd47a" stroke-width="5"/>'},
colosse:{bg:'#140806',a:'#ff5a24',b:'#51170e',scene:'<circle cx="150" cy="95" r="66" fill="#ff5a24" opacity=".13"/><path d="M52 365 L75 225 L105 164 L130 147 L169 147 L199 166 L229 225 L247 365Z" fill="#111012"/><path d="M107 168 L125 116 L174 116 L194 170Z" fill="#201513" stroke="#ff6d30" stroke-width="5"/><path d="M121 196 L95 272 M181 194 L212 273" stroke="#ff5a24" stroke-width="9" opacity=".75"/><path d="M134 145 L166 145" stroke="#ffc16e" stroke-width="5"/><path d="M84 331 L218 331" stroke="#ff5a24" stroke-width="10" opacity=".3"/>'},
graine:{bg:'#071308',a:'#8ed65e',b:'#1d4c22',scene:'<circle cx="150" cy="168" r="102" fill="#6fc24b" opacity=".09"/><path d="M150 334 C101 296 86 238 111 190 C126 160 141 126 150 83 C161 126 178 161 192 193 C214 243 196 299 150 334Z" fill="#192a18" stroke="#8ed65e" stroke-width="5"/><path d="M150 109 C138 169 139 230 150 302" stroke="#a9e475" stroke-width="4" fill="none"/><path d="M116 198 Q150 179 188 199 M108 238 Q150 220 194 240" stroke="#6aa74b" stroke-width="4" fill="none"/>'},
mycele:{bg:'#08100a',a:'#79d06c',b:'#22492a',scene:'<circle cx="106" cy="173" r="48" fill="#8acb79" opacity=".16"/><circle cx="196" cy="208" r="58" fill="#6bb65e" opacity=".12"/><path d="M70 340 Q84 245 118 214 Q145 187 168 222 Q198 173 228 214 Q249 250 250 340Z" fill="#121b14"/><path d="M96 198 Q114 142 139 198Z" fill="#a1d790"/><rect x="113" y="198" width="10" height="58" fill="#d2e7c9"/><path d="M164 222 Q190 150 218 222Z" fill="#6fbf65"/><rect x="188" y="221" width="12" height="72" fill="#c6dfbf"/><circle cx="78" cy="145" r="4" fill="#d7ffd2"/><circle cx="232" cy="158" r="5" fill="#b4ffae"/>'},
racines:{bg:'#061107',a:'#5fb34c',b:'#173a1d',scene:'<path d="M148 86 C113 126 103 167 115 203 C76 237 72 291 56 350 M151 86 C185 130 194 165 183 205 C224 235 228 292 245 350" stroke="#6bb85a" stroke-width="10" fill="none"/><path d="M149 92 L149 315" stroke="#2d5a2d" stroke-width="18"/><path d="M149 194 C111 204 91 181 73 152 M149 224 C191 230 211 208 232 178 M149 258 C105 276 90 303 70 338 M149 267 C192 277 214 305 239 343" stroke="#8fd270" stroke-width="6" fill="none"/><circle cx="149" cy="128" r="26" fill="#0b130d"/><circle cx="139" cy="126" r="4" fill="#a9f38d"/><circle cx="159" cy="126" r="4" fill="#a9f38d"/>'},
pelerin:{bg:'#090912',a:'#8d72b8',b:'#2d2348',scene:'<circle cx="150" cy="91" r="66" fill="#8d72b8" opacity=".12"/><path d="M87 353 L111 219 L125 163 L176 163 L194 220 L216 353Z" fill="#0d0d14"/><path d="M119 159 Q150 101 182 159 L174 205 L126 205Z" fill="#17131e"/><path d="M131 177 L165 177" stroke="#9e7bd0" stroke-width="4"/><path d="M95 305 L65 238 M205 304 L238 235" stroke="#c8b5df" stroke-width="5"/><path d="M61 237 L74 230 L84 250 L70 257Z" fill="#c8b5df"/>'},
veilleur:{bg:'#080a12',a:'#7159a5',b:'#24213c',scene:'<circle cx="150" cy="102" r="72" fill="#8e78c1" opacity=".1"/><path d="M87 352 L100 213 L120 169 L180 169 L201 214 L215 352Z" fill="#0c0d13"/><path d="M118 168 L128 122 L150 105 L173 123 L183 168Z" fill="#161622" stroke="#7258a5" stroke-width="4"/><rect x="78" y="228" width="34" height="97" rx="4" fill="#1c1a27" stroke="#7159a5" stroke-width="4"/><path d="M95 229 L95 176" stroke="#b2a2cf" stroke-width="7"/><circle cx="95" cy="168" r="11" fill="#826bb3"/>'},
collect:{bg:'#090812',a:'#9b67cf',b:'#302044',scene:'<circle cx="204" cy="119" r="52" fill="#a679dd" opacity=".13"/><path d="M83 354 L106 221 L124 168 L178 168 L198 220 L220 354Z" fill="#0c0b12"/><circle cx="150" cy="151" r="27" fill="#17121d"/><path d="M204 214 L224 164 L244 214 L236 295 L212 295Z" fill="#23182f" stroke="#9b67cf" stroke-width="4"/><circle cx="224" cy="203" r="17" fill="#b781eb" opacity=".65"/><circle cx="83" cy="120" r="11" fill="#a979d7" opacity=".5"/><circle cx="61" cy="157" r="7" fill="#d6b1ff" opacity=".4"/><circle cx="248" cy="112" r="6" fill="#d6b1ff" opacity=".5"/>'},
revenant:{bg:'#070a11',a:'#6b79c8',b:'#20284a',scene:'<circle cx="150" cy="104" r="70" fill="#7686d9" opacity=".12"/><path d="M70 350 L108 209 L126 170 L176 170 L195 210 L231 350Z" fill="#0c0e17"/><path d="M121 168 L131 118 L150 98 L170 119 L180 168Z" fill="#171a27"/><path d="M133 143 L167 143" stroke="#a9b3ff" stroke-width="5"/><path d="M150 178 L150 328" stroke="#6f80d7" stroke-width="4" opacity=".7"/><path d="M104 228 C72 225 56 209 39 188 M195 231 C227 226 244 208 260 185" stroke="#7180c8" stroke-width="5" fill="none" opacity=".45"/>'},
mere:{bg:'#0a0710',a:'#a85ab7',b:'#3d1e49',scene:'<circle cx="150" cy="103" r="78" fill="#a85ab7" opacity=".11"/><path d="M57 359 L95 232 L118 171 L182 171 L205 232 L243 359Z" fill="#0d0a11"/><circle cx="150" cy="148" r="31" fill="#19101b"/><path d="M120 160 Q150 103 181 160" fill="none" stroke="#bf7bc7" stroke-width="6"/><path d="M102 227 C59 205 44 173 37 139 M198 227 C242 205 256 174 265 139 M110 252 C61 260 42 289 28 324 M190 252 C238 260 258 291 273 324" stroke="#9b58aa" stroke-width="7" fill="none"/><circle cx="139" cy="147" r="4" fill="#ffd0ff"/><circle cx="160" cy="147" r="4" fill="#ffd0ff"/>'}
};
function artSvg(id){
 if(id==='seal')return '<svg viewBox="0 0 300 420" aria-hidden="true"><rect width="300" height="420" fill="#090812"/><circle cx="150" cy="205" r="98" fill="none" stroke="#7759a5" stroke-width="10"/><path d="M150 100 L220 205 L150 310 L80 205Z" fill="none" stroke="#b090df" stroke-width="7"/><circle cx="150" cy="205" r="24" fill="#6f55a0"/></svg>';
 if(id==='token')return '<svg viewBox="0 0 300 420" aria-hidden="true"><rect width="300" height="420" fill="#0b0810"/><circle cx="150" cy="120" r="55" fill="#8f55a6" opacity=".18"/><path d="M96 350 L118 211 L150 172 L183 211 L207 350Z" fill="#100b14"/><circle cx="150" cy="155" r="31" fill="#241127"/><path d="M137 152 L163 152" stroke="#e2a7ea" stroke-width="5"/></svg>';
 let x=ART[id]||ART.porte;return `<svg viewBox="0 0 300 420" aria-hidden="true"><rect width="300" height="420" fill="${x.bg}"/><circle cx="55" cy="58" r="92" fill="${x.a}" opacity=".06"/><circle cx="262" cy="360" r="120" fill="${x.b}" opacity=".18"/><path d="M0 365 Q75 330 150 355 T300 360 V420 H0Z" fill="#050609"/>${x.scene}<path d="M0 22 H300 M0 397 H300" stroke="${x.a}" stroke-width="3" opacity=".25"/><circle cx="38" cy="382" r="3" fill="${x.a}"/><circle cx="270" cy="53" r="4" fill="${x.a}" opacity=".8"/></svg>`}

function renderFight(){
 if(!B)return;let p=B.p,e=B.e;
 $('round').textContent=`ROUND ${B.r}`;$('phaseText').textContent=`${p.act} action${p.act>1?'s':''} restante${p.act>1?'s':''}`;$('pips').innerHTML=pips(p.act);
 $('eName').textContent=F[fi-1].e;$('eFill').style.width=(100*Math.max(0,e.hp)/e.m)+'%';$('pFill').style.width=(100*Math.max(0,p.hp)/p.m)+'%';$('eHp').textContent=`${Math.max(0,e.hp)}/${e.m} · Niveau ${e.lvl}`;$('pHp').textContent=`${Math.max(0,p.hp)}/${p.m} · Niveau ${p.lvl}`;$('eRes').textContent=e.res;$('pRes').textContent=p.res;
 $('eLanes').innerHTML=e.lan.map((u,i)=>lane(u,i,'e')).join('');$('pLanes').innerHTML=p.lan.map((u,i)=>lane(u,i,'p')).join('');$('ars').innerHTML=p.hand.map(card).join('');
 $('hint').textContent=B.transition?'Transition de round…':p.act?'Touche une carte pour lire ses statistiques et ses effets, puis choisis une voie libre.':'Tes actions sont terminées. Résolution en cours.';
 document.querySelectorAll('#ars .card').forEach(x=>x.onclick=()=>selectCard(x.dataset.id));
 document.querySelectorAll('#pLanes .lane').forEach(x=>x.onclick=()=>place(+x.dataset.i));
 renderCardInfo();
}

function lane(u,i,s){return `<div class="lane ${s==='p'&&sel&&!u?'sel':''}" data-i="${i}">${u?unitHtml(u):''}</div>`}
function unitHtml(u){let sym=u.id==='seal'?'◇':u.id==='token'?'✣':(C[u.id]?.sym||'✦');return `<div class="unit ${u.f} art-${u.id}"><div class="uArt richArt">${artSvg(u.id)}<span class="unitSigil">${sym}</span></div><div class="nm">${u.n}</div><div class="stats"><span>⚔ ${u.a}</span><span>${u.armor?'🛡 '+u.armor:'♥ '+u.h+'/'+u.m}</span></div></div>`}

function card(u){
 let c=C[u.id],lock=B.p.res<u.c||B.p.act<1||!B.p.lan.some(x=>!x),selected=sel===u.id;
 return `<div class="card ${u.f} art-${u.id} ${lock?'lock':''} ${selected?'selected':''}" data-id="${u.id}"><div class="cost">${u.c}</div><div class="cArt richArt">${artSvg(u.id)}<span class="tag">${c.tag}</span></div><div class="cn">${u.n}</div><div class="cs"><span>⚔${u.a}</span><span>♥${u.h}</span></div></div>`;
}

function selectCard(id){if(!B||B.transition)return;sel=id;renderFight()}

function renderCardInfo(){
 if(!$('cardInfo'))return;
 if(!sel||!C[sel]){$('cardInfo').innerHTML='<div class="cardInfoEmpty">Sélectionne une carte pour afficher ses statistiques, ses mots-clés et ses effets exacts.</div>';return}
 let c=C[sel],missing=Math.max(0,c.c-B.p.res),can=B.p.act>0&&missing===0&&B.p.lan.some(x=>!x);
 let effects=(c.fx||[]).map(x=>`<div class="ciEffect"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')||'<div class="ciEffect"><b>Aucun effet</b><span>Cette carte repose uniquement sur ses statistiques.</span></div>';
 $('cardInfo').innerHTML=`<div class="detailArt ${c.f}">${artSvg(sel)}</div><div class="ciText"><div class="ciTop"><b>${c.n}</b><span class="role">${c.tag}</span></div><div class="ciMeta">${c.type} · Faction ${factionName(c.f)}</div><div class="ciStats"><span>◆ ${c.c} coût</span><span>⚔ ${c.a} ATQ</span><span>♥ ${c.h} PV</span>${c.armor?`<span>🛡 ${c.armor} armure</span>`:''}</div><div class="ciEffects"><div class="ciSection">EFFETS & MOTS-CLÉS</div>${effects}</div><div class="ciState ${can?'ok':'no'}">${can?'PRÊTE — choisis une voie libre':missing?`Il te manque ${missing} ressource${missing>1?'s':''}.`:B.p.act<1?'Plus d’action ce round.':'Aucune voie libre.'}</div></div>`;
}

function place(i){
 if(!B||B.transition||!sel||B.p.lan[i])return;
 let ix=B.p.hand.findIndex(x=>x.id===sel),u=B.p.hand[ix];
 if(!u||u.c>B.p.res||B.p.act<1)return toast('Impossible pour le moment');
 B.p.res-=u.c;B.p.act--;B.p.lan[i]=u;B.p.hand.splice(ix,1);sel=null;onPlay(u,i);if(check())return;ai();
}
function onPlay(u,i){
 const own=u.owner,opp=own==='p'?'e':'p',target=B[opp].lan[i];
 if(u.id==='porte'&&!target)B[opp].hp-=1;
 if(u.id==='boucher'&&target){target.h-=1;if(target.h<=0)kill(opp,i)}
 if(u.id==='colosse'){if(target){target.h-=2;if(target.h<=0)kill(opp,i)}else B[opp].hp-=2}
 if(u.id==='veilleur'&&target){u.m+=1;u.h+=1}
 if(u.id==='mere'){let j=B[own].lan.findIndex((x,k)=>!x&&k!==i);if(j>=0)B[own].lan[j]=token(own)}
}
function channel(){if(!B||B.transition)return;if(B.p.act<1)return;B.p.res++;B.p.act--;toast('+1 ressource');ai()}
function levelUp(){if(!B||B.transition)return;let c=B.p.lvl+1;if(B.p.act<1||B.p.lvl>=3||B.p.res<c)return toast('Élévation indisponible');B.p.res-=c;B.p.lvl++;B.p.act--;toast('Niveau '+B.p.lvl);ai()}
function passTurn(){if(!B||B.transition)return;B.p.act=0;while(B.e.act>0)aiOne();resolve()}
function ai(){aiOne();renderFight();if(B.p.act<=0){while(B.e.act>0)aiOne();resolve()}}
function aiOne(){if(B.e.act<1)return;let i=B.e.lan.findIndex(x=>!x),u=B.e.hand.filter(x=>x.c<=B.e.res)[0];if(i>=0&&u){B.e.res-=u.c;B.e.act--;B.e.lan[i]=u;B.e.hand.splice(B.e.hand.indexOf(u),1);onPlay(u,i)}else{B.e.res++;B.e.act--}}

function collectors(owner){B[owner].lan.forEach(u=>{if(u&&u.id==='collect')u.a+=1})}
function kill(s,i){
 let x=B[s].lan[i];if(!x)return;B[s].lan[i]=null;let owner=s,opp=s==='p'?'e':'p';
 if(x.id==='fan')B[opp].hp-=1;
 if(x.id==='pelerin')B[owner].hp=Math.min(B[owner].m,B[owner].hp+2);
 if(x.id==='revenant'&&!x.reb){x.reb=1;x.h=1;B[owner].hand.push(x)}
 else if(F[fi-1].reb&&s==='e'&&!B.didReb&&x.id!=='seal'){B.didReb=1;x.h=x.m;B.e.hand.push(x)}
 else B[s].grave.push(x);
 collectors(opp);
}

function endCardEffects(side){
 const L=B[side].lan;
 L.forEach(u=>{if(u&&u.id==='graine'){u.m+=1;u.h=Math.min(u.m,u.h+1)}});
 const heals=[];L.forEach((u,i)=>{if(u&&u.id==='mycele'){if(i>0&&L[i-1])heals.push(L[i-1]);if(i<2&&L[i+1])heals.push(L[i+1])}});heals.forEach(u=>u.h=Math.min(u.m,u.h+1));
}

function resolve(){
 B.transition=true;renderFight();
 for(let i=0;i<3;i++){
  let p=B.p.lan[i],e=B.e.lan[i];
  if(p&&e){
   let pd=Math.max(0,e.a-(p.armor||0)),ed=Math.max(0,p.a-(e.armor||0));p.h-=pd;e.h-=ed;
   let pAlive=p.h>0,eAlive=e.h>0;
   if(pAlive&&p.id==='brasier')p.a+=1;if(eAlive&&e.id==='brasier')e.a+=1;
   if(pAlive&&eAlive&&p.id==='racines')e.a=Math.max(0,e.a-1);if(pAlive&&eAlive&&e.id==='racines')p.a=Math.max(0,p.a-1);
   if(!pAlive)kill('p',i);if(!eAlive)kill('e',i);
  }else if(p&&!e)B.e.hp-=p.a;else if(e&&!p)B.p.hp-=e.a;
 }
 endCardEffects('p');endCardEffects('e');
 let f=F[fi-1];
 if(f.buff)B.e.lan.forEach(u=>{if(u){u.m++;u.h++}});
 if(f.storm&&(B.r===2||B.r===4))['p','e'].forEach(s=>B[s].lan.forEach((u,i)=>{if(u){u.h--;if(u.h<=0)kill(s,i)}}));
 if(f.boss&&!B.phase&&B.e.hp<=22&&B.e.hp>0){B.phase=1;toast('PHASE II');let i=B.e.lan.findIndex(x=>!x);if(i>=0){let u=unit('revenant','e');u.a+=2;u.h+=2;u.m+=2;B.e.lan[i]=u}}
 renderFight();
 if(check())return;
 if(f.surv&&B.r>=f.surv)return finish(1);
 const ended=B.r;B.r++;B.p.act=B.e.act=3;B.p.res=Math.min(9,B.p.res+1);B.e.res=Math.min(9,B.e.res+1);sel=null;
 roundTransition(ended,B.r);
}

function announceRound(n,first=false){
 const o=$('roundOverlay');$('roundOverlayLabel').textContent=`ROUND ${n}`;$('roundOverlaySub').textContent=first?'3 actions · Construis ton premier tour':'+1 ressource · 3 actions restaurées';o.classList.add('show','next');setTimeout(()=>{o.classList.remove('show','next');if(B){B.transition=false;renderFight()}},950);
}
function roundTransition(ended,next){
 const o=$('roundOverlay');$('roundOverlayLabel').textContent=`FIN DU ROUND ${ended}`;$('roundOverlaySub').textContent='Les trois voies viennent de se résoudre';o.classList.add('show','end');
 setTimeout(()=>{o.classList.remove('end');$('roundOverlayLabel').textContent=`ROUND ${next}`;$('roundOverlaySub').textContent='+1 ressource · 3 actions restaurées';o.classList.add('next');},650);
 setTimeout(()=>{o.classList.remove('show','next');if(B){B.transition=false;renderFight()}},1550);
}

function check(){if(F[fi-1].seals&&B.e.grave.filter(x=>x.id==='seal').length>=3){finish(1);return 1}if(B.p.hp<=0){finish(0);return 1}if(B.e.hp<=0){finish(1);return 1}return 0}

function finish(win){
 B.transition=false;show('result');$('rK').textContent=`COMBAT ${fi} / 10`;$('rTitle').textContent=win?'VICTOIRE':'DÉFAITE';
 if(win){if(!S.done.includes(fi)){S.done.push(fi);S.un=Math.max(S.un,Math.min(10,fi+1));let reward=['graine','racines','pelerin','mycele','mere','veilleur','brasier','colosse','collect','mere'][fi-1];if(!S.col.includes(reward))S.col.push(reward);save()}$('rPanel').innerHTML=`<div class="rewardArt">${artSvg(['graine','racines','pelerin','mycele','mere','veilleur','brasier','colosse','collect','mere'][fi-1])}</div><div><div class="sub">RÉCOMPENSE</div><h3 class="title" style="margin:4px 0">Nouvel Écho</h3><div style="font-size:11px;color:#c5bcaf">Une carte rejoint ta collection. La progression est sauvegardée automatiquement.</div></div>`;$('rBtn').textContent=fi===10?'Terminer le chapitre':'Continuer';$('rBtn').onclick=goMap}
 else{$('rPanel').innerHTML=`<div class="rewardArt">${artSvg('revenant')}</div><div><h3 class="title">Réessaie</h3><div style="font-size:11px;color:#c5bcaf">Lis les effets des cartes et adapte tes placements aux voies adverses.</div></div>`;$('rBtn').textContent='Réessayer';$('rBtn').onclick=startFight}
}

function renderDeck(){$('deckCount').textContent=S.deck.length+' / 12 CARTES';$('deckGrid').innerHTML=S.deck.map(id=>meta(id)).join('')}
function renderCollection(){$('colCount').textContent=S.col.length+' CARTES DÉCOUVERTES';$('colGrid').innerHTML=S.col.map(id=>meta(id)).join('')}
function meta(id){let c=C[id],fx=c.fx?.[0];return `<div class="meta ${c.f} art-${id}"><div class="metaArt richArt">${artSvg(id)}</div><div class="metaBody"><div class="metaTitle"><b>${c.n}</b><span>${c.tag}</span></div><div class="sub">◆${c.c} · ⚔${c.a} · ♥${c.h}${c.armor?` · 🛡${c.armor}`:''}</div><p><b>${fx?fx[0]+': ':''}</b>${fx?fx[1]:''}</p></div></div>`}
renderMap();
