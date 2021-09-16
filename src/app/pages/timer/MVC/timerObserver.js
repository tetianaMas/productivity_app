/**
 * @description manages custom events for task-list component
 * @exports TimerObserver
 * @class TimerObserver
 */
export class TimerObserver {
  /**
   * @description Creates an instance of TimerObserver
   * @memberof TimerObserver
   */
  constructor() {
    this.observers = [];
  }

  /**
   * @description adds new callback to the observers
   * @param {object} handler callback to hangle event
   * @memberof TimerObserver
   */
  subscribe(handler) {
    this.observers.push(handler);
  }

  /**
   * @description emits all handlers
   * @param {object} data arguments for the handler
   * @memberof TimerObserver
   */
  notify(data) {
    this.observers.forEach(handler => handler(data));
  }
}
