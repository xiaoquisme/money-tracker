import wxCharts from '../component/vanders/charts/wxcharts';

const app = getApp();

export function getColumnChart(targetComponent, canvasId, formatFunc, categories, series) {
    return new wxCharts({
        canvasId: canvasId,
        targetComponent: targetComponent,
        type: 'column',
        animation: true,
        yAxis: {
            format: formatFunc,
            min: 0
        },
        xAxis: {
            disableGrid: false,
            type: 'calibration'
        },
        extra: {
            column: {
                width: 15
            }
        },
        width: app.globalData.systemInfo.windowWidth,
        height: 200,
        padding: 0,
        categories: categories,
        series: series
    });
}
