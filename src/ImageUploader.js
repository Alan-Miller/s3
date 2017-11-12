import React, { Component } from 'react';
import axios from 'axios';

export default class ImageUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pic: null
    }
  }

  componentDidMount() {
    const elements = document.getElementsByTagName('input');
    for (let i = 0; i < elements.length; i++) elements[i].title = "Click to upload pic";
  }

  choosePic(e) {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      const pic = {
        file: reader.result,
        filename: file.name,
        filetype: file.type
      }
      this.setState({ pic })
    }
  }

  savePic(e) {
    e.preventDefault();

    axios.post(`/api/photo/${this.props.user.id}`, this.state.pic)
    .then(response => { 
      console.log('Your pic was uploaded to S3! Here is the url:', response.data.Location);
      alert(`Your pic was uploaded to S3! Here is the url: ${JSON.stringify(response.data.Location)}`);
    })
    .catch(err => { console.log('ERROR:', err) });
  }

  render() {
    return (
      <div className="ImageUploader">
        {this.state.pic && (
          <div className="chosenPic" style={{backgroundImage: `url(${this.state.pic.file})`}}></div>
        )}
        <input className="fileInput" type="file" onChange={this.choosePic.bind(this)} />
        {this.state.pic && <button onClick={this.savePic.bind(this)}>Save Pic to S3</button>}
      </div>
    )
  }
}