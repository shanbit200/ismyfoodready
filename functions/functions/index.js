const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



const admin = require('firebase-admin');
const config = require('./config.json');



const projectId = process.env.GCLOUD_PROJECT;
const region = 'us-west3';

admin.initializeApp();

exports.dbUpd = functions.database.ref('/').onUpdate((change, context) => {
      const original = change.after.val();
      console.log('entry updated', context.params.pushId, original);

      var string = JSON.stringify(original)
      console.log(string)

      if(string.includes("Ready")){
        //order is ready
        console.log("ORDER READY");

        //{"Ready":"Ready","1":"6502457925"}

        string = string.replace(/\"/g,'')
        console.log(string);
        //var pat = /\d{10}
        var regex = string.match(/\d{10}/);

        console.log(regex)

        if(regex.length > 0){


          // Requiring the values to send
          let
            getMessage = "Your order is ready!",
            getPhoneTo = '+1'+regex[0],
            getPhoneFrom = "+12694977582",
            accountSid = 'AC29739be887c8441945af9c1279d74bf2',
            authToken  = 'c7d1eeefcc5b0ca88e9f78e7e640c917';

          //require the Twilio module and create a REST client
          let client = require('twilio')(accountSid, authToken);

          return client.messages
            .create({
            body: getMessage, // Any number Twilio can deliver to
            from: getPhoneFrom, // A number you bought from Twilio and can use for outbound communication
            to: getPhoneTo // body of the SMS message
          });

        }



      }

      return original;
    });

// {"cashName":"joe","custName":"dt45","orderID":"QWESD","status":"Ready"}
