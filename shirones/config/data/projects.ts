/**
 * 项目页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/projectsConfig.ts 控制。
 *
 * phase 三档：shipped | building | exploring
 * summary 保留仓库原始简介；fork 的项目在末尾标注上游，避免误认为原创。
 * 数据来自 GitHub API（描述 / 主语言 / 创建与推送时间），改动后建议同步。
 */
import type { ProjectItem } from "@/types/projectsConfig";

export const projectsData: ProjectItem[] = [
	{
		key: "seat-application",
		title: "SeatApplication",
		summary: "座位表自动排列，支持动态概率与模块化配置。",
		category: "tool",
		phase: "shipped",
		technologies: ["Python"],
		year: "2024",
		repository: "https://github.com/lkrkerry1/SeatApplication",
		featured: true,
	},
	{
		key: "ppt-sorter",
		title: "ppt-sorter",
		summary: "根据 PPT 内容自动进行分类。",
		category: "tool",
		phase: "shipped",
		technologies: ["Python"],
		year: "2025",
		repository: "https://github.com/lkrkerry1/ppt-sorter",
	},
	{
		key: "crawl-telegraph",
		title: "crawl-telegraph",
		summary: "爬取 Telegraph 中的图片资源。 · fork of CalmXin/xin-crawl-telegraph",
		category: "tool",
		phase: "shipped",
		technologies: ["Python"],
		year: "2025–2026",
		repository: "https://github.com/lkrkerry1/crawl-telegraph",
	},
	{
		key: "ex-recommend",
		title: "ExRecommend",
		summary: "基于 ExHentai 收藏内容的标签推荐系统。",
		category: "tool",
		phase: "shipped",
		technologies: ["Python"],
		year: "2026",
		repository: "https://github.com/lkrkerry1/ExRecommend",
	},
	{
		key: "wordle-arena",
		title: "Wordle-Arena",
		summary: "A Wordle game built with Python + Tkinter, with a robot opponent and PvP mode.",
		category: "web",
		phase: "shipped",
		technologies: ["Python", "Tkinter", "HTML"],
		year: "2026",
		website: "https://wordle-arena-p7gj.onrender.com/",
		repository: "https://github.com/lkrkerry1/Wordle-Arena",
		featured: true,
	},
	{
		key: "asumi",
		title: "Asumi",
		summary:
			"一个通用桌宠 Agent 框架，能导入自定义角色包，并让角色感知屏幕内容与系统事件，根据当前场景主动做出自然反应。 · fork of Rvosy/Sakura",
		category: "experiment",
		phase: "exploring",
		technologies: ["Python"],
		year: "2026",
		repository: "https://github.com/lkrkerry1/Asumi",
	},
	{
		key: "open-llm-vtuber",
		title: "Open-LLM-VTuber",
		summary:
			"Talk to any LLM with hands-free voice interaction, voice interruption, and a Live2D talking face, running locally across platforms. · fork of Open-LLM-VTuber/Open-LLM-VTuber",
		category: "experiment",
		phase: "exploring",
		technologies: ["Python", "JavaScript", "Live2D"],
		year: "2026",
		repository: "https://github.com/lkrkerry1/Open-LLM-VTuber",
	},
];

/** 获取所有项目数据列表 */
export function getProjectsList(): ProjectItem[] {
	return projectsData;
}
