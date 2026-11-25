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

const TABLE = {
	"+ Add a provider": "+ 添加服务商",
	"+ Add override": "+ 添加覆盖版本",
	". Prebuilt packages already contain": "。预构建的包已包含",
	"A sub-agent finished, but its result could not be displayed.": "子代理已完成，但其结果无法显示。",
	"A teacher agent with a memory — sessions, quizzes, and a knowledge graph of what you know.": "一个有记忆的老师型代理 — 会话、测验，以及关于你所掌握知识的知识图谱。",
	"A turn is already running — try again in a moment.": "当前已有回合正在运行 — 请稍后重试。",
	"AGENT’S THINKING": "代理的思考",
	"API key": "API 密钥",
	"Abort failed — try again": "中止失败 — 请重试",
	"Abort this turn?": "中止此回合？",
	"Absolute path or ~/folder": "绝对路径或 ~/文件夹",
	"Accent": "强调色",
	"Account disconnected locally. Remote revocation could not be confirmed.": "账户已在本地断开连接。无法确认远程吊销。",
	"Accuracy": "准确性",
	"Adapt question layout": "适配问题布局",
	"Add a key": "添加密钥",
	"Add a provider key": "添加服务商密钥",
	"Add accounts": "添加账户",
	"Add an optional comment...": "添加可选评论...",
	"Add another account or workspace": "添加其他账户或工作区",
	"Add comment to citation": "为引用添加评论",
	"Add folder": "添加文件夹",
	"Add override": "添加覆盖设置",
	"Agent": "代理",
	"All": "全部",
	"Allow LearnHarness helper agents and automatic follow-ups to use this connection.": "允许 LearnHarness 助手代理和自动跟进使用此连接。",
	"Allow a sign-in tab to open, then try again.": "请允许打开登录标签页，然后重试。",
	"Allow background use": "允许后台使用",
	"Allow reuse of the effective existing key for this URL": "允许为此 URL 复用有效的现有密钥",
	"Allowed folder path": "允许的文件夹路径",
	"Also delete the": "同时删除",
	"Also remove its graph traces": "同时移除其图谱痕迹",
	"Also remove their graph traces": "同时移除它们的图谱痕迹",
	"An error occurred.": "发生错误。",
	"An extraction is running — try again when the activity dock drains.": "提取正在运行 — 请等活动面板清空后重试。",
	"An extraction run is already in flight for this session": "此会话已有提取任务正在进行",
	"An update": "更新",
	"Answer": "回答",
	"Answer or discard the remaining question first.": "请先回答或放弃剩余的问题。",
	"Answered “I don't know”.": "已回答“我不知道”。",
	"Answering": "回答中",
	"Appearance": "外观",
	"Arrowhead size": "箭头大小",
	"Ask": "提问",
	"Ask a side question": "提出追问",
	"Ask a side question about this selection": "对此选中内容提出追问",
	"Ask a side question…": "提出追问…",
	"Ask anything, or press Enter for the next one.": "可询问任何内容，或按 Enter 进入下一项。",
	"Ask, answer, or steer the lesson…": "提问、回答或引导课程…",
	"Attach files": "附加文件",
	"Attach files or a folder": "附加文件或文件夹",
	"Attach your material with the paperclip or drag and drop.": "用回形针附加资料，或拖放文件。",
	"Authentication": "身份验证",
	"Automatic": "自动",
	"Automatic updates": "自动更新",
	"Back to home": "返回首页",
	"Background": "背景色",
	"Background agents": "后台代理",
	"Background colors": "背景颜色",
	"Background job recovery/delivery failed": "后台任务恢复/投递失败",
	"Background work counts toward your ChatGPT plan usage.": "后台工作会计入你的 ChatGPT 计划用量。",
	"Badge color must be a valid CSS color supporting a background tint.": "徽章颜色必须是支持背景着色的有效 CSS 颜色。",
	"Badge text must be a string.": "徽章文字必须是字符串。",
	"Base": "基础",
	"Base URL, e.g. http://localhost:11434/v1": "服务地址，例如 http://localhost:11434/v1",
	"Base ring radius": "基础环半径",
	"Billing is determined by your Claude Code configuration; LearnHarness does not estimate it.": "计费由你的 Claude Code 配置决定；LearnHarness 不做估算。",
	"Bitmap resolution": "位图分辨率",
	"Blur": "模糊",
	"Bold": "粗体",
	"Border": "边框",
	"Broad local source access, except protected locations": "可广泛访问本地资料源，受保护的位置除外",
	"Budget pins do not resize backend context. Blank uses reported limits, then fallback (8192 context / 4096 output). Custom pricing is unknown.": "预算固定值不会改变后端上下文大小。留空则使用上报的上限，再退回兜底值（上下文 8192 / 输出 4096）。自定义价格为未知。",
	"Build a plugin": "构建插件",
	"Button colors": "按钮颜色",
	"CLI billing": "CLI 计费",
	"CMU Serif": "CMU Serif",
	"COLORS": "颜色",
	"COMPACTING CONTEXT…": "正在压缩上下文…",
	"Cache hit rate": "缓存命中率",
	"Cache retention": "缓存保留",
	"Cache: default": "缓存：默认",
	"Cancel": "取消",
	"Canonical read was invalidated.": "规范化读取已失效。",
	"Cards, inputs, sidebar": "卡片、输入框、侧边栏",
	"Central pull": "中心拉力",
	"Chains": "关联链",
	"Chat": "对话",
	"ChatGPT account": "ChatGPT 账户",
	"ChatGPT sign-in is available only in the desktop app. API-key connections remain available here.": "ChatGPT 登录仅在桌面应用中可用。此处仍可使用 API 密钥连接。",
	"Cheap": "经济",
	"Cheap model": "经济模型",
	"Cheap thinking": "经济思考",
	"Check": "检验",
	"Check Pi for new models": "检查 Pi 的新模型",
	"Check again": "重新检查",
	"Check at startup and every 24 hours. Turning this off does not stop updates already in progress or ready to install.": "在启动时检查，并每 24 小时检查一次。关闭此项不会停止已在进行或已就绪待安装的更新。",
	"Check for updates": "检查更新",
	"Check your understanding": "检验你的理解",
	"Checking downloads available updates. Downloaded updates install when you quit the app.": "检查可下载的更新。已下载的更新将在退出应用时安装。",
	"Checking for updates": "正在检查更新",
	"Checking for updates…": "正在检查更新…",
	"Checks installation/version only—not authentication, model access, or quota. Claude Code controls billing.": "仅检查安装与版本 —— 不涉及认证、模型访问或配额。计费由 Claude Code 掌控。",
	"Checks installation/version only—not authentication, model access, or quota. Claude Code controls billing. Requires v": "仅检查安装与版本 —— 不涉及认证、模型访问或配额。计费由 Claude Code 掌控。需要 v",
	"Choose from your installed fonts": "从已安装字体中选择",
	"Choose your AI provider and paste its API key. You’ll pick your models next.": "选择你的 AI 服务商并粘贴其 API 密钥。接下来选择模型。",
	"Chunk threshold": "分块阈值",
	"Cite": "引用",
	"Claude Code": "Claude Code",
	"Clear": "清除",
	"Clone or copy the plugin into the directory below, using its plugin ID as the folder name.": "把插件克隆或复制到下表中的目录，并以插件 ID 作为文件夹名。",
	"Close": "关闭",
	"Close Find": "关闭查找",
	"Close Find (Esc)": "关闭查找（Esc）",
	"Close announcement": "关闭公告",
	"Close chains": "关闭关联链",
	"Close dialog": "关闭对话框",
	"Close settings": "关闭设置",
	"Close setup": "关闭配置",
	"Close side conversation": "关闭侧边对话",
	"Close sidebar": "关闭侧边栏",
	"Cluster label size": "聚类标签大小",
	"Cluster labels": "聚类标签",
	"Cluster pull": "聚类拉力",
	"Code ligatures": "代码连字",
	"Coding questions": "编程题",
	"Collapse": "收起",
	"Colors": "颜色",
	"Comment on selected text": "对选中文字评论",
	"Comments can contain up to 8,000 characters.": "评论最多可包含 8,000 个字符。",
	"Common families — installed fonts could not be read": "常见字体族 — 无法读取已安装字体",
	"Community plugins": "社区插件",
	"Compact session list": "紧凑会话列表",
	"Compacting context": "正在压缩上下文",
	"Compaction threshold": "压缩阈值",
	"Concurrent worker requests": "并发工作请求",
	"Confidence": "置信度",
	"Confidence — the probability your selected answer is correct": "置信度 — 你所选答案正确的概率",
	"Connect": "连接",
	"Connect failed. Check your connection.": "连接失败。请检查网络连接。",
	"Context": "上下文：",
	"Context (last call)": "上下文（上次调用）",
	"Context compacted": "上下文已压缩",
	"Continue": "继续",
	"Continue with ChatGPT": "使用 ChatGPT 继续",
	"Controls the cache-retention preference sent to Pi. Support and duration depend on the provider and model. This does not guarantee a cache hit.": "控制发送给 Pi 的缓存保留偏好。是否支持及持续时间取决于服务商与模型。此项并不保证命中缓存。",
	"Copied": "已复制",
	"Copy Code": "复制代码",
	"Copy code": "复制代码",
	"Copy diagram source": "复制图示源码",
	"Copy equation source": "复制公式源码",
	"Copy link": "复制链接",
	"Copy table": "复制表格",
	"Copy table as CSV": "以 CSV 复制表格",
	"Copy table as Markdown": "以 Markdown 复制表格",
	"Copy table as TSV": "以 TSV 复制表格",
	"Core plugins": "核心插件",
	"Cost": "费用",
	"Could not choose a folder. Try again.": "无法选择文件夹。请重试。",
	"Could not delete sources.": "无法删除资料源。",
	"Could not delete the folder — network error.": "无法删除文件夹 — 网络错误。",
	"Could not load Claude Code settings.": "无法加载 Claude Code 设置。",
	"Could not load dictation language. Try again.": "无法加载语音输入语言。请重试。",
	"Could not open this PDF.": "无法打开此 PDF。",
	"Could not reach the server — try again.": "无法连接到服务器 — 请重试。",
	"Could not read folders.": "无法读取文件夹。",
	"Could not read knowledge graph.": "无法读取知识图谱。",
	"Could not read source organization.": "无法读取资料组织。",
	"Could not refresh session stats.": "无法刷新会话统计。",
	"Could not refresh. Your current catalog is still available.": "无法刷新。当前目录仍可使用。",
	"Could not save Claude Code settings.": "无法保存 Claude Code 设置。",
	"Could not save dictation language. Try again.": "无法保存语音输入语言。请重试。",
	"Could not save source organization.": "无法保存资料组织。",
	"Could not sync the saved session.": "无法同步已保存的会话。",
	"Couldn't delete the override.": "无法删除覆盖设置。",
	"Couldn't load prompt segments.": "无法加载提示词分段。",
	"Couldn't save the override. Your edits are still here.": "无法保存覆盖设置。你的修改仍在这里。",
	"Couldn’t check for updates. Try again later.": "无法检查更新。请稍后再试。",
	"Couldn’t open the session. Your message is still here. Try sending again.": "无法打开会话。你的消息仍在这里，请重新发送。",
	"Courier New": "Courier New",
	"Covered": "已覆盖",
	"Create a": "创建",
	"Custom endpoint": "自定义端点",
	"Custom endpoint API key": "自定义端点 API 密钥",
	"Custom endpoint authentication": "自定义端点认证",
	"Custom endpoint base URL": "自定义端点基础 URL",
	"Custom endpoint model IDs": "自定义端点模型 ID",
	"Cycle thinking level": "切换思考档位",
	"DICTATION": "听写",
	"Day starts at (hour)": "一天从几点开始（小时）",
	"Deepgram API key": "Deepgram API 密钥",
	"Deepgram grant returned no token": "Deepgram 授权未返回 token",
	"Deepgram reconnect failed": "Deepgram 重新连接失败",
	"Deepgram unreachable": "无法连接 Deepgram",
	"Default": "默认",
	"Default Markdown": "默认 Markdown",
	"Delete failed — network error. Try again.": "删除失败 — 网络错误。请重试。",
	"Delete folder": "删除文件夹",
	"Delete folder?": "删除文件夹？",
	"Delete node": "删除节点",
	"Delete nodes and remove empty folders?": "删除节点并移除空文件夹？",
	"Delete override": "删除覆盖设置",
	"Delete selected sources and folders": "删除选中的资料和文件夹",
	"Delete selected sources and folders?": "删除选中的资料和文件夹？",
	"Delete session": "删除会话",
	"Delete session?": "删除会话？",
	"Delete sources": "删除资料",
	"Delete…": "删除…",
	"Demo agent": "演示代理",
	"Demo builder": "演示构建器",
	"Demo completed, but the result could not be displayed.": "演示已完成，但无法显示结果。",
	"Demos": "演示",
	"Depth anchor": "深度锚点",
	"Depth spacing": "深度间距",
	"Depth strength": "深度强度",
	"Desired retention (%)": "目标记忆保持率（%）",
	"Device code:": "设备代码：",
	"Diagram failed to render": "图示渲染失败",
	"Dictate": "语音输入",
	"Dictate side question": "语音输入追问",
	"Dictation": "听写",
	"Dictation is active elsewhere": "其他位置正在使用语音输入",
	"Dictation language unavailable": "听写语言不可用",
	"Dictation transcript could not be applied": "无法应用语音输入文字稿",
	"Dilation": "膨胀",
	"Disabled": "已停用",
	"Discard changes": "放弃更改",
	"Discard this problem?": "放弃这道题目？",
	"Discard unsaved changes?": "放弃未保存的更改？",
	"Disconnect": "断开连接",
	"Disconnect account": "断开账户连接",
	"Disconnect account?": "断开账号？",
	"Disconnect failed.": "断开连接失败。",
	"Disconnect failed. Check your connection.": "断开连接失败。请检查网络连接。",
	"Dismiss": "忽略",
	"Dismiss attachment notice": "关闭附件提示",
	"Dismiss question": "忽略问题",
	"Dismiss this question?": "忽略这个问题？",
	"Dismiss update notification": "忽略更新通知",
	"Dispatched…": "已派发…",
	"Dock side conversation": "停靠侧边对话",
	"Doctrine": "原则",
	"Document conversion requires a File": "文档转换需要文件",
	"Done": "完成",
	"Don’t request caching": "不请求缓存",
	"Download as HTML": "下载为 HTML",
	"Download as SVG": "下载为 SVG",
	"Download authoring skill": "下载编写技能",
	"Download demo as HTML": "将演示下载为 HTML",
	"Download diagram": "下载图示",
	"Download diagram as MMD": "下载 MMD 图示",
	"Download diagram as PNG": "下载 PNG 图示",
	"Download diagram as SVG": "下载 SVG 图示",
	"Download figure as SVG": "将图示下载为 SVG",
	"Download file": "下载文件",
	"Download image": "下载图片",
	"Download table": "下载表格",
	"Download table as CSV": "以 CSV 下载表格",
	"Download table as Markdown": "以 Markdown 下载表格",
	"Download the authoring skill for your coding agent.": "为你的编码代理下载编写技能。",
	"Downloading an update…": "正在下载更新…",
	"Drag to pan · scroll to zoom": "拖动平移 · 滚动缩放",
	"Draw over read-only question references and send your working with learner submissions.": "可在只读的题目参考图上作画，并把你的解题过程随学员提交一起发送。",
	"Drawing Pad": "画板",
	"Drop to attach file paths": "拖放以附加文件路径",
	"EXTERNAL CLI": "外部 CLI",
	"Edge alpha": "边透明度",
	"Edge attraction": "边引力",
	"Edge length": "边长",
	"Edge width": "边宽",
	"Edit citation comment": "编辑引用注释",
	"Edit override": "编辑覆盖版本",
	"Empty folders:": "空文件夹：",
	"Enable Coding questions": "启用「编程题」",
	"Enable Drawing Pad": "启用「画板」",
	"Enable Flashcards": "启用「记忆卡」",
	"Enable Rich code blocks": "启用「增强代码块」",
	"Enable background use": "启用后台使用",
	"Enabled": "已启用",
	"End this background process": "结束后台进程",
	"Enter": "输入",
	"Enter a positive, safely representable whole number.": "请输入一个可安全表示的正整数。",
	"Environment supplies the effective key. Change the environment to replace it.": "生效密钥由环境提供。如需替换，请修改环境。",
	"Error": "错误",
	"Esc to close": "Esc 关闭",
	"Every reasoning chain": "每条推理链",
	"Expand": "展开",
	"Expand diagram": "展开图示",
	"Explain": "讲解",
	"Export JSON": "导出 JSON",
	"Export as Markdown…": "导出为 Markdown…",
	"External CLI": "外部 CLI",
	"Extract": "提取",
	"Extract files into the graph": "将文件提取到图谱中",
	"Extract files…": "提取文件…",
	"Extraction": "抽取",
	"Extraction chunk budget": "提取分块预算",
	"Extraction coverage": "提取覆盖",
	"Failed to attach to the running turn.": "无法附加到正在进行的回合。",
	"Figure": "图示",
	"Figure agent": "图示代理",
	"Figure completed, but the result could not be displayed.": "图示已完成，但无法显示结果。",
	"Figure maker": "图示生成器",
	"File access": "文件访问",
	"Files": "文件",
	"Find": "查找",
	"Find in session": "在会话中查找",
	"Find in session…": "在会话中查找…",
	"Fit diagram to view": "图示适应视图",
	"Fit plan to screen": "计划适应屏幕",
	"Fixed — part of this screen": "固定 — 属于此屏幕的一部分",
	"Flashcards": "记忆卡",
	"Flashcards settings": "记忆卡设置",
	"Float side conversation": "浮动侧边对话",
	"Focus rings, toggles, selection": "焦点环、开关、选中态",
	"Folder": "文件夹",
	"Folder filter": "文件夹筛选",
	"Folder name": "文件夹名称",
	"Folder removal is unavailable.": "无法移除文件夹。",
	"Follow cheap slot": "跟随经济模型",
	"For lessons, attach material to a session instead.": "课程请改为向会话附加资料。",
	"For source projects, follow the repository’s dependency setup and run": "源码项目请按仓库的依赖配置操作，然后运行",
	"Formatting": "格式",
	"Free recall": "自由回忆",
	"Friction": "摩擦",
	"Full": "完整",
	"General": "通用",
	"Generate fact-recall cues from your knowledge graph and review them with FSRS-6. Generation uses your configured model and may incur cost. Native only; no Anki integration.": "从你的知识图谱生成事实回忆线索，并用 FSRS-6 复习。生成会使用你配置的模型，可能产生费用。仅内置实现，不接入 Anki。",
	"Generation chunk budget (estimated tokens)": "生成分块预算（估算 token 数）",
	"Global": "全局",
	"Go to current step": "转到当前步骤",
	"Go to source": "转到资料",
	"Graph": "图谱",
	"Graph context": "图谱上下文",
	"Graph costs — click for details": "图谱开销 — 点击查看详情",
	"Graph display settings": "图谱显示设置",
	"Graph is disabled": "图谱已禁用",
	"Graph pipeline costs": "图谱流程开销",
	"Graph rendering": "图谱渲染",
	"Graph tools": "图谱工具",
	"Graph view": "图谱视图",
	"Hamburgefonstiv 0123 漢字": "Hamburgefonstiv 0123 漢字",
	"Heading weight": "标题字重",
	"Helvetica Neue": "Helvetica Neue",
	"Hide why": "收起原因",
	"Hint rung": "提示层级",
	"Home": "首页",
	"How both tutors check your understanding": "两位老师如何检验你的理解",
	"How much of this session isn't mapped yet": "本次会话还有多少尚未纳入图谱",
	"How to install a plugin": "如何安装插件",
	"I don't know": "我不知道",
	"Icon-only buttons require a nonblank label and icon.": "纯图标按钮需要非空标签和图标。",
	"Image": "图像",
	"Image not available": "图像不可用",
	"Image shown, but it could not be displayed.": "已包含图像，但无法显示。",
	"Image snapshot unavailable": "图像快照不可用",
	"Images": "图片",
	"Import JSON": "导入 JSON",
	"Import request is too large. Select fewer files.": "导入请求过大。请选择更少的文件。",
	"In use:": "使用中：",
	"Include reasoning in token estimates (OpenAI Responses only)": "在 token 估算中计入推理（仅 OpenAI Responses）",
	"Inline code": "行内代码",
	"Input": "输入",
	"Input (streaming)": "输入（流式）",
	"Install and authenticate Claude Code in your terminal, then select a Claude Code model here.": "在终端中安装并验证 Claude Code，然后在此选择 Claude Code 模型。",
	"Interactive demo": "交互演示",
	"Invalid JSON body": "JSON 正文无效",
	"Invalid chatId": "chatId 无效",
	"Invalid import paths": "导入路径无效",
	"Invalid import response. Check the graph before retrying.": "导入响应无效。请检查图谱后重试。",
	"Invalid problem renderer contract versions": "题目渲染器契约版本无效",
	"Invalid problem renderer mount": "题目渲染器挂载无效",
	"Invalid question renderer contract versions": "问题渲染器契约版本无效",
	"Invalid question renderer mount": "问题渲染器挂载无效",
	"Invalid sign-in action.": "登录操作无效。",
	"Invert colors": "反转颜色",
	"Invert demo brightness": "反转演示亮度",
	"Invert figure brightness": "反转图示亮度",
	"Italic": "斜体",
	"JetBrains Mono": "JetBrains Mono",
	"Jobs": "任务",
	"Keep editing": "继续编辑",
	"Keyboard": "键盘",
	"Keyboard shortcuts": "键盘快捷键",
	"Keyless": "无密钥",
	"Knowledge graph": "知识图谱",
	"Label size": "标签大小",
	"Labels until zoom": "缩放前显示标签",
	"Language": "语言",
	"Last extraction": "上次提取",
	"LearnHarness starts it when needed—no background process required.": "LearnHarness 会在需要时启动—无需后台进程。",
	"Learner files": "学员文件",
	"Learning Harness": "Learning Harness",
	"Learning steps (minutes)": "学习间隔（分钟）",
	"Leave blank to keep effective key": "留空则保留当前生效的密钥",
	"Leave the option unset. Pi’s normal behavior and environment override apply.": "保持此项未设置。将沿用 Pi 的常规行为与环境变量覆盖。",
	"Lets the tutor consult your knowledge map between sessions": "让导师在会话之间查阅你的知识图谱",
	"Levels this model actually supports": "该模型实际支持的档位",
	"Loading custom configuration…": "正在加载自定义配置…",
	"Loading fonts…": "正在加载字体…",
	"Loading image…": "正在加载图像…",
	"Loading keys…": "正在加载密钥…",
	"Loading models…": "正在加载模型…",
	"Loading plugin settings…": "正在加载插件设置…",
	"Loading plugins…": "正在加载插件…",
	"Loading plugin…": "正在加载插件…",
	"Loading prompt segments…": "正在加载提示词片段…",
	"Loading settings…": "正在加载设置…",
	"Loading…": "加载中…",
	"Local file paths can only be attached in the desktop app. You can paste a full path instead.": "本地文件路径仅可在桌面应用中附加。你可以改为粘贴完整路径。",
	"Long retention": "长时间保留",
	"M4 4l8 8M12 4l-8 8": "M4 4l8 8M12 4l-8 8",
	"MODEL API KEYS": "模型 API 密钥",
	"MODELS": "模型",
	"Manage ChatGPT account": "管理 ChatGPT 账户",
	"Manage ChatGPT usage": "管理 ChatGPT 用量",
	"Manage usage": "管理用量",
	"Manage…": "管理…",
	"Markdown": "Markdown",
	"Maximum simultaneous background-worker model requests. Direct conversations are not limited.": "后台工作代理的模型请求最大并发数。直接对话不受限制。",
	"Mental model": "心智模型",
	"Message text or images are required. Your input has been kept.": "需要消息文字或图像。你的输入已保留。",
	"MessageBranch components must be used within MessageBranch": "MessageBranch 组件必须在 MessageBranch 内使用",
	"Messages": "消息",
	"Message…": "消息…",
	"Metadata": "元数据",
	"Method": "方法",
	"Microphone input level": "麦克风输入电平",
	"Microphone permission denied": "麦克风权限被拒绝",
	"Miss class": "错因分类",
	"Missing import body": "缺少导入正文",
	"Mode": "模式",
	"Model": "模型",
	"Model API keys": "模型 API 密钥",
	"Model IDs, comma-separated — optional, needed when the endpoint has no /models list": "模型 ID，以逗号分隔 — 可选，当端点没有 /models 列表时需要",
	"Model catalog": "模型目录",
	"Model catalog could not be loaded. Check the connection and retry.": "无法加载模型目录。请检查连接后重试。",
	"Model catalog refresh failed": "模型目录刷新失败",
	"Model catalog updated.": "模型目录已更新。",
	"Model selector": "模型选择器",
	"Model solution": "模型解法",
	"Models": "模型",
	"More plugin actions": "更多插件操作",
	"Move outside folders": "移到文件夹外",
	"Moved on": "已继续",
	"Multilingual": "多语种",
	"Multiple choice": "单选题",
	"Muted text": "次要文字",
	"New practice session": "新建练习会话",
	"New session": "新建会话",
	"New subfolder": "新建子文件夹",
	"Next branch": "下一分支",
	"Next match": "下一个匹配",
	"Next match (Enter)": "下一个匹配（Enter）",
	"Next problem": "下一题",
	"No Core plugins available.": "没有可用的核心插件。",
	"No catalog changes found.": "未发现目录变更。",
	"No community plugins installed.": "未安装社区插件。",
	"No configured providers support catalog refresh.": "已配置的服务商均不支持目录刷新。",
	"No folders contain graph material yet.": "尚无文件夹包含图谱资料。",
	"No image-capable models. Add a provider key with access to a vision model.": "没有支持图片的模型。请添加一个能访问视觉模型的服务商密钥。",
	"No languages match.": "无匹配语言。",
	"No local file paths were available. Drop existing files or folders from your computer.": "没有可用的本地文件路径。请从计算机拖入现有文件或文件夹。",
	"No matching chains.": "无匹配关联链。",
	"No matching nodes.": "无匹配节点。",
	"No messages yet": "暂无消息",
	"No models match.": "无匹配模型。",
	"No newer version was found at the last check.": "上次检查未发现新版本。",
	"No plan in this session yet.": "此会话暂无计划。",
	"No providers match.": "无匹配服务商。",
	"No sessions recorded.": "未记录会话。",
	"No sessions yet.": "暂无会话。",
	"No settings available.": "无可用设置。",
	"No side answer is running": "没有进行中的追问回答",
	"No thinking levels.": "无思考档位。",
	"Node repulsion": "节点斥力",
	"Node size": "节点大小",
	"Not found": "未找到",
	"OCR not supported yet.": "尚不支持 OCR。",
	"Off": "关闭",
	"Off = home shows the chains view": "关闭 = 首页只显示链条视图",
	"Off = the graph stops growing": "关闭 = 图谱停止增长",
	"On": "开启",
	"Only enable plugins you trust. Plugins run trusted local code with broad file and network access; they are not sandboxed. A broken plugin may require restarting LearnHarness.": "只启用你信任的插件。插件运行的是受信任的本地代码，拥有广泛的文件与网络访问权限，且不受沙箱限制。插件出故障时可能需要重启 LearnHarness。",
	"Only listed folders and subfolders.": "仅限已列出的文件夹和子文件夹。",
	"Open": "打开",
	"Open a chat to attach file paths.": "打开一个会话以附加文件路径。",
	"Open browser": "打开浏览器",
	"Open figure fullscreen": "全屏打开图示",
	"Open full-screen": "全屏打开",
	"Open fullscreen": "全屏打开",
	"Open image fullscreen": "全屏打开图片",
	"Open session →": "打开会话 →",
	"Open settings": "打开设置",
	"Open side conversation": "打开侧边对话",
	"Open sidebar": "打开侧边栏",
	"Open submitted image fullscreen": "全屏打开提交的图片",
	"Open the full plan": "打开完整计划",
	"OpenAI privacy": "OpenAI 隐私",
	"Operation aborted": "操作已中止",
	"Outcome": "结果",
	"Output": "输出",
	"Override Markdown": "覆盖 Markdown",
	"Override saved, but it couldn't be put in use. Retry activation below.": "覆盖设置已保存，但未能启用。请在下方重试激活。",
	"PDF failed": "PDF 失败",
	"PDF reader": "PDF 阅读器",
	"PDF reading completed, but the result could not be displayed.": "PDF 读取已完成，但结果无法显示。",
	"Pass Pi’s native long preference. Cache-write costs may be higher.": "采用 Pi 原生的长时间偏好。缓存写入成本可能更高。",
	"Pass Pi’s native none preference. Providers may still cache automatically.": "传入 Pi 的原生 none 偏好。服务商仍可能自动缓存。",
	"Pass Pi’s native short preference. The duration depends on the provider and model.": "采用 Pi 原生的短时间偏好。持续时间取决于服务商与模型。",
	"Paste key…": "粘贴密钥…",
	"Physics": "物理",
	"Pi default": "Pi 默认",
	"Pick a model first.": "请先选择模型。",
	"Pick a model…": "选择模型…",
	"Pick a provider…": "选择服务商…",
	"Pick nodes": "选择节点",
	"Pick nodes from your knowledge graph, describe what you want to practice, or bring your own problem.": "从知识图谱中选择节点，描述你想练习的内容，或自带题目。",
	"Pick the model for each tier. All three are required before chats can start.": "为每个档位选择模型。三项全部设置后才能开始会话。",
	"Pin to side": "固定到侧边",
	"Plan": "计划",
	"Plan diagram": "计划图",
	"Planning": "规划",
	"Plugin UI callback failed": "插件 UI 回调失败",
	"Plugin UI failed": "插件 UI 失败",
	"Plugin UI host is unavailable": "插件 UI 宿主不可用",
	"Plugin graph actions": "插件图谱操作",
	"Plugin is no longer active": "插件已不再启用",
	"Plugin module loader could not be loaded": "无法加载插件模块加载器",
	"Plugin module loader did not initialize": "插件模块加载器未初始化",
	"Plugin placement must reference a registered action": "插件放置必须引用已注册的操作",
	"Plugin settings": "插件设置",
	"Plugin settings are already registered": "插件设置已注册",
	"Plugin settings could not be loaded.": "无法加载插件设置。",
	"Plugin stylesheet could not be loaded": "无法加载插件样式表",
	"Plugin worker": "插件工作进程",
	"Plugins directory": "插件目录",
	"Practice": "练习",
	"Practice session": "练习会话",
	"Prediction": "预测",
	"Predictions": "预测",
	"Preparing problem…": "正在准备题目…",
	"Preparing question…": "正在准备问题…",
	"Press keys…": "请按键…",
	"Preview": "预览",
	"Previous branch": "上一分支",
	"Previous match": "上一个匹配",
	"Previous match (Shift+Enter)": "上一个匹配（Shift+Enter）",
	"Price unavailable": "价格不可用",
	"Probe": "探查",
	"Probe assessment": "探查评估",
	"Probe doctrine": "探测原则",
	"Prober": "探测代理",
	"Prober, teacher": "Prober、Teacher",
	"Problem": "题目",
	"Problem dismissed.": "题目已忽略。",
	"Problem unavailable": "题目不可用",
	"Problem waiting": "题目待答",
	"Prompt display": "提示词显示",
	"Provider": "服务商",
	"Providers": "服务商",
	"Question": "提问",
	"Question dismissed": "问题已忽略",
	"Question principles": "问题原则",
	"Question tools": "问题工具",
	"Question unavailable": "问题不可用",
	"Quizzing": "测验中",
	"Quizzing mechanics": "测验机制",
	"Radial (outward)": "放射状（向外）",
	"Reading font": "阅读字体",
	"Reading font size": "正文阅读字号",
	"Reasoning components must be used within Reasoning": "推理组件必须在 Reasoning 内使用",
	"Reasoning effort: Not supported": "推理强度：不支持",
	"Reasoning effort: Supported": "推理强度：支持",
	"Reasoning effort: Use reported": "推理强度：使用上报值",
	"Reasoning support is a capability declaration. The effort picker’s Off may not disable a custom backend’s default thinking.": "推理支持属于能力声明。即使把推理力度设为关闭，也未必能停掉自定义后端的默认思考。",
	"Rebind": "重新绑定",
	"Recall": "回顾",
	"Refresh model catalog": "刷新模型目录",
	"Refresh plugins": "刷新插件",
	"Refresh the list, then enable the plugin. New plugins are disabled by default.": "刷新列表，然后启用插件。新插件默认是停用的。",
	"Regions": "区域",
	"Relearning steps (minutes)": "重学间隔（分钟）",
	"Release notes": "发行说明",
	"Reload configuration": "重新加载配置",
	"Remove": "移除",
	"Rename": "重命名",
	"Rename session": "重命名会话",
	"Rename this session": "重命名此会话",
	"Rendered Markdown": "渲染后的 Markdown",
	"Rendering diagram…": "正在渲染图示…",
	"Requests a replacement from the model.": "请求模型重新生成。",
	"Research": "调研",
	"Research agent": "研究代理",
	"Research brief": "研究简报",
	"Research completed, but the result could not be displayed.": "调研已完成，但结果无法显示。",
	"Research failed": "调研失败",
	"Researcher, demo builder, extractor, auditor": "研究、演示构建、抽取、审计",
	"Reset": "重置",
	"Reset all": "全部重置",
	"Reset all to defaults": "全部重置为默认",
	"Restart": "重启",
	"Restart LearnHarness after changing loaded code. Preserve": "改动已加载的代码后请重启 LearnHarness。更新时请保留",
	"Restrict to listed folders": "限制为已列出的文件夹",
	"Restricted: no folders allowed. Add a folder to enable access.": "已受限：不允许文件夹。添加文件夹以启用访问。",
	"Result formatting failed:": "结果格式化失败：",
	"Retest": "重新测试",
	"Retry": "重试",
	"Retry activation": "重试激活",
	"Retry answer": "重试回答",
	"Retry it or send a message to continue.": "重试，或发送消息以继续。",
	"Retry question": "重试问题",
	"Retry syncing": "重试同步",
	"Retrying…": "正在重试…",
	"Rich code blocks": "增强代码块",
	"Runs every agent of this tier": "运行此档位下的每个代理",
	"SEARCH": "搜索",
	"SYSTEM PROMPTS": "系统提示词",
	"Save": "保存",
	"Save and activate": "保存并激活",
	"Save failed. Check your connection and try again.": "保存失败。请检查网络连接后重试。",
	"Save failed. Check your connection.": "保存失败。请检查网络连接。",
	"Save key": "保存密钥",
	"Save limits": "保存限额",
	"Save models": "保存模型",
	"Saved ChatGPT account": "已保存的 ChatGPT 账户",
	"Saving…": "保存中…",
	"Search": "搜索",
	"Search dictation languages": "搜索语音输入语言",
	"Search engine": "搜索引擎",
	"Search fonts…": "搜索字体…",
	"Search languages…": "搜索语言…",
	"Search models…": "搜索模型…",
	"Search nodes": "搜索节点",
	"Search nodes…": "搜索节点…",
	"Search providers…": "搜索服务商…",
	"Search sessions": "搜索会话",
	"Search…": "搜索…",
	"Selection actions": "选择操作",
	"Select…": "选择…",
	"Send": "发送",
	"Send side question": "发送追问",
	"Send to teacher": "发送给老师",
	"Session Find": "会话查找",
	"Session names in serif": "会话名使用衬线体",
	"Session stats": "会话统计",
	"Session title": "会话标题",
	"Sessions": "会话",
	"Set up models": "设置模型",
	"Set up your models": "配置你的模型",
	"Settings": "设置",
	"Settings could not be loaded — refresh to retry.": "无法加载设置 — 请刷新后重试。",
	"Settings for Flashcards": "「记忆卡」的设置",
	"Settings is still saving. Try deleting the override again after the save finishes.": "设置仍在保存中。请在保存完成后再次尝试删除覆盖设置。",
	"Settings sections": "设置分区",
	"Setup ↗": "配置 ↗",
	"Shared": "共享",
	"Short retention": "短时间保留",
	"Shortcut cheat sheet": "快捷键速查表",
	"Shorten selection": "缩短所选内容",
	"Show advanced settings": "显示高级设置",
	"Show all": "显示全部",
	"Show diagram source": "显示图示源码",
	"Show folders": "显示文件夹",
	"Show in the lesson": "在课程中显示",
	"Show the quoted tutor text": "显示被引用的老师原文",
	"Side conversations": "侧边对话",
	"Side question": "追问",
	"Sign in again": "重新登录",
	"Sign-in did not complete. Try connecting again.": "登录未完成。请重新连接。",
	"Skipped — the teacher moves on without it.": "已跳过 — 老师将继续，不再处理。",
	"Solved with hints": "借助提示解出",
	"Some dropped items had no available file path.": "部分拖入的项目没有可用的文件路径。",
	"Something went wrong:": "出错了：",
	"Source Sans 3": "Source Sans 3",
	"Source or folder name": "资料或文件夹名称",
	"Sources": "资料",
	"Start a conversation to see messages here": "开始会话后即可在此查看消息",
	"Start a session to begin learning.": "开始会话即可开始学习。",
	"Start dictation": "开始语音输入",
	"Start session": "开始会话",
	"Start side dictation": "开始追问语音输入",
	"Static chemical structures, musical notation and technical diagrams from SMILES, ABC and TikZ code blocks.": "从 SMILES、ABC、TikZ 代码块渲染静态化学结构、乐谱与技术图解。",
	"Status": "状态",
	"Steps": "步骤",
	"Stop": "停止",
	"Stop dictation": "停止语音输入",
	"Stop dictation (Esc)": "停止听写 (Esc)",
	"Stop side answer": "停止追问回答",
	"Stop side dictation": "停止追问语音输入",
	"Stopped": "已停止",
	"Stored on this device": "存储在此设备上",
	"Stored on this device (lh:keymap) — overrides only.": "仅保存在本机（lh:keymap）—— 只记录覆盖项。",
	"Strong": "强力",
	"Strong model": "强力模型",
	"Strong thinking": "强力思考",
	"Strong tier — the default for new sessions": "强档 — 新会话的默认档位",
	"Submission preparation canceled": "提交准备已取消",
	"Submit answer": "提交答案",
	"Submit thinking": "提交思考",
	"Submitted image": "已提交的图片",
	"Subscription connection": "订阅连接",
	"Subscription sign-in requires the desktop app's private server connection. API-key connections remain available here.": "订阅登录需要桌面应用的私有服务器连接。此处仍可使用 API 密钥连接。",
	"Subscription status is unavailable.": "订阅状态不可用。",
	"Subscriptions": "订阅",
	"Success": "成功",
	"Surface": "表面色",
	"System prompt": "系统提示词",
	"System prompts": "系统提示词",
	"TOOLS": "工具",
	"Targets": "目标",
	"Task details": "任务详情",
	"Teach": "教学",
	"Teacher": "老师",
	"Teaching": "教学",
	"Teaching questions and coding practice with syntax highlighting and automatic tests using your installed tools. Runs local code with your user permissions; not sandboxed.": "带语法高亮的教学提问与编程练习，并调用你已安装的工具自动运行测试。以你的用户权限运行本地代码，不受沙箱限制。",
	"Text": "文本",
	"The ChatGPT connection could not be changed. Try again.": "无法更改 ChatGPT 连接。请重试。",
	"The answer:": "答案：",
	"The assessment was malformed — the prober retried with a corrected one.": "评估格式有误 — 探测代理已用修正后的版本重试。",
	"The assistants that draw and read PDFs": "负责绘图与读取 PDF 的助手",
	"The assistants that research, build demos, and grade your work": "负责研究、构建演示与批改作业的助手",
	"The connection could not be changed. Try again.": "无法更改该连接。请重试。",
	"The connection dropped before the turn completed.": "连接在回合完成前中断了。",
	"The desktop connection is unavailable. Retry when the app is ready.": "桌面连接不可用。请在应用就绪后重试。",
	"The dismissal failed.": "忽略操作失败。",
	"The full plan": "完整计划",
	"The live submission target changed. Your input has been kept.": "实时提交目标已变更。你的输入已保留。",
	"The main model for your sessions": "会话使用的主模型",
	"The partial answer stays in the transcript.": "部分答案会留在文字稿中。",
	"The plan": "计划",
	"The probability your selected answer is correct — 50% is a coin flip. Adjust with ←/→.": "你所选答案正确的概率 — 50% 相当于抛硬币。使用 ←/→ 调整。",
	"The problem is dropped — no solution is revealed.": "题目已放弃 — 不会显示解答。",
	"The side answer disconnected. Reopen the conversation to reconnect.": "追问回答已断开。重新打开会话即可重新连接。",
	"The side answer failed.": "追问回答失败。",
	"The side answer had no response stream.": "追问回答没有响应流。",
	"The sign-in tab was closed. Cancel and try again.": "登录标签页已关闭。请取消后重试。",
	"The subscription connection could not be changed.": "无法更改订阅连接。",
	"The teacher will open by probing what you already know.": "老师会先探测你已掌握的内容来开场。",
	"The turn stream body is empty.": "回合流内容为空。",
	"Theme": "主题",
	"Thinking": "思考",
	"Thinking text or images are required. Your input has been kept.": "需要思考文本或图片。你的输入已保留。",
	"Thinking while reading": "阅读时思考",
	"Thinking...": "思考中...",
	"This demo threw an error": "此演示抛出错误",
	"This file type isn't supported. Use text, Markdown, or PDF.": "不支持此文件类型。请使用文本、Markdown 或 PDF。",
	"This folder changed. Nothing was deleted.": "此文件夹已变更。未删除任何内容。",
	"This permanently deletes the node — this cannot be undone.": "这会永久删除该节点 — 无法撤销。",
	"This plugin view is not available.": "此插件视图不可用。",
	"This question could not be displayed.": "此问题无法显示。",
	"This session view is no longer active.": "此会话视图已不再活跃。",
	"This session's model": "此会话的模型",
	"This teaching segment and its question.": "此教学片段及其问题。",
	"Times New Roman": "Times New Roman",
	"Toggle all your thinking": "显示或隐藏全部思考",
	"Toggle dictation": "开关听写",
	"Toggle sessions sidebar": "开关会话侧栏",
	"Too big. Max 25 MB.": "文件过大。最大 25 MB。",
	"Too long. Max 1,000 pages.": "内容过长。最多 1,000 页。",
	"Tool: demo": "工具：演示",
	"Tool: pdf": "工具：PDF",
	"Tool: research": "工具：研究",
	"Tool: visual": "工具：图示",
	"Tools": "工具",
	"Tooltip parts require Tooltip": "Tooltip 部件需要 Tooltip",
	"Tooltip requires TooltipProvider": "Tooltip 需要 TooltipProvider",
	"Total cost": "总费用",
	"Total running cost (inferred)": "累计运行费用（推算）",
	"Transcript width": "对话栏宽度",
	"Trebuchet MS": "Trebuchet MS",
	"Tree column width must be a finite nonnegative number or a nonblank CSS width string.": "树列宽度必须为有限的非负数或非空的 CSS 宽度字符串。",
	"Try again": "重试",
	"Turns": "回合",
	"Type your answer…": "输入你的答案…",
	"Type your own answer…": "输入你自己的答案…",
	"Typography": "排版",
	"USD per 1M tokens in/out": "每百万 token 输入/输出的美元价格",
	"Unable to inspect effective key. Reload configuration and retry.": "无法检查生效的密钥。请重新加载配置后重试。",
	"Unable to load custom configuration.": "无法加载自定义配置。",
	"Unchecked, conversations stay in their current folders and can be extracted again. Either way, their graph contributions and extraction coverage are cleared. Checking this also permanently deletes their messages and background jobs.": "不勾选时，对话会留在原有文件夹中，仍可再次抽取。无论勾选与否，它们对图谱的贡献与抽取覆盖记录都会被清除。勾选还会永久删除这些对话的消息与后台任务。",
	"Uncovered": "未覆盖",
	"Unknown chat": "未知对话",
	"Unknown side thread": "未知追问线程",
	"Unpin to float": "取消固定以浮动",
	"Unpriced turns": "未计价回合",
	"Untitled session": "无标题会话",
	"Use a Mod/Alt chord or function key. Escape, Tab and Enter are reserved.": "请使用 Mod/Alt 组合键或功能键。Escape、Tab 和 Enter 为保留键。",
	"Use saved output-token usage to account for replayed reasoning on matching OpenAI Responses models. Off uses the original text-based estimate.": "使用已保存的输出 token 用量，折算匹配的 OpenAI Responses 模型上重放的推理。关闭时改用原本基于文本的估算。",
	"Use the switch to choose between the default and your saved override.": "使用开关在默认值和你保存的覆盖设置之间切换。",
	"Use your override instead of the default": "用你的覆盖版本替换默认版本",
	"Used by Teacher and Prober": "供 Teacher 与 Prober 使用",
	"Used by Teacher, Prober and Practice": "供 Teacher、Prober 与 Practice 使用",
	"Value is outside the allowed range.": "值超出允许范围。",
	"Verify AI claims independently—they may be inaccurate, incomplete, misleading, or outdated.": "请独立核实 AI 的说法 —— 它们可能不准确、不完整、有误导性或已过时。",
	"Version could not be checked": "无法检查版本",
	"Vertical (up)": "纵向（向上）",
	"View default": "查看默认版本",
	"Vision": "视觉",
	"Vision model": "视觉模型",
	"Vision thinking": "视觉思考",
	"Visual maker + PDF reader": "图示生成 + PDF 阅读",
	"Vocabulary": "词汇表",
	"Voice": "语音",
	"Waiting for browser sign-in…": "等待浏览器登录…",
	"Waiting for input": "等待输入",
	"Warning": "警告",
	"What do you want to learn?": "你想学什么？",
	"What do you want to practice?": "你想练习什么？",
	"Whatever comes to mind as you read.": "阅读时的任何想法……",
	"Why": "原因",
	"Why this answer? Whatever comes to mind.": "为什么是这个答案？想到什么就写什么。",
	"Why:": "原因：",
	"Work here, think out loud.": "在此工作，边想边说。",
	"Working": "处理中",
	"Working…": "正在工作…",
	"Writing the assessment…": "正在撰写评估…",
	"YOUR THINKING": "你的思考",
	"You": "你",
	"Your input has been kept.": "你的输入已保留。",
	"Your installed fonts": "你已安装的字体",
	"Your thinking": "你的思考",
	"Your version": "你的版本",
	"Zoom in": "放大",
	"Zoom out": "缩小",
	"aborted by the learner": "已由学习者中止",
	"accent hex": "强调色十六进制值",
	"and need no build.": "，无需构建。",
	"auto update": "自动更新",
	"background hex": "背景色十六进制值",
	"beside": "与",
	"body must be JSON": "body 必须是 JSON",
	"bold hex": "粗体色十六进制值",
	"border hex": "边框色十六进制值",
	"compaction threshold": "压缩阈值",
	"complete": "完成",
	"contents of": "的内容",
	"correct": "正确",
	"create a new practice session": "创建新的练习会话",
	"create a new teaching session": "创建新的教学会话",
	"custom": "自定义",
	"dark": "深色",
	"didn't know": "不知道",
	"dispatched": "已派发",
	"error hex": "错误色十六进制值",
	"extracting…": "正在提取…",
	"extraction chunk budget": "提取分块预算",
	"extraction enabled": "已启用提取",
	"failed": "失败",
	"file that isn't": "不是…的文件",
	"files with names": "有名称的文件",
	"find": "查找",
	"finished": "已完成",
	"from the machine running LearnHarness": "来自运行 LearnHarness 的机器",
	"from this lesson": "来自本课程",
	"fully extracted": "已完全提取",
	"graph rendering enabled": "已启用图谱渲染",
	"graph tools": "图谱工具",
	"grep": "搜索",
	"heading weight": "标题字重",
	"hide brief": "收起简报",
	"high": "高",
	"href ?": "href ？",
	"imported notes": "已导入笔记",
	"imported notes files": "已导入笔记文件",
	"incorrect": "错误",
	"inline code hex": "行内代码色十六进制值",
	"interactive demo": "交互演示",
	"italic hex": "斜体色十六进制值",
	"just now": "刚刚",
	"key ↗": "密钥 ↗",
	"light": "浅色",
	"list_propositions": "命题列表",
	"list_sessions": "会话列表",
	"live — statuses derive from your check outcomes": "实时 — 状态源自你的检查结果",
	"low": "低",
	"ls": "列目录",
	"max": "最大",
	"medium": "中",
	"mic unavailable": "麦克风不可用",
	"minimal": "最低",
	"muted text hex": "次要文字色十六进制值",
	"name · mode · colors": "名称 · 模式 · 颜色",
	"needs a provider key": "需要服务商密钥",
	"needs model setup": "需要配置模型",
	"no extension": "无扩展名",
	"no files": "无文件",
	"no live turn to steer": "没有可引导的进行中回合",
	"noopener noreferrer": "noopener noreferrer",
	"not set": "未设置",
	"npm run build": "npm run build",
	"off": "关",
	"on the machine running LearnHarness": "在运行 LearnHarness 的机器上",
	"overrides on top of the theme, kept when you switch": "在主题之上叠加的颜色覆盖，切换主题时仍保留",
	"prose font size": "正文字号",
	"read": "读取",
	"reading complete": "读取完成",
	"rename failed:": "重命名失败：",
	"running…": "运行中…",
	"session names serif": "会话名称衬线字体",
	"sets every color below": "设定下方所有颜色",
	"settings unavailable": "设置不可用",
	"settings write failed": "设置写入失败",
	"source": "份资料",
	"sources": "份资料",
	"step must be positive": "步长必须为正数",
	"strand": "条线索",
	"strands": "条线索",
	"success hex": "成功色十六进制值",
	"surface hex": "表面色十六进制值",
	"teaching sessions": "教学会话",
	"text hex": "正文色十六进制值",
	"token unavailable": "token 不可用",
	"unknown chat": "未知对话",
	"unknown error": "未知错误",
	"unlabeled": "未命名",
	"view brief": "查看简报",
	"viewportMaxHeight : questionMaxHeight": "viewportMaxHeight : questionMaxHeight",
	"warning hex": "警告色十六进制值",
	"when updating.": "并保持原样。",
	"with the Member role or higher, then add it above.": "拥有“成员”角色或更高权限，然后在上面添加。",
	"xhigh": "极高",
	"· no key": "· 无密钥",
	"· no model": "· 未选择模型",
	"· overrides on top of the theme, kept when you switch": "· 在主题之上覆盖，切换主题时保留",
	"· sets every color below": "· 设置下方所有颜色",
	"— restart to finish installing.": "— 重启以完成安装。",
	"— skipped": "— 已跳过",
	"↵ submits · ⇧↵ newline": "↵ 提交 · ⇧↵ 换行",
	"✓ key": "✓ 密钥"
};

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
	[/^Requires v(.+)$/, "需要 v$1"],
	[/^Tool: (.+)$/, "工具：$1"],
];

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