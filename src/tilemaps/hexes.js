import {
  TILE_SPACER,
  TILE_WATER,
  TILE_RESOURCE
} from '@/utils/tileManifest';

const rowTypes = ['even', 'odd'];
const [ROW_EVEN, ROW_ODD] = rowTypes;

// 7 x 7 === 49 total hex-tiles board
export default [
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
