# 万界方舟 API 接入指南

## 🌟 关于万界方舟

[万界方舟](https://fangzhou.wanjiedata.com/) 是一站式聚合 MaaS 平台，提供多种大模型 API，价格实惠，兼容 OpenAI 接口格式。

---

## 📋 快速开始

### 1. 注册并获取 API Key

1. **访问官网**：https://fangzhou.wanjiedata.com/
2. **手机号注册/登录**
3. **进入个人中心** → **API Key** 栏目
4. **创建并复制 API Key**

### 2. 查看可用模型

登录后进入 **模型广场**，查看所有支持的模型。

**推荐的视觉分析模型**：
- ✅ **claude-3.5-sonnet**（推荐）- 强大的图像分析能力，准确度高
- ⚡ **gpt-4o-mini** - 便宜，速度快，效果略逊于 Claude
- 🇨🇳 **qwen-vl-max** - 通义千问视觉模型，中文理解好

### 3. 配置环境变量

编辑项目根目录的 `.env.local` 文件：

```bash
# 万界方舟 API Key（必填）
WANJIE_API_KEY=wj-xxxxxxxxxxxxxxxx

# 模型名称（可选，默认 claude-3.5-sonnet）
WANJIE_MODEL=claude-3.5-sonnet
```

### 4. 启动项目

```bash
npm run dev
```

访问 http://localhost:3000 测试功能。

---

## 🔧 Vercel 部署配置

在 **Vercel Dashboard → Settings → Environment Variables** 添加：

```
变量名: WANJIE_API_KEY
变量值: wj-xxxxxxxxxxxxxxxx（你的万界方舟 API Key）
适用环境: ✅ Production ✅ Preview ✅ Development
```

可选配置：
```
变量名: WANJIE_MODEL
变量值: claude-3.5-sonnet
```

---

## 💰 价格参考

万界方舟的模型价格通常比官方 API 便宜很多，具体价格请查看：
https://fangzhou.wanjiedata.com/

**示例价格**（仅供参考，以官网为准）：
- Claude 3.5 Sonnet：约 ¥0.01-0.03 / 千 tokens
- GPT-4o-mini：约 ¥0.005-0.01 / 千 tokens

**预估成本**：
- 每次分析消耗约 2000-4000 tokens（包含图片 + 文本）
- 单次分析成本：约 ¥0.02-0.12

---

## 📊 支持的视觉模型对比

| 模型 | 优点 | 缺点 | 推荐场景 |
|------|------|------|----------|
| **claude-3.5-sonnet** | 分析准确，理解深入 | 价格稍贵 | 需要高质量分析 |
| **gpt-4o-mini** | 便宜，速度快 | 准确度略低 | 成本敏感场景 |
| **qwen-vl-max** | 中文理解好 | 国际用户支持弱 | 中文场景 |

---

## 🐛 常见问题

### Q1: API 调用失败，返回 401 错误
**A**: 检查 API Key 是否正确配置，是否已添加到环境变量。

### Q2: 返回 "模型不存在" 错误
**A**: 检查 `WANJIE_MODEL` 配置的模型名称是否正确，是否在你的账户中已授权该模型。

### Q3: 分析结果不准确
**A**: 尝试切换到 `claude-3.5-sonnet` 模型，它的图像分析能力最强。

### Q4: 如何查看 API 使用量和余额？
**A**: 登录万界方舟官网 → 个人中心 → 用量统计

---

## 🔗 相关链接

- [万界方舟官网](https://fangzhou.wanjiedata.com/)
- [万界方舟文档](https://docs.wanjiedata.com/)
- [API 接口文档](https://docs.wanjiedata.com/maas/Interface.html)

---

## ⚙️ 高级配置

### 自定义模型参数

如需自定义模型参数（如 temperature、max_tokens），可修改 `lib/ai-analysis.ts`：

```typescript
const response = await fetch(`${baseURL}/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: model,
    max_tokens: 4000,        // 最大输出 tokens
    temperature: 0.7,         // 添加创造性参数（0-1）
    messages: [...]
  }),
});
```

### 切换其他视觉模型

修改 `.env.local`：

```bash
# 使用 GPT-4o-mini
WANJIE_MODEL=gpt-4o-mini

# 或使用通义千问
WANJIE_MODEL=qwen-vl-max
```

---

**提示**：如果遇到问题，请查看 Vercel 部署日志或本地控制台输出的错误信息。
