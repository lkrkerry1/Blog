import type { ProfileConfig } from "@/types/config";
import { withUserConfig } from "@/utils/config-overlay.ts";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 */
export const profileConfig: ProfileConfig = withUserConfig("profile", {
	// 以 "/" 开头时相对 public 目录，所以这里对应 public/images/avatar.webp。
	// 换头像只需替换那张图片，路径不用改。
	// 注意：包模式下主题只能解析 public 路径与 shirones/ 下的图片，
	// 放 src/assets/ 会渲染成断链的相对地址，别改到那里去。
	avatar: "/images/avatar.webp",
	name: "lkrkerry",
	bio: "青く広がった　あの空のように、曇りなく笑えたら　あなたに会いたい。",
	// 社交链接：按需增删即可，卡片会按数组顺序渲染图标（图标名可在 https://icones.js.org/ 查）。
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/lkrkerry1",
		},
		{
			name: "邮箱",
			icon: "material-symbols:mail-outline-rounded",
			url: "mailto:lkrkerry@qq.com",
		},
	],
});
