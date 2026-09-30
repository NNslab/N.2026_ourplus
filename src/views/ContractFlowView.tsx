import React, { useState } from 'react';
import { UserRole, FamilyAccount } from '../types';
import { ContractSignatureModal, PARENT_TREATY_TEXT, STUDENT_TREATY_TEXT } from '../components/ContractSignatureModal';
import { Heart, ShieldCheck, Sparkles, Copy, CheckCircle2, ArrowRight, Share2, AlertCircle, FileCheck, Stamp } from 'lucide-react';

interface ContractFlowViewProps {
  familyData: FamilyAccount;
  activeRole: UserRole;
  onSignParent: (name: string, img?: string) => void;
  onSignStudent: (name: string, img?: string) => void;
  onProceedToPayment: () => void;
}

export const ContractFlowView: React.FC<ContractFlowViewProps> = ({
  familyData,
  activeRole,
  onSignParent,
  onSignStudent,
  onProceedToPayment,
}) => {
  const [modalType, setModalType] = useState<'parent' | 'student' | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const isParentSigned = familyData.parentContract.signed;
  const isStudentSigned = familyData.studentContract.signed;
  const bothSigned = isParentSigned && isStudentSigned;

  const handleCopyStudentLink = () => {
    const inviteUrl = `${window.location.origin}/?code=${familyData.inviteCode}&role=student`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-linear-to-b from-amber-50/40 via-white to-orange-50/30 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
            <Stamp className="w-3.5 h-3.5" />
            <span>第二步驟：雙向公約簽署</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            家庭開明與誠實雙向公約
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            在開啟付款與學習系統前，父母與孩子需各簽署一份溫暖誓約，唯有彼此達成共識，這份陪伴才能發揮最大的愛與力量。
          </p>
        </div>

        {/* Both Treaty Cards Side by Side or Stacked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PARENT TREATY CARD */}
          <div className={`relative rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between ${
            isParentSigned
              ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
              : 'bg-white border-amber-200 shadow-md hover:border-amber-400'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-500" />
                  <span>家長專屬</span>
                </span>
                {isParentSigned ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 已完成簽署
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-700 animate-pulse bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    等待家長簽署
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800">【開明條約】</h3>
                <p className="text-xs text-slate-500 mt-0.5">父母給予孩子的包容與同理誓約</p>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif shadow-inner">
                {PARENT_TREATY_TEXT}
              </div>

              {isParentSigned && (
                <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-xs flex items-center justify-between text-slate-600">
                  <span>簽署人：<strong className="text-emerald-800">{familyData.parentContract.signatureText}</strong></span>
                  <span className="text-[11px] text-slate-400">
                    {familyData.parentContract.signedAt ? new Date(familyData.parentContract.signedAt).toLocaleDateString('zh-TW') : '已簽署'}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              {!isParentSigned ? (
                <button
                  type="button"
                  onClick={() => setModalType('parent')}
                  className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Stamp className="w-4 h-4" />
                  <span>立即開啟手寫板簽署【開明條約】</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>家長條約已具備法律與家庭效力！請傳送連結給孩子：</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyStudentLink}
                    className="w-full py-2.5 px-3 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 rounded-xl text-xs font-bold shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? '已複製學生專屬簽署連結！' : '複製學生專屬簽署連結傳給孩子'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* STUDENT TREATY CARD */}
          <div className={`relative rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between ${
            isStudentSigned
              ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
              : 'bg-white border-sky-200 shadow-md hover:border-sky-400'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>學生專屬</span>
                </span>
                {isStudentSigned ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 已完成簽署
                  </span>
                ) : (
                  <span className="text-xs font-bold text-sky-700 animate-pulse bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    等待學生簽署
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800">【誠實條約】</h3>
                <p className="text-xs text-slate-500 mt-0.5">孩子給予父母的自律與真誠誓約</p>
              </div>

              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif shadow-inner">
                {STUDENT_TREATY_TEXT}
              </div>

              {isStudentSigned && (
                <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-xs flex items-center justify-between text-slate-600">
                  <span>簽署人：<strong className="text-emerald-800">{familyData.studentContract.signatureText}</strong></span>
                  <span className="text-[11px] text-slate-400">
                    {familyData.studentContract.signedAt ? new Date(familyData.studentContract.signedAt).toLocaleDateString('zh-TW') : '已簽署'}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              {!isStudentSigned ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setModalType('student')}
                    className="w-full py-3 bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Stamp className="w-4 h-4" />
                    <span>學生立即開啟手寫板簽署【誠實條約】</span>
                  </button>
                  {!isParentSigned && (
                    <p className="text-[11px] text-slate-400 text-center">
                      * 建議家長先簽署開明條約，給孩子建立榜樣喔！
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-emerald-100/60 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>學生已立下真誠承諾，準備好迎接自主學習與願望兌現！</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Status & Payment Unlock Banner */}
        <div className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
          bothSigned
            ? 'bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {bothSigned ? (
                  <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                )}
                <h4 className="text-base sm:text-lg font-bold">
                  {bothSigned
                    ? '🎉 雙方公約均已圓滿簽署！已解鎖付款流程！'
                    : '⏳ 條約進度：需要家長與學生雙方均完成簽署'}
                </h4>
              </div>
              <p className={`text-xs ${bothSigned ? 'text-white/90' : 'text-slate-500'}`}>
                {bothSigned
                  ? '雙方已建立最真誠的信任基石，請前往選擇適合您家庭的訂閱方案。'
                  : `目前狀態：家長【${isParentSigned ? '已簽署' : '未簽署'}】、學生【${isStudentSigned ? '已簽署' : '未簽署'}】`}
              </p>
            </div>

            <button
              type="button"
              onClick={onProceedToPayment}
              disabled={!bothSigned}
              className={`px-8 py-3.5 rounded-2xl text-sm font-black transition flex items-center gap-2 shrink-0 ${
                bothSigned
                  ? 'bg-white text-rose-600 hover:bg-rose-50 shadow-lg cursor-pointer hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>前往選擇方案與 LINE Pay 付款</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Signature Modal */}
      {modalType && (
        <ContractSignatureModal
          type={modalType}
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          onSigned={(name, img) => {
            if (modalType === 'parent') {
              onSignParent(name, img);
            } else {
              onSignStudent(name, img);
            }
          }}
          inviteCode={familyData.inviteCode}
        />
      )}
    </div>
  );
};
