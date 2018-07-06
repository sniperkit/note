<template>
	<div>
		<div v-if="!isNotFound" class="container">
			<div class="siteHeaderContainer">
				<a :href="'/' + userinfo.username">{{userinfo.username}}</a>
				<span>/</span>
				<a :href="'/' + userinfo.username + '/' + siteinfo.sitename">{{siteinfo.sitename}}</a>
				<i :class="isFavorite ? 'iconfont icon-star' : 'iconfont icon-empty-star'" @click="clickFavoriteBtn"></i>
			</div>
			<p>{{siteinfo.description}}</p>
			
		</div>
		<notfound v-if="isNotFound"></notfound>
	</div>
</template>

<script>
import wurl from "wurl";

import api from "@@/common/api/note.js";
import notfound from "@/components/views/notfound.vue";

export default {
	data: function() {
		return {
			isNotFound: false,
			isFavorite: false,
			userinfo:{},
			siteinfo:{},
		}
	},

	components: {
		notfound,
	},

	methods: {
		async clickFavoriteBtn() {
			if (!this.isAuthenticated()) this.$message("未登录");

			const oper = this.isFavorite ? "unFavoriteSite" : "favoriteSite";
			const result = await this.api.favorites[oper]({
				favoriteId: this.siteinfo.id,
			});

			if (result.isErr()) return this.$message(result.getMessage());

			this.isFavorite = !this.isFavorite;

		}
	},

	async asyncData({req, redirect}) {
		const url = req.ctx.href;
		const path = wurl("path", url);
		const paths = path.split("/");
		const username = paths[1];
		const sitename = paths[2];
		let result = await api.sites.getByName({username, sitename});
		if (result.isErr()) return {isNotFound: true};

		const data = result.getData();
		return {userinfo:data.user, siteinfo:data.site};
	},
	async mounted() {
	}
}
</script>

<style scoped>
.siteHeaderContainer {
	display: flex;
}
</style>
