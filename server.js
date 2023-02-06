const s3 = require('./s3');
const db = require('./db');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config()
const multer = require('multer');
const cors = require('cors');
const express= require('express');
const app=express(); //產生 express application 物件

const port=process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

// const corsOptions = {
//     origin: "*",
//     optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

app.get('/',(req, res)=>{
    res.render('index')
});


//multer-s3
const storage = multer.memoryStorage()

const fileFilter = (req, file ,cb)=>{
    if(file.mimetype.split('/')[0] === 'image'){
        cb(null, true);
    }else{
         cb(new Error('file is not of the correct type'),false);
    }
};
const images = multer({storage,fileFilter});

//新增資料庫資料
app.post('/upload',images.array('file'),async(req,res) =>{
    try{
        //取得圖片
        const file = req.files[0];
        //取得文字
        const message = req.body.message;
        //cdn網域
        const cdn = process.env.AWS_CLOUDFRONT_URL;

        if (message==='' || file===null){
            res.status(400).json({
                'error': true,
                'message': '尚有欄位為空'
            })
        }else{
            const result = await s3.generateUploadURL(file);
            console.log(file,'55');
            if (!req.files) {
             return res.status(400).json({ error: 'No files were uploaded' });
            }

            const insertdata = (key) =>{
                return result[key]
            }

            const cdnurl=cdn + insertdata('Location').split('com')[1]
            await db.insertDatas(message,cdnurl);
            
            res.status(200).json({ok:true,result});
        }
    }catch (err) {
        console.error(err)
        res.status(500).json({
            'error': true,
            'message': '伺服器內部錯誤'
        })
        }
});    
// 取得資料庫資料
app.get('/upload',async(req,res)=>{
    try{
        const getDatas = await db.getDatas()
        res.status(200).json({data: getDatas})
    } catch (err) {
        console.error(err)
        res.status(500).json({
            'error': true,
            'message': '伺服器內部錯誤'
        })
    }
           
});


app.listen(port,()=>{
    console.log(`伺服器啟動在 localhost:${port}`)
})