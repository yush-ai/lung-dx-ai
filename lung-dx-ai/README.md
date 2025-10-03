# AI 肺部结节辅助诊断系统

一个基于 Next.js 和 AI 视觉语言模型的智能医学影像分析系统，用于辅助诊断肺部结节。

## ✨ 主要功能

- 🖼️ **医学影像上传**: 支持 DICOM、PNG、JPG 格式
- 🤖 **AI 智能分析**: 集成 SiliconFlow 视觉语言模型进行图像分析
- 📊 **诊断报告**: 生成专业的肺结节分析和诊疗建议
- 🔍 **图像查看器**: 支持缩放、平移、多图浏览
- 🌓 **暗色模式**: 完整的明暗主题支持
- 📱 **响应式设计**: 适配各种屏幕尺寸

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 AI 模型

#### 方式一：使用配置脚本（推荐）

```bash
chmod +x setup-ai.sh
./setup-ai.sh
```

#### 方式二：手动配置

1. 在项目根目录创建 `.env.local` 文件
2. 添加您的 SiliconFlow API Key：

```env
SILICONFLOW_API_KEY=your_api_key_here
```

**获取 API Key**: 访问 [SiliconFlow 官网](https://cloud.siliconflow.cn) 注册并获取

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📖 使用指南

### 基本流程

1. **上传影像**: 在主页拖拽或选择肺部医学影像文件
2. **AI 分析**: 点击"开始 AI 分析"按钮，系统自动调用 AI 模型
3. **查看结果**: 在详情页查看 AI 生成的诊断建议和结节数据
4. **复制报告**: 可一键复制诊断建议文本

### 支持的文件格式

- **DICOM**: `.dcm`, `.dicom` - 医学影像标准格式
- **图像**: `.png`, `.jpg`, `.jpeg` - 常见图片格式

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **AI 模型**: Qwen2-VL-72B-Instruct (SiliconFlow)
- **部署**: 支持 Vercel、自建服务器

## 📁 项目结构

```
lung-dx-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts      # AI 分析 API
│   │   ├── detail/
│   │   │   └── page.tsx          # 诊断详情页
│   │   ├── page.tsx              # 主页（上传）
│   │   ├── layout.tsx            # 布局
│   │   └── globals.css           # 全局样式
├── public/                        # 静态资源
├── AI_SETUP.md                   # AI 配置详细说明
├── setup-ai.sh                   # AI 配置脚本
└── README.md                     # 本文件
```

## 🎨 功能特性

### AI 分析功能

- **自动识别**: AI 自动识别肺部结节
- **详细描述**: 分析结节的大小、位置、形态
- **风险评估**: 评估恶性风险等级（低、中、高）
- **专业建议**: 提供随访和进一步检查建议

### 用户界面

- **现代设计**: 渐变背景、毛玻璃效果
- **医疗主题**: 专业的医疗软件外观
- **颜色编码**: 
  - 🔴 红色 = 高风险
  - 🟡 黄色 = 中等风险
  - 🟢 绿色 = 低风险

### 图像查看

- **缩放控制**: 放大、缩小、重置
- **多图浏览**: 支持上传多张影像切换查看
- **文件信息**: 显示文件名、数量、索引

## 🔧 开发指南

### 本地开发

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `SILICONFLOW_API_KEY` | SiliconFlow API Key | ✅ |

### 修改 AI 提示词

编辑 `src/app/api/analyze/route.ts` 文件中的提示词以自定义 AI 行为。

### 调整 AI 参数

在 API 路由中修改：
- `max_tokens`: 最大生成长度
- `temperature`: 创造性（0-1）
- `top_p`: 采样概率

## ⚠️ 重要提示

### 医疗免责声明

本系统仅供**辅助诊断**和**学习研究**使用，不能替代专业医生的诊断。所有医学决策应由具有资质的医疗专业人员做出。

### 数据安全

- 图片数据仅存储在浏览器本地（sessionStorage）
- API 调用在服务器端进行，保护 API Key 安全
- 不会上传或存储用户的医学影像到服务器
- 关闭浏览器后数据自动清除

### API 使用

- 遵守 SiliconFlow 的使用条款和配额限制
- 不要滥用 API 调用
- 建议添加速率限制和错误处理

## 📚 参考文档

- [AI 配置详细说明](./AI_SETUP.md)
- [SiliconFlow 文档](https://docs.siliconflow.cn/)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🆘 故障排除

### AI 分析失败

1. 检查 `.env.local` 文件是否存在且配置正确
2. 确认 API Key 是否有效
3. 检查网络连接
4. 查看浏览器控制台的错误信息

### 样式问题

1. 确保已安装所有依赖：`npm install`
2. 清除 `.next` 缓存：`rm -rf .next`
3. 重启开发服务器

### 图片无法显示

1. 确认图片格式是否支持
2. 检查图片大小是否过大
3. 尝试刷新页面重新上传

## 📞 联系方式

如有问题或建议，请通过 GitHub Issues 联系我们。

---

**Built with ❤️ using Next.js and AI**
