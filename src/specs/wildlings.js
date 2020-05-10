import tileColors from '@/styles/export.scss';

const wildlingTypes = ['regular', 'climber', 'giant', 'whiteWalker']
export const [WILDLING_REGULAR, WILDLING_CLIMBER, WILDLING_GIANT, WILDLING_WHITE_WALKER] = wildlingTypes;

export const wildlingIcons = {
  regular: 'gavel',
  climber: 'pickaxe',
  giant: 'football-helmet',
  whiteWalker: 'ghost'
};

export const wildlingColors = {
  regular: tileColors.mountain,
  climber: tileColors.mountain,
  giant: tileColors.secondary,
  whiteWalker: tileColors.secondary
};

export const wildlingAttentionHeaders = {
  regular: 'Attack on the wall! The wildlings have overthrown the guards and invaded Westeros',
  climber: 'A wildling has climbed the wall!',
  giant: 'Attack on the wall! A giant has killed a guard',
  whiteWalker: 'A white walker has swept the wall'
};
