const serverResourceTypes = ['lumber', 'brick', 'sheep', 'wheat', 'ore', 'desert', 'water', 'harborGeneric'];
export const [LUMBER, BRICK, SHEEP, WHEAT, ORE, DESERT, WATER, HARBOR_GENERIC] = serverResourceTypes;

export const harborManifest = {
  water: null,
  harborGeneric: '3:1',
  lumber: '2:1',
  brick: '2:1',
  sheep: '2:1',
  wheat: '2:1',
  ore: '2:1'
};

const tileTypes  = ['spacer', 'resource', 'water'];
export const [TILE_SPACER, TILE_RESOURCE, TILE_WATER] = tileTypes;

export const hexTileTypes = {
  0: TILE_SPACER,
  1: TILE_RESOURCE,
  2: TILE_WATER
};

export const roadTileTypes = {
  0: 'hide',
  1: 'top-left',
  2: 'top-right',
  3: 'left'
};

export const structureTileTypes = {
  0: 'hide',
  1: 'top', // enables roads: north, south-west, south-east
  2: 'top-left' // enables roads: south, north-west, north-east
};
