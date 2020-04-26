const transactionData = {};

const getTransactionData = (transaction) => {
  transactionData.date = new Date(transaction.Transaction.BlockTimestamp * 1000);
  transactionData.buyerAddress = transaction.EventData.EventParameters.src;
  transactionData.merchantAddress = transaction.EventData.EventParameters.dst;
  transactionData.value = (transaction.EventData.EventParameters.wad / 1e18);

  return transactionData;
};

module.exports = { getTransactionData };
