/**
 * @description manages tab view
 * @exports TabView
 * @class TabView
 */
export class TabView {
  /**
   * @description adds click events to tabs` buttons
   * @memberof TabView
   */
  addTabEvents() {
    const tabs = [...document.querySelectorAll('.js-tablink')];

    tabs.forEach(tab => {
      tab.addEventListener('click', e => this.toggleActiveState(e.target));
    });
  }

  /**
   * @description toggles active state of tabs` buttons
   * @param {object} elem current element which fires event
   * @memberof TabView
   */
  toggleActiveState(elem) {
    const tabs = [...elem.parentElement.querySelectorAll('.js-tablink')];

    tabs.forEach(tab => {
      if (tab && tab.classList) {
        tab.classList.remove('tab__btn--active');
      }
    });

    elem.classList.add('tab__btn--active');
  }
}
