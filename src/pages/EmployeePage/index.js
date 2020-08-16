import React, { Component } from 'react';
import {
  withStyles,
  Typography,
  CssBaseline,
  ButtonBase,
  Fab,
} from '@material-ui/core';
import cashierImage from '../../images/cashier.jpg';
import screenImage from '../../images/screen.jpg';

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
          <div className={classes.title}>
            <Typography variant="h2">
              <u>Employee Control Panel</u>
            </Typography>
          </div>
          {user ? (
            <div style={{ paddingTop: '2em' }}>
              <div style={{ paddingBottom: '2em' }}>
                <Typography variant="h3" gutterBottom>
                  {user.storeName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {user.storeAddress}
                </Typography>
                <Typography variant="subtitle1">
                  Employee: {user.name ? user.name : user.email},{' '}
                  <a
                    onClick={this.props.signOut}
                    className={classes.hover}
                    style={{
                      color: 'purple',
                    }}
                  >
                    <u>Sign Out</u>
                  </a>
                </Typography>
              </div>
              <Link to="/AddModifyOrders">
                <ButtonBase
                  focusRipple
                  key={'Add Or Modify Orders'}
                  className={classes.image}
                  focusVisibleClassName={classes.focusVisible}
                  style={{
                    width: 500,
                    height: 400,
                  }}
                >
                  <span
                    className={classes.imageSrc}
                    style={{
                      backgroundImage: `url(${cashierImage})`,
                    }}
                  />
                  <span className={classes.imageBackdrop} />
                  <span className={classes.imageButton}>
                    <Typography
                      component="span"
                      variant="h3"
                      color="inherit"
                      className={classes.imageTitle}
                    >
                      Cashier Mode
                      <span className={classes.imageMarked} />
                    </Typography>
                  </span>
                </ButtonBase>
              </Link>
              <Link to="/BigScreen">
                <ButtonBase
                  focusRipple
                  key={'Big Screen'}
                  className={classes.image}
                  focusVisibleClassName={classes.focusVisible}
                  style={{
                    width: 500,
                    height: 400,
                    marginLeft: '2em',
                  }}
                >
                  <span
                    className={classes.imageSrc}
                    style={{
                      backgroundImage: `url(${screenImage})`,
                    }}
                  />
                  <span className={classes.imageBackdrop} />
                  <span className={classes.imageButton}>
                    <Typography
                      component="span"
                      variant="h3"
                      color="inherit"
                      className={classes.imageTitle}
                    >
                      Big Screen Mode
                      <span className={classes.imageMarked} />
                    </Typography>
                  </span>
                </ButtonBase>
              </Link>
            </div>
          ) : (
            <div style={{ paddingTop: '5em' }}>
              <img
                src={require('../../images/signInButton.png')}
                alt="Sign in with Google"
                className={classes.hover}
                onClick={() => this.props.signIn()}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const styles = (theme) => {
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
    hover: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
    image: {
      position: 'relative',
      height: 200,
      [theme.breakpoints.down('xs')]: {
        width: '100% !important', // Overrides inline-style
        height: 100,
      },
      '&:hover, &$focusVisible': {
        zIndex: 1,
        '& $imageBackdrop': {
          opacity: 0.4,
        },
        '& $imageMarked': {
          opacity: 0,
        },
        '& $imageTitle': {
          border: '4px solid currentColor',
        },
      },
    },
    focusVisible: {},
    imageButton: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.common.white,
    },
    imageSrc: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.black,
      opacity: 0.7,
      transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
      position: 'relative',
      padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${
        theme.spacing(1) + 6
      }px`,
    },
    imageMarked: {
      height: 3,
      width: 18,
      backgroundColor: theme.palette.common.white,
      position: 'absolute',
      bottom: -2,
      left: 'calc(50% - 9px)',
      transition: theme.transitions.create('opacity'),
    },
  };
};

export default withStyles(styles)(withRouter(EmployeePage));
