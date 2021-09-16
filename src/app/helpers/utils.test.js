/* eslint-disable no-undef */
import { Utils } from './utils';

test('should return date in format `MM-dd-YY`', () => {
  const date = new Date(2021, 3, 25);
  const result = Utils.getCurrentDate(date.getTime());
  expect(result).toBe('04-25-21');
});

test('should return not valid data', () => {
  const result = Utils.getCurrentDate(null);
  const truthyResult = Utils.getCurrentDate(new Date());

  expect(result).toBe(truthyResult);
});

test('should return empty obj with predefined keys', () => {
  const resultObj = {
    work: {},
    education: {},
    hobby: {},
    sport: {},
    other: {},
  };
  const result = Utils.createCategoriesObj();

  expect(result).toEqual(resultObj);
});

test('should return ordered obj with predefined keys', () => {
  const resultObj = {
    work: {},
    iteration: {},
    shortBreak: {},
    longBreak: {},
  };
  const objToCheck = {
    longBreak: {},
    shortBreak: {},
    iteration: {},
    work: {},
  };
  const result = Utils.sortObjectByKeys(objToCheck);

  expect(result).toEqual(resultObj);
});

test('should return week days from today', () => {
  const today = Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(new Date());

  const result = Utils.getWeekDays();

  expect(result[result.length - 1]).toBe(today);
});

test('should return array with numbers from 1 to 30', () => {
  const result = Utils.getMonthDays();

  expect(result[result.length - 1]).toBe(30);
  expect(result[0]).toBe(1);
  expect(result[15]).toBe(16);
});

test('should return date object in format `MM-dd-YY`', () => {
  const result = Utils.getNumberDate('08-23-21');
  const truthyResult = new Date(2021, 7, 23);
  const falthyResult = new Date();

  expect(result).toStrictEqual(truthyResult);
  expect(result).not.toStrictEqual(falthyResult);
});

test('should return error object', () => {
  const result = Utils.getNumberDate(null);
  const falthyResult = Utils.getNumberDate('Im wrong');

  expect(result).toBe(undefined);
  expect(falthyResult).toBe(undefined);
});

test('should return current day of the week', () => {
  const result = Utils.getCurrentWeekDayByDate('02-02-20');
  const truthyResult = Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(new Date(2020, 1, 2));

  expect(result).toBe(truthyResult);
  expect(result).not.toBe(undefined);
});

test('should return undefined', () => {
  const result = Utils.getCurrentWeekDayByDate(null);

  expect(result).toBe(undefined);
});

test('should return month day by date', () => {
  const result = Utils.getCurrentMonthDayByDate('06-12-21');

  expect(typeof result).toBe('number');
  expect(result).not.toBe(undefined);
});
