import structureTileMap from '@/tilemaps/structures';

function adjacentStructuresToStructure(tileType, row, col) {
  const intersections = [
    [row, col], // structure itself
    [row, col - 1], [row, col + 1] // prev, next in same row
  ];

  // offset by +2 for EVEN rows only
  const colOffset = row % 2 === 0 ? 2 : 0;

  if (tileType === 1) {
    // If structure tile type is 'TOP', push tile directly above it
    intersections.push([row - 1, col - 1 + colOffset]);
  } else {
    // If structure tile type it 'TOP-LEFT', push tile directly below it
    intersections.push([row + 1, col - 1 + colOffset]);
  }

  return intersections;
}

export function isPurchaseAllowedSettlement(activeStructures, row, col) {
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
