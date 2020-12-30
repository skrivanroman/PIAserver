const fs = require('fs').promises;
const path = require('path');
const jimp = require('jimp');

const edit = async (currPath) => {
    const stats = await fs.lstat(currPath)

    if (stats.isDirectory()) {
        const dir = await fs.readdir(currPath);

        return dir.forEach(async (file) => {
            return edit(path.join(currPath, file));
        });
    }
    else if (/.+(\.png)|(\.jpg)$/.test(currPath)) {
        
        const img = await jimp.read(currPath);

        if(/\.jpg$/.test(currPath)){
            img.opaque().opacity(0.07).write(currPath.replace(/\.jpg$/, '.png'));
            await fs.unlink(currPath);
            return; 
        }
        img.opaque().opacity(0.07).write(currPath);
    }
    else {
        return;
    }
}
(async () => {
    try{
        edit('../PIAserver/test');
    }catch(err){
        console.log(err);
    }
    
})();
