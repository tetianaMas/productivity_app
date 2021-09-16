import firebase from 'firebase/app';
import 'firebase/database';
import { firebaseConfig } from './fireBaseCredentials';

/**
 * @description manages db connections
 * @class DataBase
 */
class DataBase {
  /**
   * @description Creates an instance of DataBase
   * @param {object} db firebase instance
   * @memberof DataBase
   */
  constructor(db) {
    if (this.exists) {
      return this.instance;
    }
    this.db = db.database();
    this.instance = this;
    this.exists = true;
  }

  /**
   * @description recieves data from firebase
   * @param {string} key for db
   * @return {object} promise which resolves with result
   * @memberof DataBase
   */
  receiveData(key) {
    return new Promise((resolve, reject) => {
      const ref = this.db.ref(key).orderByKey();
      ref.once(
        'value',
        snapshot => {
          let result = [];
          this.data = snapshot.val();

          snapshot.forEach(childSnapshot => {
            if (childSnapshot.exists()) {
              result.push(childSnapshot.val());
            }
          });
          resolve(result);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  /**
   * @description removes data from firebase
   * @param {string} key removes data by this key
   * @param {object} ids to remove
   * @memberof DataBase
   */
  removeItem(key, ids) {
    return new Promise((resolve, reject) => {
      const ref = this.db.ref(key);
      ref
        .once('value')
        .then(() => {
          ids.forEach(id => {
            this.db.ref(`${key}/${id}`).remove();
          });
          resolve(true);
        })
        .catch(error => reject(error));
    });
  }

  /**
   * @description sends data to firebase
   * @param {string} key sets data by this key
   * @param {object} data to send
   * @param {string} id
   * @memberof DataBase
   */
  async sendData(key, data, id) {
    try {
      if (id) {
        await this.db.ref(`${key}/${id}`).set(data);
      } else {
        await this.db.ref(key).set(data);
      }

      return true;
    } catch (err) {
      console.error(err);
    }
  }
}

/** @type {object}
 * @exports firebaseDb
 */
export const firebaseDb = new DataBase(firebase.initializeApp(firebaseConfig));
