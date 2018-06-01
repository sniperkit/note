<template>
	<el-container 
		@mouseup.native="splitStripMouseup"
		@mousemove.native="splitStripMousemove"
		@mouseleave.native="splitStripMouseup">
		<el-aside ref="splitStrip1" :width="splitStrip1_width">
			<left></left>
		</el-aside>
		<el-container ref="splitStrip1R">
			<div class="split-strip kp_forbit_copy" @mousedown="splitStripMousedown('splitStrip1')"></div>
			<el-aside ref="splitStrip2" :width="splitStrip2_width">
				<code-editor ref="codemirror"></code-editor>
			</el-aside>
			<div class="split-strip kp_forbit_copy" @mousedown="splitStripMousedown('splitStrip2')"></div>
			<el-main ref="splitStrip2R" class="preview-container">
				<markdownEx :template="true"></markdownEx>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import {
	Container,
	Header,
	Aside,
	Main,
} from "element-ui";
import vue from "vue";

import api from "@@/common/api/note.js";
import {tags} from "@/lib/tags";
import userpage from "@/components/bases/userpage.vue";
import markdownEx from "@/components/bases/markdownEx.vue";
import left from "@/components/views/left.vue";
import codeEditor from "@/components/views/codeEditor.vue";
//import "@/components";

export default {
	components: {
		[Container.name]:Container,
		[Header.name]:Header,
		[Aside.name]:Aside,
		[Main.name]:Main,
		left,
		codeEditor,
		userpage,
		markdownEx
	},
	middleware: "authenticated",
	data: function() {
		return {
			splitStrip1_width:"18%",
			splitStrip2_width:"50%",
			value:undefined,
			mode:"editor",
			text:"",
			themeContent: "",
			themes:{},
		}
	},
	computed: {
		renderContent() {
			return this.pageContent;
			const content = this.themeContent ? (this.themeContent + "\n" + this.pageContent) : this.pageContent;

			return content;
		},
		codemirror() {
			return this.$refs.codemirror.codemirror;
		},
	},
	watch:{
		theme: function(theme) {
			//adi.setTheme(theme);
		},
		pagePath: async function(path) {
			//if (!path) {
			//	this.themeContent = "";
			//	return;
			//}
			//const paths = path.split("/");
			//const themePath = [paths[0], paths[1], "theme.md"].join("/");

			//if (themePath == path) {
			//	this.themeContent = "";
			//	return;
			//}

			//if (this.themes[themePath] == undefined) {
			//	const result = await api.files.getContent({key:themePath});
			//	this.themes[themePath] = result && result.isOk() ? result.getData() : "";
			//}
			//this.themeContent = this.themes[themePath];
		}
	},
	methods: {
		splitStripMousedown(typ) {
			var el = this.$refs[typ].$el;
			this.splitStrip = {
				el: el,
				rel: this.$refs[typ+"R"].$el,
				parentEl: el.parentElement,
				typ: typ,
				key: typ + "_width",
				startX: event.clientX,
				leftWidth: el.offsetWidth,
			};
			//console.log(event, typ, this.splitStrip);
		},
		splitStripMousemove() {
			if (!this.splitStrip) {
				return;
			}

			// 移动的时候显示
			this.splitStrip.el.style.display = "";

			let key = this.splitStrip.key;
			let startX = this.splitStrip.startX;
			let leftWidth = this.splitStrip.leftWidth;
			let newLeftWidth = leftWidth + event.clientX - startX;
			let parentWidth = this.splitStrip.parentEl.offsetWidth;
			if (parentWidth - newLeftWidth > 50) {
				this.splitStrip.rel.style.display = "";
			}

			if (this.splitStrip.typ == "splitStrip1" && newLeftWidth > 500) {
				newLeftWidth = 500;
			}
			
			this[key] = newLeftWidth + "px";
			this.splitStrip.newLeftWidth = newLeftWidth;
		},
		splitStripMouseup() {
			if (!this.splitStrip) {
				return;
			}
			const minWidths = {"splitStrip1": 200, "splitStrip2": 300};
			let key = this.splitStrip.typ + "_width";
			let minWidth = minWidths[this.splitStrip.typ];
			let newLeftWidth = this.splitStrip.newLeftWidth;
			let parentWidth = this.splitStrip.parentEl.offsetWidth;
			
			this[key] = newLeftWidth + "px";

			if (newLeftWidth < minWidth) {
				this.splitStrip.el.style.display = "none";
				this[key] = "0px";
			}

			if ((parentWidth - newLeftWidth) < minWidth) {
				this[key] = parentWidth - 10 + "px";
				this.splitStrip.rel.style.display = "none";
			}

			this.splitStrip = undefined;
		},
		addTag(tag, node, nodeComp) {
			this.mode = "test";
			if (!tag.type) {
				return;
			}
			const subTag = tags.getTag(tag.type);
			//if (tag.type.indexOf("Adi") == 0){
			//	subTag.vars = adi.getComponentProperties(tag.type);
			//}
			this.tag.addTag(subTag);	
		},
		selectTag(tag) {
			this.tag = tag;
			tag && this.setTagId(tag.tagId);
		},
	},
	mounted() {
		const self = this;

		self.on(self.EVENTS.__EVENT__CODEMIRROR__OUT__TEXT__, function(data) {
			self.emit(self.EVENTS.__EVENT__MARKDOWN_EX__IN__TEXT__, data);
		});
		self.on(self.EVENTS.__EVENT__FILETREE__OUT__PAGE__, function(data){
			self.emit(self.EVENTS.__EVENT__CODEMIRROR__IN__PAGE__, data);
		})
	},
}
</script>

<style>
html,body, .el-container, .el-aside {
	height:100%;
}
html, body {
	margin: 0px;
}
.preview-container {
	
}
.preview-container::-webkit-scrollbar {
	display: none;
}
.vue-codemirror {
	height:100%;
}
.el-container, .el-aside {
	overflow-y: hidden;
}

#editorContainer {
	height:100%;
}

.split-strip {
	height:100%;
	width: 5px;
	background-color:rgb(168,168,168);
	cursor: col-resize;
}
.CodeMirrorFold {
	background-color: #F5F5F5;
}
.CodeMirror-vscrollbar {
	overflow-y: hidden;
}
</style>
