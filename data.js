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
porte:{n:'Porte-Flamme',f:'fire',c:1,a:2,h:1,sym:'✦',tag:'Assaut',type:'Unité',fx:[['Déploiement','Si la voie opposée est vide, inflige 1 dégât au héros adverse.']]},
fan:{n:'Fanatique des Braises',f:'fire',c:2,a:2,h:2,sym:'✧',tag:'Sacrifice',type:'Unité',fx:[['Dernier Souffle','Quand cette unité meurt, le héros adverse subit 1 dégât.']]},
garde:{n:'Garde de Basalte',f:'fire',c:2,a:2,h:3,sym:'⬟',tag:'Défense',type:'Unité',armor:1,fx:[['Armure 1','Réduit de 1 les dégâts de chaque attaque d’unité reçue.']]},
boucher:{n:'Boucher de Varkaal',f:'fire',c:3,a:4,h:3,sym:'✠',tag:'Pression',type:'Unité',fx:[['Déploiement','Inflige 1 dégât à l’unité située en face, si elle existe.']]},
brasier:{n:'Brasier Rituel',f:'fire',c:3,a:3,h:4,sym:'◈',tag:'Croissance',type:'Unité',fx:[['Embrasement','Après un combat qu’il survit, gagne définitivement +1 ATQ.']]},
colosse:{n:'Colosse de Scorie',f:'fire',c:5,a:7,h:7,sym:'⬢',tag:'Finisher',type:'Unité',fx:[['Impact 2','Au déploiement, inflige 2 dégâts à l’unité en face ; si la voie est vide, au héros adverse.']]},
graine:{n:'Graine Vorace',f:'nature',c:1,a:1,h:3,sym:'❖',tag:'Croissance',type:'Unité',fx:[['Croissance','À chaque fin de round, gagne +1 PV max et récupère 1 PV.']]},
mycele:{n:'Mycèle Rampant',f:'nature',c:1,a:1,h:4,sym:'✥',tag:'Soutien',type:'Unité',fx:[['Réseau fongique','À la fin du round, soigne de 1 PV les unités alliées adjacentes.']]},
racines:{n:'Racines Voraces',f:'nature',c:2,a:2,h:5,sym:'⌘',tag:'Contrôle',type:'Unité',fx:[['Enchevêtrement','Après un échange d’attaques où les deux unités survivent, l’unité ennemie en face perd 1 ATQ, minimum 0.']]},
pelerin:{n:'Pèlerin Écorché',f:'death',c:2,a:2,h:5,sym:'☩',tag:'Attrition',type:'Unité',fx:[['Dernier Souffle','Quand cette unité meurt, le héros de son propriétaire récupère 2 PV, sans dépasser son maximum.']]},
veilleur:{n:'Veilleur du Tombeau',f:'death',c:2,a:2,h:4,sym:'☽',tag:'Garde',type:'Unité',fx:[['Veille funèbre','S’il est joué face à une unité ennemie, gagne immédiatement +1 PV max et +1 PV.']]},
collect:{n:'Collecteur d’Âmes',f:'death',c:3,a:3,h:5,sym:'◇',tag:'Valeur',type:'Unité',fx:[['Collecte','Chaque fois qu’une unité ennemie meurt, gagne définitivement +1 ATQ tant qu’il reste en jeu.']]},
revenant:{n:'Revenant Sans Nom',f:'death',c:3,a:3,h:3,sym:'◉',tag:'Réanimation',type:'Unité',fx:[['Réanimation','La première fois qu’il meurt, revient dans la main de son propriétaire avec 1 PV.']]},
mere:{n:'Mère du Charnier',f:'death',c:5,a:5,h:6,sym:'♢',tag:'Invocation',type:'Unité',fx:[['Déploiement','Invoque un Rejeton du Charnier 1/1 dans une autre voie libre.']]}
};

// Artwork is shared by every card presentation. See assets/cards/sources.json.
const CARD_ART = {
 porte:'porte', fan:'fan', garde:'garde', boucher:'boucher', brasier:'brasier',
 graine:'graine', mycele:'mycele', racines:'graine', pelerin:'pelerin',
 veilleur:'veilleur', collect:'collect', revenant:'veilleur', mere:'collect',
 colosse:'porte', token:'collect', seal:'veilleur'
};
const CARD_TRIGGERS = {
 porte:'Au déploiement, uniquement si la voie opposée est vide.',
 fan:'À la mort de cette unité, avant son transfert dans la défausse.',
 garde:'À chaque attaque reçue d’une unité. Ne réduit pas les dégâts des effets.',
 boucher:'Au déploiement, uniquement si une unité ennemie occupe la voie opposée.',
 brasier:'Après un échange d’attaques avec une unité, si le Brasier survit. Ne se déclenche pas contre le héros.',
 colosse:'Au déploiement : cible l’unité opposée, ou le héros adverse si la voie est vide.',
 graine:'À chaque fin de round, après les attaques, si cette unité est encore en jeu.',
 mycele:'À chaque fin de round, après la croissance des Graines : soigne chaque voisine alliée présente de 1 PV, sans dépasser son maximum.',
 racines:'Après un échange d’attaques, si les Racines et leur adversaire survivent tous les deux.',
 pelerin:'À la mort de cette unité. Le soin est plafonné aux PV maximum du héros de son propriétaire.',
 veilleur:'Au déploiement, uniquement si la voie opposée contient une unité ennemie.',
 collect:'À chaque mort ennemie, si ce Collecteur est encore présent sur le plateau.',
 revenant:'À sa première mort : retourne en main à 1 PV, en conservant ses autres statistiques. L’effet est ensuite consommé.',
 mere:'Au déploiement : invoque un Rejeton 1 ATQ / 1 PV dans la première autre voie libre. Aucun effet si aucune voie n’est libre.'
};
