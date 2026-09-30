import React, { useState, useEffect } from 'react';
import { SubscriptionPlan } from '../types';
import { CheckCircle2, ShieldCheck, QrCode, Smartphone, Sparkles, Copy, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LinePayModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  generatedParentAccount: string;
  generatedStudentAccount: string;
}

export const LinePayModal: React.FC<LinePayModalProps> = ({
  plan,
  isOpen,
  onClose,
  onPaymentSuccess,
  generatedParentAccount,
  generatedStudentAccount,
}) => {
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [copiedParent, setCopiedParent] = useState(false);
  const [copiedStudent, setCopiedStudent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('checkout');
      setCountdown(300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step !== 'checkout') return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, step]);

  const handleSimulatePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00C300', '#10b981', '#f59e0b', '#3b82f6'],
      });
    }, 1800);
  };

  const handleFinish = () => {
    onPaymentSuccess();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* LINE Pay Distinctive Top Header */}
        <div className="bg-[#00C300] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-[#00C300] font-black flex items-center justify-center text-base tracking-tighter shadow-xs">
              LINE
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider text-emerald-100 uppercase block">LINE Pay 官方安全收銀台</span>
              <span className="text-sm font-bold">Our+ 家庭陪伴平台 訂閱服務</span>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {step === 'checkout' && (
          <div className="p-6 space-y-6">
            {/* Amount Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">所選方案</div>
                <div className="text-base font-bold text-slate-800">{plan.name}</div>
                <div className="text-xs text-emerald-600 mt-0.5 font-medium">{plan.periodText}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 line-through">
                  {plan.originalPrice ? `NT$ ${plan.originalPrice.toLocaleString()}` : ''}
                </div>
                <div className="text-2xl font-black text-[#00C300]">
                  NT$ {plan.price.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Simulated QR Code / Barcode View */}
            <div className="text-center bg-white p-5 rounded-2xl border-2 border-dashed border-[#00C300]/40 shadow-xs space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#00A000] text-xs font-semibold rounded-full">
                <Smartphone className="w-3.5 h-3.5" />
                <span>請使用手機 LINE App 掃描付款或點擊下方按鈕</span>
              </div>

              <div className="flex justify-center my-2">
                <div className="w-44 h-44 bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center relative shadow-inner">
                  <div className="w-full h-full bg-white rounded-xl p-2 flex flex-col items-center justify-center relative">
                    <QrCode className="w-32 h-32 text-slate-900" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#00C300] text-white flex items-center justify-center text-xs font-bold shadow-md border-2 border-white">
                        L
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                付款倒數時間：<span className="font-mono text-rose-500 font-bold">{formatTime(countdown)}</span>
              </div>
            </div>

            {/* Confirm Simulated Payment Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full py-4 bg-[#00C300] hover:bg-[#00B000] active:scale-[0.99] text-white rounded-2xl text-base font-bold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>以 LINE Pay 立即付款 (NT$ {plan.price})</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256 位元 SSL 銀行級端對端加密安全支付</span>
              </p>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#00C300] border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">正在與 LINE Pay 連線扣款中...</h3>
            <p className="text-xs text-slate-500">請稍候片刻，系統正在同步授權金鑰與生成專屬雙帳號憑證</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">LINE Pay 交易完成！</h3>
              <p className="text-xs text-slate-500">
                感謝您的支持！已為您成功生成一組專屬的「父母」與「孩子」獨立登入帳號：
              </p>
            </div>

            {/* Generated Accounts Box */}
            <div className="space-y-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                <div>
                  <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">👨‍👩‍👧 家長專屬帳號</div>
                  <div className="text-base font-mono font-bold text-slate-800">{generatedParentAccount}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedParentAccount);
                    setCopiedParent(true);
                    setTimeout(() => setCopiedParent(false), 2000);
                  }}
                  className="px-2.5 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-medium flex items-center gap-1 border border-amber-200 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedParent ? '已複製' : '複製'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                <div>
                  <div className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider">🎒 孩子專屬帳號</div>
                  <div className="text-base font-mono font-bold text-slate-800">{generatedStudentAccount}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedStudentAccount);
                    setCopiedStudent(true);
                    setTimeout(() => setCopiedStudent(false), 2000);
                  }}
                  className="px-2.5 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-lg text-xs font-medium flex items-center gap-1 border border-sky-200 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedStudent ? '已複製' : '複製'}</span>
                </button>
              </div>

              <p className="text-[11px] text-amber-700/90 leading-normal">
                📌 提示：稍後首次登入時，請分別使用上述帳號設定自己的專屬密碼，並完成【學習與開明度問卷】以啟動 AI 雙向分析！
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3.5 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>前往首次登入與問卷設定</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
