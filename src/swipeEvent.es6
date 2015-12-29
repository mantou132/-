"use strict";
const BODY = document.body;
let TRBL;
let toTop = [], toBottom = [], toLeft = [], toRight = [];
let sourceArguments = [];

TRBL = [toTop, toBottom, toLeft, toRight];

let util = (ele) => {
	let startX, startY, moveEndX, moveEndY,X ,Y
	let emptyFunction = () => {};

	ele.addEventListener("touchstart", function(e) {
	    e.preventDefault();
	    startX = e.changedTouches[0].pageX,
	    startY = e.changedTouches[0].pageY;
	});
	ele.addEventListener("touchend", function(e) {
	    e.preventDefault();
		let index = sourceArguments.indexOf(ele);
	    moveEndX = e.changedTouches[0].pageX,
	    moveEndY = e.changedTouches[0].pageY,
	    X = moveEndX - startX,
	    Y = moveEndY - startY;

	    if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
	    	if (!toRight) {return};
	        (toRight[index] || emptyFunction)();
	    }
	    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
	    	if (!toLeft) {return};
	        (toLeft[index] || emptyFunction)();
	    }
	    else if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
	    	if (!toBottom) {return};
	        (toBottom[index] || emptyFunction)();
	    }
	    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
	    	if (!toTop) {return};
	        (toTop[index] || emptyFunction)();
	    }
	});
}

let swipeEvent = (...arg) => {
	let handler;
	if (arg.length === 0) {
		util(BODY);
		sourceArguments.push(BODY);
	} else {
		arg.map((item, index) => {
			if (item instanceof HTMLElement) {} else {item = BODY};
			sourceArguments.push(item);
			util(item);
		});
		TRBL.map(item => {
			let l = item.length = sourceArguments.length;
			for (let i = 0; i < l; i++) {
				item[i] = undefined;
			};;
		});
	}
	let listener = (h, callback) => {
		if (callback.length === 0) {throw 'zhishao yige'};
		if (callback.length === 1) {
			if (typeof callback[0] !== 'function') {throw 'xuyao zhishao yige hanshu '};
			h.map((item, index) => h[index] = callback[0]);
		} else {
			callback.map((item, index) => h[index] = callback[index]);
		}
		return handler;
	}

	let cancelListener = (h, e) => {
		let index = sourceArguments.indexOf(e);
		console.log(handler);
		if(index >= 0) {
			h[index] = false;
		}
		return handler;
	}

	return handler = {
		toTop(...callback) {
			return listener(TRBL[0], callback);
		},
		toBottom(...callback) {
			return listener(TRBL[1], callback);
		},
		toLeft(...callback) {
			return listener(TRBL[2], callback);
		},
		toRight(...callback) {
			return listener(TRBL[3], callback);
		},
		toTopCancel(e) {
			return cancelListener(TRBL[0], e);
		},
		toBottomCancel(e) {
			return cancelListener(TRBL[1], e);
		},
		toLeftCancel(e) {
			return cancelListener(TRBL[2], e);
		},
		toRightCancel(e) {
			return cancelListener(TRBL[3], e);
		}
	};
}
export default swipeEvent;
