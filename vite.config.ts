import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/analyze-family' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { parentSurvey, studentSurvey } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'NO_API_KEY', fallback: true }));
                return;
              }

              const ai = new GoogleGenAI({ apiKey });
              const prompt = `你是一位資深家庭心理學家與親職教育專家，具備極高情商、同理心與溫暖文字風格。
請根據以下家長與學生的問卷填寫結果，進行深度的「雙向認知對照分析」：

【家長填寫資料】：
- 認為孩子拿手的科目：${(parentSurvey?.goodSubjects || []).join(', ') || '無'}
- 認為孩子有挑戰性的科目：${(parentSurvey?.challengingSubjects || []).join(', ') || '無'}
- 每天監督作業情況：${parentSurvey?.supervisionDaily}
- 家長自評教養態度光譜（0為極度開明，100為極度嚴格/封閉）：${parentSurvey?.parentingAttitudeSelf}
- 家長猜測孩子感受到的光譜（0~100）：${parentSurvey?.parentingAttitudeChildPerception}
- 孩子年級：${parentSurvey?.childGrade}
- 同意被提出的獎勵類型：${(parentSurvey?.allowedRewardTypes || []).join(', ')}

【學生填寫資料】：
- 暱稱：${studentSurvey?.nickname}，年級：${studentSurvey?.childGrade}
- 自己覺得拿手的科目：${(studentSurvey?.goodSubjects || []).join(', ') || '無'}
- 自己覺得有挑戰性的科目：${(studentSurvey?.challengingSubjects || []).join(', ') || '無'}
- 感受到的監督頻率：${studentSurvey?.feltSupervision}
- 學生感受到的父母教養態度光譜（0~100）：${studentSurvey?.feltParentingAttitude}
- 希望的獎勵模式：${(studentSurvey?.desiredRewardModes || []).join(', ')}
- 願望目標：${studentSurvey?.wishGoal || '無'}

請以 JSON 格式回應，不要使用 markdown 標籤或額外文字，格式嚴格如下：
{
  "compatibilityScore": 92,
  "understandingScore": 88,
  "connectionScore": 95,
  "gentleSummary": "一段充滿溫度、委婉動人且具包容性的整體家庭評語（約120字）",
  "masteryAnalysis": "詳細分析父母對孩子學習狀況的掌握度與彼此的連結深度（約150字）",
  "attitudeSpectrumAnalysis": "針對家長自評與孩子實際感受的光譜落差進行同理與心理學分析（約120字）",
  "subjectAlignmentAnalysis": "針對雙方在拿手與挑戰科目的認知契合度提供引導建議（約100字）",
  "gapHighlights": [
    {
      "topic": "主題名稱（如：學科自信掌握度 / 教養嚴格度感知 / 情感獎勵期待）",
      "parentView": "家長的看法摘要",
      "studentView": "學生的看法摘要",
      "coachTip": "專家的委婉搭橋建議"
    }
  ],
  "parentTips": [
    "給父母的具體暖心建議1",
    "給父母的具體暖心建議2",
    "給父母的具體暖心建議3"
  ],
  "studentTips": [
    "給學生的貼心行動建議1",
    "給學生的貼心行動建議2"
  ]
}`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.7-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                },
              });

              const text = response.text || '{}';
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(text);
            } catch (err: any) {
              console.error('Gemini API Error in middleware:', err);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Server error', fallback: true }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
