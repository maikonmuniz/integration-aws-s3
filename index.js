require("dotenv").config()

const express = require('express')

const app = express();

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: "",
    accessKeyId: "",
    region: "sa-east-1",
});

const BUCKET = "";
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: BUCKET,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname)
        }
    })
})

app.get("/allFile", async (req, res) => {
  let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
  let x = r.Contents.map(item => item.Key);
  console.log(x);
  res.send(x);
})

app.get("/download/:id", async (req, res) => {
  const filename = req.params.id;
  let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
  console.log(x.Body.toString());
  res.send(x.Body);
})

app.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename
  await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
  res.send("Delete Successfully ")

})

app.listen(3001);
