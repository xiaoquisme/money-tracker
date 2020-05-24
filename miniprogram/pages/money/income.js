import { getInitData } from './utils';
import { getIncomeTypes } from '../component/lib/moneyTypes';

Page({
    data: {
        moneyType: 'INCOME',
        moneyTypeOptions: [],
        initData: null
    },
    onLoad: function (params) {
        getIncomeTypes()
            .then(options => this.setData({ moneyTypeOptions: options.map(o => o.name) }))
            .then(() => getInitData(params))
            .then(data => this.setData({ initData: data }));
    }
});
