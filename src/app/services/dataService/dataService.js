import { eventBus } from '../eventBus';
import { firebaseDb } from './dataBase';

/**
 * @description manages db and session storage connections
 * @exports DataService
 * @class DataService
 */
class DataService {
  /**
   * @description Creates an instance of DataService
   * @param {object} base instance of Firebase
   * @memberof DataService
   */
  constructor(base) {
    if (this.exists) {
      return this.instance;
    }
    this.db = base;
    this.instance = this;
    this.exists = true;
    eventBus.subscribe('settings-page-loading', () =>
      this.receiveData('settings')
    );
  }

  /**
   * @description receives data from db
   * @param {string} key
   * @return {object} result
   * @memberof DataService
   */
  async receiveData(key) {
    try {
      const result = await this.db.receiveData(key);

      this.setDataToStorage(key, this.db.data);
      eventBus.post('load-page');

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @description removes items from firebase
   * @param {string} key
   * @param {object} ids ids of tasks' to remove
   * @return {object} promise
   * @memberof DataService
   */
  removeItem(key, ids) {
    return this.db.removeItem(key, ids);
  }

  /**
   * @description sends data to firebase
   * @param {string} key
   * @param {object} data
   * @param {string} id
   * @return {boolean}
   * @memberof DataService
   */
  async sendData(key, data, id) {
    return await this.db.sendData(key, data, id);
  }

  /**
   * @description sets data to session storage
   * @param {string} key
   * @param {*} value
   * @memberof DataService
   */
  setDataToStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * @description receives data from session storage
   * @param {string} key
   * @return {*} data from storage
   * @memberof DataService
   */
  getDataFromStorage(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }
}

export const dataService = new DataService(firebaseDb);
