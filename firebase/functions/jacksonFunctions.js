const functions = require('firebase-functions');
const request = require('request');
exports.schedule = functions.pubsub.schedule('00 19 * * *')
    .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
    .onRun((context) => {
        var jsonObject = {
          
            "app_id": "81ed674d-365f-47db-986c-ad6d40b977de",
            "included_segments": ["Subscribed Users"],
            "contents": {"en": "Please Complete Daily Survey"}
          };
          var jsonData = JSON.stringify(jsonObject);
          let url = "https://onesignal.com/api/v1/notifications"; //or production  
          request.post({
            headers: {
              'content-type': 'application/json',
              'Authorization':'Basic ZGY0YjQxZjItMmNhZC00YWE2LTkyYWUtMWY5ZDI1ODkwNmFh'
            },
            url: url,
            body: jsonData
          }, function(error, response, body) {
            if (error) {
                console.log("error Generate")
            } else {
              console.log(JSON.stringify(response));
            }
          });
    });