import './highchart.less';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import { chartOptions } from './chartOptions';
import { chartThemes } from './chartThemes';
import { HighchartController } from './MVC/highchartController';
import { HighchartModel } from './MVC/highchartModel';
import { HighchartObserver } from './MVC/highchartObserver';
import { HighchartView } from './MVC/highchartView';
Exporting(Highcharts);

const highchartModel = new HighchartModel(
  chartThemes,
  chartOptions,
  HighchartObserver,
  Highcharts
);
const highchartView = new HighchartView(highchartModel, Highcharts);
/* eslint-disable no-unused-vars */
const highchartController = new HighchartController(
  highchartModel,
  highchartView
);
/* eslint-disable no-unused-vars */
