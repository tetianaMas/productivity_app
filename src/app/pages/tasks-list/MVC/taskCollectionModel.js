import '../../../services/polyfills.js';
import { customAlphabet } from 'nanoid';
import { TaskModel } from '../task/taskModel';
import { TaskCollectionObserver } from './taskCollectionObserver';
import { Utils } from '../../../helpers/utils';

/**
 * @description manages task-list data
 * @exports TaskCollectionModel
 * @class TaskCollectionModel
 */
export class TaskCollectionModel {
  /**
   * @description Creates an instance of TaskCollectionModel.
   * @param {*} dataService instance of DataService
   * @memberof TaskCollectionModel
   */
  constructor(dataService) {
    this.dataService = dataService;
    this.taskListCollection = [];
    this.taskListTemplateData = {
      deleteBtn: true,
      button: true,
      tab: {
        firstVal: 'to do',
        secondVal: 'done',
        selectTabs: true,
        activeTab: true,
      },
      buttonAddTask: true,
    };
    this.orderTasksEvent = new TaskCollectionObserver();
    this.taskListChangedEvent = new TaskCollectionObserver();
    this.renderTasksDonePageEvent = new TaskCollectionObserver();
    this.renderNoTasksLeftPageEvent = new TaskCollectionObserver();
    this.renderAddFirstTaskPageEvent = new TaskCollectionObserver();
    this.renderEmptyDailyTasks = new TaskCollectionObserver();
  }

  /**
   * @description gets item from session storage and returns it
   * @return {boolean} true if it's a first opening of app
   * @memberof TaskCollectionModel
   */
  isNewUser() {
    return JSON.parse(sessionStorage.getItem('isNewUser'));
  }

  /**
   * @description saves tasks from firebase
   * @memberof TaskCollectionModel
   */
  async getAndSaveTaskListCollection() {
    let data = await this.dataService.receiveData('tasks');
    if (Array.isArray(data) && data.length) {
      data = data.filter(item => !!item);
      this.taskListCollection = data;

      this.createTaskListCollection();
    } else {
      this.renderAddFirstTaskPageEvent.notify();
    }
  }

  /**
   * @description filters tasks and emits render
   * @memberof TaskCollectionModel
   */
  createTaskListCollection() {
    this.globalTasksActive = this.taskListCollection.filter(
      task => task.status === 'GLOBAL_LIST' && !task.completeDate
    );
    this.globalTasksCompleted = this.taskListCollection.filter(
      task =>
        task.status === 'COMPLETED' &&
        task.completeDate !== Utils.getCurrentDate()
    );

    this.dailyTasksActive = this.taskListCollection
      .filter(task => task.status === 'DAILY_LIST' && !task.completeDate)
      .sort((a, b) => a.createDate.fullDeadline - b.createDate.fullDeadline);

    this.dailyTasksCompleted = this.taskListCollection
      .filter(
        task =>
          task.status === 'COMPLETED' &&
          task.completeDate === Utils.getCurrentDate()
      )
      .sort((a, b) => a.createDate.fullDeadline - b.createDate.fullDeadline);

    if (this.globalTasksActive.length) {
      this.globalTasksActiveCategories = this.createCategories(
        this.globalTasksActive,
        Utils.createCategoriesObj()
      );
    } else {
      this.globalTasksActiveCategories = null;
    }

    if (this.globalTasksCompleted.length) {
      this.globalTasksCompletedCategories = this.createCategories(
        this.globalTasksCompleted,
        Utils.createCategoriesObj()
      );
    } else {
      this.globalTasksCompleted = null;
    }

    this.tasksCollection = {
      dailyActive: this.dailyTasksActive,
      dailyCompleted: this.dailyTasksCompleted,
      globalActive: this.globalTasksActiveCategories,
      globalCompleted: this.globalTasksCompletedCategories,
    };

    if (!this.checkLeftTasks()) {
      this.taskListChangedEvent.notify(this.tasksCollection);
    }
  }

  /**
   * @description creates data for render
   * @param {object} data tasks
   * @param {object} objectPrototype empty object to fill with tasks
   * @return {object} tasks data for render
   * @memberof TaskCollectionModel
   */
  createCategories(data, objectPrototype) {
    if (
      !Array.isArray(data) ||
      !data.length ||
      typeof objectPrototype !== 'object'
    ) {
      return;
    }

    for (const [key] of Object.entries(objectPrototype)) {
      objectPrototype[key].tasks = data
        .filter(item => item.categoryId === key)
        .sort((a, b) => a.createDate.fullDeadline - b.createDate.fullDeadline);
      objectPrototype[key].title = key;
    }

    return objectPrototype;
  }

  /**
   * @description creates and saves new task
   * @param {object} options task data
   * @memberof TaskCollectionModel
   */
  createTask(options) {
    if (typeof options !== 'object') return;
    const nanoid = customAlphabet('0123456789', 20);

    options.status = 'GLOBAL_LIST';
    options.createDate = this.getCurrentDate();
    options.completedCount = [];
    options.failedPomodoros = [];
    options.completeDate = null;
    options.deadlineDate = this.getCurrentDate(options.deadline);
    options.id = nanoid();

    const newTask = new TaskModel(options);

    this.taskListCollection.push(newTask.options);
    this.createTaskListCollection();
    this.sendTaskData('tasks', newTask, options.id);
  }

  /**
   * @description sends task data to firebase
   * @param {string} key to save data
   * @param {object} data to save
   * @param {string} id of task
   * @memberof TaskCollectionModel
   */
  sendTaskData(key, data, id) {
    this.dataService
      .sendData(key, data, id)
      .then(() => {
        $(document).notification('clean');
        $(document).notification({
          type: 'success',
          text: 'Your task was successfully saved',
          showTime: 3,
        });
      })
      .catch(error => {
        $(document).notification('clean');
        $(document).notification({
          type: 'error',
          text: error,
        });
      });
  }

  /**
   * @description creates date object for task
   * @param {string} date of deadline
   * @return {object} deadline date
   * @memberof TaskCollectionModel
   */
  getCurrentDate(date) {
    let currentDate =
      date && typeof date === 'string' ? new Date(date) : new Date();

    const options = {
      month: 'long',
    };

    return {
      fullDeadline: currentDate.getTime(),
      month: Intl.DateTimeFormat('en-US', options).format(currentDate),
      day: currentDate.getDate(),
    };
  }

  /**
   * @description updates task's data
   * @param {object} task to be updated
   * @memberof TaskCollectionModel
   */
  updateTask(task) {
    if (!task) return;
    task.deadlineDate = this.getCurrentDate(task.deadline);

    let oldTask = this.taskListCollection.find(item => item.id === task.id);
    this.taskListCollection.splice(
      this.taskListCollection.indexOf(oldTask),
      1,
      task
    );

    this.createTaskListCollection();
    this.sendTaskData('tasks', task, task.id);
  }

  /**
   * @description sets new status to current task
   * @param {string} id task id
   * @param {string} newStatus status of task
   * @return {object} promise object
   * @memberof TaskCollectionModel
   */
  changeTaskStatus(id, newStatus) {
    if (!id || !newStatus) return;
    const taskToBeChanged = this.taskListCollection.find(
      task => task.id === id
    );
    taskToBeChanged.status = newStatus;

    return this.dataService.sendData('tasks', taskToBeChanged, id);
  }

  /**
   * @description removes tasks by ids and emits render event
   * @param {object} ids of tasks to be removed
   * @return {object} promise object
   * @memberof TaskCollectionModel
   */
  removeTask(ids) {
    if (!Array.isArray(ids)) return;
    const taskIndexesToRemove = [];
    this.taskListCollection.forEach(item => {
      ids.forEach(id => {
        if (item.id === id) {
          taskIndexesToRemove.push(this.taskListCollection.indexOf(item));
        }
      });
    });

    this.taskListCollection = this.taskListCollection.filter(
      (e, i) => taskIndexesToRemove.indexOf(i) < 0
    );

    if (!this.taskListCollection.length) {
      this.renderNoTasksLeftPageEvent.notify();
    } else if (!this.dailyTasksActive.length && this.globalTasksActive.length) {
      this.renderTasksDonePageEvent.notify();
    } else if (
      !this.dailyTasksActive.length &&
      !this.globalTasksActive.length &&
      !this.dailyTasksCompleted.length &&
      !this.globalTasksCompleted.length
    ) {
      this.renderNoTasksLeftPageEvent.notify();
    }

    return this.dataService.removeItem('tasks', ids);
  }

  /**
   * @description checks if there ara tasks left and
   * emits appropriate render event
   * @return {undefined}
   * @memberof TaskCollectionModel
   */
  checkLeftTasks() {
    if (!this.taskListCollection.length) {
      this.renderNoTasksLeftPageEvent.notify();

      return;
    }
    if (!this.dailyTasksActive.length && this.globalTasksActive.length) {
      this.renderEmptyDailyTasks.notify();

      return;
    }
    if (
      !this.dailyTasksActive.length &&
      !this.globalTasksActive.length &&
      !this.dailyTasksCompleted.length &&
      !this.globalTasksCompleted.length
    ) {
      this.renderAddFirstTaskPageEvent.notify();

      return;
    }
    if (!this.dailyTasksActive.length && !this.globalTasksActive.length) {
      this.renderNoTasksLeftPageEvent.notify();

      return;
    }
  }

  /**
   * @description filters tasks in global list
   * @param {string} priority field to filter
   * @return {undefined}
   * @memberof TaskCollectionModel
   */
  orderTasks(priority) {
    if (priority === 'all') {
      this.orderTasksEvent.notify([[], this.globalTasksActive]);
      this.orderTasksEvent.notify([[], this.globalTasksCompleted]);
      return;
    }

    let tasksActive, tasksCompleted;
    if (this.globalTasksActive) {
      tasksActive = this.globalTasksActive.filter(
        task => task.priority !== priority
      );
      this.orderTasksEvent.notify([tasksActive, this.globalTasksActive]);
    }
    if (this.globalTasksCompleted) {
      tasksCompleted = this.globalTasksCompleted.filter(
        task => task.priority !== priority
      );
      this.orderTasksEvent.notify([tasksCompleted, this.globalTasksCompleted]);
    }
  }

  /**
   * @description finds and returns task by id
   * @param {string} id task id
   * @return {task} task with current id
   * @memberof TaskCollectionModel
   */
  getTaskById(id) {
    if (id && typeof id === 'string') {
      return this.taskListCollection.find(task => task.id === id);
    }
  }

  /**
   * @description saves task to session storage
   * @param {string} id task id
   * @memberof TaskCollectionModel
   */
  saveTaskToStorage(id) {
    if (!id) return;
    this.dataService.setDataToStorage('active-task', this.getTaskById(id));
  }
}
