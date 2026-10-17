import type { SkillsConfig } from "@/types/skillsConfig";
import { withUserConfig } from "@/utils/config-overlay.ts";

/**
 * 技能页行为与展示配置。
 *
 * 遵循「配置管行为，数据管内容」原则：
 * - enable：页面总开关；false 时导航入口同步隐藏，访问 /skills/ 跳转 404；
 * - categories：筛选分类清单（数组顺序即页面顶部 Chips 顺序）；
 * - disabledNames：可选被禁用的技能名称列表（例如 ["PHP"]）；
 *
 * 注：技能的具体内容数据（技能名称、熟练度等级、图标、描述等）请在 `src/data/skills.ts` 中维护。
 */
export const skillsConfig: SkillsConfig = withUserConfig("skills", {
	enable: true,
	title: "$t:skills",
	// 页面说明：不走 $t: i18n 引用时会被当作字面量，直接用英文文案，
	// 免得显示主题默认的「turn ideas into maintainable products」那种前端向描述。
	description: "Algorithms, languages and tools I use in competitive programming.",
	categories: [
		{
			key: "algorithms",
			label: "Algorithms",
			// 离线图标集里只有 hub-outline-rounded，没有 hub-rounded。
			icon: "material-symbols:hub-outline-rounded",
		},
		{
			key: "languages",
			label: "Languages",
			icon: "material-symbols:code-rounded",
		},
		{
			key: "tools",
			label: "Tools",
			icon: "material-symbols:terminal-rounded",
		},
	],
	// disabledNames: [],
});
