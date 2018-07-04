<template>
	<div class="headerContainer">
		<div class="container full-height flex-col">
			<div class="flex-row">
				<user-link></user-link>
			</div>
		</div>
	</div>
</template>

<script>

import UserLink from  "@/components/bases/userLink.vue";
export default {
	components: {
		UserLink,
	},

	data: function() {
		return {
		}
	},

	methods: {
	},

	mounted() {
	}
}
</script>

<style scoped>
.headerContainer {
	border-bottom: 1px solid rgb(221,221,221);
	height:100%;
}
.flex-col {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.flex-row {
	display: flex;
	justify-content: flex-end;
	padding-right: 10px;
}
</style>
