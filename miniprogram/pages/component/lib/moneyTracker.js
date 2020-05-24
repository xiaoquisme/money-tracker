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

async function addItem(data) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'add-money-tracer',
            data: data,
        }
    });
}

async function updateItem(data) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'update-money-tracer',
            data: data,
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
    deleteItem,
    addItem,
    updateItem,
};
