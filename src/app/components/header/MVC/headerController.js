import { eventBus } from '../../../services/eventBus';

/**
 * @description manages subscription on custom events
 * @exports HeaderController
 * @class HeaderController
 */
export class HeaderController {
  /**
   * @description Creates an instance of HeaderController.
   * @param {object} view instance of HeaderView
   * @memberof HeaderController
   */
  constructor(view) {
    this.view = view;

    eventBus.subscribe('pageLoaded', () => {
      this.view.addStickyHeader();
      this.view.addNavEvent();

      if (window.location.hash === '#/task-list') {
        this.view.addEvents();
      }
    });
    eventBus.subscribe('raise-counter', () => {
      this.view.checkTasksToDelete();
    });
  }
}
