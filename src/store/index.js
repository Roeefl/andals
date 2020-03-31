import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const initialNickname = 'Jhon Doe';
const randomInt = Math.floor(Math.random() * 9999);

const initialColor = '#2c3e50';

export default new Vuex.Store({
  state: {
    profile: {
      nickname: `${initialNickname} ${randomInt}`,
      color: initialColor
    },
    isSelfReady: false,
    rooms: [],
    reservations: [],
    roomState: {},
    players: [],
    gameLog: []
  },
  mutations: {
    updateProfile(state, profile) {
      state.profile = profile
    },
    toggleSelfReady(state) {
      state.isSelfReady = !state.isSelfReady;
    },
    setRooms(state, rooms) {
      state.rooms = rooms || [];
    },
    addReservation(state, reservation) {
      state.reservations = [
        ...state.reservations,
        reservation
      ];
    },
    removeReservation(state, reservationId) {
      state.reservations = state.reservations
        .filter(res => res.id !== reservationId);
    },
    updateRoomState(state, roomState) {
      console.info("updateRoomState -> updated roomState: ", roomState)
      state.roomState = roomState;

      const { players = {} } = roomState;

      state.players = Object
        .entries(players || {})
        .map(([id, playerInfo]) => playerInfo);
    },
    addGameLog(state, log) {
      state.gameLog = [
        ...state.gameLog,
        log
      ];
    }
  },
  actions: {
  },
  modules: {
  }
});
