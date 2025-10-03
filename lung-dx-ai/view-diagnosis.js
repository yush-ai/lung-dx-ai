#!/usr/bin/env node

/**
 * 查看 AI 诊断结果工具
 * 这个脚本可以帮助你查看浏览器中保存的诊断结果
 */

console.log('\n📋 AI 诊断结果查看工具\n');
console.log('=' .repeat(60));

console.log('\n💡 查看 AI 诊断结果的方法：\n');

console.log('方法 1: 在浏览器控制台查看（推荐）');
console.log('---------------------------------------');
console.log('1. 打开浏览器（Chrome/Edge/Firefox）');
console.log('2. 按 F12 或右键选择"检查"');
console.log('3. 点击"Console"（控制台）标签');
console.log('4. 上传图片并点击"开始 AI 分析"');
console.log('5. 在控制台会看到蓝色的 AI 诊断结果框\n');

console.log('方法 2: 在终端查看');
console.log('---------------------------------------');
console.log('1. 保持 npm run dev 运行');
console.log('2. 在浏览器中上传图片分析');
console.log('3. 在运行 npm run dev 的终端窗口');
console.log('4. 会看到 "========== AI 诊断结果 =========="');
console.log('5. 下面就是完整的诊断文本\n');

console.log('方法 3: 在浏览器 SessionStorage 查看');
console.log('---------------------------------------');
console.log('1. 在浏览器控制台输入:');
console.log('   sessionStorage.getItem("aiDiagnosis")');
console.log('2. 按回车即可看到最后一次诊断结果\n');

console.log('方法 4: 在详情页面直接查看');
console.log('---------------------------------------');
console.log('1. 完成 AI 分析后');
console.log('2. 页面会自动跳转到详情页');
console.log('3. 在"诊断建议"卡片中查看');
console.log('4. 可以点击"复制建议"按钮复制文本\n');

console.log('=' .repeat(60));

console.log('\n🎯 快速测试：\n');
console.log('1. 确保项目正在运行：npm run dev');
console.log('2. 访问：http://localhost:3001');
console.log('3. 上传一张肺部影像');
console.log('4. 点击"开始 AI 分析"');
console.log('5. 等待 10-15 秒');
console.log('6. 查看终端或浏览器控制台的输出\n');

console.log('💡 提示：');
console.log('- 终端输出：服务端日志，显示原始文本');
console.log('- 浏览器控制台：客户端日志，带颜色格式化');
console.log('- 详情页面：用户界面，格式化显示\n');

console.log('📚 更多信息请查看：AI_SETUP.md\n');

