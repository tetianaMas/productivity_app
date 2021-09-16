import { eventBus } from '../../../services/eventBus';

/**
 * @description controls timer component
 * @exports TimerController
 * @class TimerController
 */
export class TimerController {
  /**
   * @description Creates an instance of TimerController
   * @param {*} model instance of TimerModel
   * @param {*} view instance of TimerView
   * @memberof TimerController
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;

    eventBus.subscribe('timer-loading', async () => {
      await this.model.init();
      eventBus.post('pageLoaded');
    });

    eventBus.subscribe('return-to-task-list', () => {
      const activeTask = this.model.activeTask;
      eventBus.post('end-task-working', activeTask);
    });

    eventBus.subscribe('raise-estimate', () => {
      this.model.raiseEstimate();
    });

    eventBus.subscribe('finish-pomodoro', isSuccessfullyCompleted => {
      this.model.finishPomodoro(isSuccessfullyCompleted);

      if (this.model.isTaskCompleted()) {
        eventBus.post('finish-task');
      }
    });

    eventBus.subscribe('finish-task', () => {
      this.model.finishTask();
    });
  }
}
