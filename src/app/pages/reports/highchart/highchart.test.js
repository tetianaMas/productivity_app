/* eslint-disable no-undef */
import { HighchartModel } from './MVC/highchartModel';
import { chartOptions } from './chartOptions';
import { chartThemes } from './chartThemes';
import { HighchartObserver } from './MVC/highchartObserver';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import { chartDayData } from './__mocks__/chartDayData';
import { chartCategories } from './__mocks__/chartCategories';
import { recievedChartDayData } from './__mocks__/recievedChartDayData';
import { emptyChartData } from './__mocks__/emptyChartData';
import { chartWeekCategories } from './__mocks__/chartWeekCategories';
import { chartWeekData } from './__mocks__/chartWeekData';
import { chartMonthCategories } from './__mocks__/chartMonthCategories';
import { chartMonthData } from './__mocks__/chartMonthData';

Exporting(Highcharts);

const chart = new HighchartModel(
  chartThemes,
  chartOptions,
  HighchartObserver,
  Highcharts
);

describe('createDayChartData', () => {
  it('should return data for chart', () => {
    const result = chart.createDayChartData([chartDayData, chartCategories]);
    expect(result).toEqual(recievedChartDayData);
  });

  it('should return data for empty chart', () => {
    const result = chart.createDayChartData([4, chartCategories]);
    expect(result).toEqual(emptyChartData);
  });

  it('should return falsy value', () => {
    const result = chart.createDayChartData();
    expect(result).toBeFalsy();
  });
});

describe('createWeekChartData', () => {
  it('should return data for chart', () => {
    const result = chart.createWeekChartData([
      chartDayData,
      chartWeekCategories,
    ]);
    expect(result).toEqual(chartWeekData);
  });

  it('should return falsy value', () => {
    const result = chart.createWeekChartData([]);
    expect(result).toBeFalsy();
  });

  it('should return falsy value', () => {
    const result = chart.createWeekChartData([34, 'false']);
    expect(result).toBeFalsy();
  });
});

describe('createMonthChartData', () => {
  it('should return data for chart', () => {
    const result = chart.createMonthChartData([
      chartDayData,
      chartMonthCategories,
    ]);
    expect(result).toEqual(chartMonthData);
  });

  it('should return falsy value', () => {
    const result = chart.createMonthChartData([]);
    expect(result).toBeFalsy();
  });

  it('should return falsy value', () => {
    const result = chart.createMonthChartData([34, 'false']);
    expect(result).toBeFalsy();
  });
});

describe('createEmptyChart', () => {
  it('should return data for empty chart', () => {
    const result = chart.createEmptyChart(chartCategories);
    expect(result).toEqual(emptyChartData);
  });

  it('should return falsy value', () => {
    const result = chart.createEmptyChart([]);
    expect(result).toBeFalsy();
  });

  it('should return falsy value', () => {
    const result = chart.createEmptyChart();
    expect(result).toBeFalsy();
  });
});
