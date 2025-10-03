# 🔍 诊断建议不显示 - 问题排查指南

## 问题：AI 诊断结果没有显示在"诊断建议"文本框内

---

## ✅ 快速诊断步骤

### 步骤 1: 检查 AI 分析是否成功

1. **在终端查看**（运行 npm run dev 的窗口）
   - 查找这行：`POST /api/analyze 200 in xxxms`
   - 如果看到 200，说明 API 调用成功
   - 查找：`========== AI 诊断结果 ==========`
   - 如果能看到诊断文本，说明 AI 返回成功

2. **在浏览器控制台查看**（F12 → Console）
   - 上传图片后查找：`AI 诊断结果`
   - 检查是否有错误信息（红色）

### 步骤 2: 检查 SessionStorage

在浏览器控制台（F12 → Console）输入：

```javascript
// 检查 AI 诊断是否保存
console.log('AI诊断:', sessionStorage.getItem('aiDiagnosis'));

// 检查文件是否保存
console.log('文件:', sessionStorage.getItem('uploadedFiles'));
```

**预期结果：**
- `aiDiagnosis` 应该有内容（AI 诊断文本）
- `uploadedFiles` 应该有内容（文件数据）

### 步骤 3: 检查页面状态

在详情页的浏览器控制台查看：

```javascript
// 应该能看到这些日志
// 🔍 检查 sessionStorage
// ✅ 已加载 AI 诊断结果
// 📝 诊断文本: ...
```

---

## 🐛 常见问题及解决方案

### 问题 1: SessionStorage 中没有 aiDiagnosis

**症状：**
```javascript
sessionStorage.getItem('aiDiagnosis')  // 返回 null
```

**原因：**
- AI 分析失败
- API 调用出错
- 跳转太快，还没保存

**解决方案：**

#### 方案 A: 检查 API 错误
在浏览器控制台查看是否有错误：
```
AI 分析失败: ...
```

如果有错误，检查：
1. API Key 是否正确配置
2. 网络连接是否正常
3. SiliconFlow 服务是否可用

#### 方案 B: 等待 AI 完成
确保看到"AI 分析中..."变回"开始 AI 分析"再跳转

#### 方案 C: 手动测试 API
在浏览器控制台：
```javascript
// 测试 API 是否工作
fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageData: 'data:image/png;base64,test' })
})
.then(r => r.json())
.then(d => console.log('API响应:', d))
.catch(e => console.error('API错误:', e));
```

---

### 问题 2: SessionStorage 有数据但页面不显示

**症状：**
```javascript
sessionStorage.getItem('aiDiagnosis')  // 有内容
// 但页面显示："正在加载 AI 诊断结果..." 或默认文本
```

**原因：**
- 组件加载顺序问题
- 状态更新失败

**解决方案：**

#### 方案 A: 强制刷新页面
按 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac)

#### 方案 B: 清除缓存重试
```javascript
// 在浏览器控制台
sessionStorage.clear();
location.href = '/';
// 重新上传和分析
```

#### 方案 C: 手动设置诊断文本
在详情页浏览器控制台：
```javascript
// 获取诊断文本
const diagnosis = sessionStorage.getItem('aiDiagnosis');
console.log('诊断内容:', diagnosis);

// 如果有内容但没显示，检查页面元素
document.querySelector('.text-sm.whitespace-pre-wrap').textContent = diagnosis;
```

---

### 问题 3: 显示"正在加载 AI 诊断结果..."

**症状：**
页面一直显示初始状态文本

**原因：**
- `isClient` 状态未正确设置
- useEffect 未执行

**解决方案：**

在详情页控制台检查：
```javascript
// 检查是否在客户端
console.log('window 存在?', typeof window !== 'undefined');
console.log('sessionStorage 存在?', typeof sessionStorage !== 'undefined');
```

如果都返回 true，但还是不显示，尝试：
```javascript
// 强制触发加载
location.reload();
```

---

### 问题 4: 显示默认诊断文本而非 AI 文本

**症状：**
显示硬编码的默认文本：
"综合风险评分为高。建议进行进一步的活检..."

**原因：**
- SessionStorage 中没有 AI 诊断
- AI 分析可能失败了

**解决方案：**

1. **检查是否真的完成了 AI 分析**
   - 查看终端是否有 AI 诊断输出
   - 查看浏览器控制台是否有成功日志

2. **重新分析**
   - 返回首页
   - 重新上传图片
   - 等待完整的 AI 分析过程（12-15秒）
   - 确保看到"AI 分析中..."的状态

---

## 🔧 完整诊断流程

### 第 1 步：开始新的测试

```bash
# 1. 停止当前服务器（如果在运行）
# 按 Ctrl+C

# 2. 清除浏览器缓存
# 在浏览器控制台执行：
sessionStorage.clear();
localStorage.clear();

# 3. 重启服务器
npm run dev
```

### 第 2 步：详细测试流程

1. **打开浏览器控制台**（F12 → Console）

2. **访问首页** http://localhost:3001

3. **上传图片**
   - 选择一张肺部影像
   - 确认文件列表中显示文件

4. **点击"开始 AI 分析"**
   - 观察按钮变为"AI 分析中..."
   - **不要关闭或刷新页面**

5. **同时观察三个地方：**
   
   **终端窗口：**
   ```
   POST /api/analyze 200 in 12333ms
   ========== AI 诊断结果 ==========
   【诊断文本】
   ================================
   ```
   
   **浏览器控制台：**
   ```
   ========== AI 诊断结果 ==========
   【诊断文本】
   ================================
   ```
   
   **SessionStorage：**
   输入 `sessionStorage.getItem('aiDiagnosis')` 应该返回文本

6. **等待自动跳转到详情页**

7. **在详情页检查：**
   - 浏览器控制台应该显示：
     ```
     🔍 检查 sessionStorage
     ✅ 已加载 AI 诊断结果
     📝 诊断文本: ...
     ```
   - 页面"诊断建议"区域应显示 AI 文本

---

## 📊 调试命令清单

### 在浏览器控制台执行：

```javascript
// === 基本检查 ===
console.log('1. 检查环境');
console.log('  客户端?', typeof window !== 'undefined');
console.log('  Storage可用?', typeof sessionStorage !== 'undefined');

console.log('\n2. 检查数据');
console.log('  AI诊断:', sessionStorage.getItem('aiDiagnosis'));
console.log('  文件数据:', sessionStorage.getItem('uploadedFiles'));

console.log('\n3. 检查诊断长度');
const diagnosis = sessionStorage.getItem('aiDiagnosis');
console.log('  长度:', diagnosis?.length || 0);
console.log('  预览:', diagnosis?.substring(0, 200));

// === 高级调试 ===
console.log('\n4. 所有 SessionStorage 数据');
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  console.log(`  ${key}:`, sessionStorage.getItem(key)?.substring(0, 50) + '...');
}

// === 测试 API ===
console.log('\n5. 测试 API 连接');
fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' 
  })
})
.then(r => r.json())
.then(d => console.log('  API响应:', d))
.catch(e => console.error('  API错误:', e));
```

---

## ✅ 成功标志

如果一切正常，你应该看到：

### 在终端：
```
POST /api/analyze 200 in 12333ms

========== AI 诊断结果 ==========
根据提供的肺部影像分析：
【完整的诊断文本】
================================

Token 使用情况:
- 提示词:  1234
- 生成:  567
- 总计:  1801
```

### 在浏览器控制台：
```
========== AI 诊断结果 ==========  (蓝色)
【AI 诊断文本】
================================  (蓝色)

Token 使用情况:  (绿色)
提示词: 1234 | 生成: 567 | 总计: 1801

🔍 检查 sessionStorage
✅ 已加载 AI 诊断结果
📝 诊断文本: ...
```

### 在详情页面：
- "诊断建议"卡片显示完整的 AI 诊断文本
- 不是"正在加载..."
- 不是默认的硬编码文本

---

## 🆘 还是不行？

### 最后的排查方法：

1. **查看网络请求**
   - F12 → Network 标签
   - 刷新页面重新分析
   - 找到 `analyze` 请求
   - 查看 Response 是否包含 diagnosis

2. **查看完整日志**
   - 保存终端所有输出
   - 保存浏览器控制台所有输出
   - 检查是否有红色错误

3. **尝试最小化测试**
   ```javascript
   // 在详情页控制台直接设置
   sessionStorage.setItem('aiDiagnosis', '这是测试诊断文本');
   location.reload();
   // 如果能显示，说明代码逻辑正确，问题在数据保存环节
   ```

---

## 📞 获取帮助

如果以上方法都无法解决，请提供：

1. 终端完整输出（包含 AI 诊断部分）
2. 浏览器控制台完整输出
3. `sessionStorage.getItem('aiDiagnosis')` 的返回值
4. 详情页控制台的日志
5. Network 标签中 `/api/analyze` 的响应

这样我们可以精确定位问题！

---

**现在就试试上面的诊断步骤吧！** 🔍

