/**
 * @description manages view of the highchart component
 * @exports HighchartView
 * @class HighchartView
 */
export class HighchartView {
  /**
   * @description Creates an instance of HighchartView
   * @param {object} model instance of HighchartModel
   * @param {object} Highcharts instance of Highchart
   * @memberof HighchartView
   */
  constructor(model, Highcharts) {
    this.model = model;
    this.highcharts = Highcharts;
    this.model.reportDataChangedEvent.subscribe(this.renderChart.bind(this));
  }

  /**
   * @description renders chart
   * @param {object} arg data, categories and chart options
   * @memberof HighchartView
   */
  renderChart(arg) {
    const [data, categories, options] = arg;

    this.highcharts.setOptions(options);
    this.highcharts.chart('reports-container', {
      chart: {
        type: 'column',
      },
      tooltip: {
        formatter: function () {
          const tabs = document.querySelector('.js-tab-bottom');
          const activeTabText = tabs.querySelector('.tab__btn--active')
            .innerText;
          return `
            <span class="tooltip tooltip--big">
              <span class="tooltip__priority">${this.series.name}</span><br>
              <span class="tooltip__tasks">${activeTabText}: ${this.y}</span>
            </span>
            `;
        },
      },
      xAxis: {
        categories: categories,
        min: 0,
        max: categories.length - 1,
      },
      series: data,
    });
  }
}
