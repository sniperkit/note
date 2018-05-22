<template>
	<div class="theme-default">
		welconme to note
		<div class="font-1 color-2">
			<ul>
				<li class="font-8 color-8">list1</li>
				<li>list2</li>
			</ul>
		</div>
		<Title text="hello world"></Title>
		<Markdown text="## header"></Markdown>
		<MixLayer></MixLayer>
	</div>
</template>

<script>
import {
} from "element-ui";
import MixLayer from "@/components/complex/mixLayer.vue";

export default {
	layout: "index",

	components: {
		//MixLayer,
	}
}
</script>
