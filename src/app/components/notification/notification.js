/* eslint-disable no-undef */
// import notificationTemplate from './template/notification.hbs';
import './notification.less';

(function ($) {
  let activeTimers = [];
  const notificationTemplate = require('./template/notification.hbs');
  /**
   * @description manages notification plugin
   * @param {object | string} options
   * @return {object}
   */
  $.fn.notification = function (options) {
    const defaults = {
      type: 'info',
      text: '',
      showTime: null,
      notificationTemplate,
    };

    const settings = $.extend({}, defaults, options);

    /**
     * @description emits remove function if plugin options equals string 'clean'
     * else clears all timers, shows current notification
     * @return {object}
     */
    this.initNotification = function () {
      if (options === 'clean') {
        $('.js-notification').remove();
      } else {
        this.clearTimers().showNotification();
      }

      return this;
    };

    /**
     * @description clears active timers
     * @return {object}
     */
    this.clearTimers = function () {
      activeTimers = activeTimers.map(timer => {
        clearTimeout(timer);
        timer = 0;

        return timer;
      });

      return this;
    };

    /**
     * @description renders notification, starts timer
     * and removes notification after it expiration
     * @return {object}
     */
    this.showNotification = function () {
      const MILLISECONDS_IN_MINUTE = 1000;
      const delay = settings.showTime * MILLISECONDS_IN_MINUTE;

      $(this)[0].body.insertAdjacentHTML(
        'beforeend',
        settings.notificationTemplate({
          type: settings.type,
          text: settings.text,
        })
      );

      $('.js-clear-notification').on('click', this.clearNotification);

      if (settings.type !== 'error') {
        const timeoutId = setTimeout(this.clearNotification, delay);
        activeTimers.push(timeoutId);
      }

      return this;
    };

    /**
     * @description removes notification with fadeout jquery animation
     * @return {object}
     */
    this.clearNotification = function () {
      $('.js-notification').fadeOut(400, $('.js-notification').remove);

      return this;
    };

    return this.initNotification();
  };
})(jQuery);
