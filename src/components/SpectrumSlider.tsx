import React from 'react';

interface SpectrumSliderProps {
  label: string;
  sublabel?: string;
  value: number; // 0 to 100 (0 = 開明, 100 = 嚴格/封閉)
  onChange: (val: number) => void;
  leftLabel?: string;
  rightLabel?: string;
}

export const SpectrumSlider: React.FC<SpectrumSliderProps> = ({
  label,
  sublabel,
  value,
  onChange,
  leftLabel = '非常開明包容 🕊️ (充分信任、尊重想法)',
  rightLabel = '嚴格規範管理 🛡️ (緊密要求、明確規矩)',
}) => {
  const getSpectrumDescription = (val: number) => {
    if (val <= 20) return { title: '極度開明自在', desc: '強調高度尊重與自主探索，給予孩子廣闊的揮灑空間。', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (val <= 40) return { title: '溫暖引導型', desc: '以同理傾聽為主，偶爾適度給予溫柔的方向建議。', color: 'text-teal-600 bg-teal-50 border-teal-200' };
    if (val <= 60) return { title: '平衡自律型', desc: '原則清晰且保持對話彈性，兼顧生活秩序與個別感受。', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (val <= 80) return { title: '嚴謹督促型', desc: '重視學習習慣與紀律要求，希望孩子少走彎路。', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { title: '高度要求型', desc: '期待明確、標準嚴密，深切期盼孩子達成最高標準。', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const currentDesc = getSpectrumDescription(value);

  return (
    <div className="space-y-3 bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-amber-100 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h4 className="font-semibold text-slate-800 text-base">{label}</h4>
          {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
        </div>
        <div className={`text-xs px-3 py-1 rounded-full font-medium border ${currentDesc.color} self-start sm:self-auto`}>
          {currentDesc.title} ({value}%)
        </div>
      </div>

      <div className="relative pt-2 pb-1">
        {/* Track gradient */}
        <div className="h-3 w-full rounded-full bg-linear-to-r from-emerald-400 via-amber-400 to-rose-400 opacity-80" />
        
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Custom thumb position indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-amber-500 rounded-full shadow-md pointer-events-none flex items-center justify-center -ml-3 transition-transform active:scale-125"
          style={{ left: `${value}%` }}
        >
          <div className="w-2 h-2 rounded-full bg-amber-500" />
        </div>
      </div>

      <div className="flex justify-between text-xs text-slate-500 font-medium">
        <span className="text-emerald-700 flex items-center gap-1">
          <span>🕊️</span> 0% {leftLabel.split(' ')[0]}
        </span>
        <span className="text-amber-700">50% 平衡</span>
        <span className="text-rose-700 flex items-center gap-1">
          {rightLabel.split(' ')[0]} 100% <span>🛡️</span>
        </span>
      </div>

      <p className="text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 italic">
        💡 {currentDesc.desc}
      </p>
    </div>
  );
};
