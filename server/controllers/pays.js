import _ from "lodash";
import axios from "axios";

import config from "@/config.js";
import Controller from "@/controllers/controller.js";

const pingpp = require("pingpp")(config.pingpp.secret);

export const Pay = class extends Controller {
	constructor() {
		super();
	}

	test() {
		const chargeUrl = "https://api.pingxx.com/v1/charges";
		const data = {
			order_no: "1234567890",
			app: {id:config.pingpp.appId},
			channel: "alipay_qr",
			amount: 100,
			client_ip: "10.27.3.3",
			currency: "cny",
			subject: "note",
			body: "hello pingpp",
			extra: {
			},
		};

		pingpp.setPrivateKey(config.pingpp.rsaKey);
		pingpp.charges.create(data, function(err, charge){
			console.log(err);
			console.log(charge);
		})
		//axios.post(chargeUrl, data, {
			//headers: {
				//"Authorization": "Bearer " + config.pingpp.secret,
				//"content-type": "application/json",
			//}
		//}).then(function(res) {
			//console.log(res);
		//}, function(res){
			//console.log(res);
			//console.log(res.data);
		//});


		return "hello world";
	}

	static getRoutes() {
		this.pathPrefix = "pays";

		const baseRoutes = super.getRoutes();

		const routes = [
		{
			path: "test",
			method: "get",
			action: "test",
		},
		];

		return routes.concat(baseRoutes);
	}
}


export default Pay;
