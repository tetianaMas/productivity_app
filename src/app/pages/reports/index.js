import './reports.less';
import { dataService } from '../../services/dataService/dataService';
import { ReportController } from './MVC/reportController';
import { ReportModel } from './MVC/reportModel';
import { ReportObserver } from './MVC/reportObserver';
import { ReportView } from './MVC/reportView';

const reportModel = new ReportModel(dataService, ReportObserver);
const reportView = new ReportView(reportModel);
/* eslint-disable no-unused-vars */
const reportController = new ReportController(reportModel, reportView);
/* eslint-disable no-unused-vars */
