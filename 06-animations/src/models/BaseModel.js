module.exports = class BaseModel {
  constructor(THREE, scene, cb = {}) {
    this._Cnstr = THREE;
    this._Scene = scene;
    this._Callbacks = cb;

    this._init();
  }

  _init() {
    this._bind();
  }

  _bind() {
    this._render();
  }

  _render() {
    // Keep looping
    window.requestAnimationFrame(() => {
      this._render();
    });
  }
};
