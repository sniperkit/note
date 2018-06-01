<template>
	<div class="headerContainer">
		<div class="container full-height flex-col">
			<div class="flex-row">
				<div v-show="user.id">
					<el-dropdown @command="handleCommand" trigger="click">
						<span class="el-dropdown-link" style="cursor:pointer">
							{{user.nickname || user.username || "逍遥"}}
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>我的主页</el-dropdown-item>
							<el-dropdown-item command="settings">设置</el-dropdown-item>
							<el-dropdown-item command="editor">编辑器</el-dropdown-item>
							<el-dropdown-item command="tagModEditor">模块编辑器</el-dropdown-item>
							<el-dropdown-item divided command="logout">退出</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				<div v-show="!user.id">
					<el-button type="text" @click="clickLoginBtn">登陆</el-button>
					<el-button type="text" @click="clickRegisterBtn">注册</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import vue from "vue";
import Cookies from 'js-cookie';

import {
	Button, 
	Dropdown, 
	DropdownMenu, 
	DropdownItem
} from "element-ui";

export default {
	components: {
		[Button.name]: Button,
		[Dropdown.name]: Dropdown,
		[DropdownMenu.name]: DropdownMenu,
		[DropdownItem.name]: DropdownItem,
	},

	data: function() {
		return {
		}
	},

	methods: {
		handleCommand(cmd){
			if (cmd == "logout") {
				this.logout();
				this.$router.push({name: g_app.getRouteName("login")});
				return;
			}

			this.$router.push({name: g_app.getRouteName(cmd)});
		},
		clickLoginBtn() {
			this.$router.push({name: g_app.getRouteName("login")});
		},
		clickRegisterBtn() {
			this.$router.push({name: g_app.getRouteName("register")});
		},
	},

	mounted() {
	}
}
</script>

<style scoped>
.headerContainer {
	background-color: rgb(248,248,248);
	height:100%;
}
.flex-col {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.flex-row {
	display: flex;
	justify-content: flex-end
}
</style>
