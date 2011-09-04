# Node-NXT

Node-NXT is a Node.js project that can be used to contol a Lego Mindstorms NXT device that is running pbLua.

Node-NXT mirrors the NXT API of pbLua, enabling you to write scripts to control the device in JavaScript.

## How to Install

    npm install node-nxt

## How to use

First, require `node-nxt`:

```js
var nodeNxt = require('node-nxt');
```

Next, connect to the device using USB port or Bluetooth (USB in this example):

```js
nodeNxt.connect ('/dev/cu.usbmodem621', function (nxt) {
	// ...
};
```

Then use the value passed to the callback in much the same way as you would in pbLua:

```js	
	nxt.DisplayText ('Hello world.');
```

Use callbacks to retrieve returned values:

```js
	nxt.TimerRead (function (time) {
		sys.print ('Time on nxt: ' + time);
	});
};
```

See also the included example script.


## License 

(The MIT License)

Copyright (c) 2011 Paul Cuthbertson &lt;node-nxt@paulcuth.me.uk&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.