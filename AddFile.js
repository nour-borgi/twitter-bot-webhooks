/*
This file will run automatically
  change the path of the file 
This code in only able to upload a file that have a size <= 5MB 
*/

const config = require("./config.js");
var request = require("request-promise");
var fs = require("fs");
const FileType = require('file-type');

var AddFile = {}

//changable data :
var path = "./assets/Cute.PNG"; //change it
///////////

var media_category = "dm_image"; // change it with the according type : dm_image , dm_video or dm_gif

var total_bytes;          //information related to file
var media_type;
var Name = "any_name";
var media = {
  value: fs.createReadStream(path),
  options: {
    filename: path,
    contentType: null
  }
};
var media_id;

const oauth = {
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  token: config.access_token,
  token_secret: config.access_token_secret
};


var Finalizing = function () {   //final step 
  request({
    method: "POST",
    url: "https://upload.twitter.com/1.1/media/upload.json",
    oauth,
    formData: {
      Name,
      command: "FINALIZE",
      media_id
    }
  }).then(response => {
    console.log("finaly, you can use this media in your chatbot! ");
    console.log(JSON.parse(response));
    console.log("\n");
  });
}

var uploading = function () {  //second step 
  request({
    method: "POST",
    url: "https://upload.twitter.com/1.1/media/upload.json",
    oauth,
    headers: {
      "content-type": "multipart/form-data"
    },
    formData: {
      Name,
      command: "APPEND",
      media_id,
      media: media,
      media_data: media,
      segment_index: "0"
    }
  }).then(response => {
    console.log("Appending done !\n");
    Finalizing();        //To inform Twitter that we finish uploading our file 
  });
}
var sendingAttach = function () {
  fs.stat(path, function (err, stats) {
    total_bytes = stats.size;
    if (total_bytes / (1024 * 1024) > 5) console.log("this code can only upload a file under 5MB")
    else {
      console.log("Your file can be upload (<=5MB)");
      (async () => {
        media_type = (await FileType.fromFile(path)).mime;
      })();
      request({                    //init request to get the id_media : first step
        method: "POST",
        url: "https://upload.twitter.com/1.1/media/upload.json",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        oauth,
        form: {
          Name,
          command: "INIT",
          total_bytes,
          media_type,
          media_category,
          shared: "true"
        }
      })
        .then(response => {
          console.log(JSON.parse(response));
          media_id = JSON.parse(response).media_id_string;
          AddFile.id = media_id;
          uploading()      //starting uploading file 
        })
        .catch(err => console.log(err));
    }
  })

};


sendingAttach()

module.exports = AddFile
