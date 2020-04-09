export const pluralTypes = ['roads', 'settlements', 'cities', 'gameCards'];

export const types = ['road', 'settlement', 'city', 'gameCard'];
export const [ROAD, SETTLEMENT, CITY, GAMECARD] = types;

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
    wheat: 1,
    sheep: 1,
    ore: 0
  },
  city: {
    type: CITY,
    vp: 2,
    wheat: 2,
    ore: 3,
    lumber: 0,
    brick: 0,
    sheep: 0
  },
  gameCard: {
    type: GAMECARD,
    vp: '?',
    sheep: 1,
    wheat: 1,
    ore: 1,
    lumber: 0,
    brick: 0
  }
};
