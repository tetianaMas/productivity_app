/**
 * @description manages page title according to current route
 * @exports pageTitle
 * @return {string} name of page according to current route
 */
export default function () {
  const pageTitles = {
    default: 'daily task list',
    'task-list': 'daily task list',
    settings: 'settings',
    reports: 'report',
    timer: ' ',
  };
  const pageHash = `${window.location.hash}/`.match(/^#\/(.*?)\//);

  if (pageHash) {
    const pageTitle = pageTitles[pageHash[1]];

    if (pageTitle) {
      return pageTitle;
    }
  }

  return pageTitles.default;
}
