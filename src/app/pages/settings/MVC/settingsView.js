import { router } from '../../../routes';
import { eventBus } from '../../../services/eventBus';

/**
 * @description manages settings' view component
 * @exports SettingsView
 * @class SettingsView
 */
export class SettingsView {
  /**
   * @description Creates an instance of SettingsView
   * @param {function} template hbs template for page
   * @param {function} buttonsTemplate hbs template for buttons
   * @param {function} categoriesTemplate hbs template for categories list
   * @param {object} model instance of SettingsModel
   * @memberof SettingsView
   */
  constructor(template, buttonsTemplate, categoriesTemplate, model) {
    this.template = template;
    this.buttonsTemplate = buttonsTemplate;
    this.categoriesTemplate = categoriesTemplate;
    this.model = model;
    this.model.buttonsValuesChangedEvent.subscribe(
      this.renderDynamicElements.bind(this)
    );

    window.addEventListener('resize', () => {
      const currentRoute = window.location.hash;

      if (/^#\/settings/.test(currentRoute)) {
        eventBus.post('load-page');
      }
    });
  }

  /**
   * @description renders page
   * @param {object} data for rendering
   * @memberof SettingsView
   */
  renderMainPage(data) {
    const context = {
      tab: {
        firstVal: 'pomodoros',
        secondVal: 'categories',
        activeTab: true,
        firstValAttr: 'data-tab="pomodoros"',
        secondValAttr: 'data-tab="categories"',
      },
      data,
    };
    document.body.innerHTML = this.template(context);

    document
      .querySelector('.js-btn-save')
      .addEventListener('click', () => eventBus.post('save-data', 'settings'));

    document
      .querySelector('.js-btn-to-tasks')
      .addEventListener('click', () => router.navigate('/task-list'));

    document
      .querySelector('.js-nav')
      .addEventListener('click', e => this.changeRouter(e));

    eventBus.post('render-dynamic-elements');
  }

  /**
   * @description changes hash depending of active tab
   * @param {object} event click on tab
   * @memberof SettingsView
   */
  changeRouter(event) {
    const tabContainer = event.currentTarget;
    const currentTab = tabContainer.querySelector('.tab__btn--active').dataset
      .tab;

    if (currentTab) {
      router.navigate(`/settings/${currentTab}`);
    }
  }

  /**
   * @description renders category page
   * @memberof SettingsView
   */
  renderCategoryPage() {
    const context = {
      tab: {
        firstVal: 'pomodoros',
        secondVal: 'categories',
        firstValAttr: 'data-tab="pomodoros"',
        secondValAttr: 'data-tab="categories"',
        activeTabSecond: true,
      },
    };
    document.body.innerHTML = this.categoriesTemplate(context);

    document
      .querySelector('.js-nav')
      .addEventListener('click', e => this.changeRouter(e));

    document
      .querySelector('.js-btn-to-tasks')
      .addEventListener('click', () => router.navigate('/task-list'));
  }

  /**
   * @description renders dynamic elements: schedule and buttons values
   * @param {object} data settings' data
   * @memberof SettingsView
   */
  renderDynamicElements(data) {
    document.querySelector('.js-settings').innerHTML = this.buttonsTemplate({
      values: data.buttonsValues,
    });
    document.querySelector('.js-cycle').innerHTML = this.renderCycle(data);
    this.initButtons();
  }

  /**
   * @description creates template for cycle
   * @param {object} data for rendering
   * @return {string} template for rendering
   * @memberof SettingsView
   */
  renderCycle(data) {
    return `<div class="scale__caption scale__caption--top">
      <span class="scale__caption__item scale__caption__item--start">
        <span class="scale__caption__item--value  scale__caption__item--value-border">0m</span>
      </span>

      <span class="scale__caption__item scale__caption__item--long-break" 
      style="flex-grow: ${data.firstCycleTime.full};">
        <span class="scale__caption__item--first-cycle-value">First cycle:&nbsp;<span>
        ${data.firstCycleTime.hours}h ${data.firstCycleTime.minutes}m</span>
        </span>
      </span>

      <span class="scale__caption__item scale__caption__item--end" style="flex-grow: ${
        data.secondCycleTime
      };">
        <span class="scale__caption__item--value scale__caption__item--value-border">
        ${data.fullCycleTime.hours}h ${data.fullCycleTime.minutes}m</span>
        </span>
      </span>
    </div>

    <div class="scale__line">
      ${this.renderScaleLine(data)}
    </div>

    <div class="scale__caption scale__caption--bottom">
      ${this.createTimeLine(data)}
    </div>`;
  }

  /**
   * @description creates scale line for shedule
   * @param {object} data for rendering
   * @return {string} cycle template
   * @memberof SettingsView
   */
  renderScaleLine(data) {
    let workFragment = `<div class="line line--work" 
    style="flex-grow: ${data.buttonsValues.work.value};"></div>`;
    let shortBreakFragment = `<div class="line line--short-break" 
    style="flex-grow: ${data.buttonsValues.shortBreak.value};"></div>`;
    let longBreakFragment = `<div class="line line--long-break" 
    style="flex-grow: ${data.buttonsValues.longBreak.value};"></div>`;

    const firstCycleTemplate = this.createCycleLayout(
      workFragment,
      shortBreakFragment,
      data.buttonsValues.iteration.value
    );
    const fullCycleTemplate = this.createCycleLayout(
      firstCycleTemplate,
      longBreakFragment,
      data.cycleCount
    );

    return fullCycleTemplate;
  }

  /**
   * @description creates template for cycle
   * @param {string} element work time template
   * @param {string} delimiter short break template
   * @param {number} iteration work iterations
   * @return {string} template for cycle
   * @memberof SettingsView
   */
  createCycleLayout(element, delimiter, iteration) {
    let template = '';

    template += element;

    for (let i = 0; i < iteration - 1; i++) {
      template += `${delimiter}${element}`;
    }

    return template;
  }

  /**
   * @description creates timeline template
   * @param {object} info settings ingo
   * @return {string} template for timeline
   * @memberof SettingsView
   */
  createTimeLine(info) {
    let fragment = '';
    const date = new Date();
    date.setHours(0);
    date.setMinutes(info.minutesInSchedule);

    for (
      let i = date.getMinutes();
      i < info.fullCycleTime.full;
      i += info.minutesInSchedule
    ) {
      const scheduleItem = this.createTimeLineBottomItem(date, info);

      fragment += scheduleItem;
      date.setMinutes(date.getMinutes() + info.minutesInSchedule);
    }

    if (info.timeScheduleDelimeter > 0) {
      fragment += `<span style="flex-grow: ${info.timeScheduleDelimeter};">`;
    } else {
      fragment += `<span style="flex-grow: ${info.minutesInSchedule};">`;
    }

    return fragment;
  }

  /**
   * @description creates item for timeline
   * @param {object} date timeline date
   * @param {object} info settings data
   * @return {string} item template
   * @memberof SettingsView
   */
  createTimeLineBottomItem(date, info) {
    return `<span class="scale__caption__item ${
      date.getMinutes() > 0 ? 'scale__caption__item--hidden' : ''
    }" 
    style="flex-grow: ${info.minutesInSchedule};">
      <span class="scale__caption__item--value">
      ${date.getHours() > 0 ? date.getHours() + 'h ' : ''}${
      date.getMinutes() > 0 ? date.getMinutes() + 'm' : ''
    }</span>
    </span>`;
  }

  /**
   * @description sets events to buttons
   * @memberof SettingsView
   */
  initButtons() {
    const buttons = [...document.querySelectorAll('.js-btn')];

    buttons.forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.parentElement.id;
        const currentValue = Number(
          e.target.parentElement.querySelector('.js-btn-value').innerHTML
        );

        if (e.target.classList.contains('js-btn-add')) {
          eventBus.post('increaseValue', [id, currentValue]);
        } else {
          eventBus.post('decreaseValue', [id, currentValue]);
        }
      });
    });
  }
}
