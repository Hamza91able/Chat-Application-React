import React, { Component } from 'react';
import Login from './Components/Login/Login';
import AppBar from './Components/AppBar/AppBar';
import Register from './Components/Register/Register';
import ChatHub from './Components/ChatHub/ChatHub';
import HeaderBar from './Components/HeaderBar/HeaderBar';
import firebase from './config/Firebase';

class App extends Component {
  constructor() {
    super();

    this.state = {
      showAppBar: true,
      showLogin: true,
      showRegister: false,
      showChatHub: false,
      userAvatar: "",
      showHeaderBar: true,
    }
  }

  hideLogin() {
    this.setState({
      showLogin: false,
      showRegister: true,
    })
  }

  hideRegister() {
    this.setState({
      showLogin: true,
      showRegister: false,
    })
  }

  showChatHub() {
    this.setState({
      showAppBar: false,
      showLogin: false,
      showChatHub: true,
    })
  }

  setAvatar(pic) {
    this.setState({
      userAvatar: pic,
    })
  }

  hideHeaderBar() {
    this.setState({
      showHeaderBar: false,
    })
  }

  showHeaderBar() {
    this.setState({
      showHeaderBar: true,
    })
  }

  componentWillMount() {
    this.loginUser();
  }

  loginUser() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.showChatHub();
      } else {
        this.setState({
          showAppBar: true,
          showLogin: true,
          showRegister: false,
          showChatHub: false,
          userAvatar: "",
          showHeaderBar: true,
        })
      }
    });
  }

  render() {
    const { showAppBar, showLogin, showRegister, showChatHub, showHeaderBar } = this.state;

    return (
      <div style={{ height: "100%" }}>
        {showAppBar && <AppBar />}
        {showLogin && <Login loginUser={this.loginUser.bind(this)} showChatHub={this.showChatHub.bind(this)} hideLogin={this.hideLogin.bind(this)} />}
        {showRegister && <Register hideRegister={this.hideRegister.bind(this)} />}
        {showChatHub && showHeaderBar && <HeaderBar loginUser={this.loginUser.bind(this)} setAvatar={this.setAvatar.bind(this)} />}
        {showChatHub && <ChatHub showHeaderBar={this.showHeaderBar.bind(this)} hideHeaderBar={this.hideHeaderBar.bind(this)} userAvatar={this.state.userAvatar} />}
      </div>
    );
  }
}

export default App;
