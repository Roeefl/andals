import tileColors from '@/styles/export.scss';

export const clanNames = ['river', 'cave', 'hornfoot'];
const [CLAN_RIVER, CLAN_CAVE, CLAN_HORNFOOT] = clanNames;

export const clanIcons = {
  river: 'snowflake-melt',
  cave: 'home-group',
  hornfoot: 'foot-print'
};

export const clanColors = {
  river: tileColors.darkBlue,
  cave: tileColors.darkBlue,
  hornfoot: tileColors.darkBlue
};

export const clans = {
  river: {
    name: CLAN_RIVER,
    icon: clanIcons.river
  },
  cave: {
    name: CLAN_CAVE,
    icon: clanIcons.cave
  },
  hornfoot: {
    name: CLAN_HORNFOOT,
    icon: clanIcons.hornfoot
  },
};

