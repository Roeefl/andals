const serverResourceTypes = ['lumber', 'brick', 'sheep', 'wheat', 'ore', 'desert', 'water', 'harborGeneric'];
export const [LUMBER, BRICK, SHEEP, WHEAT, ORE, DESERT, WATER, HARBOR_GENERIC] = serverResourceTypes;

const resourceTypes  = ['resource', 'water', 'spacer'];
export const [
  TILE_RESOURCE,
  TILE_WATER,
  TILE_SPACER
] = resourceTypes;

const rowTypes = ['even', 'odd'];
const [ROW_EVEN, ROW_ODD] = rowTypes;

export const totalResourceTiles = 19;
export const totalWaterTiles = 18;

export const tileRows = [
  {
    type: ROW_EVEN,
    firstResource: -1,
    resourceCount: 0,
    tiles: [
      TILE_SPACER,
      TILE_WATER, TILE_WATER, TILE_WATER, TILE_WATER
    ]
  },
  {
    type: ROW_ODD,
    firstResource: 2,
    resourceCount: 3,
    tiles: [
      TILE_SPACER,
      TILE_WATER,
      TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE,
      TILE_WATER
    ]
  },
  {
    type: ROW_EVEN,
    firstResource: 1,
    resourceCount: 4,
    tiles: [
      TILE_WATER,
      TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE,
      TILE_WATER
    ]
  },
  {
    type: ROW_ODD,
    firstResource: 1,
    resourceCount: 5,
    tiles: [
      TILE_WATER,
      TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE,
      TILE_WATER
    ]
  },
  {
    type: ROW_EVEN,
    firstResource: 1,
    resourceCount: 4,
    tiles: [
      TILE_WATER,
      TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE,
      TILE_WATER
    ]
  },
  {
    type: ROW_ODD,
    firstResource: 2,
    resourceCount: 3,
    tiles: [
      TILE_SPACER,
      TILE_WATER,
      TILE_RESOURCE, TILE_RESOURCE, TILE_RESOURCE,
      TILE_WATER
    ]
  },
  {
    type: ROW_EVEN,
    firstResource: -1,
    resourceCount: 0,
    tiles: [
      TILE_SPACER,
      TILE_WATER, TILE_WATER, TILE_WATER, TILE_WATER
    ]
  }
]

export const harborManifest = {
  water: null,
  harborGeneric: '3:1',
  lumber: '2:1',
  brick: '2:1',
  sheep: '2:1',
  wheat: '2:1',
  ore: '2:1'
};
