/**
 * @description model of task
 * @exports TaskModel
 * @class TaskModel
 */
export class TaskModel {
  /**
   * @description Creates an instance of TaskModel
   * @param {object} options task options
   * @memberof TaskModel
   */
  constructor(options) {
    this.id = options.id;
    this.title = options.title;
    this.description = options.description;
    this.createDate = options.createDate;
    this.deadlineDate = options.deadlineDate;
    this.failedPomodoros = options.failedPomodoros;
    this.completeDate = options.completeDate;
    this.completedCount = options.completedCount;
    this.priority = options.priority;
    this.categoryId = options.categoryId;
    this.status = options.status;
    this.estimation = options.estimation;
    this.deadline = options.deadline;
    this.options = options;
  }
}
