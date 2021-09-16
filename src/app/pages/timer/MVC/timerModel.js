import { Utils } from '../../../helpers/utils';
/**
 * @description manager timer component data
 * @exports TimerModel
 * @class TimerModel
 */
export class TimerModel {
  /**
   * @description Creates an instance of TimerModel
   * @param {object} dataService instance of DataService
   * @param {object} Observer instance of TimerObserver
   * @memberof TimerModel
   */
  constructor(dataService, Observer) {
    this.dataService = dataService;
    this.timerInitEvent = new Observer();
    this.initBreakEvent = new Observer();
    this.fillPomodoroEvent = new Observer();
    this.estimationChangedEvent = new Observer();
    this.taskCompletedEvent = new Observer();

    this.pomodoroSettings = null;
    this.activeTask = null;
    this.currentPomodoroIndex = 0;
    this.date = Utils.getCurrentDate();
  }

  /**
   * @description inits timer component
   * @memberof TimerModel
   */
  async init() {
    try {
      this.currentPomodoroIndex = 0;
      this.activeTask = this.getDataFromStorage('active-task');
      this.activeTask.failedPomodoros = [];
      this.activeTask.completedCount = [];

      const settings = await this.getAndSaveSettings();
      this.timerInitEvent.notify([this.activeTask, settings]);
    } catch (err) {
      console.error(err.message);
    }
  }

  /**
   * @description saves data from session storage
   * @param {string} key to get a task from session storage
   * @return {object} current task
   * @memberof TimerModel
   */
  getDataFromStorage(key) {
    if (!key || typeof key !== 'string') return;
    const task = this.dataService.getDataFromStorage(key);

    return task;
  }

  /**
   * @description gets and saves current settings
   * @return {object} settings
   * @memberof TimerModel
   */
  async getAndSaveSettings() {
    try {
      await this.dataService.receiveData('settings');
      this.pomodoroSettings = this.dataService.getDataFromStorage('settings');

      return this.pomodoroSettings;
    } catch (err) {
      console.error(err.message);
    }
  }

  /**
   * @description finishes pomodoro and shows notification
   * @param {boolean} isSuccessfullyCompleted true if successful
   * @memberof TimerModel
   */
  finishPomodoro(isSuccessfullyCompleted) {
    const isLongBreak = this.isLongBreak();

    isSuccessfullyCompleted
      ? this.setCompletedPomodoro()
      : this.setFailedPomodoro();

    this.initBreakEvent.notify([
      isSuccessfullyCompleted,
      isLongBreak,
      this.pomodoroSettings,
    ]);

    this.fillPomodoroEvent.notify([
      isSuccessfullyCompleted,
      this.currentPomodoroIndex,
    ]);
    this.raiseIndex();

    this.showFinishPomodoroNotification(false);
  }

  /**
   * @description adds failed pomodoros to current task
   * @memberof TimerModel
   */
  setFailedPomodoro() {
    this.activeTask.failedPomodoros.push(this.currentPomodoroIndex);
  }
  /**
   * @description adds successfully completed pomodoros to current task
   * @memberof TimerModel
   */
  setCompletedPomodoro() {
    this.activeTask.completedCount.push(this.currentPomodoroIndex);
  }

  /**
   * @description checks long break
   * @return {boolean} true if it's a long break
   * @memberof TimerModel
   */
  isLongBreak() {
    return (
      (this.currentPomodoroIndex || 1) %
        this.pomodoroSettings.iteration.value ===
      0
    );
  }

  /**
   * @description raises index of current task
   * @memberof TimerModel
   */
  raiseIndex() {
    this.currentPomodoroIndex++;
  }

  /**
   * @description raises estimation
   * @memberof TimerModel
   */
  raiseEstimate() {
    this.activeTask.estimation++;

    this.estimationChangedEvent.notify();
  }

  /**
   * @description checks task completion
   * @return {boolean} true if task completed
   * @memberof TimerModel
   */
  isTaskCompleted() {
    return (
      this.currentPomodoroIndex === parseInt(this.activeTask.estimation, 10)
    );
  }

  /**
   * @description finishes task, shows notification
   * @memberof TimerModel
   */
  finishTask() {
    this.activeTask.status = 'COMPLETED';
    this.activeTask.completeDate = this.date;
    if (!this.isTaskCompleted()) {
      this.completeAllPomodoros();
    }

    this.taskCompletedEvent.notify();
    this.dataService
      .sendData('tasks', this.activeTask, this.activeTask.id)
      .then(() => {
        this.showFinishPomodoroNotification(this.isLongBreak());
      })
      .catch(() => {
        this.showErrorNotification();
      });
  }

  /**
   * @description shows successful message
   * @param {boolean} isLongBreak
   * @memberof TimerModel
   */
  showFinishPomodoroNotification(isLongBreak) {
    $(document).notification('clean');

    if (isLongBreak) {
      $(document).notification({
        type: 'warning',
        text: 'Long break started, please have a rest!',
        showTime: 3,
      });
    } else {
      $(document).notification({
        type: 'success',
        text: 'You finished pomodoro!',
        showTime: 3,
      });
    }
  }

  /**
   * @description show error timer message
   * @memberof TimerModel
   */
  showErrorNotification() {
    $(document).notification('clean');
    $(document).notification({
      type: 'error',
      text: 'Unable to mark pomodoro/task as completed. Try again later',
      showTime: 3,
    });
  }

  /**
   * @description completes all pomodoros
   * @memberof TimerModel
   */
  completeAllPomodoros() {
    for (
      let i = this.currentPomodoroIndex;
      i < this.activeTask.estimation;
      i++
    ) {
      this.setCompletedPomodoro();
      this.fillPomodoroEvent.notify([true, i]);
      this.raiseIndex();
    }
  }
}
