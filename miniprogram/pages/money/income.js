// miniprogram/pages/money/income.js
Page({

    data: {
        moneyType: "INCOME",
        moneyTypeOptions: [],
    },
    onLoad: function () {
        wx.cloud.callFunction({
            name: 'db',
            data:{
                type: 'money-types-income'
            }
        }).then(res => res.result.data)
            .then(options => {
                this.setData({
                    moneyTypeOptions: options.map(o => o.name)
                })
            })
    }
});
