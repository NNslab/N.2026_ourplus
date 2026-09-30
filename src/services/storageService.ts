import { FamilyAccount, ParentSurvey, StudentSurvey, AIAnalysisResult, RewardWish, UnitProgress, SubscriptionPlan, UnitStatus } from '../types';
import { MASTER_CURRICULUM_UNITS } from '../data/mockCurriculum';

const STORAGE_KEY = 'our_plus_family_data_v3';
const CURRENT_ROLE_KEY = 'our_plus_active_role_v3';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: '單月隨心體驗',
    price: 299,
    originalPrice: 399,
    periodText: '/ 月',
    description: '適合彈性體驗家庭雙向公約與自主打卡氛圍',
    features: [
      '家長與學生專屬雙獨立帳號',
      '開明與誠實雙向公約存證',
      '國小至國中專屬學科自主進度選單',
      '親子願望池與加碼激勵條件',
      '家庭心靈默契卡與給彼此的真心話',
    ],
  },
  {
    id: 'yearly',
    name: '年度溫暖陪伴方案',
    price: 1680,
    originalPrice: 3588,
    periodText: '/ 年',
    badge: '最受歡迎・省 53%',
    description: '一整年不間斷的溫暖守護，打造最融洽的家庭默契',
    features: [
      '包含單月方案所有功能',
      '折合每月僅約 NT$ 140',
      '雙向教養態度光譜同頻對照',
      '情感獎勵專屬「爸媽的小秘密」時空信箱',
      '學科進度自律打卡與學習心得筆記',
      '溫暖親職陪伴小叮嚀',
    ],
  },
  {
    id: 'grade_span',
    name: '國小六年 / 國中三年成長全期',
    price: 4580,
    originalPrice: 9900,
    periodText: '/ 整個學制階段',
    badge: '終極超值・一約到底',
    description: '陪伴孩子度過國小或國中完整階段，見證每一步自律與成長',
    features: [
      '買斷國小 6 年 或 國中 3 年完整學程',
      '歷年學習紀錄與溫暖回憶永久保存',
      '無限次家庭心靈默契卡與真心話對話',
      '專屬客製化實質/休閒/情感激勵合約',
      '教育部 108 課綱最新各年級學科單元更新',
      '家庭成員多裝置即時同步',
    ],
  },
];

export const INITIAL_WISHES: RewardWish[] = [
  {
    id: 'wish-1',
    title: '週末全家一起去吃日式拉麵＋逛書店挑一本自然科學漫畫',
    category: 'material',
    effortCommitment: '我承諾本週一到五每天在 19:30 前主動把學校功課和各科進度完成打卡，不讓爸爸媽媽催促！',
    status: 'condition_set',
    createdAt: '2026-08-14T10:00:00Z',
    parentRequirement: {
      requiredUnitRange: '完成【數學】整數乘除與因數倍數單元、以及【自然科學】太陽與星星單元',
      customNote: '寶貝加油！只要將這幾個單元踏實複習完成，爸爸媽媽一定帶你去吃最愛的那家拉麵！',
      setAt: '2026-08-14T14:30:00Z',
    },
  },
  {
    id: 'wish-2',
    title: '週六晚上可以多玩 45 分鐘 Switch 遊戲',
    category: 'virtual',
    effortCommitment: '我會先把英語 Unit 1 和國語第一單元都完成複習，且週六早上先把房間整理乾淨。',
    status: 'approved',
    createdAt: '2026-08-15T16:20:00Z',
    parentRequirement: {
      requiredUnitRange: '完成英語 Unit 1 複習',
      customNote: '答應你！記得自律控制用眼時間喔，媽媽為你的認真感到驕傲。',
      setAt: '2026-08-15T18:00:00Z',
    },
  },
  {
    id: 'wish-3',
    title: '想聽爸爸講講「國小時候最勇敢的一件冒險或糗事」',
    category: 'emotional',
    effortCommitment: '我這週每天都會主動幫忙擺碗筷與倒垃圾，並且認真聽爸爸分享！',
    status: 'claimed',
    createdAt: '2026-08-11T20:00:00Z',
    emotionalQuestion: '爸爸小時候有沒有做過什麼連爺爺奶奶都不知道的超刺激冒險？',
    emotionalAnswer: '哈哈！爸爸小學四年級時，跟同學在鄉下秘密蓋了一座秘密基地樹屋，結果把家裡的舊床單拿去當帳篷，被奶奶找了三天！後來我們把樹屋變成了讀書小天地呢。',
    completedAt: '2026-08-12T21:00:00Z',
  },
];

export const INITIAL_DEMO_FAMILY: FamilyAccount = {
  id: 'FAM-2026-88',
  inviteCode: 'OUR-PLUS-8829',
  createdAt: '2026-08-01T08:00:00Z',
  parentContract: {
    signed: true,
    signatureText: '陳明遠（爸爸）',
    signedAt: '2026-08-01T08:15:00Z',
  },
  studentContract: {
    signed: true,
    signatureText: '陳小宇（孩子）',
    signedAt: '2026-08-01T08:20:00Z',
  },
  subscription: {
    planId: 'yearly',
    planName: '年度溫暖陪伴方案',
    price: 1680,
    paid: true,
    paidAt: '2026-08-01T08:25:00Z',
    linePayTransactionId: 'LP-2026080188293341',
  },
  credentials: {
    parent: {
      username: 'P-OUR-8829',
      password: 'password123',
      isSet: true,
    },
    student: {
      username: 'S-OUR-8829',
      password: 'password123',
      isSet: true,
    },
  },
  parentSurvey: {
    goodSubjects: ['數學', '英語'],
    challengingSubjects: ['國語文', '社會領域'],
    supervisionDaily: 'often', // 經常陪伴但希望培養自主
    parentingAttitudeSelf: 25, // 偏開明 (0~100)
    parentingAttitudeChildPerception: 40, // 父母猜孩子覺得自己有些要求
    childGrade: '國小五年級',
    allowedRewardTypes: ['material', 'virtual', 'emotional'],
    completedAt: '2026-08-01T09:00:00Z',
  },
  studentSurvey: {
    nickname: '小宇',
    childGrade: '國小五年級',
    goodSubjects: ['數學', '自然科學'],
    challengingSubjects: ['國語文', '英語'],
    feltSupervision: 'often',
    feltParentingAttitude: 35, // 孩子覺得爸媽蠻好溝通但有時會急
    desiredRewardModes: ['material', 'virtual', 'emotional'],
    wishGoal: '希望這學期數學能一直保持名列前茅，各科進度都能自主踏實完成，也能多跟爸媽聊聊學校的事情！',
    completedAt: '2026-08-01T09:10:00Z',
  },
  aiAnalysis: {
    compatibilityScore: 92,
    understandingScore: 88,
    connectionScore: 95,
    gentleSummary: '這是一個充滿彼此尊重與深度愛意的溫暖家庭。父母展現了很高的包容度與同理傾聽的心態，而小宇也以真誠自律的回應來維繫對父母的信任。雙方在心靈光譜上的感知非常貼近，彼此的愛與支持流動得非常自然。',
    masteryAnalysis: '父母對小宇「數學優勢」與「國語挑戰」有極高的了解（默契度達 90%）；小宇在「自然科學」表現出超出預期的濃厚興趣。家庭溝通管道非常順暢，彼此感受到的溫度十分同頻。',
    attitudeSpectrumAnalysis: '父母自評開明度為 25（非常開明信任），小宇感受到的為 35（親切但偶爾有期望壓力）。這段 10 分的落差屬於「良性關懷」，只要父母在提醒課業時多加入一句溫暖的問候（如「今天在學校辛苦囉」），就能讓這份深切的愛被完全接收。',
    subjectAlignmentAnalysis: '父母與孩子在「數學」及「國語挑戰」的認知完全契合。在「英語」方面，小宇其實感受到了些許挑戰與緊張，父母若能以輕鬆繪本或生活對話切入，將能大幅卸下孩子的學習壓力。',
    gapHighlights: [
      {
        topic: '學習挑戰與心靈心聲',
        parentView: '認為英語是孩子的強項之一，不用過於操心',
        studentView: '小宇坦承在英語文法與背單字上有些許吃力',
        coachTip: '建議家長可以在晚餐時一起聊聊課文故事，將「期待」轉化為「一起探索」的陪伴樂趣。',
      },
      {
        topic: '家庭溫度與放鬆彈性',
        parentView: '自認很開明，平時多給予孩子自主約定空間',
        studentView: '感受到了爸媽的期待，有時怕表現不好讓爸媽失望',
        coachTip: '家長可適時對孩子說：「不管進度快慢，我們最欣賞的是你認真自律的過程」，給予孩子充足的心理安全感。',
      },
      {
        topic: '情感連結與願望期待',
        parentView: '開放所有獎勵類型，鼓勵孩子多許願',
        studentView: '非常渴望聽到爸媽以前小時候的故事（情感真心話）',
        coachTip: '情感獎勵是滋養親密感最好的養分！睡前分享一個爸媽年輕時的糗事，能讓孩子感受到父母也是溫暖真實的成長夥伴。',
      },
    ],
    parentTips: [
      '當孩子遇到困難科目（如國語作文）時，先溫柔聆聽他的感受，避免第一時間給予批評。',
      '在許願池中多利用「單元進度完成」給予肯定，並記得在達成時給孩子一個溫暖的擁抱。',
      '每週安排一次專屬的「真心話時光」，營造無壓力的聊天氛圍。',
    ],
    studentTips: [
      '遇到不懂的章節，勇敢誠實地跟爸媽求助，這是自律與負責的勇敢表現。',
      '在進度選單打卡完成後向爸媽展示成果，分享你努力的成就感！',
      '謝謝爸爸媽媽開明的支持，在日常中用小小的感謝讓家更有溫度。',
    ],
    generatedAt: '2026-08-01T09:12:00Z',
  },
  units: MASTER_CURRICULUM_UNITS,
  wishes: INITIAL_WISHES,
};

export const storageService = {
  getFamilyData(): FamilyAccount {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_FAMILY));
        return INITIAL_DEMO_FAMILY;
      }
      const parsed: FamilyAccount = JSON.parse(raw);
      if (!parsed.units || parsed.units.length < MASTER_CURRICULUM_UNITS.length) {
        parsed.units = MASTER_CURRICULUM_UNITS;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load family data from localStorage', e);
      return INITIAL_DEMO_FAMILY;
    }
  },

  saveFamilyData(data: FamilyAccount): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save family data', e);
    }
  },

  resetToFresh(): FamilyAccount {
    const newId = `FAM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCode = `OUR-PLUS-${Math.floor(1000 + Math.random() * 9000)}`;
    const freshData: FamilyAccount = {
      id: newId,
      inviteCode: newCode,
      createdAt: new Date().toISOString(),
      parentContract: { signed: false, signatureText: '' },
      studentContract: { signed: false, signatureText: '' },
      subscription: {
        planId: 'yearly',
        planName: '年度溫暖陪伴方案',
        price: 1680,
        paid: false,
      },
      credentials: {
        parent: {
          username: `P-${newCode}`,
          isSet: false,
        },
        student: {
          username: `S-${newCode}`,
          isSet: false,
        },
      },
      units: MASTER_CURRICULUM_UNITS.map((u) => ({
        ...u,
        isCompleted: false,
        status: 'not_started',
        completedAt: undefined,
        studentNotes: undefined,
      })),
      wishes: [],
    };
    this.saveFamilyData(freshData);
    return freshData;
  },

  resetToDemo(): FamilyAccount {
    this.saveFamilyData(INITIAL_DEMO_FAMILY);
    return INITIAL_DEMO_FAMILY;
  },

  getActiveRole(): 'parent' | 'student' {
    return (localStorage.getItem(CURRENT_ROLE_KEY) as 'parent' | 'student') || 'parent';
  },

  setActiveRole(role: 'parent' | 'student'): void {
    localStorage.setItem(CURRENT_ROLE_KEY, role);
  },

  signParentContract(signatureText: string, signatureImage?: string): FamilyAccount {
    const data = this.getFamilyData();
    data.parentContract = {
      signed: true,
      signatureText,
      signatureImage,
      signedAt: new Date().toISOString(),
    };
    this.saveFamilyData(data);
    return data;
  },

  signStudentContract(signatureText: string, signatureImage?: string): FamilyAccount {
    const data = this.getFamilyData();
    data.studentContract = {
      signed: true,
      signatureText,
      signatureImage,
      signedAt: new Date().toISOString(),
    };
    this.saveFamilyData(data);
    return data;
  },

  completePayment(planId: 'monthly' | 'yearly' | 'grade_span'): FamilyAccount {
    const data = this.getFamilyData();
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[1];
    const txn = `LP-${Date.now().toString().slice(-10)}`;
    data.subscription = {
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      paid: true,
      paidAt: new Date().toISOString(),
      linePayTransactionId: txn,
    };
    if (!data.credentials.parent.username) {
      data.credentials.parent.username = `P-${data.inviteCode}`;
    }
    if (!data.credentials.student.username) {
      data.credentials.student.username = `S-${data.inviteCode}`;
    }
    this.saveFamilyData(data);
    return data;
  },

  setPassword(role: 'parent' | 'student', password: string): FamilyAccount {
    const data = this.getFamilyData();
    data.credentials[role].password = password;
    data.credentials[role].isSet = true;
    this.saveFamilyData(data);
    return data;
  },

  saveParentSurvey(survey: ParentSurvey): FamilyAccount {
    const data = this.getFamilyData();
    data.parentSurvey = survey;
    this.saveFamilyData(data);
    return data;
  },

  saveStudentSurvey(survey: StudentSurvey): FamilyAccount {
    const data = this.getFamilyData();
    data.studentSurvey = survey;
    this.saveFamilyData(data);
    return data;
  },

  saveAIAnalysis(analysis: AIAnalysisResult): FamilyAccount {
    const data = this.getFamilyData();
    data.aiAnalysis = analysis;
    this.saveFamilyData(data);
    return data;
  },

  toggleUnitComplete(unitId: string): FamilyAccount {
    const data = this.getFamilyData();
    data.units = data.units.map((u) => {
      if (u.unitId === unitId) {
        const nextCompleted = !u.isCompleted;
        return {
          ...u,
          isCompleted: nextCompleted,
          status: nextCompleted ? 'completed' : 'not_started',
          completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return u;
    });
    this.saveFamilyData(data);
    return data;
  },

  updateUnitStatus(unitId: string, status: UnitStatus, notes?: string): FamilyAccount {
    const data = this.getFamilyData();
    data.units = data.units.map((u) => {
      if (u.unitId === unitId) {
        return {
          ...u,
          status,
          isCompleted: status === 'completed',
          completedAt: status === 'completed' ? (u.completedAt || new Date().toISOString().split('T')[0]) : undefined,
          studentNotes: notes !== undefined ? notes : u.studentNotes,
        };
      }
      return u;
    });
    this.saveFamilyData(data);
    return data;
  },

  saveUnitNotes(unitId: string, notes: string): FamilyAccount {
    const data = this.getFamilyData();
    data.units = data.units.map((u) => {
      if (u.unitId === unitId) {
        return {
          ...u,
          studentNotes: notes,
        };
      }
      return u;
    });
    this.saveFamilyData(data);
    return data;
  },

  addWish(wish: Omit<RewardWish, 'id' | 'createdAt' | 'status'>): FamilyAccount {
    const data = this.getFamilyData();
    const newWish: RewardWish = {
      ...wish,
      id: `wish-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    data.wishes = [newWish, ...(data.wishes || [])];
    this.saveFamilyData(data);
    return data;
  },

  updateWishRequirement(wishId: string, requirement: { requiredUnitRange?: string; customNote?: string }): FamilyAccount {
    const data = this.getFamilyData();
    data.wishes = data.wishes.map((w) => {
      if (w.id === wishId) {
        return {
          ...w,
          status: 'condition_set',
          parentRequirement: {
            ...requirement,
            setAt: new Date().toISOString(),
          },
        };
      }
      return w;
    });
    this.saveFamilyData(data);
    return data;
  },

  approveWishDirectly(wishId: string, customNote?: string): FamilyAccount {
    const data = this.getFamilyData();
    data.wishes = data.wishes.map((w) => {
      if (w.id === wishId) {
        return {
          ...w,
          status: 'approved',
          parentRequirement: {
            customNote: customNote || '爸爸媽媽直接答應你的願望囉！為你的認真與自律點讚！',
            setAt: new Date().toISOString(),
          },
        };
      }
      return w;
    });
    this.saveFamilyData(data);
    return data;
  },

  claimWish(wishId: string, answerForEmotional?: string): FamilyAccount {
    const data = this.getFamilyData();
    data.wishes = data.wishes.map((w) => {
      if (w.id === wishId) {
        return {
          ...w,
          status: 'claimed',
          emotionalAnswer: answerForEmotional || w.emotionalAnswer,
          completedAt: new Date().toISOString(),
        };
      }
      return w;
    });
    this.saveFamilyData(data);
    return data;
  },
};
