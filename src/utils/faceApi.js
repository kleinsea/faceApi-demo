import faceApi from "face-api.js"

class FaceApi {
	constructor(props) {
		this.nets = props.nets;
		this.loadModules()
	}
	async loadModules() {
		await faceApi.nets[this.nets].loadFromUri('/models');
	}
}

export default FaceApi;