"use strict"

const logger     = require('../utils/logger');
const utils = require('../utils/utils');
const self       = {};
const Log   = require('../models/log.model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dijoga0up',
  api_key: '941448999678395',
  api_secret: '1JWhmHBIrQDjbBdwtuH9m0GiBpQ',
});

self.destroy = async (req, res) => {  
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.json(result);
  } catch(e) {
    res.json({error: e.message})
  }
}


self.uploadFromUrl = async (req, res) => {  
  if (req.body.url) {
    try {
      const assetUrls = await Promise.all(req.body.url.map(async (url) => {
        const url2 = await utils.uploadImage(url);
        return url2.url;
      }));
      return res.json({ uploads: assetUrls });
    } catch (error) {
      console.error('Error uploading images:', error);
      return res.status(500).json({ error: 'Error uploading images' });
    }
  } else {
    return res.status(400).json({ error: 'No URL provided' });
  }
};

self.upload = async (req, res) => {  
  if (req.files?.file.tempFilePath) {
    const assetUrl = await utils.uploadImage(req.files.file.tempFilePath)
    console.log(assetUrl)
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