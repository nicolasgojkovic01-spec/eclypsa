const BASE=['porte','fan','garde','boucher','brasier','graine','mycele','racines','pelerin','veilleur','collect','revenant'];
let S=JSON.parse(localStorage.getItem('eclypsa2')||'null')||{un:1,done:[],col:[...BASE],deck:[...BASE]};
let fi=1,B=null,sel=null;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem('eclypsa2',JSON.stringify(S))}
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('on'));$(id).classList.add('on')}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1300)}
function goMap(){show('map');renderMap()}

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

function unit(id,owner){let c=C[id];return{id,owner,n:c.n,f:c.f,a:c.a,h:c.h,m:c.h,c:c.c,reb:0}}

function startFight(){
 let f=F[fi-1];sel=null;
 B={r:1,transition:true,p:{hp:30,m:30,res:2,lvl:1,act:3,lan:[null,null,null],hand:S.deck.map(x=>unit(x,'p')),grave:[]},e:{hp:f.hp,m:f.hp,res:f.er||2,lvl:f.lvl||1,act:3,lan:[null,null,null],hand:enemyDeck(f.f).map(x=>unit(x,'e')),grave:[]},phase:0};
 if(f.start)B.e.lan[1]={...unit('garde','e'),h:5,m:5};
 if(f.seals)B.e.lan=[0,1,2].map(()=>({id:'seal',owner:'e',n:'Sceau scellé',f:'death',a:0,h:6,m:6,c:0}));
 show('fight');renderFight();announceRound(1,true);
}

function enemyDeck(f){return f==='nature'?['graine','mycele','racines','graine','racines','mycele']:f==='death'?['pelerin','veilleur','collect','revenant','pelerin','mere']:['garde','fan','boucher','brasier','porte','colosse']}
function pips(n){return[0,1,2].map(i=>`<i class="pip ${i<n?'on':''}"></i>`).join('')}

function renderFight(){
 if(!B)return;let p=B.p,e=B.e;
 $('round').textContent=`ROUND ${B.r}`;$('phaseText').textContent=`${p.act} action${p.act>1?'s':''} restante${p.act>1?'s':''}`;$('pips').innerHTML=pips(p.act);
 $('eName').textContent=F[fi-1].e;$('eFill').style.width=(100*Math.max(0,e.hp)/e.m)+'%';$('pFill').style.width=(100*Math.max(0,p.hp)/p.m)+'%';$('eHp').textContent=`${Math.max(0,e.hp)}/${e.m} · Niveau ${e.lvl}`;$('pHp').textContent=`${Math.max(0,p.hp)}/${p.m} · Niveau ${p.lvl}`;$('eRes').textContent=e.res;$('pRes').textContent=p.res;
 $('eLanes').innerHTML=e.lan.map((u,i)=>lane(u,i,'e')).join('');$('pLanes').innerHTML=p.lan.map((u,i)=>lane(u,i,'p')).join('');$('ars').innerHTML=p.hand.map(card).join('');
 $('hint').textContent=B.transition?'Transition de round…':p.act?'1. Touche une carte pour comprendre son rôle. 2. Pose-la sur une voie libre, ou canalise / élève-toi.':'Tes actions sont terminées. Résolution en cours.';
 document.querySelectorAll('#ars .card').forEach(x=>x.onclick=()=>selectCard(x.dataset.id));
 document.querySelectorAll('#pLanes .lane').forEach(x=>x.onclick=()=>place(+x.dataset.i));
 renderCardInfo();
}

function lane(u,i,s){return `<div class="lane ${s==='p'&&sel&&!u?'sel':''}" data-i="${i}">${u?unitHtml(u):''}</div>`}
function unitHtml(u){let sym=u.id==='seal'?'◇':(C[u.id]?.sym||'✦');return `<div class="unit ${u.f} art-${u.id}"><div class="uArt"><span class="artSigil">${sym}</span><span class="artBody"></span></div><div class="nm">${u.n}</div><div class="stats"><span>⚔ ${u.a}</span><span>♥ ${u.h}/${u.m}</span></div></div>`}

function card(u){
 let c=C[u.id],lock=B.p.res<u.c||B.p.act<1||!B.p.lan.some(x=>!x),selected=sel===u.id;
 return `<div class="card ${u.f} art-${u.id} ${lock?'lock':''} ${selected?'selected':''}" data-id="${u.id}"><div class="cost">${u.c}</div><div class="cArt"><span class="artSigil">${c.sym}</span><span class="artBody"></span><span class="tag">${c.tag}</span></div><div class="cn">${u.n}</div><div class="cs"><span>⚔${u.a}</span><span>♥${u.h}</span></div></div>`;
}

function selectCard(id){if(!B||B.transition)return;sel=id;renderFight()}

function renderCardInfo(){
 if(!$('cardInfo'))return;
 if(!sel||!C[sel]){$('cardInfo').innerHTML='<div class="cardInfoEmpty">Sélectionne une carte pour voir précisément ce qu’elle apporte.</div>';return}
 let c=C[sel],missing=Math.max(0,c.c-B.p.res),can=B.p.act>0&&missing===0&&B.p.lan.some(x=>!x);
 $('cardInfo').innerHTML=`<div class="miniArt ${c.f} art-${sel}"><span class="artSigil">${c.sym}</span><span class="artBody"></span></div><div class="ciText"><div class="ciTop"><b>${c.n}</b><span class="role">${c.tag}</span></div><div class="ciStats"><span>◆ ${c.c} coût</span><span>⚔ ${c.a} attaque</span><span>♥ ${c.h} vie</span></div><div class="ciDesc">${c.d}</div><div class="ciRole"><b>Pourquoi la jouer :</b> ${c.r}</div><div class="ciState ${can?'ok':'no'}">${can?'PRÊTE — choisis une voie libre':missing?`Il te manque ${missing} ressource${missing>1?'s':''}.`:B.p.act<1?'Plus d’action ce round.':'Aucune voie libre.'}</div></div>`;
}

function place(i){
 if(!B||B.transition||!sel||B.p.lan[i])return;
 let ix=B.p.hand.findIndex(x=>x.id===sel),u=B.p.hand[ix];
 if(!u||u.c>B.p.res||B.p.act<1)return toast('Impossible pour le moment');
 B.p.res-=u.c;B.p.act--;B.p.lan[i]=u;B.p.hand.splice(ix,1);sel=null;ai();
}
function channel(){if(!B||B.transition)return;if(B.p.act<1)return;B.p.res++;B.p.act--;toast('+1 ressource');ai()}
function levelUp(){if(!B||B.transition)return;let c=B.p.lvl+1;if(B.p.act<1||B.p.lvl>=3||B.p.res<c)return toast('Élévation indisponible');B.p.res-=c;B.p.lvl++;B.p.act--;toast('Niveau '+B.p.lvl);ai()}
function passTurn(){if(!B||B.transition)return;B.p.act=0;while(B.e.act>0)aiOne();resolve()}
function ai(){aiOne();renderFight();if(B.p.act<=0){while(B.e.act>0)aiOne();resolve()}}
function aiOne(){if(B.e.act<1)return;let i=B.e.lan.findIndex(x=>!x),u=B.e.hand.filter(x=>x.c<=B.e.res)[0];if(i>=0&&u){B.e.res-=u.c;B.e.act--;B.e.lan[i]=u;B.e.hand.splice(B.e.hand.indexOf(u),1)}else{B.e.res++;B.e.act--}}
function kill(s,i){let x=B[s].lan[i];if(!x)return;B[s].lan[i]=null;if(F[fi-1].reb&&s==='e'&&!B.didReb&&x.id!=='seal'){B.didReb=1;x.h=x.m;B.e.hand.push(x)}else B[s].grave.push(x)}

function resolve(){
 B.transition=true;renderFight();
 for(let i=0;i<3;i++){let p=B.p.lan[i],e=B.e.lan[i];if(p&&e){p.h-=e.a;e.h-=p.a;if(p.h<=0)kill('p',i);if(e.h<=0)kill('e',i)}else if(p&&!e)B.e.hp-=p.a;else if(e&&!p)B.p.hp-=e.a}
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
 if(win){if(!S.done.includes(fi)){S.done.push(fi);S.un=Math.max(S.un,Math.min(10,fi+1));let reward=['graine','racines','pelerin','mycele','mere','veilleur','brasier','colosse','collect','mere'][fi-1];if(!S.col.includes(reward))S.col.push(reward);save()}$('rPanel').innerHTML=`<div class="rewardArt"></div><div><div class="sub">RÉCOMPENSE</div><h3 class="title" style="margin:4px 0">Nouvel Écho</h3><div style="font-size:11px;color:#c5bcaf">Une carte rejoint ta collection. La progression est sauvegardée automatiquement.</div></div>`;$('rBtn').textContent=fi===10?'Terminer le chapitre':'Continuer';$('rBtn').onclick=goMap}
 else{$('rPanel').innerHTML=`<div class="rewardArt"></div><div><h3 class="title">Réessaie</h3><div style="font-size:11px;color:#c5bcaf">Canalise plus tôt ou défends la voie la plus dangereuse.</div></div>`;$('rBtn').textContent='Réessayer';$('rBtn').onclick=startFight}
}

function renderDeck(){$('deckCount').textContent=S.deck.length+' / 12 CARTES';$('deckGrid').innerHTML=S.deck.map(id=>meta(id)).join('')}
function renderCollection(){$('colCount').textContent=S.col.length+' CARTES DÉCOUVERTES';$('colGrid').innerHTML=S.col.map(id=>meta(id)).join('')}
function meta(id){let c=C[id];return `<div class="meta ${c.f} art-${id}"><div class="metaArt"><span class="artSigil">${c.sym}</span><span class="artBody"></span></div><div class="metaBody"><div class="metaTitle"><b>${c.n}</b><span>${c.tag}</span></div><div class="sub">◆${c.c} · ⚔${c.a} · ♥${c.h}</div><p>${c.r}</p></div></div>`}
renderMap();
