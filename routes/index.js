const express = require('express');
const fs = require('fs').promises;
const tesseract =  require('tesseract.js');
const path = require('path');

const router = express.Router();
const imageDirPath = path.join(__dirname, '..', 'public', 'images');
const vinImagePath = path.join(__dirname, '..', 'vin', 'images');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});


router.get('/image', async (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    try{
      const files = await fs.readdir(imageDirPath);

      files.forEach(file => {
        res.write(`<img src="${path.join('images', file)}">`);
      });
    }
    catch(err){
      console.log(err);
    }

    res.end();
    
});

router.post('/image', async (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});

  let fulljson = '';

  req.on('data', chunk => {
    fulljson += chunk;

  });
 

  req.on('end', async () => {
    try{
      const imageCount = (await fs.readdir(imageDirPath)).length;
      const images = JSON.parse(fulljson).images;

      images.forEach( async imgData => {
        await fs.writeFile(`${path.join(imageDirPath, imageCount.toString())}.png`, imgData ,'base64');
        imageCount++;
      });
    }
    catch(err){
      console.log(err);
    }
    
    res.end();
  
  });
  
});

router.delete('/image', async (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
  try{
    const files = await fs.readdir(imageDirPath);

    files.forEach( async file => {
      await fs.unlink(path.join(imageDirPath, file));
    });
  }
  catch(err){
    console.log(err);
  }
  
});

router.post('/vin', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});

  let fulljson = '';

  req.on('data', chunk => 
    fulljson += chunk
  );

  req.on('end', async () => {
    try{
      const imageCount = (await fs.readdir(vinImagePath)).length;
      const imagePath = path.join(vinImagePath, imageCount.toString());
      const image = JSON.parse(fulljson).image;
      
      await fs.writeFile(`${imagePath}.png`, image ,'base64');

      const {data: {text}} = await tesseract.recognize(`${imagePath}.png`, 'eng');

      console.log(text);
      res.write(text);
    }
    catch(err){
      console.log(err);
    }  

      res.end();
  });

});
module.exports = router;
