
var sys = require ('sys'),
	fs = require('fs');



function toNumber (callback) {
	return function (val) {
		return parseInt (callback (val));
	};
};




function toNumbers (callback) {
	return function () {
		var result = [],
			i,
			l = arguments.length;
			
		for (i = 0; i < l; i++) result[i] = parseInt (arguments[i], 10);
		return callback.apply (this, result);
	};
};




function escape (val) {
	switch (typeof val) {
		case 'undefined': return 'nil';
		case 'number': return val;
		default: return '"' + val.replace ('"', '\\"') + '"';
	}
}




exports.connect = function (path, callback) {
	new Nxt (path).on ('connect', callback).on ('error', sys.error);
};




var Nxt = function (path) {
	var me = this,
		chunkData = '> ';
	
	this._fd = null;
	this._events = {};
	this._callbacks = [];
	
	
	fs.createReadStream (path, { flags: 'r+' }).on ('open', function (fd) {
		me._fd = fd;
		me._fire ('connect', [me]);


	}).on ('end', function () {
		me._fire ('closed', [me]);


	}).on ('close', function () {
		me._fire ('disconnect', [me]);


	}).on ('error', function (error) {
		me._fire ('error', [error]);


	}).on ('data', function (chunk) {
		var pos;
		chunkData += chunk;
		
		while ((pos = chunkData.indexOf ('\n')) >= 0) {
			me._onData (chunkData.substr (0, pos - 1));
			chunkData = chunkData.substr (pos + 1);
		}
	});

};




Nxt.prototype.on = function (event, callback) {
	this._events[event] = callback;
	return this;
};




Nxt.prototype._fire = function (event, params) {
	var callback = this._events[event];
	if (callback) callback.apply (this, params);
};




Nxt.prototype._onData = function (data) {
	sys.print ('DATA: ' + data + '\n');
	
	if (data.substr (0, 1) == '>') return;
	
	var index,
		callback,
		pos = data.indexOf ('\t');

	if (pos >= 0) {
		index = parseInt (data.substr (0, pos), 10);
		
		if (index !== undefined && (callback = this._callbacks[index])) {
			data = data.substr (pos + 1);
			callback.apply (this, data.split ('\t'));
			this._callbacks[index] = null;
		}
	}		
};




Nxt.prototype._send = function (command, callback) {
	var index = '';
	
	if (callback) {
		index = this._callbacks.indexOf (null);
		if (index === -1) index = this._callbacks.length;

		this._callbacks[index] = callback;
		fs.write (this._fd, 'print (' + index + ',' + command + ')\n');

	} else {
		fs.write (this._fd, command + '\n');
	}
};








Nxt.prototype._VERSION = function (callback) {
	this._send ('nxt._VERSION', callback);
};




Nxt.prototype.BatteryRead = function (callback) {
	this._send ('nxt.BatteryRead ()', toNumbers (callback));
};




Nxt.prototype.BtConnect = function (con, dev) {
	this._send ('nxt.BtConnect (' + escape (con) + ',' + escape (dev) + ')');
};




Nxt.prototype.BtDisconnect = function (con) {
	this._send ('nxt.BtDisconnect (' + escape (con) + ')');
};




Nxt.prototype.BtDisconnectAll = function () {
	this._send ('nxt.BtDisconnectAll ()');
};




Nxt.prototype.BtFactoryReset = function () {
	this._send ('nxt.BtFactoryReset ()');
};




Nxt.prototype.BtGetConnectEntry = function (idx, callback) {
	var wrap = function (name, class, pin, addr, handle, status, linkq) {
		return callback (name, parseInt (class, 10), pin, addr, parseInt (handle, 10), parseInt (status, 10), parseInt (linkq, 10));
	};
	
	this._send ('nxt.BtGetConnectEntry (' + escape (idx) + ')', wrap);
};




Nxt.prototype.BtGetDeviceEntry = function (idx, callback) {
	var wrap = function (name, class, addr, status) {
		return callback (name, parseInt (class, 10), addr, parseInt (status, 10));
	};
	
	this._send ('nxt.BtGetDeviceEntry (' + escape (idx) + ')', wrap);
};




Nxt.prototype.BtGetStatus = function () {
	this._send ('nxt.BtGetStatus ()', toNumbers (callback));
};




Nxt.prototype.BtPower = function (state) {
	this._send ('nxt.BtPower (' + escape (state) + ')');
};




Nxt.prototype.BtSearch = function (state) {
	this._send ('nxt.BtSearch (' + escape (state) + ')');
};




Nxt.prototype.BtSetName = function (name) {
	this._send ('nxt.BtSetName (' + escape (name) + ')');
};




Nxt.prototype.BtSetPIN = function (pin) {
	this._send ('nxt.BtSetPIN (' + escape (pin) + ')');
};




Nxt.prototype.BtStreamMode = function (mode) {
	this._send ('nxt.BtStreamMode (' + escape (mode) + ')');
};




Nxt.prototype.BtStreamRecv = function (callback) {
	this._send ('nxt.BtStreamRecv ()', callback);
};




Nxt.prototype.BtStreamSend = function (con, string, reply, timeout) {
	this._send ('nxt.BtStreamSend (' + escape (con) + ',' + escape (string) + ',' + escape (reply) + ',' + escape (timeout) + ')');
};




Nxt.prototype.BtVisible = function (state) {
	this._send ('nxt.BtVisible (' + escape (state) + ')');
};




Nxt.prototype.ButtonRead = function (callback) {
	this._send ('nxt.ButtonRead ()', toNumber (callback));
};




Nxt.prototype.Checksum = function (string, type, callback) {
	this._send ('nxt.Checksum (' + escape (string) + ',' + escape (type) + ')', callback);
};




Nxt.prototype.DisplayClear = function () {
	this._send ('nxt.DisplayClear ()');
};




Nxt.prototype.DisplayFlip = function (state, callback) {
	this._send ('nxt.DisplayFlip (' + escape (state) + ')', toNumber (callback));
};




Nxt.prototype.DisplayGetPixel = function (x, y, callback) {
	this._send ('nxt.DisplayGetPixel (' + escape (x) + ',' + escape (y) + ')', toNumber (callback));
};




Nxt.prototype.DisplayInvert = function (state, callback) {
	this._send ('nxt.DisplayInvert (' + escape (state) + ')', toNumber (callback));
};




Nxt.prototype.DisableNXT = function (s) {
	this._send ('nxt.DisableNXT (' + escape (s) + ')');
};




Nxt.prototype.DisplayPixel = function (x, y, state) {
	this._send ('nxt.DisplayPixel (' + escape (x) + ',' + escape (y) + ',' + escape (state) + ')');
};




Nxt.prototype.DisplayScroll = function () {
	this._send ('nxt.DisplayScroll ()');
};




Nxt.prototype.DisplayText = function (text) {
	this._send ('nxt.DisplayText (' + escape (text) + ')');
};




Nxt.prototype.EncodeIR = function (data, mode) {
	this._send ('nxt.EncodeIR (' + escape (data) + ',' + escape (mode) + ')');
};




Nxt.prototype.FileChooser = function (operation, timeout, callback) {
	this._send ('nxt.FileChooser (' + escape (operation) + ',' + escape (timeout) + ')', callback);
};




Nxt.prototype.FileClose = function (handle, callback) {
	this._send ('nxt.FileClose (' + escape (handle) + ')', toNumber (callback));
};




Nxt.prototype.FileCreate = function (name, maxbytes, callback) {
	this._send ('nxt.FileCreate (' + escape (name) + ',' + escape (maxbytes) + ')', toNumber (callback));
};




Nxt.prototype.FileDelete = function (name, callback) {
	this._send ('nxt.FileDelete (' + escape (name) + ')', toNumber (callback));
};




Nxt.prototype.FileExists = function (name, callback) {
	var wrap = function (string) {
		return callback (string === 'true');
	};
	
	this._send ('nxt.FileExists (' + escape (name) + ')', wrap);
};




Nxt.prototype.FileFormat = function (type, callback) {
	this._send ('nxt.FileFormat (' + escape (type) + ')', toNumber (callback));
};




Nxt.prototype.FileHandleInfo = function (handle, callback) {
	wrap = function (type, name, block, maxBytes, curBytes, curPtr) {
		return callback (parseInt (type, 10), name, parseInt (block, 10), parseInt (maxBytes, 10), parseInt (curBytes, 10), parseInt (curPtr, 10));
	};
		
	this._send ('nxt.FileHandleInfo (' + escape (handle) + ')', wrap);
};




Nxt.prototype.FileOpen = function (name, callback) {
	this._send ('nxt.FileOpen (' + escape (name) + ')', toNumber (callback));
};




Nxt.prototype.FileRead = function (handle, bytes, callback) {
	var wrap = function (string) {
		return callback ((string === 'nil')? undefined : string);
	};
	
	this._send ('nxt.FileRead (' + escape (handle) + ',' + escape (bytes) + ')', wrap);
};




Nxt.prototype.FileSeek = function (handle, offset, callback) {
	this._send ('nxt.FileSeek (' + escape (handle) + ',' + escape (offset) + ')', toNumber (callback));
};




Nxt.prototype.FileSysInfo = function (handle, callback) {
	this._send ('nxt.FileSysInfo (' + escape (handle) + ')', toNumbers (callback));
};




Nxt.prototype.FileWrite = function (handle, string, callback) {
	this._send ('nxt.FileWrite (' + escape (handle) + ',' + escape (string) + ')', toNumber (callback));
};




Nxt.prototype.HeapInfo = function (force, callback) {
	throw new Error ('Not implemented');
};




Nxt.prototype.I2CGetStatus = function (callback) {
	this._send ('nxt.I2CGetStatus ()', toNumbers (callback));
};




Nxt.prototype.I2CInitPins = function (port) {
	this._send ('nxt.I2CInitPins (' + escape (port) + ')');
};




Nxt.prototype.I2CSendData = function (port, start, length) {
	this._send ('nxt.I2CSendData (' + escape (port) + ',' + escape (start) + ',' + escape (length) + ')');
};




Nxt.prototype.I2CRecvData = function (port, length, callback) {
	this._send ('nxt.I2CRecvData (' + escape (port) + ',' + escape (length) + ')', callback);
};




Nxt.prototype.InputGetStatus = function (port, callback) {
	this._send ('nxt.InputGetStatus (' + escape (port) + ')', toNumbers (callback));
};




Nxt.prototype.InputSetDir = function (port, dir0, dir1) {
	this._send ('nxt.InputSetDir (' + escape (port) + ',' + escape (dir0) + ',' + escape (dir1) + ')');
};




Nxt.prototype.InputSetType = function (port, type, mode) {
	this._send ('nxt.InputSetType (' + escape (port) + ',' + escape (type) + ',' + escape (mode) + ')');
};




Nxt.prototype.InputSetState = function (port, state0, state1) {
	this._send ('nxt.InputSetState (' + escape (port) + ',' + escape (state0) + ',' + escape (state1) + ')');
};




Nxt.prototype.InputSetValue = function (port, value) {
	this._send ('nxt.InputSetState (' + escape (port) + ',' + escape (value) + ')');
};




Nxt.prototype.MemInfo = function (callback) {
	this._send ('nxt.MemInfo ()', toNumbers (callback));
};




Nxt.prototype.MemRead = function (addr, string, callback) {
	this._send ('nxt.MemRead (' + escape (addr) + ',' + escape (string) + ')', toNumber (callback));
};




Nxt.prototype.MemWrite = function (addr, string, callback) {
	this._send ('nxt.MemWrite (' + escape (addr) + ',' + escape (string) + ')', toNumber (callback));
};




Nxt.prototype.OutputGetStatus = function (motor, callback) {
	this._send ('nxt.OutputGetStatus (' + escape (motor) + ')', toNumbers (callback));
};




Nxt.prototype.OutputResetTacho = function (motor, tacho, block, rot) {
	this._send ('nxt.OutputResetTacho (' + escape (motor) + ',' + escape (tacho) + ',' + escape (block) + ',' + escape (rot) + ')');
};




Nxt.prototype.OutputSetPID = function (motor, p, i, d) {
	this._send ('nxt.OutputSetPID (' + escape (motor) + ',' + escape (p) + ',' + escape (i) + ',' + escape (d) + ')');
};




Nxt.prototype.OutputSetRegulation = function (motor, state, mode, factor, divisor, offset) {
	this._send ('nxt.OutputSetRegulation (' + escape (motor) + ',' + escape (state) + ',' + escape (mode) + ',' + escape (factor) + ',' + escape (divisor) + ',' + escape (offset) + ')');
};




Nxt.prototype.OutputSetSpeed = function (motor, runstate, speed, tacho, turn) {
	this._send ('nxt.OutputSetSpeed (' + escape (motor) + ',' + escape (runstate) + ',' + escape (speed) + ',' + escape (tacho) + ',' + escape (turn) + ')');
};




Nxt.prototype.PowerDown = function (x) {
	this._send ('nxt.PowerDown (' + escape (x) + ')');
};




Nxt.prototype.Reboot = function () {
	this._send ('nxt.Reboot ()');
};




Nxt.prototype.Reflash = function () {
	this._send ('nxt.Reflash ()');
};




Nxt.prototype.RS485Enable = function (rate) {
	this._send ('nxt.RS485Enable (' + escape (rate) + ')');
};




Nxt.prototype.RS485RecvData = function (callback) {
	this._send ('nxt.RS485RecvData ()', callback);
};




Nxt.prototype.RS485SendData = function (string) {
	this._send ('nxt.RS485SendData (' + escape (string) + ')');
};




Nxt.prototype.SoundGetStatus = function (callback) {
	this._send ('nxt.SoundGetStatus ()', toNumber (callback));
};




Nxt.prototype.SoundMelody = function (melody, volume) {
	this._send ('nxt.SoundMelody (' + escape (melody) + ',' + escape (volume) + ')');
};




Nxt.prototype.SoundTone = function (frequency, duration, volume) {
	this._send ('nxt.SoundTone (' + escape (frequency) + ',' + escape (duration) + ',' + escape (volume) + ')');
};




Nxt.prototype.TimerRead = function (callback) {
	this._send ('nxt.TimerRead ()', toNumber (callback));
};




Nxt.prototype.XMODEMRecv = function (callback) {
	var wrap = function (val) {
		switch (val) {
			case '': return callback ();
			case 'false': return callback (false);
			default: return callback (val);
		}
	};
	
	this._send ('nxt.XMODEMRecv ()', wrap);	
};




Nxt.prototype.XMODEMSend = function () {
	var wrap = function (val) {
		if (val === '') return callback ();
		return !!val;
	};
	
	this._send ('nxt.XMODEMSend ()', wrap);
};



