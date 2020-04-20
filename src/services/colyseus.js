import * as Colyseus from 'colyseus.js';
import localStorage from '@/services/localStorage';

const baseUrl = `${process.env.VUE_APP_SERVER_API_URL}${process.env.VUE_APP_SERVER_API_PORT || ''}`;

export const roomTypes = ['baseGame', 'firstMen'];
export const [ROOM_TYPE_BASE_GAME, ROOM_TYPE_FIRST_MEN] = roomTypes;

class ColyseusService {
  constructor() {
    this._ = {
      isReady: false,
      client: {},
      isJoinedRoom: false,
      room: null
    };
  }

  async init() {
    const client = new Colyseus.Client(baseUrl);

    this._.isReady = true;
    this._.client = client;
  }

  get client() {
    return this._.client;
  }

  get room() {
    return this._.room;
  }

  async buildingCosts() {
    const endpoint = 'buildingCosts';

    const data = await axios
      .get(`${baseUrl}/api/${endpoint}/`)
      .then(({ data }) => data);

    console.log('data: ', data)
    return data;
  }

  async createRoom(roomType = ROOM_TYPE_BASE_GAME, options = {}) {
    const reservation = await this.client.create(roomType, options);
    return reservation;
  }

  async reconnect(specifiedRoomId) {
    const roomId = specifiedRoomId || localStorage.lastRoomId;
    const sessionId = localStorage.lastSessionId;

    if (!roomId || !sessionId) return false;

    try {
      const room = await this.client.reconnect(roomId, sessionId);
      return room;
    } catch (err) {
      console.error('Reconnect Failed', err);
    }
  }

  async joinById(roomId, options) {
    if (!roomId) return this.createRoom(options);

    const room = await this.client.joinById(roomId, options);
    return room;
  }

  async listRooms() {
    try {
      const rooms = await this.client.getAvailableRooms();
      return rooms;
    } catch (err) {
      console.error(err);
    }
  }

  setRoom(room) {
    this._.isJoinedRoom = true;
    this._.room = room;

    localStorage.setLastRoomId(room.id);
    localStorage.setLastSessionId(room.sessionId);
    console.info(`ColyseusService -> setRoom -> joined room: ${room.name} (${room.id})`);
  }

  leaveRoom() {
    if (!this.room) return;
    console.info(`ColyseusService -> leaveRoom -> left room: ${this.room.name} (${this.room.id})`);

    this._.isJoinedRoom = false;
    this._.room = null;
  }
}

export default new ColyseusService();
