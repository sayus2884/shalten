const ON = "on";
const OFF = "off";
const LOADING = "loading";

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
          state: OFF,
        },
      ];
    });

    this._shaltens = new Map(_shaltens);
  }

  get shaltens() {
    return Array.from(this._shaltens);
  }

  add(key, func) {
    this._shaltens.set(key, { func, state: OFF });
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

    if (!shalten) throw new Error(`Shalten "${key}" not found`);
    if (shalten.state === ON) throw new Error(`Shalten "${key}" is already on`);

    this._doSomething(key, shalten, options);

    this._shaltens.set(key, { ...shalten, state: ON });

    return this;
  }

  switchAllOn(options = {}) {
    for (const [key, shalten] of this._shaltens.entries()) {
      const { func, state } = shalten;

      if (state === ON) throw new Error(`Shalten "${key}" is already on`);

      this._doSomething(shalten, options);

      this._shaltens.set(key, { func, state: ON });
    }

    return this;
  }

  switchOff(key) {
    const shalten = this._shaltens.get(key);

    if (!shalten) throw new Error(`Shalten "${key}" not found`);

    if (shalten.state === OFF)
      throw new Error(`Shalten "${key}" is already off`);

    this._shaltens.set(key, { ...shalten, state: OFF });

    return this;
  }

  switchAllOff() {
    for (const [key, shalten] of this._shaltens.entries()) {
      const { func } = shalten;
      this._shaltens.set(key, { func, state: OFF });
    }

    return this;
  }

  restart(key) {
    if (!this._shaltens.has(key)) throw new Error(`Shalten "${key}" not found`);

    this.switchOff(key);
    this.switchOn(key);

    return this;
  }

  restartAll() {
    this.switchAllOff();
    this.switchAllOn();
    return this;
  }

  async _doSomething(key, shalten, options = {}) {
    const { beforeOn, afterOn } = options;

    this._shaltens.set(key, { ...shalten, state: LOADING });

    if (beforeOn) beforeOn();

    await shalten.func();

    if (afterOn) afterOn();
  }
}

module.exports = Shalten;
