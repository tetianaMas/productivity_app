/**
 * @description subsidiary funcs for components
 * @exports Utils
 * @class Utils
 */
export class Utils {
  /**
   * @description checks if it is a new user (e.t. first opening of app)
   * @return {undefined}
   * @memberof Utils
   */
  static toggleFirstSession() {
    const flag = JSON.parse(sessionStorage.getItem('isNewUser'));

    if (flag === null) {
      sessionStorage.setItem('isNewUser', true);
    } else if (!flag) {
      return;
    } else {
      sessionStorage.setItem('isNewUser', false);
    }
  }
  /**
   * @description transforms date into format 'MM-dd-YY'
   * @param {object} date current date
   * @return {string} date in format 'MM-dd-YY'
   * @memberof Utils
   */
  static getCurrentDate(date) {
    let currentDate;
    date ? (currentDate = new Date(date)) : (currentDate = new Date());

    const newDate = `${
      currentDate.getMonth() < 10
        ? '0' + (currentDate.getMonth() + 1)
        : currentDate.getMonth() + 1
    }-${
      currentDate.getDate() < 10
        ? '0' + currentDate.getDate()
        : currentDate.getDate()
    }-${currentDate
      .getFullYear()
      .toString()
      .replace(/^\d{2}/, '')}`;

    return newDate;
  }

  /**
   * @description creates object for tasks
   * @return {object} empty with task categories
   * @memberof Utils
   */
  static createCategoriesObj() {
    const taskCategoriesProto = {
      work: {},
      education: {},
      hobby: {},
      sport: {},
      other: {},
    };

    return taskCategoriesProto;
  }

  /**
   * @description sorts object in special key order
   * for rendering buttons template in settings component
   * @param {object} obj
   * @return {object} ordered object
   * @memberof Utils
   */
  static sortObjectByKeys(obj) {
    const ordered = {};
    const keysOrder = ['work', 'iteration', 'shortBreak', 'longBreak'];

    keysOrder.forEach(item => {
      Object.keys(obj).forEach(key => {
        if (key === item) {
          ordered[key] = obj[key];
        }
      });
    });

    return ordered;
  }

  /**
   * @description returns list of weekdays
   * @return {object}
   * @memberof Utils
   */
  static getWeekDays() {
    const DAYS_IN_WEEK = 7;
    const MILLISECONDS_IN_DAY = 86400000;
    const weekDaysList = [];
    const currentDate = new Date();
    let currentTime = currentDate.getTime();
    const options = {
      weekday: 'short',
    };

    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      weekDaysList.push(
        Intl.DateTimeFormat('en-US', options).format(currentDate)
      );
      currentTime -= MILLISECONDS_IN_DAY;
      currentDate.setTime(currentTime);
    }

    return weekDaysList.reverse();
  }

  /**
   * @description returns list of month days
   * @return {object}
   * @memberof Utils
   */
  static getMonthDays() {
    const DAYS_IN_MONTH = 30;
    const monthDaysList = [];

    for (let i = 1; i <= DAYS_IN_MONTH; i++) {
      monthDaysList.push(i);
    }

    return monthDaysList;
  }

  /**
   * @description returns current week day by date
   * @param {object} date
   * @return {string} week day
   * @memberof Utils
   */
  static getCurrentWeekDayByDate(date) {
    const currentDate = Utils.getNumberDate(date);
    if (!currentDate) {
      return;
    }
    const options = {
      weekday: 'short',
    };

    return Intl.DateTimeFormat('en-US', options).format(currentDate);
  }

  /**
   * @description returns day index by date
   * @param {string} date
   * @return {number} index from 30 to 1
   * @memberof Utils
   */
  static getCurrentMonthDayByDate(date) {
    const currentDayDate = Utils.getNumberDate(date);
    if (!currentDayDate) {
      return;
    }
    const currentDate = new Date();
    const MILLISECONDS_IN_DAY = 86400000;
    const DAYS_IN_MONTH = 30;
    let currentDayIndex = 30;

    const difference = currentDate.getTime() - currentDayDate.getTime();

    if (difference > MILLISECONDS_IN_DAY) {
      currentDayIndex =
        DAYS_IN_MONTH - Math.floor(difference / MILLISECONDS_IN_DAY);
    }

    return currentDayIndex;
  }

  /**
   * @description returns new date object from string in format 'MM-dd-YY'
   * @param {string} date string in format 'MM-dd-YY'
   * @return {object} date object or error if no data was passed
   *  or argument does not match format
   * @memberof Utils
   */
  static getNumberDate(date) {
    if (!date || date.length !== 8) {
      return;
    }
    const year = parseInt(date.substring(6), 10) + 2000;
    const month = parseInt(date.substring(0, 3), 10) - 1;
    const day = parseInt(date.substring(3, 5), 10);
    const result = new Date(year, month, day);

    if (result.getTime()) {
      return result;
    }
  }
}
