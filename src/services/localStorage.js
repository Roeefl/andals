const keys = {
  nickname: 'userNickname',
  color: 'userColor',
  developerMode: 'enableDeveloperMode',
  useGameEngine: 'eneableExperimentalGameEngine',
  lastRoomId: 'lastRoomId',
  lastSessionId: 'lastSessionId',
  enableSound: 'enableSound',
  enableFx: 'enableFx'
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
    return this.get(keys.developerMode) === 'true';
  }

  setDeveloperMode(isEnabled) {
    return this.set(keys.developerMode, isEnabled);
  }

  get useGameEngine() {
    return this.get(keys.useGameEngine) === 'true';
  }

  setUseGameEngine(isEnabled) {
    return this.set(keys.useGameEngine, isEnabled);
  }

  get enableSound() {
    return this.get(keys.enableSound) === 'true';
  }

  set enableSound(value) {
    this.set(keys.enableSound, value);
  }

  get enableFx() {
    return this.get(keys.enableFx) === 'true';
  }

  set enableFx(value) {
    this.set(keys.enableFx, value);
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
