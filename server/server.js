require('dotenv').config();
const express = require('express')
    , bodyParser = require('body-parser')
    , AWS = require('aws-sdk')
    , db = require('./db')
    , PORT = process.env.SERVER_PORT
    , app = express();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const S3 = new AWS.S3();

app.post('/api/user/image', (req, res) => {
  const buffer = new Buffer(req.body.file.replace(/^.*;base64,/, ''), 'base64');
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Body: buffer,
    Key: req.body.filename,
    ContentType: req.body.filetype,
    ACL: 'public-read'
  };

  S3.upload(params, (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(data);
  });
});

app.get('/api/users', (req, res) => {
  const users = db.get_users();
  res.status(200).send(users);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}.`));