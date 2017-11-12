require('dotenv').config();
const express = require('express')
  , bodyParser = require('body-parser')
  , AWS = require('aws-sdk') // import and require AWS
  , app = express();

AWS.config.update({ // AWS configuration
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const S3 = new AWS.S3(); // create instance of S3

app.use(bodyParser.json()); // need bodyParser for request body

app.post('/api/photo/:userID', (req, res) => { // front-end request sends chosen image to post endpoint
  const buffer = new Buffer(req.body.file.replace(/^data.*;base64,/, ""), 'base64');
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Body: buffer,
    Key: req.body.filename,
    ContentType: req.body.filetype,
    ACL: 'public-read'
  };
  S3.upload(params, (err, data) => { // image is uploaded to s3
    if (err) return res.status(500).send(err);
    else res.status(200).send(data);
  });
});

app.listen(process.env.SERVER_PORT, () => console.log(`Listening on ${process.env.SERVER_PORT}.`));