import React from 'react';
import {
  withStyles,
  Typography,
  CssBaseline,
  Grid,
  Card,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const styles = () => {
  return {
    page: {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '5em',
      maxWidth: 1000,
      width: '95%',
      fontSize: 18,
    },
    resultCard: {
      width: '100%',
      minWidth: 550,
      height: 150,
      marginTop: '1em',
    },
    resultBlock: {
      display: 'inline-block',
      marginRight: '1em',
      verticalAlign: 'top',
    },
    resultImage: {
      height: 150,
      marginTop: 25,
      marginLeft: 25,
    },
    term: {
      width: '100%',
      marginTop: 25,
    },
  };
};

// const ytImage = (link) => {
//   if (link !== undefined)
//     return 'https://img.youtube.com/vi/' + ytEnding(link) + '/0.jpg';
// };

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

const levenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1
          )
        ); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};

const SearchPage = (props) => {
  const searchTerm = decodeURIComponent(window.location.pathname.split('/')[2]);
  const { definitions, videos, classes } = props;
  const matches = Object.keys(definitions)
    .filter((term) => term.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort(
      (a, b) =>
        levenshteinDistance(a, searchTerm) - levenshteinDistance(b, searchTerm)
    );
  return (
    <div className={classes.page}>
      <CssBaseline />

      {/* TITLE */}
      <Typography variant="h4" gutterBottom>
        Results for <b>{searchTerm}</b>
      </Typography>

      <div>
        {matches.length === 0 ? (
          <Typography variant="h5">No Results Found</Typography>
        ) : (
          matches.map((term) => (
            <Link to={'/term/' + term}>
              <Card className={classes.resultCard}>
                <Grid container>
                  <Grid item>
                    <div className={classes.resultBlock}>
                      <iframe
                        style={{ marginTop: 20, marginLeft: 10 }}
                        title={term + ' video'}
                        width="200"
                        height="112"
                        src={
                          'https://www.youtube.com/embed/' +
                          ytEnding(videos[term] ? videos[term][0].url : '')
                        }
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowfullscreen
                      />
                    </div>
                  </Grid>
                  <Grid item xs>
                    <div className={classes.resultBlock}>
                      <div className={classes.term}>
                        <Typography variant="h5" style={{ color: 'Purple' }}>
                          <u>{term}</u>
                        </Typography>
                      </div>
                      <div className={classes.term}>
                        <Typography variant="body">
                          {definitions[term].Definition.length > 100
                            ? definitions[term].Definition.substring(0, 100) +
                              '...'
                            : definitions[term].Definition}
                        </Typography>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default withStyles(styles)(SearchPage);
