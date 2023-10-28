class Shalten {
  constructor(shaltens = []) {
    if (!Array.isArray(shaltens)) {
      throw new TypeError("Shaltens must be an array");
    }

    let _shaltens = shaltens.map(([key, value]) => {
      if (typeof key !== "string") {
        throw new TypeError("Shalten key must be a string");
      }

      if (typeof value !== "function") {
        throw new TypeError("Shalten value must be a function");
      }

      return [
        key,
        {
          func: value,
          on: false,
        },
      ];
    });

    this._shaltens = new Map(_shaltens);
  }

  get values() {
    return Array.from(this._shaltens);
  }

  add(key, func) {
    this._shaltens.set(key, { func, on: false });
    return this;
  }

  remove(key) {
    this._shaltens.delete(key);
    return this;
  }

  get(key) {
    const shalten = this._shaltens.get(key);
    return shalten;
  }

  switchOn(key, options = {}) {
    const { beforeOn, afterOn } = options;
    const shalten = this._shaltens.get(key);

    if (!shalten) throw new Error(`Shalten ${key} not found`);
    if (shalten.on) throw new Error(`Shalten ${key} is already on`);

    if (beforeOn) beforeOn();

    const cleanup = shalten.func();

    if (afterOn) afterOn();

    if (cleanup && typeof cleanup === "function") cleanup();

    this._shaltens.set(key, { ...shalten, on: true });

    return this;
  }

  async switchAllOn() {
    for (const [key, shalten] of this._shaltens.entries()) {
      const { func, on } = shalten;

      if (on) throw new Error(`Shalten ${key} is already on`);

      const cleanup = func();

      if (cleanup && typeof cleanup === "function") cleanup();

      this._shaltens.set(key, { func, on: true });
    }

    return this;
  }

  switchOff(key) {
    const shalten = this._shaltens.get(key);

    if (!shalten) throw new Error(`Shalten ${key} not found`);

    const { func, on } = shalten;

    if (!on) throw new Error(`Shalten ${key} is already off`);

    this._shaltens.set(key, { func, on: false });

    return this;
  }

  async switchAllOff() {
    for (const [key, shalten] of this._shaltens.entries()) {
      const { func } = shalten;
      this._shaltens.set(key, { func, on: false });
    }

    return this;
  }

  restart(key) {
    if (!this._shaltens.has(key)) throw new Error(`Shalten ${key} not found`);

    this.switchOff(key);
    this.switchOn(key);

    return this;
  }

  restartAll() {
    this.switchAllOff();
    this.switchAllOn();
    return this;
  }
}

module.exports = Shalten;
