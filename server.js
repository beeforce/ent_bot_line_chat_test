const express = require('express');
const line = require('@line/bot-sdk');

require('dotenv').config();
const app = express()

const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};

const client = new line.Client(config);

app.get('/', function (req, res) {
	res.send('01-reply-bot!!');
})

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
});

function handleEvent(event) {
  console.log(event);
  if(event.type === 'message') {
    // handleMessageEvent(event);
    handleImagemapMessageEvent(event);
  }
  else {
    return Promise.resolve(null)
  }
}

function handleMessageEvent(event) {
  var msg = {
    type: "text",
    text: "this is "+ event.message.type
  }
  return client.replyMessage(event.replyToken, msg);
}

function handleImagemapMessageEvent(event) {
  var msg = {
    "type": "template",
    "altText": "this is a carousel template",
    "template": {
        "type": "carousel",
        "columns": [
            {
              "thumbnailImageUrl": "https://vignette.wikia.nocookie.net/line/images/b/bb/2015-brown.png/revision/latest?cb=20150808131630",
              "imageBackgroundColor": "#FFFFFF",
              "title": "this is menu",
              "text": "description",
              "actions": [
                  {  
                      "type":"cameraRoll",
                      "label":"Camera roll"
                  },
                  {  
                    "type":"location",
                    "label":"Location"
                 }
              ]
            },
            {
              "thumbnailImageUrl": "https://c.76.my/Malaysia/line-brown-bear-cute-pencil-case-ubiyo-1802-02-Ubiyo@6.jpg",
              "imageBackgroundColor": "#000000",
              "title": "this is menu",
              "text": "description",
              "actions": [
                {
                  "type":"datetimepicker",
                  "label":"Select date",
                  "data":"storeId=12345",
                  "mode":"datetime",
                  "initial":"2017-12-25t00:00",
                  "max":"2018-01-24t23:59",
                  "min":"2017-12-25t00:00"
                },
                {  
                  "type":"camera",
                  "label":"Camera"
               }
            ]
            }
        ],
        "imageAspectRatio": "rectangle",
        "imageSize": "cover"
    }
  }
  
  return client.replyMessage(event.replyToken, msg);
}

app.set('port', (process.env.PORT || 4000))

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})