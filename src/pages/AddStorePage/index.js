import React from 'react';
import {
  withStyles,
  Typography,
  TextField,
  CssBaseline,
  Grid,
  Card,
  Button,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import BackendHelpers from '../../utils/BackendHelpers';

const styles = () => {
  return {
    root: {
      flexGrow: 1,
      paddingTop: '25%',
    },
    page: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 1000,
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
      maxWidth: 450,
      marginTop: '1em',
    },
    addButton: {
      textAlign: 'center',
      marginTop: '2em',
    },
    modifyTermSection: {
      marginTop: '2em',
      marginBottom: '3em',
    },
  };
};

class AddStorePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeName: undefined,
      authorizedEmployees: undefined,
      address: undefined,
      nameError: false,
      emailError: false,
      addressError: false,
      addButton: false,
      initialLoad: true,
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.page}>
        <CssBaseline />

        {/* ADD NEW STORE SECTION */}
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <div>
                <img
                  style={{ maxWidth: '100%' }}
                  src={require('../../images/store.png')}
                  alt="A minamalist store icon"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div style={{ marginLeft: '3em' }}>
                <Typography variant="h4">
                  <b>Add Your Store</b>
                </Typography>
                <div className={classes.fieldItem}>
                  <Typography variant="h6">
                    <b>Store Name</b>
                  </Typography>
                  <TextField
                    error={!this.state.storeName && !this.state.initialLoad}
                    className={classes.textField}
                    variant="outlined"
                    value={this.state.storeName}
                    onChange={(evt) =>
                      this.setState({ storeName: evt.target.value })
                    }
                  />
                </div>
                <div className={classes.fieldItem}>
                  <Typography variant="h6">
                    <b>Authorized Employee Emails</b>
                  </Typography>
                  <TextField
                    error={
                      !this.state.authorizedEmployees && !this.state.initialLoad
                    }
                    className={classes.textField}
                    variant="outlined"
                    multiline
                    rows="5"
                    value={this.state.authorizedEmployees}
                    onChange={(evt) =>
                      this.setState({
                        authorizedEmployees: evt.target.value,
                      })
                    }
                  />
                </div>
                <div className={classes.fieldItem}>
                  <Typography variant="h6">
                    <b>Address</b>
                  </Typography>
                  <TextField
                    error={!this.state.address && !this.state.initialLoad}
                    className={classes.textField}
                    variant="outlined"
                    value={this.state.address}
                    onChange={(evt) =>
                      this.setState({ address: evt.target.value })
                    }
                  />
                </div>
                <div>
                  <Button
                    className={classes.addButton}
                    variant="contained"
                    onClick={() => {
                      if (
                        this.state.storeName &&
                        this.state.authorizedEmployees &&
                        this.state.address
                      ) {
                        this.props.enqueueSnackbar('Successfully added store.');
                        BackendHelpers.addStore(this.state.storeName, {
                          authorizedEmployees: this.state.authorizedEmployees.split(
                            ','
                          ),
                          address: this.state.address,
                        });
                      }
                      this.setState({ initialLoad: false });
                    }}
                  >
                    Add Store
                  </Button>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(AddStorePage));
