/* eslint-disable no-undef */
import { TimerModel } from './MVC/timerModel';
import { tasks } from '../tasks-list/__mocks__/tasks';
import timerTemplate from './template/timer.hbs';
import { TimerObserver } from './MVC/timerObserver';
import { dataService } from './../../services/dataService/dataService';
import createPomodoros from './template/createPomodoros';
import { pomodoroSettings } from './__mocks__/pomodoroSettings';
import { activeTask } from './__mocks__/activeTask';
import '../../components/notification/notification';

const timerModel = new TimerModel(dataService, TimerObserver);
timerModel.pomodoroSettings = pomodoroSettings;
timerModel.activeTask = activeTask;
describe('rendering', () => {
  test('renders correctly timer', () => {
    const tree = JSON.stringify(timerTemplate(tasks[0]));
    expect(tree).toMatchSnapshot();
  });
});

describe('createPomodoros', () => {
  test('should create pomodoros for template', () => {
    const res = createPomodoros('1');
    expect(res).toMatchSnapshot('<div class="main__task-info__icon"></div>');
  });

  test('should return falsy value', () => {
    const res = createPomodoros();
    expect(res).toBeFalsy();
  });

  test('should return falsy value', () => {
    const res = createPomodoros('');
    expect(res).toBeFalsy();
  });
});

describe('getDataFromStorage', () => {
  beforeEach(() => {
    spyOn(timerModel.dataService, 'getDataFromStorage');
  });
  test('should get data from storage', () => {
    timerModel.getDataFromStorage('active-task');
    expect(timerModel.dataService.getDataFromStorage).toHaveBeenCalledWith(
      'active-task'
    );
  });

  test('should return falsy value', () => {
    const res = timerModel.getDataFromStorage();
    expect(timerModel.dataService.getDataFromStorage).not.toBeCalled();
    expect(res).toBeFalsy();
  });

  test('should return falsy value', () => {
    const res = timerModel.getDataFromStorage(23425);
    expect(timerModel.dataService.getDataFromStorage).not.toBeCalled();
    expect(res).toBeFalsy();
  });
});

describe('finishPomodoro', () => {
  beforeAll(() => {
    spyOn(timerModel, 'isLongBreak');
    spyOn(timerModel, 'setCompletedPomodoro');
    spyOn(timerModel, 'setFailedPomodoro');
    spyOn(timerModel.initBreakEvent, 'notify');
    spyOn(timerModel.fillPomodoroEvent, 'notify');
    spyOn(timerModel, 'raiseIndex');

    timerModel.pomodoroSettings = pomodoroSettings;
  });
  test('finishes pomodoro and shows notification', () => {
    timerModel.finishPomodoro(true);

    expect(timerModel.isLongBreak).toBeCalled();
    expect(timerModel.setCompletedPomodoro).toBeCalled();
    expect(timerModel.initBreakEvent.notify).toBeCalled();
    expect(timerModel.fillPomodoroEvent.notify).toHaveBeenCalledWith([
      true,
      timerModel.currentPomodoroIndex,
    ]);
    expect(timerModel.raiseIndex).toBeCalled();
  });

  test('should return falsy result', () => {
    timerModel.finishPomodoro();
    expect(timerModel.setFailedPomodoro).toBeCalled();
  });
});

describe('setFailedPomodoro', () => {
  test('should set failed pomodoro', () => {
    spyOn(timerModel.activeTask.failedPomodoros, 'push');

    timerModel.setFailedPomodoro();
    expect(timerModel.activeTask.failedPomodoros.push).toHaveBeenCalledWith(
      timerModel.currentPomodoroIndex
    );
  });
});

describe('setCompletedPomodoro', () => {
  test('should set completed pomodoro', () => {
    spyOn(timerModel.activeTask.completedCount, 'push');

    timerModel.setCompletedPomodoro();
    expect(timerModel.activeTask.completedCount.push).toHaveBeenCalledWith(
      timerModel.currentPomodoroIndex
    );
  });
});

describe('isLongBreak', () => {
  test('should return true', () => {
    timerModel.currentPomodoroIndex = 1;
    timerModel.pomodoroSettings.iteration.value = 1;
    const res = timerModel.isLongBreak();

    expect(res).toBe(true);
  });

  test('should return false', () => {
    timerModel.currentPomodoroIndex = 3;
    timerModel.pomodoroSettings.iteration.value = 2;
    const res = timerModel.isLongBreak();

    expect(res).toBe(false);
  });
});

describe('raiseIndex', () => {
  test('should raise index', () => {
    let currentIndex = timerModel.currentPomodoroIndex;
    timerModel.raiseIndex();

    expect(timerModel.currentPomodoroIndex).toBe(currentIndex + 1);
  });
});

describe('raiseEstimate', () => {
  test('should raise estimate', () => {
    spyOn(timerModel.estimationChangedEvent, 'notify');

    let currentEstimation = parseInt(timerModel.activeTask.estimation, 10);
    timerModel.raiseEstimate();

    expect(timerModel.activeTask.estimation).toBe(currentEstimation + 1);
    expect(timerModel.estimationChangedEvent.notify).toBeCalled();
  });
});

describe('isTaskCompleted', () => {
  test('should return true', () => {
    timerModel.currentPomodoroIndex = 4;
    timerModel.activeTask.estimation = 4;
    const res = timerModel.isTaskCompleted();

    expect(res).toBe(true);
  });

  test('should return false', () => {
    timerModel.currentPomodoroIndex = 2;
    timerModel.activeTask.estimation = 4;
    const res = timerModel.isTaskCompleted();

    expect(res).toBe(false);
  });
});

describe('completeAllPomodoros', () => {
  beforeEach(() => {
    spyOn(timerModel, 'setCompletedPomodoro');
    spyOn(timerModel.fillPomodoroEvent, 'notify');
    spyOn(timerModel, 'raiseIndex');
  });
  test('should call func expected times', () => {
    timerModel.currentPomodoroIndex = 0;
    timerModel.activeTask.estimation = 2;
    timerModel.completeAllPomodoros();

    expect(timerModel.setCompletedPomodoro).toHaveBeenCalledTimes(2);
    expect(timerModel.fillPomodoroEvent.notify).toHaveBeenCalledTimes(2);
    expect(timerModel.raiseIndex).toHaveBeenCalledTimes(2);
  });

  test('should call func expected times', () => {
    timerModel.currentPomodoroIndex = 2;
    timerModel.activeTask.estimation = 2;
    timerModel.completeAllPomodoros();

    expect(timerModel.setCompletedPomodoro).not.toBeCalled();
    expect(timerModel.fillPomodoroEvent.notify).not.toBeCalled();
    expect(timerModel.raiseIndex).not.toBeCalled();
  });
});

describe('finishTask', () => {
  beforeAll(() => {
    spyOn(timerModel.taskCompletedEvent, 'notify');
    spyOn(timerModel, 'isTaskCompleted');
    timerModel.dataService.sendData = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    spyOn(timerModel, 'completeAllPomodoros');
    spyOn(timerModel, 'raiseIndex');
  });
  test('should finish task', () => {
    timerModel.currentPomodoroIndex = 2;
    timerModel.activeTask.estimation = '2';
    timerModel.isTaskCompleted = jest.fn().mockImplementation(() => true);

    timerModel.finishTask();
    expect(timerModel.activeTask.status).toBe('COMPLETED');
    expect(timerModel.activeTask.completeDate).toBe(timerModel.date);
    expect(timerModel.taskCompletedEvent.notify).toBeCalled();
    expect(timerModel.dataService.sendData).toHaveBeenCalledWith(
      'tasks',
      timerModel.activeTask,
      timerModel.activeTask.id
    );
    expect(timerModel.isTaskCompleted).toBeCalled();
    expect(timerModel.completeAllPomodoros).not.toBeCalled();
  });

  test('should call func expected times', () => {
    timerModel.currentPomodoroIndex = 0;
    timerModel.activeTask.estimation = '2';
    timerModel.isTaskCompleted = jest.fn().mockImplementation(() => false);

    timerModel.finishTask();

    expect(timerModel.activeTask.status).toBe('COMPLETED');
    expect(timerModel.activeTask.completeDate).toBe(timerModel.date);
    expect(timerModel.taskCompletedEvent.notify).toBeCalled();
    expect(timerModel.dataService.sendData).toHaveBeenCalledWith(
      'tasks',
      timerModel.activeTask,
      timerModel.activeTask.id
    );
    expect(timerModel.isTaskCompleted).toBeCalled();
    expect(timerModel.completeAllPomodoros).toBeCalled();
  });
});
