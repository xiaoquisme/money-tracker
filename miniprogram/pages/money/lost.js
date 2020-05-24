import { getInitData } from './utils';
import { getLostItems } from '../component/lib/moneyTypes';


Page({
    data: {
        moneyType: 'LOST',
        moneyTypeOptions: [],
        initData: null
    },
    onLoad: function (params) {
        getLostItems()
            .then(options => this.setData({ moneyTypeOptions: options.map(o => o.name) }))
            .then(() => getInitData(params))
            .then(data => this.setData({ initData: data }));
    }
});
