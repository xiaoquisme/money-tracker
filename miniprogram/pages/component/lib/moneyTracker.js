async function deleteItem(data) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'delete-money-tracker',
            data: {
                id: data._id
            }
        }
    });
}

async function findById(id) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'findById',
            data: {
                id: id,
            }
        }
    }).then(res => res.result.data[0]);
}

export {
    findById,
    deleteItem
};
