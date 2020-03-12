//index.js
const app = getApp();

Page({
    data: {
        avatarUrl: './user-unlogin.png',
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        functions: [
            {
                id: 'main',
                name: '记账',
                open: true,
                pages: [
                    { name: "花钱", url: "/pages/money/lost" },
                    { name: "挣钱", url: "/pages/money/income" },
                ]
            },
            {
                id: 'other',
                name: "其他",
                open: false,
                pages: [
                    { name: "今日消费", url: "/pages/today/today" },
                    { name: "本周消费", url: "/pages/week/week" },
                    { name: "消费类型", url: "/pages/money-types/money-types" }
                ]
            }
        ]
    },

    onLoad: function () {

        const { userInfo, logged } = app.globalData;
        if (!logged) {
            wx.redirectTo({
                url: '/pages/login/login',
            });
            return;
        }
        this.setData({
            avatarUrl: userInfo.avatarUrl,
            userInfo: userInfo
        });
    },

    kindToggle: function (e) {
        const id = e.currentTarget.id, list = this.data.functions;
        for (let i = 0, len = list.length; i < len; ++i) {
            if (list[ i ].id == id) {
                list[ i ].open = !list[ i ].open
            } else {
                list[ i ].open = false
            }
        }
        this.setData({
            functions: list,
        });
    },
    clickDelete: function (e) {
        wx.cloud.callFunction({
            name: "db",
            data: {
                type: "remove-today-test"
            }
        }).then(any => {
            wx.showToast({
                icon: "success",
                title: "删除成功",
                duration: 1000
            })
        })
    }
});
