import React from 'react';
import {
  withStyles,
  Typography,
  CssBaseline,
  Grid,
  Card,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import ChildList from '../../components/ChildList';
import MakeTermRequestModal from '../../components/MakeTermRequestModal';
import BackendHelpers from '../../utils/BackendHelpers';
import StarRatingComponent from 'react-star-rating-component';

/* eslint react/no-direct-mutation-state: "off"*/

const styles = (theme) => {
  return {
    page: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 1200,
      width: '95%',
    },
    hiearchyCard: {
      width: '100%',
      marginTop: '1em',
      marginBottom: '1em',
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    block: {
      display: 'inline-block',
      verticalAlign: 'top',
      marginLeft: '2em',
    },
    textBlob: {
      marginTop: '1em',
    },
    textCard: {
      minWidth: 300,
      padding: '1em',
    },
    source: {
      marginTop: 3,
      textAlign: 'right',
    },
    uploadVideo: {
      marginTop: '-1em',
    },
    video: {
      marginBottom: '2em',
    },
    videoCard: {
      width: '100%',
    },
    appreciateContainer: {
      display: 'inline-block',
      float: 'right',
      marginRight: '1em',
    },
    videoText: {
      display: 'inline-block',
      float: 'left',
    },
    otherVideoContainer: {
      maxHeight: 320,
      width: 470,
      overflowY: 'scroll',
      overflowX: 'hidden',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    otherVideoBox: {
      backgroundColor: 'white',
      marginBottom: 5,
      height: 82,
      boxShadow: '1px 1px 2px #888888',
      '&:hover': {
        backgroundColor: '#D3D3D3 !important',
        cursor: 'pointer',
      },
    },
    indentRight: {
      marginLeft: '1em',
    },
    noDecoration: {
      textDecoration: 'none',
      color: 'black',
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    list: {
      paddingRight: '2em',
      marginRight: 'auto',
      marginLeft: 'auto',
    },
  };
};

const ytImage = (link) => {
  if (link !== undefined)
    return 'https://img.youtube.com/vi/' + ytEnding(link) + '/0.jpg';
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

const getParentList = (definitions, term) => {
  let curr = term;
  let list = [term];
  while (definitions[curr].Parent) {
    list.push(definitions[curr].Parent);
    curr = definitions[curr].Parent;
  }
  list.reverse();
  return list;
};

class DefinitionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dbIndex: -1,
      videoIndex: -1,
      videoUrl: '',
      videoUploader: '',
      videoDate: '',
      videoRating: 0,
      videoRatingCount: 0,
      userRating: 0,
      videos: [],
      term: '',
      showRequestTermModal: false, // modal for users to request terms
    };
  }

  // Change primary video to that at index
  changeVideo = (index, user) => {
    this.setState({
      videoIndex: index,
      videoUrl: this.state.videos[index].url,
      videoUploader: this.state.videos[index].uploader,
      videoDate: this.state.videos[index].uploadDate,
      videoRating: this.state.videos[index].rating,
      videoRatingCount: this.state.videos[index].ratingCount,
      dbIndex: this.state.videos[index].dbIndex,
      userRating:
        user && user.ratings
          ? user.ratings[this.state.videos[index].dbIndex]
          : 0,
    });
  };

  handleTermChange = (term, user) => {
    const definition = this.props.definitions[term];
    const parentList =
      definition !== undefined
        ? getParentList(this.props.definitions, term)
        : [];
    this.state.definition = definition;
    this.state.parentList = parentList;
    this.state.term = term;
    this.state.videos = [];
    if (this.props.videos && this.props.videos[term] !== undefined) {
      Object.keys(this.props.videos[term]).forEach((key) =>
        this.state.videos.push(this.props.videos[term][key])
      );
      this.state.videos.sort((x, y) => y.rating - x.rating);
      this.state.videoIndex = 0;
      this.state.videoUrl = this.state.videos[0].url;
      this.state.videoUploader = this.state.videos[0].uploader;
      this.state.videoDate = this.state.videos[0].uploadDate;
      this.state.videoRating = this.state.videos[0].rating;
      this.state.videoRatingCount = this.state.videos[0].ratingCount;
      this.state.dbIndex = this.state.videos[0].dbIndex;
      this.state.userRating =
        user && user.ratings ? user.ratings[this.state.dbIndex] : 0;
    } else {
      this.state.videoIndex = -1;
      this.state.videoUrl = '';
      this.state.videoUploader = '';
      this.state.videoDate = '';
      this.state.videoRating = 0;
      this.state.videoRatingCount = 0;
      this.state.userRating = 0;
    }
    this.forceUpdate();
  };

  render() {
    const { categories, user, classes } = this.props;

    // Handle term change
    const term = decodeURIComponent(window.location.pathname.split('/')[2]);
    if (term !== this.state.term || (!this.state.user && user)) {
      this.setState({ user });
      this.handleTermChange(term, user); // Page changed, update term
      return <div />;
    }

    const {
      videoIndex,
      videoUrl,
      videoUploader,
      videoDate,
      videoRating,
      videoRatingCount,
      videos,
      parentList,
      definition,
      userRating,
    } = this.state;

    // Determine other videos
    let otherVideos = [];
    if (videos) {
      videos.forEach((video, index) => {
        if (index !== videoIndex) {
          otherVideos.push(video);
        }
      });
    }

    // Determine siblings
    let siblings = [];
    if (parentList.length <= 1) {
      // Is category, so has no parent
      siblings = categories;
    } else {
      // Iterate through all siblings and add to array
      let obj = this.props.definitions[this.props.definitions[term].Parent][
        'Children'
      ];
      Object.keys(obj).forEach((key) => {
        siblings.push(obj[key]);
      });
    }

    return (
      <div className={classes.page}>
        <CssBaseline />

        {/* TITLE */}
        <Typography variant="h3" gutterBottom>
          View Topics for <b>{term}</b>
        </Typography>

        <Typography
          style={{
            whiteSpace: 'nowrap',
            display: 'inline-block',
            marginLeft: 5,
          }}
        >
          <Link to={'/'}>All</Link>
        </Typography>
        {parentList.map((term) => (
          <Typography
            style={{
              whiteSpace: 'nowrap',
              display: 'inline-block',
              marginLeft: 5,
            }}
          >
            {' > '}
            <Link to={'/term/' + term}>{term}</Link>
          </Typography>
        ))}

        <Grid container style={{ marginTop: '2em' }}>
          {/* SIDEBAR - DESKTOP ONLY */}
          <Grid item xs={2} className={classes.sectionDesktop}>
            <div className={classes.list}>
              <Typography variant="h6">
                🡄
                {parentList.length <= 1 ? (
                  <Link className={classes.noDecoration} to={'/'}>
                    All
                  </Link>
                ) : (
                  <Link
                    className={classes.noDecoration}
                    to={'/term/' + parentList[parentList.length - 2]}
                  >
                    {parentList[parentList.length - 2]}
                  </Link>
                )}
              </Typography>
              <div className={classes.indentRight}>
                {siblings.map((sibling) => (
                  <ChildList
                    expanded={sibling === term}
                    term={sibling}
                    definitions={this.props.definitions}
                    videos={this.props.videos}
                    level={user ? user.level : ''}
                    requestTerm={() => {
                      this.setState({ showRequestTermModal: true });
                    }}
                  />
                ))}
                <Typography style={{marginTop: '1em'}}>
                  <i>* Video needed</i>
                </Typography>
              </div>
            </div>
          </Grid>

          {/* MAIN PAGE */}
          <Grid item xs>
            {/* VIDEO GRID */}
            <Grid container>
              <div>
                <Grid container spacing={4}>
                  <Grid item xs>
                    <Typography variant="h4" style={{ marginBottom: '0.5em' }}>
                      {term} Sign Video
                    </Typography>
                    <div
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        width: 490,
                      }}
                    >
                      {/* VIDEO */}
                      <iframe
                        title={term + ' video'}
                        width="480"
                        height="270"
                        src={
                          'https://www.youtube.com/embed/' + ytEnding(videoUrl)
                        }
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowfullscreen
                      />

                      <div style={{ maxWidth: 490 }}>
                        <div className={classes.videoText}>
                          <Typography variant="body" gutterBottom>
                            {videoDate !== '' ? (
                              <div>
                                <div>
                                  <b>
                                    Upload Date:{' '}
                                    {new Date(videoDate).toDateString()}
                                  </b>
                                </div>
                                <div>
                                  <b>
                                    Uploaded By: <Link>{videoUploader}</Link>
                                  </b>
                                </div>
                              </div>
                            ) : (
                              <b>No video uploaded yet.</b>
                            )}
                          </Typography>
                        </div>
                        {videoUrl && videoUrl !== '' ? (
                          <div className={classes.appreciateContainer}>
                            <Typography>
                              <b>Average Rating: </b>{' '}
                              {videoRatingCount === 0
                                ? 'No Ratings'
                                : Math.round(videoRating * 100) / 100 + ' / 5'}
                            </Typography>
                            <Typography>
                              <b>Your Rating:</b>{' '}
                              {!userRating || userRating === 0
                                ? 'No Rating'
                                : Math.round(userRating * 100) / 100 + ' / 5'}
                            </Typography>
                            <div style={{ fontSize: 30 }}>
                              <StarRatingComponent
                                name="rate video"
                                editing={true}
                                starCount={5}
                                value={userRating}
                                onStarClick={(userRating) => {
                                  this.setState({ userRating });
                                  BackendHelpers.setRating(
                                    this.state.dbIndex,
                                    userRating,
                                    user.uid
                                  );
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div />
                        )}
                      </div>
                    </div>
                  </Grid>
                  {/* OTHER SUBMISSIONS */}
                  <Grid item xs>
                    <Typography variant="h4" style={{ marginBottom: '0.5em' }}>
                      Other Submissions
                    </Typography>
                    {/* ADD SUBMISSION BUTTON */}
                    <div className={classes.uploadVideo}>
                      {user ? (
                        <Link
                          to={'/submit-video/' + term}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            variant="contained"
                            style={{ marginTop: '1em', marginBottom: 7 }}
                          >
                            Add Sign Video
                          </Button>
                        </Link>
                      ) : (
                        <Typography>
                          <i>
                            <Link to="/sign-in">Sign In</Link> To Upload Video
                          </i>
                        </Typography>
                      )}
                    </div>
                    <div className={classes.otherVideoContainer}>
                      {otherVideos.map((video, index) => (
                        <div
                          className={classes.otherVideoBox}
                          onClick={() => {
                            const changeIndex =
                              index < this.state.videoIndex ? index : index + 1;
                            this.changeVideo(changeIndex, user);
                          }}
                        >
                          <div style={{ display: 'inline-block' }}>
                            <img
                              src={ytImage(video.url)}
                              style={{ width: 110 }}
                              alt={'video ' + index + ' thumnail'}
                            />
                          </div>
                          <div
                            style={{
                              display: 'inline-block',
                              verticalAlign: 'top',
                              marginTop: 20,
                              marginLeft: 10,
                            }}
                          >
                            <Typography>By: {video.uploader}</Typography>
                            <Typography>Date: {video.uploadDate}</Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Grid>
                </Grid>
              </div>

              {/* DEFINITION AND SOURCE */}
              <div className={classes.textBlob}>
                {/* MODIFY TERM LINK FOR APPROVED USERS */}
                {user &&
                (user.level === 'MAINTAINER' || user.level === 'ADMIN') ? (
                  <div style={{ marginTop: '1em', marginBottom: '1em' }}>
                    <Link
                      to={'/modify-term/' + term}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="contained">Edit Page</Button>
                    </Link>
                  </div>
                ) : (
                  <div />
                )}

                <Card className={classes.textCard}>
                  <Typography variant="h4">Definition</Typography>
                  <Typography variant="body1">
                    {definition.Definition}
                  </Typography>
                  {definition.Source && definition.Source !== '' ? (
                    <Typography variant="subtitle1" className={classes.source}>
                      <i>Source: {definition.Source}</i>
                    </Typography>
                  ) : (
                    <div />
                  )}
                </Card>
              </div>
              {console.log('Example: ' + JSON.stringify(definition))}
              {/* EXAMPLE */}
              {definition.Example ? (
                <div className={classes.textBlob}>
                  <Card className={classes.textCard}>
                    <Typography variant="h4">Example</Typography>
                    <Typography>{definition.Example}</Typography>
                  </Card>
                </div>
              ) : (
                <div />
              )}

              {/* ONTOLOGY */}
              <div className={classes.hiearchyCard}>
                <Card className={classes.textCard}>
                  <div className={classes.block}>
                    <Typography display="inline">
                      <b>🡄 Return to </b>
                    </Typography>
                    {parentList.length <= 1 ? (
                      <Typography display="inline">
                        <Link to="/">All</Link>
                      </Typography>
                    ) : (
                      <Typography display="inline">
                        <Link to={'/term/' + parentList[parentList.length - 2]}>
                          {parentList[parentList.length - 2]}
                        </Link>
                      </Typography>
                    )}
                  </div>

                  <div className={classes.block}>
                    <Typography display="inline">
                      <b>Types of {term}: </b>
                    </Typography>
                    {definition.Children ? (
                      Object.keys(definition.Children).map((key) => (
                        <div className={classes.block}>
                          <Typography display="inline">
                            <Link to={'/term/' + definition.Children[key]}>
                              {definition.Children[key]}
                            </Link>
                          </Typography>
                        </div>
                      ))
                    ) : (
                      <div />
                    )}
                  </div>
                </Card>
              </div>
            </Grid>
          </Grid>
        </Grid>

        {/* MAKE TERM REQUEST MODAL */}
        <MakeTermRequestModal
          defaultParent={term}
          open={this.state.showRequestTermModal}
          handleClose={() => this.setState({ showRequestTermModal: false })}
          requestTerm={(term, parent, details) => {
            BackendHelpers.addTermRequest(term, parent, details, user.email);
            this.setState({ showRequestTermModal: false });
            this.props.enqueueSnackbar('Term request submitted');
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(DefinitionPage));
