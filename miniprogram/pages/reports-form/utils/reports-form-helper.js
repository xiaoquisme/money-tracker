import { getTotalCount, groupingData } from '../../component/lib/lib';

export const dayCategories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
let weekNumberIndex;
export const initWeekNumberIndex = () => {
    weekNumberIndex = 1;
};

export const formatWeekNumber = () => `第${ weekNumberIndex++ }周`;

export const formatCount = val => `${ val }元`;


export const getWeekNumberGrouped = function (items) {
    const weekNumberGrouped = groupingData(items, 'weekNumber');
    const weekNumberDataForCharts = calcGroupedData(weekNumberGrouped, formatWeekNumber());
    return { weekNumberGrouped, weekNumberDataForCharts };
};

export const dayDataGrouped = function (weekNumberGrouped) {

    let dayData = JSON.parse(JSON.stringify(weekNumberGrouped));

    Object.keys(dayData).forEach(weekNumber => {
        const weekData = dayData[weekNumber];
        dayData[weekNumber] = groupedAndCalc(weekData, 'date');
    });
    return dayData;
};

function groupedAndCalc(items, groupingBy) {
    const groupedData = groupingData(items, groupingBy);
    return calcGroupedData(groupedData, dayCategories);
}

function calcGroupedData(groupedData, categories) {
    return Object.keys(groupedData).map(key => {
        const values = groupedData[key];
        return {
            data: getTotalCount(values),
            categories: categories,
            key: key,
        };
    });
}
