<template>
  <div v-if="board" class="board" :class="{ started: isGameStarted }">
    <div class="tiles">
      <div v-for="(row, i) in tileRows" :key="`row-${i}`" class="row" :class="[row.type]">
        <Tile
          v-for="(tile, j) in row.tiles"
          :key="`tile-${i}-${j}`"
          :type="tile"
          :resourceData="getTileResourceData(tile)"
          :harborData="getTileHarborData(tile)"
        />
      </div>
    </div>
  </div>
  <div v-else>
    No board to display
  </div>
</template>

<script>
  import Tile from '@/components/Tile';

  import {
    tileRows,
    totalResourceTiles, totalWaterTiles,
    TILE_SPACER, TILE_WATER, TILE_RESOURCE
  } from '@/utils/tileManifest';
  
  let tileRenderingCounter = -1;
  let harborRenderingCounter = -1;

  export default {
    name: 'Board',
    props: {
      isGameStarted: {
        type: Boolean,
        default: false
      },
      board: Array,
      harbors: Array
    },
    components: {
      Tile
    },
    data: () => ({
      tileRows
    }),
    methods: {
      getTileResourceData: function(tileType) {
        if (tileType !== TILE_RESOURCE) return {};

        tileRenderingCounter++;
        return this.board[(tileRenderingCounter % totalResourceTiles)];
      },
      getTileHarborData: function(tileType) {
        if (tileType !== TILE_WATER) return {};

        harborRenderingCounter++;
        return this.harbors[(harborRenderingCounter % totalWaterTiles)];
      }
    } 
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .board {
    opacity: 0.25;

    &.started {
      opacity: 1;
    }

    .tiles {
      padding-left: $spacer * 3;
      // overflow-x: hidden;
    }
  }

  .row {
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
