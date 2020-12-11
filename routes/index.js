const { response } = require('express');
const express = require('express');
const fs = require('fs').promises;
const router = express.Router();
const imageDirPath = `${__dirname}/../public/images`;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get("/image", async (request, response) => {
    response.writeHead(200, {"Content-Type": "text/html"});
    try{
      const files = await fs.readdir(imageDirPath);

      files.forEach(file => {
        response.write(`<img src="images/${file}">`);
      });
    }
    catch(err){
      console.log(err);
    }

    response.end();
    
});

router.post("/image", async (request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"});

  console.log("good");
  let fulljson = "";

  request.on("data", chunk => {
    fulljson += chunk;
    console.log("recived");
  });
 

  request.on("end", async () => {
    try{
      let imageCount = (await fs.readdir(imageDirPath)).length;
      let images = JSON.parse(fulljson).images;

      images.forEach( async imgData => {
        await fs.writeFile(`images/${imageCount}.jpg`, imgData ,"base64");
        imageCount++;
      });
    }
    catch(err){
      console.log(err);
    }
    
    response.end();
  
  });
  
});

router.delete("/image", async (request, response) => {
  response.writeHead(200, {"Content-Type": "text/html"});
  try{
    const files = await fs.readdir(imageDirPath);

    files.forEach( async file => {
      await fs.unlink(`/images/${file}`);
    });
  }
  catch(err){
    console.log(err);
  }
  
});

router.post('/vin', (req, res) => {

});
module.exports = router;
