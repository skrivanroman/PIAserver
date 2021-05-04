const axios = require('axios')
const { createWorker } = require('tesseract.js')
const jimp = require('jimp')
const fs = require('fs').promises
const sizeOf = require('buffer-image-size')

const decodeVin = {}

decodeVin.decodeVinText = async vin => {
    const {
        data: { Results },
    } = await axios.get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin.trim()}?format=json`
    )

    const search = ['Error Text', 'Manufacturer Name', 'Model', 'Series']
    let carData = {}
    Results.forEach(element => {
        if (search.includes(element.Variable)) {
            carData[element.Variable.replace(/\s+/g, '').toLowerCase()] =
                element.Value
        }
    })

    return carData
} //('WA1CVBF12KD031461');*/

// (async function getModels() {
//     const {data:{Results}} = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/WA1CVBF12KD031461?format=json`);

//     Results.forEach(element => {
//         console.log(element.Variable, element.Value);
//         // if(/[AQ][0-9]/.test(element.Model_Name)){
//         //     console.log(element.Model_Name);
//         // }
//     });

// })();

decodeVin.readImage = async imageBuffer => {
    const worker = createWorker()
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHJKLMNPRSTUVWXYZ',
    })

    const {
        data: { text },
    } = await worker.recognize(imageBuffer)
    const editedText = text.trim().replace(/\s+/g, '')

    if (editedText == 'WA1CVBF12KD031461') console.log('yay')
    else console.log('nay')

    console.log(`${editedText}`)

    await worker.terminate()

    return editedText
} //();

decodeVin.editImage = async (imageBuffer, desiredWidth, desiredHeight) => {
    const image = await jimp.read(imageBuffer)
    const { width, height } = sizeOf(imageBuffer)

    const newWidth = Math.floor(width * desiredWidth)
    const newHeight = Math.floor(height * desiredHeight)
    const x = Math.floor((width - newWidth) / 2)
    const y = Math.floor(height / 2 - newHeight / 2)

    image.crop(x, y, newWidth, newHeight)
    image.quality(100)
    //image.rotate(180);
    image.normalize()
    image.greyscale()
    image.brightness(0.25)
    image.contrast(0.5)

    const redableImage = await image.getBufferAsync(jimp.MIME_JPEG)
    await fs.writeFile('vin/fullTest.jpg', redableImage)

    return redableImage
}

module.exports = decodeVin
