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
          { name: "今日消费", url: "/pages/today/cost" },
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

  onLogout: function () {
    wx.openSetting({
      success: res => {
        if (!res.authSetting[ 'scope.userInfo' ]) {
          app.globalData.logged = false;
          wx.redirectTo({
            url: "/pages/login/login",
          })
        }
      },
    })
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

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['图库', '拍照'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[ 0 ]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[ 0 ]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

});
