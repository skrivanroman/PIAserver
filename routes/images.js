const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const database = require('../database/db-connection');
const Joi = require('joi');
const validateReq = require('./validate-req');

const router = express.Router();
const imageDirPath = path.join(__dirname, '..', 'public', 'images');

const photoSchema = Joi.object().keys({
  photos: Joi.array().items(Joi.string()).required(),
  sessionId: Joi.number().integer().min(1).required()
});

router.get('/', async (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  try {
    const files = await fs.readdir(imageDirPath);

    files.forEach(file => {
      res.write(`<img src="${file}">`);
    });
  }
  catch (err) {
    console.log(err);
  }
  finally {
    res.end();
  }

});

router.post('/', validateReq(photoSchema), async (req, res) => {
  try {
    const {photos, sessionId} = req.body;
    const [{temp_path}] = await database.query(`SELECT temp_path FROM photo_sessions WHERE id_ses = ${sessionId}`);
    tempPath = path.join(temp_path);

  }
  catch (err) {
    console.log(err);
    res.write(err);
  }
  finally {
    res.end();
  }

});

router.delete('/', async (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  try {
    const files = await fs.readdir(imageDirPath);

    files.forEach(async file => {
      await fs.unlink(path.join(imageDirPath, file));
    });
  }
  catch (err) {
    console.log(err);
  }

});

module.exports = router;