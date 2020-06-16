import { getInitData } from './utils';
import { getLostItems } from '../component/lib/moneyTypes';


Page({
    data: {
        moneyType: 'LOST',
        moneyTypeOptions: [],
        initData: null,
        id: null
    },
    onPullDownRefresh: function () {
        this.loadData(this.data.id);
    },
    onLoad: function ({ id }) {
        this.setData({ id: id });
        this.loadData(id);
    },
    loadData: function (id) {
        getLostItems()
            .then(options => this.setData({ moneyTypeOptions: options.map(o => o.name) }))
            .then(() => getInitData(id))
            .then(data => this.setData({ initData: data }))
            .then(() => wx.stopPullDownRefresh())
        ;
    }
});
