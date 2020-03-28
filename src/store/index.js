import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const initialNickname = 'Jhon Doe';
const randomInt = Math.floor(Math.random() * 9999);

const initialColor = '#409EFF';

export default new Vuex.Store({
  state: {
    profile: {
      nickname: `${initialNickname} ${randomInt}`,
      color: initialColor
    },
    rooms: [],
    reservations: [],
    currentRoomState: {}
  },
  mutations: {
    updateProfile(state, profile) {
      state.profile = profile
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
      state.currentRoomState = roomState;
    }
  },
  actions: {
  },
  modules: {
  }
});
