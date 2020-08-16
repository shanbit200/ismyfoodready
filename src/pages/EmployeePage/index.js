import React, { Component } from 'react';
import {
  withStyles,
  Typography,
  CssBaseline,
  Card,
  ButtonBase,
  Fab,
} from '@material-ui/core';
import cashierImage from '../../images/cashier.png';
import screenImage from '../../images/tv.png';
import logo from '../../images/logo.png';

import { withRouter, useHistory, Link } from 'react-router-dom';

class EmployeePage extends Component {
  render() {
    const { classes, user, initialized } = this.props;

    if (!initialized) {
      return <div />;
    }

    return (
      <div className={classes.page}>
        <CssBaseline />
        <div className={classes.centerContainer}>
          <div className={classes.title}></div>
          {user ? (
            <div
              style={{
                paddingTop: '2em',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <div
                style={{
                  maxWidth: 1000,
                  paddingLeft: 100,
                  marginBottom: '2em',
                }}
              >
                <Card style={{ boxShadow: '2px 4px 5px #888888', padding: 25 }}>
                  <Typography variant="h2">Employee Control Panel</Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <b>Store:</b> {user.storeName}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <b>Address:</b> {user.storeAddress}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Employee:</b> {user.name ? user.name : user.email},{' '}
                    <Link onClick={() => this.props.signOut}>
                      <u>Sign Out</u>
                    </Link>
                  </Typography>
                  <Typography variant="subtitle1" style={{ marginTop: 10 }}>
                    <i>Select view below</i>
                  </Typography>
                </Card>
              </div>
              <Card className={classes.card}>
                <Typography variant="h3" style={{ marginTop: 5 }}>
                  Cashier Mode
                </Typography>
                <Typography variant="subtitle1">
                  Manage customer orders
                </Typography>
                <Link to="/AddModifyOrders">
                  <img
                    src={cashierImage}
                    alt="Cashier Image Button"
                    style={{ width: 400, height: 400 }}
                  />
                </Link>
              </Card>
              <Card className={classes.card} style={{ marginLeft: '4em' }}>
                <Typography variant="h3" style={{ marginTop: 5 }}>
                  Big Screen Mode
                </Typography>
                <Typography variant="subtitle1">
                  Show order statuses on the big screen
                </Typography>
                <Link to="/BigScreen">
                  <img
                    src={screenImage}
                    alt="Cashier Image Button"
                    style={{ width: 400, height: 400 }}
                  />
                </Link>
              </Card>
            </div>
          ) : (
            <div style={{ paddingTop: '5em' }}>
              <div style={{ marginBottom: '4em' }}>
                <img src={logo} style={{ width: 250 }} />
              </div>
              <div style={{ marginBottom: '2em' }}>
                <Typography variant="h4">Employee Dashboard</Typography>
              </div>
              <img
                src={require('../../images/signInButton.png')}
                alt="Sign in with Google"
                className={classes.hover}
                onClick={() => this.props.signIn()}
              />
              <div style={{ marginTop: 10 }}>
                <Link to="/">
                  <Typography variant="subtitle1">Go Home</Typography>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const styles = () => {
  return {
    bigButton: {
      backgroundColor: 'blue',
      color: 'red',
      width: 400,
    },
    page: {
      textAlign: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 1100,
    },
    title: {
      marginBottom: '2em',
    },
    centerContainer: {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '7em',
    },
    hover: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
    card: {
      width: '100%',
      maxWidth: 500,
      display: 'inline-block',
      marginTop: '2em',
      boxShadow: '4px 7px 7px #888888',
    },
  };
};

export default withStyles(styles)(withRouter(EmployeePage));
