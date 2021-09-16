import './tasks-list.less';

import { dataService } from '../../services/dataService/dataService';
import { TaskCollectionController } from './MVC/taskCollectionController';
import { TaskCollectionModel } from './MVC/taskCollectionModel';
import { TaskCollectionView } from './MVC/taskCollectionView';
import { TaskDailyListView } from './MVC/taskDailyListView';
import { TaskGlobalListView } from './MVC/taskGlobalListView';

const taskCollectionModel = new TaskCollectionModel(dataService);
const taskCollectionView = new TaskCollectionView(taskCollectionModel);
/* eslint-disable no-unused-vars */
const taskGlobalListView = new TaskGlobalListView(taskCollectionModel);
const taskDailyListView = new TaskDailyListView(taskCollectionModel);
const taskCollectionController = new TaskCollectionController(
  taskCollectionView,
  taskCollectionModel
);
/* eslint-disable no-unused-vars */
