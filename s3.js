require('dotenv').config();
const aws = require('aws-sdk')
const uuid =require('uuid').v4;


const region = process.env.AWS_REGION
const bucketName =process.env.AWS_BUCKETNAME
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secrectAccessKey = process.env.AWS_SECRET_ACCESS_KEY_ID

aws.config.update({ 
    region,
    credentials: {
        accessKeyId: accessKeyId, 
        secretAccessKey:secrectAccessKey
    }

});



exports.generateUploadURL = async(file) =>{
    const s3 = new aws.S3();
    const params = {
        Bucket: bucketName,
        Key: `uploads/${uuid()}-${file.originalname}`,
        Body: file.buffer,
        Expires: 60
    };
    console.log("bucket success!")
    const uploadURL = await s3.upload(params).promise();
    console.log(uploadURL)
    return uploadURL

}; 


