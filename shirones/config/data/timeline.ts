/**
 * 时间线页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/timelineConfig.ts 控制。
 *
 * date 支持 "2026.06" 或 "2024.09 – 2026.06" 这类区间写法；
 * category 必须是 timelineConfig.categories 里出现过的 key；
 * featured: true 会渲染成重点里程碑节点。
 */
import type { TimelineItem } from "@/types/timelineConfig";

export const timelineData: TimelineItem[] = [
	{
		title: "考入中国人民大学",
		date: "2026.06",
		category: "education",
		subtitle: "Renmin University of China",
		featured: true,
	},
	{
		title: "NOIP 2024 三等奖",
		date: "2024.11",
		category: "contest",
		subtitle: "全国青少年信息学奥林匹克联赛",
	},
	{
		title: "CSP-S 2024 一等奖",
		date: "2024.10",
		category: "contest",
		subtitle: "CCF 非专业级软件能力认证 · 提高级",
	},
];

/** 获取所有时间线数据列表 */
export function getTimelineList(): TimelineItem[] {
	return timelineData;
}
