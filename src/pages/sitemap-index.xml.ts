import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { aboutConfig } from "@/config/aboutConfig";
import { albumsConfig } from "@/config/albumsConfig";
import { animeConfig } from "@/config/animeConfig";
import { compassConfig } from "@/config/compassConfig";
import { devicesConfig } from "@/config/devicesConfig";
import { friendsConfig } from "@/config/friendsConfig";
import { gamesConfig } from "@/config/gamesConfig";
import { momentsConfig } from "@/config/momentsConfig";
import { projectsConfig } from "@/config/projectsConfig";
import { seriesConfig } from "@/config/seriesConfig";
import { siteConfig } from "@/config/siteConfig";
import { skillsConfig } from "@/config/skillsConfig";
import { timelineConfig } from "@/config/timelineConfig";

/**
 * 自己生成 sitemap。
 *
 * 为什么不用 @astrojs/sitemap：主题通过 updateConfig() 注入它，在 Astro 7 下那个
 * 实例的 hook 不生效 —— 既不写文件，也不报「缺少 site 选项」的警告。显式注册、
 * 换名绕过 Astro 按名去重、清 .astro 与 Vite 缓存都试过，仍无产出。所以这里直接
 * 遍历内容集合输出，不再依赖那个集成。
 *
 * 访问路径是 /sitemap-index.xml（页脚与 robots.txt 都指向它）。单个 <urlset> 就够用：
 * 规范上限是 5 万条，这个站远达不到，没必要拆成 sitemap index + 分片。
 */

const SITE = siteConfig.site.replace(/\/+$/, "");
const BASE = (siteConfig.base || "/").replace(/\/+$/, "");

const abs = (path: string) => `${SITE}${BASE}${path}`;

const escapeXml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

type Entry = {
	path: string;
	changefreq: string;
	priority: string;
	lastmod?: string;
};

/** 静态页面，按各板块的 enable 开关决定是否收录。 */
function staticEntries(): Entry[] {
	// PageMeta.enable 的类型是 boolean | undefined，这里如实声明，
	// 过滤时只认可明确为 true 的项。
	const pages: Array<
		[path: string, enabled: boolean | undefined, changefreq: string, priority: string]
	> = [
		["/", true, "daily", "1.0"],
		["/archive/", true, "weekly", "0.8"],
		["/categories/", true, "weekly", "0.6"],
		["/tags/", true, "weekly", "0.6"],
		["/about/", aboutConfig.enable, "monthly", "0.5"],
		["/skills/", skillsConfig.enable, "monthly", "0.6"],
		["/timeline/", timelineConfig.enable, "monthly", "0.6"],
		["/projects/", projectsConfig.enable, "monthly", "0.6"],
		["/devices/", devicesConfig.enable, "monthly", "0.5"],
		["/games/", gamesConfig.enable, "monthly", "0.5"],
		["/anime/", animeConfig.enable, "weekly", "0.5"],
		["/compass/", compassConfig.enable, "monthly", "0.5"],
		["/series/", seriesConfig.enable, "weekly", "0.6"],
		["/friends/", friendsConfig.enable, "monthly", "0.4"],
		["/moments/", momentsConfig.enable, "daily", "0.5"],
		["/albums/", albumsConfig.enable, "monthly", "0.4"],
	];

	return pages
		.filter(([, enabled]) => enabled)
		.map(([path, , changefreq, priority]) => ({ path, changefreq, priority }));
}

/** 文章页 + 系列详情页。 */
async function contentEntries(): Promise<Entry[]> {
	const entries: Entry[] = [];

	const posts = await getCollection("posts", ({ data }) =>
		import.meta.env.PROD ? data.draft !== true : true,
	);
	for (const post of posts) {
		const updated = (post.data.updated ?? post.data.published) as
			| Date
			| undefined;
		entries.push({
			path: `/posts/${post.id}/`,
			changefreq: "monthly",
			priority: "0.8",
			lastmod: updated ? new Date(updated).toISOString() : undefined,
		});
	}

	if (seriesConfig.enable) {
		const series = await getCollection("series");
		for (const item of series) {
			entries.push({
				path: `/series/${item.id}/`,
				changefreq: "weekly",
				priority: "0.5",
			});
		}
	}

	return entries;
}

export const GET: APIRoute = async () => {
	const entries = [...staticEntries(), ...(await contentEntries())];

	// 同一个地址只保留一条，避免静态页和内容页意外重复。
	const seen = new Set<string>();
	const urls = entries
		.filter((entry) => {
			if (seen.has(entry.path)) return false;
			seen.add(entry.path);
			return true;
		})
		.map((entry) => {
			const parts = [`    <loc>${escapeXml(abs(entry.path))}</loc>`];
			if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
			parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
			parts.push(`    <priority>${entry.priority}</priority>`);
			return `  <url>\n${parts.join("\n")}\n  </url>`;
		});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
