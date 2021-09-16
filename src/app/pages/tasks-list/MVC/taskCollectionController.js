import { router } from '../../../routes';
import { eventBus } from '../../../services/eventBus';

/**
 * @description controls task-list component
 * @exports TaskCollectionController
 * @class TaskCollectionController
 */
export class TaskCollectionController {
  /**
   * @description Creates an instance of TaskCollectionController
   * @param {*} view instance of TaskCollectionView
   * @param {*} model instance of TaskCollectionModel
   * @memberof TaskCollectionController
   */
  constructor(view, model) {
    this.view = view;
    this.model = model;

    eventBus.subscribe('task-list-loading', () => {
      this.init();
    });

    eventBus.subscribe('create-task', data => {
      this.view.renderTaskListContainer(this.model.taskListTemplateData);
      this.model.createTask(data);
      eventBus.post('pageLoaded');
    });

    eventBus.subscribe('update-task', task => {
      this.model.updateTask(task);
      eventBus.post('render-page');
    });

    eventBus.subscribe('render-page', () => {
      this.view.renderTaskListContainer(this.model.taskListTemplateData);
      this.model.createTaskListCollection();
      eventBus.post('pageLoaded');
    });

    eventBus.subscribe('move-to-daily-list', id => {
      this.model
        .changeTaskStatus(id, 'DAILY_LIST')
        .then(() => {
          $(document).notification('clean');
          $(document).notification({
            type: 'info',
            text: 'Your task was moved to the daily task list',
            showTime: 3,
          });
        })
        .catch(() => {
          $(document).notification('clean');
          $(document).notification({
            type: 'error',
            text: 'Unable to move to the daily task list. Try again later',
          });
        });
      eventBus.post('render-page');
    });

    eventBus.subscribe('remove-task', ids => {
      this.model
        .removeTask(ids)
        .then(() => {
          $(document).notification('clean');
          $(document).notification({
            type: 'success',
            text: 'Your task was successfully removed',
            showTime: 3,
          });
        })
        .catch(() => {
          $(document).notification('clean');
          $(document).notification({
            type: 'error',
            text: 'Unable to remove task. Try again later',
          });
        });
      eventBus.post('render-page');
    });

    eventBus.subscribe('order-tasks', category => {
      this.model.orderTasks(category);
    });

    eventBus.subscribe('toggle-remove-tasks-mode', () => {
      this.view.renderDeleteMode();
    });

    eventBus.subscribe('edit-task', id => {
      eventBus.post('open-modal-window', this.model.getTaskById(id));
    });

    eventBus.subscribe('start-task', id => {
      this.model.changeTaskStatus(id, 'ACTIVE');
      this.model.saveTaskToStorage(id);
      router.navigate('/timer');
    });

    eventBus.subscribe('end-task-working', activeTask => {
      if (activeTask.status === 'COMPLETED') {
        eventBus.post('render-page');
      } else {
        this.model.changeTaskStatus(activeTask.id, 'DAILY_LIST');
      }
    });
  }

  /**
   * @description inits task-list component
   * @memberof TaskCollectionController
   */
  async init() {
    try {
      if (this.model.isNewUser()) {
        this.view.renderFirstPage(this.model.taskListTemplateData);
        eventBus.post('pageLoaded');
      } else {
        this.view.renderTaskListContainer(this.model.taskListTemplateData);
        await this.model.getAndSaveTaskListCollection();
        eventBus.post('pageLoaded');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
