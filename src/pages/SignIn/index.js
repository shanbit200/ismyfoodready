// Import FirebaseAuth and firebase.
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { withStyles, Typography, CssBaseline } from '@material-ui/core';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /profile after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/profile',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

const styles = () => {
  return {
    page: {
      paddingTop: '1em',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 1000,
      width: '95%',
      fontSize: 18,
      textAlign: 'center',
    },
  };
};

class SignIn extends React.Component {
  render() {
    const { user, classes } = this.props;
    if (user) {
      window.location.href = '/';
      return <CssBaseline />;
    }
    return (
      <div className={classes.page}>
        <CssBaseline />
        <Typography variant="h3" style={{ marginBottom: '1em' }}>
          Sign In/Sign Up
        </Typography>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SignIn);
