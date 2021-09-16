/* eslint-disable no-undef */
import { settingsData } from './__mocks__/settingsData';
import { buttonsValues } from './__mocks__/buttonsValues';
import buttonsTemplate from './template/settings-buttons.hbs';
import settingsTemplate from './template/settings.hbs';
import categoriesTemplate from './template/categories.hbs';

import { SettingsModel } from './MVC/settingsModel';
import { dataService } from '../../services/dataService/dataService';
import { allSettingsData } from './__mocks__/allSettingsData';
import { fullCycleTime } from './__mocks__/fullCycleTime';
import { firstCycleTime } from './__mocks__/firstCycleTime';
import createBtnTitle from './template/createBtnTitle';
import getCategoryColor from './template/getCategoryColor';
import getCurrentDimention from './template/getCurrentDimension';

const settingsModel = new SettingsModel(dataService);

describe('rendering', () => {
  test('renders correctly page', () => {
    const tree = JSON.stringify(settingsTemplate(settingsData));
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly buttons', () => {
    const tree = JSON.stringify(buttonsTemplate({ values: buttonsValues }));
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly categories', () => {
    const tree = JSON.stringify(
      categoriesTemplate({
        tab: {
          firstVal: 'pomodoros',
          secondVal: 'categories',
          activeTab: true,
          firstValAttr: 'data-tab="pomodoros"',
          secondValAttr: 'data-tab="categories"',
        },
      })
    );
    expect(tree).toMatchSnapshot();
  });
});

describe('createBtnTitle', () => {
  test('should return right title', () => {
    const res = createBtnTitle('work');
    expect(res).toBe('work time');
  });

  test('should return right title', () => {
    const res = createBtnTitle('iteration');
    expect(res).toBe('work iteration');
  });

  test('should return right title', () => {
    const res = createBtnTitle('shortBreak');
    expect(res).toBe('short break');
  });

  test('should return right title', () => {
    const res = createBtnTitle('longBreak');
    expect(res).toBe('long break');
  });

  test('should return falsy value', () => {
    const res = createBtnTitle('some wrong text');
    expect(res).toBeFalsy();
  });

  test('should return falsy value', () => {
    const res = createBtnTitle(345353464365);
    expect(res).toBeFalsy();
  });

  test('should return falsy value', () => {
    const res = createBtnTitle();
    expect(res).toBeFalsy();
  });
});

describe('getCategoryColor', () => {
  test('should return right category color', () => {
    const res = getCategoryColor('work');
    expect(res).toBe('work');
  });

  test('should return right category color', () => {
    const res = getCategoryColor('iteration');
    expect(res).toBe('other');
  });

  test('should return right category color', () => {
    const res = getCategoryColor('shortBreak');
    expect(res).toBe('education');
  });

  test('should return right category color', () => {
    const res = getCategoryColor('longBreak');
    expect(res).toBe('hobby');
  });

  test('should return falsy value', () => {
    const res = getCategoryColor('some wrong text');
    expect(res).toBeFalsy();
  });

  test('should return falsy value', () => {
    const res = getCategoryColor(345353464365);
    expect(res).toBeFalsy();
  });

  test('should return falsy value', () => {
    const res = getCategoryColor();
    expect(res).toBeFalsy();
  });
});

describe('getCurrentDimention', () => {
  test('should return right dimention', () => {
    const res = getCurrentDimention('iteration');
    expect(res).toBe('iterations');
  });

  test('should return `minutes`', () => {
    const res = getCurrentDimention('some wrong text');
    expect(res).toBe('minutes');
  });

  test('should return `minutes`', () => {
    const res = getCurrentDimention(345353464365);
    expect(res).toBe('minutes');
  });

  test('should return `minutes`', () => {
    const res = getCurrentDimention();
    expect(res).toBe('minutes');
  });
});

describe('getting settings data', () => {
  beforeEach(() => {
    settingsModel.buttonsValues = buttonsValues;
  });
  test('should return settings data', () => {
    const result = settingsModel.getAllSettingsData();
    expect(result).toEqual(allSettingsData);
  });

  test('should return full cycle time data', () => {
    const result = settingsModel.getFullCycleTime();
    expect(result).toEqual(fullCycleTime);
  });

  test('should return first cycle time data', () => {
    const result = settingsModel.getFirstCycleTime();
    expect(result).toEqual(firstCycleTime);
  });
});

describe('increasing/decreasing values', () => {
  beforeEach(() => {
    settingsModel.buttonsValues = buttonsValues;
    spyOn(settingsModel, 'setValue');
  });

  test('should call set button value func', () => {
    settingsModel.increaseValue(['longBreak', 20]);
    expect(settingsModel.setValue).toBeCalled();
    expect(settingsModel.setValue).toHaveBeenCalledTimes(1);
  });

  test('should call set button value func', () => {
    settingsModel.decreaseValue(['shortBreak', 5]);
    expect(settingsModel.setValue).toBeCalled();
    expect(settingsModel.setValue).toHaveBeenCalledTimes(1);
  });

  test('should not call set button value func', () => {
    const result = settingsModel.decreaseValue([3456, 5]);
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });

  test('should not call set button value func', () => {
    const result = settingsModel.decreaseValue([true, false]);
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });

  test('should not call set button value func', () => {
    const result = settingsModel.decreaseValue();
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });

  test('should not call set button value func', () => {
    const result = settingsModel.increaseValue([3456, 5]);
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });

  test('should not call set button value func', () => {
    const result = settingsModel.increaseValue([true, false]);
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });

  test('should not call set button value func', () => {
    const result = settingsModel.increaseValue();
    expect(result).toBeFalsy();
    expect(settingsModel.setValue).not.toBeCalled();
  });
});

describe('setting values', () => {
  beforeEach(() => {
    settingsModel.buttonsValues = buttonsValues;
  });

  test('should set button value', () => {
    const arg = ['work', 25];
    const [id, currentValue] = arg;
    const newValue = currentValue - settingsModel.buttonsValues[id].step;

    settingsModel.setValue(id, newValue);
    expect(settingsModel.buttonsValues[id].value).toBe(newValue);
  });

  test('should not set button value', () => {
    settingsModel.setValue('work', 45);
    expect(settingsModel.buttonsValues['work'].value).toBe(20);
  });

  test('should return falsy value', () => {
    const res = settingsModel.setValue(34, 56);
    expect(res).toBeFalsy();
  });

  test('should return falsy value', () => {
    const res = settingsModel.setValue();
    expect(res).toBeFalsy();
  });
});
