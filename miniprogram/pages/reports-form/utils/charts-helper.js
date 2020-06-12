import wxCharts from '../../component/vanders/charts/wxcharts';

const app = getApp();

export function getColumnChart(targetComponent, canvasId, formatFunc, categories, series) {
    return new wxCharts({
        canvasId: canvasId,
        targetComponent: targetComponent,
        type: 'column',
        animation: true,
        yAxis: {
            format: formatFunc,
            min: 0,
            fontColor: getColor('#666666'),
            gridColor: getColor('#cccccc')
        },
        xAxis: {
            disableGrid: false,
            type: 'calibration',
            fontColor: getColor('#666666'),
            gridColor: getColor('#cccccc')
        },
        extra: {
            column: {
                width: 15
            }
        },
        width: app.globalData.systemInfo.windowWidth,
        height: 200,
        background: isDarkMode() ? '#1b1b1b' : '#e4e4e4',
        seriesTextColor: getColor('#666666'),
        categories: categories,
        series: series
    });
}

export const isDarkMode = () => app.globalData.systemInfo.theme === 'dark';


function getColor(color) {
    return isDarkMode() && reverseColor(color) || color;
}

function reverseColor(color) {
    return `#${ (0XFFFFFF - `0X${ color.split('#')[1] }`).toString(16) }`;
}
