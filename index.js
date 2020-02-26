/*
Main file 
 run it with the command : npm start
*/

const Twit = require('twit')
const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')

require('dotenv').config()

//files 
const config = require('./config')
const addFile = require('./AddFile')

//server
const app = express()

const bot = new Twit(config)

//you can change the port
app.set('port', (process.env.PORT || 3000))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// start server
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'))
})
/**
* Receives challenge response check (CRC)
**/
app.get('/webhook/twitter', function (request, response) {
    //return response.send('200 OK')
    var crc_token = request.query.crc_token

    var get_challenge_response = function (crc_token, consumer_secret) {
        hmac = crypto.createHmac('sha256', consumer_secret).update(crc_token).digest('base64')
        console.log('hmac:' + hmac)
        return hmac
    }
    if (crc_token) {
        var hash = get_challenge_response(crc_token, config.consumer_secret) //process.env.TWITTER_CONSUMER_SECRET
        response.status(200);
        response.send({

            response_token: 'sha256=' + hash
        })
    } else {
        response.status(400);
        response.send('Error: crc_token missing from request.')
    }
})

//some regex to test our chatbot
const regWelcome = RegExp('(he+l+o)|(sa*lu*t)|(3?[ae]*s+a*l+[ea]*ma?)|(hi+)|(bo*n*jo*u*r+)', 'g')
const regState = RegExp('((c?o?m*e?n?t?(\\s)?ca*va*)|(cha[h7]walek)|(la?b[ae]?s*))(\\s)?(\\?)?', 'g')
const regGoodbye = RegExp('bye', 'g')
const regAbout = RegExp('about', 'g')

/*
 Receives Account Activity events and respond 
 */

var followback = (name_user) => {     //it follows back and sends a welcome message
    bot.post('friendships/create', {
        screen_name: name_user
    }, (err, data, response) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
            sendingMessage(data.id_str, "welcome :)")
        }
    })
}

var sendingMessage = (id, message) => {  //send or send back a welcome message
    bot.post('direct_messages/events/new', {
        event: {
            type: "message_create",
            message_create: {
                target: {
                    recipient_id: id
                },
                message_data: {
                    text: message
                }
            }
        }
    }, (error, event) => {
        if (error) {
            console.log(error)
        }
        else {
            console.log(event);
        }
    })
}

var respondwithQuickreply = (sender_id) => {  //send back a message with quick replies when someone ask about state
    bot.post('direct_messages/events/new', {
        event: {
            type: "message_create",
            message_create: {
                target: {
                    recipient_id: sender_id
                },
                message_data: {
                    text: "Oui, et toi ?",
                    quick_reply: {
                        type: "options",
                        options: [
                            {
                                label: "ok",
                                description: "Dans une bonne etat.",
                                metadata: "ok"
                            }
                        ]
                    }
                }
            }
        }
    }, (error, event) => {
        if (error) {
            console.log(error)
        }
        else {
            console.log(event);

        }
    })
}

var respondwithButtons = (sender_id) => {     //send back a message with buttons when someone ask 'about'
    bot.post('direct_messages/events/new', {
        event: {
            type: "message_create",
            message_create: {
                target: {
                    recipient_id: sender_id
                },
                message_data: {
                    text: "We make chatbots !",
                    ctas: [
                        {
                            type: "web_url",
                            label: "Check our site web",
                            url: "https://hexastack.com/"
                        },
                        {
                            type: "web_url",
                            label: "check the CEO",
                            url: "https://twitter.com/messages/compose?recipient_id=467802802"
                        }
                    ]
                }
            }
        }
    }, (error, event) => {
        if (error) {
            console.log(error)
        }
        else {
            console.log(event)
        }
    })
}

var respondwithMedia = (sender_id, id_media) => {     //send back a message with media attachment when someone say 'bye'
    bot.post('direct_messages/events/new', {
        event: {
            type: "message_create",
            message_create: {
                target: {
                    recipient_id: sender_id
                },
                message_data: {
                    text: "mmm okey",
                    attachment: {
                        type: "media",
                        media: {
                            id: id_media
                        }
                    }
                }
            }
        }
    }, (error, event) => {
        if (error) {
            console.log(error)
        }
        else {
            console.log(event);

        }
    })
}



app.post('/webhook/twitter', function (request, response) {
    var event = JSON.parse(JSON.stringify(request.body));
    console.log(event);
    response.send('200 OK');
    if (event.follow_events) {
        if (event.follow_events[0].type === 'follow') {
            var name_user = event.follow_events[0].source.screen_name
            followback(name_user);
        }
    }
    else if (event.direct_message_events) {
        if (event.direct_message_events[0].type === 'message_create') {
            let sender_id = event.direct_message_events[0].message_create.sender_id
            if (event.for_user_id !== sender_id) {
                let message_recieved = event.direct_message_events[0].message_create.message_data.text;
                if (regWelcome.test(message_recieved)) {
                    sendingMessage(sender_id, "Salut !");    //simple message
                }
                else if (regState.test(message_recieved)) {
                    respondwithQuickreply(sender_id);        //quick replies
                }
                else if (regAbout.test(message_recieved)) {
                    respondwithButtons(sender_id);          //buttons
                }
                else if (regGoodbye.test(message_recieved)) {
                    var id = addFile.id
                    respondwithMedia(sender_id, id);            //media attachment
                }
            }
        }
    }
})
/**
 **/
app.get('/', function (request, response) {
    console.log(JSON.stringify(request.body))
    console.log('\n')
    var event = JSON.parse(request.body);
    console.log(event)
    response.send('200 OK')
})










