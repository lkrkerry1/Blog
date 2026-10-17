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
	// 注意 AtCoder 没有单色图标（Iconify 全集里只有 thesvg-color 那枚 29 KB 的精细彩标），
	// 所以它用本地图标 src/icons/atcoder.svg —— astro-icon 会从该目录按文件名解析，
	// 图标无 fill 属性，渲染时继承 currentColor，跟随明暗模式。
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/lkrkerry1",
		},
		{
			name: "Codeforces",
			icon: "simple-icons:codeforces",
			url: "https://codeforces.com/profile/lkrkerry",
		},
		{
			name: "AtCoder",
			icon: "atcoder",
			url: "https://atcoder.jp/users/lkrkerry",
		},
		{
			name: "Luogu",
			icon: "simple-icons:luogu",
			url: "https://www.luogu.com.cn/user/1129046",
		},
		{
			name: "Email",
			icon: "material-symbols:mail-outline-rounded",
			url: "mailto:lkrkerry@qq.com",
		},
	],
});
