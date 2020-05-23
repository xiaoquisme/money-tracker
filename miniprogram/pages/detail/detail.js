const { deleteItemAsync } = require('../component/lib/moneyTracker');
Page({
    data: {
        item: null,
        shouldShowDeleteDialog: false
    },

    onLoad: function (options) {
        const { id } = options;
        wx.cloud.callFunction({
            name: 'db',
            data: {
                type: 'findById',
                data: {
                    id: id,
                }
            }
        }).then(res => {
            this.setData({
                item: res.result.data[0]
            });
        });
    },

    onClickEdit: function () {

    },
    onClickDelete: function () {
        this.setData({
            shouldShowDeleteDialog: true
        });
    },
    closeDialog: function () {
        this.setData({
            shouldShowDeleteDialog: false
        });
    },
    clickConfirmDelete: function () {
        deleteItemAsync(this.data.item)
            .then(() => {
                wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                });
            })
            .then(() => {
                this.setData({
                    shouldShowDeleteDialog: false
                });
            })
            .then(() => {
                wx.navigateBack({
                    delta: -1
                });
            });
    }
});
