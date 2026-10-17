import type { FriendsConfig } from "@/types/friendsConfig.ts";
import { withUserConfig } from "@/utils/config-overlay.ts";

export const friendsConfig: FriendsConfig = withUserConfig("friends", {
	// 暂不启用：false 时 /friends 跳 404，导航与侧栏入口一并消失。
	enable: false,
	title: "$t:friends",
	description: "$t:friendsBanner",
});
