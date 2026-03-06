export class ProgressCore {
  /**
   * @param {object} renderer - объект-рендерер с методами:
   * mount(), setValue(value), setAnimated(flag), setHidden(flag), unmount()
   * @param {object} [initialState]
   */
  constructor(renderer, initialState = {}) {
    this._renderer = renderer;

    this._state = {
      value: 0,
      animated: false,
      hidden: false,
    };

    this.setState(initialState, { silent: true });
  }

  mount() {
    if (this._renderer?.mount) {
      this._renderer.mount();
    }

    this._applyStateToRenderer();
  }

  destroy() {
    if (this._renderer?.unmount) {
      this._renderer.unmount();
    }
  }

  /**
   * value в диапазоне 0..100
   * @param {number} value
   */
  setValue(value) {
    const nextValue = this._normalizeValue(value);

    if (nextValue === this._state.value) {
      return;
    }

    this._state.value = nextValue;
    this._applyStateToRenderer();
  }

  /**
   * @param {boolean} flag
   */
  setAnimated(flag) {
    const nextAnimated = this._normalizeBoolean(flag);

    if (nextAnimated === this._state.animated) {
      return;
    }

    this._state.animated = nextAnimated;
    this._applyStateToRenderer();
  }

  /**
   * @param {boolean} flag
   */
  setHidden(flag) {
    const nextHidden = this._normalizeBoolean(flag);

    if (nextHidden === this._state.hidden) {
      return;
    }

    this._state.hidden = nextHidden;
    this._applyStateToRenderer();
  }

  /**
   * @param {object} partial
   * @param {object} [options]
   * @param {boolean} [options.silent=false]
   */
  setState(partial = {}, options = {}) {
    const { silent = false } = options;

    const nextState = {
      value:
        partial.value !== undefined
          ? this._normalizeValue(partial.value)
          : this._state.value,

      animated:
        partial.animated !== undefined
          ? this._normalizeBoolean(partial.animated)
          : this._state.animated,

      hidden:
        partial.hidden !== undefined
          ? this._normalizeBoolean(partial.hidden)
          : this._state.hidden,
    };

    const hasChanged =
      nextState.value !== this._state.value ||
      nextState.animated !== this._state.animated ||
      nextState.hidden !== this._state.hidden;

    if (!hasChanged) {
      return;
    }

    this._state = nextState;

    if (!silent) {
      this._applyStateToRenderer();
    }
  }

  getState() {
    return { ...this._state };
  }

  _applyStateToRenderer() {
    if (!this._renderer) {
      return;
    }

    if (typeof this._renderer.setValue === "function") {
      this._renderer.setValue(this._state.value);
    }

    if (typeof this._renderer.setAnimated === "function") {
      this._renderer.setAnimated(this._state.animated);
    }

    if (typeof this._renderer.setHidden === "function") {
      this._renderer.setHidden(this._state.hidden);
    }
  }

  _normalizeValue(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    return Math.min(100, Math.max(0, numericValue));
  }

  _normalizeBoolean(value) {
    return Boolean(value);
  }
}