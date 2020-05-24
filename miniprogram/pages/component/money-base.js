import { updateItem, addItem } from './lib/moneyTracker';

import { showSuccess } from './lib/lib';

const app = getApp();



let timer;

const { getToday } = require('./lib/lib');

Component({
    options: {
        addGlobalClass: true,
    },
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
        initData: Object
    },
    observers: {
        'initData': function (data) {
            if (data !== null) {
                this.setData({
                    ...data,
                    type: this.data.typeOptions.findIndex(o => o === data.type)
                });
                return;
            }
            const today = getToday();
            this.setData({
                date: today
            });
        }
    },
    data: {
        type: '0',
        count: 0.00,
        date: null,
        comment: '',
    },

    methods: {
        onTypeChange: function (e) {
            this.setData({
                type: e.detail.value,
            });
        },
        onCountChange: function (e) {
            this.setData({
                count: e.detail.value,
            });
        },
        onDateChange: function (e) {
            this.setData({
                date: e.detail.value,
            });
        },
        onCommentChange: function (e) {
            this.setData({
                comment: e.detail.value,
            });
        },
        onSubmit: function () {
            function validatePass() {
                return Object.keys(this.data).filter(key => key !== 'initData').every(key => this.data[key] != null);
            }

            if (!validatePass.call(this)) {
                wx.showModal({
                    content: '请完善所有信息',
                    showCancel: false,
                });
                return;
            }
            const { type, count, date, comment, moneyType, initData } = this.data;

            function buildUpdateObject() {
                return {
                    type: this.properties.typeOptions[type],
                    count,
                    date,
                    comment
                };
            }

            function buildCreateObject() {
                const { userInfo } = app.globalData;
                return {
                    creator: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl,
                    moneyType,
                    ...buildUpdateObject.call(this)
                };
            }

            if (!initData) {
                const createData = buildCreateObject.call(this);
                addItem(createData)
                    .then(() => showSuccess());
                return;
            }
            const updateData = { ...buildUpdateObject.call(this), id: initData._id };
            updateItem(updateData)
                .then(() => showSuccess());
        },

        debounce: function (func, waitSecond) {
            return () => {
                clearTimeout(timer);
                timer = setTimeout(func, waitSecond * 1000);
            };
        },
        onSubmitClick: function () {
            this.debounce(this.onSubmit.bind(this), 0.3)();
        }
    }
});
