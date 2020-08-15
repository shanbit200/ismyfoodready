import React from 'react';
import { withStyles, Typography, CssBaseline } from '@material-ui/core';

const styles = () => {
  return {
    page: {
      textAlign: 'left',
      maxWidth: 1000,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '90%',
    },
    about: {
      marginTop: '1em',
      fontSize: 16,
    },
    title: {
      marginTop: '2em',
    },
    sponsorLogo: {
      marginTop: 10,
      height: 50,
      display: 'inline-block',
      marginRight: '1em',
    },
    copyright: {
      textAlign: 'center',
      marginTop: '2em',
      marginBottom: '1em',
    },
  };
};

const AboutPage = (props) => {
  const { classes } = props;
  return (
    <div className={classes.page}>
      <CssBaseline />
      <Typography variant="h3">About Us</Typography>
      <div className={classes.about}>
        <Typography variant="body">
          ASL-STEM is a research project at the University of Washington that
          seeks to remove a fundamental obstacle currently in the way of deaf
          scientists and students. Due to its relative youth and widely
          dispersed user base, American Sign Language (ASL) has developed
          limited standard vocabulary for the many terms that have arisen in
          advanced Science, Technology, Engineering, and Mathematics (STEM)
          fields. This makes it hard for deaf students to learn in their native
          language, and it makes communication between both deaf and hearing
          scientists and engineers far more difficult.
        </Typography>
        <p />
        <Typography variant="body">
          Language use and evolution cannot be dictated by the few, no matter
          their expertise. Instead, languages change because their users choose
          to change them. In this process, different ASL signs can develop for
          the same concept at different locations. ASL-STEM is an attempt to
          connect ASL users together so they can share vocabulary and perhaps
          naturally agree on a single or a few signs for the same concept. The
          hope is that this will help make it much easier for those in the Deaf
          community to pursue careers in STEM fields.
        </Typography>
        <p />
        <Typography variant="body">
          We currently have 8721 terms and 3265 signs, with more being added all
          the time.
        </Typography>
        <p />
      </div>
      <div className={classes.title}>
        <Typography variant="h3">Funding</Typography>
      </div>
      <div className={classes.about}>
        <Typography variant="body">
          ASL-STEM Forum is supported in part by a grant from the National
          Science Foundation, IIS-0915268, and by a gift from Google.
        </Typography>
        <div className={classes.sponsorLogo}>
          <img
            alt="National Science Foundation Logo"
            style={{ height: 100 }}
            src={require('../../images/nsf.png')}
          />
        </div>
        <div className={classes.sponsorLogo}>
          <img
            alt="Google ASL Logo"
            style={{ height: 100 }}
            src={require('../../images/google.png')}
          />
        </div>
      </div>
      <div className={classes.title}>
        <Typography variant="h3">Contact Us</Typography>
      </div>
      <div className={classes.about}>
        <Typography variant="body">
          General:{' '}
          <a href="mailto://aslstemforum@cs.washington.edu">
            aslstemforum@cs.washington.edu
          </a>
        </Typography>
        <p />
        <Typography variant="body">
          Bug Reports:{' '}
          <a href="mailto://ms192837@cs.washington.edu">
            ms192837@cs.washington.edu
          </a>
        </Typography>
      </div>
      <div className={classes.title}>
        <Typography variant="h3">Dictionaries</Typography>
        <div className={classes.about}>
          <Typography variant="body">
            Several STEM dictionaries you may want to check out:
          </Typography>
          <ul>
            <li>
              <Typography>
                <a href="http://deaftec.org/stem-sign-video-dictionary">
                  DeafTEC
                </a>
              </Typography>
            </li>
            <li>
              <Typography>
                <a href="https://www.shodor.org/deafstemterms/">
                  Shodor's DEAFSTEM
                </a>
              </Typography>
            </li>
            <li>
              <Typography>
                <a href="https://www.tsdvideo.org/">
                  Texas Math Sign Language Dictionary
                </a>
              </Typography>
            </li>
            <li>
              <Typography>
                <a href="https://www.terc.edu/terc_products/signing-math-and-science-dictionaries/">
                  TERC Signing Math and Science Dictionaries
                </a>{' '}
                (Uses signing avatars, must be downloaded to use)
              </Typography>
            </li>
          </ul>
          <p />
          <Typography variant="body">
            Some other sign language dictionaries:
          </Typography>
          <ul>
            <li>
              <Typography>
                <a href="https://www.signingsavvy.com/">Signing Savvy</a> (free
                to access; optional paid membership for full access to features)
              </Typography>
            </li>
            <li>
              <Typography>
                <a href="https://www.aslsearch.com/">ASLSearch.com</a>
              </Typography>
            </li>
            <li>
              <Typography>
                <a href="https://www.ntid.rit.edu/dictionary/">
                  ASL Video Dictionary and Inflection Guide{' '}
                </a>{' '}
                (requires paid membership to use)
              </Typography>
            </li>
          </ul>
        </div>
      </div>
      <div className={classes.copyright}>
        <Typography variant="body">
          © 2020 ASL-STEM, all rights reserved.
        </Typography>
      </div>
    </div>
  );
};

export default withStyles(styles)(AboutPage);
