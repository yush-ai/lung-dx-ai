#!/usr/bin/env node

/**
 * AI 配置测试脚本
 * 用于验证 SiliconFlow API 配置是否正确
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 检查 AI 配置...\n');

// 检查 .env.local 文件
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

console.log('1. 检查 .env.local 文件:');
if (envExists) {
  console.log('   ✅ 文件存在');
  
  // 读取并检查 API Key
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasApiKey = envContent.includes('SILICONFLOW_API_KEY=');
  const apiKeyLine = envContent.split('\n').find(line => line.startsWith('SILICONFLOW_API_KEY='));
  
  if (hasApiKey) {
    console.log('   ✅ API Key 配置已找到');
    
    if (apiKeyLine) {
      const apiKeyValue = apiKeyLine.split('=')[1]?.trim();
      if (apiKeyValue && apiKeyValue !== 'your_api_key_here' && apiKeyValue.length > 10) {
        console.log('   ✅ API Key 格式看起来正确');
      } else {
        console.log('   ⚠️  API Key 可能未正确配置');
        console.log('   提示: 确保替换了默认值 "your_api_key_here"');
      }
    }
  } else {
    console.log('   ❌ 未找到 SILICONFLOW_API_KEY 配置');
  }
} else {
  console.log('   ❌ 文件不存在');
  console.log('   请运行: ./setup-ai.sh 或手动创建 .env.local 文件');
}

console.log('\n2. 检查 API 路由文件:');
const apiRoutePath = path.join(__dirname, 'src', 'app', 'api', 'analyze', 'route.ts');
if (fs.existsSync(apiRoutePath)) {
  console.log('   ✅ API 路由文件存在');
} else {
  console.log('   ❌ API 路由文件缺失');
}

console.log('\n3. 检查配置文档:');
const setupDocPath = path.join(__dirname, 'AI_SETUP.md');
if (fs.existsSync(setupDocPath)) {
  console.log('   ✅ AI_SETUP.md 文档存在');
} else {
  console.log('   ⚠️  配置文档缺失');
}

console.log('\n📋 总结:');
if (envExists && hasApiKey) {
  console.log('✅ 配置看起来正常！');
  console.log('\n下一步:');
  console.log('1. 运行: npm run dev');
  console.log('2. 访问: http://localhost:3000');
  console.log('3. 上传肺部影像进行测试');
} else {
  console.log('❌ 配置不完整，请参考 AI_SETUP.md 完成配置');
  console.log('\n快速配置:');
  console.log('1. 运行: ./setup-ai.sh');
  console.log('2. 或手动创建 .env.local 并添加 API Key');
}

console.log('\n📚 详细说明请查看: AI_SETUP.md');
console.log('');

