const multer = require('multer');

let uploadImage = (folder) =>{
    const storage = multer.diskStorage({
        destination: `public/images/${folder}`,
        filename: function (req, file, cb){
            // console.log(file);
            let originalName = file.originalname;
            const uniqueSuffix = Date.now() + '-' + originalName
            cb(null, uniqueSuffix)
        }
    })

    const upload = multer({ storage: storage }).single("img");
    return upload;
}

module.exports = uploadImage;