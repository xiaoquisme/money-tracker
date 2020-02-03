// miniprogram/pages/money/lost.js
const app = getApp();

Page({

    data: {
        creator: null,
        moneyType: "LOST",
    },

    onLoad: function (options) {
        const { userInfo } = app.globalData;
        this.setData({
            creator: userInfo.nickName,
        })
    },
});
