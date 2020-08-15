import React from 'react';
import {
  withStyles,
  Typography,
  TextField,
  CssBaseline,
  Button,
} from '@material-ui/core';

const styles = () => {
  return {
    page: {
      marginTop: '5em',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 500,
      width: '95%',
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
    fieldItem: {
      marginTop: '1em',
    },
    createButton: {
      marginTop: '2em',
    },
  };
};

class CreateAccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: this.props.name ? this.props.name : '',
      username: '',
      fullnameError: false,
      usernameEmptyError: false,
      usernameTakenError: false,
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.page}>
        <CssBaseline />
        <div>
          <Typography variant="h4">
            <b>Finish Your Account</b>
          </Typography>
        </div>

        <div className={classes.fieldItem}>
          <Typography variant="h6">
            <b>Email </b> <i>From Login - Not Changeable</i>
          </Typography>
          <TextField
            disabled="true"
            className={classes.textField}
            variant="outlined"
            value={this.props.email}
          />
        </div>

        <div className={classes.fieldItem}>
          <Typography variant="h6">
            <b>Full Name</b>
          </Typography>
          <TextField
            error={this.state.fullnameError}
            className={classes.textField}
            variant="outlined"
            value={this.state.fullname}
            onChange={(evt) => this.setState({ fullname: evt.target.value })}
          />
          {this.state.fullnameError ? (
            <Typography>
              <i>Error: Invalid Name</i>
            </Typography>
          ) : (
            <div />
          )}
        </div>

        <div className={classes.fieldItem}>
          <Typography variant="h6">
            <b>Username (Public)</b>
          </Typography>
          <TextField
            error={
              this.state.usernameTakenError || this.state.usernameEmptyError
            }
            className={classes.textField}
            variant="outlined"
            value={this.state.username}
            onChange={(evt) => this.setState({ username: evt.target.value })}
          />
          {this.state.usernameTakenError ? (
            <Typography>
              <i>Error: Username Already In Use</i>
            </Typography>
          ) : (
            <div />
          )}
          {this.state.usernameEmptyError ? (
            <Typography>
              <i>Error: Invalid Username</i>
            </Typography>
          ) : (
            <div />
          )}
        </div>

        <div className={classes.createButton}>
          <Button
            variant="outlined"
            onClick={() => {
              if (
                this.props.usernames &&
                this.props.usernames.includes(this.state.username)
              ) {
                this.setState({ usernameTakenError: true });
              } else if (this.state.fullname === '') {
                this.setState({
                  usernameTakenError: false,
                  fullnameError: true,
                });
              } else if (this.state.username === '') {
                this.setState({
                  usernameTakenError: false,
                  fullnameError: false,
                  usernameEmptyError: true,
                });
              } else {
                this.setState({
                  usernameTakenError: false,
                  fullnameError: false,
                  usernameEmptyError: false,
                });
                this.props.createAccount(
                  this.state.username,
                  this.state.fullname
                );
              }
            }}
          >
            Create
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CreateAccountPage);
