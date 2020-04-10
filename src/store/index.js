import Vue from 'vue';
import Vuex from 'vuex';
import colyseusService from '@/services/colyseus';
import localStorage from '@/services/localStorage';
import BoardService from '@/services/board';

Vue.use(Vuex);

const initialNickname = 'Jhon Doe';
const initialColor = '#2c3e50';

export default new Vuex.Store({
  state: {
    isDeveloperMode: localStorage.getDeveloperMode() || false,
    isUseGameEngine: localStorage.getUseGameEngine() || false,
    profile: {
      nickname: localStorage.getNickname() || initialNickname,
      color: localStorage.getColor() || initialColor
    },
    isSelfReady: false,
    rooms: [],
    // reservations: [],
    roomState: {},
    activeStructures: [
      ...BoardService.initialStructures()
    ],
    activeRoads: [
      ...BoardService.initialRoads()
    ],
    players: [],
    myPlayer: {
      hasResources: {}
    },
    gameLog: [],
    alerts: {}
  },
  mutations: {
    toggleDeveloperMode(state) {
      state.isDeveloperMode = !state.isDeveloperMode;
      localStorage.setDeveloperMode(state.isDeveloperMode);
    },
    toggleUseGameEngine(state) {
      state.isUseGameEngine = !state.isUseGameEngine;
      localStorage.setUseGameEngine(state.isUseGameEngine);
    },
    updateProfile(state, profile) {
      // Vue.set(state, 'profile', profile);
      const { color, nickname } = profile;

      state.profile = {
        ...state.profile,
        color,
        nickname
      };
    },
    syncProfile(state) {
      const { color, nickname } = state.profile;

      if (color) localStorage.setColor(color);
      if (nickname) localStorage.setNickname(nickname);
    },
    revertProfile(state) {
      const color = localStorage.getColor();
      const nickname = localStorage.getNickname();

      state.profile = {
        color,
        nickname 
      };
    },
    toggleSelfReady(state) {
      state.isSelfReady = !state.isSelfReady;
    },
    setRooms(state, rooms) {
      state.rooms = [
        ...rooms 
      ];
    },
    updateRoomState(state, roomState) {
      console.info("updateRoomState -> updated roomState: ", roomState)
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
        ...state.activeRoads
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

      state.activeStructures = [
        ...BoardService.initialStructures()
      ];

      state.activeRoads = [
        ...BoardService.initialRoads()
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
