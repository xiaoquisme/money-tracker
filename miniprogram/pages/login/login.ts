const app = getApp();

Page({

  onLoad: function (options) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              const userInfo = JSON.parse(res.rawData);
              this.setLoggedUserInfo(userInfo);
              this.getOpenId();
              this.redirectToHomePage();
            }
          });
        }
      }
    })
  },

  getOpenId: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openId;
      },
      fail: err => {
        wx.showModal({
          title: "抱歉系统发生了错误",
          content: err.message,
          showCancel: false,
          success(res) {
            if (res.confirm == true) {
              app.globalData.errorMessage = err.message;
              wx.navigateTo({
                url: '/pages/common/error',
              })
            }
          }
        });

      }
    })

  },

  onGetUserInfo: function (e) {
    if (!app.globalData.logged && e.detail.userInfo) {
      this.setLoggedUserInfo(e.detail.userInfo);
      this.getOpenId();
      this.redirectToHomePage();
    }
  },

  setLoggedUserInfo: function (userInfo) {
    app.globalData.userInfo = userInfo;
    app.globalData.avatarUrl = userInfo.avatarUrl;
    app.globalData.logged = true;
  },

  redirectToHomePage: function () {
    wx.redirectTo({
      url: '/pages/index/index',
    });
  },

});
