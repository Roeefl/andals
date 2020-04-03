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
            v-if="roadTileMap[i * 2][j * 2]"
            :placement="roadTileTypes[roadTileMap[i * 2][j * 2]]"
            :enabled="hasResourcesRoad"
            @clicked="$emit('tile-clicked', { type: 'road', row: i * 2, col: j * 2 })"
            :activeData="activeRoads[i * 2][j * 2] || {}"
          />
          <RoadTile
            v-if="roadTileMap[i * 2][j * 2 + 1]"
            :placement="roadTileTypes[roadTileMap[i * 2][j * 2 + 1]]"
            :enabled="hasResourcesRoad"
            @clicked="$emit('tile-clicked', { type: 'road', row: i * 2, col: j * 2 + 1 })"
            :activeData="activeRoads[i * 2][j * 2 + 1] || {}"
          />
          <RoadTile
            v-if="roadTileMap[i * 2 + 1][j * 2]"
            :placement="roadTileTypes[roadTileMap[i * 2 + 1][j * 2]]"
            :enabled="hasResourcesRoad"
            @clicked="$emit('tile-clicked', { type: 'road', row: i * 2 + 1, col: j * 2 })"
            :activeData="activeRoads[i * 2 + 1][j * 2] || {}"
          />
          <RoadTile
            v-if="roadTileMap[i * 2 + 1][j * 2 + 1]"
            :placement="roadTileTypes[roadTileMap[i * 2 + 1][j * 2 + 1]]"
            :enabled="hasResourcesRoad"
            @clicked="$emit('tile-clicked', { type: 'road', row: i * 2 + 1, col: j * 2 + 1 })"
            :activeData="activeRoads[i * 2 + 1 ][j * 2 + 1] || {}"
          />

          <fragment v-if="started && isMyTurn">
            <StructureTile
              v-if="structureTileMap[i][j * 2]"
              :placement="structureTileTypes[structureTileMap[i][j * 2]]" 
              :enabled="hasResourcesStructure"
              @clicked="$emit('tile-clicked', { type: 'settlement', row: i, col: j * 2 })"
              :activeData="activeStructures[i][j * 2] || {}"
            />
            <StructureTile
              v-if="structureTileMap[i][j * 2 + 1]"
              :placement="structureTileTypes[structureTileMap[i][j * 2 + 1]]"
              :enabled="hasResourcesStructure"
              @clicked="$emit('tile-clicked', { type: 'settlement', row: i, col: j * 2 + 1 })"
              :activeData="activeStructures[i][j * 2 + 1] || {}"
            />
          </fragment>
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
      started: {
        type: Boolean,
        default: false
      },
      isMyTurn: {
        type: Boolean,
        default: false
      },
      board: Array
    },
    data: () => ({
      hasResourcesRoad: false,
      hasResourcesStructure: false
    }),
    computed: mapState([
      'activeStructures',
      'activeRoads',
      'myPlayer'
    ]),
    updated() {
      const { resourceCounts = {} } = this.myPlayer;

      this.hasResourcesRoad = Object.entries(resourceCounts)
        .every(([resourceName, value]) => value >= buildingCosts.road[resourceName]);

      this.hasResourcesStructure = Object.entries(resourceCounts)
        .every(([resourceName, value]) => value >= buildingCosts.settlement[resourceName]);
    },
    created() {
      this.hexTileMap = hexTileMap;
      this.roadTileMap = roadTileMap;
      this.roadTileTypes = roadTileTypes;
      this.structureTileMap = structureTileMap;
      this.structureTileTypes = structureTileTypes;
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
