/**
 * @description manages custom events for highcharts component
 * @exports HighchartObserver
 * @class HighchartObserver
 */
export class HighchartObserver {
  /**
   * @description Creates an instance of HighchartObserver
   * @memberof HighchartObserver
   */
  constructor() {
    this.observers = [];
  }

  /**
   * @description adds new callback to the observers
   * @param {object} handler callback to hangle event
   * @memberof HighchartObserver
   */
  subscribe(handler) {
    this.observers.push(handler);
  }

  /**
   * @description emits all handlers
   * @param {object} data arguments for the handler
   * @memberof HighchartObserver
   */
  notify(data) {
    this.observers.forEach(handler => handler(data));
  }
}
