import React, { Component } from 'react';
import ImageUploader from './ImageUploader';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      user: {
        id: 1,
        username: 'Mr. Somebody',
        img: '',
        // img: 'https://alan-demo.s3-us-west-1.amazonaws.com/rooster.jpg',
        descrip: 'Cheerful smile. A bit silly from time to time. Likes naps.'
      }
    }
  }

  render() {
    const { user } = this.state;
    return (
      <div className="App">

        <div className="user">
          <div className="pic">
            {user.img.length
              ? <img src={user.img} alt="user" />
              : <div className="unavailable">Click to upload pic</div>}
            <ImageUploader user={user} />
          </div>
          <div className="text">
            <h1>{user.username}</h1>
            <p>{user.descrip}</p>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
