import React, { useState } from 'react';
import { UserRole, FamilyAccount, ParentSurvey, StudentSurvey, RewardCategory, AIAnalysisResult } from '../types';
import { GRADES } from '../data/mockCurriculum';
import { SpectrumSlider } from '../components/SpectrumSlider';
import { FamilyAIReportModal } from '../components/FamilyAIReportModal';
import { geminiService } from '../services/geminiService';
import { User, GraduationCap, Lock, CheckCircle2, Heart, Gift, Smartphone, MessageSquareHeart, ArrowRight, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FirstTimeSetupSurveyViewProps {
  familyData: FamilyAccount;
  activeRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onSavePassword: (role: UserRole, password: string) => void;
  onSaveParentSurvey: (survey: ParentSurvey) => void;
  onSaveStudentSurvey: (survey: StudentSurvey) => void;
  onSaveAIAnalysis: (analysis: AIAnalysisResult) => void;
  onProceedToDashboard: (role: UserRole) => void;
}

const SUBJECT_OPTIONS = ['國語文', '數學', '英語', '自然科學', '社會領域'];

export const FirstTimeSetupSurveyView: React.FC<FirstTimeSetupSurveyViewProps> = ({
  familyData,
  activeRole,
  onSavePassword,
  onSaveParentSurvey,
  onSaveStudentSurvey,
  onSaveAIAnalysis,
  onProceedToDashboard,
}) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(activeRole);

  // Password step states
  const isParentPwdSet = familyData.credentials.parent.isSet;
  const isStudentPwdSet = familyData.credentials.student.isSet;
  const [parentAccountInput] = useState(familyData.credentials.parent.username);
  const [parentPwdInput, setParentPwdInput] = useState('');
  const [studentAccountInput] = useState(familyData.credentials.student.username);
  const [studentPwdInput, setStudentPwdInput] = useState('');

  // Parent Survey State
  const [parentGoodSubjects, setParentGoodSubjects] = useState<string[]>(familyData.parentSurvey?.goodSubjects || ['數學', '英語']);
  const [parentHardSubjects, setParentHardSubjects] = useState<string[]>(familyData.parentSurvey?.challengingSubjects || ['國語文']);
  const [supervisionDaily, setSupervisionDaily] = useState<string>(familyData.parentSurvey?.supervisionDaily || 'often');
  const [parentAttitudeSelf, setParentAttitudeSelf] = useState<number>(familyData.parentSurvey?.parentingAttitudeSelf ?? 25);
  const [parentAttitudeChildPerception, setParentAttitudeChildPerception] = useState<number>(familyData.parentSurvey?.parentingAttitudeChildPerception ?? 35);
  const [childGrade, setChildGrade] = useState<string>(familyData.parentSurvey?.childGrade || '國小五年級');
  const [allowedRewards, setAllowedRewards] = useState<RewardCategory[]>(familyData.parentSurvey?.allowedRewardTypes || ['material', 'virtual', 'emotional']);

  // Student Survey State
  const [studentNickname, setStudentNickname] = useState<string>(familyData.studentSurvey?.nickname || '小宇');
  const [studentGrade, setStudentGrade] = useState<string>(familyData.studentSurvey?.childGrade || '國小五年級');
  const [studentGoodSubjects, setStudentGoodSubjects] = useState<string[]>(familyData.studentSurvey?.goodSubjects || ['數學', '自然科學']);
  const [studentHardSubjects, setStudentHardSubjects] = useState<string[]>(familyData.studentSurvey?.challengingSubjects || ['國語文', '英語']);
  const [studentFeltSupervision, setStudentFeltSupervision] = useState<string>(familyData.studentSurvey?.feltSupervision || 'often');
  const [studentFeltAttitude, setStudentFeltAttitude] = useState<number>(familyData.studentSurvey?.feltParentingAttitude ?? 35);
  const [desiredRewards, setDesiredRewards] = useState<RewardCategory[]>(familyData.studentSurvey?.desiredRewardModes || ['material', 'virtual', 'emotional']);
  const [studentWishGoal, setStudentWishGoal] = useState<string>(familyData.studentSurvey?.wishGoal || '希望數學一直保持信心，也能常和爸媽聊天！');

  const [showReportModal, setShowReportModal] = useState(false);

  const hasParentSurvey = !!familyData.parentSurvey;
  const hasStudentSurvey = !!familyData.studentSurvey;
  const bothSurveyDone = hasParentSurvey && hasStudentSurvey;

  const handleSetPassword = (role: UserRole, e: React.FormEvent) => {
    e.preventDefault();
    const pwd = role === 'parent' ? parentPwdInput : studentPwdInput;
    if (!pwd.trim()) return;
    onSavePassword(role, pwd.trim());
  };

  const handleToggleSubject = (sub: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(sub)) {
      setList(list.filter((s) => s !== sub));
    } else {
      setList([...list, sub]);
    }
  };

  const handleToggleRewardType = (type: RewardCategory, list: RewardCategory[], setList: (v: RewardCategory[]) => void) => {
    if (list.includes(type)) {
      if (list.length > 1) setList(list.filter((t) => t !== type));
    } else {
      setList([...list, type]);
    }
  };

  const handleSaveParentSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const survey: ParentSurvey = {
      goodSubjects: parentGoodSubjects,
      challengingSubjects: parentHardSubjects,
      supervisionDaily,
      parentingAttitudeSelf: parentAttitudeSelf,
      parentingAttitudeChildPerception: parentAttitudeChildPerception,
      childGrade,
      allowedRewardTypes: allowedRewards,
      completedAt: new Date().toISOString(),
    };
    onSaveParentSurvey(survey);
    if (familyData.studentSurvey) {
      triggerHeartToHeart(survey, familyData.studentSurvey);
    }
  };

  const handleSaveStudentSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const survey: StudentSurvey = {
      nickname: studentNickname.trim() || '孩子',
      childGrade: studentGrade,
      goodSubjects: studentGoodSubjects,
      challengingSubjects: studentHardSubjects,
      feltSupervision: studentFeltSupervision,
      feltParentingAttitude: studentFeltAttitude,
      desiredRewardModes: desiredRewards,
      wishGoal: studentWishGoal,
      completedAt: new Date().toISOString(),
    };
    onSaveStudentSurvey(survey);
    if (familyData.parentSurvey) {
      triggerHeartToHeart(familyData.parentSurvey, survey);
    }
  };

  const triggerHeartToHeart = async (pSurvey: ParentSurvey, sSurvey: StudentSurvey) => {
    const result = await geminiService.analyzeFamilySurvey(pSurvey, sSurvey);
    onSaveAIAnalysis(result);
    setShowReportModal(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-linear-to-b from-amber-50/30 via-white to-rose-50/20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-amber-900 rounded-full text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>步驟四：家庭心靈默契問卷（爸媽的心願與孩子的真心話）</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            家庭默契與真心話時間
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            請家長與孩子各自填寫簡短問卷，對照彼此心中的期待與想法，生成溫暖的家庭心靈默契卡！
          </p>
        </div>

        {/* Status Tracker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Parent Progress Card */}
          <div
            onClick={() => setCurrentRole('parent')}
            className={`p-4 sm:p-5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
              currentRole === 'parent'
                ? 'bg-amber-50/90 border-amber-400 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-800 uppercase">Parent Step</div>
                <div className="text-sm font-bold text-slate-800">家長填寫狀態</div>
                <div className="text-xs text-slate-500">
                  {hasParentSurvey ? '✅ 已完成問卷' : isParentPwdSet ? '⏳ 問卷填寫中' : '🔑 尚未設定密碼'}
                </div>
              </div>
            </div>
            {hasParentSurvey && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          </div>

          {/* Student Progress Card */}
          <div
            onClick={() => setCurrentRole('student')}
            className={`p-4 sm:p-5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
              currentRole === 'student'
                ? 'bg-sky-50/90 border-sky-400 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-sky-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-sky-800 uppercase">Student Step</div>
                <div className="text-sm font-bold text-slate-800">學生填寫狀態</div>
                <div className="text-xs text-slate-500">
                  {hasStudentSurvey ? '✅ 已完成問卷' : isStudentPwdSet ? '⏳ 問卷填寫中' : '🔑 尚未設定密碼'}
                </div>
              </div>
            </div>
            {hasStudentSurvey && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          </div>
        </div>

        {/* BOTH FINISHED BANNER */}
        {bothSurveyDone && (
          <div className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-5 sm:p-6 rounded-3xl shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Heart className="w-4 h-4 text-white fill-white" />
                  <h3 className="text-base font-bold">雙方問卷均已完成！家庭心靈默契卡已就緒</h3>
                </div>
                <p className="text-xs text-white/90">
                  學習理解默契：{familyData.aiAnalysis?.understandingScore ?? 88}% ｜ 心靈連結溫度：{familyData.aiAnalysis?.connectionScore ?? 92}%
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-white text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquareHeart className="w-3.5 h-3.5" />
                  <span>查看家庭默契卡</span>
                </button>
                <button
                  type="button"
                  onClick={() => onProceedToDashboard(currentRole)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>進入{currentRole === 'parent' ? '家長看板' : '學生學習台'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN QUESTIONNAIRE AREA */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-amber-100/80 space-y-7">
          {/* SECTION 1: PARENT FORM */}
          {currentRole === 'parent' && (
            <div className="space-y-7">
              {/* Step A: Password Set */}
              <div className="bg-amber-50/40 p-4 sm:p-5 rounded-2xl border border-amber-200/80 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold text-amber-900">
                    家長專屬帳號與密碼設定
                  </h4>
                </div>
                <form onSubmit={(e) => handleSetPassword('parent', e)} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">家長帳號（系統產生）</label>
                    <input
                      type="text"
                      value={parentAccountInput}
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {isParentPwdSet ? '自訂密碼 (已設定)' : '設定自選密碼（登入使用）'}
                    </label>
                    <input
                      type="password"
                      value={parentPwdInput}
                      onChange={(e) => setParentPwdInput(e.target.value)}
                      placeholder={isParentPwdSet ? '••••••••' : '請輸入密碼'}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/50"
                      required={!isParentPwdSet}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      {isParentPwdSet ? '更新密碼' : '確認密碼'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Step B: Parent Survey */}
              <form onSubmit={handleSaveParentSurveySubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-2.5">
                  <h3 className="text-base font-bold text-slate-800">
                    家長的心聲：關於孩子的學習與陪伴日常
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    請依據日常真實觀察填寫，將與孩子端問卷形成溫暖的家庭默契對照
                  </p>
                </div>

                {/* Question 1: 孩子的年級 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    1. 孩子的目前就讀年級：
                  </label>
                  <select
                    value={childGrade}
                    onChange={(e) => setChildGrade(e.target.value)}
                    className="w-full sm:w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500/50"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Question 2: 拿手科目 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    2. 您認為孩子對哪些科目「較為拿手 / 有興趣」？（可多選）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS.map((sub) => {
                      const isSelected = parentGoodSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => handleToggleSubject(sub, parentGoodSubjects, setParentGoodSubjects)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            isSelected
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && '✓ '} {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 3: 挑戰科目 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    3. 您認為孩子覺得哪些科目「較有挑戰性 / 吃力」？（可多選）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS.map((sub) => {
                      const isSelected = parentHardSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => handleToggleSubject(sub, parentHardSubjects, setParentHardSubjects)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            isSelected
                              ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && '✓ '} {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 4: 每天陪伴習慣 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    4. 您日常關心孩子的讀書或功課方式：
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'daily', label: '每天緊密陪伴檢查' },
                      { id: 'often', label: '每週數次適度關心' },
                      { id: 'weekly', label: '週末考前才過問' },
                      { id: 'autonomous', label: '充分信任自主安排' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSupervisionDaily(opt.id)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                          supervisionDaily === opt.id
                            ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 5: 教養態度自評光譜 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    5. 您自評的教養風格（開明到規矩光譜）：
                  </label>
                  <SpectrumSlider
                    label="您自評的教養態度"
                    sublabel="0% 代表全然開明信任，100% 代表重視規矩要求"
                    value={parentAttitudeSelf}
                    onChange={setParentAttitudeSelf}
                    leftLabel="非常開明包容"
                    rightLabel="重視嚴謹規矩"
                  />
                </div>

                {/* Question 6: 您認為孩子感受到的教養態度光譜 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    6. 您認為孩子心中感受到的教養溫度：
                  </label>
                  <SpectrumSlider
                    label="孩子心中的感受"
                    sublabel="站在孩子的視角，他覺得您是開明還是要求嚴格？"
                    value={parentAttitudeChildPerception}
                    onChange={setParentAttitudeChildPerception}
                    leftLabel="覺得爸媽很開明"
                    rightLabel="覺得爸媽管很嚴"
                  />
                </div>

                {/* Question 7: 開放許願獎勵類型 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    7. 同意孩子提出的獎勵類型（可多選）：
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleRewardType('material', allowedRewards, setAllowedRewards)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        allowedRewards.includes('material')
                          ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Gift className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-xs font-bold text-slate-800">實質獎勵</span>
                      </div>
                      <p className="text-[11px] text-slate-500">買書、文具、玩具或去吃大餐</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleRewardType('virtual', allowedRewards, setAllowedRewards)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        allowedRewards.includes('virtual')
                          ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                        <span className="text-xs font-bold text-slate-800">休閒特權</span>
                      </div>
                      <p className="text-[11px] text-slate-500">晚點睡覺、週末玩遊戲時間</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleRewardType('emotional', allowedRewards, setAllowedRewards)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        allowedRewards.includes('emotional')
                          ? 'bg-rose-50 border-rose-400 ring-1 ring-rose-400'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <MessageSquareHeart className="w-3.5 h-3.5 text-rose-600" />
                        <span className="text-xs font-bold text-slate-800">情感真心話</span>
                      </div>
                      <p className="text-[11px] text-slate-500">回答好奇問題或分享成長故事</p>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentRole('student')}
                    className="text-xs text-sky-700 hover:underline font-bold cursor-pointer"
                  >
                    👉 切換至學生端填寫問卷
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>儲存家長問卷</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 2: STUDENT FORM */}
          {currentRole === 'student' && (
            <div className="space-y-7">
              {/* Step A: Student Password Set */}
              <div className="bg-sky-50/40 p-4 sm:p-5 rounded-2xl border border-sky-200/80 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-sky-700" />
                  <h4 className="text-xs font-bold text-sky-900">
                    學生專屬帳號與密碼設定
                  </h4>
                </div>
                <form onSubmit={(e) => handleSetPassword('student', e)} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">學生帳號（系統產生）</label>
                    <input
                      type="text"
                      value={studentAccountInput}
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {isStudentPwdSet ? '自訂密碼 (已設定)' : '設定學生專屬密碼'}
                    </label>
                    <input
                      type="password"
                      value={studentPwdInput}
                      onChange={(e) => setStudentPwdInput(e.target.value)}
                      placeholder={isStudentPwdSet ? '••••••••' : '請輸入密碼'}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500/50"
                      required={!isStudentPwdSet}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      {isStudentPwdSet ? '更新密碼' : '確認密碼'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Step B: Student Survey */}
              <form onSubmit={handleSaveStudentSurveySubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-2.5">
                  <h3 className="text-base font-bold text-slate-800">
                    孩子的真心話：關於我的學習與最想要的獎勵
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    誠實寫下自己的想法，爸爸媽媽會看見你的心聲喔！
                  </p>
                </div>

                {/* Nickname & Grade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">你的暱稱 / 名字：</label>
                    <input
                      type="text"
                      value={studentNickname}
                      onChange={(e) => setStudentNickname(e.target.value)}
                      placeholder="例如：小宇"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">你的就讀年級：</label>
                    <select
                      value={studentGrade}
                      onChange={(e) => setStudentGrade(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Student Good Subjects */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    1. 你自己覺得哪些科目「最拿手 / 最有興趣」？（可多選）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS.map((sub) => {
                      const isSelected = studentGoodSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => handleToggleSubject(sub, studentGoodSubjects, setStudentGoodSubjects)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            isSelected
                              ? 'bg-sky-500 text-white border-sky-500 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && '✓ '} {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Student Hard Subjects */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    2. 你自己覺得哪些科目「比較有挑戰性 / 容易卡關」？（可多選）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS.map((sub) => {
                      const isSelected = studentHardSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => handleToggleSubject(sub, studentHardSubjects, setStudentHardSubjects)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            isSelected
                              ? 'bg-purple-500 text-white border-purple-500 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && '✓ '} {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Felt Supervision */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    3. 爸爸媽媽日常關心你的功課方式：
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'daily', label: '每天盯著檢查' },
                      { id: 'often', label: '經常關心提醒' },
                      { id: 'weekly', label: '考前才過問' },
                      { id: 'autonomous', label: '很信任讓我自己決定' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setStudentFeltSupervision(opt.id)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                          studentFeltSupervision === opt.id
                            ? 'bg-sky-100 border-sky-400 text-sky-900 ring-2 ring-sky-400/20'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Felt Parenting Attitude Spectrum */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4. 你感覺到的父母教養風格：
                  </label>
                  <SpectrumSlider
                    label="你感覺爸爸媽媽的教養風格"
                    sublabel="拉到你心中最真實的感覺"
                    value={studentFeltAttitude}
                    onChange={setStudentFeltAttitude}
                    leftLabel="非常開明、能聽我說話"
                    rightLabel="很重視規矩要求"
                  />
                </div>

                {/* Desired Reward Modes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    5. 你最希望獲得的獎勵模式（可多選）：
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleRewardType('material', desiredRewards, setDesiredRewards)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        desiredRewards.includes('material')
                          ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Gift className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-xs font-bold text-slate-800">實質獎勵</span>
                      </div>
                      <p className="text-[11px] text-slate-500">玩具、書籍、點心或去餐廳</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleRewardType('virtual', desiredRewards, setDesiredRewards)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        desiredRewards.includes('virtual')
                          ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                        <span className="text-xs font-bold text-slate-800">休閒特權</span>
                      </div>
                      <p className="text-[11px] text-slate-500">多點娛樂時間、晚一點睡覺</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleRewardType('emotional', desiredRewards, setDesiredRewards)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        desiredRewards.includes('emotional')
                          ? 'bg-rose-50 border-rose-400 ring-1 ring-rose-400'
                          : 'bg-white border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <MessageSquareHeart className="w-3.5 h-3.5 text-rose-600" />
                        <span className="text-xs font-bold text-slate-800">情感真心話</span>
                      </div>
                      <p className="text-[11px] text-slate-500">想知道爸媽以前的小秘密與故事</p>
                    </button>
                  </div>
                </div>

                {/* Wish Goal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    6. 你對這學期的學習小願望或想對爸媽說的話：
                  </label>
                  <input
                    type="text"
                    value={studentWishGoal}
                    onChange={(e) => setStudentWishGoal(e.target.value)}
                    placeholder="寫下一句你心裡的小期待..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentRole('parent')}
                    className="text-xs text-amber-700 hover:underline font-bold cursor-pointer"
                  >
                    👈 切換至家長端填寫問卷
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-linear-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>儲存學生問卷</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Family Heart-to-Heart Card Modal */}
      <FamilyAIReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        analysis={familyData.aiAnalysis}
        parentSurvey={familyData.parentSurvey}
        studentSurvey={familyData.studentSurvey}
      />
    </div>
  );
};
