const PurchaseModel = require('../PurchaseModel');

module.exports = async () => {
    await Promise.all([
        PurchaseModel.create({ amount: 1.2, description: 'test_purchase_1' }),
        PurchaseModel.create({ amount: 2.3, description: 'test_purchase_2' }),
        PurchaseModel.create({ amount: 5.5, description: 'test_purchase_3' }),
        PurchaseModel.create({ amount: 10, description: 'test_purchase_4' }),
        PurchaseModel.create({ amount: 200, description: 'test_purchase_5' })
    ])
}