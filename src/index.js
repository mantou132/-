'use strict';

var _ajax = require('./ajax.js');

var _ajax2 = _interopRequireDefault(_ajax);

var _swipeEvent = require('./swipeEvent.js');

var _swipeEvent2 = _interopRequireDefault(_swipeEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var DOC = window.document;
var BG = DOC.querySelector('div.bg');
var AIRCRAFT = BG.querySelector('svg.icon-aircraft');
var ORBIT = BG.querySelector('svg.icon-orbit');
var THUMBNAILS = DOC.querySelector('img.thumbnails');
var PAGES = [DOC.querySelector('#page_1'), DOC.querySelector('#page_2'), DOC.querySelector('#page_3')];
var TO_PAGE_1 = PAGES[1].querySelector('.to_page_1');
var TO_PAGE_2 = PAGES[0].querySelector('.to_page_2');
var TEXTS = PAGES[1].querySelectorAll('.warp .row');
var SEND = PAGES[1].querySelector('.send');
var QRS = PAGES[1].querySelector('.qrs');
var SHARE = PAGES[2].querySelector('.share');
var GO_JIAYI = PAGES[2].querySelector('.go_jiayi');

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
		},
		createPlaceholder: function createPlaceholder(placeholder) {
			if (ele instanceof HTMLElement && placeholder instanceof HTMLElement) {
				(function () {
					if (ele.value) {
						placeholder.style.display = 'none';
					}
					var oldNode = ele.textContent;
					ele.addEventListener('focus', function (e) {
						placeholder.style.display = 'none';
					}, false);
					ele.addEventListener('blur', function (e) {
						var value = ele.value;
						var node = ele.textContent;
						if (!value && oldNode === node) {
							placeholder.style.display = 'block';
						}
					}, false);
				})();
			} else {
				throw 'This not HTMLElement';
			}
		}
	};
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
	var current_page = DOC.querySelector('[class*=active_page]');
	var currentPageIndex = Number(PAGES.indexOf(current_page));
	var newPageIndex = Number(PAGES.indexOf(page));

	if (page == 'next' || page == 'back') {
		if (page == 'next' && currentPageIndex < PAGES.length - 1) {
			toPage(PAGES[currentPageIndex + 1]);
		}if (page == 'back' && currentPageIndex > 0) {
			toPage(PAGES[currentPageIndex - 1]);
		}
		return;
	};

	if (currentPageIndex > newPageIndex) {
		$(current_page).classRemove('active_page').classRemove('old_page');
		$(page).classRemove('active_page').classRemove('old_page');
		$(current_page).classRemove('back_active_page').classAdd('back_old_page');
		$(page).classRemove('back_old_page').classAdd('back_active_page');
	} else {
		$(current_page).classRemove('back_active_page').classRemove('back_old_page');
		$(page).classRemove('back_active_page').classRemove('back_old_page');
		$(current_page).classRemove('active_page').classAdd('old_page');
		$(page).classRemove('old_page').classAdd('active_page');
	}
};

// touch listener
_swipeEvent2.default.apply(undefined, PAGES).toTop(function () {
	toPage('next');
}).toBottom(function () {
	toPage('back');
}).toTopCancel(PAGES[1]);

TO_PAGE_2.addEventListener('click', function (e) {
	e.preventDefault();
	toPage(PAGES[1]);
}, false);

TO_PAGE_1.addEventListener('click', function (e) {
	e.preventDefault();
	toPage(PAGES[0]);
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

$(TEXTS[0].querySelector('input')).createPlaceholder(TEXTS[0].querySelector('.placeholder'));
$(TEXTS[1].querySelector('textarea')).createPlaceholder(TEXTS[1].querySelector('.placeholder'));
$(TEXTS[2].querySelector('input')).createPlaceholder(TEXTS[2].querySelector('.placeholder'));

SEND.addEventListener('click', function (e) {
	var mailTo = TEXTS[0].querySelector('input').value;
	var content = TEXTS[1].querySelector('textarea').value;
	var mailFrom = TEXTS[2].querySelector('input').value;
	if (!mailTo) {
		alert('请填写收件人信息');
		return;
	}if (!content) {
		alert('请填写信件内容');
		return;
	}if (!mailFrom) {
		if (!confirm('是否匿名发送？')) {
			return;
		}
	}
	// AIRCRAFT js animation;
	var body = {
		mailTo: mailTo,
		content: content,
		mailFrom: mailFrom
	};
	var option = {
		url: '/', // http://jiayi.la/temp/receive/
		data: JSON.stringify(body)
	};
	_ajax2.default.post(option, function (req) {
		toPage(PAGES[2]);
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