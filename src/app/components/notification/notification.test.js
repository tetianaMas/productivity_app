/* eslint-disable no-undef */
import './notification';
jest.dontMock('jquery');
const $ = require('jquery');
jest.useFakeTimers();

describe('notification', () => {
  beforeEach(() => {
    $('.js-notification').remove();
  });

  test('should remove notification after user clicks on close button', () => {
    const options = {
      type: 'success',
      text: 'I warn you!!!!',
      showTime: 1,
    };
    const notification = $(document).notification(options);

    spyOn(notification, 'clearNotification');
    notification.showNotification();

    $('.js-clear-notification').click();
    expect(notification.clearNotification).toBeCalled();
  });

  test('should remove notification after timer executes', () => {
    const options = {
      type: 'warning',
      text: 'I warn you!!!!',
      showTime: 1,
    };

    const notification = $(document).notification(options);

    spyOn(notification, 'clearNotification');
    notification.showNotification();
    jest.advanceTimersByTime(1000);

    expect(notification.clearNotification).toBeCalled();
  });

  test('should render success notification', () => {
    const options = {
      type: 'success',
      text: 'Settings was successfully saved',
      showTime: 3,
    };
    $(document).notification(options);
    expect($('.js-notification').length).toBeTruthy();
  });

  test('should start call function after 3 seconds', () => {
    const options = {
      type: 'info',
      text: 'Good job!',
      showTime: 3,
    };
    $(document).notification(options);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000);
  });

  test('should not call function after timer executes', () => {
    const options = {
      type: 'error',
      text: 'Oops!',
      showTime: 3,
    };
    $(document).notification(options);
    expect(setTimeout).not.toHaveBeenCalledTimes(1);
    expect(setTimeout).not.toHaveBeenLastCalledWith(expect.any(Function), 3000);
  });
});
