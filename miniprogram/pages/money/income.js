const { getInitData } = require('./utils');

Page({
    data: {
        moneyType: 'INCOME',
        moneyTypeOptions: [],
        initData: null
    },
    onLoad: function (options) {
        getInitData(options)
            .then(data => {
                this.setData({
                    initData: data
                });
            });
        wx.cloud.callFunction({
            name: 'db',
            data: {
                type: 'money-types-income'
            }
        }).then(res => res.result.data)
            .then(options => {
                this.setData({
                    moneyTypeOptions: options.map(o => o.name)
                });
            });
    }
});
