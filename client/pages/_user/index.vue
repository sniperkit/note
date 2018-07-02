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
		</el-col>
	</el-row>
</template>

<script>

export default {
	data: function() {
		return {
			userinfo: {
			},
			isFollowing: false,
		}
	},

	methods: {
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
