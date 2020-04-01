const serverResourceTypes = ['lumber', 'brick', 'sheep', 'wheat', 'ore', 'desert', 'water', 'harborGeneric'];
export const [LUMBER, BRICK, SHEEP, WHEAT, ORE, DESERT, WATER, HARBOR_GENERIC] = serverResourceTypes;

export const resourceCardTypes = [LUMBER, BRICK, SHEEP, WHEAT, ORE];

const tileTypes  = ['resource', 'water', 'spacer'];
export const [
  TILE_RESOURCE,
  TILE_WATER,
  TILE_SPACER
] = tileTypes;

const rowTypes = ['even', 'odd'];
const [ROW_EVEN, ROW_ODD] = rowTypes;

export const totalResourceTiles = 19;
// export const totalWaterTiles = 18;

// 7 x 7 === 49 total tiles board
export const tileRows = [
  {
    type: ROW_EVEN,
    tiles: [
      TILE_SPACER,
      TILE_WATER, TILE_WATER, TILE_WATER, TILE_WATER,
      TILE_SPACER, TILE_SPACER
    ]
  },
  {
    type: ROW_ODD,
    tiles: [
      TILE_SPACER,
      TILE_WATER,
      TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE,
      TILE_WATER,
      TILE_SPACER
    ]
  },
  {
    type: ROW_EVEN,
    tiles: [
      TILE_WATER,
      TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE,
      TILE_WATER,
      TILE_SPACER
    ]
  },
  {
    type: ROW_ODD,
    tiles: [
      TILE_WATER,
      TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE,
      TILE_WATER
    ]
  },
  {
    type: ROW_EVEN,
    tiles: [
      TILE_WATER,
      TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE,
      TILE_WATER,
      TILE_SPACER
    ]
  },
  {
    type: ROW_ODD,
    tiles: [
      TILE_SPACER,
      TILE_WATER,
      TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE,
      TILE_WATER,
      TILE_SPACER
    ]
  },
  {
    type: ROW_EVEN,
    tiles: [
      TILE_SPACER,
      TILE_WATER, TILE_WATER, TILE_WATER, TILE_WATER,
      TILE_SPACER, TILE_SPACER
    ]
  }
];

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
  settlements: 'home',
  cities: 'city',
  roads: 'road',
  gameCards: 'cards'
};

export const resourceCardColors = {
  lumber: '#214013',
  brick: '#a0350e',
  sheep: '#7dbe3c',
  wheat: '#fabc0c',
  ore: '#7a768c'
};

export const resouceCardNameToIcon = {
  lumber: 'pine-tree',
  brick: 'wall',
  sheep: 'sheep',
  wheat: 'barley',
  ore: 'diamond-stone'  
};

export const roadTileIndexToPlacement = {
  1: 'top-left',
  2: 'top-right',
  3: 'left',
  4: 'right',
  5: 'bottom-left',
  6: 'bottom-right'
};

// 14 rows...
export const roadTiles = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 3, 0, 3, 4, 0, 0, 0, 0],
  [0, 0, 1, 2, 1, 2, 1, 2, 1, 2, 0, 0, 0, 0],
  [0, 0, 3, 0, 3, 0, 3, 0, 3, 4, 0, 0, 0, 0],
  [0, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 0],
  [0, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 4, 0, 0],
  [0, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 0, 0],
  [0, 0, 3, 0, 3, 0, 3, 0, 3, 4, 0, 0, 0, 0],
  [0, 0, 0, 2, 1, 2, 1, 2, 1, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 3, 0, 3, 4, 0, 0, 0, 0],
  [0, 0, 0, 2, 1, 2, 1, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

export const structureTileIndexToPlacement = {
  1: 'top',
  2: 'top-left'
};

export const structureTiles = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 1, 2, 1, 2, 1, 2, 0, 0, 0],
  [0, 0, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 0, 0],
  [0, 0, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0],
  [0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 1, 2, 1, 2, 1, 0, 0, 0, 0]
];
