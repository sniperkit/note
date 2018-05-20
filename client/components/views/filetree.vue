<template>
	<div class="kp_forbit_copy">
		<el-dialog :visible.sync="isShowNewFile" title="新增文件" width="500px">
			<el-form :model="newFileForm" label-width="80px" label-position="right" style="width:300px;">
				<el-form-item label="类型">
					<el-select v-model="newFileForm.type" placeholder="请选择类型">
						<el-option label="文件" value="blob"></el-option>
						<el-option label="目录" value="tree"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="文件名">
					<el-input v-model="newFileForm.filename" 
						placeholder="请输入文件名" 
						@keyup.native.enter="clickSubmitNewFileBtn"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" v-loading="newFileForm.isLoading">
		        <el-button @click="isShowNewFile = false">取 消</el-button>
				<el-button type="primary" @click="clickSubmitNewFileBtn">确 定</el-button>
			</div>
		</el-dialog>
		<el-tree ref="openedTreeComp" :data="openedPageTree" :props="treeprops" node-key="path" :default-expand-all="true" :highlight-current="true" @node-click="clickSelectPage">
			<span class="custom-tree-node" slot-scope="{node, data}">
				<span v-if="data.type == 'tree'" class="custom-tree-node">
					<span>
						<!--<i class="iconfont icon-folder"></i>-->
						<span>{{data.aliasname || data.name}}</span>
					</span>
				</span>
				<span v-if="data.type == 'blob'" class="custom-tree-node">
					<span class="tree-node-text">
						<i v-show="data.isConflict" @click.stop="clickFixedConflict(data)" class="fa fa-warning" aria-hidden="true" data-toggle="tooltip" title="冲突"></i>
						<i v-show="!data.isConflict" :class='isRefresh(data) ? "el-icon-loading" : isModify(data) ? "iconfont icon-edit" : "iconfont icon-file"'></i>
						<span>{{data.aliasname || data.name}}</span>
					</span>
					<span class="tree-node-btn-group">
						<i @click.stop="clickOpenBtn(data)"class="iconfont icon-open" aria-hidden="true" data-toggle="tooltip" title="访问"></i>
						<!--<i @click.stop="clickGitBtn(data)" class="fa fa-git" aria-hidden="true" data-toggle="tooltip" title="git"></i>-->
						<i @click.stop="clickCloseBtn(data)" class="iconfont icon-close" aria-hidden="true" data-toggle="tooltip" title="关闭"></i>
					</span>
				</span>
			</span>
		</el-tree>
		<el-tree ref="filetree" :data="filetree" :props="treeprops" lazy :load="loadTreeNode"
			node-key="path" :highlight-current="true" @node-click="clickSelectPage">
			<span class="custom-tree-node" slot-scope="{node, data}">
				<span v-if="data.type == 'tree'" class="custom-tree-node">
					<span>
						<!--<i class="iconfont icon-folder"></i>-->
						<span>{{data.aliasname || data.name}}</span>
					</span>
					<span>
						<i class="iconfont icon-plus" @click.stop="clickNewFileBtn(data, node)"></i> 
					</span>
				</span>
				<span v-if="data.type == 'blob'" class="custom-tree-node">
					<span class="tree-node-text">
						<i v-show="data.isConflict" @click="clickFixedConflict(data)" class="fa fa-warning" aria-hidden="true" data-toggle="tooltip" title="冲突"></i>
						<i v-show="!data.isConflict" :class='isRefresh(data) ? "el-icon-loading" : isModify(data) ? "iconfont icon-edit" : "iconfont icon-file"'></i>
						<span>{{data.aliasname || data.name}}</span>
					</span>
					<span class="tree-node-btn-group">
						<i @click.stop="clickOpenBtn(data)"class="iconfont icon-open" aria-hidden="true" data-toggle="tooltip" title="访问"></i>
						<!--<i @click.stop="clickGitBtn(data)" class="fa fa-git" aria-hidden="true" data-toggle="tooltip" title="git"></i>-->
						<i @click.stop="clickDeleteBtn(data, node)" class="iconfont icon-delete" aria-hidden="true" data-toggle="tooltip" title="删除"></i>
					</span>
				</span>
			</span>
		</el-tree>
	</div>
</template>


<script>
import {
	Form,
	FormItem,
	Input,
	Button,
	Dialog,
	Select,
	Option,
	Tree,
	Loading,
	Message,
} from "element-ui";
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import _ from "lodash";
import {component} from "@/components/component.js";
import config from "@/config.js";
import api from "@@/common/api/note.js";

vue.use(Loading.directive);

export default {
	mixins: [component],
	components:{
		[Button.name]: Button,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Dialog.name]: Dialog,
		[Select.name]: Select,
		[Option.name]: Option,
		[Tree.name]: Tree,
		[Input.name]: Input,
	},
	data: function(){
		return {
			treeprops: {
				children:"nodes",
				label:"name",
				isLeaf: "leaf",
			},
			openedPages:{},
			isShowNewFile:false,
			newFileForm:{ type:"blob", isLoading:false },
			sites: {},
			filetree:[],
			pages: {},
		};
	},

	computed: {
		...mapGetters({
			"user": "user/user",
		}),
		username() {
			return this.user.username;
		},

		openedPageTree() {
			let tree = {name:"已打开页面", type:"tree", path:"", nodes:[]};
			for (var key in this.openedPages) {
				if (!this.openedPages[key]) {
					continue;
				}
				tree.nodes.push(this.openedPages[key]);
			}
			return [tree];
		},
	},

	methods: {
		...mapActions({
			setPagePath: "editor/setPagePath",
			setPage: "editor/setPage",
			savePage: "editor/savePage",
			deletePage: "editor/deletePage",
			setSwitchPage: "editor/setSwitchPage",
		}),

		getPageByPath(path) {
			return this.pages[path];
		},

		async getSites() {
			let result = await api.site.getByUsername({username: this.user.username});
			const sites = result.getData() || [];
			sites.forEach(site => {
				site.name = site.sitename;
				site.type = "tree";
				site.path = site.username + "/" + site.sitename;
				this.sites[site.sitename] = site;
			});
			return sites;
		},

		async getSitePage(site) {
			const self = this;
			const result = await api.files.list({prefix: [site.username, site.sitename].join("/")});
			if (result.isErr()) return;
			const pages = result.getData().items  || [];
			const pagemap = {};
			pages.forEach(page => {
				const paths = page.key.split("/");
				page.name = paths[paths.length-1];
				page.path = page.key;
				page.type = "blob";
				page.leaf = true;
				page.username = paths[0];
				page.name = page.name.replace(/\..*$/, "");
				page.url = page.path.replace(/\..*$/, "");

				pagemap[page.key] = page;
			});
			_.merge(self.pages, pagemap);
			return self.generateTreeNodes(pagemap);
		},

		generateTreeNodes(pages) {
			var roottree = [], i, j, k, name;
			for (var key in pages) {
				var node = pages[key];
				var paths = node.path.split("/");
				var tree = roottree;
				var path = "";

				if (node.path.indexOf(".md") < 0) {
					continue;
				}

				for (j = 0; j < paths.length - 1; j++) {
					name = paths[j];
					for (k = 0; k < tree.length; k++) {
						if (tree[k].name == name && tree[k].type == "tree") {
							break;
						}
					}
					if (k == tree.length) {
						tree.push({
							path: paths.slice(0,j+1).join("/"), 
							name:name, 
							type:"tree", 
							nodes:[]
						});
						tree[k].url = tree[k].path;
					}
					tree = tree[k].nodes;
					
				}
				for (k = 0; k < tree.length; k++) {
					if (tree[k].name == node.name && tree[k].type == node.type){
						break;
					}
				}

				if (k == tree.length) {
					tree.push(node);
				} 
			}

			if (!roottree[0] || !roottree[0].nodes || !roottree[0].nodes[0]) {
				return [];
			}
			return roottree[0].nodes[0].nodes;
		},

		async loadTreeNode(node, resolve) {
			const self = this;
			//console.log(node);
			if (node.level == 0) {
				return resolve([{
					name:"我的站点",
					type: 'tree',
					path: self.user.username,
				}]);
			} else if (node.level == 1) {
				const sites = await self.getSites();
				return resolve(sites);
			} else if (node.level == 2){
				const pages = await self.getSitePage(node.data);
				return resolve(pages);
			} else {
				return resolve(node.data && node.data.nodes || []);
			}
		},
		isRefresh(data) {
			return (this.getPageByPath(data.path) || {}).isRefresh;
		},
		isModify(data) {
			return this.getPageByPath(data.path).isModify;
		},
		loadPage(page, cb, errcb) {
			const self = this;
			let _loadPageFromServer = async function() {
				console.log("服务器最新");
				const result = await api.files.getFile({key:page.path});
				if (result.isErr()) {
					Message(result.getMessage());
					errcb && errcb();
					return;
				}
				const file = result.getData();
				page.hash = file.hash;
				if (typeof(file.content) != "string") {
					errcb && errcb();
					return;
				}
				page.content = file.content;
				cb && cb();
			}
			g_app.pageDB.getItem(page.path).then(function(data){
				if (!data) {
					_loadPageFromServer();
					return;
				}
				if (data.hash == page.hash || page.isModify) {
					if (data.hash == page.hash) {
						console.log("本地最新");
					} else {
						console.log("冲突");
					}
					_.merge(page, data);
					cb && cb();
					return;
				} 

				_loadPageFromServer();
			}, function() {
				_loadPageFromServer();
			})
		},
		clickSelectPage(data) {
			var self = this;
			// 激活文件树项
			self.setCurrentItem(data.path);
			if (data.type == "tree") {
				return;
			}

			// 添加打开列表

			const path = data.path;
			const page = this.getPageByPath(path);
			if (!page) return ;

			const finish = function() {
				page.isRefresh = false;
				window.location.hash = "#" + path.substring(0, path.length - config.pageSuffix.length);
				// 设置当前page
				self.emit(self.EVENTS.__EVENT__FILETREE__OUT__PAGE__, {
					namespace: self.namespace,
					page: page,
				});
				self.page = page;
				self.$set(self.openedPages, page.path, page);
			}

			if (page.content == undefined) {
				page.isRefresh = true;
				this.loadPage(page, function() {
					finish();
				}, function(){
					finish();
				});
			} else {
				finish();
			}
		},
		clickCloseBtn(data) {
			this.$delete(this.openedPages, data.path);
			if (data.path == this.page.path) {
				this.emit(this.EVENTS.__EVENT__FILETREE__OUT__PAGE__, {
					namespace: this.namespace,
				});
				let curKey = data.path.replace(/\/[^\/]*$/, "");
				this.setCurrentItem(curKey);
		   } else {
				this.setCurrentItem(this.pagePath);
		   }
		},
		setCurrentItem(path) {
			var self = this;
			setTimeout(function(){
				//console.log(path);
				self.$refs.filetree.setCurrentKey(path);
				self.$refs.openedTreeComp.setCurrentKey(path);
			}, 10);	
		},
		clickOpenBtn(data) {
			window.open(window.location.origin + "/" + data.path.replace(/\..*$/,""));
		},
		//clickGitBtn(data) {
		//	window.open(gitlab.getFileGitUrl(data.path));
		//},
		clickNewFileBtn(data, node) {
			this.isShowNewFile = true;
			this.newFileForm.data = data;
		},
		async clickSubmitNewFileBtn() {
			const self = this;
			const form = this.newFileForm;
			if (!form.filename) {
				this.$message("文件名不能为空");
				return;
			}
			const node = this.newFileForm.data;
			let path = node.path + '/' + form.filename + (form.type == "tree" ? "" : ".md");
			const page = this.getPageByPath(path);
			if (page && page.path) {
				this.$message("文件已存在");
				return;
			}
			let newNode = {
				path:path,
			    name:form.filename,
			    type:form.type,
				leaf: form.type == "blob",
			    content:"",
			    url:path.replace(/\.md$/, ""),
			    username:node.username,
			}
			form.isLoading = true;
			if (form.type != "tree") {
				//await this.savePage(newNode);
			}
			self.$refs.filetree.append(newNode, node.path);
			this.isShowNewFile = false;
			form.isLoading = false;
		},
		async clickDeleteBtn(data, node) {
			const path = data.path;
			const page = this.getPagePath(path);
			page.isRefresh = true;
			const result = await api.files.deleteFile({key:path});
			if (result.isErr()) {
				Message(result.getMessage());
			}
			g_app.pageDB.deleteItem(path);
			delete this.openedPages[path];
			delete this.pages[path];
			this.$refs.filetree.remove(node);
			this.$refs.openedTreeComp.remove(node);
			page.isRefresh = false;
		},
	},

	mounted() {
	},

	created() {
	}
}
</script>

<style scoped>
.custom-tree-node {
	flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.custom-tree-node i {
	margin-right:2px;
}
.tree-node-text {
	flex:8;
	text-overflow:ellipsis;
	overflow-x: hidden;
}
.tree-node-btn-group {
	flex:2;
	display:none;
}
.custom-tree-node:hover .tree-node-btn-group {
	display:flex;
	justify-content:flex-end;
}
</style>
