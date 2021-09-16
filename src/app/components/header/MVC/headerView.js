import { router } from '../../../routes';
import { eventBus } from '../../../services/eventBus';

/**
 * @exports HeaderView
 * @description manages header events and view
 * @class HeaderView
 */
export class HeaderView {
  /**
   * @description adds event listener for scroll event
   * @memberof HeaderView
   */
  addStickyHeader() {
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.js-header-main');
      const addBtn = header.querySelector('.js-btn-add');

      if (window.pageYOffset >= 20) {
        header.classList.add('header--fixed');

        if (addBtn) {
          header
            .querySelector('.js-btn-add')
            .firstElementChild.classList.remove('d-none');
        }
      } else {
        header.classList.remove('header--fixed');
        if (addBtn) {
          header
            .querySelector('.js-btn-add')
            .firstElementChild.classList.add('d-none');
        }
      }
    });
  }

  /**
   * @description adds event listeners on header buttons
   * @memberof HeaderView
   */
  addEvents() {
    document
      .querySelector('.js-btn-add')
      .addEventListener('click', () => eventBus.post('open-modal-window'));

    document
      .querySelector('.js-header-btn')
      .addEventListener('click', () => eventBus.post('open-modal-window'));

    document.querySelector('.js-btn-delete').addEventListener('click', e => {
      const counter = document.querySelector('.js-counter');
      e.currentTarget.firstElementChild.classList.toggle(
        'navigation__btn--active'
      );

      if (parseInt(counter.innerText, 10) > 0) {
        const checkedTasks = [...document.querySelectorAll('.checked')];
        const ids = checkedTasks.map(task => task.id);
        eventBus.post('confirm-removing', ids);
      } else {
        eventBus.post('toggle-remove-tasks-mode');
      }
    });
  }

  /**
   * @description manages counter view (round red mark) on delete button
   * @memberof HeaderView
   */
  checkTasksToDelete() {
    const tasksToDelete = document.querySelectorAll('.checked').length;
    if (tasksToDelete > 0) {
      document.querySelector('.js-counter').classList.remove('counter--hidden');
    } else {
      document.querySelector('.js-counter').classList.add('counter--hidden');
    }

    document.querySelector('.js-counter').innerHTML = tasksToDelete;
  }

  /**
   * @description manages click event for navigation buttons on header
   * @memberof HeaderView
   */
  addNavEvent() {
    const headerBtns = [...document.querySelectorAll('.js-header-nav-btn')];

    headerBtns.forEach(btn =>
      btn.firstElementChild.addEventListener('click', e =>
        this.toggleActiveBtns(e.currentTarget)
      )
    );
  }

  /**
   * @description toggles current view of active navigation buttons
   * @param {DomElement} elem active DOM element from navigation panel which represents current page
   * @memberof HeaderView
   */
  toggleActiveBtns(elem) {
    const headerBtns = [...document.querySelectorAll('.js-header-nav-btn')];

    headerBtns.forEach(btn => {
      btn.classList.remove('navigation__btn--active');
    });

    elem.classList.add('navigation__btn--active');

    if (elem.parentElement.dataset && elem.parentElement.dataset.link) {
      router.navigate(`/${elem.parentElement.dataset.link}`);
    }
  }
}
