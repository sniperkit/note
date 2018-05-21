<template>
	<div class="theme-default">
		welconme to note
		<div class="font-1 color-2">
			<ul>
				<li class="font-8 color-8">list1</li>
				<li>list2</li>
			</ul>
		</div>
		<div class="color-2">
			hello world
		</div>
	</div>
</template>

<script>
import {
	DatePicker,
} from "element-ui";

import media from "@/components/bases/media.vue";

export default {
	layout: "index",

	components: {
		media,
	},
}
</script>
