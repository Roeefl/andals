export const resourceTypes  = ['resource', 'water', 'harbor', 'spacer'];
export const [
  TILE_RESOURCE,
  TILE_WATER,
  TILE_HARBOR,
  TILE_SPACER
] = resourceTypes;

const rowTypes = ['even', 'odd'];
const [ROW_EVEN, ROW_ODD] = rowTypes;

export const totalResourceTiles = 19;

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
