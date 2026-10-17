import type { AlbumsConfig } from "@/types/albumsConfig.ts";
import { withUserConfig } from "@/utils/config-overlay.ts";

export const albumsConfig: AlbumsConfig = withUserConfig("albums", {
	// 暂不启用：false 时 /albums 跳 404，导航与侧栏入口一并消失。
	enable: false,
	title: "$t:albums",
	description: "$t:albumsBanner",
});
