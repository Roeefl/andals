export const heroSpecs = {
  JeorMormont: {
    name: "Jeor Mormont",
    title: "Lord Commander of the Night's Watch",
    ability: "Forced Trade",
    description: "Demand 1 resource card each from up to 2 players. The cards must be of the same resource type. For each resource card you receive, give the respective player 1 resource card of your choice in return."
  },
  BowenMarsh: {
    name: "Bowen Marsh",
    title: "Lord Steward of the Night's Watch",
    ability: "Fair Trade",
    description: "You may trade a single resource card at a rate of 1:1 with the supply." 
  },
  SamwellTarly: {
    name: "Samwell Tarly",
    title: "Steward",
    ability: "Master's Sufficiency",
    description: "If, after resolving any production roll (not a “7”), you receive no resource cards, take any 1 resource card of your choice from the supply. Take your resource card before any other hero card is used."
  },
  OthellYarwyck: {
    name: "Othell Yarwyck",
    title: "Master Builder of the Night's Watch",
    ability: "Road Redirect",
    description: "Remove 1 of your roads from the board and rebuild it for free at a different legal location. The road you remove must only be connected on 1 of its 2 ends to your pieces. Ignore opponents’ pieces when checking connections."
  },
  AlliserThorne: {
    name: "Ser Alliser Thorne",
    title: "Master at Arms of the Night's Watch",
    ability: "Easy to Build Guard",
    description: "When you build a guard, substitute 1 of the 3 resources with any 1 other resource of your choice."
  },
  Melisandre: {
    name: "Melisandre",
    title: "Red Priestess of R'hllor",
    ability: "Manipulate Development Cards",
    description: "One time on your turn, when you buy a development card, substitute 1 of the 3 resources with any 1 other resource of your choice. Choose your development card from the 3 top cards of the deck, then reshuffle the deck."
  },
  ManceRayder: {
    name: "Mance Rayder",
    title: "King Beyond the Wall",
    ability: "Underdog",
    description: "After resolving your production roll, look at the hand of resource cards of 1 opponent who has more victory points than you and take 1 resource card of your choice."
  },
  BenjenStark: {
    name: "Benjen Stark",
    title: "First Ranger",
    ability: "Coldhands",
    description: "Remove 1 wildling from a clearing or a camp, and return it to the spawn. Collapse the camps if needed. Then, reveal a wildling token from the pool."
  },
  Ygritte: {
    name: "Ygritte",
    title: "Freefolk Spearwife",
    ability: "Back to the Cave",
    description: "Choose 1 wildling in the Gift and return it to the Frostfangs. You can do this before or after your own production roll."
  },
  Yoren: {
    name: "Yoren",
    title: "Wandering Crow",
    ability: "New Recruits",
    description: "When you build, discard 1 Ranger Patrol card that you have already played and build a guard for free. You can do this before or after your own production roll."
  },
  QhorinHalfhand: {
    name: "Qhorin Half-Hand",
    title: "Ranger",
    ability: "Fist of the First Men",
    description: "You may move Tormund back to his camp. You receive 1 resource of the type produced by the land that Tormund left. You can do this before or after your own production roll."
  },
  IlynPayne: {
    name: "Ilyn Payne",
    title: "The Queen's Justice",
    ability: "Guard Execution",
    description: "You may immediately remove any Guard on the wall which belongs to another player, and return it to him."
  },
  EuronGreyjoy: {
    name: "Euron Greyjoy",
    title: "King of Salt and Rock",
    ability: "Iron Fleet Occupation",
    description: "You may trade any resource cards with the supply at a rate of 2:1, as if you had a settlement on each of the harbor trading posts."
  },
  TywinLannister: {
    name: "Tywin Lannister",
    title: "Lord of Casterly Rock",
    ability: "A lion does not concern himself with the Sheep",
    description: "Trade any of your resource cards with the supply for one sheep resource card."
  },
  Thoros: {
    name: "Thoros of Myr",
    title: "Priest of R'hollor",
    ability: "The one True God",
    description: "Whenever one of your guards gets killed during an attack on the wall, instantly revive him and place him back at any wall section."
  },
  StannisBaratheon: {
    name: "Stannis Baratheon",
    title: "Azor Ahai",
    ability: "March to the Wall",
    description: "You may immediately move one of your guards to any wall section."
  }
};

export const heroCardTypes = Object.keys(heroSpecs);
export const [
  HERO_CARD_JeorMormont,
  HERO_CARD_BowenMarsh,
  HERO_CARD_SamwellTarly,
  HERO_CARD_OthellYarwyck,
  HERO_CARD_AlliserThorne,
  HERO_CARD_Melisandre,
  HERO_CARD_ManceRayder,
  HERO_CARD_BenjenStark,
  HERO_CARD_Ygritte,
  HERO_CARD_Yoren,
  HERO_CARD_QhorinHalfhand,
  HERO_CARD_IlynPayne,
  HERO_CARD_EuronGrejoy,
  HERO_CARD_TywinLannister,
  HERO_CARD_Thoros,
  HERO_CARD_Stannis
] = heroCardTypes;
