Page({

    data: {
        week: null,
        weekDescription: "本周账单",
        lostItems: [],
        lostItemsTitle: "本周消费",
        incomeItems: [],
        incomeItemsTitle: "本周收入",
        weekLost: 0,
        weekIncome: 0,
        totalDescription: "累计消费",
    },

    onLoad: function (options) {
        const db = wx.cloud.database();
        const date = new Date().toISOString().split('T')[ 0 ];
        wx.cloud.callFunction({
            name: "lib",
            data: { date }
        }).then(res => res.result.weekNumber)
            .then(weekNumber => {
                db.collection("money-tracker")
                    .where({
                        weekNumber: weekNumber,
                    })
                    .get()
                    .then(res => {
                        const lostItems = res.data.filter(d => d.moneyType === "LOST").reverse();
                        const incomeItems = res.data.filter(d => d.moneyType === "INCOME").reverse();
                        const weekLost = lostItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
                        const weekIncome = incomeItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
                        this.setData({
                            lostItems: lostItems,
                            incomeItems: incomeItems,
                            weekLost: weekLost,
                            week: weekNumber,
                            weekIncome: weekIncome,
                        });
                    })
            });
    },
});
