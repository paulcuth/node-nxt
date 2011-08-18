
var sys = require ('sys'),
	serialport = require ('serialport'),

	sp = new serialport.SerialPort ('/dev/tty.Bluetooth-Modem', {
		parser: serialport.parsers.readline ('\n') 
	});
	
	
sp.on ('data', function (data) {
	sys.print ("data: " + data);
});


sp.write ('print ("Hello world")');


setInterval (function () {
}, 1000);