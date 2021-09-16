/**
 * @description gets amount of pomodoros and returns template for them
 * @exports
 * @param {string} amountOfPomodoros
 * @return {string} template for pomodoros
 */
export default function (amountOfPomodoros) {
  if (!amountOfPomodoros || !parseInt(amountOfPomodoros, 10)) return '';
  let fragment = '';

  for (let i = 0; i < parseInt(amountOfPomodoros, 10); i++) {
    fragment += '<div class="main__task-info__icon"></div>';
  }

  return fragment;
}
