import { Utils } from '../../../helpers/utils';
import { SettingsObserver } from './settingsObserver';

/**
 * @description manages settings' data
 * @exports SettingsModel
 * @class SettingsModel
 */
export class SettingsModel {
  /**
   * @description Creates an instance of SettingsModel
   * @param {object} dataService instance of SettingsModel
   * @memberof SettingsModel
   */
  constructor(dataService) {
    this.dataService = dataService;
    this.buttonsValuesChangedEvent = new SettingsObserver();
    this.buttonsValues = null;
    this.cycleCount = 2;
    this.minutesInSchedule = 30;
    this.settingsData = () => this.getAllSettingsData();
  }

  /**
   * @description gets and saves data
   * @memberof SettingsModel
   */
  getAndSaveDataFromStorage() {
    const dataFromStorage = JSON.parse(sessionStorage.getItem('settings'));
    this.buttonsValues = Utils.sortObjectByKeys(dataFromStorage);
  }

  /**
   * @description gets data for current settings' shedule state
   * @return {object} data for rendering schedule
   * @memberof SettingsModel
   */
  getAllSettingsData() {
    const settingsData = {
      buttonsValues: this.buttonsValues,
      cycleCount: this.cycleCount,
      minutesInSchedule: this.minutesInSchedule,
      fullCycleTime: this.getFullCycleTime(),
      firstCycleTime: this.getFirstCycleTime(),
      secondCycleTime:
        this.getFullCycleTime().full - this.getFirstCycleTime().full,
      timeScheduleDelimeter:
        this.getFullCycleTime().full % this.minutesInSchedule,
    };

    return settingsData;
  }

  /**
   * @description saves data and emits 'buttonsValuesChangedEvent' event
   * @param {object} data settings' data
   * @memberof SettingsModel
   */
  saveSettingsData(data) {
    sessionStorage.setItem('settings', JSON.stringify(data));
    this.buttonsValuesChangedEvent.notify(this.settingsData());
  }

  /**
   * @description calculates time for settings' shedule
   * @return {object} full time for shedule
   * @memberof SettingsModel
   */
  getFullCycleTime() {
    const MINUTES_IN_HOUR = 60;
    const data = this.buttonsValues;

    const fullTime =
      (data.work.value * data.iteration.value +
        data.shortBreak.value * (data.iteration.value - 1)) *
        this.cycleCount +
      data.longBreak.value * (this.cycleCount - 1);

    const fullTimeHours = Math.floor(fullTime / MINUTES_IN_HOUR);
    const fullTimeMinutes = Math.floor(fullTime % MINUTES_IN_HOUR);

    return {
      full: fullTime,
      hours: fullTimeHours,
      minutes: fullTimeMinutes,
    };
  }

  /**
   * @description calculates time for settings' first cycle shedule
   * @return {object} first Cycle Time for shedule
   * @memberof SettingsModel
   */
  getFirstCycleTime() {
    const MINUTES_IN_HOUR = 60;
    const data = this.buttonsValues;

    const firstCycleTime =
      data.work.value * data.iteration.value +
      data.shortBreak.value * (data.iteration.value - 1) +
      data.longBreak.value;

    const firstCycleTimeHours = Math.floor(firstCycleTime / MINUTES_IN_HOUR);
    const firstCycleTimeMinutes = Math.floor(firstCycleTime % MINUTES_IN_HOUR);

    return {
      full: firstCycleTime,
      hours: firstCycleTimeHours,
      minutes: firstCycleTimeMinutes,
    };
  }

  /**
   * @description increases button's value
   * @param {object} args id of button and current button's value
   * @memberof SettingsModel
   */
  increaseValue(args) {
    if (!Array.isArray(args)) return;
    const [id, currentValue] = args;
    if (
      !id ||
      typeof id !== 'string' ||
      !currentValue ||
      typeof currentValue !== 'number'
    ) {
      return;
    }
    const newValue = currentValue + this.buttonsValues[id].step;
    this.setValue(id, newValue);
  }

  /**
   * @description decreases button's value
   * @param {object} args id of button and current button's value
   * @memberof SettingsModel
   */
  decreaseValue(args) {
    if (!Array.isArray(args)) return;
    const [id, currentValue] = args;
    if (
      !id ||
      typeof id !== 'string' ||
      !currentValue ||
      typeof currentValue !== 'number'
    ) {
      return;
    }
    const newValue = currentValue - this.buttonsValues[id].step;
    this.setValue(id, newValue);
  }
  /**
   * @description sets button's value
   * @param {number} id button's id
   * @param {number} newValue new button's value
   * @memberof SettingsModel
   */
  setValue(id, newValue) {
    if (typeof id !== 'string' || typeof newValue !== 'number') return;
    if (
      newValue >= this.buttonsValues[id].min &&
      newValue <= this.buttonsValues[id].max
    ) {
      this.buttonsValues[id].value = newValue;
      this.saveSettingsData(this.buttonsValues);
    }
  }

  /**
   * @description sets default buttons' values
   * @memberof SettingsModel
   */
  setDefaultButtonsValues() {
    for (const [key] of Object.entries(this.buttonsValues)) {
      this.setValue(key, this.buttonsValues[key].default);
    }
  }
}
