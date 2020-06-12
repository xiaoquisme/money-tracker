import { getMonthDataFromDB } from '../component/lib/moneyTracker';
import { allItemsCacheKey, getData } from '../component/lib/cacheUtils';
import { getCurrentMonth, getCurrentYear } from '../component/lib/lib';

import { getColumnChart } from './utils/charts-helper';
import {
    dayCategories,
    dayDataGrouped,
    formatCount,
    getWeekNumberGrouped,
    initWeekNumberIndex
} from './utils/reports-form-helper';

let chart;

Page({

    data: {
        isMainPage: true,
        title: '',
        mainData: [],
        subData: []
    },

    onLoad: function () {
        this.init(`${ getCurrentYear() }-${ getCurrentMonth() }`);
    },

    touchHandler: function (e) {
        let index = chart.getCurrentDataIndex(e);
        if (index > -1 && this.data.isMainPage) {
            this.setData({ isMainPage: false });
            this.updateChartsForSubPage(index);

        }
    },

    init: function (selectedMonth) {
        initWeekNumberIndex();
        getData(allItemsCacheKey, () => getMonthDataFromDB(selectedMonth))
            .then(res => res.data)
            .then(items => {
                // 分组
                const { weekNumberGrouped, weekNumberDataForCharts } = getWeekNumberGrouped(items);
                let dayData = dayDataGrouped(weekNumberGrouped);
                this.setData({
                    mainData: weekNumberDataForCharts,
                    subData: dayData,
                    title: '当月消费',
                    subTitle: '当周消费'
                });
            })
            .then(() => {
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
        chart.updateData({
            categories: dayCategories,
            series: [{
                name: '消费额',
                data: this.data.subData[this.data.mainData[index].key].map(d => d.data),
                format: formatCount
            }]
        })
        ;
    }

});

