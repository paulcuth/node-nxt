
var sys = require ('sys'),
	nodeNxt = require ('node-nxt');
	
	
nodeNxt.connect ('/dev/cu.usbmodem26411', function (nxt) {
	
	nxt.DisplayText ('Hello Moo');

	nxt.TimerRead (function (time) {
		sys.print ('timer: ' + time + '\n');

		nxt.TimerRead (function (time) {
			sys.print ('timer2: ' + time + '\n');
		});

	});


	// var i = setInterval (function () {
	// 	nxt.ButtonRead (function (val) {
	// 		
	// 		if (val > 0) sys.print ('BUTTON: ' + val + '\n');
	// 	});
	// }, 50);

	
	nxt.BatteryRead (function (mV, recharge, cap) {
		sys.debug (mV + ' / ' + recharge + ' / ' + cap);
		sys.debug (typeof mV + ' / ' + typeof recharge + ' / ' + typeof cap);
	});
	

	nxt.on ('disconnect', function () {
		clearInterval (i);
		sys.print ('Disconnected :( Bye bye');
	});

});

