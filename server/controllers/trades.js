import joi from "joi";

import Controller from "@/controllers/controller.js";
import models from "@/models";
import ERR from "@@/common/error.js";
import util from "@@/common/util.js";
import config from "@/config.js";
import pay from "@/services/pingpp.js";

import {
	TRADE_TYPE_CHARGE,
	TRADE_TYPE_EXPENSE,

	TRADE_STATE_START,
	TRADE_STATE_PAYING,
	TRADE_STATE_SUCCESS,
	TRADE_STATE_FAILED,
	TRADE_STATE_FINISH,
} from "@@/common/consts.js";

export const Trades = class extends Controller {
	constructor() {
		super();
	}

	async test(ctx) {
		console.log(ctx.request.ip);
		const data = {
			order_no: "1234567890",
			app: {id:config.pingpp.appId},
			channel: "alipay_qr",
			amount: 100,
			client_ip: ctx.request.headers["x-real-ip"] || ctx.request.ip,
			currency: "cny",
			subject: "note",
			body: "hello pingpp",
			extra: {
			},
		};
		data.order_no = util.getDate().datetime + "trade" + id;
		const charge = await pay.createChrage(data).catch(e => console.log(e));
		console.log(charge);
		return charge;
	}

	async getPayQR(trade, ctx) {
		const chargeData = {
			order_no: util.getDate().datetime + "trade" + trade.id,
			app: {id: config.pingpp.appId},
			channel: trade.channel,
			amount: trade.amount,			
			client_ip: ctx.request.headers["x-real-ip"] || ctx.request.ip,
			currency: "cny",
			subject: trade.subject,
			body: trade.body,
			extra: trade.extra || {},
		}

		const charge = await pay.createChrage(chargeData).catch(e => console.log(e));

		if (!charge) {
			console.log("提交pingpp充值请求失败");
			return;
		}

		const result = await this.model.update({
			amount: chargeData.amount,
			subject: chargeData.subject,
			body: chargeData.body,
			extra: chargeData.extra,
			tradeNo: chargeData.order_no,
			pingppId: charge.id,
			state: TRADE_STATE_PAYING,
		}, {
			where: {
				id: trade.id,
			},
		});

		return charge.credential.alipay_qr;
	}

	async create(ctx) {
		const userId = ctx.state.user.userId;
		const params = ctx.state.params;

		params.state = TRADE_STATE_START;
		params.userId = userId;

		let trade = await this.model.create(params);
		if (!trade) return ERR.ERR();
		trade = trade.get({plain:true});


		if (trade.channel) {
			trade.payQR = await this.getPayQR(trade, ctx);
		}

		return ERR.ERR_OK(trade);
	}

	async payQR(ctx) {
		const id = ctx.params.id;
		const params = ctx.state.params;

		let trade = await this.model.findOne({where: {id}});
		if (trade) return ERR.ERR_PARAMS();
		trade = trade.get({plain:true});

		trade.channel = params.channel;

		const alipay_qr = await this.getPayQR(trade, ctx);

		return ERR.ERR_OK(alipay_qr);
	}

	async pingpp(ctx) {
		const params = ctx.state.params;
		const signature = ctx.headers["x-pingplusplus-signature"];
		const body = JSON.stringify(params);
		
		if (!pay.verifySignature(body, signature)) {
			return ERR.ERR("签名验证失败");
		}

		const pingppId = params.data.object.id;
		const tradeNo = params.data.object.order_no;

		let trade = await this.model.findOne({where:{pingppId, tradeNo}});
		if (!trade) ERR.ERR("交易记录不存在");
		
		let state = TRADE_STATE_FAILED;
		if (params.type == "charge.succeeded") {
			state = TRADE_STATE_SUCCESS;
		}
		
		await this.model.update({state}, {where:{id:trade.id}});

		return ERR.ERR_OK();
	}

	static getRoutes() {
		this.pathPrefix = "trades";
		const baseRoutes = super.getRoutes();
		const routes = [
		{
			path: "",
			method: "POST",
			action: "create",
			authenticated: true,
			validated: {
				subject: joi.string().required(),
				body: joi.string().required(),
				goodsId: joi.number().required(),
				amount: joi.number().required(),
			},
		},
		{
			path: "pingpp",
			method: "ALL",
			action: "pingpp",
		},
		{
			path: ":id/payQR",
			method: "GET",
			action: "payQR",
			authenticated: true,
			validated: {
				channel: joi.string().required(),
			},
		},
		{
			path:"test",
			method: "ALL",
			action:"test",
		}
		];

		return routes.concat(baseRoutes);
	}
}

export default Trades;
