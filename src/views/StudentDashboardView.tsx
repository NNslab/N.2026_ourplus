import React, { useState } from 'react';
import { FamilyAccount, RewardWish, UnitProgress, RewardCategory, UnitStatus } from '../types';
import { getSubjectsForGrade } from '../data/mockCurriculum';
import { WishModal } from '../components/WishModal';
import { FamilyAIReportModal } from '../components/FamilyAIReportModal';
import {
  CheckCircle2,
  Gift,
  Smartphone,
  MessageSquareHeart,
  Heart,
  Plus,
  BookOpen,
  Calendar,
  Layers,
  Edit3,
  Save,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentDashboardViewProps {
  familyData: FamilyAccount;
  onToggleUnit: (unitId: string) => void;
  onUpdateUnitStatus?: (unitId: string, status: UnitStatus, notes?: string) => void;
  onSaveUnitNotes?: (unitId: string, notes: string) => void;
  onAddNewWish: (wish: { title: string; category: RewardCategory; effortCommitment: string; emotionalQuestion?: string }) => void;
  onClaimWish: (wishId: string, emotionalAnswer?: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  familyData,
  onToggleUnit,
  onUpdateUnitStatus,
  onSaveUnitNotes,
  onAddNewWish,
  onClaimWish,
}) => {
  // Determine student's enrolled grade
  const enrolledGrade = familyData.studentSurvey?.childGrade || familyData.parentSurvey?.childGrade || '國小五年級';
  const [selectedGrade] = useState<string>(enrolledGrade);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<'all' | '上學期' | '下學期'>('all');
  const [editingNoteUnitId, setEditingNoteUnitId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');

  const [isNewWishModalOpen, setIsNewWishModalOpen] = useState(false);
  const [claimWishItem, setClaimWishItem] = useState<RewardWish | null>(null);
  const [showHeartToHeartModal, setShowHeartToHeartModal] = useState(false);

  const allUnits = familyData.units || [];
  const wishes = familyData.wishes || [];
  const nickname = familyData.studentSurvey?.nickname || '我';

  // Strict grade filtering: Only show units for the student's grade
  const gradeUnits = allUnits.filter((u) => u.grade === selectedGrade);
  const availableSubjects = getSubjectsForGrade(selectedGrade);

  // Filtered by subject and semester
  const filteredUnits = gradeUnits.filter((u) => {
    const matchSubject = selectedSubject === 'all' || u.subject === selectedSubject;
    const matchSemester = selectedSemester === 'all' || u.semester === selectedSemester;
    return matchSubject && matchSemester;
  });

  // Progress metrics calculation
  const totalGradeUnits = gradeUnits.length;
  const completedGradeUnits = gradeUnits.filter((u) => u.isCompleted).length;
  const inProgressGradeUnits = gradeUnits.filter((u) => u.status === 'in_progress').length;
  const progressPercent = totalGradeUnits > 0 ? Math.round((completedGradeUnits / totalGradeUnits) * 100) : 0;

  const handleToggleStatus = (unit: UnitProgress) => {
    if (onUpdateUnitStatus) {
      const nextStatus: UnitStatus = unit.status === 'completed' ? 'not_started' : 'completed';
      onUpdateUnitStatus(unit.unitId, nextStatus);
    } else {
      onToggleUnit(unit.unitId);
    }

    if (!unit.isCompleted) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  const handleStartEditingNote = (unit: UnitProgress) => {
    setEditingNoteUnitId(unit.unitId);
    setTempNoteText(unit.studentNotes || '');
  };

  const handleSaveNote = (unitId: string) => {
    if (onSaveUnitNotes) {
      onSaveUnitNotes(unitId, tempNoteText.trim());
    }
    setEditingNoteUnitId(null);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-linear-to-b from-sky-50/30 via-white to-amber-50/20 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>就讀年級：{selectedGrade}</span>
              </span>
              <span className="text-xs font-mono text-slate-400">學員：{nickname}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {nickname} 的學科進度與自律打卡台
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              專為<strong>【{selectedGrade}】</strong>量身建置的各科單元選單。自主打卡複習、寫下筆記，累積自律成果換取心願！
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewWishModalOpen(true)}
              className="px-5 py-2.5 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>向爸媽許願 (+許願池)</span>
            </button>

            {familyData.aiAnalysis && (
              <button
                type="button"
                onClick={() => setShowHeartToHeartModal(true)}
                className="px-4 py-2.5 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-xl text-xs font-bold border border-sky-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquareHeart className="w-3.5 h-3.5 text-sky-600" />
                <span>💌 查看家庭心靈默契卡</span>
              </button>
            )}
          </div>
        </div>

        {/* Learning Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-linear-to-br from-sky-500 to-blue-600 text-white p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-100 block mb-1">
              {selectedGrade} 總進度
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black">{progressPercent}%</span>
              <span className="text-xs text-sky-100 font-medium">完成率</span>
            </div>
            <div className="w-full h-1.5 bg-sky-400/50 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">已打卡完成單元</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-emerald-600">{completedGradeUnits}</span>
              <span className="text-xs text-slate-400">/ {totalGradeUnits} 單元</span>
            </div>
            <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>落實每日自律打卡</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">正在複習中</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-amber-500">{inProgressGradeUnits}</span>
              <span className="text-xs text-slate-400">單元進行中</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">踏實理解核心概念</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">我的許願池狀態</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-purple-600">{wishes.length}</span>
              <span className="text-xs text-slate-400">個願望</span>
            </div>
            <div className="text-[11px] text-purple-600 mt-1 font-medium">
              已兌現 {wishes.filter((w) => w.status === 'claimed').length} 個
            </div>
          </div>
        </div>

        {/* 1. 學校進度選單系統 */}
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-600" />
                <span>1. {selectedGrade} 官方學科單元進度選單</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                依照教育部 108 課綱實際單元範圍建置，課堂或課後複習完成後點擊打卡標記！
              </p>
            </div>

            {/* Semester Switcher */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
              {(['all', '上學期', '下學期'] as const).map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    selectedSemester === sem ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {sem === 'all' ? '全學年' : sem}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                selectedSubject === 'all'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              全部學科 ({gradeUnits.length})
            </button>
            {availableSubjects.map((sub) => {
              const count = gradeUnits.filter((u) => u.subject === sub.name).length;
              const isSelected = selectedSubject === sub.name;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubject(sub.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{sub.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Unit Progress Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnits.map((unit) => {
              const isCompleted = unit.isCompleted || unit.status === 'completed';
              const isInProgress = unit.status === 'in_progress';
              const isEditingNote = editingNoteUnitId === unit.unitId;

              return (
                <div
                  key={unit.unitId}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isCompleted
                      ? 'bg-white border-emerald-300 shadow-2xs ring-1 ring-emerald-300/30'
                      : isInProgress
                      ? 'bg-white border-amber-300 shadow-2xs ring-1 ring-amber-300/30'
                      : 'bg-white border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Row: Subject, Semester, Unit Code & Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs">
                          {unit.subject}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                          {unit.semester}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-500">
                          {unit.unitCode}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInProgress
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isCompleted ? '已完成' : isInProgress ? '複習中' : '待打卡'}
                      </span>
                    </div>

                    {/* Unit Name & Description */}
                    <div>
                      <h4 className="font-bold text-slate-800 text-base leading-snug">
                        {unit.unitName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {unit.description}
                      </p>
                    </div>

                    {/* Key Points Checklist */}
                    {unit.keyPoints && unit.keyPoints.length > 0 && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                          <Layers className="w-3.5 h-3.5 text-sky-600" />
                          <span>核心學習概念：</span>
                        </span>
                        <ul className="space-y-0.5 pl-1 text-slate-600 text-[11px]">
                          {unit.keyPoints.map((kp, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-sky-500 font-bold">•</span>
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Student Reflection Notes */}
                    <div className="text-xs space-y-1.5 pt-1">
                      {isEditingNote ? (
                        <div className="space-y-2 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200">
                          <label className="block text-[11px] font-bold text-amber-900">
                            ✏️ 記錄今日心得 / 學習筆記：
                          </label>
                          <textarea
                            value={tempNoteText}
                            onChange={(e) => setTempNoteText(e.target.value)}
                            placeholder="例如：今天弄懂了通分技巧！乘除運算很順利..."
                            rows={2}
                            className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs resize-none focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingNoteUnitId(null)}
                              className="px-2.5 py-1 text-[11px] text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer"
                            >
                              取消
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveNote(unit.unitId)}
                              className="px-3 py-1 text-[11px] bg-amber-500 text-white font-bold rounded-md hover:bg-amber-600 flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              <span>儲存筆記</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2 text-[11px] text-slate-500">
                          {unit.studentNotes ? (
                            <div className="bg-sky-50/60 p-2 rounded-lg border border-sky-100 flex-1 text-slate-700">
                              <strong className="text-sky-900">我的筆記：</strong> {unit.studentNotes}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">尚未填寫學習筆記</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleStartEditingNote(unit)}
                            className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md transition cursor-pointer"
                            title="撰寫學習筆記"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action: Toggle Status */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      {unit.completedAt ? (
                        <>
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          <span>打卡於 {unit.completedAt}</span>
                        </>
                      ) : (
                        <span>自主打卡進度</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(unit)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-white'}`} />
                      <span>{isCompleted ? '已完成（點擊取消）' : '完成複習並打卡'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. 獎勵許願池 */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                <span>2. 我的獎勵許願池 (Wish Pool)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                提出你真心想要的願望，並寫下你承諾付出的自律與努力，讓爸爸媽媽為你的誠意點讚！
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNewWishModalOpen(true)}
              className="px-5 py-2.5 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>許一個新願望</span>
            </button>
          </div>

          {wishes.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <Gift className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-base font-bold text-slate-700">願望池還是空的喔！</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                快點擊上方「許一個新願望」，不管是想要好吃的拉麵、多玩一點遊戲，或是想聽爸爸媽媽以前的小故事，寫下你的努力承諾吧！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishes.map((wish) => {
                const isMaterial = wish.category === 'material';
                const isVirtual = wish.category === 'virtual';
                const isEmotional = wish.category === 'emotional';

                return (
                  <div
                    key={wish.id}
                    className="bg-white p-6 rounded-3xl border border-sky-100 shadow-2xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Badge and Status */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            isMaterial
                              ? 'bg-amber-100 text-amber-800'
                              : isVirtual
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isMaterial && <Gift className="w-3.5 h-3.5" />}
                          {isVirtual && <Smartphone className="w-3.5 h-3.5" />}
                          {isEmotional && <MessageSquareHeart className="w-3.5 h-3.5" />}
                          <span>{isMaterial ? '實質獎勵' : isVirtual ? '休閒特權' : '情感真心話'}</span>
                        </span>

                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            wish.status === 'claimed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : wish.status === 'approved'
                              ? 'bg-teal-100 text-teal-800'
                              : wish.status === 'condition_set'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {wish.status === 'claimed' && '🎉 願望已圓滿兌現！'}
                          {wish.status === 'approved' && '✅ 爸媽已大方答應！'}
                          {wish.status === 'condition_set' && '⭐ 爸媽已設定進度條件'}
                          {wish.status === 'pending' && '⏳ 等待爸媽審核'}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-bold text-slate-800 leading-snug">{wish.title}</h4>

                      {/* Effort commitment */}
                      <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 text-xs space-y-1">
                        <span className="font-semibold text-sky-900 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                          <span>我承諾付出的努力：</span>
                        </span>
                        <p className="text-slate-700">{wish.effortCommitment}</p>
                      </div>

                      {/* Parent condition */}
                      {wish.parentRequirement && (
                        <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 text-xs space-y-1">
                          <span className="font-semibold text-amber-900 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                            <span>爸爸媽媽設定的進度挑戰：</span>
                          </span>
                          {wish.parentRequirement.requiredUnitRange && (
                            <div className="font-bold text-amber-950">
                              目標：{wish.parentRequirement.requiredUnitRange}
                            </div>
                          )}
                          {wish.parentRequirement.customNote && (
                            <p className="text-slate-600 italic">「{wish.parentRequirement.customNote}」</p>
                          )}
                        </div>
                      )}

                      {/* Emotional question / answer */}
                      {isEmotional && wish.emotionalQuestion && (
                        <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200 text-xs space-y-1.5">
                          <span className="font-semibold text-rose-900 block">
                            💌 我想問的小秘密：<strong>{wish.emotionalQuestion}</strong>
                          </span>
                          {wish.emotionalAnswer ? (
                            <div className="bg-white/90 p-2.5 rounded-xl border border-rose-100 text-slate-700">
                              <strong>👨‍👩‍👧 爸爸媽媽的真心話回覆：</strong>
                              {wish.emotionalAnswer}
                            </div>
                          ) : (
                            <p className="text-rose-600/80 text-[11px]">
                              爸爸媽媽正在準備最暖心的小秘密故事給你喔！
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Claim Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {new Date(wish.createdAt).toLocaleDateString('zh-TW')}
                      </span>

                      {wish.status !== 'claimed' ? (
                        <button
                          type="button"
                          onClick={() => setClaimWishItem(wish)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>申請兌現此願望</span>
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> 已圓滿兌現
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Wish Modal */}
      <WishModal
        mode="create_student"
        isOpen={isNewWishModalOpen}
        onClose={() => setIsNewWishModalOpen(false)}
        onSubmitNewWish={onAddNewWish}
      />

      {/* Claim Wish Modal */}
      {claimWishItem && (
        <WishModal
          mode="claim_student"
          wish={claimWishItem}
          isOpen={!!claimWishItem}
          onClose={() => setClaimWishItem(null)}
          onClaimWish={onClaimWish}
        />
      )}

      {/* Family Heart-to-Heart Modal */}
      <FamilyAIReportModal
        isOpen={showHeartToHeartModal}
        onClose={() => setShowHeartToHeartModal(false)}
        analysis={familyData.aiAnalysis}
        parentSurvey={familyData.parentSurvey}
        studentSurvey={familyData.studentSurvey}
      />
    </div>
  );
};
