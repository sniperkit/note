<template>
	<div class="container">
		<el-row>
			<el-col :span="6" :xs="{span:24}">
				<div class="leftContainer">
					<img :src="userinfo.portrait" class="portrait">
					<div class="v-center">
						<h3 style="margin-top:10px; margin-bottom:0px" v-cloak>{{(userinfo.nickname || userinfo.username) + "("+ userinfo.username + ")"}}</h3>
					</div>
					<p v-if="!isEditDescription">{{userinfo.description}}</p>
					<el-form v-if="isEditDescription" :model="user">
						<el-form-item>
							<el-input type="textarea" v-model="user.description" placeholder="简介"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="clickSaveDescriptionBtn">保存</el-button>
							<el-button @click="isEditDescription=false">取消</el-button>
						</el-form-item>
					</el-form>

					<el-button class="full-width" v-if="isAuthUser && !isEditDescription" @click="isEditDescription = true">编辑备注</el-button>
					<el-button class="full-width" v-if="!isAuthUser" @click="clickFollowingBtn">{{isFollowing ? "取消关注" : "关注"}}</el-button>
				</div>
			</el-col>
			<el-col :span="18" :xs="{span:24}">
				<div class="rightContainer">
					<el-tabs v-model="activeItem" @tab-click="clickActiveItemBtn">
						<el-tab-pane label="概述" name="overview">概述</el-tab-pane>
						<el-tab-pane label="站点" name="site">
							<div v-for="(x, index) in sites" :key="index">
								<h4>{{x.sitename}}</h4>
								<p>{{x.description}}</p>
							</div>
						</el-tab-pane>
						<el-tab-pane label="收藏" name="favorite">
						</el-tab-pane>
						<el-tab-pane label="粉丝" name="follows">
							<div v-for="(x, index) in follows" :key="index">
								<h4>{{x.nickname}}</h4>
								<h5>{{x.username}}</h5>
								<p>{{x.description}}</p>
							</div>
						</el-tab-pane>
						<el-tab-pane label="关注" name="following">
							<div v-for="(x, index) in following">
								<h4>{{x.nickname}}</h4>
								<h5>{{x.username}}</h5>
								<p>{{x.description}}</p>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import axios from "axios";
import {
	Form,
	FormItem,
	Button,
	Input,
	Tabs,
	TabPane,
} from "element-ui";

export default {
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Button.name]: Button,
		[Input.name]: Input,
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
	},

	data: function() {
		return {
			isEditDescription: false,
			isAuthUser:false,
			activeItem: "overview",
			userinfo: {
				nickname:"",
				username:"",
				description:"",
				portrait:"",
			},
			isFollowing: false,
			sites: [],
			favoriteSites: [],
			favoritePages: [],
			follows: [],
			following: [],
			itemMap: {},
		}
	},

	methods: {
		async clickSaveDescriptionBtn() {
			const reuslt = await this.api.users.update(this.user);
			if (result.isErr()) return this.$message(result.getMessage());
			this.setUser(this.user);
			this.userinfo.description = this.user.description;
			this.isEditDescription = false;
		},

		clickActiveItemBtn() {
			if (this.itemMap[this.activeItem]) return;
			this.itemMap[this.activeItem] = true;

			if (this.activeItem == "site") {
				this.getSites();
			}
			
			if (this.activeItem == "favorite") {
				this.getFavorites();
				
			}

			if (this.activeItem == "follows") {
				this.getFollows();
			}
			
			if (this.activeItem == "following") {
				this.getFollowing();
			}
		},

		async getSites() {
			let sites = await this.api.sites.search({userId: this.userinfo.id});

			if (sites.isErr()) return;

			this.sites = sites.getData();
		},

		async getFavorites() {
			const userId = this.userinfo.id;
			let favoriteSites = await this.api.favorites.getFavoriteSites({userId});
			this.favoriteSites = favoriteSites.getData() || [];

			//let favoritePages = await this.api.favorites.getFavoritePages({userId});
			//this.favoritePages = favoritePages.getData() || [];
		},

		async getFollows() {
			const userId = this.userinfo.id;
			let follows = await this.api.favorites.getFollows({userId});
			this.follows = follows.getData() || [];
		},

		async getFollowing() {
			const userId = this.userinfo.id;
			let following = await this.api.favorites.getFollowing({userId});
			this.following = following.getData() || [];
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
		//axios.get("http://stage-storage.keepwork.com/api/v0/files/abc/token");
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
		this.isAuthUser = username == this.user.username;
	}
}
</script>

<style scoped>
.leftContainer {
	margin:20px;
}
.portrait {
	width: 260px;
	height: 260px;
	border: 2px solid gray;
}
.rightContainer {
	margin:10px;
}
</style>
