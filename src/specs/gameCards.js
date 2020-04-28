import cardColors from '@/styles/export.scss';

const gameCardTypes = ['knight', 'victoryPoint', 'roadBuilding', 'yearOfPlenty', 'monopoly'];
export const [CARD_KNIGHT, CARD_VICTORY_POINT, CARD_ROAD_BUILDING, CARD_YEAR_OF_PLENTY, CARD_MONOPOLY] = gameCardTypes;

export const gameCardIcons = {
  knight: 'sword',
  victoryPoint: 'star-four-points',
  roadBuilding: 'highway',
  yearOfPlenty: 'cards-playing-outline',
  monopoly: 'semantic-web'  
};

export const gameCardColors = {
  knight: cardColors.knight,
  victoryPoint: cardColors.victoryPoint,
  roadBuilding: cardColors.roadBuilding,
  yearOfPlenty: cardColors.yearOfPlenty,
  monopoly: cardColors.monopoly
};

export const firstMenGameCardsTitles = {
  knight: "Knight",
  victoryPoint: "Warhorse",
  roadBuilding: "March Forward",
  yearOfPlenty: "Winter is Coming",
  monopoly: "Protector of the Realm",
  newRecruits: "New Recruits"
};

export const firstMenGameCardsDescriptions = {
  knight: "Before or after rolling the dice, you can either: A) move Tormund as if you had rolled a 7 or B) remove 1 wildling from the board back to the spawn and take 1 resource card from the tile the wildling was blocking",
  victoryPoint: "Victory Point",
  roadBuilding: "You may immediately place 2 free roads on the board (according to normal building rules)",
  yearOfPlenty: "You may immediately take any 2 resource cards from the supply, and use these cards to build on the same turn",
  monopoly: "You may announce 1 type of resource. All other players must give you ALL of their resources of that type",
  newRecruits: "You may immediately add 1 of your guards to the Wall for free"
};
