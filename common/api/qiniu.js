import * as qiniu from "qiniu-js";
import ERR from "../error.js";
import api from "./note.js";
import util from "../util.js";


const qiniuUpload = async (key, file, token, params = {}, observer = {}) => {
	let data = null;
	if (!token) {
		data = await api.files.token({
			key:key,
		});
		if (data.isErr()) {
			return ;
		}
		token = data.getData();
	}

	const opts =  {
		token: token,
		putExtra: {
			mimeType: null,
			params: {
				"x:filename": params.filename,
				"x:public": params.public || false,
				"x:sitename": params.sitename || "",
				"x:type": util.getTypeByPath(key),
			},
		},
		config: {
			useCdnDomain: true,
		},
	}

	//console.log(file);

	const observable = qiniu.upload(file, key, opts.token, opts.putExtra, opts.config);

	const ok = await new Promise((resolve, reject) => {
		observable.subscribe({
			next(res) {
				observer.next && observer.next(res);
				//console.log(res);
			},
			error(err) {
				observer.error && observer.error(err);
				console.log(err);
				resolve(false);
				//console.log(err);
			},
			complete(res){
				observer.complete && observer.complete(res);
				resolve(true);
				//console.log(res);
			}
		});
	})

	if (!ok) return;
	let result = await api.files.upsert({
		...params,
		size: file.size,
		key: key,
		type: util.getTypeByPath(key),
	});

	if (result.isErr()) {
		console.log("上传失败");
		return ;
	}

	return config.origin + util.getPathByKey(key); 
	//data = await api.qiniu.getDownloadUrl({key:key});
	//if (data.isErr()) return;

	//return data.getData();
}

export default qiniuUpload;
