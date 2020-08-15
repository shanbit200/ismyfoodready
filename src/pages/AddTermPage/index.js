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

class AddTermPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Term requests
      requests: null,
      showRequestModal: false,
      // Add Term
      termError: false,
      definitionError: false,
      uri: '',
      term: '',
      definition: '',
      source: '',
      example: '',
      parent: '',
      options: [],
      ontology: ['All'],
    };
    // Populate select options
    this.props.terms.forEach((term) => {
      this.state.options.push({ value: term, label: term });
    });
    this.state.currModifyParentOptions = [];
    this.state.currModifyTermOptions = [];
    this.state.currAddParentOptions = [];
  }

  // Changes ontology if parent changes
  handleParentChange = (parent) => {
    let newOntology = [];
    let curr = parent.value;
    while (this.props.definitions[curr]) {
      newOntology.push(curr);
      curr = this.props.definitions[curr].Parent;
    }
    newOntology.push('All');
    newOntology.reverse();
    this.setState({ parent: parent, ontology: newOntology });
  };

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

        {/* VIEW TERM REQUESTS SECTION */}
        <Button
          style={{ marginTop: '1em', marginBottom: '1em' }}
          variant="contained"
          onClick={() => {
            BackendHelpers.getTermRequests()
              .then((requests) => {
                this.setState({
                  showRequestModal: true,
                  requests,
                });
              })
              .catch(() => {
                // No requests to show
                this.setState({
                  showRequestModal: true,
                });
              });
          }}
        >
          View Term Requests
        </Button>
        <TermRequestModal
          open={this.state.showRequestModal}
          terms={Object.keys(this.props.definitions)}
          requests={this.state.requests}
          handleClose={() => this.setState({ showRequestModal: false })}
          deleteRequest={(id) => {
            // eslint-disable-next-line
            if (confirm('Confirm you would like to delete this request.')) {
              this.setState((prevState) => {
                let prevRequests = prevState.requests;
                delete prevRequests[id];
                return { requests: prevRequests };
              });
              BackendHelpers.deleteTermRequest(id);
            }
          }}
        />

        {/* ADD NEW TERM SECTION */}
        <div>
          <Typography variant="h4">
            <b>Add A New Term</b>
          </Typography>
          <Grid container spacing={4}>
            <Grid item>
              <div className={classes.fieldItem}>
                <Typography variant="h6">
                  <b>Term Name</b>
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
              <div className={classes.fieldItem}>
                <Typography variant="h6">
                  <b>Definition Source</b>
                </Typography>
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  value={this.state.source}
                  onChange={(evt) =>
                    this.setState({ source: evt.target.value })
                  }
                />
              </div>
              <div className={classes.fieldItem}>
                <Typography variant="h6">
                  <b>Example</b>
                </Typography>
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  multiline
                  rows="5"
                  value={this.state.example}
                  onChange={(evt) =>
                    this.setState({ example: evt.target.value })
                  }
                />
              </div>
            </Grid>
            <Grid item>
              <div className={classes.fieldItem}>
                <Typography variant="h6">
                  <b>Ontology (From Parent Term)</b>
                </Typography>
                {this.state.ontology.map((term) => (
                  <Typography>> {term}</Typography>
                ))}
                <Typography>> {this.state.term}</Typography>
              </div>

              <div className={classes.fieldItem}>
                <Typography variant="h6">
                  <b>Parent Term</b>
                </Typography>
                <Typography>
                  <i>Start typing to see options</i>
                </Typography>
                <Select
                  options={this.state.currAddParentOptions}
                  styles={colourStyles}
                  onChange={(val) => this.handleParentChange(val)}
                  onInputChange={(val) => {
                    if (val && val.length && val.length > 0) {
                      this.setState({
                        currAddParentOptions: this.state.options.filter(
                          (x) => x.value.substring(0, val.length) === val
                        ),
                      });
                    }
                  }}
                  value={this.state.parent}
                />
              </div>
              <div>
                <Button
                  className={classes.addButton}
                  variant="contained"
                  onClick={() => {
                    if (this.validate()) {
                      this.props.addTerm({
                        Name: this.state.term,
                        LastUpdatedBy: user.uid,
                        Definition: this.state.definition,
                        Source: this.state.source,
                        Example: this.state.example,
                        Parent: this.state.parent.value
                          ? this.state.parent.value
                          : '',
                      });
                      this.setState({
                        termError: false,
                        definitionError: false,
                        term: '',
                        definition: '',
                        source: '',
                        example: '',
                        parent: '',
                      });
                      this.props.enqueueSnackbar('Successfully added term');
                    }
                  }}
                >
                  Add Term
                </Button>
                <div style={{ marginTop: '1em', maxWidth: 450 }}>
                  <Typography>
                    <i>
                      <b>Tip: </b> To modify a term after you add it, navigate
                      to its page and click the 'Edit Page' button. You may also
                      add cross-references on the edit page.
                    </i>
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: '#F7F7F7',
    color: 'black',
    width: 400,
    marginTop: 10,
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? 'grey'
        : isFocused
        ? '#F7F7F7'
        : null,
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? 'grey' : 'white'),
      },
    };
  },
};

export default withStyles(styles)(withSnackbar(AddTermPage));
