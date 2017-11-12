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
- If you are uploading image to S3 from a local machine, you will likely need either an input or some kind of drop zone for uploading your images. This app has a front end built in React and uses a simple file input( ```<input type=file />``` ) to choose a file. The input has an onChange event listener that captures the input event and stores the file in a variable called "file" (see ImageUploader.js to see how this was done).
- This app then uses FileReader to read the stored file.

    <details><summary>More info about FileReader</summary>

        • FileReader is a file API built into HTML5 for uploading local images to the web.
        • There are four basic steps for using FileReader in an app like this:
            1. Create an instance of FileReader and store it in a variable (often named "reader").
            2. Save the file in variable (often named "file"). This is the same file mentioned above, 
            the file captured by the input event.
            3. Tell the reader to read (i.e., interpret) the file using a built-in FileReader method. Here, 
            we use the .readAsDataURL method to read image data, but there are other methods too, such as 
            the .readAsText method for reading text data.
            4. Use the built-in .onload method to tell FileReader what to do with the file once the reader 
            has read it. Once the file has been read, FileReader stores the file in the .result property on 
            the reader (e.g., in "reader.result" if the FileReader instance was named "reader").
        • Here is an example of these steps (the same code used in this app):
        
```js
    const reader = new FileReader(); // create instance of FileReader
    const file = e.target.files[0]; // save file from input event in a variable
    reader.readAsDataURL(file); // tell reader to read file using built-in method
    reader.onload = () => { // tell reader what to do with file once read
        const pic = {
        file: reader.result, // .result is where the result of the read operation is stored
        filename: file.name,
        filetype: file.type
        }
        this.setState({ pic })
    }
```

    </details>