import vue from "vue";

import "@/components/bases";
import {registerModTag} from  "@/components/mods";


export default ({store}) => {
	if (process.client) {
		registerModTag(store);
	}
}
