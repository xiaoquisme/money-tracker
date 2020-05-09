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
                    { name: '花钱', url: '/pages/money/lost' },
                    { name: '挣钱', url: '/pages/money/income' },
                ]
            },
            {
                id: 'other',
                name: '其他',
                open: false,
                pages: [
                    { name: '日消费', url: '/pages/day/day' },
                    { name: '周消费', url: '/pages/week/week' },
                    { name: '月消费', url: '/pages/month/month' },
                    { name: '消费类型', url: '/pages/money-types/money-types' }
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
});
