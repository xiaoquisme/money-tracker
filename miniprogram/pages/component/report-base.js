const { getTotalCount } = require('./lib/lib');

Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        totalLost: Number,
        totalIncome: Number,
        total: Number,
        totalDescription: String,
        groupingBy: String,
        allItems: Array
    },

    data: {
        functions: []
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
        }
    },
});
