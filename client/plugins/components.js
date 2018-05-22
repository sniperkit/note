import vue from "vue";

import "@/components/bases";
import "@/components/complex";
import {registerModTag} from  "@/components/mods";


export default ({store}) => {
	if (process.client) {
		registerModTag(store);
	}
}
