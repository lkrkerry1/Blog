/**
 * 技能页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/skillsConfig.ts 控制。
 *
 * level 四档：beginner | intermediate | advanced | expert
 * category 必须是 skillsConfig.categories 里出现过的 key。
 *
 * 图标约束：技能卡片是 Svelte 岛，图标走 @iconify/svelte 的离线集合，
 * 只能用主题预打包进 local-icon-collections 的那批图标（material-symbols 179 个、
 * simple-icons 21 个开发类）。写其他名字不会报错，但运行时不渲染。
 * 当前 simple-icons 离线集只有 astro/c/cplusplus/go/javascript/kotlin/nodedotjs/
 * openjdk/php/playwright/postgresql/python/react/ruby/rust/sass/svelte/swift/
 * tailwindcss/typescript/vuedotjs —— 没有 git/latex/linux，所以那几项改用
 * material-symbols 表达。
 */
import type { SkillItem } from "@/types/skillsConfig";

export const skillsData: SkillItem[] = [
	// ── Algorithms ────────────────────────────────────────────────────────────
	{
		name: "Dynamic Programming",
		description: "State design, transitions and optimisation.",
		icon: "material-symbols:code-blocks-outline-rounded",
		category: "algorithms",
		level: "advanced",
	},
	{
		name: "Data Structures",
		description: "Persistent segment trees and tries, block decomposition.",
		icon: "material-symbols:inventory-2-outline-rounded",
		category: "algorithms",
		level: "advanced",
	},
	{
		name: "Graph Theory",
		description: "Shortest paths, spanning trees, flow basics.",
		icon: "material-symbols:hub-outline-rounded",
		category: "algorithms",
		level: "intermediate",
	},
	{
		name: "Number Theory",
		description: "Modular arithmetic, sieves, bit tricks.",
		icon: "material-symbols:key-rounded",
		category: "algorithms",
		level: "intermediate",
	},
	{
		name: "Combinatorics",
		description: "Counting, inclusion-exclusion, generating functions.",
		icon: "material-symbols:grid-view-rounded",
		category: "algorithms",
		level: "intermediate",
	},
	{
		name: "Constructive Problems",
		description: "Building sequences and grids that satisfy constraints.",
		icon: "material-symbols:build-outline-rounded",
		category: "algorithms",
		level: "intermediate",
	},
	{
		name: "String Algorithms",
		description: "Hashing, KMP, automata.",
		icon: "material-symbols:notes-rounded",
		category: "algorithms",
		level: "intermediate",
	},
	{
		name: "Computational Geometry",
		description: "Convex hull, intersections, basic transforms.",
		icon: "material-symbols:category-outline-rounded",
		category: "algorithms",
		level: "beginner",
	},

	// ── Languages ─────────────────────────────────────────────────────────────
	{
		name: "C++",
		description: "Primary contest language.",
		icon: "simple-icons:cplusplus",
		category: "languages",
		level: "expert",
	},
	{
		name: "Python",
		description: "Scripting and quick prototyping.",
		icon: "simple-icons:python",
		category: "languages",
		level: "advanced",
	},

	// ── Tools ─────────────────────────────────────────────────────────────────
	{
		name: "Git",
		icon: "material-symbols:history-rounded",
		category: "tools",
		level: "intermediate",
	},
	{
		name: "LaTeX",
		icon: "material-symbols:article-outline-rounded",
		category: "tools",
		level: "intermediate",
	},
	{
		name: "Linux",
		icon: "material-symbols:terminal-rounded",
		category: "tools",
		level: "intermediate",
	},
];

/** 获取所有技能数据列表 */
export function getSkillsList(): SkillItem[] {
	return skillsData;
}
