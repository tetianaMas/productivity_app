/**
 * @description returns dimention depending on key
 * @exports getCurrentDimension
 * @param {string} key current button id
 * @return {string} dimention for button
 */
export default function (key) {
  return key === 'iteration' ? 'iterations' : 'minutes';
}
