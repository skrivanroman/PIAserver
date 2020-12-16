const express = require('express');
const fs = require('fs').promises;
const tesseract = require('tesseract.js');
const path = require('path');

const router = express.Router();
const vinImagePath = path.join(__dirname, '..', 'vin', 'images');

router.post('/', async (req, res) => {
  try {
    const { length: imageCount } = await fs.readdir(vinImagePath);
    const imagePath = path.join(vinImagePath, imageCount.toString());
    const { image } = req.body;

    await fs.writeFile(`${imagePath}.png`, image, 'base64');

    const { data: { text } } = await tesseract.recognize(`${imagePath}.png`, 'eng');

    console.log(text);
    res.write(text);
  }
  catch (err) {
    console.log(err);
  }
  finally {
    res.end();
  }

});

module.exports = router;