async function findAllMoneyIncomeTypes(db) {
    return db.collection("money-types")
        .where({
            value: "INCOME",
            isActive: true,
        }).get();
}

async function addMoneyType(data, db) {
    return db.collection("money-types")
        .add({
            data: { ...data }
        });
}

async function findAllMoneyLostTypes(db) {
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
