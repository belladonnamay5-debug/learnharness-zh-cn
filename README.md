# LearnHarness 简体中文汉化

把 [LearnHarness](https://learnharness.app) 桌面端的界面文案实时替换为简体中文。

- 插件 ID：`zh-cn-localization`
- 词表规模：930 条固定文案 + 30 条正则规则
- 适用版本：LearnHarness ≥ 0.7.0
- 实现方式：运行时 DOM 替换（应用本身没有 i18n 框架，文案硬编码在组件里）
- 仓库：<https://github.com/belladonnamay5/learnharness-zh-cn>

> **想直接装上用**：懒得折腾就下 ZIP 走 [方式三](#方式三直接解压-zip-到插件文件夹)，解压到插件目录即可；有 git 走 [方式一](#方式一直接用预构建产物推荐不需要-node)。

---

## 它做了什么

应用里**所有界面文案**都会被换成中文：侧栏、按钮、菜单、设置面板全部十个分组、对话框、空状态、错误提示、工具结果卡片、阶段分隔、状态徽章、`aria-label` 与 `placeholder` 之类的无障碍属性。

**以下内容不会被动**（这是刻意的）：

| 不译对象 | 原因 |
| --- | --- |
| Markdown 正文、学习材料 | 那是你的内容，不是界面 |
| 代码块、`<code>`、公式（KaTeX）、SVG 内部 | 改了会破坏渲染或语义 |
| 输入框 / 可编辑区里的文字 | 你正在写的东西 |
| 模型名（如 `deepseek-v4.1-flash-1017`）、服务商名（ChatGPT、Claude Code、Ollama…） | 专有名称 |
| 主题名（Catppuccin、Rosé Pine…）、字体名、听写语言名 | 专有名称 |
| 引用资料标题（`RFC 4271` 之类）、文件路径 | 是事实数据，不是文案 |

副作用只有一个：中文没有单复数，英文的 `7 strands` 这类计数后缀会被吞掉（译成「7 条线索」）。关闭插件时全部原样还原。

---

## 安装

### 方式一：直接用预构建产物（推荐，不需要 Node）

仓库里已经带了构建好的 `dist/`，复制过去就能用。

1. 找到插件目录：

   | 平台 | 路径 |
   | --- | --- |
   | Windows | `%APPDATA%\LearnHarness\data\plugins`（即 `C:\Users\<你>\AppData\Roaming\LearnHarness\data\plugins`） |
   | macOS | `~/Library/Application Support/LearnHarness/data/plugins` |
   | Linux | `~/.config/LearnHarness/data/plugins` |

2. 把整个仓库放进该目录，**文件夹名必须是插件 ID**：

   ```bash
   cd "%APPDATA%\LearnHarness\data\plugins"
   git clone https://github.com/belladonnamay5/learnharness-zh-cn.git zh-cn-localization
   ```

   没有 git 就用 [方式三](#方式三直接解压-zip-到插件文件夹)：下载 ZIP 解压到同一目录，效果一样。
   目录里最终应该有 `plugins/zh-cn-localization/dist/manifest.json` 和 `dist/main.js`。

3. 打开 LearnHarness → 设置 → **社区插件** → 点 **刷新列表** → 打开「简体中文汉化」的开关。

4. **重启 LearnHarness**。界面立刻变中文。

> 新装插件默认是关闭的，第 3 步别跳过。

### 方式二：从源码构建

需要 Node.js 18+。

```bash
git clone https://github.com/belladonnamay5/learnharness-zh-cn.git
cd learnharness-zh-cn
npm install          # 装 linkedom（只用于测试）
npm run build        # 生成 dist/main.js + dist/manifest.json
npm test             # 冒烟测试：11 个翻译样例 + 30 项 DOM 断言
npm run install-plugin
```

`install-plugin` 会自动找当前平台的插件目录，把 `dist/` 复制过去并在 `plugins-state.json` 里把开关设为 `true`。目录不在默认位置时手动指定：

```bash
node install.mjs --data-dir "D:/somewhere/LearnHarness/data"
# 或
LEARNHARNESS_DATA_DIR="D:/somewhere/LearnHarness/data" npm run install-plugin
```

装完同样要重启 LearnHarness。

### 方式三：直接解压 ZIP 到插件文件夹

不需要 Node，不需要 git，只要一个压缩包。适合换机器、备份、或发给朋友。

1. 从 [Releases](../../releases) 页下载 `zh-cn-localization.zip`。
2. 把它**直接解压进插件目录**（路径同方式一的表格）：

   | 平台 | 解压目标 |
   | --- | --- |
   | Windows | `%APPDATA%\LearnHarness\data\plugins` |
   | macOS | `~/Library/Application Support/LearnHarness/data/plugins` |
   | Linux | `~/.config/LearnHarness/data/plugins` |

   Windows 图形界面：右键 ZIP → **全部解压缩** → 目标填
   `C:\Users\<你>\AppData\Roaming\LearnHarness\data\plugins` → 解压。

   Windows 命令行：

   ```powershell
   Expand-Archive "$HOME\Downloads\zh-cn-localization.zip" `
     -DestinationPath "$env:APPDATA\LearnHarness\data\plugins" -Force
   ```

   macOS / Linux：

   ```bash
   unzip zh-cn-localization.zip -d "$HOME/Library/Application Support/LearnHarness/data/plugins"  # macOS
   unzip zh-cn-localization.zip -d "$HOME/.config/LearnHarness/data/plugins"                       # Linux
   ```

3. 确认目录层级 —— 压缩包顶层文件夹已经是插件 ID，**不要改名、不要再多套一层**：

   ```
   plugins/zh-cn-localization/dist/manifest.json   ✓
   plugins/zh-cn-localization/dist/main.js         ✓
   ```

4. 打开 LearnHarness → 设置 → **社区插件** → **刷新列表** → 打开「简体中文汉化」。
5. **重启 LearnHarness**。

> 解压后目录变成 `plugins/zh-cn-localization/zh-cn-localization/dist/…`，说明多套了一层，插件不会被识别 —— 把里层文件夹提出来即可。
> 直接把 `dist` 拖进 `plugins` 也不认，应用是按「文件夹名 = 插件 ID」找的。

---

## 开启 / 关闭

- **设置 → 社区插件 → 简体中文汉化** 开关：即时生效，关闭后英文原样还原。
- **设置 → 简体中文汉化**（插件自己的设置项）：同一个开关的另一种入口。
- 彻底移除：关掉开关，删掉 `plugins/zh-cn-localization` 整个目录，重启。

---

## 目录结构

```
.
├── src/runtime.js          # 运行时替换逻辑（TreeWalker + MutationObserver）
├── translations/zh-CN.json # 词表：930 条精确匹配
├── build.mjs               # 把词表和正则注入 runtime.js，产出 dist/
├── install.mjs             # 一键安装到 LearnHarness 插件目录
├── test/                   # 冒烟测试
├── dist/                   # 构建产物（已提交，可直接用）
│   ├── manifest.json
│   └── main.js
└── package.json
```

---

## 改词表

发现漏译、错译，或者想改某个措辞，两条路：

**1. 精确词条** —— 编辑 `translations/zh-CN.json`，键是英文原文（必须逐字一致，包括大小写和标点），值是中文：

```json
"Community plugins": "社区插件",
```

**2. 带变量的动态文案** —— 编辑 `build.mjs` 顶部的 `RULES`，用正则捕获变量：

```js
[/^Settings for (.+)$/, "“$1”的设置"],
```

然后重新构建、测试、安装、重启：

```bash
npm run build && npm test && npm run install-plugin
```

### 找漏译文案

界面上还有英文时，把那段英文原样加进词表即可。注意三种容易漏的情况：

- **句子被标签切开**。宿主把一句话拆进多个元素（比如安装说明里的 `run <code>npm run build</code>. Prebuilt packages…`），这时只能逐段收短词条。
- **带中间点的拼接串**。宿主用 ` · ` 拼接状态（`Waiting for input · 33m ago`），整串查不到时会自动按 ` · ` 切段分别查表，但**段首带点的串**（`· no key`）必须整条收。
- **属性文案**。`aria-label`、`title`、`placeholder` 走单独的翻译通道，别只改文本。

---

## 已知限制

- **依赖 DOM 结构**。应用升级后可能新增一批文案，需要等词表更新；插件不会破坏任何东西，最坏情况是那些新文案保持英文。
- **不拦截 React 内部状态**。翻译发生在渲染之后，个别瞬时值可能先闪一下英文。
- **不进入 iframe 与 Shadow DOM**。当前 LearnHarness 界面里没有用到。
- **中文没有单复数**，计数后缀会被吞（见上文）。

---

## 免责声明

LearnHarness 的插件机制**不提供沙箱**：插件是与应用同权限的本地代码，能读写文件和网络。这个插件的代码全部在本仓库里，你可以先读完再装。请只启用你信任的插件。

本插件与 LearnHarness 官方无关，是社区作品。

---

## License

[MIT](LICENSE)
