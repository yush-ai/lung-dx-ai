# Dify 工作流集成配置

## 🎯 概述

本项目已成功集成 Dify 工作流平台，用于肺部影像的智能分析。Dify 是一个强大的 AI 工作流平台，支持多种 AI 模型和工作流编排。

## 🔑 配置步骤

### 1. 环境变量配置

在项目根目录创建 `.env.local` 文件：

```bash
# 创建环境变量文件
touch .env.local
```

添加 Dify API Key：

```env
# Dify API Key
DIFY_API_KEY=app-2w47heGKxFjwHjdvpMeqWQXY
```

### 2. Dify 工作流配置

1. 访问 [Dify 平台](https://dify.app)
2. 注册并登录账号
3. 创建**工作流应用**（不是聊天应用）
4. 配置工作流节点：
   - 添加**文件上传节点**（接收files参数）
   - 添加**开始节点**（接收inputs参数）
   - 添加 **LLM 节点**（配置支持视觉的AI模型）
   - 设置**输出节点**
5. 发布工作流应用

**重要**：工作流必须配置文件上传功能，否则会收到"upload is required in input form"错误。

### 3. API 集成

项目使用以下 API 端点：
- **端点**: `https://api.dify.ai/v1/workflows/run`
- **方法**: POST
- **认证**: Bearer Token
- **数据格式**: multipart/form-data（文件上传）

**API 请求格式**：
```javascript
const formData = new FormData();
formData.append('inputs', JSON.stringify({
  query: '医学影像分析提示词...'
}));
formData.append('response_mode', 'blocking');
formData.append('user', 'lung-dx-user');
formData.append('files', imageBuffer, {
  filename: 'image.png',
  contentType: 'image/png'
});
```

## 🚀 使用方法

1. 启动项目：
   ```bash
   npm run dev
   ```

2. 上传肺部影像图片

3. 点击"开始 AI 分析"

4. 查看诊断结果

## 📋 技术细节

### API 请求格式

```javascript
const formData = new FormData();
formData.append('inputs', JSON.stringify({
  query: '医学影像分析提示词...'
}));
formData.append('response_mode', 'blocking');
formData.append('user', 'lung-dx-user');
formData.append('files', imageBlob, 'image.png');
```

### 响应格式

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

## ⚠️ 注意事项

1. **API Key 安全**: 确保 API Key 不会泄露到客户端
2. **文件大小**: 建议图片不超过 10MB
3. **网络连接**: 确保能够访问 Dify API 服务
4. **工作流配置**: 确保 Dify 工作流已正确配置并发布

## 🔧 故障排除

### 常见错误

1. **"Dify API Key 未配置"**
   - 检查 `.env.local` 文件是否存在
   - 确认 `DIFY_API_KEY` 是否正确设置

2. **"AI 分析失败"**
   - 检查网络连接
   - 确认 API Key 是否有效
   - 检查 Dify 工作流是否已发布

3. **"upload is required in input form"**
   - 确认工作流配置了文件上传节点
   - 检查文件格式是否正确

## 📚 参考资源

- [Dify 官方文档](https://docs.dify.ai/)
- [Dify API 参考](https://docs.dify.ai/v/zh-hans/guides/application-publishing/developing-with-apis)
- [工作流配置指南](https://docs.dify.ai/v/zh-hans/guides/workflow)

---

**集成完成时间**: 2025年10月
**API Key**: app-2w47heGKxFjwHjdvpMeqWQXY
**状态**: ✅ 已集成并可用
