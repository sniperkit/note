<template>
	<div>
		<el-table :data="groups">
			<el-table-column fixed prop="groupname" label="组名"></el-table-column>
			<el-table-column fixed prop="description" label="备注"></el-table-column>
			<el-table-column fixed="right" label="操作">
				<template slot-scope="{row, $index}">
					<el-button type="text" @click="clickCopyBtn(row, $index)">链接</el-button>
					<el-button type="text" @click="clickDeleteBtn(row, $index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import {
	Button,
	Table,
	TableColumn,
	Message,
} from "element-ui";

import api from "@@/common/api/note.js";

export default {
	components: {
		[Button.name]: Button,
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
	},

	data: function() {
		return {
			groups: [],
		}
	},

	methods: {
	},

	mounted() {
	}
}
</script>
