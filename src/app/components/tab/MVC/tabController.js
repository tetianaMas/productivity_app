import { eventBus } from '../../../services/eventBus';

/**
 * @description manages subscriptions and tabs view
 * @exports TabController
 * @class TabController
 */
export class TabController {
  constructor(view) {
    this.view = view;

    eventBus.subscribe('pageLoaded', () => this.view.addTabEvents());
  }
}
