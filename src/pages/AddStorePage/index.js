import React from 'react';
import {
  withStyles,
  Typography,
  Grid,
  TextField,
  CssBaseline,
  Button,
} from '@material-ui/core';
import BackendHelpers from '../../utils/BackendHelpers';
import { withSnackbar } from 'notistack';
import Select from 'react-select';
import TermRequestModal from '../../components/TermRequestModal';

const styles = () => {
  return {
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
    };
  }

  // Validates form before submission
  validate = () => {
    const { term, definition } = this.state;
    let error = false;
    if (!term || term === '' || this.props.definitions[term]) {
      this.setState({ termError: true });
      this.props.enqueueSnackbar('Error: invalid term name');
      error = true;
    } else {
      this.setState({ termError: false });
    }
    if (!definition || definition === '') {
      this.setState({ definitionError: true });
      this.props.enqueueSnackbar('Error: invalid definition');
      error = true;
    } else {
      this.setState({ definitionError: false });
    }
    return !error;
  };

  render() {
    const { classes, user } = this.props;

    // Check for uri change
    const uri = window.location.pathname.split('/')[2];
    if (uri) {
      const decodedUri = decodeURIComponent(uri);
      if (this.state.uri !== uri) {
        this.handleParentChange({ value: decodedUri, label: decodedUri });
        this.setState({ uri: decodedUri });
        return <CssBaseline />;
      }
    }

    return (
      <div className={classes.page}>
        <CssBaseline />

        {/* ADD NEW TERM SECTION */}
        <div>
          <Typography variant="h4">
            <b>Add Store Page</b>
          </Typography>
          <Grid container spacing={4}>
            <Grid item>
              <div className={classes.fieldItem}>
                <Typography variant="h6">
                  <b>Store Name</b>
                </Typography>
                <TextField
                  error={this.state.termError}
                  className={classes.textField}
                  variant="outlined"
                  value={this.state.term}
                  onChange={(evt) => this.setState({ term: evt.target.value })}
                />
              </div>
              <div className={classes.fieldItem}>
                <Typography variant="h6">
                  <b>Definition</b>
                </Typography>
                <TextField
                  error={this.state.definitionError}
                  className={classes.textField}
                  variant="outlined"
                  multiline
                  rows="5"
                  value={this.state.definition}
                  onChange={(evt) =>
                    this.setState({ definition: evt.target.value })
                  }
                />
              </div>
              <div>
                <Button
                  className={classes.addButton}
                  variant="contained"
                  onClick={() => {
                    if (this.validate()) {
                      this.props.enqueueSnackbar('Successfully added store.');
                    }
                  }}
                >
                  Add Term
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(AddTermPage));
