import * as qiniu from "qiniu-js";
import ERR from "../error.js";
import api from "./note.js";


const qiniuUpload = async (key, file, token, params) => {
	let data = null;
	if (!token) {
		data = await api.qiniu.getUploadTokenByKey({key:key});
		if (data.isErr()) {
			return ;
		}
		token = data.getData();
	}

	const opts =  {
		token: token,
		putExtra: {
			mimeType: null,
			params: params,
		},
		config: {
			useCdnDomain: true,
		},
	}
	const observable = qiniu.upload(file, key, opts.token, opts.putExtra, opts.config);

	const ok = await new Promise((resolve, reject) => {
		observable.subscribe({
			next(res) {
				//console.log(res);
			},
			error(err) {
				console.log(err);
				resolve(false);
				//console.log(err);
			},
			complete(res){
				resolve(true);
				console.log(res);
			}
		});
	})

	if (!ok) return;

	data = await api.qiniu.getDownloadUrl({key:key});
	if (data.isErr()) return;

	return data.getData();
}

export default qiniuUpload;
