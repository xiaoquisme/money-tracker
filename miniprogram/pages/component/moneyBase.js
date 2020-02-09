const app = getApp();

Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {
        title: String,
        type: String,
        typeTitle: String,
        typePlaceholder: String,
        count: String,
        countTitle: String,
        countPlaceholder: String,
        date: String,
        comment: String,
        moneyType: String,
    },

    data: {
        type: "",
        count: 0.00,
        date: null,
        comment: "",
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onTypeChange: function (e) {
            this.setData({
                type: e.detail.value,
            })
        },
        onCountChange: function (e) {
            this.setData({
                count: e.detail.value,
            })
        },
        onDateChange: function (e) {
            this.setData({
                date: e.detail.value,
            })
        },
        onCommentChange: function (e) {
            this.setData({
                comment: e.detail.value,
            })
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
            const { type, count, date, comment } = this.data;
            const { moneyType } = this.properties;
            const { userInfo } = app.globalData;
            db.collection('money-tracker').add({
                data: {
                    creator: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl,
                    moneyType,
                    type,
                    count,
                    date,
                    comment
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
    }
});
