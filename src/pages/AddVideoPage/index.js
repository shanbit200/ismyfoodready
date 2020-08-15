import React from 'react';
import {
  withStyles,
  Typography,
  CssBaseline,
  Snackbar,
  TextField,
} from '@material-ui/core';
import Select from 'react-select';
import BackendHelpers from '../../utils/BackendHelpers';

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
    textField: {
      width: 600,
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
    btns: {
      margin: '0px 3px 10px 0px',
      paddingLeft: 2,
      paddingRight: 2,
      width: 99,
    },
    video: {
      verticalAlign: 'top',
      width: '25vw',
      height: 'calc(25vw* 0.5626)',
    },
    recordingBlock: {
      textAlign: 'left',
      alignContent: 'left',
    },
  };
};

class AddVideoPage extends React.Component {
  constructor(props) {
    super(props);
    const date = new Date();

    const name = this.props.user ? this.props.user['name'] : '';
    const email = this.props.user ? this.props.user['email'] : '';

    this.state = {
      uploadDate:
        '' +
        (date.getMonth() + 1) +
        '/' +
        date.getDate() +
        '/' +
        date.getFullYear(),
      description: name
        ? 'Video Uploaded by ' + name + 'on ASL STEM'
        : 'Video uploaded by ASL STEM',
      name: name,
      email: email,
      term: '',
      uri: '',
      options: [],
      videoUrl: '',
      isRecording: false,
      isUploading: false,
      showError: false,
      showEmpty: true,
    };
    this.props.terms.forEach((term) => {
      this.state.options.push({ value: term, label: term });
    });
  }

  uploadVideo(toUpload) {
    if (!this.state.term) {
      this.setState({ showError: true });
      return;
    }
    this.setState({ showError: false });
    BackendHelpers.getAuthToken(this.props.user.uid)
      .then((access_token) => {
        this.uploadRequest(toUpload, access_token);
      })
      .catch((error) => alert(error));
  }

  uploadRequest = (file, token) => {
    // VIDEO METADATA
    var metadata = {
      snippet: {
        title: this.state.term + ' ASL STEM Sign',
        description: this.state.description,
        tags: this.tags,
        categoryId: this.categoryId,
      },
      status: {
        privacyStatus: 'public',
      },
    };
    this.setState({ isUploading: true });
    var uploader = new MediaUploader({
      baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
      file: file,
      token: token,
      metadata: metadata,
      params: {
        part: Object.keys(metadata).join(','),
      },
      onError: function (data) {
        var message = data;
        // Assuming the error is raised by the YouTube API, data will be
        // a JSON string with error.message set. That may not be the
        // only time onError will be raised, though.
        try {
          var errorResponse = JSON.parse(data);
          message = errorResponse.error.message;
        } finally {
          alert(message);
        }
      },
      onComplete: function (data) {
        var uploadResponse = JSON.parse(data);
        this.setState({
          videoUrl: 'https://youtube.com/watch?v=' + uploadResponse.id,
          isUploading: false,
        });
        this.props.addVideo({
          name: this.state.term,
          url: 'https://youtube.com/watch?v=' + uploadResponse.id,
          uploadDate: this.state.uploadDate,
          uploader: this.props.user.username,
          uid: this.props.user.uid,
        });
      }.bind(this),
    });
    // This won't correspond to the *exact* start of the upload, but it should be close enough.
    this.uploadStartTime = Date.now();
    uploader.upload();
  };

  render() {
    const { classes, user } = this.props;
    // Check for uri change
    const uri = window.location.pathname.split('/')[2];
    if (uri) {
      const decodedUri = decodeURIComponent(uri);
      if (this.state.uri !== uri) {
        this.setState({
          term: decodedUri,
          uri: decodedUri,
          selected: { value: decodedUri, label: decodedUri },
        });
      }
    }

    // Enforce user sign in
    if (!user) {
      window.location.href = '/sign-in';
      return <CssBaseline />;
    }

    return (
      <div className={classes.page}>
        <CssBaseline />
        <Typography variant="h4">Submit Sign Video</Typography>

        <div className={classes.fieldItem}>
          <Typography variant="h6">
            <b>Term</b>
          </Typography>
          <Typography>
            <i>Type at least 3 letters to see options.</i>
          </Typography>
          <Select
            options={this.state.showEmpty ? [] : this.state.options}
            styles={colourStyles}
            onChange={(val) => {
              this.setState({ selected: val, term: val.value });
            }}
            onInputChange={(val) => {
              if (this.state.showEmpty && val.length >= 3) {
                this.setState({ showEmpty: false });
              }
            }}
            value={this.state.selected}
          />
        </div>
        <div className={classes.fieldItem}>
          <Typography variant="h6">
            <b>Video Description</b>
          </Typography>
          <TextField
            className={classes.textField}
            variant="outlined"
            multiline
            rows="5"
            value={this.state.description}
            onChange={(evt) => this.setState({ description: evt.target.value })}
          />
        </div>
        <div className={classes.fieldItem}>
          {this.state.isUploading === false ? (
            <div>
              {/* CODE FOR WEBCAM*/}
              <div className={classes.recordingBlock}>
                <button id="start">Start Camera</button>
                <button id="record" disabled>
                  Start Recording
                </button>
                <button id="play" disabled>
                  Play
                </button>
                <button id="download" disabled>
                  Upload
                </button>
                {this.state.isRecording ? (
                  <Typography>
                    <i>Recording Video...</i>
                  </Typography>
                ) : (
                  <div />
                )}
                <div>
                  <video
                    style={{
                      width: 400,
                      marginTop: '2em',
                    }}
                    id="gum"
                    alt="yolo"
                  ></video>
                  <video
                    style={{
                      width: 400,
                      marginTop: '2em',
                    }}
                    id="recorded"
                    alt="swag"
                  ></video>
                </div>
              </div>

              {/*END FOR WEBCAM*/}

              {/* <Button
                style={{ marginRight: 10 }}
                variant="contained"
                onClick={() => {
                  if (this.state.term) {
                    this.refs.fileUploader.click();
                  } else {
                    alert('Error: please select term');
                  }
                }}
              >
                Upload Video
              </Button> */}
            </div>
          ) : (
            <Typography>Uploading. Please wait....</Typography>
          )}
        </div>
        {this.state.videoUrl !== '' ? (
          <Typography>
            Video Link: <a href={this.state.videoUrl}>{this.state.videoUrl}</a>
          </Typography>
        ) : (
          <div />
        )}
        <input
          type="file"
          id="file"
          ref="fileUploader"
          style={{ display: 'none' }}
          onChange={(evt) => {
            this.uploadVideo(evt.target.files[0]);
          }}
        />
        <Snackbar
          open={this.state.showError}
          onClose={() => this.setState({ showError: false })}
          message="Congrats. You're now subscribed! Expect a text message soon."
        />
      </div>
    );
  }

  /*


  CODE FOR WEBCAM RECORDING


  */
  //component mount in its entirety is needed for the thing to work
  componentDidMount() {
    const mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
    let mediaRecorder;
    let recordedBlobs;
    let sourceBuffer;
    const errorMsgElement = document.querySelector('span#errorMsg');
    const recordedVideo = document.querySelector('video#recorded');
    const recordButton = document.querySelector('button#record');
    // mediaSource.addEventListener('sourceopen', handleSourceOpen, false);

    const that = this;

    function handleSourceOpen(event) {
      console.log('MediaSource opened');
      sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
      console.log('Source buffer: ', sourceBuffer);
    }

    function startRecording() {
      recordedBlobs = [];
      let options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
        options = { mimeType: 'video/webm;codecs=vp8' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not Supported`);
          errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
          options = { mimeType: 'video/webm' };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not Supported`);
            errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
            options = { mimeType: '' };
          }
        }
      }

      try {
        mediaRecorder = new MediaRecorder(window.stream, options);
      } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(
          e
        )}`;
        return;
      }
      that.setState({ isRecording: true });
      console.log(
        'Created MediaRecorder',
        mediaRecorder,
        'with options',
        options
      );
      recordButton.textContent = 'Stop Recording';
      playButton.disabled = true;
      downloadButton.disabled = true;
      mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
      };
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start(10); // collect 10ms of data
      console.log('MediaRecorder started', mediaRecorder);
    }

    function stopRecording() {
      mediaRecorder.stop();
      that.setState({ isRecording: false });
    }

    function handleSuccess(stream) {
      recordButton.disabled = false;
      console.log('getUserMedia() got stream:', stream);
      window.stream = stream;

      const gumVideo = document.querySelector('video#gum');
      gumVideo.srcObject = stream;
    }

    async function init(constraints) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
      } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
      }
    }

    function handleDataAvailable(event) {
      console.log('handleDataAvailable', event);
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
      }
    }
    function blobToFile(theBlob, fileName) {
      //A Blob() is almost a File() - it's just missing the two properties below which we will add
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    }

    recordButton.addEventListener('click', () => {
      if (recordButton.textContent === 'Start Recording') {
        startRecording();
      } else {
        stopRecording();
        recordButton.textContent = 'Start Recording';
        playButton.disabled = false;
        downloadButton.disabled = false;
      }
    });

    document
      .querySelector('button#start')
      .addEventListener('click', async () => {
        const constraints = {
          video: {
            width: 1280,
            height: 720,
          },
        };
        console.log('Using media constraints:', constraints);
        await init(constraints);
      });

    const playButton = document.querySelector('#play');
    playButton.addEventListener('click', () => {
      const superBuffer = new Blob(recordedBlobs, { type: 'video/mp4' });
      recordedVideo.src = null;
      recordedVideo.srcObject = null;
      recordedVideo.src = window.URL.createObjectURL(superBuffer);
      recordedVideo.controls = true;
      recordedVideo.play();
    });

    const downloadButton = document.querySelector('button#download');
    downloadButton.addEventListener('click', () => {
      const blob = new Blob(recordedBlobs, { type: 'video/mp4' });
      const blobFile = blobToFile(blob, 'file');
      this.uploadVideo(blobFile);
    });
  }
}

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: '#F7F7F7',
    color: 'black',
    width: 600,
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

/*
Copyright 2015 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v2/files/';

/**
 * Helper for implementing retries with backoff. Initial retry
 * delay is 1 second, increasing by 2x (+jitter) for subsequent retries
 *
 * @constructor
 */
var RetryHandler = function () {
  this.interval = 1000; // Start at one second
  this.maxInterval = 60 * 1000; // Don't wait longer than a minute
};

/**
 * Invoke the function after waiting
 *
 * @param {function} fn Function to invoke
 */
RetryHandler.prototype.retry = function (fn) {
  setTimeout(fn, this.interval);
  this.interval = this.nextInterval_();
};

/**
 * Reset the counter (e.g. after successful request.)
 */
RetryHandler.prototype.reset = function () {
  this.interval = 1000;
};

/**
 * Calculate the next wait time.
 * @return {number} Next wait interval, in milliseconds
 *
 * @private
 */
RetryHandler.prototype.nextInterval_ = function () {
  var interval = this.interval * 2 + this.getRandomInt_(0, 1000);
  return Math.min(interval, this.maxInterval);
};

/**
 * Get a random int in the range of min to max. Used to add jitter to wait times.
 *
 * @param {number} min Lower bounds
 * @param {number} max Upper bounds
 * @private
 */
RetryHandler.prototype.getRandomInt_ = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Helper class for resumable uploads using XHR/CORS. Can upload any Blob-like item, whether
 * files or in-memory constructs.
 *
 * @example
 * var content = new Blob(["Hello world"], {"type": "text/plain"});
 * var uploader = new MediaUploader({
 *   file: content,
 *   token: accessToken,
 *   onComplete: function(data) { ... }
 *   onError: function(data) { ... }
 * });
 * uploader.upload();
 *
 * @constructor
 * @param {object} options Hash of options
 * @param {string} options.token Access token
 * @param {blob} options.file Blob-like item to upload
 * @param {string} [options.fileId] ID of file if replacing
 * @param {object} [options.params] Additional query parameters
 * @param {string} [options.contentType] Content-type, if overriding the type of the blob.
 * @param {object} [options.metadata] File metadata
 * @param {function} [options.onComplete] Callback for when upload is complete
 * @param {function} [options.onProgress] Callback for status for the in-progress upload
 * @param {function} [options.onError] Callback if upload fails
 */
var MediaUploader = function (options) {
  var noop = function () {};
  this.file = options.file;
  this.contentType =
    options.contentType || this.file.type || 'application/octet-stream';
  this.metadata = options.metadata || {
    title: this.file.name,
    mimeType: this.contentType,
  };
  this.token = options.token;
  this.onComplete = options.onComplete || noop;
  this.onProgress = options.onProgress || noop;
  this.onError = options.onError || noop;
  this.offset = options.offset || 0;
  this.chunkSize = options.chunkSize || 0;
  this.retryHandler = new RetryHandler();

  this.url = options.url;
  if (!this.url) {
    var params = options.params || {};
    params.uploadType = 'resumable';
    this.url = this.buildUrl_(options.fileId, params, options.baseUrl);
  }
  this.httpMethod = options.fileId ? 'PUT' : 'POST';
};

/**
 * Initiate the upload.
 */
MediaUploader.prototype.upload = function () {
  var xhr = new XMLHttpRequest();

  xhr.open(this.httpMethod, this.url, true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('X-Upload-Content-Length', this.file.size);
  xhr.setRequestHeader('X-Upload-Content-Type', this.contentType);

  xhr.onload = function (e) {
    if (e.target.status < 400) {
      var location = e.target.getResponseHeader('Location');
      this.url = location;
      this.sendFile_();
    } else {
      this.onUploadError_(e);
    }
  }.bind(this);
  xhr.onerror = this.onUploadError_.bind(this);
  xhr.send(JSON.stringify(this.metadata));
};

/**
 * Send the actual file content.
 *
 * @private
 */
MediaUploader.prototype.sendFile_ = function () {
  var content = this.file;
  var end = this.file.size;

  if (this.offset || this.chunkSize) {
    // Only bother to slice the file if we're either resuming or uploading in chunks
    if (this.chunkSize) {
      end = Math.min(this.offset + this.chunkSize, this.file.size);
    }
    content = content.slice(this.offset, end);
  }

  var xhr = new XMLHttpRequest();
  xhr.open('PUT', this.url, true);
  xhr.setRequestHeader('Content-Type', this.contentType);
  xhr.setRequestHeader(
    'Content-Range',
    'bytes ' + this.offset + '-' + (end - 1) + '/' + this.file.size
  );
  xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
  if (xhr.upload) {
    xhr.upload.addEventListener('progress', this.onProgress);
  }
  xhr.onload = this.onContentUploadSuccess_.bind(this);
  xhr.onerror = this.onContentUploadError_.bind(this);
  xhr.send(content);
};

/**
 * Query for the state of the file for resumption.
 *
 * @private
 */
MediaUploader.prototype.resume_ = function () {
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', this.url, true);
  xhr.setRequestHeader('Content-Range', 'bytes */' + this.file.size);
  xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
  if (xhr.upload) {
    xhr.upload.addEventListener('progress', this.onProgress);
  }
  xhr.onload = this.onContentUploadSuccess_.bind(this);
  xhr.onerror = this.onContentUploadError_.bind(this);
  xhr.send();
};

/**
 * Extract the last saved range if available in the request.
 *
 * @param {XMLHttpRequest} xhr Request object
 */
MediaUploader.prototype.extractRange_ = function (xhr) {
  var range = xhr.getResponseHeader('Range');
  if (range) {
    this.offset = parseInt(range.match(/\d+/g).pop(), 10) + 1;
  }
};

/**
 * Handle successful responses for uploads. Depending on the context,
 * may continue with uploading the next chunk of the file or, if complete,
 * invokes the caller's callback.
 *
 * @private
 * @param {object} e XHR event
 */
MediaUploader.prototype.onContentUploadSuccess_ = function (e) {
  if (e.target.status === 200 || e.target.status === 201) {
    this.onComplete(e.target.response);
  } else if (e.target.status === 308) {
    this.extractRange_(e.target);
    this.retryHandler.reset();
    this.sendFile_();
  }
};

/**
 * Handles errors for uploads. Either retries or aborts depending
 * on the error.
 *
 * @private
 * @param {object} e XHR event
 */
MediaUploader.prototype.onContentUploadError_ = function (e) {
  if (e.target.status && e.target.status < 500) {
    this.onError(e.target.response);
  } else {
    this.retryHandler.retry(this.resume_.bind(this));
  }
};

/**
 * Handles errors for the initial request.
 *
 * @private
 * @param {object} e XHR event
 */
MediaUploader.prototype.onUploadError_ = function (e) {
  this.onError(e.target.response); // TODO - Retries for initial upload
};

/**
 * Construct a query string from a hash/object
 *
 * @private
 * @param {object} [params] Key/value pairs for query string
 * @return {string} query string
 */
MediaUploader.prototype.buildQuery_ = function (params) {
  params = params || {};
  return Object.keys(params)
    .map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    })
    .join('&');
};

/**
 * Build the drive upload URL
 *
 * @private
 * @param {string} [id] File ID if replacing
 * @param {object} [params] Query parameters
 * @return {string} URL
 */
MediaUploader.prototype.buildUrl_ = function (id, params, baseUrl) {
  var url = baseUrl || DRIVE_UPLOAD_URL;
  if (id) {
    url += id;
  }
  var query = this.buildQuery_(params);
  if (query) {
    url += '?' + query;
  }
  return url;
};

export default withStyles(styles)(AddVideoPage);
