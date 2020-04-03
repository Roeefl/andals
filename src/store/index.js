import Vue from 'vue';
import Vuex from 'vuex';
import colyseusService from '@/services/colyseus';
import localStorage from '@/services/localStorage';
import initialActiveStructures from '@/tilemaps/initialActiveStructures';
import initialActiveRoads from '@/tilemaps/initialActiveRoads';

Vue.use(Vuex);

const initialNickname = 'Jhon Doe';
const initialColor = '#2c3e50';

export default new Vuex.Store({
  state: {
    profile: {
      nickname: localStorage.getNickname() || initialNickname,
      color: localStorage.getColor() || initialColor
    },
    isSelfReady: false,
    rooms: [],
    // reservations: [],
    roomState: {},
    activeStructures: initialActiveStructures,
    activeRoads: initialActiveRoads,
    players: [],
    myPlayer: {},
    gameLog: [],
    alerts: []
  },
  mutations: {
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

      state.players = Object
        .entries(players || {})
        .map(([id, playerInfo]) => playerInfo);

      const myPlayer = state.players.find(({ playerSessionId }) => playerSessionId === colyseusService.room.sessionId);

      state.myPlayer = {
        ...myPlayer,
        lastUpdated: Date.now()
      };
      
      const updatedStructures = [
        ...initialActiveStructures
      ];

      console.log(roomState.structures);

      roomState.structures.forEach(({ type, ownerId, row, col }) => {
        const owner = state.players.find(({ playerSessionId }) => playerSessionId === ownerId) || {};
        
        updatedStructures[row][col] = {
          type,
          ownerId,
          color: owner.color
        };
      });

      state.activeStructures = [
        ...updatedStructures
      ];

      const updatedRoads = [
        ...initialActiveRoads
      ];

      roomState.roads.forEach(({ ownerId, row, col }) => {
        const owner = state.players.find(({ playerSessionId }) => playerSessionId === ownerId) || {};
        
        updatedRoads[row][col] = {
          ownerId,
          color: owner.color
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
      state.myPlayer = {};

      state.activeStructures = [
        ...initialActiveStructures
      ];
      state.activeRoads = [
        ...initialActiveRoads
      ];
    },
    addGameLog(state, log) {
      state.gameLog = [
        ...state.gameLog,
        log
      ];
    },
    addAlert(state, alert) {
      state.alerts = [
        ...state.alerts,
        alert
      ];
      
      setTimeout(() => {
        state.alerts = [];
        console.log(state.alerts); // @FIXME: Remove only this one
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
