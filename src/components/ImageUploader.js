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
    for (let i = 0; i < elements.length; i++) elements[i].title = "Click to choose file";
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
    const obj = this.state.pic
    axios.post(`/api/photo/${this.props.user.id}`, obj)
    .then(response => { console.log('responseData', response.data.location) })
    // .catch(err => { console.log('ERROR', err) });
  }

  render() {
    return (
      <div className="ImageUploader">
        {this.state.pic && (
          <div className="chosenPic" style={{backgroundImage: `url(${this.state.pic.file})`}}></div>
        )}
        <input className="fileInput" type="file" onChange={this.choosePic.bind(this)} />
        <button onClick={this.savePic.bind(this)}>Save Pic</button>
      </div>
    )
  }
}