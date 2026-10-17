/**
 * 站点罗盘数据（本地数据源）。
 * 用途：src/pages/compass.astro → organisms/CompassSection → molecules/CompassTile。
 * 添加站点：往对应 Shelf.entries 追加一项；数组顺序即展示顺序。
 * - icon：Iconify 名（material-symbols:xxx）或图片 URL（http(s)/绝对路径）；
 *   省略时瓷砖显示 label 首字母 tonal 块（不自动抓取 favicon）。
 * - image：用户自定义图片 URL（http(s)/绝对路径），优先于 icon 渲染；
 *   加载失败自动降级为首字母块。
 */

/** 单条站点记录 */
export interface CompassEntry {
	/** 站点名（瓷砖标题） */
	label: string;
	/** 外链地址 */
	href: string;
	/** 一句话说明（瓷砖副行；省略则显示域名） */
	note?: string;
	/** 图标：Iconify 名或图片 URL；省略 = 首字母兜底 */
	icon?: string;
	/** 用户自定义图片（http(s)/绝对路径）：优先于 icon 渲染；省略则走 icon/首字母 */
	image?: string;
}

/** 分组（Shelf = 罗盘上的收纳格） */
export interface CompassShelf {
	/** 锚点 id（字母数字，作分组定位与跳转） */
	key: string;
	/** 分组名 */
	name: string;
	/** 分组图标（Iconify 名，SectionTitle 行首） */
	icon?: string;
	/** 分组副文案（标题下弱文本，可选） */
	blurb?: string;
	entries: CompassEntry[];
}

export const compassData: CompassShelf[] = [
	{
		key: "judges",
		name: "Online Judges",
		icon: "material-symbols:trophy-outline-rounded",
		blurb: "平时刷题和打比赛的地方。",
		// 说明：simple-icons 的离线包里只有 21 个开发类图标，没有 codeforces / luogu，
		// 所以站点瓷砖统一走「首字母色块」兜底，比缺图标留空更整齐。
		entries: [
			{
				label: "Codeforces",
				href: "https://codeforces.com/",
				note: "Rating 与题单",
			},
			{
				label: "AtCoder",
				href: "https://atcoder.jp/",
				note: "日系比赛",
			},
			{
				label: "Luogu",
				href: "https://www.luogu.com.cn/",
				note: "中文题面与题解",
			},
			{
				label: "Virtual Judge",
				href: "https://vjudge.net/",
				note: "多平台题目聚合",
			},
		],
	},
	{
		key: "learn",
		name: "Learning",
		icon: "material-symbols:school-rounded",
		blurb: "查算法、补知识点。",
		entries: [
			{
				label: "OI Wiki",
				href: "https://oi-wiki.org/",
				note: "中文算法百科",
			},
			{
				label: "CP-Algorithms",
				href: "https://cp-algorithms.com/",
				note: "英文算法教程",
			},
		],
	},
	{
		key: "tools",
		name: "Tools",
		icon: "material-symbols:construction-rounded",
		blurb: "常用的开发与工具站。",
		entries: [
			{
				label: "GitHub",
				href: "https://github.com/lkrkerry1",
				note: "代码托管",
			},
		],
	},
];
