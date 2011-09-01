
var sys = require ('sys'),
	nodeNxt = require ('node-nxt'),
	http = require ('http'),
	fs = require ('fs'),
	socket = require ('socket.io'),
	server,
	nxt;
	
	
nodeNxt.connect ('/dev/cu.usbmodem621', function () {
//nodeNxt.connect ('/dev/cu.turtle-DevB-1', function () {

	nxt = this;

	server = http.createServer (function (request, response) {
		fs.readFile ('./public/index.html', 'ascii', function (err, output) {
		    writeResponse (response, output, 200, 'text/html');
		});
	}),
	
	server.listen (process.env.PORT || 3000);
	io = socket.listen (server);
	
	io.on ('connection', function (client) {
		handleSocketConnect (client);
	});
	

	nxt.DisplayText ("I'm ready!\"!");


	nxt.on ('disconnect', function () {
		clearInterval (i);
		sys.print ('Disconnected :( Bye bye');
	});

});



function writeResponse (response, output, status, type) {

	var headers = { 'Content-Type': type || 'text/javascript' };
	if (!status) status = 200;
	
    response.writeHead (status, headers);
    response.write (output);
    response.end ();
}





var forward = function () {
	nxt.OutputSetSpeed (1, 32, 100);
	nxt.OutputSetSpeed (3, 32, 100);
};
	

var back = function () {
	nxt.OutputSetSpeed (1, 32, -100);
	nxt.OutputSetSpeed (3, 32, -100);
};
	

var right = function () {
	nxt.OutputSetSpeed (1, 32, -100);
	nxt.OutputSetSpeed (3, 32, 100);
};
	

var left = function () {
	nxt.OutputSetSpeed (1, 32, 100);
	nxt.OutputSetSpeed (3, 32, -100);
};
	

var stop = function () {
	nxt.OutputSetSpeed (1, 0, 0);
	nxt.OutputSetSpeed (3, 0, 0);
};



function handleSocketConnect (client) {

	client.on ('message', function (data) {
		switch (data) {
			case 'forward':
				forward ();
				break;
				
			case 'back':
				back ();
				break;
				
			case 'left':
				left ();
				break;
				
			case 'right':
				right ();
				break;
				
			case 'stop':
				stop ();
				break;
		}
		
	});
}


