
const initialActiveStructuresRows = 7;
const initialActiveStructuresColumns = 14;

const initialActiveRoadsRows = 14;
const initialActiveRoadsColumns = 14;

class BoardService {
  initialStructures() {
    return new Array(initialActiveStructuresRows)
      .fill(0)
      .map(row => new Array(initialActiveStructuresColumns).fill(0))
  }

  initialRoads() {
    return new Array(initialActiveRoadsRows)
      .fill(0)
      .map(row => new Array(initialActiveRoadsColumns).fill(0))
  }

  absoluteIndex(tilemap, row, col) {
    return row * tilemap[0].length + col;
  }
}

export default new BoardService();
