<template>
	<div>
		welconme to note
		<div style="color:blue">
			<ul>
				<li>list1</li>
				<li>list2</li>
			</ul>
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
