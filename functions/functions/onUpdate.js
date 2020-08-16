
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');
const config = require('./config.json');

const MessagingResponse = twilio.twiml.MessagingResponse;

const projectId = process.env.GCLOUD_PROJECT;
const region = 'us-west3';

admin.initializeApp();

exports.simpleDbFunction = functions.database.ref('/path')
    .onUpdate((snapshot, context) => {
      const original = snapshot.val();
      console.log('entry updated', context.params.pushId, original);
      return original;
    });

exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Cloud Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);

      const uppercase = original.toUpperCase();

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Cloud Firestore.
      // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });

/*
        //TWILIO
        exports.reply = (req, res) => {
          let isValid = true;

          // Only validate that requests came from Twilio when the function has been
          // deployed to production.
          if (process.env.NODE_ENV === 'production') {
            isValid = twilio.validateExpressRequest(req, config.TWILIO_AUTH_TOKEN, {
              url: `https://${region}-${projectId}.cloudfunctions.net/reply`
            });
          }

          // Halt early if the request was not sent from Twilio
          if (!isValid) {
            res
              .type('text/plain')
              .status(403)
              .send('Twilio Request Validation Failed.')
              .end();
            return;
          }

          // Prepare a response to the SMS message
          const response = new MessagingResponse();

          // Add text to the response
          response.message('Your order is ready!');

          // Send the response
          res
            .status(200)
            .type('text/xml')
            .end(response.toString());
        };
*/
