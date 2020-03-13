// miniprogram/pages/money/lost.js
Page({
    data: {
        moneyType: "LOST",
        moneyTypeOptions: [],
    },
    onLoad: function () {
        wx.cloud.callFunction({
            name: 'db',
            data:{
                type: 'money-types-lost'
            }
        }).then(res => res.result.data)
            .then(options => {
                this.setData({
                    moneyTypeOptions: options.map(o => o.name)
                })
            })
    }
});
