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
        'allItems': function(data){
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
                        desc: items.reduce((acc, item) => acc + parseFloat(item.count), 0),
                        customCell: true,
                        pages: items || []
                    }].sort((a, b) => b.id.localeCompare(a.id))
                });
            });
        }
    },
    // eslint-disable-next-line no-unused-vars
    ready: function (e) {

    },

    methods: {
        deleteItemCallBack: function (event) {
            const updateLostItem = id =>
                this.setData({
                    lostItems: this.data.lostItems.filter(i => i._id !== id),
                });
            const updateIncomeItem = id =>
                this.setData({
                    incomeItems: this.data.incomeItems.filter(i => i._id !== id),
                });
            const { id, type } = event.detail.data;
            if (type === 'INCOME') {
                updateIncomeItem(id);
            }
            if (type === 'LOST') {
                updateLostItem(id);
            }
        },

    }
});
