const dotenv = require('dotenv');
dotenv.config()
const express= require('express');
const port=5500;
const multer = require('multer');
const s3test = require('./s3');
// const uuid =require('uuid').v4;
const app= express(); //產生 express application 物件

//upload-s3
const storage = multer.memoryStorage()

const fileFilter = (req, file ,cb)=>{
    if(file.mimetype.split('/')[0] === 'image'){
        cb(null, true);
    }else{
         cb(new Error('file is not of the correct type'),false);
    }
};
const images = multer({storage,fileFilter});
app.post('/upload',images.array('file'),async(req,res) =>{
    //取得圖片
    const file = req.files[0];
    const result = await s3test.generateUploadURL(file);
    console.log(req.files);
    if (!req.files) {
        return res.status(400).json({ error: 'No files were uploaded' });
    }
    res.json({status:'success',result});
});


app.listen(port,()=>{
    console.log(`伺服器啟動在 localhost:${port}`)
})