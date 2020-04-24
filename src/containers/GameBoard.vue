<template>
  <div v-if="roomState.board" class="board">
    <div class="tiles">
      <div v-for="(tileRow, rowIndex) in hexTileMap" :key="`row-${rowIndex}`" class="tile-row" :class="{ 'even': rowIndex % 2 === 0 , 'odd': rowIndex % 2 === 1 }">
        <HexTile
          v-for="(tile, colIndex) in tileRow"
          :key="`tile-${rowIndex}-${colIndex}`"
          :type="hexTileTypes[tile]"
          :tile="roomState.board[absoluteIndex(hexTileMap, rowIndex, colIndex)]"
          @dropped="onRobberDropped(absoluteIndex(hexTileMap, rowIndex, colIndex))"
          class="hex-tile"
          :class="{ 'robber-camp': rowIndex === 0 && colIndex === 0 }"
        >
          <span v-if="isDeveloperMode" class="tile-index">
            [{{ rowIndex }}, {{ colIndex }}]
          </span>
          <RoadTile
            v-for="([row, col]) in roadIndices(rowIndex, colIndex)"
            :key="`road-tile-${row}-${col}`"
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
            v-for="([row, col]) in structureIndices(rowIndex, colIndex)"
            :key="`structure-tile-${row}-${col}`"
            :placement="structureTileTypes[structureTileMap[row][col]]" 
            :enabled="(allowPurchase && myPlayer.hasResources.settlement && isSettlementAllowed(row, col)) || (allowPurchase && myPlayer.hasResources.city && isCityAllowed(row, col))"
            @clicked="$emit('tile-clicked', { type: (activeStructures[row][col].type === SETTLEMENT ? CITY : SETTLEMENT), row, col })"
            :activeData="activeStructures[row][col] || {}"
            :harbor="harborAdjacentToStructure(structureTileMap, roomState.board, row, col, roomState.ports)"
            :myColor="myPlayer.color"
          >
            <span v-if="isDeveloperMode" class="structure-index">
              [{{ row }}, {{ col }}]
            </span>
          </StructureTile>
          <HarborTile :tile="roomState.board[absoluteIndex(hexTileMap, rowIndex, colIndex)]" />
          <drag :transfer-data="{}">
            <RobberTile
              v-if="isDisplayRobberTile(rowIndex, colIndex)"
              :active="myPlayer.mustMoveRobber"
            />
          </drag>
          <Wildling
            v-if="!!(roomState.board[absoluteIndex(hexTileMap, rowIndex, colIndex)] || {}).occupiedBy"
            :type="(roomState.board[absoluteIndex(hexTileMap, rowIndex, colIndex)] || {}).occupiedBy.type"
            :size="40"
            :removeable="myPlayer.heroPrivilege === HERO_CARD_Ygritte"
            @remove="$emit('remove-wildling', absoluteIndex(hexTileMap, rowIndex, colIndex))"
            class="wildling"
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
  import { ROOM_TYPE_BASE_GAME, ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';

  import HexTile from '@/components/tiles/HexTile';
  import RoadTile from '@/components/tiles/RoadTile';
  import StructureTile from '@/components/tiles/StructureTile';
  import RobberTile from '@/components/tiles/RobberTile';
  import HarborTile from '@/components/tiles/HarborTile';
  import Wildling from '@/components/pieces/Wildling';

  import { baseGameHexTilemap, firstMenHexTilemap } from '@/tilemaps/hexes';
  import { baseGameRoadTilemap, firstMenRoadTilemap } from '@/tilemaps/roads';
  import { baseGameStructureTilemap, firstMenStructureTilemap } from '@/tilemaps/structures';

  import {hexTileTypes, roadTileTypes, structureTileTypes } from '@/utils/tileManifest';

  import boardService from '@/services/board';
  import { isPurchaseAllowedSettlement, isPurchaseAllowedRoad, harborAdjacentToStructure } from '@/utils/board';
  import { ROAD, SETTLEMENT, CITY } from '@/specs/purchases';
  import { HERO_CARD_Ygritte } from '@/specs/heroCards';

  export default {
    name: 'GameBoard',
    components: {
      HexTile,
      RoadTile,
      StructureTile,
      HarborTile,
      RobberTile,
      Wildling
    },
    props: {
      desiredRobberTile: {
        type: Number,
        required: true
      },
      allowPurchase: {
        type: Boolean,
        default: false
      }
    },
    computed: mapState([
      'roomState',
      'isDeveloperMode',
      'activeStructures',
      'activeRoads',
      'myPlayer'
    ]),
    created() {
      this.hexTileMap = this.roomState.roomType === ROOM_TYPE_BASE_GAME ? baseGameHexTilemap : firstMenHexTilemap;
      this.structureTileMap = this.roomState.roomType === ROOM_TYPE_BASE_GAME ? baseGameStructureTilemap : firstMenStructureTilemap;
      this.roadTileMap = this.roomState.roomType === ROOM_TYPE_BASE_GAME ? baseGameRoadTilemap : firstMenRoadTilemap;

      this.hexTileTypes = hexTileTypes;
      this.structureTileTypes = structureTileTypes;
      this.roadTileTypes = roadTileTypes;

      this.ROAD = ROAD;
      this.SETTLEMENT = SETTLEMENT;
      this.CITY = CITY;

      this.HERO_CARD_Ygritte = HERO_CARD_Ygritte;

      this.harborAdjacentToStructure = harborAdjacentToStructure;
      this.absoluteIndex = boardService.absoluteIndex;
    },
    methods: {
      roadIndices: function(row, col) {
        return [
          [row * 2, col * 2],
          [row * 2, col * 2 + 1],
          [row * 2 + 1, col * 2],
          [row * 2 + 1, col * 2 + 1]
        ].filter(([r, c]) => !!this.roadTileMap[r][c]);
      },
      structureIndices: function(row, col) {
        return [
          [row, col * 2],
          [row, col * 2 + 1]
        ].filter(([r, c]) => !!this.structureTileMap[r][c]);
      },
      isRoadAllowed: function(row, col) {
        return isPurchaseAllowedRoad(this.structureTileMap, this.roadTileMap, this.activeStructures, this.activeRoads, this.myPlayer.playerSessionId, row, col, this.roomState.isSetupPhase, this.myPlayer.lastStructureBuilt);
      },
      isSettlementAllowed: function(row, col) {
        return isPurchaseAllowedSettlement(this.structureTileMap, this.roadTileMap, this.activeStructures, this.activeRoads, this.myPlayer.playerSessionId, row, col, this.roomState.isSetupPhase, this.roomState.board, this.roomState.ports);
      },
      isCityAllowed: function(row, col) {
        return this.myPlayer.hasResources.city && !!this.activeStructures[row][col] && this.activeStructures[row][col].type === SETTLEMENT;
      },
      onRobberDropped: function(tileIndex) {
        if (!this.myPlayer.mustMoveRobber) return;
        this.$emit('robber-dropped', tileIndex);
      },
      isDisplayRobberTile: function(row, col) {
        const absoluteTileIndex = boardService.absoluteIndex(this.hexTileMap, row, col);

        const isStaticPosition = !this.myPlayer.mustMoveRobber && this.roomState.robberPosition === absoluteTileIndex;

        const dynamicPosition = this.desiredRobberTile === -1
          ? this.roomState.robberPosition
          : this.desiredRobberTile;
        const isDynamicPosition = this.myPlayer.mustMoveRobber && absoluteTileIndex === dynamicPosition;

         return isStaticPosition || isDynamicPosition;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  // opacity: 0.5;
  
  .board {
    display: flex;
    justify-content: center;
  }

  .tiles {
    display: flex;
    flex-direction: column;
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

    .hex-tile {
      &.robber-camp {
        border: 1px dashed red;
      }
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

  .wildling {
    position: absolute;
    top: 0;
    right: 0;
    color: red;
  }
</style>
