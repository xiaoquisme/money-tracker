// pages/component/cell/cell.js
const { deleteItemAsync } = require('../lib/moneyTracker.js');

Component({
    options: {
        addGlobalClass: true,
    },

    properties: {
        item: Object,
    },

    data: {
        slideButtons: [],
        itemData: {},
    },
    observers: {
        'item': function (data) {
            this.setData({
                itemData: {
                    ...data,
                    countWithFormat: data.moneyType === 'LOST' ? `-${ data.count }` : `+${ data.count }`
                },
                slideButtons: [
                    {
                        type: 'warn',
                        text: '删除',
                        data: data,
                        // extClass: 'weui-cell',
                        src: '/page/weui/cell/icon_del.svg', // icon的路径
                    }
                ]
            });
        }
    },

    methods: {
        lostItemsDelete: function (event) {
            const { data } = event.detail;
            this.triggerEvent('deleteItem',
                { data: { id: data._id, type: data.moneyType } });
            deleteItemAsync(data)
                .then(() => {
                })
            ;
        }
    },
});
