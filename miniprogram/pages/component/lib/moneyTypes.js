async function getIncomeTypes() {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'money-types-income'
        }
    }).then(res => res.result.data);
}

async function getLostItems() {
   return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'money-types-lost'
        }
    }).then(res => res.result.data);
}

export {
    getIncomeTypes,
    getLostItems
};
