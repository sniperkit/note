import jwt from "jwt-simple";
import _ from "lodash";

const filetypes = {
	"/": "folders",

	".md": "pages",

	".jpg": "images",
	".jpeg": "images",
	".png": "images",
	".svg": "images",

	".mp4": "vedios",
	".webm": "vedios",

	".mp3": "audios",
	".ogg": "audios",
	".wav": "audios",

	".json": "datas",
	".yml": "datas",

	//unknow: "files",
}
export const util = {};

util.jwt_encode = function(payload, key, expire) {
	payload = payload || {};
	payload.exp = Date.now() / 1000 + (expire || 3600 * 24);

	return jwt.encode(payload, key);
}

util.jwt_decode = function(token, key, noVerify) {
	return jwt.decode(token, key, noVerify);
}

util.getTypeByPath = function(path) {
	for (let key in filetypes) {
		if (_.endsWith(path, key)) return filetypes[key];
	}

	return "files";
}

util.getKeyByPath = function(path, filetype) {
	filetype = filetype || this.getTypeByPath(path);

	paths.splice(1, 0, filetype);

	return paths.join("/");
}

util.getPathByKey = function(key) {
	const paths = key.split("/");
	//if (paths.length < 3) return key;
	paths.splice(1, 1);

	return paths.join('/');
}

export default util;
