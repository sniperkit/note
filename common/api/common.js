
export function Key(opt = {}) {
	const self = this;
	
	self.prefix = opt.prefix || "kw";
	self.version = opt.version || "v0";
	self.type = opt.type || "__type__";
	self.key = opt.key || "__key__";
		
	self.setKey = (key) => {
		self.key = key;
		return self;
	}

	self.index = () => [self.prefix, self.version, self.type].join("_");
	self.path = (key) => "__data__/" +  self.prefix + "_"  + self.version + "_" + self.type + "/" + self.key + ".yaml";
	self.uid = (key) => self.path(key).replace(/\//g, "_");
}
