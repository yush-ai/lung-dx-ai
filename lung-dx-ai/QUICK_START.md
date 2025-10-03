# 🚀 快速开始指南

## 第一步：配置 AI 模型（必需）

### 方式一：自动配置脚本（推荐）

```bash
# 给脚本添加执行权限
chmod +x setup-ai.sh

# 运行配置脚本
./setup-ai.sh
```

按提示输入您的 SiliconFlow API Key 即可。

### 方式二：手动配置

1. 在项目根目录创建 `.env.local` 文件：

```bash
touch .env.local
```

2. 编辑文件，添加以下内容：

```env
SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**重要**: 将上面的值替换为您的真实 API Key

### 获取 API Key

1. 访问: https://cloud.siliconflow.cn
2. 注册/登录账号
3. 在控制台找到 API Key
4. 复制 API Key

## 第二步：安装依赖

```bash
npm install
```

## 第三步：启动项目

```bash
npm run dev
```

## 第四步：使用系统

1. 打开浏览器访问: http://localhost:3000
2. 拖拽或选择肺部医学影像文件
3. 点击"开始 AI 分析"按钮
4. 等待 AI 分析（通常需要 5-15 秒）
5. 查看 AI 生成的诊断建议

## 验证配置

运行测试脚本检查配置是否正确：

```bash
node test-ai-config.js
```

## 常见问题

### Q: API Key 从哪里获取？
A: 访问 https://cloud.siliconflow.cn，注册后在控制台获取

### Q: 为什么显示"API Key 未配置"？
A: 检查 `.env.local` 文件是否存在且包含正确的 API Key

### Q: AI 分析失败怎么办？
A: 
1. 检查网络连接
2. 确认 API Key 是否有效
3. 查看浏览器控制台错误信息
4. 检查 SiliconFlow 账户配额

### Q: 支持哪些图片格式？
A: PNG、JPG、JPEG、DICOM (.dcm)

### Q: 数据安全吗？
A: 
- 图片仅存储在浏览器本地
- API 调用在服务器端进行
- 不会永久保存用户数据
- 关闭浏览器后数据自动清除

## 下一步

- 📖 阅读 [完整文档](./README.md)
- 🔧 查看 [AI 配置说明](./AI_SETUP.md)
- 💡 了解更多 [使用技巧](#)

## 需要帮助？

1. 检查 [AI_SETUP.md](./AI_SETUP.md) 详细配置说明
2. 运行 `node test-ai-config.js` 诊断配置问题
3. 查看浏览器控制台错误信息
4. 提交 GitHub Issue

---

**祝您使用愉快！** 🎉

