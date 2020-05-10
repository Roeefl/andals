export const heroSpecs = {
  JeorMormont: {
    name: "Jeor Mormont",
    title: "Lord Commander of the Night's Watch",
    ability: "Forced Trade",
    description: "Demand 1 resource card each (of the same type) from up to 2 players, in exchange for 1 resource card of your chooosing"
  },
  BowenMarsh: {
    name: "Bowen Marsh",
    title: "Lord Steward of the Night's Watch",
    ability: "Fair Trade",
    description: "You may trade a single resource card at a rate of 1:1 with the supply" 
  },
  SamwellTarly: {
    name: "Samwell Tarly",
    title: "Steward",
    ability: "Master's Sufficiency",
    description: "If, after resolving any non-7 roll, you receive no resource cards, take any 1 card of your choice from the supply"
  },
  OthellYarwyck: {
    name: "Othell Yarwyck",
    title: "Master Builder of the Night's Watch",
    ability: "Road Redirect",
    description: "Remove 1 of your roads from the board and rebuild it for free at a different legal location. This road must not be connected to structures on both ends"
  },
  AlliserThorne: {
    name: "Ser Alliser Thorne",
    title: "Master at Arms of the Night's Watch",
    ability: "Easy to Build Guard",
    description: "When you build a guard, substitute 1 of the 3 resources with any 1 other resource of your choice"
  },
  Melisandre: {
    name: "Melisandre",
    title: "Red Priestess of R'hllor",
    ability: "Manipulate Development Cards",
    description: "One time on your turn, if you buy a game card, you may replace 1 resource with another of your choice. You may select your card from the 3 top cards of the deck"
  },
  ManceRayder: {
    name: "Mance Rayder",
    title: "King Beyond the Wall",
    ability: "Underdog",
    description: "After rolling the dice, you may look look at the hand of 1 opponent with more victory points than you, and take 1 resource card of your choice."
  },
  BenjenStark: {
    name: "Benjen Stark",
    title: "First Ranger",
    ability: "Coldhands",
    description: "Remove 1 wildling from a clearing / camp, and return it to the spawn. Adjust the camps if needed. Then, reveal a wildling token"
  },
  Ygritte: {
    name: "Ygritte",
    title: "Freefolk Spearwife",
    ability: "Back to the Cave",
    description: "Choose 1 wildling that occupies a resource tile and return it to the spawn"
  },
  Yoren: {
    name: "Yoren",
    title: "Wandering Crow",
    ability: "New Recruits",
    description: "You may discard 1 Knight card that you've already played and build a guard for free"
  },
  QhorinHalfhand: {
    name: "Qhorin Half-Hand",
    title: "Ranger",
    ability: "Fist of the First Men",
    description: "You may move Tormund back to his camp. You receive 1 resource of the type produced by the land that he leaves"
  },
  IlynPayne: {
    name: "Ilyn Payne",
    title: "The Queen's Justice",
    ability: "Guard Execution",
    description: "You may immediately remove any Guard on the wall which belongs to another player, and return it to him"
  },
  EuronGreyjoy: {
    name: "Euron Greyjoy",
    title: "King of Salt and Rock",
    ability: "Iron Fleet Occupation",
    description: "You may trade any resource cards with the supply at a rate of 2:1, as if you had a settlement on each harbor"
  },
  TywinLannister: {
    name: "Tywin Lannister",
    title: "Lord of Casterly Rock",
    ability: "A lion does not concern himself with the Sheep",
    description: "Trade any of your resource cards with the supply for one sheep resource card"
  },
  Thoros: {
    name: "Thoros of Myr",
    title: "Priest of R'hollor",
    ability: "The one True God",
    description: "If one of your guards gets killed during an attack on the wall, you may instantly revive him and place him back at any wall section"
  },
  StannisBaratheon: {
    name: "Stannis Baratheon",
    title: "Azor Ahai",
    ability: "March to the Wall",
    description: "You may immediately move one of your guards to any other wall section"
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
