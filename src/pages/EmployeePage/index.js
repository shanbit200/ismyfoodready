import React, { Component } from 'react';

import {
  withStyles,
  Typography,
  CssBaseline,
  Button,
  Fab,
} from '@material-ui/core';

import { withRouter, useHistory, Link } from 'react-router-dom';

class EmployeePage extends Component {
  render() {
    const { classes, isSignedIn } = this.props;

    return (
      <div className={classes.page}>
        <CssBaseline />

        <div className={classes.centerContainer}>
          <div className={classes.title}>
            <Typography variant="h2">Employee Control Panel</Typography>
          </div>
          {isSignedIn ? <div></div> : <div></div>}
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
