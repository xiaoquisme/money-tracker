import { getDay, getMonth, getTotalCount, groupingData } from '../../component/lib/lib';

export const formatWeekNumber = (key) => `第${ key }周`;

export const formatCount = val => `${ val }元`;


export const getWeekNumberGrouped = function (items) {
    const groupingBy = 'weekNumber';
    const sortedItems = items.sort((a, b) => a[groupingBy] - b[groupingBy]);
    const weekNumberGrouped = groupingData(sortedItems, groupingBy);
    const weekNumberDataForCharts = calcGroupedData(weekNumberGrouped, formatWeekNumber);
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
    const sortedItems = items.sort((a, b) => a[groupingBy].localeCompare( b[groupingBy]));
    const groupedData = groupingData(sortedItems, groupingBy);
    return calcGroupedData(groupedData, (date) => `${ getDay(date) }/${ getMonth(date) }`);
}

function calcGroupedData(groupedData, categories) {
    return Object.keys(groupedData).map(key => {
        const values = groupedData[key];
        return {
            data: getTotalCount(values),
            categories: categories(key),
            key: key,
        };
    });
}
