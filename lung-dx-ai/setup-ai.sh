#!/bin/bash

# AI 模型配置脚本

echo "=================================="
echo "AI 肺部结节辅助诊断系统 - AI 配置"
echo "=================================="
echo ""

# 检查 .env.local 是否存在
if [ -f .env.local ]; then
    echo "⚠️  .env.local 文件已存在"
    read -p "是否覆盖? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 已取消"
        exit 1
    fi
fi

# 获取 API Key
echo "请输入您的 SiliconFlow API Key:"
echo "(在 https://cloud.siliconflow.cn 获取)"
read -p "API Key: " API_KEY

if [ -z "$API_KEY" ]; then
    echo "❌ API Key 不能为空"
    exit 1
fi

# 创建 .env.local 文件
cat > .env.local << EOF
# SiliconFlow API Key
# 自动生成于 $(date)
SILICONFLOW_API_KEY=$API_KEY
EOF

echo ""
echo "✅ 配置完成！"
echo ""
echo "📝 .env.local 文件已创建"
echo "🔐 您的 API Key 已安全保存"
echo ""
echo "下一步："
echo "1. 运行 'npm install' 安装依赖（如果需要）"
echo "2. 运行 'npm run dev' 启动项目"
echo "3. 访问 http://localhost:3000"
echo ""
echo "📚 更多信息请查看 AI_SETUP.md"
echo ""

