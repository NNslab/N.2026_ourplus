import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, Heart, Sparkles, CheckCircle2, RotateCcw, Copy, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContractSignatureModalProps {
  type: 'parent' | 'student';
  isOpen: boolean;
  onClose: () => void;
  onSigned: (signatureText: string, signatureImage?: string) => void;
  inviteCode?: string;
}

export const PARENT_TREATY_TEXT = `我承諾，因為我愛我的孩子，我希望我的孩子和我合作、和我分享，所以我會懷著愛心與耐心，用關心的角度、開放多元的態度來了解我的孩子，我會學習凡事不先批判、學會控制脾氣、學會聆聽、學會同理、學會用愛的語言表達。`;

export const STUDENT_TREATY_TEXT = `我承諾，因為我愛我的家長，我希望我的家長和我合作、接納我的想法，所以我會認真的做好自己該做的事、誠實的和他們分享我的生活，用自律和真誠來換取更多的信任和認同，我會學習感謝父母的付出、用更包容的視角去解讀父母笨拙的愛。`;

export const ContractSignatureModal: React.FC<ContractSignatureModalProps> = ({
  type,
  isOpen,
  onClose,
  onSigned,
  inviteCode = 'OUR-PLUS-8829',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSignedSuccess, setShowSignedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasDrawn(false);
      setTypedName('');
      setShowSignedSuccess(false);
      setTimeout(() => {
        initCanvas();
      }, 100);
    }
  }, [isOpen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    initCanvas();
    setHasDrawn(false);
  };

  const handleConfirmSign = () => {
    const signatureName = typedName.trim() || (type === 'parent' ? '家長' : '學生');
    const signatureImg = canvasRef.current ? canvasRef.current.toDataURL() : undefined;
    
    setShowSignedSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
    });

    setTimeout(() => {
      onSigned(signatureName, signatureImg);
      onClose();
    }, 1500);
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/?code=${inviteCode}&role=student`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isOpen) return null;

  const isParent = type === 'parent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-linear-to-b from-amber-50/90 to-white rounded-3xl shadow-2xl border border-amber-200/80 p-6 sm:p-8 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Decorative Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-amber-400 to-rose-400 text-white shadow-lg mb-3">
            {isParent ? <Heart className="w-7 h-7 fill-white/80 animate-pulse" /> : <ShieldCheck className="w-7 h-7" />}
          </div>
          <div className="inline-block px-3 py-1 bg-amber-100/80 text-amber-800 text-xs font-semibold rounded-full mb-1">
            {isParent ? 'Our+ 家長專屬誓約' : 'Our+ 學生專屬誓約'}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {isParent ? '簽署【開明條約】' : '簽署【誠實條約】'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isParent ? '這是一份給孩子的溫暖承諾，用愛與包容拉近距離' : '這是一份給父母的真誠約定，用自律與坦誠換取信任'}
          </p>
        </div>

        {/* Treaty Content Box with Parchment Effect */}
        <div className="relative bg-amber-50/60 border-2 border-dashed border-amber-200 rounded-2xl p-5 sm:p-6 mb-6 shadow-inner text-slate-700 leading-relaxed font-serif text-sm sm:text-base">
          <div className="absolute top-2 right-2 text-amber-300 opacity-40 select-none">
            <Sparkles className="w-10 h-10" />
          </div>
          <p className="indent-8 text-justify font-medium text-slate-800 leading-7">
            {isParent ? PARENT_TREATY_TEXT : STUDENT_TREATY_TEXT}
          </p>

          <div className="mt-4 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-800 font-sans">
            <span>條約代碼：<strong className="font-mono">{inviteCode}</strong></span>
            <span>簽署日期：{new Date().toLocaleDateString('zh-TW')}</span>
          </div>
        </div>

        {/* Signature Area */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>✍️</span> 電子手寫簽名 / 蓋下承諾印章
            </label>
            <button
              type="button"
              onClick={clearCanvas}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 重新簽署
            </button>
          </div>

          <div className="relative border-2 border-slate-300 rounded-2xl bg-white overflow-hidden shadow-xs">
            <canvas
              ref={canvasRef}
              width={540}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-32 touch-none cursor-crosshair"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs">
                請在此空白處用滑鼠或手指簽下您的名字
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              簽署人全名（或稱謂，例如：媽媽、爸爸、小明）：
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={isParent ? '例如：林雅婷（媽媽）' : '例如：陳小宇（學生）'}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/3 py-3 px-4 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition cursor-pointer"
          >
            稍後再簽
          </button>
          <button
            type="button"
            onClick={handleConfirmSign}
            disabled={!hasDrawn && !typedName.trim()}
            className="w-full sm:w-2/3 py-3 px-6 bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {showSignedSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 animate-bounce text-white" />
                <span>條約簽署完成！蓋印生效中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>我已誠心閱讀並同意簽署條約</span>
              </>
            )}
          </button>
        </div>

        {/* Parent Invite Link Generator Helper */}
        {isParent && (
          <div className="mt-5 p-3.5 bg-amber-100/60 rounded-xl border border-amber-200 text-xs text-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base">📲</span>
              <span>簽署完成後將生成學生專屬連結，傳給孩子簽署【誠實條約】即可解鎖付款！</span>
            </div>
            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="shrink-0 px-2.5 py-1.5 bg-white text-amber-800 font-medium rounded-lg border border-amber-300 hover:bg-amber-50 flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '已複製連結' : '複製學生連結'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
