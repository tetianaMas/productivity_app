import { eventBus } from '../../../services/eventBus';
import * as template from '../template/timer.hbs';

/**
 * @description manages timer view component
 * @exports TimerView
 * @class TimerView
 */
export class TimerView {
  /**
   * @description Creates an instance of TimerView
   * @param {*} model instance of TimerModel
   * @memberof TimerView
   */
  constructor(model) {
    this.model = model;
    this.MAX_AMOUNT_OF_POMODOROS = 10;

    this.model.timerInitEvent.subscribe(this.init.bind(this));
    this.model.initBreakEvent.subscribe(this.startBreakTimer.bind(this));
    this.model.fillPomodoroEvent.subscribe(
      this.renderCompletedPomodoro.bind(this)
    );
    this.model.estimationChangedEvent.subscribe(this.addPomodoro.bind(this));
    this.model.taskCompletedEvent.subscribe(
      this.renderCompletedScreen.bind(this)
    );
  }

  /**
   *
   * @description renders timer page, sets events
   * @param {object} arg task, settings
   * @memberof TimerView
   */
  init(arg) {
    const [task, settings] = arg;
    document.body.innerHTML = template(task);
    this.addEvents(settings);

    $('#js-main-timer').radialTimer({
      category: task.categoryId,
    });
  }

  /**
   * @description adds events
   * @param {object} settings current settings for pomodoro timer
   * @memberof TimerView
   */
  addEvents(settings) {
    document
      .querySelector('.js-btn-to-task-list')
      .addEventListener('click', () => eventBus.post('return-to-task-list'));

    document
      .querySelector('.js-start-timer')
      .addEventListener('click', () => this.startTimer(settings));

    document
      .querySelector('.js-btn-pomodoros-add')
      .addEventListener('click', () => eventBus.post('raise-estimate'));
  }

  /**
   * @description starts timer
   * @param {object} settings current settings for pomodoro timer
   * @memberof TimerView
   */
  startTimer(settings) {
    document.querySelector('.js-btn-to-task-list').classList.add('d-none');
    document.querySelector('.js-header-main').classList.add('hidden');

    this.renderTimerControlsButtons();
    this.startPomodoro(settings.work.value);
  }

  /**
   * @description renders timer controls buttons and sets events
   * @memberof TimerView
   */
  renderTimerControlsButtons() {
    document.querySelector('.js-main__control--timer').innerHTML = `
    <button class="main__control__button main__control__button--small 
    main__control__button--red js-fail-pomodora">
      fail pomodora
    </button>

    <button class="main__control__button main__control__button--small 
    main__control__button--mint js-finish-pomodora">
      finish pomodora
    </button>`;

    document
      .querySelector('.js-fail-pomodora')
      .addEventListener('click', () => this.finishPomodoro(false));

    document
      .querySelector('.js-finish-pomodora')
      .addEventListener('click', () => this.finishPomodoro(true));

    document.querySelector('.js-btn-pomodoros-add').classList.add('d-none');
  }

  /**
   * @description starts radial timer
   * @param {*} value
   * @memberof TimerView
   */
  startPomodoro(value) {
    $('#js-main-timer').radialTimer({
      time: value,
      content: timeLeft => {
        const currentTime = timeLeft - 1;

        if (currentTime > 0) {
          return `<p class="timer__time">${currentTime}</p>
          <p class="timer__dimension">min</p>`;
        }
      },
      renderInterval: 1,
      onTimeout: this.finishPomodoro.bind(TimerView),
    });
  }

  /**
   * @description finishes pomodoro
   * @param {boolean} state true if successfully finished
   * @memberof TimerView
   */
  finishPomodoro(state) {
    eventBus.post('finish-pomodoro', state);
  }

  /**
   * @description starts break timer
   * @param {object} arg
   * @memberof TimerView
   */
  startBreakTimer(arg) {
    const [isSuccessfullyCompleted, isLongBreak, settings] = arg;
    this.renderBreakControlsButtons(isSuccessfullyCompleted, settings);

    const options = {
      time: isLongBreak ? settings.longBreak.value : settings.shortBreak.value,
      content: timeLeft => {
        const currentTime = timeLeft - 1;

        if (currentTime > 0) {
          return `<p class="timer__break">break</p>
          <p class="timer__time">${currentTime}</p>
          <p class="timer__dimension">min</p>`;
        } else {
          return '<span class="timer__break--over">Break is over</span>';
        }
      },
      renderInterval: 1,
      onTimeout: function () {
        this.content();
      },
    };

    $('#js-main-timer').radialTimer(options);
  }

  /**
   * @description renders break timer buttons and sets events
   * @param {boolean} isSuccessfullyCompleted
   * @param {object} settings current settings for pomodoro timer
   * @memberof TimerView
   */
  renderBreakControlsButtons(isSuccessfullyCompleted, settings) {
    const buttonsBlock = document.querySelector('.js-main__control--timer');

    buttonsBlock.innerHTML = `
    <button class="main__control__button 
      main__control__button--mint main__control__button--small
      js-start-timer">
        start pomodora
    </button>`;

    document.querySelector('.js-btn-pomodoros-add').classList.remove('d-none');

    if (isSuccessfullyCompleted) {
      buttonsBlock.innerHTML += `
      <button class="main__control__button 
        main__control__button--small 
        main__control__button--blue js-finish-task">
          finish task
      </button>`;

      document
        .querySelector('.js-finish-task')
        .addEventListener('click', () => eventBus.post('finish-task'));
    }

    document
      .querySelector('.js-start-timer')
      .addEventListener('click', () => this.startTimer(settings));
  }

  /**
   * @description adds pomodoro
   * @memberof TimerView
   */
  addPomodoro() {
    const addPomodorosBtn = document.querySelector('.js-btn-pomodoros-add');
    const pomodorosBlock = document.querySelector('.js-timer-estimation-block');
    const pomodoro = this.createEmptyPomodoro();

    pomodorosBlock.insertBefore(pomodoro, addPomodorosBtn);

    if (pomodorosBlock.children.length > this.MAX_AMOUNT_OF_POMODOROS) {
      addPomodorosBtn.classList.add('hidden');
    }
  }

  /**
   * @description creates empty pomodoro
   * @return {object} empty pomodoro object
   * @memberof TimerView
   */
  createEmptyPomodoro() {
    const pomodoro = document.createElement('div');
    pomodoro.classList.add('main__task-info__icon');

    return pomodoro;
  }

  /**
   * @description renders completed pomodoro
   * @param {object} arg
   * @memberof TimerView
   */
  renderCompletedPomodoro(arg) {
    const [isSuccessfullyCompleted, index] = arg;
    const pomodorosBlock = document.querySelector('.js-timer-estimation-block');
    const currentPomodoro = pomodorosBlock.children[index];

    if (isSuccessfullyCompleted) {
      currentPomodoro.classList.add('main__task-info__icon--done');
    } else {
      currentPomodoro.classList.add('main__task-info__icon--failed');
    }
  }

  /**
   * @description renders full radial timer, manages main workflow buttons
   * @memberof TimerView
   */
  renderCompletedScreen() {
    $('#js-main-timer').radialTimer({
      content: 'You Completed Task',
      showFull: true,
    });

    document.querySelector('.js-btn-to-task-list').classList.remove('d-none');
    document.querySelector('.js-header-main').classList.remove('hidden');
    document.querySelector('.js-btn-to-reports').classList.remove('d-none');
    document.querySelector('.js-main__control--timer').innerHTML = '';
    document.querySelector('.js-btn-pomodoros-add').classList.add('d-none');
  }
}
