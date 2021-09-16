/**
 * @description manages custom events for report component
 * @exports ReportObserver
 * @class ReportObserver
 */
export class ReportObserver {
  /**
   * @description Creates an instance of ReportObserver
   * @memberof ReportObserver
   */
  constructor() {
    this.observers = [];
  }

  /**
   * @description adds new callback to the observers
   * @param {object} handler callback to hangle event
   * @memberof ReportObserver
   */
  subscribe(handler) {
    this.observers.push(handler);
  }

  /**
   * @description emits all handlers
   * @param {object} data arguments for the handler
   * @memberof ReportObserver
   */
  notify(data) {
    this.observers.forEach(handler => handler(data));
  }
}
