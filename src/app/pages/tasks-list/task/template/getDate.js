/**
 * @description returns deadline date
 * @exports getDate
 * @param {string} date current date
 * @param {string} type day or month
 * @return {string} date
 */
export default function (date, type) {
  const today = $.datepicker.formatDate('mm-dd-y', new Date());
  if (today === date && type === 'month') {
    return 'today';
  }
  if (type === 'day' && today !== date) {
    return $.datepicker.formatDate('dd', new Date(date));
  }
  if (type === 'month' && today !== date) {
    return $.datepicker.formatDate('MM', new Date(date));
  }
}
