class RoomLayout {
  constructor() {
    this._ = {
      isReady: false,
      buildingCosts: {}
    };
  }

  async init() {
    const buildingCosts = await colyseusService.buildingCosts();

    this._.isReady = true;
    this._.buildingCosts = buildingCosts;
  }
  
  get buildingCosts() {
    return this._.buildingCosts;
  }
}

export default new RoomLayout();
