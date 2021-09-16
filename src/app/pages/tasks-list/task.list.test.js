/* eslint-disable no-undef */
import { TaskCollectionModel } from './MVC/taskCollectionModel';
import { dataService } from '../../services/dataService/dataService';
import allTasksDone from './template/all-tasks-done.hbs';
import emptyPage from './template/empty-page-message.hbs';
import firstPage from './template/firstPage.hbs';
import noDailyTasks from './template/no-daily-tasks-message.hbs';
import noTasksLeft from './template/no-tasks-left.hbs';
import taskListContainer from './template/task-list-container.hbs';
import { tasks } from './__mocks__/tasks';
import { tasksFiltered } from './__mocks__/tasksFiltered';
import { categories } from './__mocks__/categories';
import { objProto } from './__mocks__/objProto';
import { newTaskOptions } from './__mocks__/newTaskOptions';
import { TaskModel } from './task/taskModel';

const taskListModel = new TaskCollectionModel(dataService);
taskListModel.taskListCollection = tasks;

describe('rendering', () => {
  test('renders correctly allTasksDone', () => {
    const tree = JSON.stringify(allTasksDone());
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly emptyPage', () => {
    const tree = JSON.stringify(emptyPage());
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly firstPage', () => {
    const tree = JSON.stringify(firstPage(taskListModel.taskListTemplateData));
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly noDailyTasks', () => {
    const tree = JSON.stringify(noDailyTasks());
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly noTasksLeft', () => {
    const tree = JSON.stringify(noTasksLeft());
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly taskListContainer', () => {
    const tree = JSON.stringify(
      taskListContainer(taskListModel.taskListTemplateData)
    );
    expect(tree).toMatchSnapshot();
  });
});

describe('createTaskListCollection', () => {
  test('should create task-list', () => {
    taskListModel.createTaskListCollection();
    expect(taskListModel.tasksCollection).toEqual(tasksFiltered);
  });
});

describe('createCategories', () => {
  test('should create categories', () => {
    const res = taskListModel.createCategories([tasks[0]], objProto);
    expect(res).toEqual(categories);
  });

  test('should return falsy result', () => {
    const res = taskListModel.createCategories([tasks[0]]);
    expect(res).toBeFalsy();
  });

  test('should return falsy result', () => {
    const res = taskListModel.createCategories();
    expect(res).toBeFalsy();
  });

  test('should return falsy result', () => {
    const res = taskListModel.createCategories('test', true);
    expect(res).toBeFalsy();
  });
});

describe('createTask', () => {
  test('should create new task', () => {
    spyOn(taskListModel, 'createTaskListCollection');
    spyOn(taskListModel, 'sendTaskData');

    const res = new TaskModel(newTaskOptions);
    taskListModel.createTask(newTaskOptions);
    expect(
      taskListModel.taskListCollection[
        taskListModel.taskListCollection.length - 1
      ]
    ).toEqual(res.options);
    expect(taskListModel.createTaskListCollection).toBeCalled();
    expect(taskListModel.sendTaskData).toBeCalled();
  });

  test('should return falsy result', () => {
    const res = taskListModel.createTask();
    expect(res).toBeFalsy();
  });

  test('should return falsy result', () => {
    const res = taskListModel.createTask(2343434);
    expect(res).toBeFalsy();
  });

  test('should return falsy result', () => {
    const res = taskListModel.createTask(true);
    expect(res).toBeFalsy();
  });
});

describe('getCurrentDate', () => {
  test('should return current day obj', () => {
    const res = taskListModel.getCurrentDate();
    expect(res).toBeTruthy();
  });

  test('should return day obj', () => {
    const today = new Date(2021, 2, 26);
    const options = {
      month: 'long',
    };
    const newDate = {
      fullDeadline: today.getTime(),
      month: Intl.DateTimeFormat('en-US', options).format(today),
      day: today.getDate(),
    };

    const res = taskListModel.getCurrentDate('March 26, 2021');
    expect(newDate).toEqual(res);
  });

  test('should return current day obj', () => {
    const res = taskListModel.getCurrentDate(true);
    expect(res).toBeTruthy();
  });

  test('should return current day obj', () => {
    const res = taskListModel.getCurrentDate('');
    expect(res).toBeTruthy();
  });
});

describe('updateTask', () => {
  test('should update current task', () => {
    spyOn(taskListModel, 'createTaskListCollection');
    spyOn(taskListModel, 'sendTaskData');

    const newTask = tasks[1];
    const newDescription = 'Wow! This is the greatest test ever!!!';
    newTask.description = newDescription;
    taskListModel.updateTask(newTask);
    const updatedTask = taskListModel.taskListCollection.find(
      item => item.id === newTask.id
    );
    expect(updatedTask.description).toBe(newDescription);
    expect(taskListModel.createTaskListCollection).toBeCalled();
    expect(taskListModel.sendTaskData).toHaveBeenCalledWith(
      'tasks',
      newTask,
      newTask.id
    );
  });

  test('should return falsy value', () => {
    const res = taskListModel.updateTask();
    expect(res).toBeFalsy();
  });
});

describe('changeTaskStatus', () => {
  test('should change task status', () => {
    spyOn(taskListModel.dataService, 'sendData');

    const id = tasks[0].id;
    const newStatus = 'TEST';
    taskListModel.changeTaskStatus(id, newStatus);
    const updatedTask = taskListModel.taskListCollection.find(
      item => item.id === id
    );
    expect(updatedTask.status).toBe(newStatus);
    expect(taskListModel.dataService.sendData).toHaveBeenCalledWith(
      'tasks',
      updatedTask,
      id
    );
  });

  test('should return falsy value', () => {
    const res = taskListModel.changeTaskStatus();
    expect(res).toBeFalsy();
  });
});

describe('changeTaskStatus', () => {
  test('should change task status', () => {
    spyOn(taskListModel.dataService, 'removeItem');
    spyOn(taskListModel.renderNoTasksLeftPageEvent, 'notify');

    const idsToRemove = [];
    taskListModel.taskListCollection.forEach(task => idsToRemove.push(task.id));
    taskListModel.removeTask(idsToRemove);
    expect(taskListModel.taskListCollection.length).toBeFalsy();
    expect(taskListModel.dataService.removeItem).toHaveBeenCalledWith(
      'tasks',
      idsToRemove
    );
    expect(taskListModel.renderNoTasksLeftPageEvent.notify).toBeCalled();
  });

  test('should return falsy value', () => {
    const res = taskListModel.removeTask();
    expect(res).toBeFalsy();
  });
});

describe('checkLeftTasks', () => {
  test('should call appropriate func', () => {
    spyOn(taskListModel.renderNoTasksLeftPageEvent, 'notify');

    taskListModel.checkLeftTasks();
    expect(taskListModel.renderNoTasksLeftPageEvent.notify).toBeCalled();
  });

  test('should call appropriate func', () => {
    spyOn(taskListModel.renderEmptyDailyTasks, 'notify');

    taskListModel.taskListCollection.length = 1;
    taskListModel.globalTasksActive.length = 1;
    taskListModel.checkLeftTasks();
    expect(taskListModel.renderEmptyDailyTasks.notify).toBeCalled();
  });

  test('should call appropriate func', () => {
    spyOn(taskListModel.renderAddFirstTaskPageEvent, 'notify');

    taskListModel.taskListCollection.length = 1;
    taskListModel.globalTasksActive.length = 0;
    taskListModel.dailyTasksActive.length = 0;
    taskListModel.dailyTasksCompleted.length = 0;
    taskListModel.globalTasksCompleted.length = 0;

    taskListModel.checkLeftTasks();
    expect(taskListModel.renderAddFirstTaskPageEvent.notify).toBeCalled();
  });

  test('should call appropriate func', () => {
    spyOn(taskListModel.renderNoTasksLeftPageEvent, 'notify');

    taskListModel.taskListCollection.length = 1;
    taskListModel.globalTasksActive.length = 0;
    taskListModel.dailyTasksActive.length = 0;
    taskListModel.dailyTasksCompleted.length = 1;
    taskListModel.globalTasksCompleted.length = 1;

    taskListModel.checkLeftTasks();
    expect(taskListModel.renderNoTasksLeftPageEvent.notify).toBeCalled();
  });
});

describe('getTaskById', () => {
  beforeAll(() => {
    taskListModel.taskListCollection = tasks;
  });
  test('should return task by id', () => {
    const res = taskListModel.getTaskById(tasks[0].id);
    expect(res).toEqual(tasks[0]);
  });

  test('should return falsy value', () => {
    const res = taskListModel.getTaskById();
    expect(res).toBeFalsy();
  });
});

describe('saveTaskToStorage', () => {
  beforeAll(() => {
    taskListModel.taskListCollection = tasks;
  });
  test('should call func to set value to storage', () => {
    spyOn(taskListModel.dataService, 'setDataToStorage');
    taskListModel.saveTaskToStorage(tasks[0].id);
    expect(taskListModel.dataService.setDataToStorage).toHaveBeenCalledWith(
      'active-task',
      tasks[0]
    );
  });

  test('should return falsy value', () => {
    const res = taskListModel.saveTaskToStorage();
    expect(res).toBeFalsy();
  });
});
