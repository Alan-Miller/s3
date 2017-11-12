import React, { Component } from 'react';
import ImageUploader from './components/ImageUploader';
import axios from 'axios';
import unavailable from './img-backups/unavailable.jpg';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    axios.get('/api/users').then(users => {
      this.setState({ users: users.data })
    });
  }

  render() {
    return (
      <div className="App">
        <div className="users">
          {this.state.users && this.state.users.map((user, i) => (
            <div key={user.id} className="user">
              <div className="pic">
                <img src={user.img.length ? user.img : unavailable} alt="user" />
                <ImageUploader user={user} />
              </div>
              <div className="text">
                <h1>{user.username}</h1>
                <p>{user.desc}</p>
              </div>
            </div>
          ))}</div>
      </div>
    );
  }
}

export default App;
