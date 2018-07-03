<template>
	<el-row>
		<el-col :span="6">
			<img :src="userinfo.portrait">
			<h3>{{userinfo.nickname}}</h3>
			<h5>{{userinfo.username}}</h5>
			<p>{{userinfo.description}}</p>
			<el-button @click="clickFollowingBtn">{{isFollowing ? "取消关注" : "关注"}}</el-button>
		</el-col>
		<el-col :span="18">
			<el-tabs v-model="activeItem" @tab-click="clickActiveItemBtn">
				<el-tab-pane label="概述" name="overview">概述</el-tab-pane>
				<el-tab-pane label="站点" name="site">
					<div v-for="{x, index} in sites" :key="index">
						<h4>{{x.sitename}}</h4>
						<p>{{x.description}}</p>
					</div>
				</el-tab-pane>
				<el-tab-pane label="收藏" name="favorite">收藏</el-tab-pane>
				<el-tab-pane label="粉丝" name="follows">粉丝</el-tab-pane>
				<el-tab-pane label="关注" name="following">关注</el-tab-pane>
			</el-tabs>
				
		</el-col>
	</el-row>
</template>

<script>
import {
	Tabs,
	TabPane,
} from "element-ui";

export default {
	components: {
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
	},

	data: function() {
		return {
			activeItem: "overview",
			userinfo: {
			},
			isFollowing: false,
			sites: [],
			itemMap: {},
		}
	},

	methods: {
		clickActiveItemBtn() {
			if (this.itemMap[this.activeItem]) return;
			this.itemMap[this.activeItem] = true;

			if (this.activeItem == "site") {
				this.getSites();
			}
		},

		async getSites() {
			let sites = await this.api.sites.search({userId: this.userinfo.id});

			if (sites.isErr()) return;

			this.sites = sites.getData();
		},
		async clickFollowingBtn() {
			const favoriteId = this.userinfo.id;
			const methodName = this.isFollowing ? "unFollowing" : "following";
			if (!favoriteId) return;

			const result = await (this.api.favorites[methodName])({favoriteId});
			this.isFollowing = !this.isFollowing;
		}
	},

	async mounted() {
		// 获取访问用户信息
		const username = this.$route.params.user;
		let result = await this.api.users.getDetailByUsername({username});
		if (result.isErr()) {
			this.pushName("notfound");
			return;
		}
		this.userinfo = result.getData();

		// 是否关注
		result = await this.api.favorites.isFollowing({favoriteId:this.userinfo.id});
		this.isFollowing = result.getData();
	}
}
</script>
