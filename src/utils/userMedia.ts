const getUserMedia = (constraints: MediaStreamConstraints) => {
	return new Promise((resolve, reject) => {
		if (navigator.mediaDevices) {
			//最新的标准API
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(resolve)
				.catch(reject);
		}
		 else if(navigator.webkitGetUserMedia) {
			//webkit核心浏览器
			navigator.webkitGetUserMedia(constraints, resolve, reject);
		} else if (navigator.mozGetUserMedia) {
			//firfox浏览器
			navigator.mozGetUserMedia(constraints, resolve, reject);
		} else if (navigator.getUserMedia) {
			//旧版API
			navigator.getUserMedia(constraints, resolve, reject);
		} else {
			reject()
		}
	})
}

export default getUserMedia;