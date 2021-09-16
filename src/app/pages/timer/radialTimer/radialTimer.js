import timerBlockTemplate from './template/radialTimer.hbs';
import activeTimerTemplate from './template/activeTimer.hbs';
import './radialTimer.less';

(function ($) {
  let activeIntervals = [];
  let activeTimers = [];

  /**
   * @description radial timer plugin
   * @param {object} options starting options for timer
   * @return {function} init function
   */
  $.fn.radialTimer = function (options) {
    const defaults = {
      content: 'Let&#8217;s do it!',
      showFull: false,
      time: null,
      onTimeout: null,
      renderInterval: null,
      timerBlockTemplate,
      activeTimerTemplate,
      category: 'work',
    };
    this.settings = $.extend({}, defaults, options);

    /**
     * @description starts timer
     * @return {object}
     */
    this.initTimer = function () {
      this.clearTimers();
      if (this.settings.time && typeof this.settings.time === 'number') {
        this.createActiveTimer(this.settings.time, this.settings.content);
      } else if (!this.settings.showFull) {
        this.setStartContent();
      } else if (this.settings.showFull) {
        this.setCompletedContent();
      }

      return this;
    };

    /**
     * @description clears timers
     * @return {object}
     */
    this.clearTimers = function () {
      activeIntervals = activeIntervals.map(interval => {
        clearInterval(interval);
        interval = 0;

        return interval;
      });

      activeTimers = activeTimers.map(timer => {
        clearTimeout(timer);
        timer = 0;

        return timer;
      });

      return this;
    };

    /**
     * @description shows start timer circle
     * @return {object}
     */
    this.setStartContent = function () {
      $(this).html(
        this.settings.timerBlockTemplate({
          content: this.settings.content,
          category: this.settings.category,
        })
      );

      return this;
    };

    /**
     * @description shows full timer circle
     * @return {object}
     */
    this.setCompletedContent = function () {
      $('.js-block-timer').html(
        this.settings.activeTimerTemplate({
          showFull: this.settings.showFull,
          content: this.settings.content,
        })
      );

      return this;
    };

    /**
     * @description starts timer
     * @return {object}
     */
    this.createActiveTimer = function () {
      if (!$('.js-block-timer').length) this.setStartContent();
      const SECONDS_IN_MINUTE = 60;
      const MILLISECONDS_IN_MINUTE = 1000;

      $('.js-block-timer').html(
        this.settings.activeTimerTemplate({
          time: this.settings.time * SECONDS_IN_MINUTE,
          content: this.settings.content(this.settings.time + 1),
        })
      );
      const interval = setInterval(() => {
        const timeLeft = $('.timer__time').html();
        $('.timer__content').html(
          this.settings.content(parseInt(timeLeft, 10))
        );
      }, this.settings.renderInterval * MILLISECONDS_IN_MINUTE * SECONDS_IN_MINUTE);

      const timer = setTimeout(
        arg => {
          this.settings.onTimeout(arg);
          clearInterval(interval);
        },
        this.settings.time * MILLISECONDS_IN_MINUTE * SECONDS_IN_MINUTE,
        true
      );

      activeIntervals.push(interval);
      activeTimers.push(timer);

      return this;
    };

    return this.initTimer();
  };
})(jQuery);
