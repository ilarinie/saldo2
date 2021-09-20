/* eslint-disable */
db.getCollection('purchases')
  .find({})
  .forEach(function (purchase) {
    const ilariId = '61409e603ec03c3cb2361973';
    const olliId = '6140abd63ec03c3cb236197f';

    if (purchase.amount < 0) {
      purchase.amount = purchase.amount * -1;
      purchase.createdBy = olliId;
      purchase.benefactors = [
        {
          user: new ObjectId(ilariId),
          amountBenefitted: purchase.amount,
          amountPaid: 0,
        },
        {
          user: new ObjectId(olliId),
          amountBenefitted: 0,
          amountPaid: purchase.amount,
        },
      ];
    } else {
      purchase.createdBy = ilariId;
      purchase.benefactors = [
        {
          user: new ObjectId(ilariId),
          amountBenefitted: 0,
          amountPaid: purchase.amount,
        },
        {
          user: new ObjectId(olliId),
          amountBenefitted: purchase.amount,
          amountPaid: 0,
        },
      ];
    }
    purchase.budgetId = new ObjectId('6140bfb969820baa0981d6f2');
    db.getCollection('purchases').save(purchase);
  });
