import tileColors from '@/styles/export.scss';

const serverResourceTypes = ['lumber', 'brick', 'sheep', 'wheat', 'ore', 'desert', 'water', 'harborGeneric'];
export const [LUMBER, BRICK, SHEEP, WHEAT, ORE, DESERT, WATER, HARBOR_GENERIC] = serverResourceTypes;

export const resourceCardTypes = [LUMBER, BRICK, SHEEP, WHEAT, ORE];

const tileTypes  = ['resource', 'water', 'spacer'];
export const [
  TILE_RESOURCE,
  TILE_WATER,
  TILE_SPACER
] = tileTypes;

export const totalResourceTiles = 19;
// export const totalWaterTiles = 18;

export const harborManifest = {
  water: null,
  harborGeneric: '3:1',
  lumber: '2:1',
  brick: '2:1',
  sheep: '2:1',
  wheat: '2:1',
  ore: '2:1'
};

export const resourceNameToIcon = {
  road: 'road',
  roads: 'road',
  settlement: 'home',
  settlements: 'home',
  city: 'city',
  cities: 'city',
  gameCard: 'cards',
  gameCards: 'cards'
};

export const resourceCardColors = {
  lumber: tileColors.tileLumber,
  brick: tileColors.tileBrick,
  sheep: tileColors.tileSheep,
  wheat: tileColors.tileWheat,
  ore: tileColors.tileOre
};

export const resourceCardNameToIcon = {
  lumber: 'pine-tree',
  brick: 'wall',
  sheep: 'sheep',
  wheat: 'barley',
  ore: 'diamond-stone'  
};

export const initialResourceCounts = {
  lumber: 0,
  sheep: 0,
  brick: 0,
  wheat: 0,
  ore: 0
};
