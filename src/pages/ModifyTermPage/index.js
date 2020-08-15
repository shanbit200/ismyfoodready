import React from 'react';
import {
  withStyles,
  Typography,
  TextField,
  CssBaseline,
  Button,
} from '@material-ui/core';
import BackendHelpers from '../../utils/BackendHelpers';
import { withSnackbar } from 'notistack';
import Select from 'react-select';
import CrossReferencesModal from '../../components/CrossReferencesModal';

const styles = () => {
  return {
    page: {
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

const objectToArray = (obj) => {
  let res = [];
  if (obj) {
    Object.keys(obj).forEach((key) => {
      res.push(obj[key]);
    });
  }
  return res;
};

class AddTermPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Modify Term
      selectedDefinitionTerm: '',
      modifyDefinitionTerm: '',
      modifyDefinition: '',
      modifySource: '',
      modifyParent: '',
      modifyExample: '',
      options: [],
      crossReferenceModalOpen: false,
      termId: undefined,
      references: undefined, // cross references from term
    };
    // Populate select options
    this.props.terms.forEach((term) => {
      this.state.options.push({ value: term, label: term });
    });

    this.state.currModifyTermOptions = [];
    this.state.currModifyParentOptions = [];
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
    const { classes, definitions } = this.props;

    // Check for uri change
    const uri = window.location.pathname.split('/')[2];
    if (uri) {
      const decodedUri = decodeURIComponent(uri);
      if (this.state.uri !== uri) {
        this.setState({
          selectedDefinitionTerm: { label: decodedUri, value: decodedUri },
          modifyDefinitionTerm: decodedUri,
          modifyDefinition: definitions[decodedUri].Definition,
          modifySource: definitions[decodedUri].Source,
          modifyExample: definitions[decodedUri].Example,
          modifyParent: definitions[decodedUri].Parent,
          references: objectToArray(definitions[decodedUri].References),
          termId: definitions[decodedUri].Key,
          uri: decodedUri,
        });
        return <CssBaseline />;
      }
    }

    return (
      <div className={classes.page}>
        <CssBaseline />

        {/* MANAGE EXISTING TERMS SECTION */}
        <div className={classes.modifyTermSection}>
          <Typography variant="h4" style={{ marginTop: '1em' }}>
            <b>Modify Term</b>
          </Typography>

          <Typography>
            <i>
              <b>Note:</b> videos may be modified on the Admin Page
            </i>
          </Typography>
          <div className={classes.fieldItem}>
            <Typography variant="h6">
              <b>Select Term</b>
            </Typography>
            <Typography>
              <i>Start typing to see options</i>
            </Typography>
            <Select
              options={this.state.currModifyTermOptions}
              styles={colourStyles}
              onChange={(val) => {
                this.setState({
                  selectedDefinitionTerm: val,
                  modifyDefinitionTerm: val.value,
                  modifyDefinition: definitions[val.value].Definition,
                  modifySource: definitions[val.value].Source,
                  modifyExample: definitions[val.value].Example,
                  modifyParent: definitions[val.value].Parent,
                  references: objectToArray(definitions[val.value].References),
                  termId: definitions[val.value].Key,
                });
              }}
              onInputChange={(val) => {
                if (val && val.length && val.length > 0) {
                  this.setState({
                    currModifyTermOptions: this.state.options.filter(
                      (x) => x.value.substring(0, val.length) === val
                    ),
                  });
                }
              }}
              value={this.state.selectedDefinitionTerm}
            />

            {this.state.modifyDefinitionTerm !== '' ? (
              <div>
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
                    value={this.state.modifyDefinition}
                    onChange={(evt) =>
                      this.setState({ modifyDefinition: evt.target.value })
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
                    value={this.state.modifySource}
                    onChange={(evt) =>
                      this.setState({ modifySource: evt.target.value })
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
                    value={this.state.modifyExample}
                    onChange={(evt) =>
                      this.setState({ modifyExample: evt.target.value })
                    }
                  />
                </div>
                <div className={classes.fieldItem}>
                  <Typography variant="h6">
                    <b>Parent Term</b>
                  </Typography>
                  <Typography>
                    <i>Start typing to see options</i>
                  </Typography>
                  <Select
                    options={this.state.currModifyParentOptions}
                    styles={colourStyles}
                    onChange={(val) =>
                      this.setState({
                        modifyParent: val.value,
                      })
                    }
                    onInputChange={(val) => {
                      if (val && val.length && val.length > 0) {
                        this.setState({
                          currModifyParentOptions: this.state.options.filter(
                            (x) => x.value.substring(0, val.length) === val
                          ),
                        });
                      }
                    }}
                    value={this.state.modifyParent}
                  />
                </div>
                {/* UPDATE TERM BUTTON */}
                <div className={classes.fieldItem}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (!this.state.modifyDefinition) {
                        alert('Error: please provide a definition.');
                      }
                      let obj = {
                        Name: this.state.modifyDefinitionTerm,
                        Definition: this.state.modifyDefinition,
                      };
                      if (this.state.modifyExample) {
                        obj.Example = this.state.modifyExample;
                      }
                      if (this.state.modifySource) {
                        obj.Source = this.state.modifySource;
                      }
                      if (this.state.parent) {
                        obj.Parent = this.state.modifyParent;
                      }
                      console.log('Term Id' + this.state.termId);
                      BackendHelpers.updateTerm(obj, this.state.termId)
                        .then(() =>
                          this.props.enqueueSnackbar(
                            'Successfully updated term. Refresh page to update locally.'
                          )
                        )
                        .catch((e) =>
                          this.props.enqueueSnackbar('Error: ' + e)
                        );
                    }}
                  >
                    Update Term
                  </Button>
                  <Button
                    variant="outlined"
                    style={{ marginLeft: 10 }}
                    onClick={() =>
                      this.setState({ crossReferenceModalOpen: true })
                    }
                  >
                    Manage Cross References
                  </Button>
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
        {/* CROSS REFERENCE MODAL */}
        <CrossReferencesModal
          open={this.state.crossReferenceModalOpen}
          handleClose={() => {
            this.setState({ crossReferenceModalOpen: false });
          }}
          termOptions={this.state.options}
          references={this.state.references}
          deleteCrossReference={(linkTerm) => {
            this.setState((prevState) => {
              let prevRefs = prevState.references;
              const indexToRemove = prevRefs.indexOf(linkTerm);
              prevRefs.splice(indexToRemove, 1);
              BackendHelpers.setCrossReferences(this.state.termId, prevRefs);
              return { references: prevRefs };
            });
            this.props.enqueueSnackbar(
              'Cross reference deleted. Refresh website to see effect.'
            );
          }}
          addCrossReference={(linkTerm) => {
            this.setState((prevState) => {
              let prevRefs = prevState.references;
              prevRefs.push(linkTerm);
              BackendHelpers.setCrossReferences(this.state.termId, prevRefs);
              return { references: prevRefs };
            });
            this.props.enqueueSnackbar(
              'Cross reference added. Refresh website to see effect.'
            );
          }}
        />
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
