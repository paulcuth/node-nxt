
var sys = require ('sys'),
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
	
	setTimeout (stop, 1000);


//	nxt.TimerRead (function (time) {
//		sys.print ('timer: ' + time + '\n');
//
//		nxt.TimerRead (function (time) {
//			sys.print ('timer2: ' + time + '\n');
//		});
//
//	});


//	 var i = setInterval (function () {
//	 	nxt.ButtonRead (function (val) {
//	 		
//	 		if (val > 0) sys.print ('BUTTON: ' + val + '\n');
//	 	});
//	 }, 50);

	
//	nxt.BtGetDeviceEntry (undefined, function (name, class, addr, status) {
//		sys.debug ('BT: ' + name + ' / ' + class + ' / ' + addr + ' / ' + status);
//	});
//	
//
//	nxt._VERSION (function (ver) { sys.print ('VERSION: ' + ver + '\n'); });
//
//	setInterval (function () {
//		nxt.OutputGetStatus (1, function (speed, tacho, blocktacho, runstate, overload, rotcount, torun) {
//			sys.debug (speed + ' / ' + tacho + ' / ' + blocktacho + ' / ' + runstate + ' / ' + overload + ' / ' + rotcount + ' / ' + torun);
//		});
//	}, 1000);

	nxt.on ('disconnect', function () {
		clearInterval (i);
		sys.print ('Disconnected :( Bye bye');
	});

});

