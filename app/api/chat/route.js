import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const formData = await request.formData();
    const message = formData.get('message');
    const file = formData.get('file');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `넌 전세 사기 방지 정보를 알려주는 챗봇이야. 부동산 관련 지식이 적은 사용자들을 대상으로 전세 계약시 가이드라인을 제공하고, 실 계약 진행 시 체크리스트 및 AI를 활용한 문서 검토 서비스를 제공해. 질문에 간결하게 답변해. 답변에서 이모티콘은 쓰지 말고 텍스트로만 답변해.  

사용자의 질문: ${message}`;

    let content = [{ text: prompt }];

    if (file) {
      const fileBuffer = await file.arrayBuffer();
      const fileBase64 = Buffer.from(fileBuffer).toString('base64');
      content.push({
        inlineData: {
          mimeType: file.type,
          data: fileBase64
        }
      });
    }

    const result = await model.generateContent(content);
    const response = await result.response;
    const responseText = await response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: '요청을 처리하는 동안 오류가 발생했습니다.' }, { status: 500 });
  }
}
