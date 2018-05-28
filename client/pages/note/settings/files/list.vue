<template>
	<el-table :data="files">
		<el-table-column fixed prop="filename" label="名称"></el-table-column>
		<el-table-column fixed prop="key" label="KEY"></el-table-column>
		<el-table-column fixed prop="sitename" label="站点"></el-table-column>
		<el-table-column fixed prop="type" label="类型"></el-table-column>
		<el-table-column fixed prop="public" label="公开">
			<template slot-scope="{row, $index}">
				<span>{{row.public ? "公开" : "私有"}}</span>
			</template>
		</el-table-column>
		<el-table-column fixed="right" label="操作">
			<template slot-scope="{row, $index}">
				<el-button type="text" @click="clickCopyBtn(row, $index)">连接</el-button>
				<el-button type="text" @click="clickDeleteBtn(row, $index)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
import {
	Button,
	Table,
	TableColumn,
	Message,
} from "element-ui";
import vue from "vue";
import vueClipboard from 'vue-clipboard2';
import {mapActions, mapGetters} from "vuex";
import util from "@@/common/util.js";
import api from "@@/common/api/note.js";
import config from "@/config.js";

vue.use(vueClipboard);

export default {
	components: {
		[Button.name]: Button,
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
	},

	data: function() {
		return {
			files:[],
		}
	},

	methods: {
		async getFileList() {
			let result = await api.files.get();
			if (result.isErr()) {
				console.log(result);
				return;
			}
			this.files = result.getData();
		},
		clickCopyBtn(raw) {
			const path = raw.path || util.getPathByKey(raw.key);
			const url = config.origin + "/" + path;
			this.$copyText(url).then(function(e) {
				Message("连接复制到剪切板成功");
			}, function(e){
				Message("连接复制到剪切板失败");
			});
		},

		async clickDeleteBtn(raw, index) {
			let result = await api.files.delete(raw);
			if (result.isErr()) {
				Message(result.getMessage());
				return;
			}

			this.files.splice(index, 1);
		}
	},

	async mounted() {
		await this.getFileList();
	}

}
</script>
