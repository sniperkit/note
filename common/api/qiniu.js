import * as qiniu from "qiniu-js";
import config from "@/config.js";
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

	if (typeof(file) == "string") {
		file = new Blob([file], {type: "text/plain"});
	}

	const opts =  {
		token: token,
		putExtra: {
			mimeType: null,
			params: {
				"x:public": params.public || false,
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
			async complete(res){
				const result = await api.files.qiniu(res);
				if (result.isErr()) {
					observer.error && observer.error();
					return resolve(false);
				}
				observer.complete && observer.complete(res);
				//console.log(res);
				resolve(true);
			}
		});
	})

	if (!ok) return;

	return config.origin + "/" + util.getPathByKey(key); 
}

export default qiniuUpload;
