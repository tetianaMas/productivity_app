import { eventBus } from '../../../services/eventBus';
import * as taskTemplate from '../task/template/task.hbs';

/**
 * @description manages global task-list view
 * @exports TaskGlobalListView
 * @class TaskGlobalListView
 */
export class TaskGlobalListView {
  /**
   * @description Creates an instance of TaskGlobalListView
   * @param {object} model instance of TaskCollectionModel
   * @memberof TaskGlobalListView
   */
  constructor(model) {
    this.model = model;
    this.model.taskListChangedEvent.subscribe(
      this.renderGlobalTasks.bind(this)
    );
    this.model.orderTasksEvent.subscribe(this.orderTasks.bind(this));
  }

  /**
   * @description renders global tasks and sets events
   * @param {object} tasks tasks for rendering
   * @return {undefined}
   * @memberof TaskGlobalListView
   */
  renderGlobalTasks(tasks) {
    if (!tasks) {
      return;
    }

    document.querySelector('.js-global-list').classList.remove('d-none');
    const activeTasks = tasks.globalActive;
    const completedTasks = tasks.globalCompleted;

    if (!activeTasks && !completedTasks) {
      document.querySelector('.js-global-list').classList.add('d-none');

      return;
    }

    const containerActive = document.querySelector('.js-global-list-content');
    const containerCompleted = document.querySelector(
      '.js-global-list-content--done'
    );

    this.openGlobalList();

    this.renderTasks([activeTasks, containerActive]);
    this.renderTasks([completedTasks, containerCompleted]);

    this.addGeneralEvents();
    this.addTaskButtonsEvents();
  }

  /**
   * @description appends tasks to global container
   * @param {object} arg contains current tasks and container for global tasks
   * @return {undefined}
   * @memberof TaskGlobalListView
   */
  renderTasks(arg) {
    const [tasks, container] = arg;
    container.innerHTML = '';

    if (!tasks) {
      return;
    }

    document.querySelector('.js-global-list').classList.remove('d-none');
    const fragment = document.createDocumentFragment();

    for (const [key] of Object.entries(tasks)) {
      if (tasks[key].tasks.length === 0) {
        continue;
      }

      const taskCategoryList = this.createContainerTitle(tasks[key].title);

      taskCategoryList.insertAdjacentHTML(
        'beforeend',
        this.createTasksTemplate(tasks[key].tasks)
      );

      fragment.appendChild(taskCategoryList);
    }

    container.appendChild(fragment);
  }

  /**
   * @description hides tasks in global list depending on filter value
   * @param {object} arg containes tasks to hide and all tasks
   * @memberof TaskGlobalListView
   */
  orderTasks(arg) {
    const [tasksToHide, allTasks] = arg;

    if (allTasks) {
      allTasks.forEach(item => {
        const task = document.getElementById(item.id);
        task.classList.remove('task--hidden');
        task.parentElement.classList.remove('d-none');
      });
    }

    tasksToHide.forEach(elem => {
      const task = document.getElementById(elem.id);
      task.classList.add('task--hidden');
      const leftTasks = [...task.parentElement.children].filter(
        item => !item.classList.contains('task--hidden')
      );
      if (leftTasks.length <= 1) {
        task.parentElement.classList.add('d-none');
      }
    });
  }

  /**
   * @description shows global tasks container
   * @memberof TaskGlobalListView
   */
  openGlobalList() {
    document.querySelector('.js-global-list').classList.remove('d-none');
    document
      .querySelector('.js-global-list-open-close-icon')
      .classList.remove('icon-global-list-arrow-right');
    document
      .querySelector('.js-global-list-open-close-icon')
      .classList.add('icon-global-list-arrow-down');
  }

  /**
   * @description creates title template
   * @param {string} title task title
   * @return {string} template for render
   * @memberof TaskGlobalListView
   */
  createContainerTitle(title) {
    const taskCategoryList = document.createElement('div');
    taskCategoryList.classList.add('global-list__content__item');
    taskCategoryList.insertAdjacentHTML(
      'afterbegin',
      `
      <div class="global-list__content__title 
      global-list__content__title--${title}">${title}</div>
    `
    );

    return taskCategoryList;
  }

  /**
   * @description creates template from task object
   * @param {object} tasks for render
   * @return {string} template
   * @memberof TaskGlobalListView
   */
  createTasksTemplate(tasks) {
    let taskFragment = '';

    tasks.forEach(task => {
      taskFragment += taskTemplate(task);
    });

    return taskFragment;
  }

  /**
   * @description adds events to global list container
   * @memberof TaskGlobalListView
   */
  addGeneralEvents() {
    const globalTab = document.querySelector('.js-global-tabs-categories');

    document
      .querySelector('.js-global-list-btn-toggler')
      .addEventListener('click', e => {
        if (!e.target.classList.contains('js-global-list-btn-toggler')) {
          return;
        }
        const globalContainer = document.querySelector(
          '.js-global-list-container'
        );
        const globalTabs = [...document.querySelectorAll('.js-global-tabs')];
        const globalListIcon = document.querySelector(
          '.js-global-list-open-close-icon'
        );

        globalListIcon.classList.toggle('icon-global-list-arrow-down');
        globalListIcon.classList.toggle('icon-global-list-arrow-right');

        globalContainer.classList.toggle('d-none');
        globalTabs.forEach(tab => {
          tab.classList.toggle('d-none');
        });
      });

    globalTab.addEventListener('click', e => {
      if (e.target.classList.contains('tab__btn')) {
        const buttons = [...globalTab.querySelectorAll('.js-tab-btn')];
        buttons.forEach(btn => btn.classList.remove('tab__btn--active'));

        e.target.classList.add('tab__btn--active');
        const category = e.target.innerText.toLowerCase();
        eventBus.post('order-tasks', category);
      }
    });
  }

  /**
   * @description adds task buttons events
   * @memberof TaskGlobalListView
   */
  addTaskButtonsEvents() {
    const currentContainer = document.querySelector('.js-global-list');
    const buttonsControls = [
      ...currentContainer.querySelectorAll('.js-btn-controls'),
    ];

    buttonsControls.forEach(btn =>
      btn.addEventListener('click', e => {
        if (e.target.classList.contains('js-task-btn-edit')) {
          const id = e.currentTarget.parentElement.id;
          eventBus.post('edit-task', id);
        }

        if (e.target.classList.contains('js-task-btn-delete')) {
          const id = e.currentTarget.parentElement.id;
          eventBus.post('confirm-removing', [id]);
        }

        if (e.target.classList.contains('js-task-btn-up')) {
          eventBus.post('move-to-daily-list', e.currentTarget.parentElement.id);
        }
      })
    );
  }
}
