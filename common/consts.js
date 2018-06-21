
// 用户访问权限
export const USER_ACCESS_LEVEL_NONE = 1;
export const USER_ACCESS_LEVEL_READ = 2;
export const USER_ACCESS_LEVEL_WRITE = 4;
export const USER_ACCESS_LEVEL = {
	USER_ACCESS_LEVEL_NONE,
	USER_ACCESS_LEVEL_READ,
	USER_ACCESS_LEVEL_WRITE,
}

// 文件审核状态
export const QINIU_AUDIT_STATE_NO_AUDIT = 0;  // 未审核
export const QINIU_AUDIT_STATE_PASS = 1;      // 审核通过
export const QINIU_AUDIT_STATE_NOPASS = 2;    // 审核未通过
export const QINIU_AUDIT_STATE_FAILED = 3;    // 审核失败
export const QINIU_AUDIT_STATE = {
	QINIU_AUDIT_STATE_NO_AUDIT,
	QINIU_AUDIT_STATE_PASS,
	QINIU_AUDIT_STATE_NOPASS,
	QINIU_AUDIT_STATE_FAILED,
}

// 实体类型
export const ENITY_TYPE_USER = 0; // 用户类型
export const ENITY_TYPE_SITE = 1; // 站点类型
export const ENITY_TYPE_PAGE = 2; // 页面类型
export const ENITY_TYPE = {
	ENITY_TYPE_USER,
	ENITY_TYPE_SITE,
	ENITY_TYPE_PAGE,
}

// 站点可见性
export const SITE_VISIBILITY_PUBLIC = 0; // 公开
export const SITE_VISIBILITY_PRIVATE = 1; // 私有
export const SITE_VISIBILITY = {
	SITE_VISIBILITY_PUBLIC,
	SITE_VISIBILITY_PRIVATE,
}

export default {
	USER_ACCESS_LEVEL,
	QINIU_AUDIT_STATE,
	ENITY_TYPE,
}
