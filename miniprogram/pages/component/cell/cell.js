// pages/component/cell/cell.js
Component({
    options: {
        addGlobalClass: true,
    },

    properties: {
        item: Object,
    },

    data: {
        slideButtons: [],
        itemData:{},
    },
    observers: {
        'item': function (data) {
            this.setData({
                itemData: this.properties.item,
                slideButtons: [
                    {
                        type: 'warn',
                        text: '删除',
                        data: this.properties.item,
                        // extClass: 'weui-cell',
                        src: '/page/weui/cell/icon_del.svg', // icon的路径
                    }
                ]
            })
        }
    },

    methods: {
        lostItemsDelete: function (event) {
            const { data } = event.detail;
            this.triggerEvent('customevent', { data: data._id }, { bubbles: true });
            wx.cloud.callFunction({
                name: "db",
                data: {
                    type: "delete-money-tracker",
                    data: {
                        id: data._id
                    }
                }
            }).then(res => {})
        }
    },
})
