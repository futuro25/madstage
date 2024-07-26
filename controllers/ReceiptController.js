"use strict"

const logger = require('../utils/logger');
const Receipt = require('../models/receipt.model');
const Invoice = require('../models/billing.model');
const billingStates = require('../utils/billingStates.js');
const self = {};

self.createReceipt = async (req, res) => {
  try {
    let createdReceipts = [];

    for (const receiptToCreate of req.body) {
      const invoice = receiptToCreate.invoice;
      const currentInvoice = await Invoice.findOne({ _id: invoice });

      var createdReceipt = await createInvoiceReceipt(receiptToCreate);
      createdReceipts.push(createdReceipt);

      await updateInvoiceWithReceipt(currentInvoice, createdReceipt);
    }

    logger.info('created receipts', JSON.stringify(createdReceipts))
    return res.json(createdReceipts);
  } catch (e) {
    logger.error('failed created receipts', e.message)
    console.log('failed created receipts', e.message)
    res.status(e.status || 500).json({ error: e.message })
  }
};

self.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find({ deletedAt: null }).sort({ createdAt: -1 });;
    res.json(receipts);
  } catch (e) {
    logger.error('get receipts', e.message)
    res.json({ error: e.message })
  }
};

self.getReceiptById = async (req, res) => {
  try {
    const receiptId = req.params.receiptId;
    const receipt = await Receipt.findOne({ _id: receiptId, deletedAt: null })
    logger.info('get receipt by id', receiptId)
    res.json(receipt);
  } catch (e) {
    logger.error('get receipt by id', e.message)
    res.json({ error: e.message })
  }
};

self.getReceiptByIdAndUpdate = async (req, res) => {
  try {
    const receiptId = req.params.receiptId;

    const filter = { _id: receiptId, deletedAt: null };
    const update = req.body;

    await Receipt.findOneAndUpdate(filter, update)
    const updatedReceipt = await Receipt.findOne({ _id: receiptId })
    console.log('update receipt by id', receiptId, ' update', JSON.stringify(update))
    res.json(updatedReceipt);
  } catch (e) {
    logger.error('update receipt by id', e.message)
    res.json({ error: e.message })
  }
};

self.deleteReceiptById = async (req, res) => {
  try {
    const receiptId = req.params.receiptId;

    const filter = { _id: receiptId };
    const update = { deletedAt: getFormattedNewDate() };

    await Receipt.findOneAndUpdate(filter, update)
    const updatedReceipt = await Receipt.findOne({ _id: receiptId })
    logger.info('delete receipt by id', receiptId)
    res.json(updatedReceipt);
  } catch (e) {
    logger.error('delete receipt by id', e.message)
    res.json({ error: e.message })
  }
};

self.deleteAllReceipts = async (req, res) => {
  try {
    const filter = { deletedAt: null }
    const update = { deletedAt: getFormattedNewDate() };
    const updatedReceipt = await Receipt.updateMany(filter, update);
    res.json(updatedReceipt);
  } catch (e) {
    logger.error('delete all receipts', e.message)
    res.json({ error: e.message })
  }
}

const getFormattedNewDate = () => {
  return new Date().toISOString()
}

async function updateInvoiceWithReceipt(currentInvoice, createdReceipt) {
  let invoiceUpdateBody = {};
  let updatedInvoices = [];
  
  const invoiceReceipts = await findInvoiceReceipts(currentInvoice._id);
  const totalReceiptsAmount = invoiceReceipts.map(receipt => parseFloat(receipt.amount)).reduce((acc, newAmount) => acc + newAmount, 0);
  const totalWithholdingsAmount = invoiceReceipts
                                    .map(receipt => receipt.withholdings.map(withholding => parseFloat(withholding.amount))
                                      .reduce((acc, newAmount) => acc + newAmount, 0))
                                    .reduce((acc, newAmount) => acc + newAmount, 0);
  const total = totalReceiptsAmount - totalWithholdingsAmount;
  
  invoiceUpdateBody.receipts = [...currentInvoice.receipts, createdReceipt._id];
  invoiceUpdateBody.status = total >= parseFloat(currentInvoice.invoiceAmount) ? billingStates.CLOSED : billingStates.RECEIPT_CREATED;
  invoiceUpdateBody.paidInFull = invoiceUpdateBody.status === billingStates.CLOSED;

  const periodsToUpdate = currentInvoice.periods.map(period => {
    const foundPeriod = createdReceipt.invoicedPeriods.find(periodToFind => periodToFind.periodId === period._id.toString());
    if (foundPeriod) {
      period.receipts = [...period.receipts, createdReceipt._id];
    }
    return period;
  });
  
  invoiceUpdateBody.periods = periodsToUpdate;

  const filter = { _id: currentInvoice._id, deletedAt: null };
  updatedInvoices.push(await Invoice.findOneAndUpdate(filter, invoiceUpdateBody, { new: true }));

  console.log('invoiceUpdateBody', invoiceUpdateBody);
}

async function findInvoiceReceipts(invoice) {
  return await Receipt.find({ invoice: invoice, deletedAt: null });
}

async function createInvoiceReceipt(receiptToCreate) {
  const withholdings = receiptToCreate.withholdings.map(withholding => {
    return {
      name: withholding.name,
      amount: withholding.amount,
      createdAt: getFormattedNewDate(),
    }
  });

  const receiptBody = {
    'receiptNumber': receiptToCreate.receiptNumber,
    'amount': receiptToCreate.amount,
    'createdAt': getFormattedNewDate(),
    'bankName': receiptToCreate.bankName,
    'paymentMethod': receiptToCreate.paymentMethod,
    'invoice': receiptToCreate.invoice,
    'invoicedPeriods': receiptToCreate.invoicedPeriods,
    'itemsDetail': receiptToCreate.itemsDetail,
    'detail': receiptToCreate.detail,
    'withholdings': withholdings
  };

  console.log('receiptBody', receiptBody);
  const createdReceipt = await Receipt.create(receiptBody);
  return createdReceipt;
}

module.exports = self;