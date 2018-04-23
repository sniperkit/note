<template>
	<div class="container" style="display:flex;">
		<div style="flex:2">
			<el-menu :router="true" @open="open" :default-active="activeItem" :unique-opened="true">
				<el-submenu :index='index("dataSource")'>
					<template slot="title" style="background-color: blue">数据源</template>
					<el-menu-item :index='index("dataSource")'>列表</el-menu-item>
					<el-menu-item :index='index("dataSource/upsert")'>更新</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
		<div style="flex:10; margin:20px">
			<nuxt-child></nuxt-child>
		</div>
	</div>
</template>

<script>
import {
	Menu,
	Submenu,
	MenuItem,
} from "element-ui";

import config from "@/config.js";

export default {
	components: {
		[Menu.name]: Menu,
		[MenuItem.name]: MenuItem,
		[Submenu.name]: Submenu,
	},

	data: function() {
		return {
			activeItem: ""
		}
	},

	methods: {
		index(path) {
			return "/" + config.urlPrefix + "/settings/" + path;
		},
		open(index) {
			this.$router.push(index);
			this.activeItem = index;
		},
	}

}
</script>

<style scoped>
.el-menu-item.is-active {
	border-left: 2px solid gray;
}
</style>
