import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import firebase from 'firebase';
import HomePage from './pages/HomePage';
import AddStorePage from './pages/AddStorePage';
import AddModifyOrdersPage from './pages/AddModifyOrdersPage';
import BigScreenPage from './pages/BigScreenPage'
import HomeAppBar from './components/HomeAppBar';
import { Switch } from 'react-router-dom';
import { withSnackbar } from 'notistack';

/* eslint react/no-direct-mutation-state: "off"*/

// Configure Firebase.
const config = {
  apiKey: 'AIzaSyB0auz8OH8Q_r7woChe3XsAFkgvG4kpIi0',
  authDomain: 'is-order-ready.firebaseapp.com',
  databaseURL: 'https://is-order-ready.firebaseio.com',
  projectId: 'is-order-ready',
  storageBucket: 'is-order-ready.appspot.com',
  messagingSenderId: '730041959035',
  appId: '1:730041959035:web:7e2d0f69c0633534c898de',
  measurementId: 'G-HGLYB2QN8G',
};

class App extends Component {
  constructor(props) {
    super(props);
    firebase.initializeApp(config);

    this.state = {
    };

  
  }

  componentDidMount() {
    // Do stuff on mount here
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            {/* Add all pages here */}
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  {/* <HomeAppBar user={this.state.user} /> */}
                  <HomePage
                    definitions={this.state.definitions}
                    categories={this.state.categories}
                  />
                  <div
                    className="footer"
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: 'rgb(235, 195, 64)',
                      position: 'fixed',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                    }}
                  >
                    <p>Joe Biden Action Committee</p>
                  </div>
                </div>
              )}
            />
            <Route exact path="/addStore" render={() => <AddStorePage />} />
            <Route exact path="/BigScreen" render={() => <BigScreenPage />} />
            <Route exact path="/AddModifyOrders" render={() => <AddModifyOrdersPage />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default withSnackbar(App);
