export const clanNames = ['river', 'cave', 'hornfoot'];
const [CLAN_RIVER, CLAN_CAVE, CLAN_HORNFOOT] = clanNames;

export const clanIcons = {
  river: 'snowflake-melt',
  cave: 'home-group',
  hornfoot: 'foot-print'
};

export const clans = {
  river: {
    name: CLAN_RIVER,
    icon: clanIcons.river,
    trails: [[1, 2], [3]]
  },
  cave: {
    name: CLAN_CAVE,
    icon: clanIcons.cave,
    trails: [[4], [5]]
  },
  hornfoot: {
    name: CLAN_HORNFOOT,
    icon: clanIcons.hornfoot,
    trails: [[6], [7, 8]]
  },
};
