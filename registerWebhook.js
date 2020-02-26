/*
To run this file correctly:
  run the server with the command : npm start 
  then, type in another terminal : node registerWebhook.js (url) 
url is the callback url where you will receive webhook it should be https 
       ** exemple : node registerWebhook.js https://hzugzidg.ngrok.io 
*/

const config = require("./config.js");
var request_p = require("request-promise");

var urlngrok = process.argv.slice(2);

let webhookId;

const oauth = {
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  token: config.access_token,
  token_secret: config.access_token_secret
};

var Get = {
  method: "GET",
  url: "https://api.twitter.com/1.1/account_activity/all/dev/webhooks.json",
  oauth,
  json: true
};

var Post = {
  method: "POST",
  url: "https://api.twitter.com/1.1/account_activity/all/dev/webhooks.json",
  json: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  oauth,
  form: {
    url: urlngrok + "/webhook/twitter"
  }
};


var subscribing = function () {
  var options = {
    'method': 'POST',
    'url': 'https://api.twitter.com/1.1/account_activity/all/dev/subscriptions.json',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    oauth,
    json: true
  };
  request_p(options, function (error, response) {
    if (error) throw new Error(error);
    console.log("\nLet's subscribe:\nresponse : ")
    if (response.statusCode == 204) {
      console.log(response.statusCode + " Subscription done !\n")
    }
  }).catch(error => {
    console.log("***Sorry an error was occured when subscribing , more details :\n " + error);
  });
}


var creating = function () {
  console.log(
    "Now, registration of the new webhook with the url given\n"
  );
  request_p(Post)
    .then(function (response_post) {
      if (response_post) {
        console.log(
          "-----Congratulations ! Webhook was registred :\n ");
        console.log(response_post)
        subscribing();           //to subscribe after registring webhook
      }
    })
    .catch(error => {
      console.log(
        "***Sorry an error was occured when creating, more details : \n" + error
      );
    });
}

var deleting = function () {
  request_p({
    method: "DELETE",
    url:
      "https://api.twitter.com/1.1/account_activity/all/dev/webhooks/" +
      webhookId +
      ".json",
    oauth,
    json: true
  })
    .then(function () {
      console.log("---Webhook was deleted--- \n ");
      creating()             //after deleting
    })
    .catch(error => {
      console.log("***Sorry an error was occured when deleting, more details :\n " + error);
    });
}
/* Registration of webhook : */
var registration = function () {
  console.log("First, checking if you have any webhook registred before...\n");
  request_p.get(Get)                     //checking 
    .then(function (response) {
      if (response.length) {
        console.log("-----Webhook information : \n");
        console.log(response)
        webhookId = response[0].id;
        console.log("this webhook will be deleted\n");
        deleting()                        //deleting the webhook registred before so that we can register a new one
      } else {
        creating()                        //in case no webhook registred
      }
    }).catch(error => {
      console.log("***Sorry an error was occured when getting , more details :\n " + error);
    });
};

registration();
