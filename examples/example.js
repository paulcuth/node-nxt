
var util = require('util'),
	nodeNxt = require ('node-nxt');
	
	
nodeNxt.connect ('/dev/cu.usbmodem621', function (nxt) {

	var moveForward = function () {
		nxt.OutputSetSpeed (1, 32, 100);
		nxt.OutputSetSpeed (3, 32, 100);
	}

	
	var stop = function () {
		nxt.OutputSetSpeed (1, 0, 0);
		nxt.OutputSetSpeed (3, 0, 0);
	}


	nxt.DisplayText ('Hello!!!');
	moveForward ();
	
	var i = setTimeout (stop, 1000);


	nxt.on ('disconnect', function () {
		clearTimeout (i);
		util.print ('Disconnected :( Bye bye');
	});

});

