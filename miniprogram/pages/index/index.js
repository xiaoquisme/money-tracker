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
          { name: "本周消费", url: "/pages/week/week" }
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
    var id = e.currentTarget.id, list = this.data.functions;
    for (var i = 0, len = list.length; i < len; ++i) {
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
});
