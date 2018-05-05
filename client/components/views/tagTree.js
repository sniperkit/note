var tagTree = [
{
	label:"布局",
	children:[
	{
		label:"flex布局",
		children:[
			{
				label:"行容器",
				type:"rowDiv",
			},
			{
				label:"列容器",
				type:"colDiv",
			},
		],
	},
	{
		label:"layout布局",
		children:[
			{
				label:"布局行",
				type:"elRow",
			},
			{
				label:"布局列",
				type:"elCol",
			},
		],
   	},
	{
		label:"container布局",
		children:[
			{
				label:"外层容器",
				type:"elContainer",
			},
			{
				label:"顶栏容器",
				type:"elHeader",
			},
			{
				label:"侧栏容器",
				type:"elAside",
			},
			{
				label:"主区域容器",
				type:"elMain",
			},
			{
				label:"底栏容器",
				type:"elFooter",
			},
		],
	},
	]
},
{
	label:"元素",
	children: [
		{
			label:"容器",
			type:"div",
		},
		{
			label:"文本",
			type:"span",
		},
		{
			label:"段落",
			type:"p",
		},
		{
			label:"图片",
			type:"img",
		},
		{
			label:"一级标题",
			type:"h1",
		},
		{
			label:"二级标题",
			type:"h2",
		},
		{
			label:"三级标题",
			type:"h3",
		},
		{
			label:"链接",
			type:"a",
		},
		
	]
},
{
	label:"组件",
	children: [
		{
			label:"TOC",
			type:'toc',
		},
		{
			label:"MARKDOWN",
			type:'markdown',
		},
		{
			label:"走马灯",
			type:"wikiCarousel",
		},
	],
},
//{
	//label:"ADI组件",
	//children: [
		//{
			//label:"轮播 AdiImgLoop",
			//type:"AdiImgLoop",
			//source:"AdiComponent",
		//},
		//{
			//label:"标题 AdiTitle",
			//type:"AdiTitle",
			//source:"AdiComponent",
		//},
		//{
			//label:"按钮 AdiButton",
			//type:"AdiButton",
			//source:"AdiComponent",
		//},
		//{
			//label:"菜单 AdiMenu",
			//type:"AdiMenu",
			//source:"AdiComponent",
		//},
		//{
			//label:"多媒体 AdiMedia",
			//type:"AdiMedia",
			//source:"AdiComponent",
		//},
		//{
			//label:"标签 AdiMedia",
			//type:"AdiLabel",
			//source:"AdiComponent",
		//},
		//{
			//label:"Markdown AdiMarkdown",
			//type:"AdiMarkdown",
			//source:"AdiComponent",
		//},
		//{
			//label:"画板 AdiBoard",
			//type:"AdiBoard",
			//source:"AdiComponent",
		//},
		//{
			//label:"文本 AdiDescLabel",
			//type:"AdiDescLabel",
			//source:"AdiComponent",
		//},
		//{
			//label:"VIPRead AdiVipRead",
			//type:"AdiVipRead",
			//source:"AdiComponent",
		//},
		//{
			//label:"评论 AdiVipRead",
			//type:"AdiComment",
			//source:"AdiComponent",
		//},
		//{
			//label:"对话框 AdiInnerModal",
			//type:"AdiInnerModal",
			//source:"AdiComponent",
		//},
	//],
//},
{
	label:"ELEMENTUI",
	children:[
		{
			label:"按钮",
			type:"elButton",
		},
	],
},
{
	label: "MODS",
	children: [
	{
		label: "template",
		children: [
		{
			label: "default",
			type: "template-default",
		},
		{
			label: "leftMain",
			type: "template-leftMain",
		},
		],
	},
	{
		label: "title", 
		children: [
		{
			label:"style",
			type: "title/style",
		},
		],
	},
	],
},
//{
	//label:"adi模块",
	//children:[
	//{
		//label:"ModMarkdown",
		//type:"ModMarkdown",
		//source:"AdiMod",
	//},
	//{
		//label:"ModHeader",
		//type:"ModHeader",
		//source:"AdiMod",
	//},
	//{
		//label:"ModTitle",
		//type:"ModTitle",
		//source:"AdiMod",
	//},
	//{
		//label:"ModMixPosition",
		//type:"ModMixPosition",
		//source:"AdiMod",
	//},
	//{
		//label:"ModMixLayer",
		//type:"ModMixLayer",
		//source:"AdiMod",
	//},
	//{
		//label:"ModImgLoop",
		//type:"ModImgLoop",
		//source:"AdiMod",
	//},
	//{
		//label:"ModParacraft",
		//type:"ModParacraft",
		//source:"AdiMod",
	//},
	//{
		//label:"ModQQ",
		//type:"ModQQ",
		//source:"AdiMod",
	//},
	//{
		//label:"ModText",
		//type:"ModText",
		//source:"AdiMod",
	//},
	//{
		//label:"ModBoard",
		//type:"ModBoard",
		//source:"AdiMod",
	//},
	//{
		//label:"ModVipRead",
		//type:"ModVipRead",
		//source:"AdiMod",
	//},
	//{
		//label:"ModComment",
		//type:"ModComment",
		//source:"AdiMod",
	//},
	//],
//},
];

export default tagTree;
