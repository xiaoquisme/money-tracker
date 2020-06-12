import { getMonthDataFromDB } from '../component/lib/moneyTracker';
import { allItemsCacheKey, getData } from '../component/lib/cacheUtils';
import { getCurrentMonth, getCurrentYear, getTotalCount, groupingData } from '../component/lib/lib';

import { getColumnChart } from './utils/charts-helper';
import { dayCategories, formatCount, formatWeekNumber, initWeekNumberIndex } from './utils/reports-form-helper';

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
                const weekNumberGrouped = groupingData(items, 'weekNumber');
                // map 成 charts的数据
                // 通过分组的数据
                // 进行map
                // [{data: 100.00, categories: '第一周', weekNumber: 23} ]
                const weekNumberDataForCharts = Object.keys(weekNumberGrouped).map(weekNumber => {
                    const curWeekData = weekNumberGrouped[weekNumber];
                    return {
                        data: getTotalCount(curWeekData),
                        categories: formatWeekNumber(),
                        weekNumber: weekNumber
                    };
                });


                // {
                //  23: [{data: 100.00, categories: "周一(12-16)"}]
                // }
                let dayData = JSON.parse(JSON.stringify(weekNumberGrouped));

                Object.keys(dayData).forEach(weekNumber => {
                    const weekData = dayData[weekNumber];
                    const groupedDayData = groupingData(weekData, 'date');

                    const groupedDayDataForCharts = Object.keys(groupedDayData).map(day => {
                        const curDayData = groupedDayData[day];
                        return {
                            data: getTotalCount(curDayData),
                            categories: dayCategories,
                            day: day,
                        };
                    });

                    dayData[weekNumber] = groupedDayDataForCharts;

                });

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
                data: this.data.subData[this.data.mainData[index].weekNumber].map(d => d.data),
                format: formatCount
            }]
        })
        ;
    }

});

