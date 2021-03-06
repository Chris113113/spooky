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

var twit = new Twit(secrets, (a:any,b:any,c:any) => {
    console.log(a);
    console.log(b);
    console.log(c);
});

///////////////////////////////////
// Logic
///////////////////////////////////
let activeTweet = null;

app.use('/', Express.static('static'));

var stream = twit.stream('statuses/filter', { track: 'halloween' });
stream.on('tweet', (tweet : any) => {
    console.log(tweet);
    activeTweet = tweet;
});

function throttle() {
    setTimeout(()=>{
        io.emit('tweet', activeTweet);
        throttle()
    }, 2000);
}
throttle();