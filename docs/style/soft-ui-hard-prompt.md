STYLEKIT_STYLE_REFERENCE
style_name: 柔和界面风
style_slug: soft-ui
style_source: /styles/soft-ui

# Hard Prompt

## 什么时候用
当你希望 AI 严格按风格规则生成代码时使用。它是生产界面最稳的默认选择。

## 怎么用
- 把完整提示词复制到 ChatGPT、Claude、Cursor 或其他编码助手。
- 在提示词后追加具体产品、页面或组件需求。
- 生成后按禁止项和交互状态检查，确认没有风格漂移。

请严格遵守以下风格规则并保持一致性，禁止风格漂移。

## 执行要求

- 优先保证风格一致性，其次再做创意延展。
- 遇到冲突时以禁止项为最高优先级。
- 输出前自检：颜色、排版、间距、交互是否仍属于该风格。

## Style Rules

STYLE: Soft UI
TYPE: Friendly, approachable interface design

## 必须遵守

- 使用 rounded-2xl 或 rounded-3xl 作为主要圆角
- 使用 shadow-lg 或 shadow-xl 配合透明度 shadow-[accent]/20
- 背景使用浅色调 bg-slate-50, bg-gray-50
- 使用低饱和度的主色调
- 按钮使用 hover:shadow-xl hover:-translate-y-0.5 的悬浮效果
- 卡片间使用 gap-6 或 gap-8 的宽松间距
- 图标使用圆形背景 rounded-full bg-[color]/10

## 绝对禁止

- 禁止使用尖锐边角 rounded-none
- 禁止使用纯黑色 #000000
- 禁止使用高饱和度的纯色
- 禁止使用硬边框 border-black
- 禁止使用硬阴影（无模糊的阴影）
- 禁止元素间距过于紧凑

COLOR RULES:
- Primary: Indigo/Purple tones (indigo-500)
- Background: Slate/Gray soft (slate-50, gray-50)
- Text: Gray-800 for headings, gray-500 for body
- Shadows: Always with color tint and opacity

SPACING:
- Card padding: p-6 md:p-8
- Section padding: py-16 md:py-24
- Gap: gap-6 md:gap-8

## Animation & Interaction Rules

- Cloud Float: hover 以上浮加阴影扩散为主，阴影保持彩色且柔和，避免脏灰硬影。
- Pillow Press: active 状态用轻微缩放和内阴影，呈现按入枕面的柔软反馈。
- Friendly Viscosity: 交互节奏推荐 duration-300 和 ease-in-out，避免突兀速度变化。
- Halo Focus: 表单 focus 使用大半径低不透明度 ring 与柔光阴影，不依赖硬边框。

## Layout & Spacing
- Section padding: py-16 md:py-24
- Card padding: p-6 md:p-8
- Gap between cards: gap-6 md:gap-8
- Max content width: max-w-6xl mx-auto

## Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Stack elements vertically on mobile (flex-col), row on desktop (md:flex-row)
- Reduce font sizes on mobile: text-3xl md:text-5xl for headings
- Touch-friendly targets: min 44px for interactive elements

## Self-Check Verification
After generating code, verify:
1. All interactive elements have hover/focus/active states
2. Color contrast meets WCAG 2.1 AA (4.5:1 for text)
3. Layout is responsive across breakpoints
4. Typography hierarchy is clear (h1 > h2 > h3 > body)
5. Spacing is consistent using the defined scale
6. All animations respect prefers-reduced-motion

---

# Soft UI (柔和界面风) Design System

> 温和友好的界面风格，柔和的阴影、圆润的边角、低饱和度的配色。适合消费类应用、社交产品、生活服务类 App。

## 核心理念

Soft UI 设计风格强调友好、亲和、舒适的视觉体验，让用户感到放松和愉悦。

核心理念：
- 温和友好：通过柔和的阴影和圆角传达亲和力
- 低对比度：避免强烈对比，使用柔和的色彩过渡
- 触感设计：让界面元素看起来可以触摸
- 情感连接：通过设计传达温暖和关怀

设计原则：
- 视觉一致性：所有组件必须遵循统一的视觉语言，从色彩到字体到间距保持谐调
- 层次分明：通过颜色深浅、字号大小、留白空间建立清晰的信息层级
- 交互反馈：每个可交互元素都必须有明确的 hover、active、focus 状态反馈
- 响应式适配：设计必须在移动端、平板、桌面端上保持一致的体验
- 无障碍性：确保色彩对比度符合 WCAG 2.1 AA 标准，所有交互元素可键盘访问

---

## Token 字典（精确 Class 映射）

### 边框
```
宽度: border-0
颜色: border-transparent
圆角: rounded-2xl
```

### 阴影
```
小: shadow-md shadow-gray-200/50
中: shadow-lg shadow-gray-200/50
大: shadow-xl shadow-gray-200/50
悬停: shadow-xl shadow-indigo-500/20
聚焦: ring-2 ring-indigo-500/50
```

### 交互效果
```
悬停位移: （无）
悬停缩放: hover:-translate-y-0.5
悬停透明度: hover:shadow-xl
过渡动画: transition-all duration-200
按下状态: active:scale-95
```

### 字体
```
标题: font-semibold
正文: font-normal
等宽: font-mono
```

### 字号
```
Hero: text-4xl md:text-5xl lg:text-6xl
H1: text-3xl md:text-4xl
H2: text-2xl md:text-3xl
H3: text-xl md:text-2xl
正文: text-sm md:text-base
小字: text-xs
```

### 间距
```
Section: py-16 md:py-24
容器: px-4 md:px-6 lg:px-8
卡片: p-6 md:p-8
小间距: gap-4
中间距: gap-6 md:gap-8
大间距: gap-8 md:gap-12
```

### 颜色角色
```
背景主色: bg-slate-50
背景辅色: bg-white
背景强调色: bg-indigo-500, bg-pink-500, bg-emerald-500
正文主色: text-gray-800
正文辅色: text-gray-600
正文弱化色: text-gray-400
按钮主色: bg-indigo-600 text-white shadow-lg shadow-indigo-600/30
按钮辅色: bg-white text-gray-700 shadow-lg shadow-gray-200/50
```

---

## [FORBIDDEN] 绝对禁止

以下 class 在本风格中**绝对禁止使用**，生成时必须检查并避免：

### 禁止的 Class
- `rounded-none`
- `rounded-sm`
- `border-2`
- `border-4`
- `border-black`
- `shadow-[`
- `bg-black`

### 禁止的模式
- 匹配 `^rounded-none`
- 匹配 `^rounded-sm$`
- 匹配 `^border-[24]`
- 匹配 `^border-black`

### 禁止原因
- `rounded-none`: Soft UI requires large rounded corners (rounded-2xl+)
- `border-2`: Soft UI avoids visible borders, uses shadows instead
- `border-black`: Soft UI uses soft colors, never hard black borders

> WARNING: 如果你的代码中包含以上任何 class，必须立即替换。

---

## [REQUIRED] 必须包含

### 按钮必须包含
```
px-6 py-3
rounded-2xl
font-medium
shadow-lg
hover:-translate-y-0.5
hover:shadow-xl
transition-all duration-200
```

### 卡片必须包含
```
bg-white
rounded-3xl
shadow-xl shadow-gray-200/50
hover:shadow-2xl
hover:-translate-y-1
transition-all duration-300
```

### 输入框必须包含
```
px-5 py-3.5
bg-gray-50
border-0
rounded-2xl
focus:ring-2 focus:ring-indigo-500/50
focus:bg-white
transition-all duration-200
```

---

## [COMPARE] Soft UI 错误 vs 正确对比

以下错误示例只代表“未经过当前风格适配的通用默认值”，不要把错误示例当成视觉建议。

### 按钮

[WRONG] **错误示例**（通用组件库默认样式，不要直接复制）：
```html
<button class="{GENERIC_LIBRARY_BUTTON_DEFAULT}">
  点击我
</button>
```

[CORRECT] **正确示例**（使用当前风格的 token）：
```html
<button class="px-6 py-3 rounded-2xl font-medium shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
  点击我
</button>
```

### 卡片

[WRONG] **错误示例**（未经当前风格适配的通用卡片）：
```html
<div class="{GENERIC_LIBRARY_CARD_DEFAULT}">
  <h3>{TITLE}</h3>
</div>
```

[CORRECT] **正确示例**（使用当前风格的 card token）：
```html
<div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 md:p-8">
  <h3 class="font-semibold text-xl md:text-2xl">{TITLE}</h3>
</div>
```

### 输入框

[WRONG] **错误示例**（未经当前风格适配的通用输入框）：
```html
<input class="{GENERIC_LIBRARY_INPUT_DEFAULT}" />
```

[CORRECT] **正确示例**（使用当前风格的 input token）：
```html
<input class="px-5 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-200" placeholder="{PLACEHOLDER}" />
```

---

## [TEMPLATES] Soft UI 页面骨架模板

以下骨架只使用当前风格的 token。替换 `{PLACEHOLDER}` 时，不要移除或替换这些 token：

### 导航栏骨架
```html
<nav class="bg-slate-50 text-gray-800 border-0 border-transparent px-4 md:px-6 lg:px-8">
  <div class="flex items-center justify-between max-w-6xl mx-auto gap-6 md:gap-8">
    <a href="/" class="font-semibold text-xl md:text-2xl">
      {LOGO_TEXT}
    </a>
    <div class="flex gap-6 md:gap-8 font-normal text-xs">
      {NAV_LINKS}
    </div>
  </div>
</nav>
```

### Hero 区块骨架
```html
<section class="bg-indigo-500 text-gray-800 py-16 md:py-24 px-4 md:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="font-semibold text-4xl md:text-5xl lg:text-6xl">
      {HEADLINE}
    </h1>
    <p class="font-normal text-sm md:text-base max-w-xl">
      {SUBHEADLINE}
    </p>
    <button class="px-6 py-3 rounded-2xl font-medium shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
      {CTA_TEXT}
    </button>
  </div>
</section>
```

### 卡片网格骨架
```html
<section class="bg-slate-50 text-gray-800 py-16 md:py-24 px-4 md:px-6 lg:px-8">
  <div class="max-w-6xl mx-auto">
    <h2 class="font-semibold text-2xl md:text-3xl">{SECTION_TITLE}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <!-- Card template - repeat for each card -->
      <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 md:p-8">
        <h3 class="font-semibold text-xl md:text-2xl">{CARD_TITLE}</h3>
        <p class="font-normal text-sm md:text-base text-gray-400">{CARD_DESCRIPTION}</p>
      </div>
    </div>
  </div>
</section>
```

### 表单输入骨架
```html
<input class="px-5 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-200" placeholder="{PLACEHOLDER}" />
```

### 页脚骨架
```html
<footer class="bg-white text-gray-600 py-16 md:py-24 px-4 md:px-6 lg:px-8">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      <div>
        <span class="font-semibold text-xl md:text-2xl">{LOGO_TEXT}</span>
        <p class="font-normal text-xs">{TAGLINE}</p>
      </div>
      <div>
        <h4 class="font-semibold text-xl md:text-2xl">{COLUMN_TITLE}</h4>
        <ul class="font-normal text-xs">
          {FOOTER_LINKS}
        </ul>
      </div>
    </div>
  </div>
</footer>
```

---

## [CHECKLIST] Soft UI 生成后自检清单

**输出代码前，逐项验证当前风格的 token 和规则。如有违反，先修正再交付：**

### Token 检查
- [ ] 按钮包含： `px-6 py-3 rounded-2xl font-medium shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200`
- [ ] 卡片包含： `bg-white rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`
- [ ] 输入框包含： `px-5 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-200`

### 禁止项检查
- [ ] 没有使用 `rounded-none`
- [ ] 没有使用 `rounded-sm`
- [ ] 没有使用 `border-2`
- [ ] 没有使用 `border-4`
- [ ] 没有使用 `border-black`
- [ ] 没有使用 `shadow-[`
- [ ] 没有使用 `bg-black`

### 风格规则检查
- [ ] 使用 rounded-2xl 或 rounded-3xl 作为主要圆角
- [ ] 使用 shadow-lg 或 shadow-xl 配合透明度 shadow-[accent]/20
- [ ] 背景使用浅色调 bg-slate-50, bg-gray-50
- [ ] 使用低饱和度的主色调
- [ ] 按钮使用 hover:shadow-xl hover:-translate-y-0.5 的悬浮效果

### 风格漂移检查
- [ ] 没有违反：禁止使用尖锐边角 rounded-none
- [ ] 没有违反：禁止使用纯黑色 #000000
- [ ] 没有违反：禁止使用高饱和度的纯色
- [ ] 没有违反：禁止使用硬边框 border-black
- [ ] 没有违反：禁止使用硬阴影（无模糊的阴影）

### 通用交付检查
- [ ] 响应式布局在手机、平板和桌面下稳定，没有横向溢出
- [ ] 所有交互元素有清晰焦点、可访问名称和 reduced-motion 方案
- [ ] 文本对比度达到 WCAG AA，且没有用颜色单独传递状态
- [ ] 结果仍然能够一眼识别为 Soft UI

---

## [EXAMPLES] 示例 Prompt

### 1. 消费App

生成消费类 App 着陆页

```
Create a consumer app landing using Soft UI style:
- Hero with app mockup and soft floating cards
- Feature section with rounded cards and colored shadows
- Testimonial cards with avatar and soft shadows
- CTA with gradient button (soft gradient)
- All rounded-2xl or rounded-3xl
- Hover effects with lift and shadow expansion
```

### 2. SaaS 着陆页

生成 柔和界面风风格的 SaaS 产品着陆页

```
Create a SaaS landing page using Soft UI style with hero section, feature grid, testimonials, pricing table, and footer.
```

### 3. 作品集展示

生成 柔和界面风风格的作品集页面

```
Create a portfolio showcase page using Soft UI style with project grid, about section, contact form, and consistent visual language.
```

## 绝对禁止（匹配即拒绝）

以下模式一旦出现，视为风格违规——不找借口，直接重写。

- 使用尖锐边角 rounded-none
- 使用纯黑色 #000000
- 使用高饱和度的纯色
- 使用硬边框 border-black
- 使用硬阴影（无模糊的阴影）
- 元素间距过于紧凑

## 自检清单（交付前逐条确认）

如果任何一条不通过，说明风格漂移了——修改后再交付。

- [ ] 没有紫色到蓝色的渐变
- [ ] 没有使用 Inter / Roboto / Geist 等过度使用的字体
- [ ] 没有嵌套卡片（卡片里面套卡片）
- [ ] 没有在彩色背景上放灰色文字
- [ ] 正文对比度满足 WCAG AA（≥4.5:1）
- [ ] 没有 bounce / elastic 缓动曲线
- [ ] 动效有 prefers-reduced-motion 备选方案
- [ ] 正文行宽不超过 65-75 个字符
- [ ] 没有单侧粗边框装饰（border-left/right accent stripe）
- [ ] 没有渐变文字（background-clip: text）
- [ ] 没有把玻璃态（glassmorphism）当作默认风格
- [ ] 没有 tiny uppercase tracked eyebrow 放在每个 section 标题上面
- [ ] 禁止使用尖锐边角 rounded-none
- [ ] 禁止使用纯黑色 #000000
- [ ] 禁止使用高饱和度的纯色
- [ ] 禁止使用硬边框 border-black
- [ ] 禁止使用硬阴影（无模糊的阴影）