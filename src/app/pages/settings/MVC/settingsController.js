import { router } from '../../../routes';
import { eventBus } from '../../../services/eventBus';

/**
 * @description controls setting's component
 * @exports SettingsController
 * @class SettingsController
 */
export class SettingsController {
  /**
   * @description Creates an instance of SettingsController
   * @param {object} view instance of SettingsView
   * @param {object} model instance of SettingsModel
   * @memberof SettingsController
   */
  constructor(view, model) {
    this.view = view;
    this.model = model;

    eventBus.subscribe('load-page', () => {
      const currentRoute = window.location.hash;

      if (/^#\/settings\/pomodoros/.test(currentRoute)) {
        this.model.getAndSaveDataFromStorage();
        this.view.renderMainPage(this.model.settingsData());
        eventBus.post('pageLoaded');
      }
    });

    eventBus.subscribe('render-dynamic-elements', () => {
      this.view.renderDynamicElements(this.model.settingsData());
      eventBus.post('pageLoaded');
    });

    eventBus.subscribe('settings-page-category-loading', () => {
      this.view.renderCategoryPage();
      eventBus.post('pageLoaded');
    });

    eventBus.subscribe('save-data', async key => {
      try {
        await this.model.dataService.sendData(
          key,
          this.model.dataService.getDataFromStorage(key)
        );

        $(document).notification('clean');
        $(document).notification({
          type: 'success',
          text: 'Settings was successfully saved',
          showTime: 3,
        });

        router.navigate('/task-list');
      } catch (error) {
        $(document).notification('clean');
        $(document).notification({
          type: 'error',
          text: 'Unable to save settings. Try again later: ' + error.message,
          showTime: 3,
        });
      }
    });

    eventBus.subscribe('increaseValue', args => this.model.increaseValue(args));
    eventBus.subscribe('decreaseValue', args => this.model.decreaseValue(args));
  }
}
