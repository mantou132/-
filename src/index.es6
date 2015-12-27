import Ajax from './ajax.js';

const DOC       = window.document;
const BG        = DOC.querySelector('div.bg');
const AIRCRAFT  = BG.querySelector('svg.icon-aircraft');
const ORBIT     = BG.querySelector('svg.icon-orbit');
const PAGE_1    = DOC.querySelector('#page_1');
const PAGE_2    = DOC.querySelector('#page_2');
const PAGE_3    = DOC.querySelector('#page_3');
const TO_PAGE_2 = PAGE_1.querySelector('.to_page_2');
const TEXT      = PAGE_2.querySelector('.textarea textarea');
const SEND      = PAGE_2.querySelector('.send');
const QRS       = PAGE_2.querySelector('.qrs');
const GO_XINSHU = PAGE_3.querySelector('.go_xinshu');
const GO_JIAYI  = PAGE_3.querySelector('.go_jiayi');

let $ = ele => {
	return {
		classRemove(...args) {
			if (ele instanceof HTMLElement) {
				ele.classList.remove(...args);
				return $(ele);
			}
		},
		classAdd(...args) {
			if (ele instanceof HTMLElement) {
				ele.classList.add(...args);
				return $(ele);
			}
		},
		setStyle(style) {
			if (typeof style == 'object') {
				for (let p in style) {
					if (style.hasOwnProperty(p)) {
						ele.style[p] = style[p];
					};
				}
				return $(ele);
			};
		}
	}
}

// background setting
let bgSet = () => {
	let content  = DOC.querySelector('.active_page .content');
	let em       = getComputedStyle(content).fontSize.slice(0,-2);
	let position = content.getBoundingClientRect();
	let {left: cl, top: ct, width: cw} = position;
	let width   = cw + 2*em < innerWidth ? cw + 2*em : cw;
	let height  = width * 988/620;
	let top     = (innerHeight - height) / 2;
	let left    = (innerWidth - width) / 2;
	let aWidth  = width * 111 / 620;
	let aHeight = aWidth * 100 / 111;
	let aTop    = top + height * 94 / 988 - aHeight/2;
	let aLeft   = left - aWidth/2;

	let orbitStyle = {
		width: `${width}px`,
		height: `${height}px`,
		top: `${top}px`,
		left: `${left}px`,
	}
	let aircraftStyle = {
		width: `${aWidth}px`,
		height: `${aHeight}px`,
		top: `${aTop}px`,
		left: `${aLeft}px`,
	}
	$(ORBIT).setStyle(orbitStyle);
	$(AIRCRAFT).setStyle(aircraftStyle);
}

let toPage = page => {
	let current_page = DOC.querySelector('.active_page');

	$(current_page).classRemove('active_page').classAdd('old_page');
	$(page).classRemove('old_page').classAdd('active_page');
}

TO_PAGE_2.addEventListener('click', e => {
	e.preventDefault();
	toPage(PAGE_2);
} , false);

// 防止手机键盘出现后改变页面元素布局
// TEXT.addEventListener('focus', e => SEND.style.display = 'none');
// TEXT.addEventListener('blur', e => SEND.style.display = 'block');
window.onload = e => {
	DOC.body.style.height = innerHeight + 'px';
	bgSet();
}

TEXT.addEventListener('input', e => {
	let rows = TEXT.value.split(/\r?\n/).length;
	if (rows >= 3) {
		TEXT.rows = rows;
	}
}, false);

SEND.addEventListener('click', e => {
	let text = DOC.querySelector('textarea').value;
	if (!text) {
		alert('请填写信件内容')
		return;
	}
	// AIRCRAFT js animation;
	let option = {
		url: '/', // http://jiayi.la/temp/receive/
		data: text,
	}
	Ajax.post(option, req => {
		toPage(PAGE_3);
	});
}, false);

QRS.addEventListener('click', e => {
	let img;
	if (e.target.tagName.toLocaleLowerCase() == 'img') {
		img = e.target;
		let {width, height, top, left} = img.getBoundingClientRect();
		img = img.cloneNode();
		let {naturalWidth, naturalHeight} = img;
		let div = DOC.createElement('div');
		div.addEventListener('click', e => {
			div.parentElement.removeChild(div);
		}, false);
		div.classList.add('qr_view');
		$(img).setStyle({
			width  : width + 'px',
			height : height + 'px',
			top    : top + 'px',
			left   : left + 'px',
		});

		div.appendChild(img);
		DOC.body.appendChild(div);

		naturalWidth = naturalWidth || img.getAttribute('width')
		naturalHeight = naturalHeight || img.getAttribute('height')
		setTimeout(() => {
			$(img).setStyle({
				width  : naturalWidth + 'px',
				height : naturalHeight + 'px',
				top    : innerHeight/2 - naturalHeight/2 + 'px',
				left   : innerWidth/2 - naturalWidth/2 + 'px',
			});
		}, 100);
	};
} , false);

GO_XINSHU.addEventListener('click', e => {
	Ajax.get('/');// 虽然跳转，但window对象并没有立刻卸载
	location.href = '//www.baidu.com';
}, false);
GO_JIAYI.addEventListener('click', e => {
	Ajax.get('/');
	location.href = '//www.baidu.com';
}, false);
