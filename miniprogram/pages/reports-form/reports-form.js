import { getMonthDataFromDB } from '../component/lib/moneyTracker';
import { allItemsCacheKey, getData, removeFromCache } from '../component/lib/cacheUtils';
import { getCurrentMonth, getCurrentYear } from '../component/lib/lib';

import { getColumnChart } from './utils/charts-helper';
import { dayDataGrouped, formatCount, getWeekNumberGrouped } from './utils/reports-form-helper';

let chart;

Page({

    data: {
        isMainPage: true,
        title: '',
        mainData: [],
        subData: [],
        selectedMonth: '',
    },

    onLoad: function () {
        chart = null;
        removeFromCache(allItemsCacheKey);
        const defaultMonth = `${ getCurrentYear() }-${ getCurrentMonth() }`;
        this.init(defaultMonth);
    },

    touchHandler: function (e) {
        let index = chart.getCurrentDataIndex(e);
        if (index > -1 && this.data.isMainPage) {
            this.setData({ isMainPage: false });
            this.updateChartsForSubPage(index);

        }
    },

    init: function (selectedMonth) {
        getData(allItemsCacheKey, () => getMonthDataFromDB(selectedMonth))
            .then(res => res.data)
            .then(items => items.filter(i => i.moneyType === 'LOST'))
            .then(items => {
                // 分组
                const { weekNumberGrouped, weekNumberDataForCharts } = getWeekNumberGrouped(items);
                let dayData = dayDataGrouped(weekNumberGrouped);
                this.setData({
                    mainData: weekNumberDataForCharts,
                    subData: dayData,
                    selectedMonth: selectedMonth,
                });
            })
            .then(() => {
                if (chart) {
                    this.updateChartsForMainPage();
                    return;
                }
                chart =
                    getColumnChart(this,
                        'report-form',
                        formatCount,
                        this.data.mainData.map(d => d.categories),
                        [{
                            name: '消费额',
                            data: this.data.mainData.map(d => d.data),
                            format: formatCount
                        }]
                    );
            });
    },

    onClickBack: function () {
        this.setData({
            isMainPage: true
        });
        this.updateChartsForMainPage();
    },

    updateChartsForMainPage: function () {
        chart.updateData({
            categories: this.data.mainData.map(d => d.categories),
            series: [{
                name: '消费额',
                data: this.data.mainData.map(d => d.data),
                format: formatCount
            }]
        });
    },

    updateChartsForSubPage: function (index) {
        const weekNumber = this.data.mainData[index].key;
        this.setData({
            title: `第${ weekNumber }周消费`
        });
        chart.updateData({
            categories: this.data.subData[weekNumber].map(d => d.categories),
            series: [{
                name: '消费额',
                data: this.data.subData[weekNumber].map(d => d.data),
                format: formatCount
            }]
        });
    },

    onMonthChange: function (event) {
        removeFromCache(allItemsCacheKey);
        const selectedDate = event.detail.value;
        this.setData({
            selectedMonth: selectedDate,
        });
        this.init(selectedDate);
    },

    onHide: function () {
        chart = null;
    }

});

