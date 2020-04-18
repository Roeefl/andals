import tileColors from '@/styles/export.scss';

const wildlingTypes = ['regular', 'climber',' giant']
export const [WILDLING_REGULAR, WILDLING_CLIMBER, WILDLING_GIANT] = wildlingTypes;

export const wildlingIcons = {
  regular: 'gavel',
  climber: 'pickaxe',
  giant: 'football-helmet'
};

export const wildlingColors = {
  regular: tileColors.mountain,
  climber: tileColors.mountain,
  giant: tileColors.secondary
};
