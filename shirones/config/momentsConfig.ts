import type { MomentsConfig } from "@/types/momentsConfig.ts";
import { withUserConfig } from "@/utils/config-overlay.ts";

export const momentsConfig: MomentsConfig = withUserConfig("moments", {
	// 已启用：/moments 正常渲染动态列表，导航与侧栏入口随之出现。
	enable: true,
	title: "$t:moments",
	description: "$t:momentsBanner",
});
