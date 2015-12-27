"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Empty = function Empty() {};
var Ajax = {
	get: function get(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = this.done(xhr, callback);
		xhr.open("get", url, true);
		xhr.send();
	},
	post: function post(option, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = this.done(xhr, callback);
		xhr.open("post", option.url, true);
		xhr.send(option.data);
	},
	done: function done(xhr, callback) {
		var _this = this;

		return function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					(callback || Empty)(_this.response);
				} else {
					alert('错误');
				}
			}
		};
	}
};
exports.default = Ajax;