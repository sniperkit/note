<template>
	<div>
		<i class="iconfont icon-home"></i>
		<i class="iconfont icon-minus"></i>
		<iframe id="iframeId" src="https://www.baidu.com/" style="height:200px"></iframe>
	</div>
</template>

<script>
import vue from "vue";
import * as qiniu from "qiniu-js";
import api from "@@/common/api/note.js";
import pathToRegexp from "path-to-regexp";
//import adi from "@/components/bases/adi.js";
import tag from "@/components/common/tag.js";
import {tags} from "@/lib/tags";


export default {
	components: {
		tag,
	},

	data: function() {
		return {
			tag: tags.getTag(),
		}
	},

	async mounted() {
		setTimeout(function() {
			var el = document.getElementById("iframeId");
			el.style.height = "400px"
		}, 2000);
	}
}
</script>

