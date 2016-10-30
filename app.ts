///////////////////////////////////
// Imports
///////////////////////////////////
import Express = require('express');
var Twit = require('twit');
import Http = require('http');
import SocketIO = require('socket.io');
var secrets = require('./secret');

///////////////////////////////////
// Config
///////////////////////////////////
var app = Express();
var server = Http.createServer(app);
var io = SocketIO(server);

server.listen(8888);

var twit = new Twit(secrets, (a:any,b:any,c:any) => {});

///////////////////////////////////
// Logic
///////////////////////////////////
let activeTweet = null;

app.use('/', Express.static('static'));
io.on('connection', (socketServer) => {
  console.log("connection received");
  socketServer.on('npmStop', () => {
    process.exit(0);
  });
});

var stream = twit.stream('statuses/filter', { track: 'halloween' });
stream.on('tweet', (tweet : any) => {
    if(tweet.user.lang == 'en' && !tweet.text.startsWith("RT @")){
        activeTweet = tweet;
        io.emit('tweet', activeTweet);
    }
});

function throttle() {
    let timeout = (Math.random()*400)+50;
    setTimeout(()=>{
        io.emit('tweet', activeTweet);
        throttle();
    }, timeout);
}
// throttle();