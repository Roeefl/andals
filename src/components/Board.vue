<template>
  <div class="board">
    <div class="tiles" v-if="board">
      <div v-for="(row, i) in tileRows" :key="`row-${i}`" class="row" :class="[row.type]">
        <Tile
          v-for="(tile, j) in row.tiles"
          :key="`tile-${i}-${j}`"
          :type="tile"
          :resourceData="getTileResourceData(tile)"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { tileRows, totalResourceTiles, TILE_RESOURCE } from '@/utils/tileManifest';
  import Tile from '@/components/Tile';

  let tileRenderingResourceCounter = -1;

  export default {
    name: 'Board',
    props: {
      board: Array
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

        tileRenderingResourceCounter++;
        return this.board[(tileRenderingResourceCounter % totalResourceTiles)];
      }
    } 
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .board {
    background: gray;
    padding: $spacer * 3;
  }

  .row {
    position: relative;
    
    &.even {
      left: ($tile-size / 1.1);
    }

    &.odd {
      margin-top: -78px;
      margin-bottom: -80px;
    }
  }
</style>
