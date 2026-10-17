import type { MomentsConfig } from "@/types/momentsConfig.ts";
import { withUserConfig } from "@/utils/config-overlay.ts";

export const momentsConfig: MomentsConfig = withUserConfig("moments", {
	// 暂不启用：false 时 /moments 跳 404，导航与侧栏入口一并消失，
	// 同时因为不再查询空集合，构建时的 empty collection 警告也一并消失。
	enable: false,
	title: "$t:moments",
	description: "$t:momentsBanner",
});
