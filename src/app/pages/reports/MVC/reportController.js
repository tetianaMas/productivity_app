import { eventBus } from '../../../services/eventBus';

/**
 * @description controls events on report component
 * @exports ReportController
 * @class ReportController
 */
export class ReportController {
  /**
   * @description Creates an instance of ReportController
   * @param {*} model instance of ReportModel
   * @param {*} view instance of ReportView
   * @memberof ReportController
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;

    eventBus.subscribe('day-tasks-reports-loading', async () => {
      try {
        await this.model.createPage('tasks', 'day');
        eventBus.post('pageLoaded');
      } catch (err) {
        console.error(err.message);
      }
    });

    eventBus.subscribe('day-pomodoros-reports-loading', async () => {
      try {
        await this.model.createPage('pomodoros', 'day');
        eventBus.post('pageLoaded');
      } catch (err) {
        console.error(err.message);
      }
    });

    eventBus.subscribe('week-tasks-reports-loading', async () => {
      try {
        await this.model.createPage('tasks', 'week');
        eventBus.post('pageLoaded');
      } catch (err) {
        console.error(err.message);
      }
    });
    eventBus.subscribe('week-pomodoros-reports-loading', async () => {
      try {
        await this.model.createPage('pomodoros', 'week');
        eventBus.post('pageLoaded');
      } catch (err) {
        console.error(err.message);
      }
    });
    eventBus.subscribe('month-tasks-reports-loading', async () => {
      try {
        await this.model.createPage('tasks', 'month');
        eventBus.post('pageLoaded');
      } catch (err) {
        console.error(err.message);
      }
    });
    eventBus.subscribe('month-pomodoros-reports-loading', async () => {
      try {
        await this.model.createPage('pomodoros', 'month');
        eventBus.post('pageLoaded');
      } catch (err) {
        console.error(err.message);
      }
    });
  }
}
