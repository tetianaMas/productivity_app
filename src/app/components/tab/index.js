import './tab.less';
import { TabController } from './MVC/tabController';
import { TabView } from './MVC/tabView';

export const tabView = new TabView();
export const tabController = new TabController(tabView);
