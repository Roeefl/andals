import tileColors from '@/styles/export.scss';
import { LUMBER, BRICK, SHEEP, WHEAT, ORE } from '@/utils/tileManifest';

export const resourceCardTypes = [LUMBER, BRICK, SHEEP, WHEAT, ORE];

export const resourceCardIcons = {
  lumber: 'pine-tree',
  brick: 'wall',
  sheep: 'sheep',
  wheat: 'barley',
  ore: 'diamond-stone'  
};

export const resourceCardColors = {
  lumber: tileColors.tileLumber,
  brick: tileColors.tileBrick,
  sheep: tileColors.tileSheep,
  wheat: tileColors.tileWheat,
  ore: tileColors.tileOre,
  harborGeneric: 'black'
};

export const initialResourceCounts = {
  lumber: 0,
  sheep: 0,
  brick: 0,
  wheat: 0,
  ore: 0
};
