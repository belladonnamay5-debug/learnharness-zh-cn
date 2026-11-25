// 把构建产物安装到 LearnHarness 的插件目录，并打开插件开关。
// 用法：
//   npm run install-plugin
//   node install.mjs --data-dir "D:/somewhere/LearnHarness/data"
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");
const PLUGIN_ID = "zh-cn-localization";

function parseArgs(argv) {
	const out = { dataDir: null };
	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];
		if (arg === "--data-dir" || arg === "-d") out.dataDir = argv[i + 1] ?? null;
		else if (arg.startsWith("--data-dir=")) out.dataDir = arg.slice("--data-dir=".length);
	}
	return out;
}

/**
 * 默认位置：
 *   Windows  %APPDATA%\LearnHarness\data
 *   macOS    ~/Library/Application Support/LearnHarness/data
 *   Linux    ~/.config/LearnHarness/data
 */
function defaultDataDir() {
	if (process.env.LEARNHARNESS_DATA_DIR) return process.env.LEARNHARNESS_DATA_DIR;
	const home = process.env.HOME || process.env.USERPROFILE || "";
	if (process.platform === "win32") {
		const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
		return path.join(appData, "LearnHarness", "data");
	}
	if (process.platform === "darwin") {
		return path.join(home, "Library", "Application Support", "LearnHarness", "data");
	}
	const configHome = process.env.XDG_CONFIG_HOME || path.join(home, ".config");
	return path.join(configHome, "LearnHarness", "data");
}

const { dataDir: dataDirArg } = parseArgs(process.argv.slice(2));
const DATA_DIR = dataDirArg ? path.resolve(dataDirArg) : defaultDataDir();
const TARGET_DIST = path.join(DATA_DIR, "plugins", PLUGIN_ID, "dist");
const STATE_FILE = path.join(DATA_DIR, "plugins-state.json");

async function readState() {
	try {
		const raw = await readFile(STATE_FILE, "utf8");
		const state = JSON.parse(raw);
		if (!state || typeof state !== "object" || typeof state.enabled !== "object" || state.enabled === null) {
			throw new Error("plugins-state.json 结构异常，拒绝改写");
		}
		return state;
	} catch (error) {
		if (error && error.code === "ENOENT") return { version: 1, enabled: {} };
		throw error;
	}
}

async function main() {
	const files = await readdir(DIST).catch(() => {
		throw new Error(`找不到构建产物：${DIST}，请先运行 npm run build`);
	});
	for (const required of ["manifest.json", "main.js"]) {
		if (!files.includes(required)) throw new Error(`dist 不完整（缺 ${required}），请先运行 npm run build`);
	}

	await mkdir(TARGET_DIST, { recursive: true });
	for (const file of files) {
		await copyFile(path.join(DIST, file), path.join(TARGET_DIST, file));
	}

	const state = await readState();
	const before = state.enabled[PLUGIN_ID] ?? "(新增)";
	state.enabled[PLUGIN_ID] = true;
	await writeFile(STATE_FILE, `${JSON.stringify(state, null, "\t")}\n`, "utf8");

	console.log(`已安装到：${TARGET_DIST}`);
	console.log(`文件：${files.join("、")}`);
	console.log(`启用状态：${before} → true（见 ${STATE_FILE}）`);
	console.log("重启 LearnHarness 生效。");
}

try {
	await main();
} catch (error) {
	console.error(String(error && error.message ? error.message : error));
	process.exitCode = 1;
}