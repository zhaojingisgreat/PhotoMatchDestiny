# PhotoMatchDestiny

AI 照片分析 + 生辰八字命理，为你解读情侣匹配度

## 功能特点

- 📸 **AI 照片分析**：使用 Claude Vision API 深度分析情侣合影
  - 颜值评分
  - 性格推测
  - 亲密度评估
  - 面相匹配度
  - 表情契合度

- 🎴 **八字命理分析**：传统命理学解读
  - 生辰八字计算
  - 五行相生相克
  - 生肖相合度
  - 天干地支合化

- 📊 **综合匹配度报告**：AI + 命理双维度评估
- 📄 **PDF 报告下载**：精美分析报告一键下载

## 技术栈

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS + shadcn/ui
- Claude 3.5 Sonnet Vision API
- lunar-javascript (八字计算)
- Framer Motion (动画)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

编辑 `.env.local` 文件并填入你的 Claude API Key：

```bash
ANTHROPIC_API_KEY=your-claude-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

获取 API Key：[https://console.anthropic.com/](https://console.anthropic.com/)

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 部署到 Vercel

1. 将项目推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量：`ANTHROPIC_API_KEY`
4. 部署完成！

## 项目结构

```
photo-match-destiny/
├── app/
│   ├── page.tsx                    # 首页
│   ├── result/[sessionId]/         # 结果页
│   └── api/
│       ├── analyze/                # 分析 API
│       └── generate-pdf/           # PDF 生成 API
├── components/
│   ├── photo-upload.tsx            # 照片上传组件
│   ├── birth-info-form.tsx         # 生日表单组件
│   └── result-cards/               # 结果展示卡片
├── lib/
│   ├── ai-analysis.ts              # AI 分析逻辑
│   ├── bazi-calculation.ts         # 八字计算逻辑
│   └── compatibility.ts            # 匹配度计算
└── types/                          # TypeScript 类型定义
```

## 使用说明

1. 上传一张清晰的情侣合影照片
2. 输入双方的出生日期（姓名可选）
3. 点击"开始分析"按钮
4. 等待 AI 分析完成（约 10-20 秒）
5. 查看详细的匹配度报告
6. 可选：下载 PDF 报告

## 注意事项

- 上传的照片仅用于一次性分析，不会被存储
- 分析结果仅供娱乐参考，不构成任何专业建议
- API 调用需要消耗 Claude API 额度
- 建议对 API 调用进行速率限制

## 后续优化建议

- [ ] 完善 PDF 生成（使用 @react-pdf/renderer）
- [ ] 添加请求限流（防止 API 滥用）
- [ ] 支持多语言
- [ ] 添加分享功能
- [ ] 优化移动端体验
- [ ] 添加更多命理分析维度

## License

MIT

---

**免责声明**：本项目提供的分析结果仅供娱乐参考，不构成任何专业建议。
