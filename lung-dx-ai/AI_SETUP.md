# AI 模型集成配置指南

本项目已集成 SiliconFlow 的视觉语言模型（Qwen2-VL-72B-Instruct）来实现肺部影像的智能分析。

## 🔑 配置步骤

### 1. 获取 API Key

1. 访问 [SiliconFlow 官网](https://cloud.siliconflow.cn)
2. 注册账号并登录
3. 在控制台获取您的 API Key

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件（如果不存在）：

```bash
# 在项目根目录执行
touch .env.local
```

然后添加您的 API Key：

```env
SILICONFLOW_API_KEY=your_api_key_here
```

**重要**: 将 `your_api_key_here` 替换为您实际的 API Key

### 3. 安装依赖（如果需要）

```bash
npm install
```

### 4. 启动项目

```bash
npm run dev
```

## 🚀 功能说明

### AI 分析流程

1. **上传图片**: 用户在主页上传肺部医学影像（CT 或 X 光片）
2. **AI 分析**: 系统自动调用 SiliconFlow API，发送图片给视觉语言模型
3. **生成诊断**: AI 模型分析图片并返回专业的医学诊断建议
4. **显示结果**: 诊断结果显示在详情页的"诊断建议"区域

### AI 分析内容

AI 模型会分析以下内容：
- 是否发现肺结节
- 结节的大小、位置、形态特征
- 恶性风险等级评估（低、中、高）
- 专业的诊疗建议和随访建议

## 📋 使用的模型

- **模型名称**: Qwen2-VL-72B-Instruct
- **模型类型**: 视觉语言模型（VLM）
- **提供商**: SiliconFlow
- **支持功能**: 图像理解、医学影像分析

## 🔧 技术实现

### API 端点

```
POST /api/analyze
```

请求体：
```json
{
  "imageData": "data:image/png;base64,..."
}
```

响应：
```json
{
  "success": true,
  "diagnosis": "AI 生成的诊断文本...",
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  }
}
```

### 文件结构

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts       # AI 分析 API 路由
│   ├── page.tsx               # 主页（文件上传 + AI 分析）
│   └── detail/
│       └── page.tsx           # 详情页（显示 AI 诊断）
```

## ⚠️ 注意事项

### 安全性

1. **不要提交 `.env.local` 文件**: 此文件已在 `.gitignore` 中，请勿将其提交到版本控制
2. **API Key 保密**: 不要在前端代码中直接使用 API Key
3. **服务器端调用**: 所有 API 调用都在服务器端（Next.js API Routes）进行

### 限制

1. **图片格式**: 支持 PNG、JPG、JPEG 格式
2. **图片大小**: 建议单张图片不超过 10MB
3. **分析数量**: 目前每次只分析第一张上传的图片
4. **API 配额**: 根据您的 SiliconFlow 账户套餐限制

### 错误处理

如果遇到以下错误：

**"API Key 未配置"**
- 检查 `.env.local` 文件是否存在
- 确认 API Key 是否正确配置

**"AI 分析失败"**
- 检查网络连接
- 确认 API Key 是否有效
- 查看控制台日志了解详细错误信息

**"服务器错误"**
- 查看服务器日志
- 确认 SiliconFlow API 服务是否正常

## 🎯 进阶配置

### 修改 AI 提示词

编辑 `src/app/api/analyze/route.ts` 中的提示词：

```typescript
{
  type: 'text',
  text: '您的自定义提示词...'
}
```

### 调整模型参数

在 `route.ts` 中修改：

```typescript
{
  model: 'Qwen/Qwen2-VL-72B-Instruct',
  max_tokens: 2048,      // 最大生成长度
  temperature: 0.3,      // 创造性（0-1）
  top_p: 0.7            // 采样概率
}
```

### 批量分析

修改 `src/app/page.tsx` 中的逻辑，循环处理所有图片文件。

## 📚 参考资源

- [SiliconFlow 文档](https://docs.siliconflow.cn/)
- [API 参考](https://docs.siliconflow.cn/cn/api-reference/chat-completions/chat-completions)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 💡 技术支持

如有问题，请：
1. 查看控制台错误日志
2. 检查浏览器开发者工具的 Network 面板
3. 参考 SiliconFlow 官方文档
4. 提交 Issue 到项目仓库

