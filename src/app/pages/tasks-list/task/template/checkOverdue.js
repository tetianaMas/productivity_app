import { Utils } from '../../../../helpers/utils';

/**
 * @description returns css class to mark overdue deadline
 * based on current date
 * @exports
 * @param {object} date current task date
 * @return {string} css class
 */
export default function (date) {
  const currentTaskDate = new Date(date);
  const currentDate = new Date();
  if (Utils.getCurrentDate() === Utils.getCurrentDate(date)) {
    return '';
  }

  if (currentTaskDate - currentDate < 0) {
    return 'task__deadline--overdue';
  } else {
    return '';
  }
}
