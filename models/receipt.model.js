var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var withholdingSchema = new Schema({
  'name': { type: String, required: false },
  'amount': { type: String, required: false },
  'createdAt': { type: String, required: false },
  'updatedAt': { type: String, required: false },
  'deletedAt': { type: String, required: false },
})

var invoicedPeriodSchema = new Schema({
  'periodId': { type: String, required: false },
  'amount': { type: String, required: false },
})

var receiptSchema = new Schema({
  'receiptNumber': { type: String, required: false },
  'amount': { type: String, required: false },
  'bankName': { type: String, required: false },
  'paymentMethod': { type: String, required: false },
  'invoice': { type: String, default: [], required: false },
  'invoicedPeriods': { type: [invoicedPeriodSchema], default: [], required: false },
  'itemsDetail': { type: String, required: false },
  'detail': { type: String, required: false },
  'withholdings': { type: [withholdingSchema], default: [], required: false },
  'createdAt': { type: String, required: false },
  'updatedAt': { type: String, required: false },
  'deletedAt': { type: String, required: false },
})

module.exports = mongoose.model('Receipt', receiptSchema);
