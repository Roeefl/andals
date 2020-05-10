import Vue from 'vue';
import Vuex from 'vuex';
import colyseusService, { ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';
import localStorage from '@/services/localStorage';
import boardService from '@/services/board';
import { DEFAULT_ATTENTION_TIMEOUT } from '@/config';

import { MESSAGE_FINISH_TURN } from '@/constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    enableSnow: localStorage.enableFx || false,
    lobbySnowflakes: 20,
    enableAmbience: localStorage.enableSound || false,
    isDeveloperMode: localStorage.developerMode || false,
    isUseGameEngine: localStorage.useGameEngine || false,
    isServerUp: false,
    currentUser: {},
    isGameLoading: false,
    isSelfReady: false,
    displayDeck: false,
    displayedHeroCard: {},
    rooms: [],
    lobbyChat: [],
    // reservations: [],
    roomState: {},
    activeStructures: [
      ...boardService.initialStructures()
    ],
    activeRoads: [
      ...boardService.initialRoads()
    ],
    players: [],
    myPlayer: {
      color: 'primary',
      nickname: 'Loading...',
      avatar: 1,
      resourceCounts: {},
      hasResources: {},
      currentHeroCard: {}
    },
    activePurchase: null,
    desiredRobberTile: -1,
    isRollingDice: false,
    activeDice: null,
    awaitingTradeRequest: {},
    gameLog: [],
    alerts: {},
    recentLoot: {},
    attentions: {
      isOpen: false
    },
    attentionsTiemout: null,
    justPurchasedGameCard: false,
    gameWinner: null
  },
  getters: {
    roomType: state => state.roomState.roomType || ROOM_TYPE_FIRST_MEN,
    isGameStarted: state => state.roomState.isGameStarted,
    isTurnOrderPhase: state => state.roomState.isTurnOrderPhase,
    isSetupPhase: state => state.roomState.isSetupPhase,
    currentRound: state => state.roomState.currentRound,
    myPlayerIndex: state => state.players.findIndex(player => player.playerSessionId === state.myPlayer.playerSessionId),
    isMyTurn: (state, getters) => state.roomState.currentTurn === getters.myPlayerIndex,
    allowPurchasing: (state, getters) => (
      getters.isMyTurn &&
      (getters.isSetupPhase || state.roomState.isDiceRolled) &&
      !state.myPlayer.mustMoveRobber
    ),
    allowRequestTrade: (state, getters) => (
      getters.isGameStarted &&
      getters.isMyTurn &&
      !state.myPlayer.isWaitingTradeRequest
    ),
    allowPurchaseGameCard: (state, getters) => (
      getters.isMyTurn &&
      !getters.isSetupPhase &&
      state.roomState.isDiceRolled &&
      state.myPlayer.hasResources.gameCard &&
      !state.myPlayer.mustMoveRobber
    ),
    clanAreas: state => state.roomState.clanAreas,
  },
  mutations: {
    toggleSnow(state) {
      const nextValue = !state.enableSnow;

      state.enableSnow = nextValue;
      localStorage.enableFx = nextValue;
    },
    setLbbySnowflakes(state, value) {
      state.lobbySnowflakes = value
    },
    toggleAmbience(state) {
      const nextValue = !state.enableAmbience;
      localStorage.enableSound = nextValue;
      state.enableAmbience = nextValue;
    },
    startAmbience(state) {
      if (localStorage.enableSound)
        state.enableAmbience = true;
    },
    toggleDeveloperMode(state) {
      state.isDeveloperMode = !state.isDeveloperMode;
      localStorage.setDeveloperMode(state.isDeveloperMode);
    },
    toggleUseGameEngine(state) {
      state.isUseGameEngine = !state.isUseGameEngine;
      localStorage.setUseGameEngine(state.isUseGameEngine);
    },
    setJustPurchasedGameCard(state, isPurchased) {
      state.justPurchasedGameCard = isPurchased;
    },
    setServerStatus(state, isReady) {
      state.isServerUp = isReady;
    },
    setCurrentUser(state, user) {
      console.log("setCurrentUser -> user", user)
      state.currentUser = user;
    },
    addLobbyChatMessage(state, message) {
      state.lobbyChat = [
        ...state.lobbyChat,
        message
      ];
    },
    setGameLoading(state, isLoading) {
      console.log("setGameLoading -> isLoading", isLoading)
      state.isGameLoading = isLoading;
      console.log("setGameLoading -> isGameLoading", state.isGameLoading)
    },
    openMyDeck(state) {
      state.displayDeck = true;
    },
    closeMyDeck(state) {
      state.displayDeck = false;
    },
    setDisplayedHeroCard(state, heroCard) {
      state.displayedHeroCard = heroCard;
    },
    toggleSelfReady(state) {
      state.isSelfReady = !state.isSelfReady;
    },
    setActivePurchase(state, purchase) {
      state.activePurchase = null;

      setTimeout(() => {
        state.activePurchase = purchase
      }, 200);
    },
    setDesiredRobberTile(state, tile) {
      state.desiredRobberTile = tile;
    },
    setRollingDice(state, isRolling) {
      state.isRollingDice = isRolling;
    },
    setActiveDice(state, data) {
      state.activeDice = data;
    },
    initAwaitingTradeRequest(state) {
      state.awaitingTradeRequest = state.players
        .filter(({ playerSessionId }) => playerSessionId !== state.myPlayer.playerSessionId)
        .reduce((acc, { playerSessionId }) => {
          acc[playerSessionId] = true;
          return acc;
        }, {});
    },
    updateAwaitingTradeRequest(state, whoRefused) {
      state.awaitingTradeRequest = {
        ...state.awaitingTradeRequest,
        [whoRefused]: false
      };
    },
    resetAwaitingTradeRequest(state) {
      state.awaitingTradeRequest = {}
    },
    setRooms(state, rooms) {
      state.rooms = [
        ...rooms 
      ];
    },
    updateRoomState(state, roomState) {
      state.roomState = {
        ...roomState,
        lastUpdated: Date.now()
      };
      
      const { players = {} } = roomState;

      const updatedPlayers = Object
        .entries(players || {})
        .map(([id, playerInfo]) => playerInfo);

      state.players = [
        ...updatedPlayers
      ];

      const myPlayer = state.players.find(({ playerSessionId }) => playerSessionId === colyseusService.room.sessionId);

      state.myPlayer = {
        ...myPlayer,
        lastUpdated: Date.now()
      };
      
      const updatedStructures = [
        ...state.activeStructures
      ];

      roomState.structures.forEach(({ type, ownerId, row, col }) => {
        const owner = state.players.find(({ playerSessionId }) => playerSessionId === ownerId) || {};
        
        updatedStructures[row][col] = {
          type,
          ownerId,
          color: owner.color,
          row,
          col
        };
      });

      state.activeStructures = [
        ...updatedStructures
      ];

      const updatedRoads = [
        ...boardService.initialRoads()
      ];

      roomState.roads.forEach(({ ownerId, row, col }) => {
        const owner = state.players.find(({ playerSessionId }) => playerSessionId === ownerId) || {};
        
        updatedRoads[row][col] = {
          ownerId,
          color: owner.color,
          row,
          col
        };
      });

      state.activeRoads = [
        ...updatedRoads
      ];
    },
    destroyRoomState(state) {
      state.isSelfReady = false;
      
      state.players = [];
      state.gameLog = [];

      state.myPlayer = {
        hasResources: {}
      };

      const resetStructures = boardService.initialStructures();
      state.activeStructures = [
        ...resetStructures
      ];

      const resetRoads = boardService.initialRoads();
      state.activeRoads = [
        ...resetRoads
      ];
    },
    addGameLog(state, log) {
      state.gameLog = [
        ...state.gameLog,
        log
      ];
    },
    addAlert(state, alert) {
      const alertKey = `alert-${Date.now()}`;

      state.alerts = {
        ...state.alerts,
        [alertKey]: alert
      };
      
      setTimeout(() => {
        const updatedAlerts = {
          ...state.alerts
        };
        delete updatedAlerts[alertKey];

        state.alerts = updatedAlerts;
      }, 3000);
    },
    addRecentLoot(state, resourceCard) {
      const lootKey = `resource-${Date.now()}`;

      state.recentLoot = {
        ...state.recentLoot,
        [lootKey]: resourceCard
      };
      
      setTimeout(() => {
        const updatedLoot = {
          ...state.recentLoot
        };
        delete updatedLoot[lootKey];

        state.recentLoot = updatedLoot;
      }, 5000);
    },
    victory(state, playerName) {
      state.gameWinner = playerName;
    },
    setAttentions(state, data = {}) {
      clearTimeout(state.attentionsTiemout);

      state.attentions = {
        isOpen: true,
        ...data
      };
        
      state.attentionsTiemout = setTimeout(
        () => {
          state.attentions = {
            isOpen: false
          };
        },
        data.timeout || DEFAULT_ATTENTION_TIMEOUT
      );
    },
    addAttention(state, data = {}) {
      clearTimeout(state.attentionsTiemout);
  
      state.attentions = {
        ...state.attentions,
        ...data,
        isOpen: true
      };
  
      state.attentionsTiemout = setTimeout(
        () => {
          state.attentions = {
            isOpen: false
          };
        },
        data.timeout || DEFAULT_ATTENTION_TIMEOUT
      );
    },
  },
  actions: {
    async finishTurn({ commit }) {
      await colyseusService.room.send({
        type: MESSAGE_FINISH_TURN
      });

      commit('setJustPurchasedGameCard', false);
    }
  },
  modules: {
  }
});

// addReservation(state, reservation) {
//   state.reservations = [
//     ...state.reservations,
//     reservation
//   ];
// },
// removeReservation(state, reservationId) {
//   state.reservations = state.reservations
//     .filter(res => res.id !== reservationId);
// },
