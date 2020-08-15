import React from 'react';
import { withStyles, Typography, CssBaseline, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { withRouter } from 'react-router-dom';

const styles = () => {
  return {
    page: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 1000,
      width: '95%',
    },
    fieldItem: {
      marginTop: '1em',
    },
    addButton: {
      textAlign: 'center',
      marginTop: '2em',
    },
    textField: {
      width: 400,
      maxWidth: '95%',
      '& label.Mui-focused': {
        color: 'grey',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'grey',
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderColor: 'grey',
        },
      },
    },
  };
};

class AddTermPage extends React.Component {
  constructor(props) {
    super(props);
    if (!props.user) {
      window.location.href = '/sign-in';
    } else {
      let phone = '';
      let name = '';
      let email = '';
      let uid = firebase.auth().currentUser.uid;
      let videos = [];
      if (props.user && props.user) {
        name = props.user.name;
        email = props.user.email;
        uid = props.user.uid;
        if (Array.isArray(props.videos)) {
          props.videos.forEach((video) => {
            if (video.uploader === email) {
              videos.push(video.url);
            }
          });
        }
      }
      this.state = {
        phone: phone,
        name: name,
        email: email,
        uid: uid,
        videos: videos,
        showSuccess: false,
      };
    }
  }

  render() {
    const { classes, user } = this.props;
    if (!user) {
      window.location.href = '/sign-in';
      return <CssBaseline />;
    }
    return (
      <div className={classes.page}>
        <CssBaseline />
        <div>
          <Typography variant="h4">
            <b>Your Profile</b>
          </Typography>
          <div className={classes.fieldItem}>
            <Typography variant="h6">Name: {this.state.name}</Typography>
            <Typography variant="h6">Email: {this.state.email}</Typography>
          </div>

          <div className={classes.fieldItem}>
            <Button
              variant="contained"
              onClick={() => {
                this.props.signOut();
                this.props.history.push('/');
              }}
            >
              Sign Out
            </Button>
          </div>

          <Typography variant="h4" className={classes.fieldItem}>
            <b>Your Videos</b>
          </Typography>
          <div className={classes.fieldItem}>
            {this.state.videos.length === 0 ? (
              <div>
                <Typography>
                  <i>No videos found for this user....</i>
                </Typography>
                <Link to="/submit-video">Submit A Video </Link>
              </div>
            ) : (
              this.state.videos.map((video) => (
                <Typography>
                  <a href={video}>{video}</a>
                </Typography>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(AddTermPage));
