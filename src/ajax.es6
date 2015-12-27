let Empty = () => {};
let Ajax = {
	get(url, callback) {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange  = this.done(xhr, callback);
		xhr.open("get", url, true);
		xhr.send();
	},
	post(option, callback) {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange  = this.done(xhr, callback);
		xhr.open("post", option.url, true);
		xhr.send(option.data);
	},
	done(xhr, callback) {
		return () => {
			if (xhr.readyState == 4 ) {
				if (xhr.status == 200) {
					(callback || Empty)(this.response);
				} else {
					alert('错误');
				}
			}
		}
	}
}
export default Ajax;
