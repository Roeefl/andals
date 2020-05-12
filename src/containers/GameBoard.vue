<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import HexTile from '@/components/tiles/HexTile';
  import RoadTile from '@/components/tiles/RoadTile';
  import StructureTile from '@/components/tiles/StructureTile';
  import RobberTile from '@/components/tiles/RobberTile';
  import HarborTile from '@/components/tiles/HarborTile';
  import Wildling from '@/components/pieces/Wildling';
  import Tree from '@/components/decor/Tree';
  import BaseOverlay from '@/components/common/BaseOverlay';
  import BaseButton from '@/components/common/BaseButton';
  import GameAsset from '@/components/game/GameAsset';
  import BaseBadge from '@/components/common/BaseBadge';
  import PurchaseConfirm from '@/components/interface/PurchaseConfirm';

  // import { baseGameHexTilemap, firstMenHexTilemap } from '@/tilemaps/hexes';
  // import { baseGameRoadTilemap, firstMenRoadTilemap } from '@/tilemaps/roads';
  // import { baseGameStructureTilemap, firstMenStructureTilemap } from '@/tilemaps/structures';

  import { hexTileTypes, roadTileTypes, structureTileTypes } from '@/utils/tileManifest';

  import boardService from '@/services/board';
  import { isPurchaseAllowedSettlement, isPurchaseAllowedRoad, harborAdjacentToStructure } from '@/utils/board';
  import { ROAD, SETTLEMENT, CITY, MOVE_ROBBER } from '@/specs/purchases';
  import { HERO_CARD_QhorinHalfhand } from '@/specs/heroCards';
  import { isAllowRemoveWildlingFromHextile } from '@/utils/heroes';

  import {
    MESSAGE_PLACE_STRUCTURE,
    MESSAGE_PLACE_ROAD,
    MESSAGE_REMOVE_ROAD,
    MESSAGE_MOVE_ROBBER
  } from '@/constants';

  export default {
    name: 'GameBoard',
    components: {
      HexTile,
      RoadTile,
      StructureTile,
      HarborTile,
      RobberTile,
      Wildling,
      Tree,
      BaseOverlay,
      BaseButton,
      BaseBadge,
      PurchaseConfirm,
      GameAsset,
    },
    computed: {
      ...mapState([
        'roomState',
        'isDeveloperMode',
        'activeStructures',
        'activeRoads',
        'myPlayer',
        'desiredRobberTile',
        'activePurchase'
      ]),
      ...mapGetters([
        'roomType',
        'allowPurchasing'
      ]),
      displayPurchaseModal: function() {
        return this.activePurchase && [SETTLEMENT, ROAD, CITY, MOVE_ROBBER].includes(this.activePurchase.type);
      }
    },
    created() {
      const { hexTilemap, structureTilemap, roadTilemap } = colyseusService.gameManifests[this.roomType];
      this.hexTilemap = hexTilemap;
      this.structureTilemap = structureTilemap;
      this.roadTilemap = roadTilemap

      // ----

      this.hexTileTypes = hexTileTypes;
      this.structureTileTypes = structureTileTypes;
      this.roadTileTypes = roadTileTypes;

      this.ROAD = ROAD;
      this.SETTLEMENT = SETTLEMENT;
      this.CITY = CITY;

      this.HERO_CARD_QhorinHalfhand = HERO_CARD_QhorinHalfhand;

      this.harborAdjacentToStructure = harborAdjacentToStructure;
      this.absoluteIndex = boardService.absoluteIndex;
    },
    mounted() {
      // give it 1 more sec to render
      setTimeout(() => this.setGameLoading(false), 2000);
    },
    methods: {
      ...mapMutations([
        'setGameLoading',
        'setActivePurchase',
        'setDesiredRobberTile'
      ]),
      ...mapActions([
        'finishTurn'
      ]),
      roadIndices: function(row, col) {
        return [
          [row * 2, col * 2],
          [row * 2, col * 2 + 1],
          [row * 2 + 1, col * 2],
          [row * 2 + 1, col * 2 + 1]
        ].filter(([r, c]) => !!this.roadTilemap[r][c]);
      },
      structureIndices: function(row, col) {
        return [
          [row, col * 2],
          [row, col * 2 + 1]
        ].filter(([r, c]) => !!this.structureTilemap[r][c]);
      },
      isRoadAllowed: function(row, col) {
        return isPurchaseAllowedRoad(this.structureTilemap, this.roadTilemap, this.activeStructures, this.activeRoads, this.myPlayer.playerSessionId, row, col, this.roomState.isSetupPhase, this.myPlayer.lastStructureBuilt);
      },
      isSettlementAllowed: function(row, col) {
        return isPurchaseAllowedSettlement(this.structureTilemap, this.roadTilemap, this.activeStructures, this.activeRoads, this.myPlayer.playerSessionId, row, col, this.roomState.isSetupPhase, this.roomState.board, this.roomState.ports);
      },
      isCityAllowed: function(row, col) {
        return this.myPlayer.hasResources.city && !!this.activeStructures[row][col] && this.activeStructures[row][col].type === SETTLEMENT && this.activeStructures[row][col].ownerId === this.myPlayer.playerSessionId;
      },
      onMoveRobber: function(tileIndex) {
        if (!this.myPlayer.mustMoveRobber) return;
        
        this.setDesiredRobberTile(tileIndex);
        this.setActivePurchase({ type: MOVE_ROBBER });
      },
      isDisplayRobberTile: function(row, col) {
        const absoluteTileIndex = boardService.absoluteIndex(this.hexTilemap, row, col);

        const isStaticPosition = !this.myPlayer.mustMoveRobber && this.roomState.robberPosition === absoluteTileIndex;

        const dynamicPosition = this.desiredRobberTile === -1
          ? this.roomState.robberPosition
          : this.desiredRobberTile;
        const isDynamicPosition = this.myPlayer.mustMoveRobber && absoluteTileIndex === dynamicPosition;

         return isStaticPosition || isDynamicPosition;
      },
      onConfirmPurchase: async function(purchase) {
        const { type, row, col, isRemove = false } = this.activePurchase;

        if (type === MOVE_ROBBER) {
          this.onConfirmRobber();
          return;
        }

        if (isRemove) {
          await colyseusService.room.send({
            type: MESSAGE_REMOVE_ROAD,
            row,
            col
          });

          return;
        }
        
        await colyseusService.room.send({
          type: type === ROAD ? MESSAGE_PLACE_ROAD : MESSAGE_PLACE_STRUCTURE,
          structureType: type === ROAD ? null : type,
          row,
          col
        });

        if (type === ROAD && this.roomState.isSetupPhase)
          this.finishTurn();

        this.setActivePurchase(null);
      },
      onConfirmRobber: async function() {
        if (!this.myPlayer.mustMoveRobber) return;

        await colyseusService.room.send({
          type: MESSAGE_MOVE_ROBBER,
          tile: this.desiredRobberTile
        });

        this.setActivePurchase(null);
      },
      onWildlingClick: function(tileIndex) {
        if (isAllowRemoveWildlingFromHextile(myPlayer))
          this.$emit('remove-wildling', tileIndex);
      }
    }
  }
</script>

<template>
  <div v-if="roomState.board" key="has-board" class="board" :class="{ 'game-over': roomState.isVictory }">
    <div class="trees">
      <Tree v-for="(tree, t) in Array(6).fill(0)" :key="t" rightColor="green" class="tree" />
    </div>
    <div class="tiles">
      <div v-for="(tileRow, rowIndex) in hexTilemap" :key="`row-${rowIndex}`" class="tile-row" :class="{ 'even': rowIndex % 2 === 0 , 'odd': rowIndex % 2 === 1 }">
        <HexTile
          v-for="(tile, colIndex) in tileRow"
          :key="`tile-${rowIndex}-${colIndex}`"
          :type="hexTileTypes[tile]"
          :tile="roomState.board[absoluteIndex(hexTilemap, rowIndex, colIndex)]"
          class="hex-tile"
          :class="{ 'robber-camp': rowIndex === 0 && colIndex === 0 }"
        >
          <span v-if="isDeveloperMode" class="tile-index">
            [{{ rowIndex }}, {{ colIndex }}]
          </span>
          <RoadTile
            v-for="([row, col]) in roadIndices(rowIndex, colIndex)"
            :key="`road-tile-${row}-${col}`"
            :placement="roadTileTypes[roadTilemap[row][col]]"
            :enabled="allowPurchasing && (myPlayer.hasResources.road || myPlayer.allowFreeRoads > 0) && isRoadAllowed(row, col) && !activeRoads[row][col].ownerId"
            :removeable="myPlayer.allowRemoveRoad"
            @clicked="setActivePurchase({ type: ROAD, row, col })"
            @remove="setActivePurchase({ type: ROAD, row, col, isRemove: true })"
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
            :placement="structureTileTypes[structureTilemap[row][col]]" 
            :enabled="(allowPurchasing && myPlayer.hasResources.settlement && isSettlementAllowed(row, col)) || (allowPurchasing && myPlayer.hasResources.city && isCityAllowed(row, col))"
            @clicked="setActivePurchase({ type: (activeStructures[row][col].type === SETTLEMENT ? CITY : SETTLEMENT), row, col })"
            :activeData="activeStructures[row][col] || {}"
            :harbor="harborAdjacentToStructure(structureTilemap, roomState.board, row, col, roomState.ports)"
            :myColor="myPlayer.color"
          >
            <span v-if="isDeveloperMode" class="structure-index">
              [{{ row }}, {{ col }}]
            </span>
          </StructureTile>
          <HarborTile :tile="roomState.board[absoluteIndex(hexTilemap, rowIndex, colIndex)]" />
          <RobberTile
            v-if="isDisplayRobberTile(rowIndex, colIndex)"
            :active="myPlayer.mustMoveRobber"
          />
          <Wildling
            v-if="!!(roomState.board[absoluteIndex(hexTilemap, rowIndex, colIndex)] || {}).occupiedBy"
            :type="(roomState.board[absoluteIndex(hexTilemap, rowIndex, colIndex)] || {}).occupiedBy.type"
            :size="40"
            @clicked="onWildlingClick(absoluteIndex(hexTilemap, rowIndex, colIndex))"
            class="wildling"
          />
          <BaseOverlay
            v-if="myPlayer.mustMoveRobber && (myPlayer.heroPrivilege !== HERO_CARD_QhorinHalfhand || (rowIndex === 0 && colIndex === 0)) && (myPlayer.heroPrivilege === HERO_CARD_QhorinHalfhand || !!(roomState.board[absoluteIndex(hexTilemap, rowIndex, colIndex)].value))"
            isOpen
            :isFullScreen="false"
            :opacity="0"
            class="move-robber-overlay"
          >
            <BaseButton
              icon
              @click="onMoveRobber(absoluteIndex(hexTilemap, rowIndex, colIndex))"
              class="move-robber"
            >
              <GameAsset type="pieces" asset="robber" width="60px" height="60px" />
            </BaseButton>
          </BaseOverlay>
        </HexTile>
      </div>
    </div>
    <div class="trees">
      <Tree v-for="(tree, t) in Array(6).fill(0)" :key="t" rightColor="green" class="tree" />
    </div>
    <BaseBadge class="confirm-purchase" :class="{ 'hidden': !displayPurchaseModal }">
      <PurchaseConfirm
        v-if="displayPurchaseModal"
        :key="`${activePurchase.type}-${activePurchase.row}-${activePurchase.col}`"
        :type="activePurchase.type"
        :header="`${activePurchase.isRemove ? 'Remove' : ''} ${activePurchase.type}`"
        :removing="activePurchase.isRemove"
        :isFree="roomState.isSetupPhase"
        :myPlayer="myPlayer"
        :isFlexible="myPlayer.flexiblePurchase === activePurchase.type"
        @no="setActivePurchase(null)"
        @yes="onConfirmPurchase($event)"
      />
    </BaseBadge>
  </div>
  <div v-else key="no-board">
    No board to display
  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .move-robber-overlay {
    opacity: 0;
  }

  .board {
    position: relative;
    display: grid;
    grid-template-columns: 10% 80% 10%;

    .game-over {
      opacity: 0.5;
    }

    .trees {
      display: flex;
      flex-direction: column;
      padding-left: $spacer;

      .tree {
        margin-top: $spacer * 5;
      }
    }

    .tiles {
      padding-top: $spacer * 1.5;
      display: flex;
      flex-direction: column;
      align-items: center;
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
          border: 0;
          border: 1px dashed red;
        }

        &:hover {
          .move-robber-overlay {
            opacity: 1;
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
        
        .wildling {
          position: absolute;
          top: 0;
          right: 0;
          z-index: $zindex-robber + 1;
          background: $primary;
        }
      }
    }
  }

  .move-robber {
    width: $tile-size * 1.6;
    height: $tile-size * 1.6;
    transform: rotate(90deg);
  }

  .confirm-purchase {
    position: absolute;
    top: $spacer * 2;
    right: $spacer * 5;
    width: 200px;
    z-index: $zindex-interface + 20;
    transition: opacity 200ms ease-in-out;

    &.hidden {
      opacity: 0;
    }
  }

  // .move-robber {
  //   -webkit-animation: wobble-hor-bottom 4s cubic-bezier(0.470, 0.000, 0.745, 0.715) infinite both;
  //   animation: wobble-hor-bottom 4s cubic-bezier(0.470, 0.000, 0.745, 0.715) infinite both;
  // }
</style>
