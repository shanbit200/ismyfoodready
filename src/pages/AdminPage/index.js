import React from 'react';
import {
  withStyles,
  Typography,
  MenuItem,
  Select as MuiSelect,
  CssBaseline,
  Button,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import Select from 'react-select';
import BackendHelpers from '../../utils/BackendHelpers';
import MoveVideoModal from '../../components/MoveVideoModal/MoveVideoModal';

const styles = () => {
  return {
    page: {
      marginTop: '5em',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '5em',
      maxWidth: 500,
      width: '95%',
    },
    textField: {
      width: 800,
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

const ytEnding = (link) => {
  if (link) {
    if (link.includes('watch?v=')) {
      const split = link.split('watch?v=');
      return split[1];
    } else {
      const split = link.split('/');
      return split[split.length - 1];
    }
  }
};

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Manage Users
      selectedUserId: '',
      selectedUserOption: '',
      users: {},
      userOptions: [],
      allTermOptions: [],
      termOptions: [],
      currentLevel: 'loading...',
      selectedLevel: '',
      // Manage Videos
      selectedVideoTerm: '',
      selectedVideos: [],
      videoTerm: '',
      showVideoTermSelect: false,
      loadedVideoTerms: false,
      currentVideoId: -1, // Used for moving videos
    };
    // Get user list
    BackendHelpers.getAllUsers().then((users) => {
      this.state.users = users;
      // Get UID -> usernames map
      BackendHelpers.getUidUserNames().then((usernames) => {
        Object.keys(users).forEach((uid) => {
          this.state.userOptions.push({
            value: uid,
            label: usernames[uid] + ' (' + users[uid]['email'] + ')',
          });
        });
        this.forceUpdate();
      });
    });
    // Get term list
    Object.keys(props.definitions).forEach((term) => {
      this.state.allTermOptions.push({ value: term, label: term });
    });
  }

  render() {
    const { classes, videos } = this.props;

    return (
      <div className={classes.page}>
        <CssBaseline />
        {/* USER SECTION */}
        <div>
          <Typography variant="h4">
            <b>Set User Permissions</b>
          </Typography>
          <div className={classes.fieldItem}>
            <Typography variant="h6">
              <b>Select User</b>
            </Typography>
            <Select
              options={this.state.userOptions}
              styles={colourStyles}
              onChange={(val) => {
                this.setState({
                  currentLevel: 'loading...',
                  selectedUserId: val.value,
                  selectedUserOption: val,
                });
                BackendHelpers.getUserLevel(val.value).then((level) => {
                  this.setState({ currentLevel: level });
                });
              }}
              value={this.state.selectedUserOption}
            />
            {this.state.selectedUserId ? (
              <div>
                <div style={{ marginTop: '1em', marginBottom: '2em' }}>
                  <Typography>
                    <b>permissions level: </b>
                    {this.state.currentLevel &&
                    typeof this.state.currentLevel === 'string'
                      ? this.state.currentLevel
                      : 'loading...'}
                  </Typography>
                  {Object.keys(this.state.users[this.state.selectedUserId])
                    .filter(
                      (x) =>
                        x !== 'level' &&
                        x !== 'ratings' &&
                        typeof x !== 'object'
                    )
                    .map((key) => (
                      <Typography>
                        <b>{key}: </b>{' '}
                        {this.state.users[this.state.selectedUserId][key]}
                      </Typography>
                    ))}
                </div>
                <div style={{ marginBottom: '1em' }}>
                  <Typography variant="h6">
                    <b>Select Level</b>
                  </Typography>
                  <MuiSelect
                    labelId="level-select-label"
                    id="level-select"
                    value={this.state.selectedLevel}
                    onChange={(val) =>
                      this.setState({ selectedLevel: val.target.value })
                    }
                  >
                    <MenuItem value={'BANNED'}>Banned</MenuItem>
                    <MenuItem value={'USER'}>User</MenuItem>
                    <MenuItem value={'MAINTAINER'}>Maintainer</MenuItem>
                    <MenuItem value={'ADMIN'}>Admin</MenuItem>
                  </MuiSelect>
                </div>
                <div>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      BackendHelpers.setUserLevel(
                        this.state.selectedUserId,
                        this.state.selectedLevel
                      )
                        .then(() =>
                          this.props.enqueueSnackbar(
                            'Successfully set user level.'
                          )
                        )
                        .catch((e) => this.props.enqueueSnackbar('Error: ' + e))
                    }
                  >
                    Set Permissions
                  </Button>
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* VIDEO SECTION */}
        <div>
          <Typography variant="h4" style={{ marginTop: '1em' }}>
            <b>Move/Delete Video</b>
          </Typography>
          <div className={classes.fieldItem}>
            <Typography variant="h6">
              <b>Select Term of Video</b>
            </Typography>
            <Typography>
              <i>Start typing to see options.</i>
            </Typography>
            <Select
              options={this.state.termOptions}
              styles={colourStyles}
              onChange={(val) => {
                const videoTerm = val.value;
                this.setState({ selectedVideoTerm: val, videoTerm });
                if (videos && videos[videoTerm]) {
                  let selectedVideos = [];
                  Object.keys(videos[videoTerm]).forEach((key) => {
                    selectedVideos.push(videos[videoTerm][key]);
                  });
                  this.setState({ selectedVideos });
                }
              }}
              onInputChange={(val) => {
                if (val && val.length && val.length > 0) {
                  this.setState({
                    termOptions: this.state.allTermOptions.filter(
                      (x) => x.value.substring(0, val.length) === val
                    ),
                  });
                }
              }}
              value={this.state.selectedVideoTerm}
            />
            {this.state.selectedVideos.map((video) => (
              <div style={{ marginTop: 5, width: 1000 }}>
                <iframe
                  title={video.uploader + ' video'}
                  width="160"
                  height="90"
                  src={'https://www.youtube.com/embed/' + ytEnding(video.url)}
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  style={{ display: 'inline-block' }}
                  allowfullscreen
                />
                <div
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: 5,
                  }}
                >
                  <Typography>
                    <a href={video.url}>{video.url}</a>
                  </Typography>
                  <Typography>
                    Uploaded By: {video.uploader} (id: {video.uid})
                  </Typography>
                  {/* DELETE VIDEO BUTTON */}
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (
                        // eslint-disable-next-line
                        confirm('Are you sure you wish to delete this video?')
                      ) {
                        BackendHelpers.deleteVideo(video.dbIndex).then(() =>
                          this.props.enqueueSnackbar(
                            'Successfully deleted video. Refresh page to update locally.'
                          )
                        );
                      }
                    }}
                  >
                    Delete
                  </Button>
                  {/* MOVE VIDEO BUTTON - OPENS SELECTION MODAL */}
                  <Button
                    variant="outlined"
                    onClick={() => {
                      this.setState({
                        moveVideoModalOpen: true,
                        currentVideoId: video.dbIndex,
                      });
                    }}
                  >
                    Move
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <MoveVideoModal
            termOptions={this.state.allTermOptions}
            open={this.state.moveVideoModalOpen}
            handleClose={() => this.setState({ moveVideoModalOpen: false })}
            moveVideo={(newTerm) => {
              BackendHelpers.moveVideo(
                this.state.currentVideoId,
                newTerm
              ).then(() =>
                this.props.enqueueSnackbar(
                  'Successfully moved video. Refresh page to update locally.'
                )
              );
              this.setState({ moveVideoModalOpen: false });
            }}
          />
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

export default withStyles(styles)(withSnackbar(AdminPage));
