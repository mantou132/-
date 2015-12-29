"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var BODY = document.body;
var TRBL = undefined;
var toTop = [],
    toBottom = [],
    toLeft = [],
    toRight = [];
var sourceArguments = [];

TRBL = [toTop, toBottom, toLeft, toRight];

var util = function util(ele) {
	var startX = undefined,
	    startY = undefined,
	    moveEndX = undefined,
	    moveEndY = undefined,
	    X = undefined,
	    Y = undefined;
	var emptyFunction = function emptyFunction() {};

	ele.addEventListener("touchstart", function (e) {
		e.preventDefault();
		startX = e.changedTouches[0].pageX, startY = e.changedTouches[0].pageY;
	});
	ele.addEventListener("touchend", function (e) {
		e.preventDefault();
		var index = sourceArguments.indexOf(ele);
		moveEndX = e.changedTouches[0].pageX, moveEndY = e.changedTouches[0].pageY, X = moveEndX - startX, Y = moveEndY - startY;

		if (Math.abs(X) > Math.abs(Y) && X > 0) {
			if (!toRight) {
				return;
			};
			(toRight[index] || emptyFunction)();
		} else if (Math.abs(X) > Math.abs(Y) && X < 0) {
			if (!toLeft) {
				return;
			};
			(toLeft[index] || emptyFunction)();
		} else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
			if (!toBottom) {
				return;
			};
			(toBottom[index] || emptyFunction)();
		} else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
			if (!toTop) {
				return;
			};
			(toTop[index] || emptyFunction)();
		}
	});
};

var swipeEvent = function swipeEvent() {
	for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
		arg[_key] = arguments[_key];
	}

	var handler = undefined;
	if (arg.length === 0) {
		util(BODY);
		sourceArguments.push(BODY);
	} else {
		arg.map(function (item, index) {
			if (item instanceof HTMLElement) {} else {
				item = BODY;
			};
			sourceArguments.push(item);
			util(item);
		});
		TRBL.map(function (item) {
			var l = item.length = sourceArguments.length;
			for (var i = 0; i < l; i++) {
				item[i] = undefined;
			};;
		});
	}
	var listener = function listener(h, callback) {
		if (callback.length === 0) {
			throw 'zhishao yige';
		};
		if (callback.length === 1) {
			if (typeof callback[0] !== 'function') {
				throw 'xuyao zhishao yige hanshu ';
			};
			h.map(function (item, index) {
				return h[index] = callback[0];
			});
		} else {
			callback.map(function (item, index) {
				return h[index] = callback[index];
			});
		}
		return handler;
	};

	var cancelListener = function cancelListener(h, e) {
		var index = sourceArguments.indexOf(e);
		console.log(handler);
		if (index >= 0) {
			h[index] = false;
		}
		return handler;
	};

	return handler = {
		toTop: function toTop() {
			for (var _len2 = arguments.length, callback = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				callback[_key2] = arguments[_key2];
			}

			return listener(TRBL[0], callback);
		},
		toBottom: function toBottom() {
			for (var _len3 = arguments.length, callback = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				callback[_key3] = arguments[_key3];
			}

			return listener(TRBL[1], callback);
		},
		toLeft: function toLeft() {
			for (var _len4 = arguments.length, callback = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				callback[_key4] = arguments[_key4];
			}

			return listener(TRBL[2], callback);
		},
		toRight: function toRight() {
			for (var _len5 = arguments.length, callback = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
				callback[_key5] = arguments[_key5];
			}

			return listener(TRBL[3], callback);
		},
		toTopCancel: function toTopCancel(e) {
			return cancelListener(TRBL[0], e);
		},
		toBottomCancel: function toBottomCancel(e) {
			return cancelListener(TRBL[1], e);
		},
		toLeftCancel: function toLeftCancel(e) {
			return cancelListener(TRBL[2], e);
		},
		toRightCancel: function toRightCancel(e) {
			return cancelListener(TRBL[3], e);
		}
	};
};
exports.default = swipeEvent;