/*
This file can authenticate you and get you the bearer token if you need it 
it displays the list of subscriptions 
To run this file, excute in a terminal : node Auth.js 
*/
var request = require("request-promise");
const config = require("./config.js");

var bearer_token;

var update_bearer = function (newBearer) {
  bearer_token = newBearer;
}

const check = function (str) {    //encodeURL function 
  str = (str + '')
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}
//base-64 encoder : 
var encodedString = Buffer.from(check(config.consumer_key) + ':' + check(config.consumer_secret)).toString('base64')


var subscriptions = function () {  //to get the list of subscriptions 
  var options = {
    'method': 'GET',
    'url': 'https://api.twitter.com/1.1/account_activity/all/dev/subscriptions/list.json',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + bearer_token
    },
    'JSON': 'true'
  };
  request(options).then((response) => {
    console.log('\nList of subscribers : ')
    console.log(JSON.parse(response));
  }).catch(error => {
    console.log("***Sorry an error was occured when subscribing, more details :\n " + error);
  });
}


var authentication = function () {                   //auto-authentication
  request({
    'method': 'POST',
    'url': 'https://api.twitter.com/oauth2/token',
    'headers': {
      'Authorization': 'Basic ' + encodedString,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    form: {
      'grant_type': 'client_credentials'
    }
  }, function (error, response) {
    if (error) reject(error);
    update_bearer(response.body.substring('{"token_type":"bearer","access_token":"'.length, response.body.length - 2));
    console.log("bearer token :" + bearer_token)
  })
    .then(() => {
      subscriptions()             //you can change this or add it 
    }).catch(error => {
      console.log("***Sorry an error was occured when getting the bearer token, more details :\n " + error);
    });
}

authentication()






