/**
 * 游戏展示页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/gamesConfig.ts 控制。
 *
 * 封面支持三种写法：
 * - src/assets 相对路径（走 Astro 图片管线自动优化为 webp/avif）；
 * - /public 绝对路径（如 "/assets/games/xxx.webp"，原样输出）；
 * - 远程 URL（https://…）。
 *
 * cover 省略时卡片回退到 icon 或主题色占位，所以补图前不会破版。
 * rating 为 0–5，支持 0.5 步进。
 */
import type { GameItem } from "@/types/gamesConfig";

export const gamesData: GameItem[] = [
	{
		id: "arknights",
		name: "Arknights",
		developer: "Hypergryph",
		category: "gacha",
		status: "playing",
		rating: 4,
		platform: "Mobile / PC",
		year: "2019",
		tags: ["Tower Defense", "Gacha"],
		description: "塔防玩法加上干员养成，一直在玩的一款。",
		link: "https://ak.hypergryph.com/",
		featured: true,
	},
	{
		id: "adofai",
		name: "A Dance of Fire and Ice",
		developer: "7th Beat Games",
		category: "rhythm",
		status: "playing",
		rating: 4.5,
		platform: "PC / Mobile",
		year: "2019",
		tags: ["Rhythm", "One-button"],
		description: "一键节奏游戏，难度曲线相当硬核。",
		link: "https://store.steampowered.com/app/977950/",
	},
	{
		id: "osu",
		name: "osu!",
		developer: "ppy",
		category: "rhythm",
		status: "playing",
		rating: 4,
		platform: "PC",
		year: "2007",
		tags: ["Rhythm", "Community"],
		description: "节奏游戏，社区谱面量极大，随时能开一把。",
		link: "https://osu.ppy.sh/",
	},
];
