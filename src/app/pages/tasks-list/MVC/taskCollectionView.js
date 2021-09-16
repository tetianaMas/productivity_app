import { router } from '../../../routes';
import { eventBus } from '../../../services/eventBus';
import firstPageTemplate from '../template/firstPage.hbs';
import taskListCollection from '../template/task-list-container.hbs';

/**
 * @description manages task-list view
 * @exports TaskCollectionView
 * @class TaskCollectionView
 */
export class TaskCollectionView {
  /**
   * @description renders first screen view
   * @param {object} data for render
   * @memberof TaskCollectionView
   */
  renderFirstPage(data) {
    document.body.innerHTML = firstPageTemplate({
      data,
    });

    document.querySelector('.js-nav').classList.toggle('hidden');

    document.querySelector('.js-btn-skip').addEventListener('click', () => {
      document.location.reload();
    });

    document
      .querySelector('.js-btn-to-settings')
      .addEventListener('click', () => {
        router.navigate('/settings/pomodoros');
      });
  }

  /**
   * @description renders container
   * @param {object} data for render
   * @memberof TaskCollectionView
   */
  renderTaskListContainer(data) {
    const containerHtml = taskListCollection({
      data,
    });
    const activeNotification = document.querySelector('.js-notification');
    document.body.innerHTML = containerHtml;
    if (activeNotification) {
      document.body.append(activeNotification);
    }

    document.querySelector('.js-delete-btn').addEventListener('click', () => {
      eventBus.post('open-delete-mode');
    });

    this.addTabsEvent();
  }

  /**
   * @description sets tabs events
   * @memberof TaskCollectionView
   */
  addTabsEvent() {
    const tabLinks = [...document.getElementsByClassName('js-tablink')];
    const tabContent = [...document.getElementsByClassName('js-tabcontent')];

    tabLinks.forEach(link => {
      link.addEventListener('click', e => {
        tabLinks.forEach(item => item.classList.remove('tab__btn--active'));
        tabContent.forEach(content => content.classList.add('d-none'));

        if (e.target.classList.contains('first-main-tab')) {
          document
            .querySelector('.js-main__content--daily')
            .classList.remove('d-none');
          document
            .querySelector('.js-global-list-content')
            .classList.remove('d-none');
        }

        if (e.target.classList.contains('second-main-tab')) {
          document
            .querySelector('.js-main__content--done')
            .classList.remove('d-none');
          document
            .querySelector('.js-global-list-content--done')
            .classList.remove('d-none');
        }
      });
    });
  }

  /**
   * @description renders delete mode
   * @memberof TaskCollectionView
   */
  renderDeleteMode() {
    this.toggleSelectTabs();
    this.toggleDeleteButtons();
    this.addDeleteEvent();
  }

  /**
   * @description toggles active tabs
   * @memberof TaskCollectionView
   */
  toggleSelectTabs() {
    const tabs = [...document.querySelectorAll('.js-tab-select')];
    tabs.forEach(tab => {
      tab.classList.toggle('tab--hidden');

      tab.addEventListener('click', e => {
        const elementClassList = e.target.classList;
        if (elementClassList.contains('js-select-daily-list')) {
          this.getCurrentTaskContainer(
            '.js-container-daily',
            '.js-main__content--done',
            this.selectAllTasks
          );
        }

        if (elementClassList.contains('js-select-global-list')) {
          this.getCurrentTaskContainer(
            '.js-container-global',
            '.js-global-list-content--done',
            this.selectAllTasks
          );
        }

        if (elementClassList.contains('js-deselect-daily-list')) {
          this.getCurrentTaskContainer(
            '.js-container-daily',
            '.js-main__content--done',
            this.deselectAllTasks
          );
        }

        if (elementClassList.contains('js-deselect-global-list')) {
          this.getCurrentTaskContainer(
            '.js-container-global',
            '.js-global-list-content--done',
            this.deselectAllTasks
          );
        }
      });
    });
  }

  /**
   * @description chooses container and calls callback
   * @param {string} containerActiveSelector
   * @param {string} containerDoneSelector
   * @param {function} method
   * @memberof TaskCollectionView
   */
  getCurrentTaskContainer(
    containerActiveSelector,
    containerDoneSelector,
    method
  ) {
    let container;
    if (document.querySelector('.first-main-tab.tab__btn--active')) {
      container = document.querySelector(containerActiveSelector);
    } else {
      container = document.querySelector(containerDoneSelector);
    }
    method(container);
  }

  /**
   * @description toggles icon trash on delete buttons
   * @memberof TaskCollectionView
   */
  toggleDeleteButtons() {
    [...document.querySelectorAll('.js-task .js-task__category')].forEach(
      task => {
        if (task.children.length > 0) {
          task.innerHTML = '';
        } else {
          task.insertAdjacentHTML(
            'afterbegin',
            '<span class="task__category__icon icon-trash"></span>'
          );
        }

        task.classList.toggle('task__category--delete');
      }
    );
  }

  /**
   * @description adds delete event
   * @memberof TaskCollectionView
   */
  addDeleteEvent() {
    [...document.querySelectorAll('.js-task__category')].forEach(task => {
      task.addEventListener('click', e =>
        this.toggleTaskToDelete(e.currentTarget)
      );
    });
  }

  /**
   * @description toggles active css class on current element
   * and emits custom event 'raise-counter'
   * @param {object} taskElem task element
   * @memberof TaskCollectionView
   */
  toggleTaskToDelete(taskElem) {
    const currentCategoryClass = taskElem.classList[1];
    const activeColorCategoryClass = `${currentCategoryClass}--active`;

    taskElem.classList.toggle(activeColorCategoryClass);
    taskElem.firstElementChild.classList.toggle('icon-trash');
    taskElem.firstElementChild.classList.toggle('icon-close');
    taskElem.parentElement.classList.toggle('checked');

    eventBus.post('raise-counter');
  }

  /**
   * @description selects all tasks to delete
   * and emits custom event 'raise-counter'
   * @param {object} container current tasks container
   * @memberof TaskCollectionView
   */
  selectAllTasks(container) {
    [...container.querySelectorAll('.js-task__category')].forEach(task => {
      const currentCategoryClass = task.classList[1];
      const activeColorCategoryClass = `${currentCategoryClass}--active`;
      task.classList.add(activeColorCategoryClass);
      task.firstElementChild.classList.remove('icon-trash');
      task.firstElementChild.classList.add('icon-close');
      task.parentElement.classList.add('checked');
    });

    eventBus.post('raise-counter');
  }

  /**
   * @description deselects all tasks to delete
   * and emits custom event 'raise-counter'
   * @param {object} container current tasks container
   * @memberof TaskCollectionView
   */
  deselectAllTasks(container) {
    [...container.querySelectorAll('.js-task__category')].forEach(task => {
      const currentCategoryClass = task.classList[1];
      const activeColorCategoryClass = `${currentCategoryClass}--active`;
      task.classList.remove(activeColorCategoryClass);
      task.firstElementChild.classList.remove('icon-close');
      task.firstElementChild.classList.add('icon-trash');
      task.parentElement.classList.remove('checked');
    });

    eventBus.post('raise-counter');
  }
}
