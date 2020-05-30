const { deleteItem, findById } = require('../component/lib/moneyTracker');
Page({
    data: {
        item: null,
        shouldShowDeleteDialog: false
    },

    onLoad: function (options) {
        const { id } = options;
        this.setData({
            id: id
        });
        this.loadData(id);
    },
    onPullDownRefresh: function () {
        this.loadData(this.data.id);
    },
    onClickEdit: function () {
        const { _id, moneyType } = this.data.item;
        wx.navigateTo({
            url: `/pages/money/${ moneyType === 'LOST' ? 'lost' : 'income' }?id=${ _id }`
        });
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
        deleteItem(this.data.item)
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
    },
    loadData: function (id) {
        findById(id).then(data => {
            this.setData({
                item: data
            });
        });
        wx.stopPullDownRefresh();
    }
});
