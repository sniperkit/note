<template>
	<el-table :data="files">
		<el-table-column fixed prop="filename" label="名称"></el-table-column>
		<el-table-column fixed prop="key" label="KEY"></el-table-column>
		<el-table-column fixed prop="sitename" label="站点"></el-table-column>
		<el-table-column fixed prop="type" label="类型"></el-table-column>
		<el-table-column fixed prop="public" label="公开"></el-table-column>
		<el-table-column fixed="right" label="操作">
			<template slot-scope="{row, $index}">
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
import {mapActions, mapGetters} from "vuex";
import api from "@@/common/api/note.js";

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

	async mounted() {
		let result = await api.files.get();
		if (result.isErr()) {
			console.log(result);
			return;
		}

		this.files = result.getData();
	}

}
</script>
