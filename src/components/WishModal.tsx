import React, { useState } from 'react';
import { RewardCategory, RewardWish, UnitProgress } from '../types';
import { Sparkles, Heart, Gift, Smartphone, MessageSquareHeart, CheckCircle2, ArrowRight, X, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WishModalProps {
  mode: 'create_student' | 'respond_parent' | 'claim_student';
  wish?: RewardWish | null;
  units?: UnitProgress[];
  currentGrade?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitNewWish?: (wish: { title: string; category: RewardCategory; effortCommitment: string; emotionalQuestion?: string }) => void;
  onApproveDirectly?: (wishId: string, customNote?: string) => void;
  onSetRequirement?: (wishId: string, req: { requiredUnitRange?: string; customNote?: string }) => void;
  onClaimWish?: (wishId: string, emotionalAnswer?: string) => void;
}

export const WishModal: React.FC<WishModalProps> = ({
  mode,
  wish,
  units = [],
  currentGrade,
  isOpen,
  onClose,
  onSubmitNewWish,
  onApproveDirectly,
  onSetRequirement,
  onClaimWish,
}) => {
  // Student create fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RewardCategory>('material');
  const [effortCommitment, setEffortCommitment] = useState('');
  const [emotionalQuestion, setEmotionalQuestion] = useState('');

  // Filter grade units for parent condition dropdown
  const relevantUnits = currentGrade ? units.filter((u) => u.grade === currentGrade) : units;

  // Parent response fields
  const [parentActionType, setParentActionType] = useState<'direct' | 'condition'>('condition');
  const defaultOption = relevantUnits.length > 0 ? `完成【${relevantUnits[0].subject}】${relevantUnits[0].unitName}` : '完成本週所有學科進度並落實自律';
  const [selectedUnitRange, setSelectedUnitRange] = useState(defaultOption);
  const [parentCustomNote, setParentCustomNote] = useState('');

  // Emotional answer field
  const [emotionalAnswer, setEmotionalAnswer] = useState('');

  if (!isOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !effortCommitment.trim()) return;

    if (onSubmitNewWish) {
      onSubmitNewWish({
        title: title.trim(),
        category,
        effortCommitment: effortCommitment.trim(),
        emotionalQuestion: category === 'emotional' ? emotionalQuestion.trim() : undefined,
      });
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
    onClose();
  };

  const handleParentSubmit = () => {
    if (!wish) return;

    if (parentActionType === 'direct') {
      if (onApproveDirectly) {
        onApproveDirectly(wish.id, parentCustomNote || '爸爸媽媽全力支持你！為你的努力與用心感到無比驕傲！');
      }
    } else {
      if (onSetRequirement) {
        onSetRequirement(wish.id, {
          requiredUnitRange: selectedUnitRange,
          customNote: parentCustomNote || `只要踏實完成 ${selectedUnitRange}，爸媽一定立刻幫你實現！`,
        });
      }
    }
    onClose();
  };

  const handleClaim = () => {
    if (!wish || !onClaimWish) return;
    onClaimWish(wish.id, emotionalAnswer);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#ec4899', '#f59e0b', '#10b981'],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STUDENT MODE: Create new wish */}
        {mode === 'create_student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mb-2 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">向爸爸媽媽許個願望</h3>
              <p className="text-xs text-slate-500 mt-0.5">寫下你期待的獎勵與你願意付出的努力承諾</p>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. 選擇願望獎勵類型：
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('material')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                    category === 'material'
                      ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Gift className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-bold">實質獎勵</span>
                  <span className="text-[10px] text-slate-400">買東西/書籍/文具</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('virtual')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                    category === 'virtual'
                      ? 'bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-400/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-sky-600" />
                  <span className="text-xs font-bold">休閒特權</span>
                  <span className="text-[10px] text-slate-400">休閒時段/玩遊戲</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('emotional')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                    category === 'emotional'
                      ? 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-400/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquareHeart className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-bold">情感真心話</span>
                  <span className="text-[10px] text-slate-400">問爸媽秘密小故事</span>
                </button>
              </div>
            </div>

            {/* Wish Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                2. 你的願望內容是什麼？
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  category === 'material'
                    ? '例如：週末全家一起去吃拉麵＋買一本喜歡的科普漫畫'
                    : category === 'virtual'
                    ? '例如：週六晚上可以多玩 40 分鐘 Switch'
                    : '例如：想聽爸爸媽媽分享國小最糗或最勇敢的冒險故事'
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
                required
              />
            </div>

            {/* Emotional Question (if category === 'emotional') */}
            {category === 'emotional' && (
              <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200 space-y-1.5">
                <label className="block text-xs font-bold text-rose-900">
                  💌 你想問爸爸媽媽的私房問題或秘密：
                </label>
                <input
                  type="text"
                  value={emotionalQuestion}
                  onChange={(e) => setEmotionalQuestion(e.target.value)}
                  placeholder="例如：爸爸媽媽第一次見面是什麼感覺？小時候被處罰過最慘的事情是什麼？"
                  className="w-full px-3 py-2 bg-white border border-rose-200 rounded-lg text-xs"
                />
              </div>
            )}

            {/* Effort Commitment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>3. 為了這個願望，我願意付出哪些努力？（自律與誠意承諾）</span>
              </label>
              <textarea
                value={effortCommitment}
                onChange={(e) => setEffortCommitment(e.target.value)}
                placeholder="例如：我承諾這週每天回家先洗手並在晚餐前完成所有作業，並把本週學科進度完成打卡！"
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>送出願望給爸爸媽媽</span>
            </button>
          </form>
        )}

        {/* PARENT MODE: Respond to wish */}
        {mode === 'respond_parent' && wish && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mb-2 shadow-2xs">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">審視孩子的願望池</h3>
              <p className="text-xs text-slate-500 mt-0.5">直接批准或設定學科進度激勵條件</p>
            </div>

            {/* Wish Overview Card */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>願望類型：{wish.category === 'material' ? '🎁 實質獎勵' : wish.category === 'virtual' ? '🎮 休閒特權' : '💌 情感真心話'}</span>
                <span className="text-[11px] text-slate-500">{new Date(wish.createdAt).toLocaleDateString('zh-TW')}</span>
              </div>
              <div className="text-sm font-bold text-slate-800">{wish.title}</div>
              <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <span className="font-semibold text-rose-700">🎒 孩子寫下的承諾付出：</span>
                <p className="mt-0.5">{wish.effortCommitment}</p>
              </div>
              {wish.emotionalQuestion && (
                <div className="text-xs text-purple-900 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                  <span>💌 孩子想問的秘密問題：<strong>{wish.emotionalQuestion}</strong></span>
                </div>
              )}
            </div>

            {/* Parent Decision Choice */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">選擇回應方式：</label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setParentActionType('direct')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    parentActionType === 'direct'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400/20 font-bold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs">直接大方同意</span>
                  <span className="block text-[10px] text-slate-400">認可孩子誠意直接批准</span>
                </button>

                <button
                  type="button"
                  onClick={() => setParentActionType('condition')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    parentActionType === 'condition'
                      ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/20 font-bold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <BookOpen className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs">設定進度激勵條件</span>
                  <span className="block text-[10px] text-slate-400">指定完成特定單元進度</span>
                </button>
              </div>

              {parentActionType === 'condition' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      指定完成的課業進度單元：
                    </label>
                    <select
                      value={selectedUnitRange}
                      onChange={(e) => setSelectedUnitRange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      {relevantUnits.slice(0, 15).map((u) => (
                        <option key={u.unitId} value={`完成【${u.subject}】${u.unitCode} ${u.unitName}`}>
                          【{u.subject}】{u.unitCode} {u.unitName}
                        </option>
                      ))}
                      <option value="完成本週所有學科進度並落實自律">完成本週所有學科進度並落實自律</option>
                      <option value="主動完成2個挑戰科目的重點複習">主動完成2個挑戰科目的重點複習</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  給孩子的暖心留言 / 加油打氣：
                </label>
                <input
                  type="text"
                  value={parentCustomNote}
                  onChange={(e) => setParentCustomNote(e.target.value)}
                  placeholder={
                    parentActionType === 'direct'
                      ? '爸爸媽媽直接答應你囉！為你的貼心感到開心！'
                      : '寶貝加油！只要踏實完成進度，爸爸媽媽一定帶你去！'
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleParentSubmit}
              className="w-full py-3.5 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>確認送出回應給孩子</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CLAIM MODE: Child or Parent claiming/fulfilling */}
        {mode === 'claim_student' && wish && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mb-2 shadow-2xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">兌現願望！</h3>
              <p className="text-xs text-slate-500 mt-0.5">恭喜努力有了回報，為彼此的付出喝采！</p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
              <div className="text-sm font-bold text-emerald-950">{wish.title}</div>
              {wish.parentRequirement?.customNote && (
                <div className="text-xs text-emerald-800 bg-white/80 p-2.5 rounded-xl">
                  <strong>👨‍👩‍👧 父母的承諾留言：</strong>{wish.parentRequirement.customNote}
                </div>
              )}
            </div>

            {wish.category === 'emotional' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  💌 父母的真心話故事 / 秘密解答：
                </label>
                <textarea
                  value={emotionalAnswer}
                  onChange={(e) => setEmotionalAnswer(e.target.value)}
                  placeholder="寫下爸爸媽媽當年有趣或感動的故事，送給孩子當作最珍貴的成長禮物..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleClaim}
              className="w-full py-3.5 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>蓋上【願望圓滿達成】印章！</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
