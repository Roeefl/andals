<template>
  <div v-if="board" class="board" :class="{ ready }">
    <div class="tiles">
      <div v-for="(row, i) in tileRows" :key="`row-${i}`" class="tile-row" :class="[row.type]">
        <Tile
          v-for="(tile, j) in row.tiles"
          :key="`tile-${i}-${j}`"
          :type="tile"
          :tile="board[i * 7 + j]"
        >
          <Road v-if="roadTiles[i * 2][j * 2]" :placement="roadTileIndexToPlacement[roadTiles[i * 2][j * 2]]"/>
          <Road v-if="roadTiles[i * 2][j * 2 + 1]" :placement="roadTileIndexToPlacement[roadTiles[i * 2][j * 2 + 1]]"/>
          <Road v-if="roadTiles[i * 2 + 1][j * 2]" :placement="roadTileIndexToPlacement[roadTiles[i * 2 + 1][j * 2]]"/>
          <Road v-if="roadTiles[i * 2 + 1][j * 2 + 1]" :placement="roadTileIndexToPlacement[roadTiles[i * 2 + 1][j * 2 + 1]]"/>

          <Structure v-if="structureTiles[i][j * 2]" :placement="structureTileIndexToPlacement[structureTiles[i][j * 2]]" />
          <Structure v-if="structureTiles[i][j * 2 + 1]" :placement="structureTileIndexToPlacement[structureTiles[i][j * 2 + 1]]" />
        </Tile>
      </div>
    </div>
  </div>
  <div v-else>
    No board to display
  </div>
</template>

<script>
  import Tile from '@/components/Tile';
  import Road from '@/components/Road';
  import Structure from '@/components/Structure';

  import {
    tileRows,
    totalResourceTiles,
    TILE_SPACER, TILE_WATER, TILE_RESOURCE,
    roadTiles, roadTileIndexToPlacement,
    structureTiles, structureTileIndexToPlacement
  } from '@/utils/tileManifest';

  export default {
    name: 'Board',
    components: {
      Tile,
      Road,
      Structure
    },
    props: {
      ready: {
        type: Boolean,
        default: false
      },
      board: Array
    },
    computed: {
      TILE_RESOURCE: () => TILE_RESOURCE,
      tileRows: () => tileRows,
      roadTiles: () => roadTiles,
      roadTileIndexToPlacement: () => roadTileIndexToPlacement,
      structureTiles: () => structureTiles,
      structureTileIndexToPlacement: () => structureTileIndexToPlacement
      // tilesMap: function() {
      //   return this.tileRows.map(row => {

      //   });
      // }
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
