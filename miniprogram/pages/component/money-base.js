import { addItem, updateItem } from './lib/moneyTracker';

import { isEmpty, redirectToDayPage, showSuccess } from './lib/lib';

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
        initData: Object,
        isEdit: Boolean
    },
    observers: {
        'initData': function (data) {
            if (data !== null) {
                this.setData({
                    ...data,
                    type: this.data.typeOptions.findIndex(o => o === data.type),
                    isEdit: true
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
        isEdit: false,
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
        onSubmit: function (event) {
            const isContinue = () => event.target.dataset.id === 'continue';

            function validatePass() {
                return Object.keys(this.data)
                    .filter(key => !(key === 'initData' || key === 'comment'))
                    .every(key => !isEmpty(this.data[key]));
            }

            if (!validatePass.call(this)) {
                wx.showModal({
                    content: '请完善所有信息',
                    showCancel: false,
                });
                return;
            }
            const { type, count, date, comment, moneyType, initData, isEdit } = this.data;

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

            if (!isEdit) {
                const createData = buildCreateObject.call(this);
                addItem(createData)
                    .then(() => {
                        if (isContinue()) {
                            showSuccess(() => {
                                this.setData({
                                    count: '',
                                    comment: ''
                                });
                            });
                            return;
                        }
                        showSuccess(() => {
                            redirectToDayPage(this.data.date);
                        });
                    });
                return;
            }
            const updateData = { ...buildUpdateObject.call(this), id: initData._id };
            updateItem(updateData)
                .then(() => showSuccess());
        },

        debounce: function (func, waitSecond) {
            return (event) => {
                clearTimeout(timer);
                timer = setTimeout(() => func(event), waitSecond * 1000);
            };
        },
        onSubmitClick: function (event) {
            this.debounce(this.onSubmit.bind(this), 0.3)(event);
        },
        onContinueClick: function (event) {
            this.debounce(this.onSubmit.bind(this), 0.3)(event);
        }
    }
});
