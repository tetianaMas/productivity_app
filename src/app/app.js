import '../assets/less/main.less';
import 'core-js/stable';
import 'jquery';
import 'popper.js';
import 'regenerator-runtime/runtime';
import 'webpack-jquery-ui';
import 'webpack-jquery-ui/css';
import 'webpack-jquery-ui/datepicker';
import 'webpack-jquery-ui/tooltip';
import './components/header/index';
import './components/modal/index';
import './components/notification/index';
import './components/tab/index';
import './pages/reports/highchart/index';
import './pages/reports/index';
import './pages/settings/index';
import './pages/tasks-list/index';
import './pages/tasks-list/task/index';
import './pages/timer/index';
import './pages/timer/radialTimer/radialTimer';
import './services/dataService/dataService';

$(document).tooltip({
  position: {
    my: 'center bottom+55',
    at: 'center bottom',
    target: 'mouse',
    track: true,
  },
});
