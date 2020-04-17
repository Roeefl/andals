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
