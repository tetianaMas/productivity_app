/* eslint-disable no-undef */
import './radialTimer';
jest.dontMock('jquery');
const $ = require('jquery');
jest.useFakeTimers();

describe('radialTimer', () => {
  let options;
  beforeEach(() => {
    jest.clearAllTimers();
    options = {
      time: 3,
      content: timeLeft => {
        const currentTime = timeLeft - 1;

        if (currentTime > 0) {
          return `<p class="timer__time">${currentTime}</p>
          <p class="timer__dimension">min</p>`;
        }
      },
      renderInterval: 1,
      onTimeout: () => 'test',
    };
    document.body.innerHTML = '<div class="js-timer"></div>';
  });

  test('should start call function after 3 minutes', () => {
    const timer = $('.js-timer').radialTimer(options);
    spyOn(timer.settings, 'onTimeout');

    timer.initTimer();
    expect(setInterval).toBeCalled();
    expect(setTimeout).toBeCalled();
    jest.runOnlyPendingTimers();
    expect(timer.settings.onTimeout).toBeCalled();
  });

  test('should start timer with default values', () => {
    const timer = $('.js-timer').radialTimer();
    spyOn(timer, 'setStartContent');
    timer.initTimer();
    expect(timer.setStartContent).toBeCalled();
    expect($('.js-block-timer').length).toBeTruthy();
  });

  test('should render active timer with options', () => {
    const timer = $('.js-timer').radialTimer(options);
    spyOn(timer, 'createActiveTimer');

    timer.initTimer();
    expect(timer.createActiveTimer).toBeCalled();
    expect($('.timer').length).toBeTruthy();
    expect($('.timer__time').html()).toBe(options.time.toString());
  });
});
