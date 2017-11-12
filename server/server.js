require('dotenv').config();
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET, SERVER_PORT } = process.env;
const express = require('express')
  , bodyParser = require('body-parser')
  , cors = require('cors')
  , AWS = require('aws-sdk')
  , db = require('./db')
  , app = express();

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});
const S3 = new AWS.S3();

app.use(bodyParser.json({limit: '50mb'}));

app.post('/api/user/image', (req, res) => {
  const buffer = new Buffer(req.body.file.replace(/^.*;base64,/, ''), 'base64');
  const params = {
    Bucket: AWS_BUCKET,
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

app.post('/api/photo/:userID', (req, res) => {
  console.log('user ID', req.params.userID);
  const buf = new Buffer(req.body.file.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  const params = {
    Bucket: AWS_BUCKET,
    Body: buf,
    Key: req.body.filename,
    ContentType: req.body.filetype,
    ACL: 'public-read'
  };
  console.log('params', params);
  S3.upload(params, (err, data) => {
    console.log('data', data);
    console.log('err', err);
    if (err) return res.status(500).send(err);
    let user = db.get_user_by_id(+req.params.userID);
    user.img = data;
    res.status(200).send(data);
  });
});

app.listen(SERVER_PORT, () => console.log(`Listening on ${SERVER_PORT}.`));