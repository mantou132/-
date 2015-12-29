import Ajax from './ajax.js';
import SwipeEvent from './swipeEvent.js';

const DOC        = window.document;
const BG         = DOC.querySelector('div.bg');
const AIRCRAFT   = BG.querySelector('svg.icon-aircraft');
const ORBIT      = BG.querySelector('svg.icon-orbit');
const THUMBNAILS = DOC.querySelector('img.thumbnails');
const PAGES      = [DOC.querySelector('#page_1'), DOC.querySelector('#page_2'), DOC.querySelector('#page_3')];
const TO_PAGE_1  = PAGES[1].querySelector('.to_page_1');
const TO_PAGE_2  = PAGES[0].querySelector('.to_page_2');
const TEXTS      = PAGES[1].querySelectorAll('.warp .row');
const SEND       = PAGES[1].querySelector('.send');
const QRS        = PAGES[1].querySelector('.qrs');
const SHARE      = PAGES[2].querySelector('.share');
const GO_JIAYI   = PAGES[2].querySelector('.go_jiayi');

let $ = ele => {
	let method =  {
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
		},
		createPlaceholder(placeholder) {
			if (ele instanceof HTMLElement && placeholder instanceof HTMLElement) {
				if (ele.value) {
					placeholder.style.display = 'none';
				}
				let oldNode  = ele.textContent;
				ele.addEventListener('focus', e => {
					placeholder.style.display = 'none';
				}, false);
				ele.addEventListener('blur', e => {
					let value = ele.value;
					let node  = ele.textContent;
					if (!value && oldNode === node) {
						placeholder.style.display = 'block';
					}
				}, false);
			} else {
				throw 'This not HTMLElement'
			}
		}
	}
	return method;
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
		width  : `${width}px`,
		height : `${height}px`,
		top    : `${top}px`,
		left   : `${left}px`,
	}
	let aircraftStyle = {
		width  : `${aWidth}px`,
		height : `${aHeight}px`,
		top    : `${aTop}px`,
		left   : `${aLeft}px`,
	}
	$(ORBIT).setStyle(orbitStyle);
	$(AIRCRAFT).setStyle(aircraftStyle);
}

let toPage = page => {
	let current_page     = DOC.querySelector('[class*=active_page]');
	let currentPageIndex = Number(PAGES.indexOf(current_page));
	let newPageIndex     = Number(PAGES.indexOf(page));

	if (page == 'next' || page == 'back') {
		if (page == 'next' && currentPageIndex < PAGES.length - 1 ) {
			toPage(PAGES[currentPageIndex + 1]);
		} if (page == 'back' && currentPageIndex > 0 ){
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
}

// touch listener
SwipeEvent(...PAGES)
	.toTop(() => {
		toPage('next');
	})
	.toBottom(() => {
		toPage('back');
	})
	.toTopCancel(PAGES[1]);

TO_PAGE_2.addEventListener('click', e => {
	e.preventDefault();
	toPage(PAGES[1]);
} , false);

TO_PAGE_1.addEventListener('click', e => {
	e.preventDefault();
	toPage(PAGES[0]);
} , false);

// 防止手机键盘出现后改变页面元素布局
// TEXT.addEventListener('focus', e => SEND.style.display = 'none');
// TEXT.addEventListener('blur', e => SEND.style.display = 'block');
window.onload = e => {
	DOC.body.style.height = innerHeight + 'px';

	BG.style.display = 'block';
	bgSet();

	// share to friend
	THUMBNAILS.src = 'img/thumbnails.png';

	// bg music
	let audio = new Audio('stamp.mp3');
	audio.loop = true;
	audio.load();
	audio.addEventListener('canplaythrough', () => audio.play(), false);

	//music volume coll
	let timer_volume_up = setInterval(function(){
		if (audio.volume < 0.15) {
		    audio.volume += 0.01;
		} else {
		    audio.volume = 0.15;
		    clearInterval(timer_volume_up);
		}
	},1000);
	let timer_count = setTimeout(function() {
	    let timer_volume_down = setInterval(function() {
	        if (audio.volume > 0.01) {
	            audio.volume -= 0.01;
	        } else {
	            audio.volume = 0.01;
	            clearInterval(timer_volume_down);
	        }

	    }, 1000);
	}, parseInt(audio.duration * 1000 - 15000));

}

$(TEXTS[0].querySelector('input')).createPlaceholder(TEXTS[0].querySelector('.placeholder'));
$(TEXTS[1].querySelector('textarea')).createPlaceholder(TEXTS[1].querySelector('.placeholder'));
$(TEXTS[2].querySelector('input')).createPlaceholder(TEXTS[2].querySelector('.placeholder'));

SEND.addEventListener('click', e => {
	let mailTo   = TEXTS[0].querySelector('input').value;
	let content  = TEXTS[1].querySelector('textarea').value;
	let mailFrom = TEXTS[2].querySelector('input').value;
	if (!mailTo) {
		alert('请填写收件人信息')
		return;
	} if (!content) {
		alert('请填写信件内容')
		return;
	} if (!mailFrom) {
		if(!confirm('是否匿名发送？')){
			return;
		}
	}
	// AIRCRAFT js animation;
	let body = {
		mailTo: mailTo,
		content: content,
		mailFrom: mailFrom
	}
	let option = {
		url: '/', // http://jiayi.la/temp/receive/
		data: JSON.stringify(body),
	}
	Ajax.post(option, req => {
		toPage(PAGES[2]);
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
		div.classList.add('pop_view');
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

SHARE.addEventListener('click', e => {
	let div = DOC.createElement('div');
	let img = DOC.createElement('img');
	img.src = 'img/weixin.png';
	div.classList.add('pop_view');
	img.classList.add('share');
	div.addEventListener('click', e => {
		div.parentElement.removeChild(div);
	}, false);
	div.appendChild(img);
	DOC.body.appendChild(div);

}, false);
GO_JIAYI.addEventListener('click', e => {
	// Ajax.get('/');
	location.href = '/redirect/appBao/';
}, false);
