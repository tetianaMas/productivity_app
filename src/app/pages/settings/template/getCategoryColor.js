/**
 * @description creates category css class name for button
 * @exports getCategoryColor
 * @param {string} key current button id
 * @return {string} button category for css class
 */
export default function (key) {
  switch (key) {
    case 'work':
      return 'work';

    case 'iteration':
      return 'other';

    case 'shortBreak':
      return 'education';

    case 'longBreak':
      return 'hobby';

    default:
      return '';
  }
}
