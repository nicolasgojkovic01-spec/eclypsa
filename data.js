const F=[
{t:'Premières braises',e:'Fanatiques des Braises',f:'fire',hp:22,m:'Aucune règle spéciale. Apprends le rythme des 3 actions.',o:'Réduis les PV ennemis à 0.'},
{t:'Le mur de basalte',e:'Garde de Varkaal',f:'fire',hp:25,m:'Une Garde renforcée commence au centre.',o:'Brise sa ligne puis frappe le héros.',start:1},
{t:'La dette du feu',e:'Boucher de Varkaal',f:'fire',hp:27,m:'L’ennemi commence avec plus de ressources.',o:'Gère la pression sans vider tes ressources.',er:3},
{t:'Sous les racines',e:'Gardienne de la Sylve',f:'nature',hp:26,m:'Les unités Sylve gagnent +1 PV à chaque fin de round.',o:'Ne laisse pas la Sylve s’installer.',buff:1},
{t:'Ce qui refuse de mourir',e:'Néreth',f:'death',hp:28,m:'La première unité ennemie morte revient une fois.',o:'Épuise sa capacité de recyclage.',reb:1},
{t:'La nuit des affamés',e:'Procession des Morts',f:'death',hp:34,m:'Survie : tiens 5 résolutions.',o:'Survis à 5 rounds complets.',surv:5},
{t:'Tempête de cendres',e:'Légion Calcinée',f:'fire',hp:30,m:'Après les rounds 2 et 4, toutes les unités subissent 1 dégât.',o:'Adapte tes placements à la tempête.',storm:1},
{t:'Varkaal',e:'Varkaal, Porte-Cendres',f:'fire',hp:36,m:'Mini-boss : unités plus agressives, niveau II.',o:'Bats Varkaal.',lvl:2},
{t:'La porte scellée',e:'Sanctuaire Sans Nom',f:'death',hp:40,m:'Trois sceaux 0/6 occupent les voies.',o:'Détruis les trois sceaux.',seals:1},
{t:'L’Écho derrière l’Éclipse',e:'L’Innommé',f:'death',hp:45,m:'Boss final : à 22 PV, passage en phase II.',o:'Survis à sa transformation.',boss:1}
];

const C={
porte:{n:'Porte-Flamme',f:'fire',c:1,a:2,h:1,sym:'✦',tag:'Assaut',d:'Une présence très bon marché qui met immédiatement de la pression.',r:'À jouer tôt pour occuper une voie vide ou finir un adversaire déjà affaibli.'},
fan:{n:'Fanatique des Braises',f:'fire',c:2,a:2,h:2,sym:'✧',tag:'Équilibrée',d:'Corps léger, coût modéré et statistiques équilibrées.',r:'Bon choix quand tu veux développer le plateau sans sacrifier trop de ressources.'},
garde:{n:'Garde de Basalte',f:'fire',c:2,a:2,h:3,sym:'⬟',tag:'Défense',d:'Plus résistante que les unités de même coût.',r:'À poser face à une menace adverse pour absorber plusieurs échanges.'},
boucher:{n:'Boucher de Varkaal',f:'fire',c:3,a:4,h:3,sym:'✠',tag:'Pression',d:'Une unité agressive avec 4 d’attaque pour 3 ressources.',r:'À jouer lorsque tu veux gagner une voie rapidement ou punir une voie vide.'},
brasier:{n:'Brasier Rituel',f:'fire',c:3,a:3,h:4,sym:'◈',tag:'Ancrage',d:'Solide compromis entre attaque et endurance.',r:'Bonne carte de milieu de partie pour stabiliser une voie contestée.'},
colosse:{n:'Colosse de Scorie',f:'fire',c:5,a:7,h:7,sym:'⬢',tag:'Finisher',d:'Une énorme menace : très chère, mais capable d’écraser presque n’importe quelle voie.',r:'Garde tes ressources pour lui quand tu as besoin d’un basculement décisif.'},
graine:{n:'Graine Vorace',f:'nature',c:1,a:1,h:3,sym:'❖',tag:'Endurance',d:'Peu offensive, mais étonnamment difficile à retirer pour son coût.',r:'Idéale pour bloquer une voie tôt et économiser tes ressources.'},
mycele:{n:'Mycèle Rampant',f:'nature',c:1,a:1,h:4,sym:'✥',tag:'Mur',d:'Le meilleur ratio de points de vie parmi les cartes à 1 ressource.',r:'À utiliser pour gagner du temps pendant que tu canalises ou prépares une grosse carte.'},
racines:{n:'Racines Voraces',f:'nature',c:2,a:2,h:5,sym:'⌘',tag:'Contrôle',d:'Très grande endurance pour un coût faible.',r:'Excellente pour verrouiller une voie et forcer l’ennemi à y investir plusieurs actions.'},
pelerin:{n:'Pèlerin Écorché',f:'death',c:2,a:2,h:5,sym:'☩',tag:'Attrition',d:'Une créature lente mais tenace, pensée pour les échanges prolongés.',r:'À poser devant une unité ennemie dangereuse afin de la retenir plusieurs rounds.'},
veilleur:{n:'Veilleur du Tombeau',f:'death',c:2,a:2,h:4,sym:'☽',tag:'Garde',d:'Un défenseur fiable qui ne coûte que 2 ressources.',r:'Très sûr lorsque tu ne sais pas encore où l’ennemi concentrera sa pression.'},
collect:{n:'Collecteur d’Âmes',f:'death',c:3,a:3,h:5,sym:'◇',tag:'Valeur',d:'Une unité complète : dégâts corrects et vraie résistance.',r:'À jouer quand tu veux sécuriser une voie sans prendre de risque particulier.'},
revenant:{n:'Revenant Sans Nom',f:'death',c:3,a:3,h:3,sym:'◉',tag:'Duel',d:'Statistiques directes, sans détour : 3 attaque / 3 vie.',r:'Efficace pour échanger proprement contre des unités moyennes.'},
mere:{n:'Mère du Charnier',f:'death',c:5,a:5,h:6,sym:'♢',tag:'Menace',d:'Une présence lourde qui combine dégâts et endurance.',r:'À réserver aux rounds où tu peux te permettre un investissement important.'}
};
