<template>
	<div>
		<el-dialog :visible.sync="isShowNewGroup" title="新增组" width="500px">
			<el-form :model="group" label-width="80px" label-position="right" style="width:300px;">
				<el-form-item label="ID" v-if="isModify">
					<el-input disabled v-model="group.id" placeholder="ID"></el-input>
				</el-form-item>
				<el-form-item label="组名">
					<el-input :disabled="isModify" clearable v-model="group.groupname" placeholder="组名"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input clearable v-model="group.description" placeholder="备注"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" v-loading="group.isLoading">
		        <el-button @click="isShowNewGroup = false">取 消</el-button>
				<el-button type="primary" @click="clickNewGroupBtn">确 定</el-button>
			</div>
		</el-dialog>

		<el-form :inline="true" :model="search" class="demo-form-inline">
			<el-form-item label="ID">
				<el-input clearable v-model="search.id" placeholder="ID"></el-input>
			</el-form-item>
			<el-form-item label="组名">
				<el-input clearable v-model="search.groupname" placeholder="组名"></el-input>
			</el-form-item>
			
			<el-form-item>
				<el-button @click="clickSearchBtn">查询</el-button>
				<el-button @click="clickNewBtn">新增</el-button>
			</el-form-item>
		</el-form>
		
		<el-table ref="groupTableCmp":data="groups">
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
	Dialog,
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
		[Dialog.name]: Dialog,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Input.name]: Input,
		[Button.name]: Button,
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
	},

	data: function() {
		return {
			isModify: false,
			isShowNewGroup: false,
			group: {},
			memberSearch:{},
			search: {},
			groups: [],
			members: [],
		}
	},

	methods: {
		async clickSearchBtn() {
			let result = await this.api.groups.get(this.search);
			this.groups = result.getData();
		},

		clickNewBtn() {
			this.group.id = undefined;
			this.group.groupname = undefined;
			this.group.description = undefined;
			this.isModify = false;
			this.isShowNewGroup = true;
		},
		clickModifyBtn(data, index) {
			this.group = data;
			this.isModify = true;
			this.isShowNewGroup = true;
		},
		async clickNewGroupBtn() {
			let action = this.isModify ? "update" : "create";
			const result = await this.api.groups[action](this.group);

			this.isShowNewGroup = false;
			if (result.isErr()) {
				return Message("提交失败");
			}

			Message("提交成功");
			this.clickSearchBtn();
			return;
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
