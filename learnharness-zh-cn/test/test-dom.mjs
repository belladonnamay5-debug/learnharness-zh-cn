// DOM 级冒烟测试：用 linkedom 造一个贴近真实界面的片段，跑一遍 activate()。
// 目的是在安装到应用之前，验证替换范围、跳过规则、增量更新与关闭还原。
import { pathToFileURL } from "node:url";

/**
 * linkedom 是 devDependency（npm install 即可）。
 * 想复用本机已有的副本时，把 LINKEDOM 环境变量指向 linkedom/esm/index.js 即可。
 */
async function loadLinkedom() {
	try {
		return await import("linkedom");
	} catch {
		const local = process.env.LINKEDOM;
		if (!local) {
			console.error("缺少 linkedom：先运行 npm install，或用 LINKEDOM 指向 linkedom/esm/index.js");
			process.exit(1);
		}
		return await import(pathToFileURL(local).href);
	}
}

const { parseHTML } = await loadLinkedom();

const { window, document } = parseHTML(`<!doctype html><html><body>
  <header><h1>Settings</h1><button aria-label="Retry activation">x</button></header>
  <aside><span>Cache retention</span><span>Community plugins</span></aside>
  <article class="lh-prose"><p>Settings Settings</p><code>Settings</code><button aria-label="Copy table">x</button></article>
  <div data-streamdown="code-block"><span>Settings</span></div>
  <div class="katex">Settings</div>
  <div contenteditable="true" placeholder="Whatever comes to mind as you read.">Settings</div>
  <svg aria-label="Plan diagram"><text>Settings</text></svg>
  <textarea placeholder="Settings"></textarea>
  <input placeholder="Settings" title="Community plugins" />
  <p>Drag to pan · scroll to zoom</p>
  <p>Untranslated brand LearnHarness stays</p>
</body></html>`);

// linkedom 没有实现 NodeFilter / MutationObserver，这里补最小可用版本。
const NodeFilter = {
	SHOW_ELEMENT: 1,
	SHOW_TEXT: 4,
	FILTER_ACCEPT: 1,
	FILTER_REJECT: 3,
};

const observers = [];
class MutationObserver {
	constructor(callback) {
		this.callback = callback;
		this.targets = [];
		observers.push(this);
	}
	observe(target, options) {
		this.targets.push({ target, options });
	}
	disconnect() {
		this.targets = [];
	}
	takeRecords() {
		return [];
	}
}

globalThis.document = document;
globalThis.window = window;
globalThis.NodeFilter = NodeFilter;
globalThis.MutationObserver = MutationObserver;
globalThis.localStorage = {
	store: new Map(),
	getItem(key) {
		return this.store.has(key) ? this.store.get(key) : null;
	},
	setItem(key, value) {
		this.store.set(key, String(value));
	},
};
// linkedom 的节点没有 isConnected，补上（真实浏览器里存在）。
Object.defineProperty(window.Node.prototype, "isConnected", {
	get() {
		return true;
	},
	configurable: true,
});

const { activate } = await import("../dist/main.js");

let settingsRows = null;
const cleanups = [];
const context = {
	manifest: { id: "zh-cn-localization" },
	signal: new AbortController().signal,
	cleanup(fn) {
		cleanups.push(fn);
	},
	registerSettings(options) {
		settingsRows = options.rows;
		// 模拟宿主的受控 handle：插件必须把新值发布回来，否则这里永远停在旧值。
		return {
			update(props) {
				if (props && props.rows) settingsRows = props.rows;
			},
			dispose() {},
		};
	},
};

// 计数后缀：宿主把 `7 strands` 拆成 `7` / ` strand` / `s` 三个文本节点，
// 中文没有单复数，译完后那个孤立的 `s` 必须被吞掉（关闭时再还原）。
const plural = document.createElement("span");
plural.id = "plural";
plural.appendChild(document.createTextNode("7"));
plural.appendChild(document.createTextNode(" strand"));
plural.appendChild(document.createTextNode("s"));
document.body.appendChild(plural);

const dispose = activate(context);

const results = [];
function expect(label, actual, expected) {
	const ok = actual === expected;
	results.push({ label, ok, actual, expected });
	if (!ok) console.log(`FAIL ${label}：实际 ${JSON.stringify(actual)}，期望 ${JSON.stringify(expected)}`);
}

const text = (sel) => document.querySelector(sel).textContent;
const attr = (sel, name) => document.querySelector(sel).getAttribute(name);

expect("标题", text("h1"), "设置");
expect("aria-label 属性", attr("button", "aria-label"), "重试激活");
expect("侧栏文案", text("aside span"), "缓存保留");
expect("侧栏第二项", text("aside span:nth-of-type(2)"), "社区插件");
expect("Markdown 正文未动", text(".lh-prose p"), "Settings Settings");
// 正文里的控件例外：它们带的是宿主的界面文案（复制表格按钮），必须译。
expect("正文内按钮属性翻译", attr(".lh-prose button", "aria-label"), "复制表格");
expect("代码块未动", text("code"), "Settings");
expect("streamdown 未动", text('[data-streamdown="code-block"] span'), "Settings");
expect("公式未动", text(".katex"), "Settings");
expect("输入区未动", text('[contenteditable="true"]'), "Settings");
// 输入区自身的 placeholder 是界面文案，要译；svg 的 aria-label 同理，但里面不下潜。
expect("输入区 placeholder", attr('[contenteditable="true"]', "placeholder"), "阅读时的任何想法……");
expect("svg aria-label", attr("svg", "aria-label"), "计划图");
expect("svg 内部未动", text("svg text"), "Settings");
expect("textarea 正文不动", text("textarea"), "");
expect("textarea placeholder 可翻译", attr("textarea", "placeholder"), "设置");
expect("input placeholder", attr("input", "placeholder"), "设置");
expect("input title", attr("input", "title"), "社区插件");
expect("中间点保留", text("body > p"), "拖动平移 · 滚动缩放");
expect("无译文时原样", text("body > p:nth-of-type(2)"), "Untranslated brand LearnHarness stays");
expect("复数后缀被吞", text("#plural"), "7 条线索");

// 增量：模拟 React 往 DOM 里插入新节点后触发 MutationObserver。
const added = document.createElement("section");
added.innerHTML = "<span>Retry activation</span><span>Session Find</span>";
document.body.appendChild(added);
const observer = observers.find((o) => o.targets.length > 0);
const callback = observer.callback;
callback([{ type: "childList", addedNodes: [added], target: document.body }]);
expect("新增节点", added.querySelector("span").textContent, "重试激活");
expect("新增节点（2）", added.querySelector("span:nth-of-type(2)").textContent, "会话查找");

// 字符变化：模拟流式文本重渲染。
const live = document.createElement("span");
live.textContent = "Settings";
document.body.appendChild(live);
callback([{ type: "characterData", target: live.firstChild }]);
expect("字符变更", live.textContent, "设置");

// 关闭插件应还原英文。
const row = () => (settingsRows && settingsRows[0]) || null;
if (row()) {
	row().onChange(false);
	expect("关闭后标题还原", text("h1"), "Settings");
	expect("关闭后属性还原", attr("input", "placeholder"), "Settings");
	expect("关闭后发布的值", row().value, false);
	row().onChange(true);
	expect("再次开启", text("h1"), "设置");
	expect("再次开启后发布的值", row().value, true);
}

if (typeof dispose === "function") dispose();
cleanups.forEach((fn) => fn());
expect("dispose 后还原", text("h1"), "Settings");
expect("dispose 后复数后缀还原", text("#plural"), "7 strands");

const failed = results.filter((r) => !r.ok).length;
console.log(failed === 0 ? `通过：${results.length} 项断言` : `失败：${failed}/${results.length}`);
process.exitCode = failed === 0 ? 0 : 1;