async function deleteItemAsync(data) {
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

export {
    deleteItemAsync
};
