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
            :enabled="isRoadPurchaseEnabled"
            @clicked="$emit('tile-clicked', { type: 'road', row, col })"
            :activeData="activeRoads[row][col] || {}"
          />
          <StructureTile
            v-for="([row, col]) in [[i, j * 2], [i, j * 2 + 1]]"
            :key="`structure-tile-${row}-${col}`"
            v-show="structureTileMap[row][col]"
            :placement="structureTileTypes[structureTileMap[row][col]]" 
            :enabled="isSettlementPurchaseEnabled"
            @clicked="$emit('tile-clicked', { type: 'settlement', row, col })"
            :activeData="activeStructures[row][col] || {}"
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
        return this.isMyTurn && this.myPlayer.hasResources.road && (this.isDiceRolled || this.isSetupPhase);
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
