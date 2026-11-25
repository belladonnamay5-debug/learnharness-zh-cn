/**
 * 简体中文汉化插件（LearnHarness）
 *
 * LearnHarness 本身没有 i18n 层，界面文案是各个 React 组件里硬编码的英文字面量，
 * 插件无法改写宿主的组件代码，所以这里走「运行时 DOM 文案替换」：
 * 激活后扫描已渲染的文本节点与可访问性属性，命中翻译表就换成简体中文，
 * 并用 MutationObserver 跟进后续的重新渲染与新增内容。
 *
 * 不翻译（避免污染学习内容与代码）：
 *   .lh-prose            —— Markdown 正文（用户/模型内容、题目、图示）
 *   [data-streamdown]    —— Markdown 渲染器的行内代码/代码块/表格
 *   code/pre/kbd/samp/var、.katex、svg、math
 *   textarea、[contenteditable=true] —— 输入区
 *   [data-zh-skip]、[translate=no]
 */

const TABLE = /*@TABLE@*/{};

const RULES = /*@RULES@*/[];

const STORAGE_KEY = "zh-cn-localization:enabled";

const SKIP_TEXT = [
	".lh-prose",
	"[data-streamdown]",
	"code",
	"pre",
	"kbd",
	"samp",
	"var",
	"script",
	"style",
	"textarea",
	"svg",
	"math",
	".katex",
	"[contenteditable=true]",
	"[data-zh-skip]",
	"[translate=no]",
].join(",");

/**
 * 属性扫描的剪枝规则。比 SKIP_TEXT 宽松：正文（.lh-prose）、Markdown 渲染器外壳、
 * textarea 里的**属性**是宿主自己的界面文案（复制表格、计划图、笔记占位符），要译。
 */
const SKIP_ATTRS = [
	"code",
	"pre",
	"kbd",
	"samp",
	"var",
	"script",
	"style",
	"math",
	".katex",
	"[data-zh-skip]",
	"[translate=no]",
].join(",");

/**
 * 只译元素自己、不下潜的容器：`<svg aria-label="Plan diagram">` 这类图标按钮的
 * 无障碍名称是界面文案，但 svg 内部不该继续扫（图形标注属于内容）；contenteditable
 * 输入区的 placeholder 同理，里面的正文则由 SKIP_TEXT 挡住。
 */
const OPAQUE_ATTRS = ["svg", "math", ".katex", "[contenteditable=true]"].join(",");

/** 需要翻译的 DOM 属性：aria-label/title 等来自源码里的硬编码文案，data-placeholder 是输入框占位符。 */
const ATTRS = ["placeholder", "title", "aria-label", "alt", "aria-description", "data-placeholder"];

const ATTR_SELECTOR = ATTRS.map((name) => `[${name}]`).join(",");

/** 查表：先精确匹配（去首尾空白），再走带变量的兜底规则。 */
function lookup(key) {
	if (!key) return null;
	if (Object.prototype.hasOwnProperty.call(TABLE, key)) return TABLE[key];
	for (const [pattern, replacement] of RULES) {
		if (pattern.test(key)) return key.replace(pattern, replacement);
	}
	return null;
}

/** 宿主把状态和时长拼成一行时用的分隔符，例如 `Waiting for input · 33m ago`。 */
const SEGMENT_SEP = " · ";

export function translateText(text) {
	if (!text) return null;
	const key = text.trim();
	if (!key) return null;
	const direct = lookup(key);
	if (direct) return direct;
	// 组合行：整串不在表里时按 ` · ` 切段，逐段查表再拼回，只要译出过一段就算命中。
	if (key.includes(SEGMENT_SEP)) {
		let translated = false;
		const parts = key.split(SEGMENT_SEP).map((part) => {
			const hit = lookup(part.trim());
			if (hit && hit !== part.trim()) translated = true;
			return hit ?? part;
		});
		if (translated) return parts.join(SEGMENT_SEP);
	}
	return null;
}

export function activate(context) {
	// 记录「改了什么」，关闭插件时用于还原。
	const appliedText = new WeakMap();
	const appliedAttr = new WeakMap();

	let enabled = readEnabled();
	let observer = null;
	let sweepTimer = null;
	let started = false;

	function readEnabled() {
		try {
			return localStorage.getItem(STORAGE_KEY) !== "false";
		} catch {
			return true;
		}
	}

	function persistEnabled(value) {
		try {
			localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
		} catch {
			/* 隐私模式下写不进去也不影响本次会话 */
		}
	}

	/**
	 * 中文没有单复数。宿主把 `7 strands` 拆成 `7` / ` strand` / `s` 三个文本节点，
	 * 名词译成中文后，紧跟其后的英文复数后缀就成了孤零零的 `s`，这里把它丢掉。
	 * 只在「前一个文本节点确实被本插件译过、且现在以中文结尾」时生效，避免误删正文。
	 */
	function isDanglingPlural(node, core) {
		if (core !== "s" && core !== "es") return false;
		const prev = node.previousSibling;
		if (!prev || prev.nodeType !== 3 || !appliedText.has(prev)) return false;
		return /[\u3400-\u9fff]$/.test(prev.data);
	}

	function applyText(node) {
		if (!node.isConnected) return;
		const parent = node.parentElement;
		if (parent && parent.closest(SKIP_TEXT)) return;
		const data = node.data;
		if (!data || !data.trim()) return;
		const leading = /^\s*/.exec(data)[0];
		const trailing = /\s*$/.exec(data)[0];
		const core = data.slice(leading.length, data.length - trailing.length);
		if (isDanglingPlural(node, core)) {
			appliedText.set(node, { en: data, zh: leading + trailing });
			node.data = leading + trailing;
			return;
		}
		const translated = translateText(core);
		if (!translated || translated === core) return;
		const next = leading + translated + trailing;
		appliedText.set(node, { en: data, zh: next });
		node.data = next;
	}

	function applyAttrs(el) {
		if (!el || el.nodeType !== 1 || !el.getAttribute) return;
		for (const name of ATTRS) {
			const value = el.getAttribute(name);
			if (!value) continue;
			const translated = translateText(value);
			if (!translated || translated === value) continue;
			let record = appliedAttr.get(el);
			if (!record) {
				record = Object.create(null);
				appliedAttr.set(el, record);
			}
			record[name] = { en: value, zh: translated };
			el.setAttribute(name, translated);
		}
	}

	/** 只扫属性的遍历：允许下潜到正文里，因为那里的按钮/输入框带的是界面文案。 */
	function walkAttrs(node) {
		if (!node || node.nodeType !== 1) return;
		applyAttrs(node);
		// 硬跳过：这些是内容，自己的属性也不动。
		if (node.matches(SKIP_ATTRS)) return;
		// 只译自身（svg 的 aria-label 是界面文案），内部不再下潜。
		if (node.matches(OPAQUE_ATTRS)) return;
		for (let child = node.firstElementChild; child; child = child.nextElementSibling) walkAttrs(child);
	}

	function sweep(root) {
		if (!root) return;
		if (root.nodeType === 3) {
			applyText(root);
			return;
		}
		if (root.nodeType !== 1) return;
		walkAttrs(root);
		if (root.matches(SKIP_TEXT)) return;
		// 过滤器只负责剪枝，替换动作放在遍历循环里（避免依赖引擎是否执行过滤器回调）。
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
			acceptNode(node) {
				if (node.nodeType === 1 && node.matches(SKIP_TEXT)) return NodeFilter.FILTER_REJECT;
				return NodeFilter.FILTER_ACCEPT;
			},
		});
		for (let node = walker.nextNode(); node; node = walker.nextNode()) {
			if (node.nodeType === 3) applyText(node);
		}
	}

	function onMutations(records) {
		for (const record of records) {
			if (record.type === "characterData") {
				applyText(record.target);
			} else if (record.type === "attributes") {
				applyAttrs(record.target);
			} else if (record.type === "childList") {
				for (const node of record.addedNodes) sweep(node);
			}
		}
	}

	function revert() {
		if (!document.body) return;
		const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
		while (walker.nextNode()) {
			const node = walker.currentNode;
			const record = appliedText.get(node);
			if (record && node.data === record.zh) node.data = record.en;
		}
		for (const el of document.querySelectorAll(ATTR_SELECTOR)) {
			const record = appliedAttr.get(el);
			if (!record) continue;
			for (const name of Object.keys(record)) {
				if (el.getAttribute(name) === record[name].zh) el.setAttribute(name, record[name].en);
			}
		}
	}

	function start() {
		if (started || !document.body) return;
		started = true;
		sweep(document.body);
		observer = new MutationObserver(onMutations);
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ATTRS,
		});
		// 兜底：某些内容（virtual list、content-visibility 回收）可能漏掉一次变更，定期补扫。
		sweepTimer = window.setInterval(() => {
			if (!document.body || document.hidden) return;
			sweep(document.body);
		}, 3000);
	}

	function stop() {
		if (!started) return;
		started = false;
		if (observer) {
			observer.disconnect();
			observer = null;
		}
		if (sweepTimer !== null) {
			window.clearInterval(sweepTimer);
			sweepTimer = null;
		}
		revert();
	}

	function setEnabled(value) {
		enabled = Boolean(value);
		persistEnabled(enabled);
		if (enabled) start();
		else stop();
	}

	if (enabled) start();

	context.cleanup(() => stop());

	if (typeof context.onResync === "function") {
		const off = context.onResync(() => {
			if (enabled) sweep(document.body);
		});
		context.cleanup(off);
	}

	// 行式设置是受控的：宿主不替你保存，切换后必须用返回的 handle 把新值发布回去，
	// 否则开关的显示值会停在首次渲染的 true，再点一次仍算出 false。
	const schema = (value) => ({
		rows: [
			{
				type: "toggle",
				key: "enabled",
				label: "启用简体中文界面",
				description: "把界面上的英文文案实时替换为简体中文。学习内容、代码块、公式与输入框不会被改动。",
				value,
				onChange: (next) => {
					setEnabled(next);
					handle.update(schema(next));
				},
			},
		],
	});
	const handle = context.registerSettings(schema(enabled));

	return () => stop();
}