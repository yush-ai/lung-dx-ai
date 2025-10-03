import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();
    
    // 从环境变量获取 API Key
    const apiKey = process.env.SILICONFLOW_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key 未配置' },
        { status: 500 }
      );
    }

    // 准备发送给 SiliconFlow 的请求
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2-VL-72B-Instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '请作为一名专业的放射科医生，仔细分析这张肺部医学影像（CT或X光片）。请详细描述：1. 是否发现肺结节；2. 如果有结节，描述其大小、位置、形态特征；3. 评估结节的恶性风险等级（低、中、高）；4. 给出专业的诊疗建议，包括是否需要进一步检查、随访建议等。请用中文专业医学术语回答，回答要简洁明了，重点突出。'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        stream: false,
        max_tokens: 2048,
        temperature: 0.3,
        top_p: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('SiliconFlow API 错误:', errorData);
      return NextResponse.json(
        { error: 'AI 分析失败', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // 提取 AI 的回复内容
    const diagnosis = data.choices?.[0]?.message?.content || '分析失败，请重试';

    // 输出 AI 诊断结果到控制台
    console.log('\n========== AI 诊断结果 ==========');
    console.log(diagnosis);
    console.log('================================\n');
    
    // 输出 token 使用情况
    if (data.usage) {
      console.log('Token 使用情况:');
      console.log('- 提示词: ', data.usage.prompt_tokens);
      console.log('- 生成: ', data.usage.completion_tokens);
      console.log('- 总计: ', data.usage.total_tokens);
      console.log('');
    }

    return NextResponse.json({
      success: true,
      diagnosis: diagnosis,
      usage: data.usage
    });

  } catch (error) {
    console.error('分析错误:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

