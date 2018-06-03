<template>
	<div>
		<el-form :inline="true" :model="search" class="demo-form-inline">
			<el-form-item label="ID">
				<el-input clearable v-model="search.id" placeholder="ID"></el-input>
			</el-form-item>
			<el-form-item label="组名">
				<el-input clearable v-model="search.groupname" placeholder="组名"></el-input>
			</el-form-item>
			
			<el-form-item>
				<el-button type="primary" @click="clickSearchBtn">查询</el-button>
				<el-button type="primary" @click="clickNewBtn">新增</el-button>
			</el-form-item>
		</el-form>
		
		<el-table :data="groups" @expand-change="clickExpandRow">
			<el-table-column type="expand">
				<template slot-scope="{row}">
					<el-table :data="members">
						<el-table-column fixed prop="id" label="ID"></el-table-column>
						<el-table-column fixed prop="groupId" label="组ID"></el-table-column>
						<el-table-column fixed prop="memberId" label="成员ID"></el-table-column>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column fixed prop="id" label="ID"></el-table-column>
			<el-table-column fixed prop="groupname" label="组名"></el-table-column>
			<el-table-column fixed prop="description" label="备注"></el-table-column>
			<el-table-column fixed="right" label="操作">
				<template slot-scope="{row, $index}">
					<el-button type="text" @click="clickModifyBtn(row, $index)">修改</el-button>
					<el-button type="text" @click="clickDeleteBtn(row, $index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import {
	Form,
	FormItem,
	Input,
	Button,
	Table,
	TableColumn,
	Message,
} from "element-ui";

import api from "@@/common/api/note.js";

export default {
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Input.name]: Input,
		[Button.name]: Button,
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
	},

	data: function() {
		return {
			search: {},
			groups: [],
			members: [],
		}
	},

	methods: {
		async clickExpandRow(row, expandRow) {
			console.log(row, expandRow);
		},
		async clickSearchBtn() {
			let result = await this.api.groups.get(this.search);
			this.groups = result.getData();
		},

		clickNewBtn() {
			const url = "/note/settings/groups/upsert";
			this.$router.push(url);
		},
		clickModifyBtn(data, index) {
			const url = "/note/settings/groups/upsert?id=" + data.id;

			this.$router.push(url);
		},
		async clickDeleteBtn(data, index) {
			let result = await this.api.groups.delete(data);
			
			if (result.isErr()) {
				return Message(result.getMessage());
				return;
			}	

			this.groups.splice(index, 1);
		}
	},

	async mounted() {
		this.clickSearchBtn();
	}
}
</script>
