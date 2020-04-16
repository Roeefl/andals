<template>
  <div v-if="board" class="board" :class="{ ready }">
    <div class="tiles">
      <div v-for="(row, i) in hexTileMap" :key="`row-${i}`" class="tile-row" :class="[row.type]">
        <HexTile
          v-for="(tile, j) in row.tiles"
          :key="`tile-${i}-${j}`"
          :type="tile"
          :tile="board[absoluteIndex(i, j)]"
          @dropped="onRobberDropped(absoluteIndex(i, j))"
        >
          <span v-if="isDeveloperMode" class="tile-index">
            [{{ i }}, {{ j }}]
          </span>
          <RoadTile
            v-for="([row, col]) in [[i * 2, j * 2], [i * 2, j * 2 + 1], [i * 2 + 1, j * 2], [i * 2 + 1, j * 2 + 1]]"
            :key="`road-tile-${row}-${col}`"
            v-if="roadTileMap[row][col]"
            :placement="roadTileTypes[roadTileMap[row][col]]"
            :enabled="allowPurchase && myPlayer.hasResources.road && isRoadAllowed(row, col)"
            @clicked="$emit('tile-clicked', { type: ROAD, row, col })"
            :activeData="activeRoads[row][col] || {}"
            :myColor="myPlayer.color"
          >
            <span v-if="isDeveloperMode" class="road-index">
              [{{ row }}, {{ col }}]
            </span>
          </RoadTile>
          <StructureTile
            v-for="([row, col]) in [[i, j * 2], [i, j * 2 + 1]]"
            :key="`structure-tile-${row}-${col}`"
            v-if="structureTileMap[row][col]"
            :placement="structureTileTypes[structureTileMap[row][col]]" 
            :enabled="(allowPurchase && myPlayer.hasResources.settlement && isSettlementAllowed(row, col)) || (allowPurchase && myPlayer.hasResources.city && isCityAllowed(row, col))"
            @clicked="$emit('tile-clicked', { type: (activeStructures[row][col].type === SETTLEMENT ? CITY : SETTLEMENT), row, col })"
            :activeData="activeStructures[row][col] || {}"
            :harbor="harborAdjacentToStructure(board, row, col, harborPorts)"
            :myColor="myPlayer.color"
          >
            <span v-if="isDeveloperMode" class="structure-index">
              [{{ row }}, {{ col }}]
            </span>
          </StructureTile>
          <HarborTile :tile="board[absoluteIndex(i, j)]" />
          <drag :transfer-data="{}">
            <RobberTile
              v-if="isDisplayRobberTile(i, j)"
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

  import boardService from '@/services/board';

  import HexTile from '@/components/tiles/HexTile';
  import RoadTile from '@/components/tiles/RoadTile';
  import StructureTile from '@/components/tiles/StructureTile';
  import RobberTile from '@/components/tiles/RobberTile';
  import HarborTile from '@/components/tiles/HarborTile';

  import hexTileMap from '@/tilemaps/hexes';
  import roadTileMap, { types as roadTileTypes } from '@/tilemaps/roads';
  import structureTileMap, { types as structureTileTypes } from '@/tilemaps/structures';
  import buildingCosts, { ROAD, SETTLEMENT, CITY, GAMECARD } from '@/utils/buildingCosts';
  import { isPurchaseAllowedSettlement, isPurchaseAllowedRoad, harborAdjacentToStructure } from '@/utils/board';
  import { TILE_WATER } from '@/utils/tileManifest';

  export default {
    name: 'GameBoard',
    components: {
      HexTile,
      RoadTile,
      StructureTile,
      HarborTile,
      RobberTile
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
      board: {
        type: Array,
        default: () => []
      },
      harborPorts: {
        type: Array,
        default: () => [0, 1]
      }
    },
    computed: {
      allowPurchase: function() {
        return (
          this.isMyTurn &&
          (this.isSetupPhase || this.isDiceRolled) &&
          !this.myPlayer.mustMoveRobber
        );
      },
      ...mapState([
        'isDeveloperMode',
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
      this.TILE_WATER = TILE_WATER;
      this.harborAdjacentToStructure = harborAdjacentToStructure;
      this.absoluteIndex = boardService.absoluteIndex;
    },
    methods: {
      isRoadAllowed: function(row, col) {
        return isPurchaseAllowedRoad(this.activeStructures, this.activeRoads, this.myPlayer.playerSessionId, row, col, this.isSetupPhase, this.myPlayer.lastStructureBuilt);
      },
      isSettlementAllowed: function(row, col) {
        return isPurchaseAllowedSettlement(this.activeStructures, this.activeRoads, this.myPlayer.playerSessionId, row, col, this.isSetupPhase, this.board, this.harborPorts);
      },
      isCityAllowed: function(row, col) {
        return this.myPlayer.hasResources.city && !!this.activeStructures[row][col] && this.activeStructures[row][col].type === SETTLEMENT;
      },
      onRobberDropped: function(tileIndex) {
        if (!this.myPlayer.mustMoveRobber) return;
        this.$emit('robber-dropped', tileIndex);
      },
      isDisplayRobberTile: function(row, col) {
        const absoluteTileIndex = boardService.absoluteIndex(row, col);

        const isStaticPosition = !this.myPlayer.mustMoveRobber && this.robberPosition === absoluteTileIndex;

        const dynamicPosition = this.desiredRobberTile === -1
          ? this.robberPosition
          : this.desiredRobberTile;
        const isDynamicPosition = this.myPlayer.mustMoveRobber && absoluteTileIndex === dynamicPosition;

         return isStaticPosition || isDynamicPosition;
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  // opacity: 0.5;
  
  .tiles {
    padding-left: $spacer * 3;
    // overflow-x: hidden;
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

    .tile-index {
      transform: rotate(90deg);
      font-size: $font-size-xs;
      position: absolute;
      top: 5px;
      right: 5px;
    }

    .structure-index {
      position: absolute;
      top: 0;
      right: 0;
      color: black;
    }

    .road-index {
      position: absolute;
      bottom: $spacer / 2;
      left: $spacer / 2;
      color: black;
      opacity: 1;
    }
  }
</style>
