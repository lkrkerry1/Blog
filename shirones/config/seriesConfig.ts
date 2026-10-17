import type { SeriesConfig } from "@/types/seriesConfig.ts";
import { withUserConfig } from "@/utils/config-overlay.ts";

export const seriesConfig: SeriesConfig = withUserConfig("series", {
	// 暂不启用：false 时 /series 跳 404，导航/侧栏/sitemap 入口裁剪，
	// 文章内系列卡也不再渲染；空系列集合的构建警告随之消失。
	enable: false,
	title: "$t:series",
	// 空 = 使用动态汇总（「x 个系列 · y 篇文章」）
	description: "",
	cardPosition: "bottom",
});
