// initializes our tweet response object
function createCircleInstance(data) {

	// Buffer length for events piling up while javascript isn't on the main thread
	if(tweetObjects.length > 50) return;

	circle = new createjs.Shape();
	color = decideRandomColor();
	circle.graphics.beginFill(color).drawCircle(0, 0, 10);

	text = data.user.screen_name + ": " + data.text;
	textObject = new createjs.Text(text, "12px Arial", "#ffffff");
	textObject.x =  -(textObject.getMeasuredWidth() / 2);
	textObject.tweetID = data.id_str;

	textObject.on("click", clickHandler);

	circle.on("click", clickHandler);

	function clickHandler() {
		document.getElementById('tweetContainer').innerHTML = "";
		twttr.widgets.createTweet(
			textObject.tweetID,
			document.getElementById('tweetContainer'),
			{
				theme: 'dark'
			}
		);
	}

	container = new createjs.Container();
	container.addChild(circle, textObject);
	container.x = Math.random()*(width - 20) + 10;
	container.y = Math.random()*(height - 20) + 10;
	tweetObjects.push(container);
	stage.addChild(tweetObjects[tweetObjects.length-1]);

	stage.update();
}

// Returns a color from our preselected pallete: http://www.color-hex.com/color-palette/3399
function decideRandomColor() {
	switch(Math.round(Math.random()*5)) {
		case 0:  return "#ff9a00";
		case 1:  return "#000000";
		case 2:  return "#09ff00";
		case 3:  return "#c900ff";
		default: return	"#fbfaf4";
	}
}

// Frame logic
function handleTick() {
	for(i = tweetObjects.length-1; i >= 0; i--) {

		tweetObjects[i].getChildAt(0).scaleX += .1;
		tweetObjects[i].getChildAt(0).scaleY += .1;
		tweetObjects[i].alpha -= .02;
		if(tweetObjects[i].alpha <= 0) {
			tweetObjects.splice(i,1);
		}
	}
	stage.update();
}

// Anonymous function to initialize page
(function() {
	stage = new createjs.Stage("myCanvas");
	height = document.getElementById("myCanvas").clientHeight;
	width  = document.getElementById("myCanvas").clientWidth;

	createjs.Ticker.addEventListener("tick", handleTick);

	tweetObjects = [];
	lastTweet = "";

	var socket = io.connect('http://localhost:8888');
	  console.log("socket connection successful");
	  socket.on('tweet', function (data) {
	    createCircleInstance(data);
	  });
})();