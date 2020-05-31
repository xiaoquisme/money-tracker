const { getDatabase } = require('./utils');

const dbName = 'money-types';

async function findAllMoneyIncomeTypes(cloud) {
    const db = getDatabase(cloud);
    return db.collection(dbName)
        .where({
            value: 'INCOME',
            isActive: true,
        }).get();

}
async function addMoneyType(data, cloud) {
    const db = getDatabase(cloud);
    return db.collection(dbName)
        .add({
            data: { ...data }
        });

}
async function findAllMoneyLostTypes(cloud) {
    const db = getDatabase(cloud);
    return db.collection(dbName)
        .where({
            value: 'LOST',
            isActive: true,
        }).get();
}

module.exports = {
    findAllMoneyIncomeTypes,
    addMoneyType,
    findAllMoneyLostTypes,
};
