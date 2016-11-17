// simplegameserver.js
// takes a string from each connection
// and returns all the other sent strings
//
// modified from 
// https://www.npmjs.com/package/nodejs-websocket
// uses nodejs-websocket

// will hold array of clients
var clientData = {};

var ws = require("nodejs-websocket");
var connection;
var server = ws.createServer(function(conn) {
	connection = conn;
	console.log("New connection");

	//hook up event handlers
	conn.on("text", textIn);
	conn.on("close", closeConn);
});

var textIn = function(str){
	//expects string as "key|payload"
	console.log("received: " + str);
	temp = str.split("|");
	key = temp[0];
	value = temp[1];
	//store payload in clientData hash by key
	clientData[key] = value;

	//broadcast updated data to all clients
	broadcast();
	//return all clientData as a big string
	//connection.sendText(getClientData("html"));

	//report all clientData locally
	console.log("current data: ");
	console.log(getClientData("plain"));
	console.log("\n");

} // end textIn

var closeConn = function(code, reason){
	console.log("connection closed");
} // end closeConn

function getClientData(format){
  if (format == "html"){
    endl = "<br />";
  } else {
    endl = "\n";
  } // end if
  //reports all contents of clientData
  output = "";
  for (i in clientData){
    output += i + "|" + clientData[i] + endl;
  } // end for
  return output;
} // end getClientData

function broadcast(){
  //sends all client data to all clients
  server.connections.forEach(function (conn){
    conn.sendText(getClientData("plain"));
  });
} // end function

server.listen(8001);


