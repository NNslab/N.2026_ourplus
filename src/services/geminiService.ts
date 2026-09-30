import { ParentSurvey, StudentSurvey, AIAnalysisResult } from '../types';

export const geminiService = {
  async analyzeFamilySurvey(parentSurvey: ParentSurvey, studentSurvey: StudentSurvey): Promise<AIAnalysisResult> {
    // Generate an instant, heartfelt psychological bridge analysis full of human warmth
    return generateWarmHeartToHeartReport(parentSurvey, studentSurvey);
  },
};

export function generateWarmHeartToHeartReport(parent: ParentSurvey, student: StudentSurvey): AIAnalysisResult {
  // Calculate spectrum difference
  const parentSelf = parent.parentingAttitudeSelf ?? 25;
  const studentFelt = student.feltParentingAttitude ?? 35;
  const spectrumGap = Math.abs(parentSelf - studentFelt);

  // Subject overlaps
  const parentGood = new Set(parent.goodSubjects || []);
  const studentGood = new Set(student.goodSubjects || []);
  const parentHard = new Set(parent.challengingSubjects || []);
  const studentHard = new Set(student.challengingSubjects || []);

  const goodOverlap = [...studentGood].filter((s) => parentGood.has(s));
  const studentHiddenGood = [...studentGood].filter((s) => !parentGood.has(s));
  const studentSecretHard = [...studentHard].filter((s) => !parentHard.has(s));

  // Score calculations
  const understandingScore = Math.max(75, Math.min(98, 100 - spectrumGap * 0.4 - studentSecretHard.length * 4));
  const compatibilityScore = Math.max(78, Math.min(98, 96 - spectrumGap * 0.3));
  const connectionScore = Math.max(82, Math.min(99, 92 + goodOverlap.length * 2 - spectrumGap * 0.2));

  // Warm, genuine gentle summary
  let gentleSummary = `這是一個彼此深深在乎、渴望真誠陪伴的溫馨家庭。`;
  if (spectrumGap <= 15) {
    gentleSummary += ` 父母與${student.nickname || '孩子'}在教養氛圍的感知上非常貼近（心靈光譜落差僅 ${spectrumGap}%），這份難得的信任與默契，能讓孩子在感到被充分理解的環境中自律成長。`;
  } else if (parentSelf < studentFelt) {
    gentleSummary += ` 爸爸媽媽自許給予開明自由的空間，而${student.nickname || '孩子'}在日常中其實也感受到了父母無形的期望與關心；只要多一點放鬆的日常聊天，這份愛就會流動得更自在。`;
  } else {
    gentleSummary += ` 爸爸媽媽對自己有著嚴謹的期許，而${student.nickname || '孩子'}感受到的是比想像中更多的包容與支持，這是一份非常珍貴的家庭羈絆。`;
  }

  // Mastery analysis
  let masteryAnalysis = `在學科進度上，父母準確看見了孩子在「${goodOverlap.join('、') || '拿手科目'}」的亮眼表現。`;
  if (studentSecretHard.length > 0) {
    masteryAnalysis += ` 值得一提的是，${student.nickname || '孩子'}在「${studentSecretHard.join('、')}」上默默感到些許吃力，因為不想讓父母擔心而少有抱怨；若爸爸媽媽能主動以「今天有哪裡覺得比較不容易嗎？」來關心，能給孩子極大的安心感。`;
  } else {
    masteryAnalysis += ` 雙方對於學科優勢與挑戰科目的認知非常一致，展現出高度的信任與透明度。`;
  }

  // Spectrum analysis
  let attitudeSpectrumAnalysis = `【教養開明度感知對照】：家長自評開明指數為 ${100 - parentSelf} 分，孩子感受到的開明指數為 ${100 - studentFelt} 分。`;
  if (spectrumGap <= 15) {
    attitudeSpectrumAnalysis += ` 雙方心中的溫度幾乎完全一致，代表家中的日常交流真誠且有效。`;
  } else {
    attitudeSpectrumAnalysis += ` 些許的感知落差是孩子探索自主邊界時的自然反應，這份落差不是隔閡，而是彼此更深入了解的契機。`;
  }

  // Subject alignment
  let subjectAlignmentAnalysis = `雙方在學科上的默契非常好。建議以孩子的「${[...studentGood][0] || '優勢科目'}」為成功起點，把這份自信帶入其他單元的複習之中。`;

  // Gap highlights
  const gapHighlights = [
    {
      topic: '課業挑戰與心靈心聲',
      parentView: parentHard.size > 0 ? `認為孩子在 ${[...parentHard].join('、')} 較需要時間適應` : '整體步調良好，持續保持即可',
      studentView: studentHard.size > 0 ? `自己覺得在 ${[...studentHard].join('、')} 偶爾容易卡關或疲憊` : '希望有更多時間探索自己的興趣',
      coachTip: `建議家長在孩子完成單元打卡時，先給予一句「今天辛苦了，為你的自律點讚！」，用支持取代催促。`,
    },
    {
      topic: '家庭溫度與放鬆彈性',
      parentView: `自評開明度為 ${100 - parentSelf}%，希望給予孩子充分的自我管理空間`,
      studentView: `感受到 ${100 - studentFelt}% 的開明度，期待更多無條件的肯定與擁抱`,
      coachTip: `在提醒功課時加入一句「我相信你能安排好自己的時間」，能把要求轉化為對孩子的信任與賦能。`,
    },
    {
      topic: '許願池與努力回饋',
      parentView: `已開放多元獎勵類型，鼓勵孩子主動提出期待`,
      studentView: `希望獲得 ${student.desiredRewardModes?.map((m) => (m === 'material' ? '實質獎勵' : m === 'virtual' ? '休閒特權' : '爸媽的真心話小秘密')).join('、') || '心願獎勵'}`,
      coachTip: `特別推薦多啟動「情感真心話獎勵」，讓孩子了解爸媽成長時的故事，是加深親密感的最好方式。`,
    },
  ];

  return {
    compatibilityScore: Math.round(compatibilityScore),
    understandingScore: Math.round(understandingScore),
    connectionScore: Math.round(connectionScore),
    gentleSummary,
    masteryAnalysis,
    attitudeSpectrumAnalysis,
    subjectAlignmentAnalysis,
    gapHighlights,
    parentTips: [
      `當孩子遇到吃力科目時，先溫柔傾聽他的想法，避免在第一時間說出道理或建議。`,
      `在願望池中善用「單元進度完成」作為加碼條件，並在孩子達成時給予真誠的讚許。`,
      `每週安排 15 分鐘的「無手機真心話時光」，聽聽孩子在學校經歷的小故事。`,
    ],
    studentTips: [
      `遇到比較難的單元，勇敢誠實地跟爸爸媽媽求助，這是自律與負責的勇敢表現。`,
      `在進度選單打卡完成後主動跟爸媽分享成果，感受一步一腳印的成就感！`,
      `記得偶爾給辛苦照顧你的爸爸媽媽一個擁抱，一句「謝謝爸媽」就是最溫暖的禮物。`,
    ],
    generatedAt: new Date().toISOString(),
  };
}
