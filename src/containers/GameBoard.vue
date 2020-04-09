<template>
  <div v-if="board" class="board" :class="{ ready }">
    <div class="tiles">
      <div v-for="(row, i) in hexTileMap" :key="`row-${i}`" class="tile-row" :class="[row.type]">
        <HexTile
          v-for="(tile, j) in row.tiles"
          :key="`tile-${i}-${j}`"
          :type="tile"
          :tile="board[i * 7 + j]"
          @dropped="onRobberDropped(i * 7 + j)"
        >
          <RoadTile
            v-for="([row, col]) in [[i * 2, j * 2], [i * 2, j * 2 + 1], [i * 2 + 1, j * 2], [i * 2 + 1, j * 2 + 1]]"
            :key="`road-tile-${row}-${col}`"
            v-if="roadTileMap[row][col]"
            :placement="roadTileTypes[roadTileMap[row][col]]"
            :enabled="isRoadPurchaseEnabled && isRoadAllowed(row, col)"
            @clicked="$emit('tile-clicked', { type: ROAD, row, col })"
            :activeData="activeRoads[row][col] || {}"
            :myColor="myPlayer.color"
          />
          <StructureTile
            v-for="([row, col]) in [[i, j * 2], [i, j * 2 + 1]]"
            :key="`structure-tile-${row}-${col}`"
            v-if="structureTileMap[row][col]"
            :placement="structureTileTypes[structureTileMap[row][col]]" 
            :enabled="isSettlementPurchaseEnabled && (isSettlementAllowed(row, col) || isCityAllowed(row, col))"
            @clicked="$emit('tile-clicked', { type: (activeStructures[row][col].type === SETTLEMENT ? CITY : SETTLEMENT), row, col })"
            :activeData="activeStructures[row][col] || {}"
            :myColor="myPlayer.color"
          />
          <drag :transfer-data="{}">
            <Robber
              v-if="(myPlayer.mustMoveRobber && (desiredRobberTile === -1 ? robberPosition === i * 7 + j : desiredRobberTile === i * 7 + j)) || (!myPlayer.mustMoveRobber && robberPosition === i * 7 + j)"
              :active="myPlayer.mustMoveRobber"
            />
          </drag>
        </HexTile>
      </div>
    </div>
  </div>
  <div v-else>
    No board to display
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  import HexTile from '@/components/tiles/HexTile';
  import RoadTile from '@/components/tiles/RoadTile';
  import StructureTile from '@/components/tiles/StructureTile';
  import Robber from '@/components/game/Robber';

  import hexTileMap from '@/tilemaps/hexes';
  import roadTileMap, { types as roadTileTypes } from '@/tilemaps/roads';
  import structureTileMap, { types as structureTileTypes } from '@/tilemaps/structures';
  import buildingCosts, { ROAD, SETTLEMENT, CITY, GAMECARD } from '@/utils/buildingCosts';
  import { isPurchaseAllowedSettlement } from '@/utils/board';

  export default {
    name: 'GameBoard',
    components: {
      HexTile,
      RoadTile,
      StructureTile,
      Robber
    },
    props: {
      ready: {
        type: Boolean,
        default: false
      },
      robberPosition: {
        type: Number,
        required: true
      },
      desiredRobberTile: {
        type: Number,
        required: true
      },
      isSetupPhase: {
        type: Boolean,
        default: false
      },
      isMyTurn: {
        type: Boolean,
        default: false
      },
      isDiceRolled: {
        type: Boolean,
        default: false
      },
      board: Array
    },
    computed: {
      isRoadPurchaseEnabled: function() {
        return (
          this.isMyTurn &&
          this.myPlayer.hasResources.road &&
          (this.isSetupPhase || this.isDiceRolled) &&
          !this.myPlayer.mustMoveRobber
        );
      },
      isSettlementPurchaseEnabled: function() {
        return (
          this.isMyTurn &&
          (this.myPlayer.hasResources.settlement || this.myPlayer.hasResources.city) &&
          (this.isDiceRolled || this.isSetupPhase) &&
          !this.myPlayer.mustMoveRobber
        );
      },
      ...mapState([
        'activeStructures',
        'activeRoads',
        'myPlayer'
      ])
    },
    created() {
      this.hexTileMap = hexTileMap;
      this.roadTileMap = roadTileMap;
      this.roadTileTypes = roadTileTypes;
      this.structureTileMap = structureTileMap;
      this.structureTileTypes = structureTileTypes;
      this.ROAD = ROAD;
      this.SETTLEMENT = SETTLEMENT;
      this.CITY = CITY;
      this.GAMECARD = GAMECARD;
    },
    methods: {
      isSettlementAllowed: function(row, col) {
        return isPurchaseAllowedSettlement(this.activeStructures, row, col);
      },
      isCityAllowed: function(row, col) {
        return this.myPlayer.hasResources.city && !!this.activeStructures[row][col] && this.activeStructures[row][col].type === SETTLEMENT;
      },
      isRoadAllowed: function(row, col) {
        const isAllowedPerStructure = this.activeStructures
          .flat()
          .filter(structure => !!structure && structure.ownerId && structure.ownerId === this.myPlayer.playerSessionId)
          .map(({ row: sRow, col: sCol }) => {
            const structureTile = structureTileMap[sRow][sCol]; // 'hide' === 0,'top' === 1, 'top-left' === 2
            if (!structureTile) return false;

            // structure: [3, 7], type: 1 || intersecting roads:  [5, 6], [6, 6], [6, 7]
            // structure: [3, 8], type: 2 || intersecting roads:  [6, 7], [6, 8], [7, 8]
            let intersections = [[sRow * 2, sCol - 1], [sRow * 2, sCol]];

            let colOffset = sRow % 2 === 0 ? 2 : 0;

            if (structureTile === 1) { // 'top' ?
              intersections = [
                ...intersections,
                [sRow * 2 - 1, sCol],
                [sRow * 2 - 1, sCol - 1 + colOffset]
              ];
            } else {
              intersections = [
                ...intersections,
                [sRow * 2 + 1, sCol - 1],
                [sRow * 2 + 1, sCol]
              ];
            }

            return intersections.some(([iRow, iCol]) => iRow === row && iCol === col);
          });

        const isAllowedPerRoad = this.activeRoads
          .flat()
          .filter(road => !!road && road.ownerId && road.ownerId === this.myPlayer.playerSessionId)
          .map(({ row: sRow, col: sCol }) => {
            // 0: 'hide', 1: 'top-left', 2: 'top-right', 3: 'left', 4: 'right'
            const roadTile = roadTileMap[sRow][sCol];
            if (!roadTile) return false;

            let intersections = [];
            
            // offset by +2 for EVEN rows only
            let colOffset = sRow % 2 === 0 ? 2 : 0;

            switch (roadTile) {
              // road: [6, 6], type: 1 || intersecting roads: [6, 5], [6, 7], [5, 6], [7, 6]
              case 1:
                intersections = [[sRow, sCol - 1], [sRow, sCol + 1], [sRow - 1, sCol + 2], [sRow + 1, sCol]];
                break;

              // road: [6, 7], type: 2 || intersecting roads: [6, 6], [6, 8], [5, 5], [7, 7]
              case 2:
                intersections = [[sRow, sCol - 1], [sRow, sCol + 1], [sRow - 1, sCol - 2], [sRow + 1, sCol]];
                break;

              // road: [7, 7], type: 3 || intersecting roads: [6, 6], [6, 7], [8, 5], [8, 6]
              case 3:
                colOffset = 0;
                intersections = [[sRow - 1, sCol], [sRow - 1, sCol - 1], [sRow + 1, sCol - 2 + colOffset], [sRow + 1, sCol - 1 + colOffset]];
                break;

              // road: [9, 9], type: 4 || intersecting roads: [8, 9], [8, 10], [10, 10], [10, 11]
              case 4:
                intersections = [[sRow - 1, sCol], [sRow - 1, sCol + 1], [sRow + 1, sCol + 1], [sRow + 1, sCol + 2]];
                break;
            }

            return intersections.some(([iRow, iCol]) => iRow === row && iCol === col);
          });

        return isAllowedPerStructure.some(s => s) || isAllowedPerRoad.some(r => r);
      },
      onRobberDropped: function(tileIndex) {
        if (!this.myPlayer.mustMoveRobber) return;
        this.$emit('robber-dropped', tileIndex);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .board {
    // opacity: 0.6;
    background-image: url('../assets/ocean.jpg');
    background-size: cover;
    border: 4px dashed black;
    padding-left: $spacer * 2.5;

    &.ready {
      opacity: 1;
    }

    .tiles {
      padding-left: $spacer * 3;
      // overflow-x: hidden;
    }
  }

  .tile-row {
    position: relative;
    
    &.even {
      left: $tile-size / 1.1;
    }

    &.odd {
      margin-top: $tile-size * -0.85;
      margin-bottom: $tile-size * -0.9
    }
  }
</style>
