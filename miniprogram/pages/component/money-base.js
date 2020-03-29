const app = getApp();

let timer;

const { getToday } = require('./lib/lib');

Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {
        title: String,
        typeTitle: String,
        typeOptions: Array,
        count: String,
        countTitle: String,
        countPlaceholder: String,
        date: String,
        comment: String,
        moneyType: String,
    },

    data: {
        type: "0",
        count: 0.00,
        date: null,
        comment: "",
    },
    ready: function (e) {
        const today = getToday();
        this.setData({
            date: today
        });
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
        onSubmit: function () {
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
            const { type, count, date, comment } = this.data;
            const { moneyType } = this.properties;
            const { userInfo } = app.globalData;
            const data = {
                creator: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                moneyType,
                type: this.properties.typeOptions[ type ],
                count,
                date,
                comment
            };
            wx.cloud.callFunction({
                name: "db",
                data: {
                    type: "add-money-tracer",
                    data: data,
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
            });
        },

        debounce: function (func, waitSecond) {
            return () => {
                clearTimeout(timer);
                timer = setTimeout(func, waitSecond * 1000)
            };
        },
        onSubmitClick: function () {
            this.debounce(this.onSubmit.bind(this), 0.3)();
        }
    }
});
