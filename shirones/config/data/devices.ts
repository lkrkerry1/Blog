/**
 * 设备展示页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/devicesConfig.ts 控制。
 *
 * status 四档：active | backup | archived | wishlist
 * category 必须是 devicesConfig.categories 里出现过的 key。
 * 没有 image 时卡片回退到 icon。
 */
import type { DeviceItem } from "@/types/devicesConfig";

export const devicesData: DeviceItem[] = [
	{
		id: "matebook-d15",
		name: "MateBook D 15",
		brand: "HUAWEI",
		category: "desk",
		status: "active",
		specs: "Ryzen 7 4800H · 16 GB · 512 GB SSD",
		specDetails: [
			{ key: "model", label: "Model", value: "HNL-WXX9" },
			{ key: "cpu", label: "CPU", value: "AMD Ryzen 7 4800H (8C / 16T)" },
			{ key: "ram", label: "Memory", value: "16 GB" },
			{ key: "ssd", label: "Storage", value: "512 GB SSD" },
			{ key: "os", label: "OS", value: "Windows 11 Pro" },
		],
		description: "主力机，日常开发、写题解和本地编译都在它上面。",
		icon: "material-symbols:laptop-windows-rounded",
		featured: true,
	},
];

/** 获取所有设备数据列表 */
export function getDevicesList(): DeviceItem[] {
	return devicesData;
}
