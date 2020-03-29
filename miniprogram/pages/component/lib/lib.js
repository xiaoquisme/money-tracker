export const getToday = function () {
    return new Date().toISOString().split('T')[ 0 ];
};

