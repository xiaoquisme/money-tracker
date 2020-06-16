import { getInitData } from './utils';
import { getIncomeTypes } from '../component/lib/moneyTypes';

Page({
    data: {
        moneyType: 'INCOME',
        moneyTypeOptions: [],
        initData: null,
        id: null,
    },
    onPullDownRefresh: function () {
        this.loadData(this.data.id);
    },
    onLoad: function ({ id }) {
        this.setData({
            id: id,
        });
        this.loadData(id);
    },
    loadData: function (id) {
        getIncomeTypes()
            .then(options => this.setData({ moneyTypeOptions: options.map(o => o.name) }))
            .then(() => getInitData(id))
            .then(data => this.setData({ initData: data }))
            .then(() => wx.stopPullDownRefresh());
    }
});
