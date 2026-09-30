import React, { useState } from 'react';
import { FamilyAccount, RewardWish, UnitProgress } from '../types';
import { getSubjectsForGrade } from '../data/mockCurriculum';
import { WishModal } from '../components/WishModal';
import { FamilyAIReportModal } from '../components/FamilyAIReportModal';
import {
  CheckCircle2,
  Gift,
  Smartphone,
  MessageSquareHeart,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Heart,
  Clock,
} from 'lucide-react';

interface ParentDashboardViewProps {
  familyData: FamilyAccount;
  onApproveWish: (wishId: string, customNote?: string) => void;
  onSetWishRequirement: (wishId: string, req: { requiredUnitRange?: string; customNote?: string }) => void;
  onClaimWish: (wishId: string, emotionalAnswer?: string) => void;
}

export const ParentDashboardView: React.FC<ParentDashboardViewProps> = ({
  familyData,
  onApproveWish,
  onSetWishRequirement,
  onClaimWish,
}) => {
  const childGrade = familyData.parentSurvey?.childGrade || familyData.studentSurvey?.childGrade || '國小五年級';
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<'all' | '上學期' | '下學期'>('all');
  const [activeWishModal, setActiveWishModal] = useState<{ mode: 'respond_parent' | 'claim_student'; wish: RewardWish } | null>(null);
  const [showHeartToHeartModal, setShowHeartToHeartModal] = useState(false);

  const allUnits = familyData.units || [];
  const wishes = familyData.wishes || [];
  const nickname = familyData.studentSurvey?.nickname || '孩子';

  // Filter units for child's grade
  const gradeUnits = allUnits.filter((u) => u.grade === childGrade);
  const availableSubjects = getSubjectsForGrade(childGrade);

  // Stats calculation
  const totalGradeUnits = gradeUnits.length;
  const completedGradeUnits = gradeUnits.filter((u) => u.isCompleted).length;
  const inProgressGradeUnits = gradeUnits.filter((u) => u.status === 'in_progress').length;
  const completionPercentage = totalGradeUnits > 0 ? Math.round((completedGradeUnits / totalGradeUnits) * 100) : 0;

  const filteredUnits = gradeUnits.filter((u) => {
    const matchSubject = selectedSubject === 'all' || u.subject === selectedSubject;
    const matchSemester = selectedSemester === 'all' || u.semester === selectedSemester;
    return matchSubject && matchSemester;
  });

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-linear-to-b from-amber-50/40 via-white to-orange-50/20 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Family Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{nickname} 就讀：{childGrade}</span>
              </span>
              <span className="text-xs font-mono text-slate-400">家庭代碼：{familyData.inviteCode}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {familyData.parentContract.signatureText || '家長'} 的溫暖陪伴中心
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              掌握 {nickname} 在<strong>【{childGrade}】</strong>的學科自律進度與學習筆記，在願望池中給予最及時的溫暖肯定！
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {familyData.aiAnalysis && (
              <button
                type="button"
                onClick={() => setShowHeartToHeartModal(true)}
                className="px-4 py-2.5 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <MessageSquareHeart className="w-4 h-4" />
                <span>💌 查看家庭心靈默契卡</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. 小孩課業完成進度概覽儀表板 */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>1. {nickname} 的學科進度與自主打卡狀態 ({childGrade})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                依照 108 課綱學科進度同步，查看完成日期與孩子寫下的學習心得筆記
              </p>
            </div>

            {/* Semester Filter */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold self-start sm:self-auto">
              {(['all', '上學期', '下學期'] as const).map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    selectedSemester === sem ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {sem === 'all' ? '全學年' : sem}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">課業完成進度</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-600">{completionPercentage}%</span>
                <span className="text-xs text-slate-400">
                  {completedGradeUnits}/{totalGradeUnits} 單元
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">已落實打卡單元</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600">{completedGradeUnits}</span>
                <span className="text-xs text-slate-400">個已完成</span>
              </div>
              <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>培養自主負責習慣</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">正在複習中單元</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-500">{inProgressGradeUnits}</span>
                <span className="text-xs text-slate-400">單元進行中</span>
              </div>
              <div className="text-[11px] text-amber-700 mt-1">適時給予同理與鼓勵</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">願望池進行中</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-600">
                  {wishes.filter((w) => w.status === 'pending' || w.status === 'condition_set').length}
                </span>
                <span className="text-xs text-slate-400">個願望進行中</span>
              </div>
              <div className="text-[11px] text-purple-700 mt-1 font-medium">
                已兌現 {wishes.filter((w) => w.status === 'claimed').length} 個
              </div>
            </div>
          </div>

          {/* Subject Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                selectedSubject === 'all'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              全部學科 ({gradeUnits.length})
            </button>
            {availableSubjects.map((sub) => {
              const count = gradeUnits.filter((u) => u.subject === sub.name).length;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubject(sub.name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    selectedSubject === sub.name
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sub.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Unit Progress Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnits.map((u) => (
              <div
                key={u.unitId}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  u.isCompleted
                    ? 'bg-white border-emerald-200 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 opacity-95'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-mono text-xs font-bold">
                        {u.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                        {u.semester}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{u.unitCode}</span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        u.isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {u.isCompleted ? '已完成' : u.status === 'in_progress' ? '複習中' : '尚未打卡'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{u.unitName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{u.description}</p>
                  </div>

                  {u.keyPoints && u.keyPoints.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 border border-slate-100 space-y-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-amber-600" />
                        <span>學習概念重點：</span>
                      </span>
                      <p className="line-clamp-2">{u.keyPoints.join('、')}</p>
                    </div>
                  )}

                  {u.studentNotes && (
                    <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-100 text-xs">
                      <strong className="text-sky-900 block text-[11px]">📝 {nickname} 的學習筆記：</strong>
                      <p className="text-slate-700 mt-0.5">{u.studentNotes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    {u.isCompleted ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>已完成複習</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">尚未完成複習</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {u.completedAt ? `完成於 ${u.completedAt}` : '跟進中'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 親子獎勵池 */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Gift className="w-5 h-5 text-rose-500" />
                <span>2. 親子獎勵池 (Wish Pool)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                審視 {nickname} 提出的願望與努力承諾，您可以直接同意，或設定學科進度激勵條件！
              </p>
            </div>
          </div>

          {wishes.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
              <Gift className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">目前獎勵池尚無願望</div>
              <p className="text-xs text-slate-400">
                當孩子在學生端填寫「願望許願池」並寫下承諾付出時，就會即時顯示在這邊供您審核與設定條件喔！
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
                    className="bg-white p-6 rounded-3xl border border-amber-100 shadow-2xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Status & Category Badge */}
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
                          {wish.status === 'claimed' && '🎉 願望已兌現'}
                          {wish.status === 'approved' && '✅ 父母已直接批准'}
                          {wish.status === 'condition_set' && '⭐ 已設定進度條件'}
                          {wish.status === 'pending' && '⏳ 等待家長審核'}
                        </span>
                      </div>

                      {/* Wish Title */}
                      <h4 className="text-base font-bold text-slate-800 leading-snug">{wish.title}</h4>

                      {/* Student's effort commitment */}
                      <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 text-xs space-y-1">
                        <span className="font-semibold text-rose-700 flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                          <span>{nickname} 承諾付出的努力：</span>
                        </span>
                        <p className="text-slate-700">{wish.effortCommitment}</p>
                      </div>

                      {/* Parent's condition if set */}
                      {wish.parentRequirement && (
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                          <span className="font-semibold text-amber-800 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                            <span>父母要求的激勵進度條件：</span>
                          </span>
                          {wish.parentRequirement.requiredUnitRange && (
                            <div className="font-medium text-slate-800">
                              目標：{wish.parentRequirement.requiredUnitRange}
                            </div>
                          )}
                          {wish.parentRequirement.customNote && (
                            <p className="text-slate-600 italic">「{wish.parentRequirement.customNote}」</p>
                          )}
                        </div>
                      )}

                      {/* Emotional question & answer */}
                      {isEmotional && wish.emotionalQuestion && (
                        <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200 text-xs space-y-1.5">
                          <span className="font-semibold text-rose-900 block">
                            💌 {nickname} 想問的小秘密：<strong>{wish.emotionalQuestion}</strong>
                          </span>
                          {wish.emotionalAnswer ? (
                            <div className="bg-white/90 p-2.5 rounded-xl border border-rose-100 text-slate-700">
                              <strong>👨‍👩‍👧 父母的真情分享：</strong>
                              {wish.emotionalAnswer}
                            </div>
                          ) : (
                            <p className="text-rose-700/80 text-[11px]">
                              尚未回覆真心話故事，點擊下方即可回覆並兌現！
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400">
                        {new Date(wish.createdAt).toLocaleDateString('zh-TW')}
                      </span>

                      <div className="flex gap-2">
                        {wish.status !== 'claimed' && (
                          <button
                            type="button"
                            onClick={() => setActiveWishModal({ mode: 'respond_parent', wish })}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                          >
                            {wish.status === 'pending' ? '審核與設定條件' : '修改激勵條件'}
                          </button>
                        )}

                        {wish.status !== 'claimed' && (
                          <button
                            type="button"
                            onClick={() => setActiveWishModal({ mode: 'claim_student', wish })}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
                          >
                            兌現願望
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Wish Respond Modal */}
      {activeWishModal && (
        <WishModal
          mode={activeWishModal.mode}
          wish={activeWishModal.wish}
          units={gradeUnits}
          currentGrade={childGrade}
          isOpen={!!activeWishModal}
          onClose={() => setActiveWishModal(null)}
          onApproveDirectly={onApproveWish}
          onSetRequirement={onSetWishRequirement}
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
