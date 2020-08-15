import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginBottom: '2em',
  },
  bar: {
    paddingTop: '1em',
    paddingBottom: '1em',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'block',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
});

class HomeAppBar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  handleMobileMenuOpen = (event) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  render() {
    const { mobileMoreAnchorEl } = this.state;
    const { classes, user } = this.props;
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    let showDesktop = user ? getDesktopView(user.level) : <div />;
    let showMobile = user ? getMobileView(user.level) : <div />;

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <Link style={{ textDecoration: 'none' }} to="/about">
            About
          </Link>
        </MenuItem>
        <div>
          {user ? (
            showDesktop
          ) : (
            <MenuItem>
              <Link style={{ textDecoration: 'none' }} to="/sign-in">
                Sign In
              </Link>
            </MenuItem>
          )}
        </div>
        <MenuItem>
          <Link style={{ textDecoration: 'none' }} to="/">
            Search
          </Link>
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.bar} position="static">
          <Toolbar>
            <Typography
              className={classes.title}
              variant="h5"
              color="inherit"
              noWrap
            >
              <Link style={{ textDecoration: 'none', color: 'black' }} to="/">
              ismyfoodready
              </Link>
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Link
                style={{ textDecoration: 'none', color: 'black' }}
                to="/about"
              >
                <Button color="inherit" variant="text">
                  About
                </Button>
              </Link>
              {user ? (
                showMobile
              ) : (
                <Link
                  style={{ textDecoration: 'none', color: 'black' }}
                  to="/sign-in"
                >
                  <Button color="inherit" variant="text">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </div>
    );
  }
}

const getDesktopView = () => {
  return (
    <div>
      <MenuItem>
        <Link style={{ textDecoration: 'none' }} to="/submit-video">
          Upload
        </Link>
      </MenuItem>
      <MenuItem>
        <Link style={{ textDecoration: 'none' }} to="/add-term">
          Add term
        </Link>
      </MenuItem>
      <MenuItem>
        <Link style={{ textDecoration: 'none' }} to="/admin">
          Admin
        </Link>
      </MenuItem>
      <MenuItem>
        <Link style={{ textDecoration: 'none' }} to="/profile">
          My Profile
        </Link>
      </MenuItem>
    </div>
  );
};

const getMobileView = () => {
  return (
    <div>
      <Link style={{ textDecoration: 'none', color: 'black' }} to="/add-term">
        <Button color="inherit" variant="text">
          Add Term
        </Button>
      </Link>
      <Link style={{ textDecoration: 'none', color: 'black' }} to="/admin">
        <Button color="inherit" variant="text">
          Admin
        </Button>
      </Link>
      <Link style={{ textDecoration: 'none', color: 'black' }} to="/profile">
        <Button color="inherit" variant="text">
          My Profile
        </Button>
      </Link>
    </div>
  );
};

export default withStyles(styles)(HomeAppBar);
