import React, { Component } from 'react';

import {
  withStyles,
  Typography,
  CssBaseline,
  Button,
  Fab,
} from '@material-ui/core';

import { withRouter, useHistory, Link } from 'react-router-dom';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
    };
  }

  alertOnClick = () => {
    alert('Alert here!');
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.page}>
        <CssBaseline />

        <div className={classes.centerContainer}>
          <div className={classes.title}>
            <Typography variant="h1">[Name Goes Here]</Typography>
          </div>
          <Fab
            className={classes.bigButton}
            onClick={() => this.alertOnClick()}
          >
            Big Button
          </Fab>
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
      width: 400
    },
    page: {
      textAlign: 'center',
    },
    title: {
      marginBottom: '2em',
    },
    centerContainer: {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '7em',
    },
    hoverExample: {
      marginLeft: 'auto',
      marginRight: 'auto',
      '&:hover': {
        backgroundColor: '#D3D3D3 !important',
      },
    },
  };
};

export default withStyles(styles)(withRouter(HomePage));
