import Vue from 'vue';
import Vuex from 'vuex';
import colyseusService from '@/services/colyseus';
import localStorage from '@/services/localStorage';
import boardService from '@/services/board';
import { ESSENTIAL_OVERLAY_TIMEOUT } from '../config';

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
    rooms: [],
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
      hasResources: {}
    },
    desiredRobberTile: -1,
    gameLog: [],
    alerts: {},
    essentialOverlay: {
      isOpen: false
    },
    justPurchasedGameCard: false,
    gameWinner: null
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
    setGameLoading(state, isLoading) {
      console.log("setGameLoading -> isLoading", isLoading)
      state.isGameLoading = isLoading;
      console.log("setGameLoading -> isGameLoading", state.isGameLoading)
    },
    toggleSelfReady(state) {
      state.isSelfReady = !state.isSelfReady;
    },
    setDesiredRobberTile(state, tile) {
      state.desiredRobberTile = tile;
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
      console.log("destroyRoomState -> resetStructures", resetStructures)
      state.activeStructures = [
        ...resetStructures
      ];

      const resetRoads = boardService.initialRoads();
      console.log("destroyRoomState -> resetRoads", resetRoads)
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
    victory(state, playerName) {
      state.gameWinner = playerName;
    },
    setEssentialOverlay(state, data = {}) {
      state.essentialOverlay = {
        isOpen: true,
        ...data
      };
        
      setTimeout(
        () => {
          state.essentialOverlay = {
            isOpen: false
          };
        },
        ESSENTIAL_OVERLAY_TIMEOUT
      );
    }
  },
  actions: {
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
