<template>
	<div style="display:flex" class="container">
		<div style="flex:2">
			<userpage key="leftSideBar"></userpage>
		</div>
		<div key="__main__" style="flex:10">
		</div>
	</div>
</template>

<script>
import userpage from "@/components/bases/userpage.vue";

export default {
	components: {
		userpage,
	},
}
</script>
