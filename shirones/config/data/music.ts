import type { TrackDescriptor } from "@/types/musicConfig";

/**
 * 侧栏音乐本地曲目数据源。
 * 遵循「零额外负担」原则：配置与数据解耦，此处专用于管理本地曲目列表。
 *
 * 添加曲目：在 musicTracks 中追加一项即可：
 * - id: 唯一标识
 * - title: 曲目标题
 * - artist: 艺术家（可选）
 * - cover: 封面图地址（可选；/public 路径或绝对 URL）
 * - source: 音频文件地址（相对 /public 或绝对 URL）
 * - duration: 曲目时长（秒，可选）
 *
 * 当前三首取自 WHITE ALBUM2 Original Soundtrack 〜setsuna〜。
 * 原始音源是 24bit / 96kHz FLAC（单曲约 100–120 MB），已重采样到 44.1kHz
 * 并编码为 192kbps MP3；封面从 FLAC 内嵌图提取为 512px WebP。
 * 无损母带被移到 .audio-source/（已 gitignore），不入库。
 */
export const musicTracks: readonly TrackDescriptor[] = [
	{
		id: "anata-wo-omoitai",
		title: "あなたを想いたい",
		artist: "小木曽雪菜",
		cover: "/assets/music/cover/anata-wo-omoitai.webp",
		source: "/assets/music/url/anata-wo-omoitai.mp3",
		duration: 277,
	},
	{
		id: "powder-snow",
		title: "POWDER SNOW",
		artist: "小木曽雪菜",
		cover: "/assets/music/cover/powder-snow.webp",
		source: "/assets/music/url/powder-snow.mp3",
		duration: 255,
	},
	{
		id: "toki-no-mahou-acoustic",
		title: "時の魔法 Acoustic Version",
		artist: "小木曽雪菜",
		cover: "/assets/music/cover/toki-no-mahou-acoustic.webp",
		source: "/assets/music/url/toki-no-mahou-acoustic.mp3",
		duration: 310,
	},
];
