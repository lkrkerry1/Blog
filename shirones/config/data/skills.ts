/**
 * 技能页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/skillsConfig.ts 控制。
 *
 * level 四档：beginner | intermediate | advanced | expert
 * category 必须是 skillsConfig.categories 里出现过的 key。
 */
import type { SkillItem } from "@/types/skillsConfig";

export const skillsData: SkillItem[] = [
	// ── Algorithms ────────────────────────────────────────────────────────────
	{
		name: "Dynamic Programming",
		description: "State design, transitions and optimisation.",
		icon: "material-symbols:account-tree-rounded",
		category: "algorithms",
		level: "advanced",
	},
	{
		name: "Data Structures",
		description: "Persistent segment trees and tries, block decomposition.",
		icon: "material-symbols:data-object-rounded",
		category: "algorithms",
		level: "advanced",
	},
	{
		name: "Graph Theory",
		description: "Shortest paths, spanning trees, flow basics.",
		icon: "material-symbols:hub-rounded",
		category: "algorithms",
		level: "intermediate",
	},
	{
		name: "Number Theory",
		description: "Modular arithmetic, sieves, bit tricks.",
		icon: "material-symbols:functions",
		category: "algorithms",
		level: "intermediate",
	},
	{
		name: "Combinatorics",
		description: "Counting, inclusion-exclusion, generating functions.",
		icon: "material-symbols:calculate",
		category: "algorithms",
		level: "intermediate",
	},
	{
		name: "Constructive Problems",
		description: "Building sequences and grids that satisfy constraints.",
		icon: "material-symbols:architecture-rounded",
		category: "algorithms",
		level: "intermediate",
	},
	{
		name: "String Algorithms",
		description: "Hashing, KMP, automata.",
		icon: "material-symbols:text-format-rounded",
		category: "algorithms",
		level: "intermediate",
	},
	{
		name: "Computational Geometry",
		description: "Convex hull, intersections, basic transforms.",
		icon: "material-symbols:shapes-rounded",
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
		icon: "simple-icons:git",
		category: "tools",
		level: "intermediate",
	},
	{
		name: "LaTeX",
		icon: "simple-icons:latex",
		category: "tools",
		level: "intermediate",
	},
	{
		name: "Linux",
		icon: "simple-icons:linux",
		category: "tools",
		level: "intermediate",
	},
];

/** 获取所有技能数据列表 */
export function getSkillsList(): SkillItem[] {
	return skillsData;
}
