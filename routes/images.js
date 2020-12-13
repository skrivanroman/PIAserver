const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const imageDirPath = path.join(__dirname, '..', 'public', 'images');

router.get('/', async (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    try{
      const files = await fs.readdir(imageDirPath);

      files.forEach(file => {
        res.write(`<img src="${file}">`);
      });
    }
    catch(err){
      console.log(err);
    }
    finally{
       res.end();
    }
   
    
});

router.post('/', async (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});

  let fulljson = '';

  req.on('data', chunk => {
    fulljson += chunk;

  });
 

  req.on('end', async () => {
    try{
      const {length: imageCount} = await fs.readdir(imageDirPath);
      const {images} = JSON.parse(fulljson);

      images.forEach( async imgData => {
        await fs.writeFile(`${path.join(imageDirPath, imageCount.toString())}.png`, imgData ,'base64');
        imageCount++;
      });
    }
    catch(err){
      console.log(err);
    }
    finally{
      res.end();
    }
  
  });
  
});

router.delete('/', async (req, res) => {
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

module.exports = router;