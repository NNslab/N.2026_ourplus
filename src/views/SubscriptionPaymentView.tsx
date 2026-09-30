import React, { useState } from 'react';
import { FamilyAccount, SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PLANS } from '../services/storageService';
import { LinePayModal } from '../components/LinePayModal';
import { Check, ShieldCheck, Sparkles, CreditCard, ArrowRight, Heart, Star, Zap, CheckCircle2, Copy } from 'lucide-react';

interface SubscriptionPaymentViewProps {
  familyData: FamilyAccount;
  onPaymentSuccess: (planId: 'monthly' | 'yearly' | 'grade_span') => void;
  onProceedToFirstSetup: () => void;
}

export const SubscriptionPaymentView: React.FC<SubscriptionPaymentViewProps> = ({
  familyData,
  onPaymentSuccess,
  onProceedToFirstSetup,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<'monthly' | 'yearly' | 'grade_span'>('yearly');
  const [isLinePayOpen, setIsLinePayOpen] = useState(false);
  const [copiedParent, setCopiedParent] = useState(false);
  const [copiedStudent, setCopiedStudent] = useState(false);

  const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];
  const isPaid = familyData.subscription.paid;

  const handleOpenPayment = () => {
    setIsLinePayOpen(true);
  };

  const handlePayComplete = () => {
    onPaymentSuccess(selectedPlanId);
    setIsLinePayOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-linear-to-b from-amber-50/30 via-white to-orange-50/20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>第三步驟：家庭陪伴方案訂閱</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            選擇適合您家庭的陪伴方案
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            透過 LINE Pay 快速安全付款，開通後立即獲得父母與孩子獨立專屬雙帳號，啟動無壓力的學習陪伴體驗。
          </p>
        </div>

        {/* If Already Paid, Show Account Credentials & Next Action */}
        {isPaid && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    目前方案：{familyData.subscription.planName}（已開通）
                  </h3>
                  <p className="text-xs text-slate-500">
                    交易序號：{familyData.subscription.linePayTransactionId || 'LP-SUCCESS-2026'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToFirstSetup}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>前往首次登入與問卷設定</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Generated Accounts Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase block">👨‍👩‍👧 家長專屬帳號</span>
                  <span className="text-base font-mono font-bold text-slate-800">{familyData.credentials.parent.username}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(familyData.credentials.parent.username);
                    setCopiedParent(true);
                    setTimeout(() => setCopiedParent(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold border border-amber-200 transition cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedParent ? '已複製' : '複製'}</span>
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-sky-800 uppercase block">🎒 學生專屬帳號</span>
                  <span className="text-base font-mono font-bold text-slate-800">{familyData.credentials.student.username}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(familyData.credentials.student.username);
                    setCopiedStudent(true);
                    setTimeout(() => setCopiedStudent(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-lg text-xs font-semibold border border-sky-200 transition cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedStudent ? '已複製' : '複製'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isPopular = plan.id === 'yearly';

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#00C300] shadow-xl ring-2 ring-[#00C300]/20 scale-102'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-linear-to-r from-amber-500 to-rose-500 text-white text-xs font-black rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-8">{plan.description}</p>
                  </div>

                  <div className="pt-2 pb-3 border-y border-slate-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-bold text-slate-400">NT$</span>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{plan.periodText}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-xs text-slate-400 line-through mt-0.5">
                        原價 NT$ {plan.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2 text-xs text-slate-600">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#00C300] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <div className={`w-full py-3 rounded-xl text-xs font-bold transition text-center flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#00C300] text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                    {isSelected ? '已選擇此方案' : '點擊選取此方案'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* LINE Pay Trigger Banner */}
        <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-white p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-7 h-7 rounded-md bg-[#00C300] text-white flex items-center justify-center text-xs font-black">
                LINE
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                已選【{selectedPlan.name}】NT$ {selectedPlan.price}
              </h4>
            </div>
            <p className="text-xs text-slate-600 max-w-md">
              點擊下方按鈕將開啟 LINE Pay 官方付款畫面。完成後系統將立即派發專屬的雙帳號卡片！
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenPayment}
            className="w-full sm:w-auto px-8 py-4 bg-[#00C300] hover:bg-[#00B000] active:scale-95 text-white rounded-2xl text-base font-bold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>透過 LINE Pay 立即付款</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* LINE Pay Modal */}
      <LinePayModal
        plan={selectedPlan}
        isOpen={isLinePayOpen}
        onClose={() => setIsLinePayOpen(false)}
        onPaymentSuccess={handlePayComplete}
        generatedParentAccount={familyData.credentials.parent.username}
        generatedStudentAccount={familyData.credentials.student.username}
      />
    </div>
  );
};
