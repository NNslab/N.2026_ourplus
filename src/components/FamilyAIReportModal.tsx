import React from 'react';
import { AIAnalysisResult, ParentSurvey, StudentSurvey } from '../types';
import { Heart, X, Compass, Lightbulb, UserCheck, Shield, BookOpen, MessageSquareHeart, Sparkles } from 'lucide-react';

interface FamilyAIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis?: AIAnalysisResult;
  parentSurvey?: ParentSurvey;
  studentSurvey?: StudentSurvey;
}

export const FamilyAIReportModal: React.FC<FamilyAIReportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  parentSurvey,
  studentSurvey,
}) => {
  if (!isOpen || !analysis) return null;

  const parentSpectrum = parentSurvey?.parentingAttitudeSelf ?? 25;
  const studentSpectrum = studentSurvey?.feltParentingAttitude ?? 35;
  const gap = Math.abs(parentSpectrum - studentSpectrum);
  const nickname = studentSurvey?.nickname || '孩子';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-linear-to-b from-amber-50/90 via-white to-rose-50/80 rounded-3xl shadow-2xl border border-amber-200/80 p-6 sm:p-8 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-100/80 text-amber-900 text-xs font-bold rounded-full border border-amber-200 mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>家庭心靈默契卡・給彼此的真心話</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            看見彼此心中的愛與期待
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            放下猜測與緊繃，透過雙向問卷看見父母的心意與孩子的心聲，讓家的溫度更自然流動
          </p>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* Key Metrics Three Warm Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/90 p-4 rounded-2xl border border-amber-100 shadow-2xs text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-black text-lg mb-1 border-2 border-amber-200">
                {analysis.understandingScore}%
              </div>
              <span className="text-xs font-bold text-slate-800">學習理解默契</span>
              <span className="text-[11px] text-slate-400 mt-0.5">父母對孩子學習進度的掌握</span>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-rose-100 shadow-2xs text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-black text-lg mb-1 border-2 border-rose-200">
                {analysis.connectionScore}%
              </div>
              <span className="text-xs font-bold text-slate-800">心靈連結溫度</span>
              <span className="text-[11px] text-slate-400 mt-0.5">家庭信任感與親密羈絆</span>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-2xs text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg mb-1 border-2 border-emerald-200">
                {analysis.compatibilityScore}%
              </div>
              <span className="text-xs font-bold text-slate-800">教養同頻共鳴</span>
              <span className="text-[11px] text-slate-400 mt-0.5">開明度感知的契合程度</span>
            </div>
          </div>

          {/* Gentle Summary Card */}
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <MessageSquareHeart className="w-4 h-4 text-rose-500" />
              <span>給這個家庭的一封暖心信箋</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed indent-4">
              {analysis.gentleSummary}
            </p>
          </div>

          {/* Parenting Spectrum Comparison Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>教養開明度感知對照</span>
              </div>
              <div className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full font-medium border border-amber-200">
                感知差距：{gap}% ({gap <= 15 ? '極佳同頻' : '溫柔磨合期'})
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>👨‍👩‍👧 家長自評開明態度</span>
                  <span className="font-mono text-emerald-700">{100 - parentSpectrum}% 開明信任</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-emerald-400 to-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${parentSpectrum}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>🎒 {nickname} 感受到的開明溫度</span>
                  <span className="font-mono text-sky-700">{100 - studentSpectrum}% 開明支持</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${studentSpectrum}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              💡 {analysis.attitudeSpectrumAnalysis}
            </p>
          </div>

          {/* Mastery & Subject Comparison */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>課業掌握度與學習默契</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {analysis.masteryAnalysis}
            </p>
            {analysis.subjectAlignmentAnalysis && (
              <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                ✨ {analysis.subjectAlignmentAnalysis}
              </div>
            )}
          </div>

          {/* Cognitive Gap Highlights & Coach Tips */}
          {analysis.gapHighlights && analysis.gapHighlights.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>彼此的心聲與溝通小橋樑</span>
              </h4>
              <div className="space-y-2.5">
                {analysis.gapHighlights.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs space-y-2">
                    <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{item.topic}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                        <span className="font-semibold text-amber-900 block mb-0.5">👨‍👩‍👧 父母的心意：</span>
                        <span className="text-slate-600">{item.parentView}</span>
                      </div>
                      <div className="bg-sky-50/60 p-2.5 rounded-xl border border-sky-100">
                        <span className="font-semibold text-sky-900 block mb-0.5">🎒 {nickname} 的真心話：</span>
                        <span className="text-slate-600">{item.studentView}</span>
                      </div>
                    </div>
                    <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 fill-rose-500" />
                      <span><strong>溫暖陪伴建議：</strong>{item.coachTip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Tips Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>給爸爸媽媽的暖心陪伴錦囊</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(analysis.parentTips || []).map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
                <Shield className="w-4 h-4 text-sky-600" />
                <span>給孩子的自律與勇氣小叮嚀</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(analysis.studentTips || []).map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-sky-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
          >
            完成檢閱，回到家庭空間
          </button>
        </div>
      </div>
    </div>
  );
};
