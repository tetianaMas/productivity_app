/**
 * @description creates title for button
 * @exports createBtnTitle
 * @param {string} key current button id
 * @return {string} button title
 */
export default function (key) {
  switch (key) {
    case 'work':
      return 'work time';

    case 'iteration':
      return 'work iteration';

    case 'shortBreak':
      return 'short break';

    case 'longBreak':
      return 'long break';

    default:
      return '';
  }
}
