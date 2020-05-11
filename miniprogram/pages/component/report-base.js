const { getTotalCount, getTotal } = require('./lib/lib');

Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        groupingBy: String,
        allItems: Array
    },

    data: {
        functions: [],
        totalIncome: 0,
        totalLost: 0,
        total: 0
    },

    observers: {
        'allItems': function (data) {
            const { groupingBy } = this.properties;
            const grouped = data.reduce((acc, item) => {
                acc[item[groupingBy]] = acc[item[groupingBy]] || [];
                acc[item[groupingBy]].push(item);
                return acc;
            }, {});
            this.setData({
                functions: []
            });
            Object.keys(grouped).forEach(key => {
                const items = grouped[key].sort((a, b) => b.date.localeCompare(a.date));
                this.setData({
                    functions: [...this.data.functions, {
                        id: key,
                        name: key,
                        open: false,
                        desc: getTotalCount(items),
                        customCell: true,
                        pages: items || []
                    }].sort((a, b) => b.id.localeCompare(a.id))
                });
            });
            const { totalLost, totalIncome } = getTotal(data);
            this.setData({
                totalIncome: totalIncome,
                totalLost: totalLost,
                total: totalIncome - totalLost
            });
        }
    },
});
