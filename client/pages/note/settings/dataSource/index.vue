<template>
	<el-table :data="dataSources">
		<el-table-column fixed prop="name" label="名称"></el-table-column>
		<el-table-column fixed prop="type" label="类型"></el-table-column>
		<el-table-column fixed prop="token" label="TOKEN"></el-table-column>
		<el-table-column fixed="right" label="操作">
			<el-button>编辑</el-button>
		</el-table-column>
	</el-table>
</template>


<script>
import {dataSource} from "@@/common/api/note.js";

import {
	Button,
	Table,
	TableColumn,
} from "element-ui";

export default {
	components: {
		[Button.name]: Button,
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
	},

	data: function() {
		return {
			dataSources: [],
		}
	},

	mounted() {

	}
}
</script>
