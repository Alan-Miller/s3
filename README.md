# S3

## Summary
These are basic instructions for setting up Amazon S3 for uploading photos. The app uses a file input and FileReader to choose an image from the user's local machine. It then uses axios to make a POST request to the server, where the image data is uploaded to S3. The response contains a url for accessing the uploaded image.

## AWS Account
- Sign up for AWS account. You will have to enter your credit card information and name and address. For small projects, your usage will hopefully remain under the Free Tier limits and you will not receive charges.
- As part of the account creation: 
    - You will create and name a bucket. 
    - You will select a region. Each region is associated with a region code. Those codes can be found here: http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html. Copy the region code associated with the region you selected.
    - You will also obtain an Access Key ID and Secret Access Key.
- You will need the bucket name, region code, Access Key ID, and Secret Access Key as credentials to configure S3 in your server.


## .env file
- Create an .env file at the top level of the project folder.
- Save the bucket name, region code, Access Key ID, and Secret Access Key from your account creation process in this file, storing each in an environment variable.

```
    AWS_SECRET_ACCESS_KEY=longerSTRINGofNUMBERSandLETTERS
    AWS_ACCESS_KEY_ID=shorterSTRINGofNUMBERSandLETTERS
    AWS_REGION=region-code
    AWS_BUCKET=bucket-name

```

## Front End: input event and FileReader
- If you intend for users to upload images to S3 from their local machines, you will likely need either an input or some kind of drop zone for uploading user images. This app has a front end built in React and uses a simple file input tag ( ```<input type=file />``` ) to choose a file. The input has an onChange event listener that captures the input event and stores the file in a variable called "file" (see ImageUploader.js to see how this was done).
- This app then uses FileReader to read the stored file before sending it to the server to be uploaded to S3.

<details><summary>More explanation about FileReader</summary>

- FileReader is not an S3 thing. It is a file API built into HTML5 for uploading local images to the web. Most browsers support it. No installation is required.

- There are four basic steps for using FileReader in an app like this:
    1. Create an instance of FileReader and store it in a variable (often named ```reader```).
    2. Save the file in variable (often named "file"). This is the same file mentioned above, 
    the file captured by the input event.
    3. Tell the reader to read (i.e., interpret) the file using a built-in FileReader method. Here, 
    we use the .readAsDataURL method to read image data, but there are other methods too, such as 
    the .readAsText method for reading text data.
    4. Use the built-in .onload method to tell FileReader what to do with the file once the reader 
    has read it. Once the file has been read, FileReader stores the file in the .result property on 
    the reader (e.g., in "reader.result" if the FileReader instance was named "reader").

- Here is an example of those four steps, taken from the code in this app:
    
```js
    const reader = new FileReader(); // 1. create instance of FileReader
    const file = e.target.files[0];  // 2. save file from input event in a variable
    reader.readAsDataURL(file);      // 3. tell reader to read file using built-in method
    reader.onload = () => {          // 4. tell reader what to do with file once read
        const pic = {
        file: reader.result, // .result is where the result of the read operation is stored
        filename: file.name,
        filetype: file.type
        }
        this.setState({ pic }); // once the file is read, the pic object is set to this.state
    }
```

</details>

<br/>
        
- Finally, this app uses a button (conditionally rendered once an image has been set to ```this.state```) which triggers a function that passes the value on ```this.state.pic``` to a POST request, sending it to the server.


## Server
- Install 'aws-sdk', 'dot-env', and 'body-parser' into the project, along with anything else you need. Require these at the top of your server file.
- Using your AWS variables, configure AWS with the accessKeyId, secretAccessKey, and region values stored in your .env file, then create an instance of S3.
- Create a POST endpoint to accept the new image from the request body, and use Buffer to format the data. Here, we also use a Regular Expression to remove a long "data...;base64," string from the file information.
- A params object is created. The bucket name goes on the Bucket property, the buffer goes on Body, the filename (coming in on the req.body) goes on Key, and filetype (also on req.body) goes on ContentType. ACL is an optional key-value pair that allows for more to be done with the uploaded image.
- Using the built-in .upload method and passing in the params object, upload the image. In the callback function for the .upload method, accept an error and the return data. Handle the error if necessary and send back the data if successful. The data object sent back will include a property on which is stored the uploaded image's new S3 url. This url can be stored in a database or used to access the uploaded image.

<details> <summary> server.js example file </summary> 

```js
    require('dotenv').config(); // 'dot-env' gives us acces to the .env variables
    const express = require('express')
      , bodyParser = require('body-parser') 
      , AWS = require('aws-sdk') // import and require AWS
      , app = express();

    AWS.config.update({ // AWS configuration using .env variables
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

```

</details>