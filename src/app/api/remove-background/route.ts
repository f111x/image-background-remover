import { NextRequest, NextResponse } from 'next/server';

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: '没有上传图片' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: '不支持的图片格式，请上传 JPG、PNG 或 WEBP 格式' },
        { status: 400 }
      );
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: '图片大小不能超过 5MB' },
        { status: 400 }
      );
    }

    if (!REMOVE_BG_API_KEY) {
      return NextResponse.json(
        { error: 'API 密钥未配置，请联系管理员' },
        { status: 500 }
      );
    }

    // 转换为 base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    // 使用 FormData 调用 Remove.bg API
    const apiFormData = new FormData();
    apiFormData.append('image_file_b64', base64Image);
    apiFormData.append('size', 'auto');
    apiFormData.append('output_format', 'png');
    apiFormData.append('output_info', 'true');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', errorText);

      if (response.status === 402) {
        return NextResponse.json(
          { error: 'API 调用次数已用完，请稍后再试' },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { error: '图片处理失败，请稍后重试' },
        { status: 500 }
      );
    }

    // 获取处理后的图片
    const resultBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${resultBase64}`,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: '处理图片时发生错误，请稍后重试' },
      { status: 500 }
    );
  }
}
