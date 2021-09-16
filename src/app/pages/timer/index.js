import './timer.less';
import { dataService } from './../../services/dataService/dataService';
import { TimerController } from './MVC/timerController';
import { TimerModel } from './MVC/timerModel';
import { TimerObserver } from './MVC/timerObserver';
import { TimerView } from './MVC/timerView';

const timerModel = new TimerModel(dataService, TimerObserver);
const timerView = new TimerView(timerModel);
/* eslint-disable no-unused-vars */
const timerController = new TimerController(timerModel, timerView);
/* eslint-disable no-unused-vars */
