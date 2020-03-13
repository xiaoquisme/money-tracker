Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: null,
        moneyTypeOptions: [],
        value: "0"
    },

    onLoad: function (options) {
        this.setData({
            moneyTypeOptions: ["支出", "收入"]
        });
    },

    onMoneyTypeOptionsChange: function (event) {
        this.setData({
            value: event.detail.value
        });
    },
    onNameChange: function (event) {
        this.setData({
            name: event.detail.value,
        });
    },
    onSubmit: function (event) {
        const moneyTypeMap = {
            "0": "LOST",
            "1": "INCOME",
        };

        wx.cloud.callFunction({
            name: "db",
            data: {
                type: 'money-types-add',
                data: {
                    name: this.data.name,
                    value: moneyTypeMap[ this.data.value ],
                    isActive: true,
                }
            }
        }).then(res => {
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
        })
        ;
    }

})
