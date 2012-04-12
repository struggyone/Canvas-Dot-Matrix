var Strugnell = {};
	
	
	/*DOTMATRIX COMPONENT*/
Strugnell.Dotmatrix = (function() {
	
	/*CONSTANTS*/
	//regex of allowed characters
	var REGEX = /^[0-9A-Za-z?!_\-\s+\\/():.=,''@#<>§""]+$/;

	//set character strings
	var CHAR_STRINGS = {
		// - represents a space, + represents a dot, | represents a new line
		"0" : "-+++-|+---+|+--++|+-+-+|++--+|+---+|-+++-",
		"1" : "--+--|-++--|--+--|--+--|--+--|--+--|-+++-",
		"2" : "++++-|----+|----+|-+++-|+----|+----|-++++",
		"3" : "++++-|----+|----+|-+++-|----+|----+|++++-",
		"4" : "+---+|+---+|+---+|-++++|----+|----+|----+",
		"5" : "+++++|+----|+----|++++-|----+|----+|++++-",
		"6" : "-+++-|+---+|+----|++++-|+---+|+---+|-+++-",
		"7" : "+++++|----+|----+|---+-|--+--|--+--|--+--",
		"8" : "-+++-|+---+|+---+|-+++-|+---+|+---+|-+++-",
		"9" : "-+++-|+---+|+---+|-++++|----+|+---+|-+++-",

		A : "-+++-|+---+|+---+|+++++|+---+|+---+|+---+",
		B : "++++-|+---+|+---+|++++-|+---+|+---+|++++-",
		C : "-++++|+----|+----|+----|+----|+----|-++++",
		D : "+++--|+--+-|+---+|+---+|+---+|+--+-|+++--",
		E : "+++++|+----|+----|+++++|+----|+----|+++++",
		F : "+++++|+----|+----|+++++|+----|+----|+----",
		G : "-++++|+----|+----|+--++|+---+|+---+|-++++",
		H : "+---+|+---+|+---+|+++++|+---+|+---+|+---+",
		I : "+++++|--+--|--+--|--+--|--+--|--+--|+++++",
		J : "--+++|----+|----+|----+|+---+|+---+|-+++-",
		K : "+---+|+--+-|+-+--|++---|+-+--|+--+-|+---+",
		L : "+----|+----|+----|+----|+----|+----|+++++",
		M : "+---+|++-++|+-+-+|+---+|+---+|+---+|+---+",
		N : "+---+|+---+|++--+|+-+-+|+--++|+---+|+---+",
		O : "-+++-|+---+|+---+|+---+|+---+|+---+|-+++-",
		P : "++++-|+---+|+---+|++++-|+----|+----|+----",
		Q : "-+++-|+---+|+---+|+---+|+-+-+|+--++|-++++",
		R : "++++-|+---+|+---+|++++-|+-+--|+--+-|+---+",
		S : "-++++|+----|+----|-+++-|----+|----+|++++-",
		T : "+++++|--+--|--+--|--+--|--+--|--+--|--+--",
		U : "+---+|+---+|+---+|+---+|+---+|+---+|-+++-",
		V : "+---+|+---+|+---+|+---+|+---+|-+-+-|--+--",
		W : "+---+|+---+|+---+|+---+|+-+-+|++-++|+---+",
		X : "+---+|+---+|-+-+-|--+--|-+-+-|+---+|+---+",
		Y : "+---+|+---+|+---+|-+-+-|--+--|--+--|--+--",
		Z : "+++++|----+|---+-|--+--|-+---|+----|+++++",

		" " : "---|---|---|---|---|---|---",
		"_" : "-----|-----|-----|-----|-----|-----|+++++",
		"." : "-|-|-|-|-|-|+",
		"-" : "-----|-----|-----|-+++-|-----|-----|-----",
		"+" : "-----|--+--|--+--|+++++|--+--|--+--|-----",
		"?" : "-+++-|+---+|----+|---+-|--+--|-----|--+--",
		"!" : "+|+|+|+|+|-|+",
		"/" : "----+|---+-|---+-|--+--|-+---|-+---|+----",
		"\\" : "+----|-+---|-+---|--+--|---+-|---+-|----+",
		"(" : "-+|+-|+-|+-|+-|+-|-+",
		")" : "+-|-+|-+|-+|-+|-+|+-",
		":" : "-|+|-|-|-|+|-",
		"=" : "-----|-----|+++++|------|+++++|-----|-----",
		"," : "--|--|--|--|--|-+|+-",
		"'" : "-+|+-|--|--|--|--|--",
		"\"" : "+-+|+-+|---|---|---|---|---",
		"@" : "-+++-|+---+|+-+++|+-+-+|+-+++|+----|-++++",
		"#" : "-+-+-|-+-+-|+++++|-+-+-|+++++|-+-+-|-+-+-",
		"<" : "-----|---+-|--+--|-+---|--+--|---+-|-----",
		">" : "-----|-+---|--+--|---+-|--+--|-+---|-----",
		"§" : "-----+-+------------|------+-------------|--++++++++----+----+|-+++++++++++---++++-|+++-+++++++++---++--|++++++++++++++-+++--|+++++++++++++++++---|++++++++++++++++----|-++++++++++++++-----",  //FAIL WHALE

		char_notFound: "-+-+-|+-+-+|-+-+-|+-+-+|-+-+-|+-+-+|-+-+-"
	};

	//option defaults
	var OPTIONS = {
		bgColor : "#000",
		bgGridColor : "#333",
		loop : false,
		dotHeight : 20,
		dotWidth : 20,
		dotGap : 3,
		dotColorArray : ["#666","#fff","#F60"],
		drawTimeout : 180, //smaller the quicker
		message : "HELLO",
		messageType : "message",
		messageColor : null,
		topSpace : "2"
	},
	
	toString = Object.prototype.toString,
	
	scrollFinishMethods = {
		default : function(){
			this.clearMsg();
		},
		loop : function(){
			this.setDotColor(this.messageColor); 
			this.frame = 2;
		}
	}

	/*CONSTRUCTOR*/
	function Dotmatrix( elem, opts ){
		//set canvas
		if( this._init != Dotmatrix.prototype._init ){
			return new Dotmatrix( elem, opts );
		}
		
		if( toString.call( elem ) === "[object Object]" ){
			opts = elem;	
		} else {
			this.canvas = document.getElementById(elem);
		}
		
		//check valid element has been provided
		if( !this.canvas ){
			throw new Error("Require a valid element on the page.");
		}
		
		if( typeof opts.scrollFinish === "function" ){
			this.scrollFinish = opts.scrollFinish;
		} else if( scrollFinishMethods[ opts.scrollFinish ] ) {
			this.scrollFinish = scrollFinishMethods[ opts.scrollFinish ];
		}
		
		//initiate dot matrix
		this._init( opts );
		return this;
	}

	/*PROTOTYPE*/
	Dotmatrix.prototype = {
		constructor : Dotmatrix,
		
		_init : function(opts){
			opts = opts || {};
			//setup canvas
			this.context = this.canvas.getContext('2d');
			this.canvasWidth = this.canvas.width;
			this.canvasHeight = this.canvas.height;
	
			//options
			for(var key in OPTIONS){
				this[ key ] = opts[ key ] || OPTIONS[ key ];
			}
	
			/*setup*/
			this.message = this.message.toUpperCase()
			this.frame = 0;
			this.scroll = true;
			this.charSpace = this.moveDist = this.dotWidth+this.dotGap;
			this.maxDots = this.canvas.width/this.moveDist;
			this.origXpos = Math.ceil(this.maxDots)*this.moveDist;
			this.xpos = this.origXpos;
			this.origYpos = (this.dotHeight+this.dotGap)*this.topSpace;
			this.ypos = this.origYpos;
		
			//draw background grid
			this.drawBg();
		},

		/*CONTROLS*/
		startMsg : function(){
			//clear old message
			this.clearMsg();
	
			//validate message
			if (this.message.search(REGEX) == -1 && this.message.length > 0){
				alert("Some of the characters in your message aren't currently supported so may not display correctly.");
			};
	
			//set dot color
			this.setDotColor(this.messageColor);
	
			//draw new message
			this.scroll = true;
			this.drawMsg(); 
		},

		clearMsg : function(){
	
			//stop scroll
			this.stopScroll();
	
			//draw bg to clear canvas
			this.drawBg();
		
			//reset frame
			this.frame = 0;
		},

		stopScroll : function(){
			this.scroll = false;
			clearTimeout(this.timeout)
		},


		/*SETTERS*/
		setMsg : function(msg, msgType){
			this.message = msg.toUpperCase();
			this.messageType = msgType || "message";
		},
	
		setLoop : function(loop){
			this.loop = loop;
		},

		setDotColor : function(newDotColor){
			this.dotColor = newDotColor || this.dotColorArray[Math.floor(Math.random()*this.dotColorArray.length)];
		},


		/*DRAWING*/
		drawBg : function(){
			var x;
	
			//set bgcolor
			this.context.fillStyle = this.bgColor;
			this.context.fillRect (0, 0, this.canvasWidth, this.canvasHeight);
	
			//set bg grid
			for (x = 0; x < this.canvasWidth; x = x + this.moveDist){
				for (y = 0; y < this.canvasHeight; y = y + this.moveDist){
					this.context.fillStyle = this.bgGridColor;
					this.context.fillRect (x, y, this.dotWidth, this.dotHeight);
				}
			}
		},

		drawDot : function(xpos, ypos){
			this.context.fillStyle = this.dotColor;
			this.context.fillRect (xpos, ypos, this.dotWidth, this.dotHeight);
		},

		drawMsg : function(){
			//start message
			var origXpos = this.xpos - (this.moveDist*this.frame),
				origYpos = this.ypos,
				xpos = this.xpos - (this.moveDist*this.frame),
				ypos = this.ypos,
				numOfDotsPerRow = 0,
				messageLength = this.message.length,
				charStringName,
				charArray,
				charArrayLength,
				rowString,
				rowStringLength,
				dotType,
				m,
				i,
				d;

			//draw background
			this.drawBg();

			//loop through each character in the message
			for (m=0; m < messageLength; m = m+1){
			
				//get string name
				if (this.message.charAt(m).search(REGEX) == 0) { 
					charStringName = this.message.charAt(m);
				} else {
					charStringName = "char_notFound";
				}

				//string containing details for character
				charString = CHAR_STRINGS[charStringName];

				//split string into array of rows
				charArray = charString.split("|");
				charArrayLength = charArray.length;

				//loop through each row
				for (i=0; i < charArrayLength; i = i+1) {
					numOfDotsPerRow = 0;
					rowString = charArray[i];
					rowStringLength = rowString.length;

					//loop through each dot	
					for (d=0; d < rowStringLength; d = d+1) {
						dotType = rowString.charAt(d);
						if (dotType === "+"){
							this.drawDot(xpos, ypos, this.dotColor);
						}
						xpos += this.dotWidth + this.dotGap;
						numOfDotsPerRow = numOfDotsPerRow + 1 ;				
					}

					//set up start pos of next row
					xpos = origXpos;
					ypos = ypos + this.dotHeight + this.dotGap;
				}

				origXpos = origXpos + numOfDotsPerRow*(this.dotWidth + this.dotGap) + this.charSpace;
				xpos = origXpos;
				ypos = origYpos;
			}

			this.frame = this.frame + 1;
			
			//scroll finish
			if (origXpos < 0){
				this.scrollFinish();
			}
	
			if (this.scroll === true){
				var that = this;
				this.timeout = setTimeout(function(){
					that.drawMsg()
				}, this.drawTimeout);
			}

		},
		
		scrollFinish : scrollFinishMethods.default
		
	};

	/*RETURN DOTMATRIX*/
	return Dotmatrix;

})();

/*TWTTER*/
Strugnell.Twitter = (function(){
	
	var twitterMatrix,
		twitterTimeout;

	function getTweets(opts){
		
		if( !opts.twitterMatrix ){
			throw new Error("Valid Matrix Object Required");
		}
		
		var username = opts.username || "",
			count = 1,
			twitterUrl = "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + username + "&count=" + count + "&include_rts=true&callback=Strugnell.Twitter.callback";
		
		twitterMatrix = opts.twitterMatrix;
	
		loadJsonP(twitterUrl);
	};

	function loadJsonP( url ){
		var script = document.createElement('script'),
			headTag = document.getElementsByTagName('head')[0];
		
		twitterTimeout = setTimeout(twitterTimeoutFunc, 2000)
		
		script.setAttribute('src', url);
		script.setAttribute('id', 'twitterId');
		headTag.appendChild(script);
	};

	function callback(json){
		var tweet = json[0].text.toUpperCase();
		tweet = tweet.replace(/\&AMP;/g,'&');
		tweet = tweet.replace(/\&LT;/g,'<');
		tweet = tweet.replace(/\&RT;/g,'>');
		
		
		//set and start message on matrix
		twitterMatrix.setMsg(tweet);
		twitterMatrix.startMsg();
		
		
		//remove script once it is finished with
		var headTag = document.getElementsByTagName('head')[0];
		headTag.removeChild(document.getElementById('twitterId'));
		
		//remove timeout
		clearTimeout(twitterTimeout)
	};
	
	function twitterTimeoutFunc(){
		//remove script
		var headTag = document.getElementsByTagName('head')[0];
		headTag.removeChild(document.getElementById('twitterId'));
		
		//set and start fail whale
		twitterMatrix.setMsg("§");
		twitterMatrix.startMsg();
	};

	
	return {
		getTweets : getTweets,
		callback : callback
	}

})();

//Single matrix with Twitter
Strugnell.singleTwitterMatrix = function(){
	var newDotMatrix = new Strugnell.Dotmatrix("dotmatrix_canvas", {
		message : "Yo!!",
		scrollFinish : 'loop'
	});
	
	newDotMatrix.startMsg();
	
	//message form
	var messageForm = document.getElementById('message_form');
	messageForm.addEventListener("submit", function(event){
		//prevent default action
		if ( event.preventDefault ) {
			event.preventDefault();
		};
		event.returnValue = false;
		
		//set message
		var messageInput = document.getElementById('message');			
		newDotMatrix.setMsg(messageInput.value);
		
		newDotMatrix.startMsg();
	}, false);
	
	//twitter form
	var twitterForm = document.getElementById('twitter_form');
	twitterForm.addEventListener("submit", function(event){
		//prevent default action
		if ( event.preventDefault ) {
			event.preventDefault();
		};
		event.returnValue = false;
		
		//get Tweet
		var twitterInput = document.getElementById('twitter');
		
		Strugnell.Twitter.getTweets({
			username : twitterInput.value,
			twitterMatrix : newDotMatrix
		});
		
	}, false);
	
}


//Double Matrix
Strugnell.doubleMatrix = function(){
	var dotMatrix1 = new Strugnell.Dotmatrix("dotmatrix_canvas1", {
		message : "Yo!!",
		scrollFinish : function(){
			dotMatrix2.message = dotMatrix1.message;
			dotMatrix2.startMsg();
			this.clearMsg();
		}
	});
	
	var dotMatrix2 = new Strugnell.Dotmatrix("dotmatrix_canvas2", {
		scrollFinish : function(){
			dotMatrix1.startMsg();
			this.clearMsg();
		}
	});
	
	dotMatrix1.startMsg();
}



