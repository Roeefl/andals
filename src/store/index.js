import Vue from 'vue';
import Vuex from 'vuex';
import colyseusService from '@/services/colyseus';
import localStorage from '@/services/localStorage';
import initialActiveStructures from '@/tilemaps/initialActiveStructures';
import initialActiveRoads from '@/tilemaps/initialActiveRoads';

Vue.use(Vuex);

const initialNickname = 'Jhon Doe';
const randomInt = Math.floor(Math.random() * 9999);

const initialColor = '#2c3e50';

export default new Vuex.Store({
  state: {
    profile: {
      nickname: localStorage.getNickname() || `${initialNickname} ${randomInt}`,
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
      state.profile = profile;
      
      const { color, nickname } = profile;
      if (color) localStorage.setColor(color);
      if (nickname) localStorage.setNickname(nickname);
    },
    toggleSelfReady(state) {
      state.isSelfReady = !state.isSelfReady;
    },
    setRooms(state, rooms) {
      state.rooms = rooms || [];
    },
    updateRoomState(state, roomState) {
      console.info("updateRoomState -> updated roomState: ", roomState)
      state.roomState = roomState;
      
      const { players = {} } = roomState;

      state.players = Object
        .entries(players || {})
        .map(([id, playerInfo]) => playerInfo);

      const myPlayer = state.players.find(({ playerSessionId }) => playerSessionId === colyseusService.room.sessionId);
      state.myPlayer = myPlayer;
      console.log("updateRoomState -> myPlayer", myPlayer)
      
      const updatedStructures = [
        ...initialActiveStructures
      ];

      roomState.structures.forEach(({ type, ownerId, row, col }) => {
        const owner = state.players.find(({ playerSessionId }) => playerSessionId === ownerId) || {};
        
        updatedStructures[row][col] = {
          type,
          ownerId,
          color: owner.color
        };
      });

      state.activeStructures = updatedStructures;

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

      state.activeRoads = updatedRoads;
    },
    destroyRoomState(state, payload) {
      state.isSelfReady = false;
      state.players = [];
      state.gameLog = [];
      state.myPlayer = {};
      state.activeStructures = initialActiveStructures;
      state.activeRoads = initialActiveRoads;
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
