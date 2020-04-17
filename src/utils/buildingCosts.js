export const pluralTypes = ['roads', 'settlements', 'cities', 'gameCards', 'guards'];

export const types = ['road', 'settlement', 'city', 'gameCard', 'guard'];
export const [ROAD, SETTLEMENT, CITY, GAMECARD, GUARD] = types;

export default {
  road: {
    type: ROAD,
    vp: 0,
    lumber: 1,
    brick: 1,
    sheep: 0,
    ore: 0,
    wheat: 0
  },
  settlement: {
    type: SETTLEMENT,
    vp: 1,
    lumber: 1,
    brick: 1,
    sheep: 1,
    wheat: 1,
    ore: 0
  },
  city: {
    type: CITY,
    vp: 2,
    lumber: 0,
    brick: 0,
    sheep: 0,
    wheat: 2,
    ore: 3,
  },
  guard: {
    type: GUARD,
    vp: '?',
    lumber: 1,
    brick: 1,
    sheep: 1,
    wheat: 0,
    ore: 0,
  },
  gameCard: {
    type: GAMECARD,
    vp: '?',
    lumber: 0,
    brick: 0,
    sheep: 1,
    wheat: 1,
    ore: 1
  }
};
