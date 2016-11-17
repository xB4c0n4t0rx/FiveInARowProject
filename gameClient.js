// stateData stores a string containing the state of all
// client information

var stateData = "";

function GameClient(url){
    
    // class encapsulates a connection to the game class
    // connect and sendMessage are meant to be used as-is
    // overwrite other methods as needed for event-handling
    // url is a websocket url
    
    // Andy Harris, 2015
    // released under GPL

    /* USAGE:
     * run gameserver.js on a server with node.js and
     * nodejs-websocket installed
     * include this (gameClient.js) file in your HTML file
     * instantiate a GameClient object with the URL of the 
     * server (ws:localhost:8001/gameserver.js) as the parameter
     * Connect to the server with gc.connect() (assuming gc is the 
     * instance of game client
     * send this object's state data with gc.sendMessage(key, value)
     * where key is the identifier for this player and value is a 
     * string of state data
     * create a getMessage(text) function.  On every update from any
     * client, the text will be a status string of every client in the
     * system (key|value)
     * close the connection with a call to gc.close()
     * For added functionality, overwrite this class and add more
     * to the various event handlers commented below.
     */


    this.output;
    this.websocket;
    this.url = url;

    this.connect = function(){
      if ("WebSocket" in window){
        this.websocket = new WebSocket(url);
  
        //attach event handlers
        this.websocket.onopen = this.onOpen;
        this.websocket.onclose = this.onClose;
        this.websocket.onmessage = this.onMessage;
        this.websocket.onerror = this.onError;
      } else {
        alert ("web sockets not supported on this browser");
      } // end if
  
    } // end connect
  
    this.onOpen = function(evt){
      //overWrite this for code to happen after successful open
    } // end onOpen
  
    this.onClose = function(evt){
      //overwrite this for code to happen after successful close
    } // end onClose
  
    this.onMessage = function(evt){
      // evt.data is a block of data: key|value pairs.
      stateData = evt.data;
      
      //call the local getMessage function if it exists
      getMessage(evt.data);
    } // end onMessage

    this.onError = function(evt){
      return "Error: " + evt.data;
    } // end onError
  
    this.sendMessage = function(key, value){
      message = key + "|" + value;
      this.websocket.send(message);
    } // end sendMessage
  
    this.close = function(){
      this.websocket.close();
    } // end close

    this.getState = function(searchKey){
      // given a message and key, returns the status
      // string associated with that key
       
      result = "element not found";
      messageList = stateData.split("\n");
      for (i in messageList){
        line = messageList[i].split("|");
	key = line[0];
	value = line[1];
	if(searchKey == key){
	  result = value.trim();
	} // end if
      } // end for
      return result;
    } // end getState

    this.getKeys = function(message){
      //given the message, returns a list of keys
      var keyArray = [];
      messageList = stateData.split("\n");
      for (i in messageList){
        line = messageList[i].split("|");
	key = line[0];
	// don't push null keys
	if (key != ""){
	  keyArray.push(key);
	} // end if
      } // end for
      return keyArray;
  } // end getKeys

  this.sendSprite = function(key, sprite){
    // extract information from the sprite and send
    // a message to the server in the format
    // key|image, x, y, width, height, dir
    message = "";
    message += sprite.image.src + ",";
    message += sprite.x + ",";
    message += sprite.y + ",";
    message += sprite.width + ",";
    message += sprite.height + ",";
    message += sprite.getImgAngle();
    this.sendMessage(key, message);
  } // end sendSprite

  this.updateRemoteSprite = function(key, sprite){
    // finds the message with the appropriate key (if it exists)
    // and updates the sprite with the values sent through 
    // sendSprite
    message = this.getState(key);
    if (message == "element not found"){
      console.log("can't find element: " + key);
    } else {
      msgArray = message.split(",");
      sprite.setImage(msgArray[0]);
      sprite.setX(parseInt(msgArray[1]));
      sprite.setY(parseInt(msgArray[2]));
      sprite.width = parseInt(msgArray[3]);
      sprite.height = parseInt(msgArray[4]);
      sprite.setImgAngle(parseInt(msgArray[5]));
    } // end if
  } // end updateRemoteSprite

} // end class def


// blank getMessage function to avoid error
// overwrite in client to do something else with the data

function getMessage(text){
  //do nothing. Overwrite in local client
} // end getMessage
