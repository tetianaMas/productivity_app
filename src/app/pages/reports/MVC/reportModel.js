import { eventBus } from '../../../services/eventBus';
import { Utils } from '../../../helpers/utils';

/**
 * @description controls reports data
 * @exports ReportModel
 * @class ReportModel
 */
export class ReportModel {
  /**
   * @description Creates an instance of ReportModel
   * @param {object} dataService an instance of dataService
   * @param {object} Observer instance of ReportObserver
   * @memberof ReportModel
   */
  constructor(dataService, Observer) {
    this.dataService = dataService;
    this.dataTabs = {
      additionalClasses: 'tab--center js-tab-top',
      firstVal: 'day',
      firstValAttr: 'data-reports-period="day"',
      secondVal: 'week',
      secondValAttr: 'data-reports-period="week"',
      thirdVal: 'month',
      thirdValAttr: 'data-reports-period="month"',
      period: true,
      bottomTabs: {
        additionalClasses: 'tab--center tab--bottom js-tab-bottom',
        firstVal: 'pomodoros',
        firstValAttr: 'data-reports-category="pomodoros"',
        secondVal: 'tasks',
        secondValAttr: 'data-reports-category="tasks"',
        secondValActive: true,
      },
    };
    this.periods = {
      day: 1,
      week: 7,
      month: 30,
    };
    this.categories = {
      pomodoros: this.createDataPomodoros.bind(this),
      tasks: this.createDataTasks.bind(this),
    };

    this.tasksByCurrentPeriod = null;

    this.renderPageContainerEvent = new Observer();
    this.dataReadyEvent = new Observer();
  }

  /**
   * @description renders page
   * @param {string} category report category
   * @param {string} period report period
   * @memberof ReportModel
   */
  async createPage(category, period) {
    try {
      this.renderPageContainerEvent.notify(this.dataTabs);
      await this.getAndSaveData('tasks');

      const currentPeriod = this.periods[period];

      if (
        typeof category === 'string' &&
        typeof period === 'string' &&
        currentPeriod
      ) {
        this.createReport(category, currentPeriod, period);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * @description receives and saves data for reports
   * @param {string} key key for receiving data from firebase
   * @memberof ReportModel
   */
  async getAndSaveData(key) {
    try {
      this.tasks = await this.dataService.receiveData(key);
    } catch (err) {
      console.error(err.message);
    }
  }

  /**
   * @description creates report from completed tasks
   * @param {string} category report category
   * @param {number} periodMeasure report category
   * @param {string} period report period
   * @memberof ReportModel
   */
  createReport(category, periodMeasure, period) {
    const completedTasks = this.tasks.filter(
      task => task.status === 'COMPLETED'
    );

    if (
      Array.isArray(completedTasks) &&
      completedTasks.length &&
      periodMeasure &&
      typeof periodMeasure === 'number' &&
      period
    ) {
      const tasksByCurrentPeriod = this.sortReportsByPeriod(
        completedTasks,
        periodMeasure
      );
      this.createReportsData(category, tasksByCurrentPeriod, period);
    }
  }

  /**
   * @description sorts all completed tasks by date
   * @param {object} completedTasks all completed tasks
   * @param {number} daysInReport number of days in current report
   * @return {object} sorted tasks
   * @memberof ReportModel
   */
  sortReportsByPeriod(completedTasks, daysInReport) {
    if (
      !Array.isArray(completedTasks) ||
      !completedTasks.length ||
      !daysInReport ||
      typeof daysInReport !== 'number'
    ) {
      return;
    }
    let tasksByCurrentPeriod;

    if (daysInReport > 1) {
      const MILLISECONDS_IN_DAY = 86400000;
      const fullTimeReport = daysInReport * MILLISECONDS_IN_DAY;
      const currentDateMilliseconds = new Date().getTime();
      const lastDayInPeriod = currentDateMilliseconds - fullTimeReport;

      tasksByCurrentPeriod = completedTasks.filter(
        task =>
          Utils.getNumberDate(task.completeDate).getTime() > lastDayInPeriod
      );
    } else {
      const currentDateString = new Date();

      tasksByCurrentPeriod = completedTasks.filter(
        task =>
          Utils.getNumberDate(task.completeDate).getDate() ===
          currentDateString.getDate()
      );
    }

    return tasksByCurrentPeriod.sort(
      (a, b) =>
        Utils.getNumberDate(a.completeDate).getTime() -
        Utils.getNumberDate(b.completeDate).getTime()
    );
  }

  /**
   * @description creates data for render, emits event for rendering
   * @param {string} category current category
   * @param {object} tasks sorted completed tasks
   * @param {number} period current period
   * @memberof ReportModel
   */
  createReportsData(category, tasks, period) {
    const dataForRender = this.categories[category](tasks);
    eventBus.post('create-report', [dataForRender, period]);
  }

  /**
   * @description creates report by pomodoros
   * @param {object} tasks sorted completed tasks
   * @return {object} object for rendering
   * @memberof ReportModel
   */
  createDataPomodoros(tasks) {
    if (!Array.isArray(tasks) || !tasks.length) {
      return;
    }
    const tasksToRender = {};

    tasks.forEach(function (task) {
      if (!tasksToRender[task.completeDate]) {
        const dataByOneDay = {
          date: task.completeDate,
          urgent: 0,
          high: 0,
          middle: 0,
          low: 0,
          failed: 0,
        };
        if (task.completedCount) {
          dataByOneDay[task.priority] += task.completedCount.length;
        }
        if (task.failedPomodoros) {
          dataByOneDay.failed += task.failedPomodoros.length;
        }
        tasksToRender[task.completeDate] = dataByOneDay;
      } else {
        if (task.completedCount) {
          tasksToRender[task.completeDate][task.priority] +=
            task.completedCount.length;
        }
        if (task.failedPomodoros) {
          tasksToRender[task.completeDate].failed +=
            task.failedPomodoros.length;
        }
      }
    });

    return Object.keys(tasksToRender).map(item => tasksToRender[item]);
  }

  /**
   * @description creates report by tasks
   * @param {object} tasks sorted completed tasks
   * @return {object} object for rendering
   * @memberof ReportModel
   */
  createDataTasks(tasks) {
    if (!Array.isArray(tasks) || !tasks.length) {
      return;
    }
    const tasksToRender = {};
    const isSuccessfullTask = this.isSuccessfullTask.bind(this);

    tasks.forEach(function (task) {
      if (isSuccessfullTask(task)) {
        if (!tasksToRender[task.completeDate]) {
          const dataByOneDay = {
            date: task.completeDate,
            urgent: 0,
            high: 0,
            middle: 0,
            low: 0,
            failed: 0,
          };
          dataByOneDay[task.priority]++;
          tasksToRender[task.completeDate] = dataByOneDay;
        } else {
          tasksToRender[task.completeDate][task.priority]++;
        }
      } else {
        if (!tasksToRender[task.completeDate]) {
          const dataByOneDay = {
            date: task.completeDate,
            urgent: 0,
            high: 0,
            middle: 0,
            low: 0,
            failed: 0,
          };
          dataByOneDay.failed++;
          tasksToRender[task.completeDate] = dataByOneDay;
        } else {
          tasksToRender[task.completeDate].failed++;
        }
      }
    });

    return Object.keys(tasksToRender).map(item => tasksToRender[item]);
  }

  /**
   * @description checks successful task
   * @param {object} task task to check
   * @return {boolean} true if successful
   * @memberof ReportModel
   */
  isSuccessfullTask(task) {
    if (!task || typeof task !== 'object') {
      return;
    }
    const failedPomodoros = task.failedPomodoros || [];
    const completedPomodoros = task.completedCount || [];

    return failedPomodoros.length <= completedPomodoros.length;
  }
}
