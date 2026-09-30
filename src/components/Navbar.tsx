import React from 'react';
import { UserRole, FamilyAccount } from '../types';
import { Heart, RefreshCw } from 'lucide-react';

interface NavbarProps {
  currentView?: string;
  onNavigate: (view: string) => void;
  activeRole?: UserRole;
  onSwitchRole?: (role: UserRole) => void;
  familyData?: FamilyAccount;
  onOpenAIReport?: () => void;
  onResetDemo?: () => void;
  onResetFresh?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onResetDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100/70 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Slogan */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-amber-400/20 group-hover:scale-105 transition">
              <Heart className="w-5 h-5 fill-white/90" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  Our<span className="text-amber-500 font-black">+</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-bold">
                  家庭溫度與自主學習
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                用最輕鬆的方式給這個家最貼心的溫度
              </p>
            </div>
          </div>

          {/* Right Action Tools: Quick Demo Switch */}
          {onResetDemo && (
            <div className="flex items-center">
              <button
                type="button"
                onClick={onResetDemo}
                title="載入已完成雙向條約與默契問卷的範例家庭"
                className="p-2 text-slate-400 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition cursor-pointer text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-[11px] font-medium">示範數據</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
