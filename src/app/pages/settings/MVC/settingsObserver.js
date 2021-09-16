/**
 * @description manages custom events for settings component
 * @exports SettingsObserver
 * @class SettingsObserver
 */
export class SettingsObserver {
  /**
   * @description Creates an instance of SettingsObserver
   * @memberof SettingsObserver
   */
  constructor() {
    this.observers = [];
  }

  /**
   * @description adds new callback to the observers
   * @param {object} handler callback to hangle event
   * @memberof SettingsObserver
   */
  subscribe(handler) {
    this.observers.push(handler);
  }

  /**
   * @description emits all handlers
   * @param {object} data arguments for the handler
   * @memberof SettingsObserver
   */
  notify(data) {
    this.observers.forEach(handler => handler(data));
  }
}
