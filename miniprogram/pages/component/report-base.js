Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        date: String,
        dateDescription: String,
        lostItems: Array,
        lostItemsTitle: String,
        incomeItems: Array,
        incomeItemsTitle: String,
        totalLost: Number,
        totalIncome: Number,
        total: Number,
        totalDescription: String,
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
            if (type === "INCOME") {
                updateIncomeItem(id);
            }
            if (type === "LOST") {
                updateLostItem(id);
            }
        },

    }
});
