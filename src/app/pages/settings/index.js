import './settings.less';
import { dataService } from '../../services/dataService/dataService';
import { SettingsController } from './MVC/settingsController';
import { SettingsModel } from './MVC/settingsModel';
import { SettingsView } from './MVC/settingsView';
import * as settingsTemplate from './template/settings.hbs';
import * as buttonsTemplate from './template/settings-buttons.hbs';
import * as categoriesTemplate from './template/categories.hbs';

const settingsModel = new SettingsModel(dataService);
const settingsView = new SettingsView(
  settingsTemplate,
  buttonsTemplate,
  categoriesTemplate,
  settingsModel
);
/* eslint-disable no-unused-vars */
const settingsController = new SettingsController(settingsView, settingsModel);
/* eslint-disable no-unused-vars */
