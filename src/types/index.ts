export type UserRole = 'parent' | 'student';

export type RewardCategory = 'material' | 'virtual' | 'emotional';

export interface ParentContract {
  signed: boolean;
  signatureText: string;
  signatureImage?: string;
  signedAt?: string;
}

export interface StudentContract {
  signed: boolean;
  signatureText: string;
  signatureImage?: string;
  signedAt?: string;
}

export interface SubscriptionPlan {
  id: 'monthly' | 'yearly' | 'grade_span';
  name: string;
  price: number;
  originalPrice?: number;
  periodText: string;
  badge?: string;
  description: string;
  features: string[];
}

export interface ParentSurvey {
  goodSubjects: string[];
  challengingSubjects: string[];
  supervisionDaily: string;
  parentingAttitudeSelf: number; // 0 = 最開明, 100 = 最嚴格/規矩
  parentingAttitudeChildPerception: number; // 0 = 最開明, 100 = 最嚴格/規矩
  childGrade: string;
  allowedRewardTypes: RewardCategory[];
  completedAt: string;
}

export interface StudentSurvey {
  nickname: string;
  childGrade: string;
  goodSubjects: string[];
  challengingSubjects: string[];
  feltSupervision: string;
  feltParentingAttitude: number; // 0 = 最開明, 100 = 最嚴格/規矩
  desiredRewardModes: RewardCategory[];
  wishGoal?: string;
  completedAt: string;
}

export interface AIAnalysisResult {
  compatibilityScore: number;
  understandingScore: number;
  connectionScore: number;
  gentleSummary: string; // 給彼此的溫暖叮嚀
  masteryAnalysis: string; // 課業理解與陪伴默契
  attitudeSpectrumAnalysis: string; // 光譜同頻對照
  subjectAlignmentAnalysis: string; // 學科認知默契
  gapHighlights: {
    topic: string;
    parentView: string;
    studentView: string;
    coachTip: string;
  }[];
  parentTips: string[];
  studentTips: string[];
  generatedAt: string;
}

export type UnitStatus = 'not_started' | 'in_progress' | 'completed';

export interface UnitProgress {
  unitId: string;
  subject: string;
  grade: string;
  semester: '上學期' | '下學期';
  unitCode: string; // e.g. "單元一", "1-1"
  unitName: string;
  description: string;
  keyPoints?: string[]; // 核心學習概念
  isCompleted: boolean;
  status: UnitStatus;
  completedAt?: string;
  studentNotes?: string;
}

export interface RewardWish {
  id: string;
  title: string;
  category: RewardCategory;
  effortCommitment: string; // 孩子自己承諾付出的努力
  status: 'pending' | 'condition_set' | 'approved' | 'claimed';
  createdAt: string;
  parentRequirement?: {
    requiredUnitRange?: string; // 例如 "完成數學【異分母分數加減】單元"
    customNote?: string;
    setAt?: string;
  };
  emotionalQuestion?: string; // 情感真心話問題
  emotionalAnswer?: string; // 父母的真心話回覆
  completedAt?: string;
}

export interface FamilyAccount {
  id: string;
  inviteCode: string;
  createdAt: string;
  parentContract: ParentContract;
  studentContract: StudentContract;
  subscription: {
    planId: 'monthly' | 'yearly' | 'grade_span';
    planName: string;
    price: number;
    paid: boolean;
    paidAt?: string;
    linePayTransactionId?: string;
  };
  credentials: {
    parent: {
      username: string;
      password?: string;
      isSet: boolean;
    };
    student: {
      username: string;
      password?: string;
      isSet: boolean;
    };
  };
  parentSurvey?: ParentSurvey;
  studentSurvey?: StudentSurvey;
  aiAnalysis?: AIAnalysisResult;
  units: UnitProgress[];
  wishes: RewardWish[];
}
