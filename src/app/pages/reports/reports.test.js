/* eslint-disable no-undef */
import reports from './templates/reports.hbs';
import { ReportModel } from './MVC/reportModel';
import { dataService } from '../../services/dataService/dataService';
import { ReportObserver } from './MVC/reportObserver';
import { tasks } from './__mocks__/tasksReport';
import { tabsData } from './__mocks__/tabsData';
import { dataForPomodorosReport } from './__mocks__/dataForPomodorosReport';
import { dataForTasksReport } from './__mocks__/dataForTasksReport';

jest.mock('./MVC/reportView.js');
jest.mock('../../services/dataService/dataService');

const reportModel = new ReportModel(dataService, ReportObserver);

describe('check report rendering', () => {
  test('renders correctly report', () => {
    const tree = JSON.stringify(reports(tabsData));
    expect(tree).toMatchSnapshot();
  });
});

describe('check report rendering', () => {
  test('renders correctly report', () => {
    const tree = JSON.stringify(reports(tabsData));
    expect(tree).toMatchSnapshot();
  });
});

describe('createReport', () => {
  beforeEach(() => {
    reportModel.tasks = tasks;
    spyOn(reportModel, 'sortReportsByPeriod');
    spyOn(reportModel, 'createReportsData');
  });

  test('shold start creating reports', () => {
    reportModel.createReport('tasks', 1, 'day');
    expect(reportModel.sortReportsByPeriod).toBeCalled();
    expect(reportModel.createReportsData).toBeCalled();
  });

  test('shold not start creating reports', () => {
    reportModel.createReport('tasks');
    expect(reportModel.sortReportsByPeriod).not.toBeCalled();
    expect(reportModel.createReportsData).not.toBeCalled();
  });
});

describe('should sort tasks', () => {
  test('shold sort reports for 1 day', () => {
    const result = reportModel.sortReportsByPeriod(tasks, 1);
    expect(result).toEqual(tasks);
  });

  test('shold sort reports for 7 weeks', () => {
    const result = reportModel.sortReportsByPeriod(tasks, 7);
    expect(result).toEqual(tasks);
  });

  test('shold return falsy result', () => {
    const result = reportModel.sortReportsByPeriod(true, 7);
    expect(result).toBeFalsy();
  });

  test('shold return falsy result', () => {
    const result = reportModel.sortReportsByPeriod(true, 0);
    expect(result).toBeFalsy();
  });
});

describe('should create data for pomodoros', () => {
  test('shold return data for pomodoros report', () => {
    const result = reportModel.createDataPomodoros(tasks);
    expect(result).toEqual(dataForPomodorosReport);
  });

  test('shold return falsy result', () => {
    const result = reportModel.createDataPomodoros();
    expect(result).toBeFalsy();
  });

  test('shold return falsy result', () => {
    const result = reportModel.createDataPomodoros([]);
    expect(result).toBeFalsy();
  });

  test('shold return falsy result', () => {
    const result = reportModel.createDataPomodoros(67);
    expect(result).toBeFalsy();
  });
});

describe('should create data for tasks report', () => {
  test('shold return data for tasks report', () => {
    const result = reportModel.createDataTasks(tasks);
    expect(result).toEqual(dataForTasksReport);
  });

  test('shold return falsy result', () => {
    const result = reportModel.createDataTasks([]);
    expect(result).toBeFalsy();
  });

  test('shold return falsy result', () => {
    const result = reportModel.createDataTasks();
    expect(result).toBeFalsy();
  });

  test('shold return falsy result', () => {
    const result = reportModel.createDataTasks(6);
    expect(result).toBeFalsy();
  });
});

describe('should check if task successfull', () => {
  test('shold return truthy result', () => {
    const result = reportModel.isSuccessfullTask(tasks[1]);
    expect(result).toBeTruthy();
  });

  test('shold return falsy result', () => {
    const result = reportModel.isSuccessfullTask(tasks[0]);
    expect(result).toBeFalsy();
  });

  test('shold return falsy result', () => {
    const result = reportModel.isSuccessfullTask();
    expect(result).toBeFalsy();
  });

  test('shold return falsy result', () => {
    const result = reportModel.isSuccessfullTask(6);
    expect(result).toBeFalsy();
  });
});
