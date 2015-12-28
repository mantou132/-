'use strict';

var _ajax = require('./ajax.js');

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var DOC = window.document;
var BG = DOC.querySelector('div.bg');
var AIRCRAFT = BG.querySelector('svg.icon-aircraft');
var ORBIT = BG.querySelector('svg.icon-orbit');
var THUMBNAILS = DOC.querySelector('img.thumbnails');
var PAGE_1 = DOC.querySelector('#page_1');
var PAGE_2 = DOC.querySelector('#page_2');
var PAGE_3 = DOC.querySelector('#page_3');
var TO_PAGE_2 = PAGE_1.querySelector('.to_page_2');
var TEXT = PAGE_2.querySelector('.textarea textarea');
var SEND = PAGE_2.querySelector('.send');
var QRS = PAGE_2.querySelector('.qrs');
var SHARE = PAGE_3.querySelector('.share');
var GO_JIAYI = PAGE_3.querySelector('.go_jiayi');

var $ = function $(ele) {
	var method = {
		classRemove: function classRemove() {
			if (ele instanceof HTMLElement) {
				var _ele$classList;

				(_ele$classList = ele.classList).remove.apply(_ele$classList, arguments);
				return $(ele);
			}
		},
		classAdd: function classAdd() {
			if (ele instanceof HTMLElement) {
				var _ele$classList2;

				(_ele$classList2 = ele.classList).add.apply(_ele$classList2, arguments);
				return $(ele);
			}
		},
		setStyle: function setStyle(style) {
			if ((typeof style === 'undefined' ? 'undefined' : _typeof(style)) == 'object') {
				for (var p in style) {
					if (style.hasOwnProperty(p)) {
						ele.style[p] = style[p];
					};
				}
				return $(ele);
			};
		}
	};
	method.__proto__ = ele;
	return method;
};

// background setting
var bgSet = function bgSet() {
	var content = DOC.querySelector('.active_page .content');
	var em = getComputedStyle(content).fontSize.slice(0, -2);
	var position = content.getBoundingClientRect();
	var cl = position.left;
	var ct = position.top;
	var cw = position.width;

	var width = cw + 2 * em < innerWidth ? cw + 2 * em : cw;
	var height = width * 988 / 620;
	var top = (innerHeight - height) / 2;
	var left = (innerWidth - width) / 2;
	var aWidth = width * 111 / 620;
	var aHeight = aWidth * 100 / 111;
	var aTop = top + height * 94 / 988 - aHeight / 2;
	var aLeft = left - aWidth / 2;

	var orbitStyle = {
		width: width + 'px',
		height: height + 'px',
		top: top + 'px',
		left: left + 'px'
	};
	var aircraftStyle = {
		width: aWidth + 'px',
		height: aHeight + 'px',
		top: aTop + 'px',
		left: aLeft + 'px'
	};
	$(ORBIT).setStyle(orbitStyle);
	$(AIRCRAFT).setStyle(aircraftStyle);
};

var toPage = function toPage(page) {
	var current_page = DOC.querySelector('.active_page');

	$(current_page).classRemove('active_page').classAdd('old_page');
	$(page).classRemove('old_page').classAdd('active_page');
};

TO_PAGE_2.addEventListener('click', function (e) {
	e.preventDefault();
	toPage(PAGE_2);
}, false);

// 防止手机键盘出现后改变页面元素布局
// TEXT.addEventListener('focus', e => SEND.style.display = 'none');
// TEXT.addEventListener('blur', e => SEND.style.display = 'block');
window.onload = function (e) {
	DOC.body.style.height = innerHeight + 'px';

	BG.style.display = 'block';
	bgSet();

	// share to friend
	THUMBNAILS.src = 'img/thumbnails.png';

	// bg music
	var audio = new Audio('stamp.mp3');
	audio.loop = true;
	audio.load();
	audio.addEventListener('canplaythrough', function () {
		return audio.play();
	}, false);

	//music volume coll
	var timer_volume_up = setInterval(function () {
		if (audio.volume < 0.15) {
			audio.volume += 0.01;
		} else {
			audio.volume = 0.15;
			clearInterval(timer_volume_up);
		}
	}, 1000);
	var timer_count = setTimeout(function () {
		var timer_volume_down = setInterval(function () {
			if (audio.volume > 0.01) {
				audio.volume -= 0.01;
			} else {
				audio.volume = 0.01;
				clearInterval(timer_volume_down);
			}
		}, 1000);
	}, parseInt(audio.duration * 1000 - 15000));
};

TEXT.addEventListener('input', function (e) {
	var rows = TEXT.value.split(/\r?\n/).length;
	if (rows >= 3) {
		TEXT.rows = rows;
	}
}, false);

SEND.addEventListener('click', function (e) {
	var text = DOC.querySelector('textarea').value;
	if (!text) {
		alert('请填写信件内容');
		return;
	}
	// AIRCRAFT js animation;
	var body = {
		content: text
	};
	var option = {
		url: '/temp/receive/', // http://jiayi.la/temp/receive/
		data: JSON.stringify(body)
	};
	_ajax2.default.post(option, function (req) {
		toPage(PAGE_3);
	});
}, false);

QRS.addEventListener('click', function (e) {
	var img = undefined;
	if (e.target.tagName.toLocaleLowerCase() == 'img') {
		(function () {
			img = e.target;

			var _img$getBoundingClien = img.getBoundingClientRect();

			var width = _img$getBoundingClien.width;
			var height = _img$getBoundingClien.height;
			var top = _img$getBoundingClien.top;
			var left = _img$getBoundingClien.left;

			img = img.cloneNode();
			var _img = img;
			var naturalWidth = _img.naturalWidth;
			var naturalHeight = _img.naturalHeight;

			var div = DOC.createElement('div');
			div.addEventListener('click', function (e) {
				div.parentElement.removeChild(div);
			}, false);
			div.classList.add('pop_view');
			$(img).setStyle({
				width: width + 'px',
				height: height + 'px',
				top: top + 'px',
				left: left + 'px'
			});

			div.appendChild(img);
			DOC.body.appendChild(div);

			naturalWidth = naturalWidth || img.getAttribute('width');
			naturalHeight = naturalHeight || img.getAttribute('height');
			setTimeout(function () {
				$(img).setStyle({
					width: naturalWidth + 'px',
					height: naturalHeight + 'px',
					top: innerHeight / 2 - naturalHeight / 2 + 'px',
					left: innerWidth / 2 - naturalWidth / 2 + 'px'
				});
			}, 100);
		})();
	};
}, false);

SHARE.addEventListener('click', function (e) {
	var div = DOC.createElement('div');
	var img = DOC.createElement('img');
	img.src = 'img/weixin.png';
	div.classList.add('pop_view');
	img.classList.add('share');
	div.addEventListener('click', function (e) {
		div.parentElement.removeChild(div);
	}, false);
	div.appendChild(img);
	DOC.body.appendChild(div);
}, false);
GO_JIAYI.addEventListener('click', function (e) {
	// Ajax.get('/');
	location.href = '/redirect/appBao/';
}, false);