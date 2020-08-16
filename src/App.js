import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from 'firebase';
import HomePage from './pages/HomePage';
import AddStorePage from './pages/AddStorePage';
import BigScreenPage from './pages/BigScreenPage';
import EmployeePage from './pages/EmployeePage';
import AddModifyOrdersPage from './pages/AddModifyOrdersPage';
import Footer from './components/Footer';
import { Switch } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import BackendHelpers from './utils/BackendHelpers';

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
      user: undefined,
      initialized: false
    };

    firebase.auth().onAuthStateChanged((user) => {
      // This will be called when a user logs in, we'll get their info here
      if (user) {
        BackendHelpers.getStore(user.email)
          .then((result) => {
            this.setState({
              user: {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                storeName: result.storeName,
                storeAddress: result.storeAddress,
              },
              initialized: true,
            });
          })
          .catch((error) => {
            alert(error);
            firebase.auth().signOut();
          });
      } else {
        this.setState({ initialized: true });
      }
    });
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
                  <Footer />
                </div>
              )}
            />
            <Route
              exact
              path="/addStore"
              render={() => (
                <div>
                  <AddStorePage />
                  <Footer />
                </div>
              )}
            />
            <Route
              exact
              path="/BigScreen"
              render={() => (
                <BigScreenPage
                  storeName={this.state.user ? this.state.user.storeName : null}
                />
              )}
            />
            <Route
              exact
              path="/AddModifyOrders"
              render={() => (
                <AddModifyOrdersPage
                  storeName={this.state.user ? this.state.user.storeName : null}
                />
              )}
            />
            <Route
              exact
              path="/employeeDashboard"
              render={() => (
                <div>
                  <EmployeePage
                    signIn={() => this.signIn()}
                    signOut={() => firebase.auth().signOut()}
                    user={this.state.user}
                    initialized={this.state.initialized}
                  />
                  <Footer />
                </div>
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default withSnackbar(App);
