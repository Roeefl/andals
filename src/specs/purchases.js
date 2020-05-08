export const pluralTypes = ['roads', 'settlements', 'cities', 'guards'];

export const types = ['road', 'settlement', 'city', 'gameCard', 'guard'];
export const [ROAD, SETTLEMENT, CITY, GAME_CARD, GUARD] = types;

export const MOVE_ROBBER = 'MOVE_ROBBER';

export const victoryPointsPerPurchase = {
  road: 0,
  settlement: 1,
  city: 2,
  guard: '?',
  gameCard: '?'
};

export const initialBuildingCosts = {
  road: {},
  settlement: {},
  city: {},
  guard: {},
  gameCard: {}
};
