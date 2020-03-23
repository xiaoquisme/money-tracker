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
            const id = event.detail.data;
            this.setData({
                lostItems: this.data.lostItems.filter(i => i._id !== id),
            });
        }
    }
});
