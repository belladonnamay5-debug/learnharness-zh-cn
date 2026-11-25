/**
 * 构建：把翻译表与兜底规则注入 src/runtime.js，产出可直接安装的 dist/。
 *
 *   node build.mjs
 *
 * 产物：
 *   dist/main.js         —— 运行时（含内联词表）
 *   dist/manifest.json   —— 插件清单
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "src", "runtime.js");
const TABLE_FILE = path.join(ROOT, "translations", "zh-CN.json");
const OUT = path.join(ROOT, "dist");

const PLUGIN_ID = "zh-cn-localization";
const VERSION = "1.0.0";
const MIN_APP_VERSION = "0.7.0";

/**
 * 带变量的兜底规则：整串查不到时按顺序试，第一条命中的生效。
 * 宿主有很多「X 在 Y 里」一类的拼接文案，逐条写词表不现实。
 */
const RULES = [
	[/^, and (\d+) more$/, "，还有 $1 项"],
	[/^and (\d+) more$/, "还有 $1 项"],
	[/^(\d+) (folder|folders)$/, "$1 个文件夹"],
	[/^(\d+) (node|nodes)$/, "$1 个节点"],
	[/^(\d+) (edge|edges)$/, "$1 条边"],
	[/^(\d+) (source|sources)$/, "$1 份资料"],
	[/^(\d+) (second|seconds) ago$/, "$1 秒前"],
	[/^(\d+) (minute|minutes) ago$/, "$1 分钟前"],
	[/^(\d+) (hour|hours) ago$/, "$1 小时前"],
	[/^(\d+) (day|days) ago$/, "$1 天前"],
	[/^(\d+)s ago$/, "$1 秒前"],
	[/^(\d+)m ago$/, "$1 分钟前"],
	[/^(\d+)h ago$/, "$1 小时前"],
	[/^(\d+)d ago$/, "$1 天前"],
	[/^Version ([\d.]+) · meets minimum$/, "版本 $1 · 满足最低要求"],
	[/^Version ([\d.]+) · below minimum$/, "版本 $1 · 低于最低要求"],
	[/^(.+) is not valid JSON$/, "$1 不是有效的 JSON"],
	[/^(.+) has no thinking levels\.$/, "$1 没有思考档位。"],
	[/^The prober retried: (.+)$/, "探测代理已重试：$1"],
	[/^Version ([\d.]+)$/, "版本 $1"],
	[/^Use your override for (.+)$/, "使用你对「$1」的覆盖版本"],
	[/^Settings for (.+)$/, "$1 的设置"],
	[/^Enable (.+)$/, "启用 $1"],
	[/^Disable (.+)$/, "停用 $1"],
	[/^Dictation language: (.+)$/, "听写语言：$1"],
	[/^tool (.+)$/, "工具 $1"],
	[/^Empty = (.+)$/, "空 = $1"],
	[/^Checks installation\/version only—not authentication, model access, or quota\. Claude Code controls billing\. Requires v(.+)$/, "仅检查安装与版本 —— 不涉及认证、模型访问或配额。计费由 Claude Code 掌控。需要 v$1"],
	[/^Requires v(.+)$/, "需要 v$1"],	[/^Tool: (.+)$/, "工具：$1"],

];

const MANIFEST = {
	apiVersion: 1,
	id: PLUGIN_ID,
	name: "简体中文汉化",
	version: VERSION,
	minAppVersion: MIN_APP_VERSION,
	description: "把 LearnHarness 的界面文案实时替换为简体中文。学习内容、代码块、公式与输入区不会被改动。",
	author: "Feiyu3",
	main: "main.js",
};

function check(condition, message) {
	if (!condition) throw new Error(`构建校验失败：${message}`);
}

async function main() {
	const runtime = await readFile(SRC, "utf8");
	const table = JSON.parse(await readFile(TABLE_FILE, "utf8"));

	check(runtime.includes("/*@TABLE@*/"), "src/runtime.js 缺少 /*@TABLE@*/ 占位符");
	check(runtime.includes("/*@RULES@*/"), "src/runtime.js 缺少 /*@RULES@*/ 占位符");

	const entries = Object.entries(table);
	check(entries.length > 500, `词表条目太少（${entries.length}），可能读错了文件`);
	for (const [key, value] of entries) {
		check(key.trim() === key && key.length > 0, `键不能为空或有首尾空白：${JSON.stringify(key)}`);
		check(typeof value === "string" && value.length > 0, `「${key}」的译文为空`);
		check(!value.includes("\n"), `「${key}」的译文不能换行`);
	}
	check(RULES.length > 0, "RULES 不能为空");

	const tableLiteral = JSON.stringify(Object.fromEntries(entries), null, "\t");
	const rulesLiteral = `[\n${RULES.map(([pattern, replacement]) => `\t[/${pattern.source}/${pattern.flags}, ${JSON.stringify(replacement)}]`).join(",\n")},\n]`;

	const main = runtime
		// 用函数式替换，避免译文里的 `$&`、`$1` 被当成替换模式。
		.replace("/*@TABLE@*/{}", () => tableLiteral)
		.replace("/*@RULES@*/[]", () => rulesLiteral);

	check(main !== runtime, "占位符没有被替换，检查 src/runtime.js");

	await mkdir(OUT, { recursive: true });
	await writeFile(path.join(OUT, "main.js"), main, "utf8");
	await writeFile(path.join(OUT, "manifest.json"), `${JSON.stringify(MANIFEST, null, "\t")}\n`, "utf8");

	console.log(`翻译条目：${entries.length}`);
	console.log(`兜底规则：${RULES.length}`);
	console.log(`main.js：${main.length} 字符`);
	console.log(`manifest.json：${MANIFEST.id} @ ${MANIFEST.version}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
	await main();
}

export { RULES };