const { getTransactionData } = require('./getTransactionData.js');
const { getBuyerInfo } = require('./getBuyerInfo.js');
const { invoice } = require('./invoice.js');

const createInvoice = async (merchant, transaction) => {
  const tx = getTransactionData(transaction);
  const buyer = await getBuyerInfo(tx.buyerAddress);
  invoice(merchant, buyer, tx);
};

module.exports = { createInvoice };
