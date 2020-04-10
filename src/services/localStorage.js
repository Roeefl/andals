const keys = {
  nickname: 'userNickname',
  color: 'userColor',
  developerMode: 'enableDeveloperMode',
  useGameEngine: 'eneableExperimentalGameEngine'
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

  getNickname() {
    return this.get(keys.nickname);
  }

  setNickname(nickname) {
    return this.set(keys.nickname, nickname);
  }

  getColor() {
    return this.get(keys.color);
  }

  setColor(color) {
    return this.set(keys.color, color);
  }

  getDeveloperMode() {
    return this.get(keys.developerMode) === 'true' ? true: false;
  }

  setDeveloperMode(isEnabled) {
    return this.set(keys.developerMode, isEnabled);
  }

  getUseGameEngine() {
    return this.get(keys.useGameEngine) === 'true' ? true: false;
  }

  setUseGameEngine(isEnabled) {
    return this.set(keys.useGameEngine, isEnabled);
  }
}

export default new localStorage();
