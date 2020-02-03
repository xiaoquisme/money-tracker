// miniprogram/pages/money/lost.js
const app = getApp();

Page({


    data: {
        name: null,
        costMoney: 0.00,
        costType: "吃饭",
        costDate: null,
        costComment: "",
    },

    onLoad: function (options) {
        const { userInfo } = app.globalData;
        this.setData({
            name: userInfo.nickName,
        })
    },

    onCostTypeChange: function (e) {
        this.setData({
            costType: e.detail.value,
        })
    },

    onCostMoneyChange: function (e) {
        this.setData({
            costMoney: e.detail.value,
        })
    },

    onDateChange: function (e) {
        this.setData({
            costDate: e.detail.value,
        })
    },

    onCostCommentChange: function(e) {
        this.setData({
            costComment: e.detail.value,
        });
    },

    onSubmit: function (e) {
        function validatePass() {
            return Object.keys(this.data).every(key => this.data[ key ] != null)
        }

        if (!validatePass.call(this)) {
            wx.showModal({
                content: '请完善所有信息',
                showCancel: false,
            });
            return;
        }

        const db = wx.cloud.database();
        const { name, costMoney, costType, costDate } = this.data;
        db.collection('money-tracker').add({
            data: {
                name,
                costType,
                costMoney,
                costDate,
            },
            success: res => {
                wx.showToast({
                    title: '添加成功',
                    success: () => {
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: -1,
                            })
                        }, 1000)
                    }
                })

            }
        });
    }
});
