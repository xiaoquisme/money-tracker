export const getToday = function () {
    return new Date().toISOString().split('T')[ 0 ];
};

export const getWeekNumberOptions = function (weekNumber) {
    const weekNumberOptions = [...Array(parseInt(weekNumber) + 1).keys()].sort((a, b) => b - a);
    weekNumberOptions.pop();
    return weekNumberOptions;
};
