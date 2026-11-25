// 冒烟测试：只验证纯函数 translateText（不触碰 DOM）。
import { translateText } from "../dist/main.js";

const samples = [
	["Settings", "设置"],
	["Community plugins", "社区插件"],
	["Retry activation", "重试激活"],
	["Cache retention", "缓存保留"],
	["Ask anything, or press Enter for the next one.", null],
	["Not in the table at all zzz", null],
	[", and 3 more", "，还有 3 项"],
	["12 folders", "12 个文件夹"],
	["5 nodes", "5 个节点"],
	["2h ago", "2 小时前"],
	["", null],
];

let failed = 0;
for (const [input, expected] of samples) {
	const actual = translateText(input);
	if (expected === null) {
		console.log(`  ${JSON.stringify(input)} → ${JSON.stringify(actual)}  (仅观察)`);
		continue;
	}
	if (actual !== expected) {
		failed += 1;
		console.log(`FAIL ${JSON.stringify(input)} → ${JSON.stringify(actual)}，期望 ${JSON.stringify(expected)}`);
	}
}

// 幂等性：已翻译的结果不应再被二次命中。
let echo = 0;
for (const [input] of samples) {
	const once = translateText(input);
	if (!once) continue;
	const twice = translateText(once);
	if (twice && twice !== once) {
		echo += 1;
		console.log(`二次命中 ${JSON.stringify(input)} → ${JSON.stringify(once)} → ${JSON.stringify(twice)}`);
	}
}

console.log(failed === 0 ? `通过：${samples.length} 个样例` : `失败：${failed} 个样例`);
console.log(`二次命中：${echo}`);
process.exitCode = failed === 0 ? 0 : 1;