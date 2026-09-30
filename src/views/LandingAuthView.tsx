import React, { useState } from 'react';
import { UserRole, FamilyAccount } from '../types';
import { Heart, ShieldCheck, Gift, ArrowRight, User, GraduationCap, Lock, KeyRound, Sparkles, MessageSquareHeart, BookOpen } from 'lucide-react';

interface LandingAuthViewProps {
  onSelectRoleAndStart: (role: UserRole, isFirstTime: boolean) => void;
  onQuickLogin: (role: UserRole, username: string) => void;
  familyData: FamilyAccount;
}

export const LandingAuthView: React.FC<LandingAuthViewProps> = ({
  onSelectRoleAndStart,
  onQuickLogin,
  familyData,
}) => {
  const [activeTab, setActiveTab] = useState<'first_time' | 'existing_login'>('first_time');
  const [loginRole, setLoginRole] = useState<UserRole>('parent');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const targetCred = familyData.credentials[loginRole];
    if (usernameInput.trim() === targetCred.username || usernameInput.trim().length > 2) {
      onQuickLogin(loginRole, usernameInput.trim());
    } else {
      setLoginError(`找不到帳號「${usernameInput}」，請確認是否已完成條約簽署與付款，或切換為首次加入。`);
    }
  };

  const handleFillDemoCreds = (role: UserRole) => {
    setLoginRole(role);
    setUsernameInput(familyData.credentials[role].username);
    setPasswordInput('password123');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-linear-to-b from-amber-50/40 via-white to-orange-50/20 py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>雙向家庭誓約 × 彼此真心話 × 108 課綱學科自主打卡 × 願望激勵池</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight">
            Our<span className="text-amber-500 font-black">+</span>
          </h1>

          <p className="text-xl sm:text-2xl font-bold bg-linear-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-transparent">
            用最輕鬆的方式給這個家最貼心的溫度
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            沒有說教、沒有緊繃的監督。透過家長的<strong>【開明條約】</strong>與孩子的<strong>【誠實條約】</strong>，
            搭配學科進度自主打卡與心靈願望池，讓學習變得自主、讓願望實現、讓愛在家庭中自然流動。
          </p>
        </div>

        {/* Auth Choice Card */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg border border-amber-100/90 p-6 sm:p-8">
          {/* Tabs: 第一次登入 (註冊簽署) VS 已有帳號登入 */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-7">
            <button
              type="button"
              onClick={() => setActiveTab('first_time')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'first_time'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>第一次加入（簽署條約）</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('existing_login')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'existing_login'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>已有帳號登入</span>
            </button>
          </div>

          {/* TAB 1: 第一次加入 */}
          {activeTab === 'first_time' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-800">請選擇您的身份以開始誓約之旅：</h3>
                <p className="text-xs text-slate-500">首次使用需先由家長與學生依序簽署條約並開通帳號</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Parent Choice */}
                <div
                  onClick={() => onSelectRoleAndStart('parent', true)}
                  className="group p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 hover:border-amber-400 hover:bg-amber-50/80 transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-amber-800 uppercase">Parent Step</div>
                      <h4 className="text-base font-black text-slate-800 mt-0.5">我是家長・首次加入</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        簽署【開明條約】，為孩子營造包容自在的學習環境與家庭默契。
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition">
                    <span>開始家長簽署流程</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>

                {/* Student Choice */}
                <div
                  onClick={() => onSelectRoleAndStart('student', true)}
                  className="group p-5 rounded-2xl border-2 border-sky-200 bg-sky-50/40 hover:border-sky-400 hover:bg-sky-50/80 transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-sky-800 uppercase">Student Step</div>
                      <h4 className="text-base font-black text-slate-800 mt-0.5">我是學生・首次加入</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        簽署【誠實條約】，用自律與坦誠換取信任，開啟學科選單與許願池！
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-bold text-sky-700 group-hover:translate-x-1 transition">
                    <span>開始學生簽署流程</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 已有帳號登入 */}
          {activeTab === 'existing_login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Role Toggle for Login */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">請選擇登入身份：</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('parent');
                      setUsernameInput(familyData.credentials.parent.username);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      loginRole === 'parent'
                        ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-600" />
                    <span>家長帳號登入</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('student');
                      setUsernameInput(familyData.credentials.student.username);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      loginRole === 'student'
                        ? 'bg-sky-100 border-sky-400 text-sky-900 ring-2 ring-sky-400/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-sky-600" />
                    <span>學生帳號登入</span>
                  </button>
                </div>
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {loginRole === 'parent' ? '家長專屬帳號 (例如: P-OUR-8829)' : '學生專屬帳號 (例如: S-OUR-8829)'}
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={loginRole === 'parent' ? 'P-OUR-8829' : 'S-OUR-8829'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-500/50"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">密碼</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="請輸入密碼"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/50"
                  required
                />
              </div>

              {loginError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {loginError}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>立即進入 {loginRole === 'parent' ? '家長專屬看板' : '學生學習台'}</span>
              </button>

              {/* Quick Demo Fill */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>快速填入示範帳號：</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemoCreds('parent')}
                    className="text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    家長帳號
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => handleFillDemoCreds('student')}
                    className="text-sky-700 font-bold hover:underline cursor-pointer"
                  >
                    學生帳號
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">雙向誓約與信任</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              家長承諾聆聽與不先批判，孩子承諾自律與坦誠分享，打下家庭最有溫度的默契基石。
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">家庭真心話與心靈默契</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              對照父母的期許與孩子的真心話，看見彼此心中的溫度，提供溫暖的親職交流小叮嚀。
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">學科自主打卡與願望池</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              108 課綱學科自主打卡與心得筆記，孩子許下心願並承諾努力，家長溫暖加碼激勵條件！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
