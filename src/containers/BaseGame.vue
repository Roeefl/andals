<template>
  <div class="base-game">
    <DraggableWidget class="control-panel">
      <ControlPanel
        :isMyTurn="isMyTurn"
        @toggle-ready="toggleReady"
        @purchase-game-card="onGameCardPurchase"
        @bank-trade="onTradeWithBank($event)"
      />
    </DraggableWidget>
    <div class="board-container">
      <DraggableWidget class="players-list">
        <PlayersList
          :isMyTurn="isMyTurn"
          :isGameReady="roomState.isGameReady"
          :isGameStarted="roomState.isGameStarted"
          :currentTurn="roomState.currentTurn"
          :waitingTradeWith="waitingTradeWith"
          @trade-with="requestTradeWith($event)"
          @steal-from="stealFrom($event)"
          @play-hero="onPlayHeroCard($event)"
          @play-card="onPlayGameCard($event)"
          @toggle-ready="toggleReady"
        />
      </DraggableWidget>
      <div class="board-area">
        <TheNorth
          v-if="isWithNorth"
          :allowPurchase="allowPurchase"
          @wall-clicked="onGuardClick($event)"
          @kill-guard="onGuardClick($event, true)"
          class="the-north"
        />
        <GameBoard
          :allowPurchase="allowPurchase"
          @tile-clicked="onTileClick($event)"
          @remove-road="onRemoveRoad($event)"
          @robber-moved="$store.commit('setDesiredRobberTile', $event)"
          @remove-wildling="onRemoveWildling($event)"
          class="game-board"
          :class="{ 'with-north': isWithNorth }"
        />
      </div>
      <aside class="sidebar" :class="{ 'compact': isWithNorth }">
        <DraggableWidget v-if="isWithNorth" :level="0" class="breach-marker">
          <BreachMarker :wallBreaches="roomState.wallBreaches" />
        </DraggableWidget>
        <DraggableWidget class="game-log">
          <GameLog :friendly="roomState.friendlyGameLog" />
        </DraggableWidget>
        <v-divider dark />
        <DraggableWidget class="game-chat-widget">
          <GameChat :messages="chatMessages" :myPlayerSessionId="myPlayer.playerSessionId || 'NO_SESSION_ID'" />
        </DraggableWidget>
      </aside>
    </div>
    <DraggableWidget class="game-status">
      <GameStatus />
    </DraggableWidget>
    <ConfirmMove
      :type="activePurchase.type"
      :removing="activePurchase.isRemove"
      :header="activePurchase.isRemove ? 'Remove' : undefined"
      :isOpen="isDisplayConfirmMove"
      :isFree="roomState.isSetupPhase"
      :myPlayer="myPlayer"
      :isFlexible="myPlayer.flexiblePurchase === activePurchase.type"
      :selectionCount="myPlayer.isVisiblePurchaseGameCard ? 3 : 0"
      :gameCards="roomState.gameCards"
      @no="isDisplayConfirmMove = false"
      @yes="onConfirmMove($event)"
    />
    <MyDeck />
    <ConfirmTrade
      :isOpen="!!myPlayer.pendingTrade"
      :withWho="tradingWith"
      @no="respondToIncomingTrade(false)"
      @yes="respondToIncomingTrade(true)"
    />
    <TradeDialog
      :isOpen="!!myPlayer.tradingWith"
      :players="[myPlayer, players.find(({ playerSessionId }) => playerSessionId === myPlayer.tradingWith)]"
      @add-card="addTradeCard($event)"
      @remove-card="removeTradeCard($event)"
      @refuse="refuseTrade"
      @confirm-trade="confirmTrade"
    >
      <GameChat :messages="chatMessages" :myPlayerSessionId="myPlayer.playerSessionId || 'NO_SESSION_ID'" />
    </TradeDialog>
    <TradeDialog
      :isOpen="!!bankTradeResource"
      withBank
      :players="bankTradePlayers"
      @add-card="addTradeCard($event)"
      @remove-card="removeTradeCard($event)"
      @refuse="cancelBankTrade"
      @confirm-trade="requestBankTrade"
      cancelText="Cancel"
    />
    <OpponentDeck
      :isOpen="!!stealingFrom.playerSessionId"
      :opponent="stealingFrom"
      :hideResources="!myPlayer.isVisibleSteal"
      :giveBack="myPlayer.heroPrivilege === HERO_CARD_JeorMormont"
      :myDeck="myPlayer.resourceCounts"
      @steal="selectStealCard($event)"
      @cancel="stealingFrom = {}"
    />
    <SelectResource
      :isOpen="myPlayer.isDeclaringMonopoly"
      @resource-selected="onMonopolySelected($event)"
    />
    <RollingDice v-if="isRollingDice" :type="roomState.roomType" @finished="sendDice($event)" />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import router from '@/router';
  import colyseusService, { ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';

  import ControlPanel from '@/containers/ControlPanel';
  import GameStatus from '@/containers/GameStatus';
  import GameBoard from '@/containers/GameBoard';
  import TheNorth from '@/containers/TheNorth';
  import GameChat from '@/containers/GameChat';
  import GameLog from '@/containers/GameLog';
  import PlayersList from '@/containers/PlayersList';

  import BreachMarker from '@/components/north/BreachMarker';

  import MyDeck from '@/components/interface/MyDeck';
  import TradeDialog from '@/components/interface/TradeDialog';
  import ConfirmMove from '@/components/interface/ConfirmMove';
  import ConfirmTrade from '@/components/interface/ConfirmTrade';
  import OpponentDeck from '@/components/interface/OpponentDeck';
  import SelectResource from '@/components/interface/SelectResource';
  import RollingDice from '@/components/interface/RollingDice';

  import DraggableWidget from '@/components/common/DraggableWidget';

  import { initialResourceCounts } from '@/specs/resources';
  import { ROAD, GUARD, GAME_CARD } from '@/specs/purchases';
  import { HERO_CARD_JeorMormont, HERO_CARD_TywinLannister } from '@/specs/heroCards';
  import { LUMBER, BRICK, SHEEP, WHEAT, ORE } from '@/utils/tileManifest';
  import { gamePhases } from '@/specs/gamePhases';

  import {
    MESSAGE_CHAT,
    MESSAGE_GAME_LOG,
    MESSAGE_TURN_ORDER,
    MESSAGE_READY,
    MESSAGE_ROLL_DICE,
    MESSAGE_COLLECT_ALL_LOOT,
    MESSAGE_COLLECT_RESOURCE_LOOT,
    MESSAGE_FINISH_TURN,
    MESSAGE_PLACE_STRUCTURE,
    MESSAGE_PLACE_ROAD,
    MESSAGE_REMOVE_ROAD,
    MESSAGE_PLACE_GUARD,
    MESSAGE_REMOVE_GUARD,
    MESSAGE_PURCHASE_GAME_CARD,
    MESSAGE_PLAY_GAME_CARD,
    MESSAGE_DISCARD_HALF_DECK,
    MESSAGE_STEAL_CARD,
    MESSAGE_GAME_VICTORY,
    MESSAGE_SELECT_MONOPOLY_RESOURCE,
    MESSAGE_WILDLINGS_REMOVE_FROM_TILE,
    MESSAGE_TRADE_WITH_BANK,
    MESSAGE_TRADE_REQUEST,
    MESSAGE_TRADE_START_AGREED,
    MESSAGE_TRADE_ADD_CARD,
    MESSAGE_TRADE_REMOVE_CARD,
    MESSAGE_TRADE_CONFIRM,
    MESSAGE_TRADE_REFUSE,
    CHAT_LOG_SIMPLE,
    CHAT_LOG_DICE,
    CHAT_LOG_LOOT,
    CHAT_LOG_DISCARD,
    CHAT_LOG_GAME_CARD,
    MESSAGE_PLAY_HERO_CARD
  } from '@/constants';

  export default {
    name: 'BaseGame',
    components: {
      DraggableWidget,
      ControlPanel,
      GameStatus,
      GameBoard,
      TheNorth,
      GameChat,
      GameLog,
      PlayersList,
      ConfirmTrade,
      ConfirmMove,
      MyDeck,
      TradeDialog,
      OpponentDeck,
      RollingDice,
      SelectResource,
      BreachMarker
    },
    data: () => ({
      chatMessages: [],
      isDisplayConfirmMove: false,
      activePurchase: {
        type: ROAD
      },
      waitingTradeWith: null,
      bankTradeResource: null,
      bankDummy: {
        nickname: 'Bank',
        playerSessionId: '-bank-',
        resourceCounts: {},
        tradeCounts: {},
        isTradeConfirmed: false
      },
      stealingFrom: {}
    }),
    beforeCreate() {
      this.HERO_CARD_JeorMormont = HERO_CARD_JeorMormont;
    },
    async created() {
      if (!this.room) {
        await this.reconnect();
        return;
      }

      this.initializeRoom();
    },
    destroyed() {
      this.$store.commit('destroyRoomState');
    },
    computed: {
      room: () => colyseusService.room,
      isWithNorth: function() {
        return this.room && this.room.name === ROOM_TYPE_FIRST_MEN;
      },
      myPlayerIndex: function() {
        return this.players
          .findIndex(p => p.playerSessionId === this.room.sessionId);
      },
      isMyTurn: function() {
        return this.roomState.currentTurn === this.myPlayerIndex
      },
      tradingWith: function() {
        return this.myPlayer.pendingTrade
          ? (this.players.find(({ playerSessionId }) => playerSessionId === this.myPlayer.pendingTrade) || {}).nickname
          : 'NONE';
      },
      allowPurchase: function() {
        return (
          this.isMyTurn &&
          (this.roomState.isSetupPhase || this.roomState.isDiceRolled) &&
          !this.myPlayer.mustMoveRobber
        );
      },
      bankTradePlayers: function() {
        return [
          this.myPlayer,
          this.bankDummy
        ];
      },
      ...mapState([
        'myPlayer',
        'roomState',
        'players',
        'isRollingDice',
        'desiredRobberTile',
        'gameWinner'
      ])
    },
    methods: {
      initializeRoom: function(room = this.room) {
        // Define a series of room lifecycle methods
        room.onStateChange.once(this.initializeState);
        room.onStateChange(this.updateState);
        room.onMessage(this.onBroadcastReceived);
        room.onError(this.onRoomError);
        room.onLeave(this.onRoomLeave);
      },
      reconnect: async function() {
        try {
          const room = await colyseusService.reconnect(this.$route.params.roomId);
          console.log("room", room)

          if (!room) {
            this.$store.commit('addAlert', 'Unable to reconnect. Sorry.');
            router.push('/lobby');
            return;
          }
          
          colyseusService.setRoom(room);
          this.initializeRoom(room);
        } catch (err) {
          console.error('reconnect failed:', err);
          this.$store.commit('addAlert', 'Unable to reconnect. Sorry.');
          router.push('/lobby');
        }
      },
      initializeState: function(initialRoomState) {
        this.$store.commit('updateRoomState', initialRoomState);
      },
      updateState: function(updatedRoomState) {
        console.log('BasesGame -> updateState -> updatedRoomState | ', updatedRoomState);
        this.$store.commit('updateRoomState', updatedRoomState);
        
        if (this.bankTradeResource)
          this.evaluateBankTrade();
      },
      onEssentialBroadcast: function(header, data) {
        this.$store.commit('setEssentialOverlay', {
          ...data,
          header
        });
      },
      onBroadcastReceived: function(broadcast) {
        const {
          type,
          isEssential = false,
          sender,
          senderSessionId,
          message,
          playerName
        } = broadcast;

        let essentialHeader = '';
        let essentialData = {};
        
        switch (type) {
          case MESSAGE_CHAT:
            this.chatMessages = [
              ...this.chatMessages,
              broadcast
            ];
            break;

          case MESSAGE_ROLL_DICE:
            const { dice } = broadcast;
            this.$store.commit('addGameLog', { type: CHAT_LOG_DICE, playerName, dice });
            
            if (isEssential) {
              essentialHeader = `${playerName} rolled a 7`;
              essentialData.isRobber = true;
            };

            if (this.myPlayer.mustDiscardHalfDeck)
              this.$store.commit('openMyDeck');
            break;

          case MESSAGE_COLLECT_ALL_LOOT:
            const { playerSessionId, loot } = broadcast;
            this.$store.commit('addGameLog', { type: CHAT_LOG_LOOT, playerName, loot });
            
            if (isEssential) essentialHeader = `${playerName} collects: ${loot}`;

            if (playerSessionId === this.myPlayer.playerSessionId) {
              Object
                .entries(loot)
                .filter(([resource, count]) => count > 0)
                .forEach(([resource, count]) => this.$store.commit('addRecentLoot', { resource, count }));
            }
            break;
          
          case MESSAGE_COLLECT_RESOURCE_LOOT:
            const { resource } = broadcast;

            const lootCounts = {
              [resource]: 1
            };
            this.$store.commit('addGameLog', { type: CHAT_LOG_LOOT, playerName, lootCounts });

            if (broadcast.playerSessionId === this.myPlayer.playerSessionId)
              this.$store.commit('addRecentLoot', { resource, count });
            
            break;

          case MESSAGE_DISCARD_HALF_DECK:
            const { discardedCounts } = broadcast;
            this.$store.commit('addGameLog', { type: CHAT_LOG_DISCARD, playerName, loot: discardedCounts });
            if (isEssential) essentialHeader = `${playerName} discards: ${discardedCounts}`;
            break;

          case MESSAGE_GAME_LOG:
            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message });

            if (isEssential)
              essentialHeader = message;

            gamePhases.forEach(flag => {
              if (broadcast[flag])
                essentialData[flag] = true;
            });
            break;

          case MESSAGE_TURN_ORDER:
            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message });

            // if (this.roomState.isGameStarted && this.isMyTurn)
            //   this.$store.commit('openMyDeck');
            break;

          case MESSAGE_GAME_VICTORY:
            this.$store.commit('addGameLog', { type: CHAT_LOG_SIMPLE, message: `${playerName} has won the game!!!` });
            this.$store.commit('victory', playerName);
            this.onEssentialBroadcast(`VICTORY! ${playerName} has won the game!`);
            break;

          case MESSAGE_PLAY_GAME_CARD:
            const { cardType } = broadcast;
            header = `${playerName} has played ${cardType}`;

            this.$store.commit('addGameLog', { type: CHAT_LOG_GAME_CARD, playerName, cardType });
            this.$store.commit('setEssentialOverlay', { header, cardType });
            break;
            
          default:
            break;
        }

        if (isEssential) this.onEssentialBroadcast(essentialHeader, essentialData);
      },
      onRoomError: function(error) {
        console.error(`Room ${this.room.sessionId} encountered error: ${error.message}`);
      },
      onRoomleave: function() {
        console.info(`${colyseusService.client.id} has left ${this.room.id}`);
      },
      toggleReady: function() {
        this.$store.commit('toggleSelfReady');
        
        this.room.send({
          type: MESSAGE_READY,
          message: true
        });
      },
      sendDice: function(dice) {
        this.room.send({
          type: MESSAGE_ROLL_DICE,
          dice
        });

        if (this.roomState.isTurnOrderPhase)
          this.finishTurn();
      },
      onGameCardPurchase: function() {
        this.activePurchase = {
          type: GAME_CARD
        };

        this.isDisplayConfirmMove = true;
      },
      onTileClick: function(tile) {
        this.activePurchase = tile;
        this.isDisplayConfirmMove = true;
      },
      onRemoveRoad: function(roadTile) {
        this.activePurchase = roadTile;
        this.activePurchase.isRemove = true;

        this.isDisplayConfirmMove = true;
      },
      onGuardClick: function(location, isRemove = false) {
      console.log("isRemove", isRemove)
      console.log("location", location)
        const { section, position } = location;
        
        this.activePurchase = {
          type: GUARD,
          section,
          position,
          isRemove
        };

        this.isDisplayConfirmMove = true;
      },
      onConfirmMove: function(additionalData) {
        this.isDisplayConfirmMove = false;

        const { type, row, col, isRemove = false } = this.activePurchase;

        if (type === GUARD) {
          const { section, position } = this.activePurchase;

          if (isRemove) {
            this.room.send({
              type: MESSAGE_REMOVE_GUARD,
              section,
              position
            });

            return;
          }

          this.room.send({
            type: MESSAGE_PLACE_GUARD,
            section,
            position,
            ...additionalData
          });

          if (this.roomState.isSetupPhase)
            this.finishTurn();

          return;
        };

        if (type === GAME_CARD) {
          this.room.send({
            type: MESSAGE_PURCHASE_GAME_CARD,
            selectedCardIndex: additionalData.index
          });

          this.$store.commit('setJustPurchasedGameCard', true);
          return;
        }

        if (isRemove) {
          this.room.send({
            type: MESSAGE_REMOVE_ROAD,
            row,
            col
          });

          return;
        }
        
        this.room.send({
          type: type === ROAD ? MESSAGE_PLACE_ROAD : MESSAGE_PLACE_STRUCTURE,
          structureType: type === ROAD ? null : type,
          row,
          col
        });

        if (type === ROAD && this.roomState.isSetupPhase)
          this.finishTurn();
      },
      finishTurn: function() {
        this.room.send({
          type: MESSAGE_FINISH_TURN
        });

        this.$store.commit('setJustPurchasedGameCard', false);
      },
      requestTradeWith: function(withWho) {
        if (!this.roomState.isGameStarted) return;

        this.room.send({
          type: MESSAGE_TRADE_REQUEST,
          withWho
        });

        this.waitingTradeWith = withWho;
      },
      resetBankDummy: function() {
        this.bankTradeResource = null;
        
        this.bankDummy = {
          ...this.bankDummy,
          tradeCounts: {},
          isTradeConfirmed: false
        };
      },
      cancelBankTrade: function() {
        this.resetBankDummy();
        this.refuseTrade();

        this.room.send({
          type: MESSAGE_TRADE_REFUSE
        });
      },
      onTradeWithBank: function(resource) {
        if (!this.roomState.isGameStarted) return;
        
        this.bankTradeResource = resource;

        const updateBankDummyTradeCounts = {
          ...this.bankDummy.tradeCounts,
          [resource]: 1
        };
        
        this.bankDummy = {
          ...this.bankDummy,
          tradeCounts: updateBankDummyTradeCounts
        };
      },
      evaluateBankTrade: function() {
        this.bankDummy.isTradeConfirmed = false;

        const tradeCounts = Object.entries(this.myPlayer.tradeCounts);
        console.log("tradeCounts", tradeCounts, this.myPlayer.heroPrivilege);

        const acceptableResourceIndex = tradeCounts.findIndex(([resource, count]) => (
          (this.myPlayer.heroPrivilege === HERO_CARD_TywinLannister && this.bankTradeResource === SHEEP && count === 1) ||
          (this.myPlayer.ownedHarbors[resource] && count === 2) ||
          count === this.myPlayer.bankTradeRate
        ));

        if (acceptableResourceIndex < 0) return;

        const isTradeValid = tradeCounts
          .filter((x, index) => index !== acceptableResourceIndex)
          .every(([resource, count]) => count === 0)

        console.log("isTradeValid", isTradeValid);
        if (isTradeValid) this.bankDummy.isTradeConfirmed = true;
      },
      requestBankTrade: function() {
        if (!this.bankDummy.isTradeConfirmed) return;
        
        this.room.send({
          type: MESSAGE_TRADE_WITH_BANK,
          requestedResource: this.bankTradeResource
        });

        this.resetBankDummy();
      },
      respondToIncomingTrade: function(isAgreed) {
        this.room.send({
          type: MESSAGE_TRADE_START_AGREED,
          isAgreed
        });
      },
      addTradeCard: function(card) {
        const { resource } = card;
        
        this.room.send({
          type: MESSAGE_TRADE_ADD_CARD,
          resource
        });
      },
      removeTradeCard: function(resource) {
        this.room.send({
          type: MESSAGE_TRADE_REMOVE_CARD,
          resource
        });
      },
      refuseTrade: function() {
        this.room.send({
          type: MESSAGE_TRADE_REFUSE
        });
      },
      confirmTrade: function() {
        this.room.send({
          type: MESSAGE_TRADE_CONFIRM
        });
      },
      stealFrom: function(playerSessionId) {
        this.stealingFrom = this.players.find(p => p.playerSessionId === playerSessionId);
      },
      selectStealCard: function(cards) {
        const { selectedCard, selectedGiveCard } = cards;

        const { resource } = selectedCard;

        this.room.send({
          type: MESSAGE_STEAL_CARD,
          stealFrom: this.stealingFrom.playerSessionId,
          resource,
          giveBack: (selectedGiveCard || {}).resource
        });

        this.stealingFrom = {};
      },
      onMonopolySelected: function(selectedResource) {
        this.room.send({
          type: MESSAGE_SELECT_MONOPOLY_RESOURCE,
          selectedResource
        });
      },
      onRemoveWildling: function(tileIndex) {
        this.room.send({
          type: MESSAGE_WILDLINGS_REMOVE_FROM_TILE,
          tileIndex
        });
      },
      onPlayHeroCard: function(isDiscard = false) {
        this.room.send({
          type: MESSAGE_PLAY_HERO_CARD,
          heroType: this.myPlayer.currentHeroCard.type,
          isDiscard
        });
      },
      onPlayGameCard: function(gameCard) {
        colyseusService.room.send({
          type: MESSAGE_PLAY_GAME_CARD,
          cardType: gameCard.type,
          cardIndex: gameCard.index
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $board-height: 67vh;

  .base-game {
    padding: 0 $spacer;
    flex: 1;
    display: flex;
    flex-direction: column;

    .control-panel {
      height: 70px;
      margin-bottom: $spacer / 2;
      justify-content: flex-start;
    }

    .board-container {
      @include board-layout();

      & > * {
        margin: 0 $spacer / 2;
      }

      .board-area {
        display: flex;
        flex-direction: column;
        background: white;

        .the-north {
          height: $board-height * 0.5;
        }

        .game-board {
          @include dashed-around();
          background-image: url('../assets/ocean.jpg');
          background-size: cover;
          height: $board-height;

          &.with-north {
            // justify-content: center;
            height: $board-height * 0.8;
            background-image: unset;
            background-size: unset;
            background-repeat: repeat;
            background: $primary;
            color: $secondary;
          }
        }
      }

      .sidebar {
        display: flex;
        flex-direction: column;

        & > * {
          flex: 1;

          &:last-of-type {
            margin-top: $spacer;
          }
        }

        .game-log {
          max-height: $board-height / 2;
          overflow-y: auto;
        }

        .game-chat-widget {
          position: relative;
          max-height: $board-height / 2;
          overflow-y: auto;
        }

        &.compact {
          .game-log,
          .game-chat-widget {
            max-height: $board-height * 0.4;
          }
        }
      }
    }

    .game-status {
      height: 70px;
    }
  }
</style>
