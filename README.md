#### Summary
These are basic instructions for setting up Amazon S3 for uploading photos. The app uses a file input and FileReader to choose an image from the user's local machine. It then uses axios to make a POST request to the server, where the image data is uploaded to S3. The response contains a url for accessing the uploaded image.

#### AWS Account
- Sign up for AWS account. You will have to enter your credit card information and name and address. For small projects, your usage will hopefully remain under the Free Tier limits and you will not receive charges.
- As part of the account creation: 
    - You will create and name a bucket. 
    - You will select a region. Each region is associated with a region code. Those codes can be found here: http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html. Copy the region code associated with the region you selected.
    - You will also obtain an Access Key ID and Secret Access Key.
- You will need the bucket name, region code, Access Key ID, and Secret Access Key as credentials to configure S3 in your server.

#### Front End
- If you are uploading image to S3 from a local machine, you will likely need either an input or some kind of drop zone for uploading your images. This app uses a simple file input( ```<input type=text />``` )
- This app uses FileReader to choose a local image.

<details><summary>More info about FileReader</summary>

    - FileReader is a file API built into HTML5 for uploading local images to the web.
    - There are four basic steps for using FileReader in an app like this:
        0. Create an instance of FileReader (often using a variable named "reader").
        0. Save the 

</details>