import * as Colyseus from 'colyseus.js';

const baseUrl = 'ws://localhost:2567';

const roomTypes = ['gameRoom'];
const [ROOM_TYPE_GAME] = roomTypes;

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

  async createRoom() {
    await this.client.create(ROOM_TYPE_GAME);
    // return reservation;
  }

  async listRooms() {
    try {
      const rooms = await this.client.getAvailableRooms(ROOM_TYPE_GAME);
      return rooms;
    } catch (err) {
      console.error(err);
    }
  }

  setRoom(room) {
    this._.isJoinedRoom = true;
    this._.room = room;

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
