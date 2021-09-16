import './header.less';
import { HeaderController } from './MVC/headerController';
import { HeaderView } from './MVC/headerView';

const headerView = new HeaderView();
/* eslint-disable no-unused-vars */
const headerController = new HeaderController(headerView);
/* eslint-disable no-unused-vars */
