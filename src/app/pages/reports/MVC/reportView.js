import template from '../templates/reports.hbs';
import { router } from '../../../routes';

/**
 * @description manages view of reports page
 * @exports ReportView
 * @class ReportView
 */
export class ReportView {
  /**
   * @description Creates an instance of ReportView.
   * @param {object} model instance of ReportModel
   * @memberof ReportView
   */
  constructor(model) {
    this.model = model;

    this.model.renderPageContainerEvent.subscribe(this.render.bind(this));
  }

  /**
   * @description renders reports page
   * @param {object} tabsData data for render tabs container
   * @memberof ReportView
   */
  render(tabsData) {
    document.body.innerHTML = template(tabsData);
    const container = document.getElementById('main');

    container.addEventListener('click', () => this.changeCurrentLocation());
  }

  /**
   * @description changes hash depending on the tabs` value
   * @memberof ReportView
   */
  changeCurrentLocation() {
    const topTabs = document.querySelector('.js-tab-top');
    const bottomTabs = document.querySelector('.js-tab-bottom');
    const currentCategory = bottomTabs.querySelector('.tab__btn--active')
      .dataset.reportsCategory;
    const currentPeriod = topTabs.querySelector('.tab__btn--active').dataset
      .reportsPeriod;

    if (currentCategory && currentPeriod) {
      router.navigate(`/reports/${currentPeriod}/${currentCategory}`);
    }
  }
}
