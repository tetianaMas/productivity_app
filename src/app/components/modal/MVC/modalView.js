import { eventBus } from '../../../services/eventBus';
import * as modalTemplate from '../template/modal.hbs';
import * as confirmationTemplate from '../template/confirmationModal.hbs';

/**
 * @description manages view of the modal component
 * @exports ModalView
 * @class ModalView
 */
export class ModalView {
  /**
   * @description renders modal and adds events
   * @param {string} [info='']
   * @memberof ModalView
   */
  render(info = '') {
    document.body.insertAdjacentHTML('afterbegin', modalTemplate(info));

    this.addCloseEvents();
    this.addDatePicker();

    if (info) {
      this.addUpdateTaskEvent(info);
    } else {
      this.addCreateTaskEvent();
    }
  }

  /**
   * @description adds click events to closing elements of
   * the modal (button on the top right and background overlay)
   * @memberof ModalView
   */
  addCloseEvents() {
    document
      .querySelector('.js-modal-close-btn')
      .addEventListener('click', () => {
        const elementModalWindow = document.getElementById('js-modal-window');
        const parentEl = elementModalWindow.parentElement;
        parentEl.removeChild(elementModalWindow);
      });

    document.querySelector('.overlay').addEventListener('click', () => {
      const elementModalWindow = document.getElementById('js-modal-window');
      const parentEl = elementModalWindow.parentElement;

      parentEl.removeChild(elementModalWindow);
    });
  }

  /**
   * @description adds jquery ui datepicker to the modal form
   * @memberof ModalView
   */
  addDatePicker() {
    $('#deadline').datepicker({
      dateFormat: 'MM d, yy',
    });
  }

  /**
   * @description manages editing of existing task
   * @param {object} task js object which contain info of editing task
   * @memberof ModalView
   */
  addUpdateTaskEvent(task) {
    document
      .querySelector('.js-modal-save-btn')
      .addEventListener('click', () => {
        const form = new FormData(document.querySelector('.js-modal-form'));
        const title = form.get('title');
        const description = form.get('description');

        if (
          this.validateTextField(title) &&
          this.validateTextField(description)
        ) {
          task.title = this.firstLetterToUppercase(title);
          task.description = this.firstLetterToUppercase(description);
          task.deadline = form.get('deadline');
          task.categoryId = form.get('category');
          task.estimation = form.get('rating');
          task.priority = form.get('priority');

          eventBus.post('update-task', task);
        }
      });
  }

  /**
   * @description manages data for new task task
   * @memberof ModalView
   */
  addCreateTaskEvent() {
    document
      .querySelector('.js-modal-save-btn')
      .addEventListener('click', () => {
        const form = new FormData(document.querySelector('.js-modal-form'));
        const title = form.get('title');
        const description = form.get('description');

        if (
          this.validateTextField(title) &&
          this.validateTextField(description)
        ) {
          const options = {
            title: this.firstLetterToUppercase(title),
            description: this.firstLetterToUppercase(description),
            deadline: form.get('deadline'),
            categoryId: form.get('category'),
            estimation: form.get('rating'),
            priority: form.get('priority'),
          };

          eventBus.post('create-task', options);
        }
      });
  }

  /**
   * @description validates text of task title and description
   * @param {string} value
   * @return {boolean}
   * @memberof ModalView
   */
  validateTextField(value) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      return false;
    }

    return true;
  }

  /**
   * @description transforms first letter of string to uppercase
   * @param {string} value
   * @return {string}
   * @memberof ModalView
   */
  firstLetterToUppercase(value) {
    if (!value || typeof value !== 'string') {
      return;
    }
    value = value.trim();

    if (!value) {
      return;
    }

    const stringValue = value.replace(
      /^.{1}/,
      value.substring(0, 1).toUpperCase()
    );

    return stringValue;
  }

  /**
   * @description renders confirmation popup before deleting tasks
   * and adds events for closing and deleting tasks
   * @param {object} ids an object with ids' of tasks to delete
   * @memberof ModalView
   */
  renderConfirmationPopup(ids) {
    if (Array.isArray(ids) && ids.length) {
      document.body.insertAdjacentHTML('afterbegin', confirmationTemplate());

      this.addCloseEvents();

      document
        .querySelector('.js-remove-task-confirm')
        .addEventListener('click', () => eventBus.post('remove-task', ids));

      document
        .querySelector('.js-remove-task-cancel')
        .addEventListener('click', () => {
          eventBus.post('remove-confirmation-popup');
        });
    }
  }

  /**
   * @description removes confirmation popup from view
   * @memberof ModalView
   */
  removeConfirmationPopup() {
    const elementModalWindow = document.getElementById('js-modal-window');
    const parentEl = elementModalWindow.parentElement;
    parentEl.removeChild(elementModalWindow);
  }
}
