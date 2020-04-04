<template>
  <div v-if="board" class="board" :class="{ ready }">
    <div class="tiles">
      <div v-for="(row, i) in hexTileMap" :key="`row-${i}`" class="tile-row" :class="[row.type]">
        <HexTile
          v-for="(tile, j) in row.tiles"
          :key="`tile-${i}-${j}`"
          :type="tile"
          :tile="board[i * 7 + j]"
        >
          <RoadTile
            v-for="([row, col]) in [[i * 2, j * 2], [i * 2, j * 2 + 1], [i * 2 + 1, j * 2], [i * 2 + 1, j * 2 + 1]]"
            :key="`road-tile-${row}-${col}`"
            v-show="roadTileMap[row][col]"
            :placement="roadTileTypes[roadTileMap[row][col]]"
            :enabled="isRoadPurchaseEnabled && isRoadAllowed(row, col)"
            @clicked="$emit('tile-clicked', { type: 'road', row, col })"
            :activeData="activeRoads[row][col] || {}"
            :myColor="myPlayer.color"
          />
          <StructureTile
            v-for="([row, col]) in [[i, j * 2], [i, j * 2 + 1]]"
            :key="`structure-tile-${row}-${col}`"
            v-show="structureTileMap[row][col]"
            :placement="structureTileTypes[structureTileMap[row][col]]" 
            :enabled="isSettlementPurchaseEnabled"
            @clicked="$emit('tile-clicked', { type: 'settlement', row, col })"
            :activeData="activeStructures[row][col] || {}"
            :myColor="myPlayer.color"
          />
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

  import HexTile from '@/components/HexTile';
  import RoadTile from '@/components/RoadTile';
  import StructureTile from '@/components/StructureTile';

  import hexTileMap from '@/tilemaps/hexes';
  import roadTileMap, { types as roadTileTypes } from '@/tilemaps/roads';
  import structureTileMap, { types as structureTileTypes } from '@/tilemaps/structures';
  import buildingCosts from '@/utils/buildingCosts';

  export default {
    name: 'GameBoard',
    components: {
      HexTile,
      RoadTile,
      StructureTile
    },
    props: {
      ready: {
        type: Boolean,
        default: false
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
          (this.isSetupPhase || this.isDiceRolled)
        );
      },
      isSettlementPurchaseEnabled: function() {
        return this.isMyTurn && this.myPlayer.hasResources.settlement && (this.isDiceRolled || this.isSetupPhase);
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
    },
    methods: {
      isRoadAllowed: function(row, col) {
        const isAllowedPerStructure = this.activeStructures
          .flat()
          .filter(structure => !!structure && structure.ownerId && structure.ownerId === this.myPlayer.playerSessionId)
          .map(({ row: sRow, col: sCol }) => {
            const structureTile = structureTileMap[sRow][sCol]; // 'top' === 1 or 'top-left' === 2

            if (!structureTile) return false;

            const intersections = structureTile === 1 // 'top' ?
              ? [[sRow * 2 - 1, sCol - 1], [sRow * 2, sCol - 1], [sRow * 2, sCol]] // structure: [3, 7], type: 1 || intersecting roads:  [5, 6], [6, 6], [6, 7]
              : [[sRow * 2, sCol - 1], [sRow * 2, sCol], [sRow * 2 + 1, sCol]]     // structure: [3, 8], type: 2 || intersecting roads:  [6, 7], [6, 8], [7, 8]

            return intersections.some(([rRow, rCol]) => rRow === row && rCol === col);
          });

        return isAllowedPerStructure.some(r => r);

        // return isAdjacentToStructure;
        // adjcent roads are:
        // X-AXIS BEFORE AND AFTER - ALWAYS [2, 3], [2, 5]
        // Y-AXIS: [1, 3], [1, 4] AND [3, 3] [3, 4]
        // this.activeRoads;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .board {
    // opacity: 0.4;

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
