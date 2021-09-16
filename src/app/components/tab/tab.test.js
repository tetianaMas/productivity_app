/* eslint-disable no-undef */
import tabs from './template/tab.hbs';
import checkActiveState from './template/checkActiveState';

describe('tabs rendering', () => {
  test('should render tab', () => {
    const context = {
      firstVal: 'pomodoros',
      secondVal: 'categories',
      activeTab: true,
      firstValAttr: 'data-tab="pomodoros"',
      secondValAttr: 'data-tab="categories"',
    };
    const tree = JSON.stringify(tabs(context));
    expect(tree).toMatchSnapshot();
  });
});

describe('checkActiveState', () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      location: {
        hash: '#/reports/day/tasks',
      },
    }));
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  test('should return active css class', () => {
    const result = checkActiveState('day', 'day');
    expect(result).toBe('tab__btn--active');
  });

  test('should return active css class', () => {
    const result = checkActiveState('', 'tasks');
    expect(result).toBe('tab__btn--active');
  });

  test('should return falsy result', () => {
    const result = checkActiveState('', '');
    expect(result).toBeFalsy();
  });
});
