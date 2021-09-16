/* eslint-disable no-undef */
import { tasks } from '../__mocks__/tasks';
import checkButtonHidden from './template/checkButtonHidden';
import checkOverdue from './template/checkOverdue';

describe('checkOverdue', () => {
  test('should return css class to identify if task is overdued', () => {
    const res = checkOverdue(tasks[0].deadlineDate.fullDeadline);
    expect(res).toBe('task__deadline--overdue');
  });

  test('should return falsy result', () => {
    const res = checkOverdue(new Date().getTime());
    expect(res).toBeFalsy();
  });
});

describe('checkButtonHidden', () => {
  test('should return css class to identify if button hidden', () => {
    const res = checkButtonHidden('DAILY_LIST');
    expect(res).toBe('task__controls__btn--hidden');
  });

  test('should return falsy result', () => {
    const res = checkButtonHidden();
    expect(res).toBeFalsy();
  });
});
