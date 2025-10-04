import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();
    
    // 从环境变量获取 Dify API Key
    const apiKey = process.env.DIFY_API_KEY || 'app-2w47heGKxFjwHjdvpMeqWQXY';
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Dify API Key 未配置' },
        { status: 500 }
      );
    }

    console.log('开始 AI 分析，使用 Dify 工作流 API');

    // 将 base64 数据转换为 Buffer
    const base64Data = imageData.split(',')[1];
    const mimeType = imageData.split(',')[0].split(':')[1].split(';')[0];
    const binaryData = Buffer.from(base64Data, 'base64');
    
    console.log('图片信息:', {
      mimeType,
      size: binaryData.length,
      sizeKB: (binaryData.length / 1024).toFixed(2) + ' KB'
    });

    // 步骤1: 按照 API 文档格式上传文件
    const extension = mimeType.split('/')[1] || 'png';
    const filename = `lung-image.${extension}`;
    
    // 创建 FormData
    const FormData = (await import('form-data')).default;
    const uploadFormData = new FormData();
    
    // 只添加必需的字段：file 和 user
    uploadFormData.append('file', binaryData, {
      filename: filename,
      contentType: mimeType
    });
    uploadFormData.append('user', 'lung-dx-user');

    console.log('步骤1: 上传文件到 Dify，文件名:', filename);

    try {
      // 使用 axios 发送请求，完全按照 API 文档格式
      const uploadResponse = await axios.post('https://api.dify.ai/v1/files/upload', uploadFormData, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          ...uploadFormData.getHeaders()
        },
        timeout: 30000
      });

      console.log('文件上传成功:', uploadResponse.data);
      
      const fileId = uploadResponse.data.id;
      if (!fileId) {
        console.error('未获取到文件 ID:', uploadResponse.data);
        return NextResponse.json(
          { error: '文件上传失败：未返回文件 ID' },
          { status: 500 }
        );
      }

      // 步骤2: 调用工作流，增加超时时间
      console.log('步骤2: 调用工作流，文件 ID:', fileId);
      console.log('开始时间:', new Date().toISOString());
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 增加到 2 分钟
      
      // 按照 API 文档的 InputFileObjectWorkflowCn 格式
      const requestBody = {
        inputs: {
          upload: {
            type: 'image',  // 必需字段：文件类型
            transfer_method: 'local_file',  // 必需字段：传递方式
            upload_file_id: fileId  // 必需字段：文件 ID
          }
        },
        response_mode: 'blocking',
        user: 'lung-dx-user'
      };
      
      console.log('发送给工作流的请求体:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch('https://api.dify.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('工作流调用完成时间:', new Date().toISOString());

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Dify API 错误:', errorData);
        return NextResponse.json(
          { error: 'AI 分析失败', details: errorData },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      console.log('Dify 返回的完整数据结构:', JSON.stringify(data, null, 2));
      
      // 提取 Dify 工作流的回复内容
      const diagnosis = data.data?.outputs?.text 
        || data.data?.outputs?.result
        || data.data?.outputs?.answer
        || data.answer 
        || data.message 
        || data.data?.outputs 
        || '分析失败，请重试';
      
      const usage = data.metadata?.usage || data.usage || null;

      // 输出 AI 诊断结果到控制台
      console.log('\n========== AI 诊断结果 ==========');
      console.log(diagnosis);
      console.log('================================\n');
      
      // 输出使用情况
      if (usage) {
        console.log('使用情况:');
        console.log('- 提示词: ', usage.prompt_tokens);
        console.log('- 生成: ', usage.completion_tokens);
        console.log('- 总计: ', usage.total_tokens);
        console.log('');
      }

      return NextResponse.json({
        success: true,
        diagnosis: diagnosis,
        usage: usage
      });

    } catch (uploadError: any) {
      if (uploadError.name === 'AbortError') {
        console.error('API 调用超时');
        return NextResponse.json(
          { error: 'AI 分析超时，请稍后重试' },
          { status: 408 }
        );
      }
      
      console.error('文件上传错误:', uploadError.response?.data || uploadError.message);
      return NextResponse.json(
        { error: '文件上传失败', details: uploadError.response?.data || uploadError.message },
        { status: uploadError.response?.status || 500 }
      );
    }

  } catch (error) {
    console.error('分析错误:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
