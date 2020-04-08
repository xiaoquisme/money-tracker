const { getDatabase } = require('./utils');

async function findAllMoneyIncomeTypes(cloud) {
    const db = getDatabase(cloud);
    return db.collection("money-types")
        .where({
            value: "INCOME",
            isActive: true,
        }).get();
}

async function addMoneyType(data, cloud) {
    const db = getDatabase(cloud);
    return db.collection("money-types")
        .add({
            data: { ...data }
        });
}

async function findAllMoneyLostTypes(cloud) {
    const db = getDatabase(cloud);
    return db.collection("money-types")
        .where({
            value: "LOST",
            isActive: true,
        }).get();
}

module.exports = {
    findAllMoneyIncomeTypes,
    addMoneyType,
    findAllMoneyLostTypes,
};
