import type { SeriesConfig } from "@/types/seriesConfig.ts";
import { withUserConfig } from "@/utils/config-overlay.ts";

export const seriesConfig: SeriesConfig = withUserConfig("series", {
	// 保留启用：以后写多篇连载（比如按比赛/知识点成套的题解）可以直接用，
	// 现在没有系列内容，页面显示空状态即可。
	enable: true,
	title: "$t:series",
	// 空 = 使用动态汇总（「x 个系列 · y 篇文章」）
	description: "",
	cardPosition: "bottom",
});
