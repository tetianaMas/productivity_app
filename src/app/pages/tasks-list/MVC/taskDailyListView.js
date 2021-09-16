import { eventBus } from '../../../services/eventBus';
import taskTemplate from '../task/template/task.hbs';
import noDailyTasksMessageTemplate from '../template/no-daily-tasks-message.hbs';
import allTasksDoneTemplate from '../template/all-tasks-done.hbs';
import noTasksLeftTemplate from '../template/no-tasks-left.hbs';
import noTasksMessageTemplate from '../template/empty-page-message.hbs';

/**
 * @description manages daily task-list view
 * @exports TaskDailyListView
 * @class TaskCollectionView
 */
export class TaskDailyListView {
  /**
   * @description Creates an instance of TaskDailyListView
   * @param {*} model instance of TaskDailyListModel
   * @memberof TaskDailyListView
   */
  constructor(model) {
    this.model = model;
    this.model.taskListChangedEvent.subscribe(this.renderDailyTasks.bind(this));
    this.model.renderTasksDonePageEvent.subscribe(
      this.renderAllTasksDoneMessage.bind(this)
    );
    this.model.renderNoTasksLeftPageEvent.subscribe(
      this.renderNoTasksLeftMessage.bind(this)
    );
    this.model.renderAddFirstTaskPageEvent.subscribe(
      this.renderEmptyPageMessage.bind(this)
    );
    this.model.renderEmptyDailyTasks.subscribe(
      this.renderEmptyDailyTasksMessage.bind(this)
    );
  }

  /**
   * @description renders noTasksMessageTemplate
   * @memberof TaskDailyListView
   */
  renderEmptyPageMessage() {
    document.querySelector(
      '.js-main__content--daily'
    ).innerHTML = noTasksMessageTemplate();
    document.querySelector('.js-nav').classList.toggle('hidden');
  }

  /**
   * @description renders noDailyTasksMessageTemplate
   * @memberof TaskDailyListView
   */
  renderEmptyDailyTasksMessage() {
    document.querySelector(
      '.js-main__content--daily'
    ).innerHTML = noDailyTasksMessageTemplate();
  }
  /**
   * @description renders allTasksDoneTemplate
   * @memberof TaskDailyListView
   */
  renderAllTasksDoneMessage() {
    document.querySelector(
      '.js-main__content--daily'
    ).innerHTML = allTasksDoneTemplate();
  }
  /**
   * @description renders noTasksLeftTemplate
   * @memberof TaskDailyListView
   */
  renderNoTasksLeftMessage() {
    document.querySelector(
      '.js-main__content--daily'
    ).innerHTML = noTasksLeftTemplate();
  }

  /**
   * @description renders daily tasks
   * @param {object} tasks for rendering
   * @memberof TaskDailyListView
   */
  renderDailyTasks(tasks) {
    const activeTasks = tasks.dailyActive;
    const completedTasks = tasks.dailyCompleted;
    const activeTasksContainer = document.querySelector(
      '.js-main__content--daily'
    );
    const completedTasksContainer = document.querySelector(
      '.js-main__content--done'
    );

    if (activeTasks.length > 0) {
      activeTasksContainer.innerHTML = '';

      activeTasks.forEach(task => {
        task.deadlineDate.month = 'today';
        task.deadlineDate.day = '';

        activeTasksContainer.insertAdjacentHTML(
          'beforeend',
          taskTemplate(task)
        );
      });
    }

    if (completedTasks.length > 0) {
      completedTasksContainer.innerHTML = '';

      completedTasks.forEach(task => {
        task.deadlineDate.month = 'today';
        task.deadlineDate.day = '';

        completedTasksContainer.insertAdjacentHTML(
          'beforeend',
          taskTemplate(task)
        );
      });
    }

    this.addTaskButtonsEvents();
  }

  /**
   * @description sets tasks buttons events
   * @memberof TaskDailyListView
   */
  addTaskButtonsEvents() {
    const container = document.querySelector('.js-main__content--daily');
    const buttonsControls = [...container.querySelectorAll('.js-btn-controls')];
    const timerButtons = [...container.querySelectorAll('.js-link-start-task')];

    buttonsControls.forEach(btn =>
      btn.addEventListener('click', e => {
        const id = e.currentTarget.parentElement.id;
        if (e.target.classList.contains('js-task-btn-edit')) {
          eventBus.post('edit-task', id);
        }

        if (e.target.classList.contains('js-task-btn-delete')) {
          eventBus.post('confirm-removing', [id]);
        }

        if (e.target.classList.contains('js-task-btn-up')) {
          eventBus.post('move-to-daily-list', e.currentTarget.parentElement.id);
        }
      })
    );

    timerButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        if (e.currentTarget.classList.contains('js-link-start-task')) {
          const id = e.currentTarget.parentElement.id;
          eventBus.post('start-task', id);
        }
      });
    });
  }
}
