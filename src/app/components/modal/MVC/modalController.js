import { eventBus } from '../../../services/eventBus';

/**
 * @description manages subscription to custom events and controls view of the modal component
 * @exports ModalController
 * @class ModalController
 */
export class ModalController {
  constructor(view) {
    this.view = view;

    eventBus.subscribe('open-modal-window', info => this.view.render(info));

    eventBus.subscribe('confirm-removing', ids => {
      this.view.renderConfirmationPopup(ids);
    });

    eventBus.subscribe('remove-confirmation-popup', () => {
      this.view.removeConfirmationPopup();
    });
  }
}
