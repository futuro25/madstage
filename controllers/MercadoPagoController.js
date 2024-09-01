"use strict"

const logger = require('../utils/logger');
const config = require('../config');
const mercadopago = require('mercadopago');
const self = {};

self.index = async (req, res) => {
  try {
    console.log(req.body)
  } catch (e) {
    logger.error('failed created receipts', e.message)
    console.log('failed created receipts', e.message)
    res.status(e.status || 500).json({ error: e.message })
  }
};

self.getPreferencePaymentId = async (req, res) => {

  const client = new mercadopago.MercadoPagoConfig({ accessToken: config.mercadopago.accessToken });
  const preference = new mercadopago.Preference(client);

  const body = {
    ...config.mercadopago.preference,
    items: [
      {
        id: '1234',
        title: 'Dummy Title',
        description: 'Dummy description',
        picture_url: 'http://www.myapp.com/myimage.jpg',
        category_id: 'products',
        quantity: 1,
        currency_id: 'ARG',
        unit_price: 10,
      },
    ],
  };

  try {
    const response = await preference.create({ body })
    console.log(response)
    console.log("MercadoPago INFO", response)
    res.json(response);
  } catch(e) {
    console.log(e)
    return e;
  }
};


module.exports = self;



// SAMPLE HEADER
// `ts=1704908010,v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839`

// SAMPLE BODY
// {
//   "id": 12345,
//   "live_mode": true,
//   "type": "payment",
//   "date_created": "2015-03-25T10:04:58.396-04:00",
//   "user_id": 44444,
//   "api_version": "v1",
//   "action": "payment.created",
//   "data": {
//       "id": "999999999"
//   }
//  }

// CLAVE SECRETA
// c1f07d99e02e3b439b0d2a852ecb4ff7e9c1eeed121f916cf80e9b23417f7bc0


// marketplace_fee: 0,
// payer: {
//   name: 'Test',
//   surname: 'User',
//   email: 'your_test_email@example.com',
//   phone: {
//     area_code: '11',
//     number: '4444-4444',
//   },
//   identification: {
//     type: 'CPF',
//     number: '19119119100',
//   },
//   address: {
//     zip_code: '06233200',
//     street_name: 'Street',
//     street_number: 123,
//   },
// },
// back_urls: {
//   success: 'http://test.com/success',
//   failure: 'http://test.com/failure',
//   pending: 'http://test.com/pending',
// },
// differential_pricing: {
//   id: 1,
// },
// expires: false,
// additional_info: 'Discount: 12.00',
// auto_return: 'all',
// binary_mode: true,
// external_reference: '1643827245',
// marketplace: 'marketplace',
// notification_url: 'http://notificationurl.com',
// operation_type: 'regular_payment',
// payment_methods: {
//   default_payment_method_id: 'master',
//   excluded_payment_types: [
//     {
//       id: 'ticket',
//     },
//   ],
//   excluded_payment_methods: [
//     {
//       id: '',
//     },
//   ],
//   installments: 5,
//   default_installments: 1,
// },
// shipments: {
//   mode: 'custom',
//   local_pickup: false,
//   default_shipping_method: null,
//   free_methods: [
//     {
//       id: 1,
//     },
//   ],
//   cost: 10,
//   free_shipping: false,
//   dimensions: '10x10x20,500',
//   receiver_address: {
//     zip_code: '06000000',
//     street_number: 123,
//     street_name: 'Street',
//     floor: '12',
//     apartment: '120A',
//   },
// },
// statement_descriptor: 'Test Store',