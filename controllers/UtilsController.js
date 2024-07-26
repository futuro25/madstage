"use strict"

const logger     = require('../utils/logger');
const utils = require('../utils/utils');
const self       = {};
const Log   = require('../models/log.model');

self.upload = async (req, res) => {  
  if (req.files?.file.tempFilePath) {
    const assetUrl = await utils.uploadImage(req.files.file.tempFilePath)
    return res.json(assetUrl);
  } else {
    return false;
  }
}

self.getLogs = async (req, res) => {  
  try {
    const logs = await Log.find({deletedAt: null}).sort({'createdAt': -1}).limit(50);
    logger.info('get logs', JSON.stringify(logs))
    res.json(logs);
  } catch (e) {
    logger.error('get logs', e.message)
    res.json({error: e.message})
  }
};

self.createLog = async (action, data) => {  
  try {
    const log = {
      'action': action,
      'data': data
    }
    const newLog = await Log.create(log);
    logger.info('create log', JSON.stringify(log))
    return newLog;
  } catch (e) {
    logger.error('create log', e.message)
    return {error: e.message}
  }
};


module.exports = self;