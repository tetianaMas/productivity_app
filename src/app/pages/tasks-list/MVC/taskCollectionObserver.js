/**
 * @description manages custom events for task-list component
 * @exports TaskCollectionObserver
 * @class TaskCollectionObserver
 */
export class TaskCollectionObserver {
  /**
   * @description Creates an instance of TaskCollectionObserver
   * @memberof TaskCollectionObserver
   */
  constructor() {
    this.observers = [];
  }

  /**
   * @description adds new callback to the observers
   * @param {object} handler callback to hangle event
   * @memberof TaskCollectionObserver
   */
  subscribe(handler) {
    this.observers.push(handler);
  }

  /**
   * @description emits all handlers
   * @param {object} data arguments for the handler
   * @memberof TaskCollectionObserver
   */
  notify(data) {
    this.observers.forEach(handler => handler(data));
  }
}
