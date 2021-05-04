const fs = require('fs').promises;
const path = require('path');
const jimp = require('jimp');

const edit = (currPath, allImages) => {
    return new Promise(async resolve => {
        const stats = await fs.lstat(currPath);

        if (stats.isDirectory()) {
            const dir = await fs.readdir(currPath);

            return dir.forEach((file) => {
                return resolve(edit(`${currPath}/${file}`, allImages));
            });
        }
        else if (/.+(\.png)|(\.jpg)$/.test(currPath)) {

            allImages.push(currPath);
            //return allImages;
            //const img = await jimp.read(currPath);

            // if(/\.jpg$/.test(currPath)){
            //     img.opaque().opacity(0.07).write(currPath.replace(/\.jpg$/, '.png'));
            //     await fs.unlink(currPath);
            //     return; 
            // }
            // img.opaque().opacity(0.07).write(currPath);
        }
        resolve();
    });

}

const test = async () => {
    try {
        const allImages = [];
        await edit('templates', allImages);

        allImages.map(e => `${__dirname}/${e}`);
        let paths = allImages.join(',');
        await fs.writeFile('./post_production/paths.txt', paths);

        const { spawn } = require('child_process');
        const pyProg = spawn('python', ['./post_production/test.py', `${__dirname}/post_production/paths.txt`],); //{encoding:'latin-1'}

        pyProg.stdout.on('data', data => {
            console.log(data.toString());
        });
        pyProg.stderr.on('data', (data) => {

            console.log(data.toString());
        });

    } catch (err) {
        console.log(err);
    }
}
test();
