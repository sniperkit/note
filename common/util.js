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

util.getTypeByKey = function(key) {
	for (let ext in filetypes) {
		if (_.endsWith(key, ext)) return filetypes[ext];
	}

	return "files";
}

util.getTypeByFilename = function(filename) {
	for (let ext in filetypes) {
		if (_.endsWith(filename, ext)) return filetypes[ext];
	}

	return "files";
}

util.getUsernameByKey = function(key) {
	return key.substring(0, key.indexOf("/"));
}
// 获取目录
util.getFolderByKey = function(key) {
	return key.substring(0, key.lastIndexOf("/", key.length-2) + 1);
}

util.getKeyByPath = function(path, filetype) {
	const paths = path.split("/");

	filetype = filetype || this.getTypeByFilename(path);

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
