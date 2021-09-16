import { eventBus } from './services/eventBus';
import { Utils } from './helpers/utils';
import { Router } from './router';

/** @type {object}
 * @exports routes
 */
export const routes = [
  {
    path: /task-list/,
    callback: () => {
      Utils.toggleFirstSession();
      eventBus.post('task-list-loading');
    },
  },
  {
    path: /settings\/pomodoros/,
    callback: () => {
      Utils.toggleFirstSession();
      eventBus.post('settings-page-loading');
    },
  },
  {
    path: /settings\/categories/,
    callback: () => {
      Utils.toggleFirstSession();
      eventBus.post('settings-page-category-loading');
    },
  },
  {
    path: /timer/,
    callback: () => {
      Utils.toggleFirstSession();
      eventBus.post('timer-loading');
    },
  },
  {
    path: /reports\/day\/tasks/,
    callback: () => {
      Utils.toggleFirstSession();
      eventBus.post('day-tasks-reports-loading');
    },
  },
  {
    path: /reports\/day\/pomodoros/,
    callback: () => {
      Utils.toggleFirstSession();
      eventBus.post('day-pomodoros-reports-loading');
    },
  },
  {
    path: /reports\/week\/tasks/,
    callback: () => {
      Utils.toggleFirstSession();
      eventBus.post('week-tasks-reports-loading');
    },
  },
  {
    path: /reports\/week\/pomodoros/,
    callback: () => {
      Utils.toggleFirstSession();
      eventBus.post('week-pomodoros-reports-loading');
    },
  },
  {
    path: /reports\/month\/tasks/,
    callback: () => {
      Utils.toggleFirstSession();
      eventBus.post('month-tasks-reports-loading');
    },
  },
  {
    path: /reports\/month\/pomodoros/,
    callback: () => {
      Utils.toggleFirstSession();
      eventBus.post('month-pomodoros-reports-loading');
    },
  },
];

export const router = new Router({
  root: '/task-list',
  mode: 'hash',
  routes,
});
