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
    handleMessageEvent(event);
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
    "type": "imagemap",
    "baseUrl": "https://via.placeholder.com/300",
    "altText": "This is an imagemap",
    "baseSize": {
        "width": 1040,
        "height": 1040
    },
    "video": {
        "originalContentUrl": "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        "previewImageUrl": "https://via.placeholder.com/300",
        "area": {
            "x": 0,
            "y": 0,
            "width": 1040,
            "height": 585
        },
        "externalLink": {
            "linkUri": "https://google.com/",
            "label": "See More"
        }
    },
    "actions": [
        {
            "type": "uri",
            "linkUri": "https://google.com/",
            "area": {
                "x": 0,
                "y": 586,
                "width": 520,
                "height": 454
            }
        },
        {
            "type": "message",
            "text": "Hello",
            "area": {
                "x": 520,
                "y": 586,
                "width": 520,
                "height": 454
            }
        }
    ]
  }
  return client.replyMessage(event.replyToken, msg);
}

app.set('port', (process.env.PORT || 4000))

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})