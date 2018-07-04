import axios from "axios";

import config from "@/config.js";
import api from "@@/common/api/note.js";

api.options.baseURL = config.origin + config.baseUrl;

//console.log(api.options.baseURL);
