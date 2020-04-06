// miniprogram/pages/month/month.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: null,
    monthDescription: "月账单",
    lostItems: [],
    lostItemsTitle: "月消费",
    incomeItems: [],
    incomeItemsTitle: "月收入",
    monthLost: 0,
    monthIncome: 0,
    totalDescription: "累计消费",
    showActionSheet: true,
    groups: [
      "choice-month",
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onDateChange: function (event) {
    wx.showLoading({ title: '数据加载中' });
    const selectedDate = event.detail.value;
    console.group("aaaa", selectedDate, event);
    this.setData({
      month: selectedDate,
      showActionSheet: false,
    });
    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'month',
        date: {
          year: selectedDate.split('-')[0],
          month: selectedDate.split('-')[1],
        },
      }
    }).then(res => res.result).then(res => {
      const lostItems = res.data.filter(d => d.moneyType == "LOST").reverse();
      const incomeItems = res.data.filter(d => d.moneyType == "INCOME").reverse();
      const monthLost = lostItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
      const monthIncome = incomeItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
      this.setData({
        lostItems: lostItems,
        incomeItems: incomeItems,
        month: selectedDate,
        monthLost: monthLost,
        monthIncome: monthIncome,
      });
    }).then(any => {
      wx.hideLoading();
    });
  },
  closeActionSheet: function (e) {
    this.setData({
      showActionSheet: false,
    });
    wx.navigateBack({
      delta: -1
    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
});
