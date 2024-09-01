"use strict"

const logger = require('../utils/logger');
const self = {};

self.index = async (req, res) => {
  try {
    console.log('MERCADOPAGO', req.body)
    logger.info('MERCADOPAGO', req.body)

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
  } catch (e) {
    logger.error('failed created receipts', e.message)
    console.log('failed created receipts', e.message)
    res.status(e.status || 500).json({ error: e.message })
  }
};


module.exports = self;