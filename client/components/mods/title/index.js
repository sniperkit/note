import vue from "vue"; 
import _ from "lodash";

import {tags} from "@/lib/tags";
import _style from "./style.vue";

export const styles = {
	style:_style,
}

export const modName = "title";


const getTagFactoryByVNode = (vnode) => () => tags.getTagByVNode(vnode);
for (var key in styles) {
	let style = styles[key];
	let tagKey = modName + "-" + (style.name || key);
	let comp = new vue(style);
	let vnode = comp.$mount()._vnode;

	tags.registerTagFactory(tagKey, getTagFactoryByVNode(vnode));
}

export default styles;