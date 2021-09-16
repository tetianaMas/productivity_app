/* eslint-disable no-undef */
import checkActiveState from './template/checkActiveState';
import pageTitle from './template/pageTitle';
import headerTemplate from './template/header.hbs';
import { context } from './__mocks__/headerData';

test('renders correctly', () => {
  const tree = JSON.stringify(headerTemplate(context));
  expect(tree).toMatchSnapshot();
});

describe('handlebars helpers', () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      location: {
        hash: '#/settings',
      },
    }));
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  test('should return active btn css class', () => {
    const result = checkActiveState('settings');
    const truthyResult = 'navigation__btn--active';

    expect(truthyResult).toEqual(result);
  });

  test('should be undefined.', () => {
    const result = checkActiveState('wrong data');

    expect(result).toBeUndefined();
  });

  test('should return the right title.', () => {
    const result = pageTitle();

    expect(result).toBe('settings');
  });
});
