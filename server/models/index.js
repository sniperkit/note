
import _Sequelize from 'sequelize';
import _sequelize from "./database.js";

export const Sequelize = _Sequelize;
export const sequelize = _sequelize;

import users from "./users.js";
import dataSources from "./dataSources.js";
import files from "./files.js";
import pages from "./pages.js";
import sites from "./sites.js";
import groups from "./groups.js";
import groupMembers from "./groupMembers.js";
import siteGroups from "./siteGroups.js";
import siteMembers from "./siteMembers.js";
import siteFiles from "./siteFiles.js";

export const models = {
	users,
	dataSources,
	files,
	pages,
	sites,
	groups,
	groupMembers,
	siteGroups,
	siteMembers,
	siteFiles
}

export default models;
