/**
 * @description manages page hash and active css class according to it
 * @exports checkActiveState
 * @param {string} btnValue
 * @return {string} name of css class which represents active state of navigation button
 */
export default function (btnValue) {
  const pageHash = `${window.location.hash}/`.match(/^#\/(.*?)\//);

  if (pageHash && pageHash[1] === btnValue) {
    return 'navigation__btn--active';
  }
}
