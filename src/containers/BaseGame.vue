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
  import ResourceSelect from '@/components/interface/ResourceSelect';
  import GameDice from '@/components/interface/GameDice';
  import BaseWidget from '@/components/common/BaseWidget';
  import BaseOverlay from '@/components/common/BaseOverlay';
  import MountainForest from '@/components/decor/MountainForest';
  import River from '@/components/decor/River2';
  import MapLayout from '@/components/decor/MapLayout';

  import { sumValues } from '@/utils/objects';
  import { ROAD, GUARD, GAME_CARD } from '@/specs/purchases';
  import { HERO_CARD_TywinLannister } from '@/specs/heroCards';
  import { LUMBER, BRICK, SHEEP, WHEAT, ORE } from '@/utils/tileManifest';
  import { gameNotifications } from '@/specs/gamePhases';

  import { DEFAULT_ATTENTION_TIMEOUT, ACTIVE_DICE_TIMEOUT } from '@/config';

  import {
    MESSAGE_CHAT,
    MESSAGE_GAME_LOG,
    MESSAGE_PLACE_STRUCTURE,
    MESSAGE_TURN_ORDER,
    MESSAGE_READY,
    MESSAGE_ROLL_DICE,
    MESSAGE_COLLECT_ALL_LOOT,
    MESSAGE_COLLECT_RESOURCE_LOOT,
    MESSAGE_PLAY_GAME_CARD,
    MESSAGE_DISCARD_HALF_DECK,
    MESSAGE_STEAL_CARD,
    MESSAGE_GAME_VICTORY,
    MESSAGE_SELECT_MONOPOLY_RESOURCE,
    MESSAGE_WILDLINGS_REMOVE_FROM_TILE,
    MESSAGE_TRADE_WITH_BANK,
    MESSAGE_TRADE_REQUEST_RESOURCE,
    MESSAGE_TRADE_REQUEST_RESOURCE_RESPOND,
    MESSAGE_TRADE_REQUEST,
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
      MyDeck,
      TradeDialog,
      GameDice,
      ResourceSelect,
      BreachMarker,
      BaseOverlay,
      MountainForest,
      River,
      MapLayout
    },
    data: () => ({
      chatMessages: [],
      waitingTradeWith: null,
      bankTradeResource: null,
      bankDummy: {
        nickname: 'Bank',
        playerSessionId: '-bank-',
        resourceCounts: {},
        tradeCounts: {},
        isAgreeToTrade: false
      }
    }),
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
        'gameWinner',
        'activeDice',
        'awaitingTradeRequest'
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
        'setActiveDice',
        'updateAwaitingTradeRequest',
        'resetAwaitingTradeRequest',
        'setTradeRequested'
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
      onAttention: function(header, data, timeout = DEFAULT_ATTENTION_TIMEOUT) {
        this.setAttentions({
          ...data,
          header,
          timeout
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
              
              const { robberAudio } = this.$refs;
              if (robberAudio) robberAudio.play(); 

              if (sumValues(this.myPlayer.resourceCounts) > 7)
                this.openMyDeck();
            } else {
              if (senderSessionId !== this.myPlayer.playerSessionId) {
                this.setActiveDice({ who: senderSessionId, dice });
                
                const { diceAudio } = this.$refs;
                if (diceAudio) diceAudio.play(); 

                setTimeout(() => this.setActiveDice(null), ACTIVE_DICE_TIMEOUT);
              }
            }
            break;

          case MESSAGE_COLLECT_ALL_LOOT:
            const { loot } = broadcast;
            this.addGameLog({ type: CHAT_LOG_LOOT, playerName, playerColor, loot });

            if (broadcast.playerSessionId === this.myPlayer.playerSessionId) {
              const { lootAudio } = this.$refs;
              if (lootAudio) lootAudio.play(); 

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

            if (broadcast.playerSessionId === this.myPlayer.playerSessionId) {
              this.addRecentLoot({ resource, count: 1 });

              const { lootAudio } = this.$refs;
              if (lootAudio) lootAudio.play(); 
            }
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
              this.setTradeRequested({
                sender,
                senderSessionId,
                requestedResource
              });
            }

            break;

          case MESSAGE_TRADE_REQUEST_RESOURCE_RESPOND:
            const { isTradeStarted, whoRefused } = broadcast;

            if (isTradeStarted) {
              this.resetAwaitingTradeRequest();
            }
            else {
              this.updateAwaitingTradeRequest(whoRefused);

              if (Object.values(this.awaitingTradeRequest).every(value => !value))
                 this.resetAwaitingTradeRequest();
            }
            
            break;

          case MESSAGE_TRADE_CONFIRM:
            const { player1, player2 } = broadcast;
            const tradeCompletedMessage = `${player1} has completed a trade with ${player2}`;

            this.addGameLog({ type: CHAT_LOG_SIMPLE, message: tradeCompletedMessage });
            this.addAlert({ color: 'success', text: tradeCompletedMessage });
            
            break;

          case MESSAGE_TURN_ORDER:
            this.addGameLog({ type: CHAT_LOG_TURN_ORDER, playerName, playerColor, message });

            // if (this.roomState.isGameStarted && this.isMyTurn)
            //   this.openMyDeck();
            break;

          case MESSAGE_PLACE_STRUCTURE:
            this.addGameLog({ type: CHAT_LOG_PURCHASE, playerName, playerColor, message });
            this.addAlert({ color: 'success', text: `${playerName} ${message}` });

            const { structureAudio } = this.$refs;
            if (structureAudio) structureAudio.play(); 
            
            break;

          case MESSAGE_PLAY_GAME_CARD:
            const { cardType } = broadcast;
            attentionHeader = `${playerName} has played ${cardType}`;

            this.addGameLog({ type: CHAT_LOG_GAME_CARD, playerName, cardType, playerColor });
            this.addAlert({ color: 'success', text: attentionHeader });

            attentionData.gameCardType = cardType;
            break;

          case MESSAGE_GAME_VICTORY:
            this.addGameLog({ type: CHAT_LOG_SIMPLE, message: `${playerName} has won the game!!!` });
            this.$store.commit('victory', playerName);

            attentionHeader = `VICTORY! ${playerName} has won the game!`;
            break;
        }

        if (isAttention && !!attentionHeader)
          this.onAttention(attentionHeader, attentionData);
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
      console.log("gameCard", gameCard)
        this.room.send({
          type: MESSAGE_PLAY_GAME_CARD,
          cardType: gameCard.cardType,
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
          @play-hero="onPlayHeroCard($event)"
          @play-card="onPlayGameCard($event)"
          @toggle-ready="toggleReady"
        />
      </BaseWidget>
      <div class="board-area">
        <div class="map-layout">
          <MapLayout />
        </div>
        <!-- <div class="mountain-forest">
          <MountainForest />
        </div> -->
        <!-- <div class="river">
          <River />
        </div> -->
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
    <v-dialog width="500" :value="myPlayer.isDeclaringMonopoly">
      <ResourceSelect :title="null" @resource-selected="onMonopolySelected($event)" />
    </v-dialog>
    <!-- <RollingDice v-if="isRollingDice" :type="roomState.roomType" @finished="sendDice($event)" /> -->
    <BaseOverlay v-if="activeDice && activeDice.who && activeDice.who === myPlayer.playerSessionId" isOpen :opacity="0.7">
      <GameDice :dice="activeDice.dice" size="140px" />
    </BaseOverlay>
    <audio ref="diceAudio">
      <source src="../assets/audio/dice.mp3" type="audio/mpeg">
    </audio>
    <audio ref="lootAudio">
      <source src="../assets/audio/receive-loot.mp3" type="audio/mpeg">
    </audio>
    <audio ref="robberAudio">
      <source src="../assets/audio/robber.mp3" type="audio/mpeg">
    </audio>
      <audio ref="structureAudio">
      <source src="../assets/audio/structure.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

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
        position: relative;
        display: flex;
        flex-direction: column;

        .map-layout {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .mountain-forest {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
        }

        .river {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 50%;
        }

        @include lg-down() {
          grid-area: board;
        }

        .the-north {
          height: $board-height * 0.5;
        }

        .game-board {
          height: $board-height;

          &.with-north {
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
