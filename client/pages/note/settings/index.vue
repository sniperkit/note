<template>
	<div>hello world</div>
</template>

<script>
import {
	Form,
	FormItem,
	Button,
	Input,
	RadioGroup,
	Radio,
	Message,
} from "element-ui";
import {mapActions, mapGetters} from "vuex";

export default {
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Button.name]: Button,
		[Input.name]: Input,
		[RadioGroup.name]: RadioGroup,
		[Radio.name]: Radio,
	},

	data: function() {
		return {
		}
	},

	computed: {
		...mapGetters({
			user: "user/user",
		}),
	},

}
</script>
