const keys = {
  nickname: 'userNickname',
  color: 'userColor',
  developerMode: 'enableDeveloperMode',
  useGameEngine: 'eneableExperimentalGameEngine',
  lastRoomId: 'lastRoomId',
  lastSessionId: 'lastSessionId'
};

class localStorage {
  get(key) {
    return window.localStorage.getItem(key) || null;
  }

  set(key, value) {
    window.localStorage.setItem(key, value);
    return true;
  }

  remove(key) {
    window.localStorage.removeItem(key);
    return true;
  }

  get nickname() {
    return this.get(keys.nickname);
  }

  setNickname(nickname) {
    return this.set(keys.nickname, nickname);
  }

  get color() {
    return this.get(keys.color);
  }

  setColor(color) {
    return this.set(keys.color, color);
  }

  get developerMode() {
    return this.get(keys.developerMode) === 'true' ? true: false;
  }

  setDeveloperMode(isEnabled) {
    return this.set(keys.developerMode, isEnabled);
  }

  get useGameEngine() {
    return this.get(keys.useGameEngine) === 'true' ? true: false;
  }

  setUseGameEngine(isEnabled) {
    return this.set(keys.useGameEngine, isEnabled);
  }

  get lastRoomId() {
    return this.get(keys.lastRoomId);
  }

  setLastRoomId(roomId) {
    return this.set(keys.lastRoomId, roomId);
  }

  get lastSessionId() {
    return this.get(keys.lastSessionId);
  }

  setLastSessionId(playerSessionId) {
    return this.set(keys.lastSessionId, playerSessionId);
  }
}

export default new localStorage();
