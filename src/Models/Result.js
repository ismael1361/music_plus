export default class Result {
  constructor(code, description, stackTrace, dice) {
    this.code = code;
    this.description = description;
    Object.defineProperty(this, 'stackTrace', {
      get: function () {
        return this._stackTrace;
      },
      set: function (value) {
        this._stackTrace = value;
      },
    });
    this.stackTrace = stackTrace;
    this.dice = dice;
  }
}
