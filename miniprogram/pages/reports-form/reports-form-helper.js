export  const dayCategories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
let weekNumberIndex;
export const initWeekNumberIndex = () => {
    weekNumberIndex = 1;
};

export const formatWeekNumber = () => `第${ weekNumberIndex++ }周`;

export const formatCount = val => `${ val }元`;

