
<template>
	<div>
		<el-select v-model="sitename" filterable placeholder="请选择站点">
			<el-option v-for="(x, index) in sites" :key="index" :label="x.sitename" :value="x.sitename"></el-option>
		</el-select>
		<el-collapse>
			<el-collapse-item title="基本信息">
				<el-form ref="form" :model="site" label-width="80px">
					<el-form-item label="描述">
						<el-input v-model="site.description" placeholder="描述"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="clickSubmitBaseInfoBtn">提交</el-button>
					</el-form-item>
				</el-form>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>

import {
	Collapse,
	CollapseItem,
	Form,
	FormItem,
	Button,
	Input,
	Select,
	Option,
	Message,
} from "element-ui";

import api from "@@/common/api/note.js";

export default {
	components: {
		[Collapse.name]: Collapse,
		[CollapseItem.name]: CollapseItem,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Button.name]: Button,
		[Input.name]: Input,
		[Select.name]: Select,
		[Option.name]: Option,
	},

	data: function() {
		return {
			sitename: "",
			site: {},
			sites: [],
		}
	},

	watch: {
		sitename: function(val) {
			const index = this.sites.findIndex(x => x.sitename == val);
			this.site = this.sites[index] ||{};
		}
	},

	methods: {
		async clickSubmitBaseInfoBtn() {
			const result = await api.sites.update(this.site);
			if (result.isErr()) {
				return Message(result.getMessage());
			}

			return Message("站点信息更新成功");
		}
	},

	async mounted() {
		let result = await api.sites.getByUsername();
		if (result.isErr()) {
			Message(result.getMessage());
			return;
		}
		
		this.sites = result.getData() || [];
		this.site = this.sites[0] || {};
		this.sitename = this.site.sitename;

		return;
	},
}
</script>
