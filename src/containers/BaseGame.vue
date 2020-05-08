<template>
  <div class="base-game">
    <BaseWidget class="control-panel">
      <ControlPanel
        @toggle-ready="toggleReady"
        @bank-trade="onTradeWithBank($event)"
      />
    </BaseWidget>
    <div class="board-container">
      <BaseWidget class="players-list">
        <PlayersList
          :currentRound="roomState.currentRound"
          :isGameReady="roomState.isGameReady"
          :currentTurn="roomState.currentTurn"
          :waitingTradeWith="waitingTradeWith"
          @trade-with="requestTradeWith($event)"
          @steal-from="stealFrom($event)"
          @play-hero="onPlayHeroCard($event)"
          @play-card="onPlayGameCard($event)"
          @toggle-ready="toggleReady"
        />
      </BaseWidget>
      <div class="board-area">
        <TheNorth
          v-if="isWithNorth"
          class="the-north"
        />
        <GameBoard
          @remove-wildling="onRemoveWildling($event)"
          class="game-board"
          :class="{ 'with-north': isWithNorth }"
        />
      </div>
      <aside class="sidebar" :class="{ 'compact': isWithNorth }">
        <BaseWidget v-if="isWithNorth" :level="0" class="breach-marker">
          <BreachMarker :wallBreaches="roomState.wallBreaches" />
        </BaseWidget>
        <BaseWidget class="game-log">
          <GameLog :friendly="roomState.friendlyGameLog" />
        </BaseWidget>
        <v-divider dark class="divider" />
        <BaseWidget class="game-chat-widget">
          <GameChat :messages="chatMessages" @send-message="sendChatMessage($event)" />
        </BaseWidget>
      </aside>
    </div>
    <MyDeck @play-game-card="onPlayGameCard($event)" />
    <TradeConfirm
      :isOpen="!!myPlayer.pendingTrade"
      :withWho="tradingWith"
      @no="respondToIncomingTrade(false)"
      @yes="respondToIncomingTrade(true)"
    />
    <TradeConfirm
      :isOpen="!!tradeRequested.senderSessionId"
      :withWho="tradeRequested.sender"
      title="Trade Requested"
      :requestedResource="tradeRequested.requestedResource"
      @no="tradeRequested = {}"
      @yes="acceptResourceTradeRequest"
    />
    <TradeDialog
      :isOpen="!!myPlayer.tradingWith"
      :players="[myPlayer, players.find(({ playerSessionId }) => playerSessionId === myPlayer.tradingWith)]"
      @declare-resource="onDeclareRequestedResource($event)"
      @add-card="addTradeCard($event)"
      @remove-card="removeTradeCard($event)"
      @refuse="refuseTrade"
      @agree-trade="agreeToTrade"
      @confirm-trade="onTradeConfirm"
    >
      <GameChat :messages="chatMessages" @send-message="sendChatMessage($event)" />
    </TradeDialog>
    <TradeDialog
      :isOpen="!!bankTradeResource"
      withBank
      :players="bankTradePlayers"
      @add-card="addTradeCard($event)"
      @remove-card="removeTradeCard($event)"
      @refuse="cancelBankTrade"
      @agree-trade="agreeToTrade"
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
    <v-dialog width="500" :value="myPlayer.isDeclaringMonopoly">
      <ResourceSelect :title="null" @resource-selected="onMonopolySelected($event)" />
    </v-dialog>
    <RollingDice v-if="isRollingDice" :type="roomState.roomType" @finished="sendDice($event)" />
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import router from '@/router';
  import colyseusService, { ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';

  import ControlPanel from '@/containers/ControlPanel';
  import GameBoard from '@/containers/GameBoard';
  import TheNorth from '@/containers/TheNorth';
  import GameLog from '@/containers/GameLog';
  import PlayersList from '@/containers/PlayersList';
  import BreachMarker from '@/components/north/BreachMarker';
  import GameChat from '@/components/interface/GameChat';
  import MyDeck from '@/components/interface/MyDeck';
  import TradeDialog from '@/components/interface/TradeDialog';
  import TradeConfirm from '@/components/interface/TradeConfirm';
  import OpponentDeck from '@/components/interface/OpponentDeck';
  import ResourceSelect from '@/components/interface/ResourceSelect';
  import RollingDice from '@/components/interface/RollingDice';
  import BaseWidget from '@/components/common/BaseWidget';

  import { sumValues } from '@/utils/objects';
  import { ROAD, GUARD, GAME_CARD } from '@/specs/purchases';
  import { HERO_CARD_JeorMormont, HERO_CARD_TywinLannister } from '@/specs/heroCards';
  import { LUMBER, BRICK, SHEEP, WHEAT, ORE } from '@/utils/tileManifest';
  import { gameNotifications } from '@/specs/gamePhases';

  import {
    MESSAGE_CHAT,
    MESSAGE_GAME_LOG,
    MESSAGE_PLACE_STRUCTURE,
    MESSAGE_TURN_ORDER,
    MESSAGE_READY,
    MESSAGE_ROLL_DICE,
    MESSAGE_COLLECT_ALL_LOOT,
    MESSAGE_COLLECT_RESOURCE_LOOT,
    MESSAGE_PLACE_GUARD,
    MESSAGE_PLAY_GAME_CARD,
    MESSAGE_DISCARD_HALF_DECK,
    MESSAGE_STEAL_CARD,
    MESSAGE_GAME_VICTORY,
    MESSAGE_SELECT_MONOPOLY_RESOURCE,
    MESSAGE_WILDLINGS_REMOVE_FROM_TILE,
    MESSAGE_TRADE_WITH_BANK,
    MESSAGE_TRADE_REQUEST_RESOURCE,
    MESSAGE_TRADE_REQUEST_RESOURCE_AGREE,
    MESSAGE_TRADE_REQUEST,
    MESSAGE_TRADE_START_AGREED,
    MESSAGE_TRADE_ADD_CARD,
    MESSAGE_TRADE_REMOVE_CARD,
    MESSAGE_TRADE_AGREE,
    MESSAGE_TRADE_CONFIRM,
    MESSAGE_TRADE_REFUSE,
    CHAT_LOG_SIMPLE,
    CHAT_LOG_PURCHASE,
    CHAT_LOG_TURN_ORDER,
    CHAT_LOG_DICE,
    CHAT_LOG_LOOT,
    CHAT_LOG_DISCARD,
    CHAT_LOG_GAME_CARD,
    MESSAGE_PLAY_HERO_CARD
  } from '@/constants';

  export default {
    name: 'BaseGame',
    components: {
      BaseWidget,
      ControlPanel,
      GameBoard,
      TheNorth,
      GameChat,
      GameLog,
      PlayersList,
      TradeConfirm,
      MyDeck,
      TradeDialog,
      OpponentDeck,
      RollingDice,
      ResourceSelect,
      BreachMarker
    },
    data: () => ({
      chatMessages: [],
      waitingTradeWith: null,
      tradeRequested: {},
      bankTradeResource: null,
      bankDummy: {
        nickname: 'Bank',
        playerSessionId: '-bank-',
        resourceCounts: {},
        tradeCounts: {},
        isAgreeToTrade: false
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
      tradingWith: function() {
        return this.myPlayer.pendingTrade
          ? (this.players.find(({ playerSessionId }) => playerSessionId === this.myPlayer.pendingTrade) || {}).nickname
          : 'NONE';
      },
      bankTradePlayers: function() {
        return [
          this.myPlayer,
          this.bankDummy
        ];
      },
      ...mapState([
        'roomState',
        'players',
        'myPlayer',
        'isRollingDice',
        'desiredRobberTile',
        'gameWinner'
      ]),
      ...mapGetters([
        'isMyTurn'
      ]),
    },
    methods: {
      ...mapMutations([
        'updateRoomState',
        'addAlert',
        'addGameLog',
        'setAttentions',
        'addRecentLoot',
        'openMyDeck',
        'setRollingDice'
      ]),
      ...mapActions([
        'finishTurn'
      ]),
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
            this.addAlert({ color: 'warning', text: 'Unable to reconnect. Sorry.' });
            router.push('/lobby');
            return;
          }
          
          colyseusService.setRoom(room);
          this.initializeRoom(room);
        } catch (err) {
          console.error('reconnect failed:', err);
          this.addAlert({ color: 'warning', text: 'Unable to reconnect. Sorry.' });
          router.push('/lobby');
        }
      },
      initializeState: function(initialRoomState) {
        this.updateRoomState(initialRoomState);
      },
      updateState: function(updatedRoomState) {
        console.log('BasesGame -> updateState -> updatedRoomState | ', updatedRoomState);
        this.updateRoomState(updatedRoomState);
        
        if (this.bankTradeResource)
          this.evaluateBankTrade();
      },
      onEssentialBroadcast: function(header, data) {
        this.setAttentions({
          ...data,
          header
        });
      },
      onBroadcastReceived: function(broadcast) {
        const {
          type,
          isAttention = false,
          sender,
          senderSessionId,
          message,
          playerName,
          playerColor
        } = broadcast;

        let attentionHeader = null;
        let attentionData = {};
        
        switch (type) {
          case MESSAGE_CHAT:
            this.chatMessages = [
              ...this.chatMessages,
              broadcast
            ];
            break;

          case MESSAGE_ROLL_DICE:
            const { dice } = broadcast;
            this.addGameLog({ type: CHAT_LOG_DICE, playerName, playerColor, dice });
            
            if (isAttention) {
              attentionHeader = `${playerName} rolled a 7`;
              attentionData.isRobber = true;

              if (sumValues(this.myPlayer.resourceCounts) > 7)
                this.openMyDeck();
            } else {
              attentionHeader = 'Dice:';
              attentionData.dice = dice;
            }
            break;

          case MESSAGE_COLLECT_ALL_LOOT:
            const { playerSessionId, loot } = broadcast;
            this.addGameLog({ type: CHAT_LOG_LOOT, playerName, playerColor, loot });

            if (playerSessionId === this.myPlayer.playerSessionId) {
              Object
                .entries(loot)
                .filter(([resource, count]) => count > 0)
                .forEach(([resource, count]) => {
                  Array(count)
                    .fill(resource)
                    .forEach(singleLoot => this.addRecentLoot({ resource, count: 1 }));
                });
            }
            break;
          
          case MESSAGE_COLLECT_RESOURCE_LOOT:
            const { resource } = broadcast;
            this.addGameLog({ type: CHAT_LOG_LOOT, playerName, playerColor, loot: { [resource]: 1 } });

            if (broadcast.playerSessionId === this.myPlayer.playerSessionId)
              this.addRecentLoot({ resource, count: 1 });
            break;

          case MESSAGE_DISCARD_HALF_DECK:
            const { discardedCounts } = broadcast;
            this.addGameLog({ type: CHAT_LOG_DISCARD, playerName, playerColor, loot: discardedCounts });
            break;

          case MESSAGE_GAME_LOG:
            this.addGameLog({ type: CHAT_LOG_SIMPLE, message: broadcast.message, playerColor });

            if (isAttention) attentionHeader = broadcast.message;
            gameNotifications.forEach(flag => {
              if (broadcast.notify === flag) attentionData[flag] = true;
            });
            
            break;

          case MESSAGE_STEAL_CARD:
            const { stoleFrom, stolenResource } = broadcast;

            const stolenCardChatMessage = `${playerName} has stolen a resource card from ${stoleFrom}`;
            this.addGameLog({ type: CHAT_LOG_SIMPLE, playerColor, message: stolenCardChatMessage });
            
            if (broadcast.playerSessionId === this.myPlayer.playerSessionId)
              this.addRecentLoot({ resource: stolenResource, count: 1 });
              
            break;

          case MESSAGE_TRADE_REQUEST_RESOURCE:
            const { requestedResource } = broadcast;

            if (broadcast.senderSessionId !== this.myPlayer.playerSessionId) {
              this.tradeRequested = {
                sender,
                senderSessionId,
                requestedResource
              };
            }

            break;

          case MESSAGE_TURN_ORDER:
            this.addGameLog({ type: CHAT_LOG_TURN_ORDER, playerName, playerColor, message });

            // if (this.roomState.isGameStarted && this.isMyTurn)
            //   this.openMyDeck();
            break;

          case MESSAGE_PLACE_STRUCTURE:
            this.addGameLog({ type: CHAT_LOG_PURCHASE, playerName, playerColor, message });
            break;

          case MESSAGE_PLAY_GAME_CARD:
            const { cardType } = broadcast;
            attentionHeader = `${playerName} has played ${cardType}`;

            this.addGameLog({ type: CHAT_LOG_GAME_CARD, playerName, cardType, playerColor });
            attentionData.gameCardType = cardType;
            break;

          case MESSAGE_GAME_VICTORY:
            this.addGameLog({ type: CHAT_LOG_SIMPLE, message: `${playerName} has won the game!!!` });
            this.$store.commit('victory', playerName);

            attentionHeader = `VICTORY! ${playerName} has won the game!`;
            break;
        }

        if (isAttention && !!attentionHeader)
          this.onEssentialBroadcast(attentionHeader, attentionData);
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
          isAgreeToTrade: false
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
        this.bankDummy.isAgreeToTrade = false;

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
        if (isTradeValid) this.bankDummy.isAgreeToTrade = true;
      },
      requestBankTrade: function() {
        if (!this.bankDummy.isAgreeToTrade) return;
        
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
      acceptResourceTradeRequest: function() {
        this.room.send({
          type: MESSAGE_TRADE_REQUEST_RESOURCE_AGREE,
          offeredResource: this.tradeRequested.requestedResource
        });
      },
      onDeclareRequestedResource: function(resource) {
        this.room.send({
          type: MESSAGE_TRADE_REQUEST_RESOURCE,
          requestedResource: resource
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
      agreeToTrade: function() {
        this.room.send({
          type: MESSAGE_TRADE_AGREE
        });
      },
      onTradeConfirm: function() {
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
        this.room.send({
          type: MESSAGE_PLAY_GAME_CARD,
          cardType: gameCard.type,
          cardIndex: gameCard.index
        });
      },
      sendChatMessage: function({ message }) {
        this.room.send({
          type: MESSAGE_CHAT,
          message
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';
  @import '~vuetify/src/styles/styles.sass';

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

      @include lg-down() {
        grid-template-columns: 15% 85%;
        grid-template-rows: auto;
        grid-template-areas: 
          "sidebar sidebar"
          "players board"
      }

      @include md-down() {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        grid-template-areas: 
          "sidebar"
          "board"
          "players"
      }

      & > * {
        margin: 0 $spacer / 2;
      }

      .board-area {
        display: flex;
        flex-direction: column;
        background: white;

        @include lg-down() {
          grid-area: board;
        }

        .the-north {
          height: $board-height * 0.5;
        }

        .game-board {
          border: 5px solid #6D4C41;
          border-top: none;
          // background-image: url('../assets/ocean.jpg');
          // background-size: cover;
          height: $board-height;

          &.with-north {
            // justify-content: center;
            height: $board-height * 0.87;
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

        @include xl() {
          & > * {
            flex: 2;

            &:last-of-type {
              margin-top: $spacer;
            }
          }
        }

        @include lg-down() {
          grid-area: sidebar;
          display: grid;
          grid-gap: 1%;
          grid-template-columns: 20% 40% 40%;
        }

        .breach-marker {
          flex: 1;
          justify-content: flex-start;
        }

        .game-log {
          max-height: $board-height / 2;
          overflow-y: auto;
          justify-content: flex-start;
        }
        
        .divider {
          @include lg-down() {
            display: none;
          }
        }

        .game-chat-widget {
          position: relative;
          max-height: $board-height / 2;
          overflow-y: auto;
        }

        &.compact {
          .game-log,
          .game-chat-widget {
            max-height: $board-height * 0.5;

            @include lg-down() {
              max-height: unset;
              height: 30vh;
            }
          }
        }
      }

      .players-list {
        @include lg-down() {
          grid-area: players;
        }

        @include md-down() {
          height: 20vh;
        }
      }
    }

    .game-status {
      height: 70px;

      @include lg-down() {
        margin-top: $spacer * 1.5;
      }
    }
  }
</style>
