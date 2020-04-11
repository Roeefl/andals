import structureTileMap from '@/tilemaps/structures';
import roadTileMap from '@/tilemaps/roads';
import { TILE_WATER } from '@/utils/tileManifest';

// @TODO: Find a way to share this method and similar others across server-client - they are identical and currently I need to keep 2 copies
function hexTileAdjacentStructures(tileRow, tileCol) {
  // offset by +2 for EVEN rows only
  const colOffset = tileRow % 2 === 0 ? 2 : 0;

  // top-left, top, top-right, bottom-left, bottom, bottom-right
  return [
    [tileRow, tileCol * 2],
    [tileRow, tileCol * 2 + 1],
    [tileRow, tileCol * 2 + 2],
    [tileRow + 1, tileCol * 2 - 1 + colOffset],
    [tileRow + 1, tileCol * 2 + colOffset],
    [tileRow + 1, tileCol * 2 + 1 + colOffset]
  ];
};

export function harborAdjacentStructures(tileRow, tileCol, harborPorts = [0, 1]) {
  const adjacentStructures = hexTileAdjacentStructures(tileRow, tileCol)
    .filter(([sRow, sCol]) => sRow >= 0 && sRow < structureTileMap.length && !!structureTileMap[sRow][sCol]);

  const [firstPortIndex, secondPortIndex] = harborPorts;

  return adjacentStructures.length > 2
    ? [
        adjacentStructures[firstPortIndex],
        adjacentStructures[secondPortIndex]
      ]
    : adjacentStructures;
};

function adjacentStructuresToStructure(tileType, row, col) {
  // offset by +2 for EVEN rows only
  const colOffset = row % 2 === 0 ? 2 : 0;
  
  // If structure tile type is 'TOP', push tile directly above it
  // If structure tile type it 'TOP-LEFT', push tile directly below it
  const thirdAdjacentTile = (tileType === 1)
    ? [row - 1, col - 1 + colOffset]
    : [row + 1, col - 1 + colOffset];

  return [
    [row, col], // structure itself
    [row, col - 1], [row, col + 1], // prev, next in same row
    thirdAdjacentTile
  ];
};

export function harborAdjacentToStructure(board, row, col, harborPorts = [0, 1]) {
  return board
    .filter(({ type, resource }) => type === TILE_WATER && !!resource)
    .find(({ row: tileRow, col: tileCol }) => {
      const adjacentStructures = harborAdjacentStructures(tileRow, tileCol, harborPorts);
      return adjacentStructures.some(([structureRow, structureCol]) => structureRow === row && structureCol === col);
    });
}

export function isPurchaseAllowedSettlement(activeStructures, activeRoads, mySessionId, row, col, isSetupPhase = false, board = [], harborPorts = [0, 1]) {
  if (!isSetupPhase) {
    const isAdjacentToOwnedRoad = activeRoads
      .flat()
      .filter(road => !!road && road.ownerId && road.ownerId === mySessionId)
      .map(({ row: roadRow, col: roadCol }) => {
        const roadTile = roadTileMap[roadRow][roadCol];
        if (!roadTile) return false;
  
        let allowedStructures = [];
  
        // offset by +2 for EVEN rows only
        // let colOffset = roadRow % 2 === 0 ? 2 : 0;
        
        switch (roadTile) {
          case 1:
          case 2:
            allowedStructures = [[Math.floor(roadRow / 2), roadCol], [Math.floor(roadRow / 2), roadCol + 1]];
            break;
  
          case 3:
            allowedStructures = [[Math.floor(roadRow / 2), roadCol], [Math.ceil(roadRow / 2), roadCol - 1]];
            break;
        }
  
        return allowedStructures.some(([itemRow, itemCol]) => itemRow === row && itemCol === col);
      });
  
    if (isAdjacentToOwnedRoad.every(allowed => !allowed)) return false;
  }

  // Not allowed to place structure on ports on setup round
  if (isSetupPhase && harborAdjacentToStructure(board, row, col, harborPorts)) return false;

  const isAdjacentToActiveStructures = activeStructures
    .flat()
    .filter(structure => !!structure && !!structure.ownerId)
    .map(({ row: structureRow, col: structureCol }) => {
      const structureTile = structureTileMap[structureRow][structureCol]; // 'hide' === 0,'top' === 1, 'top-left' === 2
      if (!structureTile) return false;

      const adjacentStructureTiles = adjacentStructuresToStructure(structureTile, structureRow, structureCol);
      return adjacentStructureTiles.some(([tileRow, tileCol]) => tileRow === row && tileCol === col);
    });

  return isAdjacentToActiveStructures.every(isAdjacent => !isAdjacent);
};

export function isPurchaseAllowedRoad(activeStructures, activeRoads, mySessionId, row, col, isSetupPhase = false, lastStructureBuilt = null) {
  const allRoads = activeRoads.flat();

  // Already owns this road...
  if (allRoads.find(road => !!road && road.ownerId === mySessionId && road.row === row && road.col === col))
    return false;

  const isAllowedPerStructure = activeStructures
    .flat()
    .filter(structure => !isSetupPhase || !lastStructureBuilt || (!!structure && structure.row === lastStructureBuilt.row && structure.col === lastStructureBuilt.col))
    .filter(structure => !!structure && structure.ownerId && structure.ownerId === mySessionId)
    .map(({ row: structureRow, col: structureCol }) => {
      const structureTile = structureTileMap[structureRow][structureCol]; // 'hide' === 0,'top' === 1, 'top-left' === 2
      if (!structureTile) return false;

      let intersections = [[structureRow * 2, structureCol - 1], [structureRow * 2, structureCol]];
      const colOffset = structureRow % 2 === 0 ? 2 : 0;

      if (structureTile === 1) { // 'top' ?
        intersections = [
          ...intersections,
          [structureRow * 2 - 1, structureCol],
          [structureRow * 2 - 1, structureCol - 1 + colOffset]
        ];
      } else {
        intersections = [
          ...intersections,
          [structureRow * 2 + 1, structureCol - 1],
          [structureRow * 2 + 1, structureCol]
        ];
      }

      return intersections.some(([iRow, iCol]) => iRow === row && iCol === col);
    });

  // During setup phase -- only allow if adjacent to the last structure built
  if (isSetupPhase) return isAllowedPerStructure.some(allowed => allowed);

  const isAllowedPerRoad = allRoads
    .filter(road => !!road && road.ownerId && road.ownerId === mySessionId)
    .map(({ row: roadRow, col: roadCol }) => {
      // 0: 'hide', 1: 'top-left', 2: 'top-right', 3: 'left'
      const roadTile = roadTileMap[roadRow][roadCol];
      if (!roadTile) return false;

      let intersections = [];

      // offset by +2 for EVEN rows only
      let colOffset = 0;
      
      switch (roadTile) {
        // road: [6, 6], type: 1 || intersecting roads: [6, 5], [6, 7], [5, 6], [7, 6]
        case 1:
          colOffset = roadRow % 2 === 0 ? -2 : 0;
          intersections = [[roadRow, roadCol - 1], [roadRow, roadCol + 1], [roadRow - 1, roadCol + colOffset], [roadRow - 1, roadCol + 1 + colOffset], [roadRow + 1, roadCol]];
          break;

        // road: [6, 7], type: 2 || intersecting roads: [6, 6], [6, 8], [5, 5], [7, 7]
        case 2:
          colOffset = roadRow % 2 === 0 ? 1 : 0;
          intersections = [[roadRow, roadCol - 1], [roadRow, roadCol + 1], [roadRow - 1, roadCol - 1 + colOffset], [roadRow + 1, roadCol], [roadRow + 1, roadCol + 1]];
          break;

        // road: [7, 7], type: 3 || intersecting roads: [6, 6], [6, 7], [8, 5], [8, 6]
        case 3:
          colOffset = (roadRow <= 3 || roadRow >= 10) ? -2 : 0;
          intersections = [[roadRow - 1, roadCol], [roadRow - 1, roadCol - 1], [roadRow + 1, roadCol + colOffset], [roadRow + 1, roadCol + 1 + colOffset]];
          break;
      }

      return intersections.some(([iRow, iCol]) => iRow === row && iCol === col);
    });

  return isAllowedPerStructure.some(allowed => allowed) || isAllowedPerRoad.some(allowed => allowed);
};
