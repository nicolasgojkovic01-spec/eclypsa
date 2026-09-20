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
 let f=F[fi-1];sel=null;inspectedUnit=null;
 B={r:1,transition:true,p:{hp:30,m:30,res:2,lvl:1,act:3,lan:[null,null,null],hand:S.deck.map(x=>unit(x,'p')),grave:[]},e:{hp:f.hp,m:f.hp,res:f.er||2,lvl:f.lvl||1,act:3,lan:[null,null,null],hand:enemyDeck(f.f).map(x=>unit(x,'e')),grave:[]},phase:0};
 if(f.start)B.e.lan[1]={...unit('garde','e'),h:5,m:5};
 if(f.seals)B.e.lan=[0,1,2].map(()=>({id:'seal',owner:'e',n:'Sceau scellé',f:'death',a:0,h:6,m:6,c:0,armor:0}));
 show('fight');renderFight();announceRound(1,true);
}

function enemyDeck(f){return f==='nature'?['graine','mycele','racines','graine','racines','mycele']:f==='death'?['pelerin','veilleur','collect','revenant','pelerin','mere']:['garde','fan','boucher','brasier','porte','colosse']}
function pips(n){return[0,1,2].map(i=>`<i class="pip ${i<n?'on':''}"></i>`).join('')}

function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function cardArt(id){
 const name=C[id]?.n||(id==='token'?'Rejeton du Charnier':'Sceau scellé');
 return `<img class="cardIllustration" src="assets/cards/${CARD_ART[id]}.webp" alt="${escapeHtml(name)}" width="768" height="1024" decoding="async" draggable="false">`;
}
let inspectedUnit=null;
function inspectUnit(side,index){sel=null;inspectedUnit={side,index};renderFight()}
function describeCard(id,u=null){
 const c=C[id]||(id==='token'?{n:'Rejeton du Charnier',f:'death',c:0,a:1,h:1,type:'Unité invoquée',fx:[]}: {n:'Sceau scellé',f:'death',c:0,a:0,h:6,type:'Objectif',fx:[]});
 const current=u||{a:c.a,h:c.h,m:c.h,armor:c.armor||0};
 const buffs=[];
 if(current.a!==c.a)buffs.push(`${current.a>c.a?'+':''}${current.a-c.a} ATQ par rapport à la base`);
 if(current.m!==c.h)buffs.push(`${current.m>c.h?'+':''}${current.m-c.h} PV maximum par rapport à la base`);
 if(current.h<current.m)buffs.push(`${current.m-current.h} PV manquant${current.m-current.h>1?'s':''}`);
 if(current.armor)buffs.push(`Armure ${current.armor}`);
 if(id==='revenant'&&u?.reb)buffs.push('Réanimation déjà utilisée');
 const effects=(c.fx||[]).map(([keyword,effect])=>`<div class="ciEffect"><b>${escapeHtml(keyword)}</b><span>${escapeHtml(effect)}</span></div>`).join('')||'<p>Aucun effet de carte.</p>';
 return `<div class="detailArt ${c.f}">${cardArt(id)}</div><div class="ciText"><div class="ciTop"><b>${escapeHtml(c.n)}</b></div><div class="ciMeta">${c.type} · ${factionName(c.f)}</div><div class="ciStats"><span>Coût : ${u?.c??c.c}</span><span>ATQ : ${current.a}</span><span>PV : ${current.h}/${current.m}</span></div><div class="ciBuffs"><b>Buffs / état</b><span>${escapeHtml(buffs.join(' · ')||'Aucun modificateur actif')}</span></div></div><div class="ciMechanics"><div class="ciSection">MOTS-CLÉS ET EFFETS EXACTS</div>${effects}<div class="ciTrigger"><b>Déclencheur</b><span>${escapeHtml(CARD_TRIGGERS[id]||'Aucun déclencheur de carte.')}</span></div></div>`;
}
function openCardDetail(id){
 $('detailContent').innerHTML=describeCard(id);
 $('detailDialog').showModal();
}

function renderFight(){
 if(!B)return;let p=B.p,e=B.e;
 $('round').textContent=`ROUND ${B.r}`;$('phaseText').textContent=`${p.act} action${p.act>1?'s':''} restante${p.act>1?'s':''}`;$('pips').innerHTML=pips(p.act);
 $('eName').textContent=F[fi-1].e;$('eFill').style.width=(100*Math.max(0,e.hp)/e.m)+'%';$('pFill').style.width=(100*Math.max(0,p.hp)/p.m)+'%';$('eHp').textContent=`${Math.max(0,e.hp)}/${e.m} · Niveau ${e.lvl}`;$('pHp').textContent=`${Math.max(0,p.hp)}/${p.m} · Niveau ${p.lvl}`;$('eRes').textContent=e.res;$('pRes').textContent=p.res;
 $('eLanes').innerHTML=e.lan.map((u,i)=>lane(u,i,'e')).join('');$('pLanes').innerHTML=p.lan.map((u,i)=>lane(u,i,'p')).join('');$('ars').innerHTML=p.hand.map(card).join('');
 $('hint').textContent=B.transition?'Transition de round…':p.act?'Touche une carte pour lire ses statistiques et ses effets, puis choisis une voie libre.':'Tes actions sont terminées. Résolution en cours.';
 document.querySelectorAll('#ars .card').forEach(x=>x.onclick=()=>selectCard(x.dataset.id));
 document.querySelectorAll('#pLanes .lane').forEach(x=>x.onclick=()=>B.p.lan[+x.dataset.i]?inspectUnit('p',+x.dataset.i):place(+x.dataset.i));
 document.querySelectorAll('#eLanes .lane').forEach(x=>x.onclick=()=>{if(B.e.lan[+x.dataset.i])inspectUnit('e',+x.dataset.i)});
 renderCardInfo();
}

function lane(u,i,s){return `<div class="lane ${s==='p'&&sel&&!u?'sel':''}" data-i="${i}">${u?unitHtml(u):''}</div>`}
function unitHtml(u){let sym=u.id==='seal'?'◇':u.id==='token'?'✣':(C[u.id]?.sym||'✦');return `<div class="unit ${u.f} art-${u.id}"><div class="uArt richArt">${cardArt(u.id)}<span class="unitSigil">${sym}</span></div><div class="nm">${u.n}</div><div class="stats"><span>⚔ ${u.a}</span><span>♥ ${u.h}/${u.m}${u.armor?' · 🛡'+u.armor:''}</span></div></div>`}

function card(u){
 let c=C[u.id],lock=B.p.res<u.c||B.p.act<1||!B.p.lan.some(x=>!x),selected=sel===u.id;
 return `<button type="button" aria-label="Voir ${escapeHtml(u.n)}" class="card ${u.f} art-${u.id} ${lock?'lock':''} ${selected?'selected':''}" data-id="${u.id}"><div class="cost">${u.c}</div><div class="cArt richArt">${cardArt(u.id)}<span class="tag">${c.tag}</span></div><div class="cn">${u.n}</div><div class="cs"><span>⚔${u.a}</span><span>♥${u.h}</span></div></button>`;
}

function selectCard(id){if(!B||B.transition)return;sel=id;inspectedUnit=null;renderFight()}

function renderCardInfo(){
 if(!$('cardInfo'))return;
 const placed=inspectedUnit&&B?.[inspectedUnit.side].lan[inspectedUnit.index];
 if(placed){$('cardInfo').innerHTML=describeCard(placed.id,placed);return}
 if(!sel||!C[sel]){$('cardInfo').innerHTML='<div class="cardInfoEmpty">Touche une carte ou une unité pour voir ses statistiques, ses buffs et ses effets.</div>';return}
 const u=B.p.hand.find(x=>x.id===sel),c=C[sel],missing=Math.max(0,c.c-B.p.res),can=!B.transition&&B.p.act>0&&missing===0&&B.p.lan.some(x=>!x);
 const state=B.transition?'Résolution en cours.':can?'Prête — choisis une voie libre.':missing?`Il te manque ${missing} ressource${missing>1?'s':''}.`:B.p.act<1?'Plus d’action ce round.':'Aucune voie libre.';
 $('cardInfo').innerHTML=describeCard(sel,u)+`<div class="ciState ${can?'ok':'no'}">${state}</div>`;
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
 const rewardId=['graine','racines','pelerin','mycele','mere','veilleur','brasier','colosse','collect','mere'][fi-1];
 B.transition=false;show('result');$('rK').textContent=`COMBAT ${fi} / 10`;$('rTitle').textContent=win?'VICTOIRE':'DÉFAITE';
 if(win){if(!S.done.includes(fi)){S.done.push(fi);S.un=Math.max(S.un,Math.min(10,fi+1));let reward=['graine','racines','pelerin','mycele','mere','veilleur','brasier','colosse','collect','mere'][fi-1];if(!S.col.includes(reward))S.col.push(reward);save()}$('rPanel').innerHTML=`<div class="rewardArt">${cardArt(rewardId)}</div><div><div class="sub">RÉCOMPENSE</div><h3 class="title" style="margin:4px 0">${C[rewardId].n}</h3><div class="sub">Coût ${C[rewardId].c} · ATQ ${C[rewardId].a} · PV ${C[rewardId].h}</div><button class="rewardDetail" onclick="openCardDetail('${rewardId}')">Voir les effets</button><div style="font-size:11px;color:#c5bcaf">Une carte rejoint ta collection. La progression est sauvegardée automatiquement.</div></div>`;$('rBtn').textContent=fi===10?'Terminer le chapitre':'Continuer';$('rBtn').onclick=goMap}
 else{$('rPanel').innerHTML=`<div class="rewardArt">${cardArt('revenant')}</div><div><h3 class="title">Réessaie</h3><div style="font-size:11px;color:#c5bcaf">Lis les effets des cartes et adapte tes placements aux voies adverses.</div></div>`;$('rBtn').textContent='Réessayer';$('rBtn').onclick=startFight}
}

function renderDeck(){$('deckCount').textContent=S.deck.length+' / 12 CARTES';$('deckGrid').innerHTML=S.deck.map(id=>meta(id)).join('')}
function renderCollection(){$('colCount').textContent=S.col.length+' CARTES DÉCOUVERTES';$('colGrid').innerHTML=S.col.map(id=>meta(id)).join('')}
function meta(id){let c=C[id],fx=c.fx?.[0];return `<button type="button" class="meta ${c.f} art-${id}" onclick="openCardDetail('${id}')" aria-label="Voir ${escapeHtml(c.n)}"><div class="metaArt richArt">${cardArt(id)}</div><div class="metaBody"><div class="metaTitle"><b>${c.n}</b><span>${c.tag}</span></div><div class="sub">◆${c.c} · ⚔${c.a} · ♥${c.h}${c.armor?` · 🛡${c.armor}`:''}</div><p><b>${fx?fx[0]+': ':''}</b>${fx?fx[1]:''}</p></div></button>`}
renderMap();
