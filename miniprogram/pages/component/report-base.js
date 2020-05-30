import { allItemsCacheKey, cache, getFromCache, removeFromCache } from './lib/cacheUtils';
import { getTotal, getTotalCount, isEmpty } from './lib/lib';


const app = getApp();

Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        allItems: Array
    },

    data: {
        functions: [],
        totalIncome: 0,
        totalLost: 0,
        total: 0,
        groupType: 0,
        groupTypeOptions: [],
    },

    ready: function () {
        this.setData({
            groupTypeOptions: [
                '类别',
                '日期'
            ]
        });
    },

    detached: function () {
        removeFromCache(allItemsCacheKey);
    },

    observers: {
        'allItems': function (data) {
            const cached = getFromCache(allItemsCacheKey);
            if (isEmpty(cached) && data.length) {
                cache(allItemsCacheKey, data);
            }
            const groupingTypeMap = {
                '类别': 'type',
                '日期': 'date',
            };
            const { groupType, groupTypeOptions } = this.data;
            const groupingBy = groupingTypeMap[groupTypeOptions[groupType || '0']];
            const grouped = data.reduce((acc, item) => {
                acc[item[groupingBy]] = acc[item[groupingBy]] || [];
                acc[item[groupingBy]].push(item);
                return acc;
            }, {});
            this.setData({
                functions: []
            });
            Object.keys(grouped).forEach(key => {
                const items = grouped[key].sort((a, b) => b.date.localeCompare(a.date));
                this.setData({
                    functions: [...this.data.functions, {
                        id: key,
                        name: key,
                        open: false,
                        desc: getTotalCount(items),
                        customCell: true,
                        pages: items || []
                    }].sort((a, b) => b.id.localeCompare(a.id))
                });
            });
            const { totalLost, totalIncome } = getTotal(data);
            this.setData({
                totalIncome: totalIncome,
                totalLost: totalLost,
                total: totalIncome - totalLost
            });
        }
    },
    methods: {
        onOnlyMeChange: function (e) {
            const { onlyMe } = e.detail.data;
            const { nickName: creator } = app.globalData.userInfo;
            const allItems = getFromCache(allItemsCacheKey);
            this.setData({
                allItems: allItems.filter(i => onlyMe ? creator === i.creator : true)
            });
        },
        onGroupTypeChange: function (e) {
            this.setData({
                groupType: e.detail.value,
                allItems: this.data.allItems
            });
        }
    }
});
