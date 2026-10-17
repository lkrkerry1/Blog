/**
 * 设备展示页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/devicesConfig.ts 控制。
 *
 * status 四档：active | backup | archived | wishlist
 * category 必须是 devicesConfig.categories 里出现过的 key。
 * 没有 image 时卡片回退到 icon。
 *
 * 规格取自官方参数页与产品库；笔记本那一项直接读自本机硬件。
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
	{
		id: "nova-16",
		name: "nova 16",
		brand: "HUAWEI",
		category: "mobile",
		status: "active",
		specs: "麒麟 9010S · 6.68\" 120Hz OLED · 7000 mAh",
		specDetails: [
			{ key: "soc", label: "Chipset", value: "麒麟 9010S" },
			{ key: "os", label: "OS", value: "HarmonyOS 6.1" },
			{ key: "screen", label: "Display", value: "6.68\" OLED · 120Hz · 2800×1280" },
			{ key: "battery", label: "Battery", value: "7000 mAh" },
			{ key: "storage", label: "Storage", value: "256 GB / 512 GB" },
			{ key: "weight", label: "Weight", value: "约 199 g" },
		],
		description: "主力手机，日常和拍照都用它。",
		icon: "material-symbols:phone-iphone",
	},
	{
		id: "freebuds-7",
		name: "FreeBuds 7",
		brand: "HUAWEI",
		category: "audio",
		status: "active",
		specs: "半入耳 · 主动降噪 · 36 小时总续航",
		specDetails: [
			{ key: "type", label: "Type", value: "半入耳式真无线" },
			{ key: "anc", label: "ANC", value: "自适应主动降噪 / 通透模式" },
			{ key: "driver", label: "Driver", value: "10.8 mm 全频单元" },
			{ key: "battery", label: "Battery", value: "单次 7 小时 · 含充电盒 36 小时" },
			{ key: "bt", label: "Bluetooth", value: "蓝牙 5.4" },
			{ key: "weight", label: "Weight", value: "单耳 4.3 g" },
		],
		description: "通勤和写代码时用的降噪耳机。",
		icon: "material-symbols:headphones-rounded",
	},
	{
		id: "kg3089",
		name: "KG3089 北冥",
		brand: "雷神 ThundeRobot",
		category: "peripheral",
		status: "active",
		specs: "89 键 · 机械轴 · 有线 USB",
		specDetails: [
			{ key: "type", label: "Type", value: "机械键盘（青轴 / 红轴）" },
			{ key: "layout", label: "Layout", value: "89 键全尺寸布局" },
			{ key: "conn", label: "Connection", value: "USB 有线" },
			{ key: "nkey", label: "N-Key Rollover", value: "全键无冲" },
			{ key: "life", label: "Switch Life", value: "5000 万次" },
			{ key: "weight", label: "Weight", value: "约 800 g" },
		],
		description: "在用的机械键盘，有线全键无冲，写代码敲得挺爽。",
		icon: "material-symbols:keyboard-outline-rounded",
	},
];

/** 获取所有设备数据列表 */
export function getDevicesList(): DeviceItem[] {
	return devicesData;
}
