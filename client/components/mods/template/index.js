import vue from "vue";
import _ from "lodash";

import {tags} from "@/lib/tags";

import _default from "./default.vue";

export const styles = {
	default: _default,
}

export const modName = "template";

const getTagFactoryByVNode = (vnode) => () => tags.getTagByVNode(vnode);
for (var key in styles) {
	let style = styles[key];
	let tagKey = modName + "-" + (style.name || key);
	let comp = new vue(style);
	let vnode = comp.$mount()._vnode;

	//console.log(tagKey);
	//console.log(vnode);

	tags.registerTagFactory(tagKey, getTagFactoryByVNode(vnode));
}

export default styles;
