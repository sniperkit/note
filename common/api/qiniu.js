import * as qiniu from "qiniu-js";
import ERR from "../error.js";
import api from "./note.js";


const qiniu = {

}


qiniu.upload = async (params) => {
	let data = null;
	if (!params.token) {
		data = await api.qiniu.getUploadTokenByKey({key:params.key});
		if (data.isErr()) {
			return data;
		}
		params.token = data.getData();
	}

	const opts =  {
		token: token,
		putExtra: {
			mimeType: null,
		},
		config: {
			useCdnDomain: true,
		},
	}
	const observable = qiniu.upload(blob, key, opts.token, opts.putExtra, opts.config);
	observable.subscribe({
		next(res) {
			console.log(res);
		},
		error(err) {
			console.log(err);
		},
		complete(res){
			console.log(res);
		}
	});
	
}
