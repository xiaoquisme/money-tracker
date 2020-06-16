import { addItem } from '../component/lib/moneyTypes';
import { incomeTypesCacheKey, lostTypesCacheKey, removeFromCache } from '../component/lib/cacheUtils';

Page({

    data: {
        name: null,
        moneyTypeOptions: [],
        value: '0'
    },

    onLoad: function () {
        this.setData({
            moneyTypeOptions: ['支出', '收入']
        });
    },

    onMoneyTypeOptionsChange: function (event) {
        this.setData({
            value: event.detail.value
        });
    },
    onNameChange: function (event) {
        this.setData({
            name: event.detail.value,
        });
    },
    onSubmit: function () {
        addItem(this.data).then(() => {
            removeFromCache(incomeTypesCacheKey);
            removeFromCache(lostTypesCacheKey);
            wx.showToast({
                title: '添加成功',
                success: () => {
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: -1,
                        });
                    }, 1000);
                }
            });

        });
    }
});
