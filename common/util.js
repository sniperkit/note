import jwt from "jwt-simple";

const filetypes = {
	md: "pages",

	jpg: "images",
	jpeg: "images",
	png: "images",
	svg: "images",

	mp4: "vedios",
	webm: "vedios",

	mp3: "audios",
	ogg: "audios",
	wav: "audios",

	json: "datas",
	yml: "datas",

	unknow: "files",
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
	const ext = path.substring(path.lastIndexOf(".") + 1);

	return filetypes[ext] || "files";
}

util.getKeyByPath = function(path, filetype) {
	const paths = path.split("/");
	if (paths.length < 2) return path;

	if (!filetype) {
		const filename = paths[paths.length-1];
		const ext = filename.split(".")[1];
		if (!ext) return path;

		filetype = filetypes[ext] || "files";
	}

	paths.splice(1, 0, filetype);

	return paths.join("/");
}

util.getPathByKey = function(key) {
	const paths = key.split("/");
	if (paths.length < 3) return key;

	paths.splice(1, 1);

	return paths.join('/');
}

export default util;
