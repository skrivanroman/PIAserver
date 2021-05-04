const express = require('express')
const fs = require('fs').promises
const path = require('path')
const { decodeVinText, editImage, readImage } = require('../vin/decode-vin')
//const database = require('../database/db-connection');
const Joi = require('joi')
const validateReq = require('./validate-req')

const router = express.Router()

const imageSchema = Joi.object().keys({
    image: Joi.string().required(),
    desiredWidth: Joi.number().min(0).max(1).required(),
    desiredHeight: Joi.number().min(0).max(1).required(),
})

const vinTextSchema = Joi.object().keys({
    vin: Joi.string()
        .regex(/^[0-9ABCDEFGHJKLMNPRSTUVWXYZ]{17}$/)
        .required(),
})

router.post('/', validateReq(imageSchema), async (req, res) => {
    try {
        const { image: image64, desiredWidth, desiredHeight } = req.body
        const imgBuff = Buffer.from(image64, 'base64')

        await fs.writeFile('../public/images/test.png', imgBuff)

        const editedImgBuff = await editImage(
            imgBuff,
            desiredWidth,
            desiredHeight
        )
        const vin = await readImage(editedImgBuff)

        res.write(JSON.stringify({ vin }))
    } catch (err) {
        console.log(err)
        res.write(`${err}`)
    } finally {
        res.end()
    }
})

// router.post('/text', validateReq(vinTextSchema), async (req, res) => {
//   try{
//     const {vin} = req.body;
//     const {errortext: error, manufacturername: manuf, model} = await decodeVinText(vin);

//     if(!/^0.*/.test(error)){
//       throw new Error(error);
//     }
//     const tempPath = path.join(__dirname, '..', 'templates', manuf.toLowerCase(), model, `${model}.png`);
//     const template = await fs.readFile(tempPath, 'base64');

//     const {userName} = req.user;
//     const [{ id_use: userId } ] = await database.query(`SELECT id_use FROM users WHERE user_name = '${userName}';`);
//     await database.query(`INSERT INTO photo_sessions (vin, temp_path, id_use) VALUES ('${vin}', '${tempPath.replace(/\\+/g, '/')}', ${userId});`);
//     const [{sessionId}] = await database.query('SELECT MAX(id_ses) AS sessionId FROM photo_sessions;');

//     res.write(JSON.stringify({template, sessionId}));
//   }
//   catch(err){
//     console.log(err);
//     res.write(`${err}`);
//   }
//   finally{
//     res.end();
//   }
// });

module.exports = router
