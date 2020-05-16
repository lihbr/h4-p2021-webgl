module.exports = class EventsManager {
  constructor() {
    this._init();
  }

  _init() {
    this.changedRoomColor = false;
  }

  _toggleColorLight() {
    if (this.changedRoomColor) {
      this._gameScene.pointLight.color.setHex(0xffffff);
      this.changedRoomColor = false;
    } else {
      this._gameScene.pointLight.color.setHex(0xff0000);
      this.changedRoomColor = true;
    }
  }

  getGameScene(gameScene) {
    this._gameScene = gameScene;
  }

  receiveEvent(eventID) {
    switch (eventID) {
      case 1:
        this._toggleColorLight();
        break;
    }
  }
};
