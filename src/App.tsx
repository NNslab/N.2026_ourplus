/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, FamilyAccount, ParentSurvey, StudentSurvey, RewardCategory, AIAnalysisResult, UnitStatus } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { LandingAuthView } from './views/LandingAuthView';
import { ContractFlowView } from './views/ContractFlowView';
import { SubscriptionPaymentView } from './views/SubscriptionPaymentView';
import { FirstTimeSetupSurveyView } from './views/FirstTimeSetupSurveyView';
import { ParentDashboardView } from './views/ParentDashboardView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { FamilyAIReportModal } from './components/FamilyAIReportModal';

export default function App() {
  const [familyData, setFamilyData] = useState<FamilyAccount>(() => storageService.getFamilyData());
  const [activeRole, setActiveRole] = useState<UserRole>(() => storageService.getActiveRole());
  const [currentView, setCurrentView] = useState<string>('landing');
  const [showGlobalHeartToHeart, setShowGlobalHeartToHeart] = useState<boolean>(false);

  // Check URL params on initial load (e.g. ?code=...&role=student)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role') as UserRole;
    if (roleParam === 'parent' || roleParam === 'student') {
      setActiveRole(roleParam);
      storageService.setActiveRole(roleParam);
      if (params.get('code')) {
        setCurrentView('contracts');
      }
    }
  }, []);

  const handleSwitchRole = (role: UserRole) => {
    setActiveRole(role);
    storageService.setActiveRole(role);
  };

  const handleSelectRoleAndStart = (role: UserRole, isFirstTime: boolean) => {
    handleSwitchRole(role);
    if (isFirstTime) {
      setCurrentView('contracts');
    } else {
      if (familyData.subscription.paid) {
        if (!familyData.parentSurvey || !familyData.studentSurvey) {
          setCurrentView('first_setup');
        } else {
          setCurrentView(role === 'parent' ? 'parent_dash' : 'student_dash');
        }
      } else {
        setCurrentView('contracts');
      }
    }
  };

  const handleQuickLogin = (role: UserRole, _username: string) => {
    handleSwitchRole(role);
    if (!familyData.subscription.paid) {
      setCurrentView('subscription');
    } else if (!familyData.parentSurvey || !familyData.studentSurvey) {
      setCurrentView('first_setup');
    } else {
      setCurrentView(role === 'parent' ? 'parent_dash' : 'student_dash');
    }
  };

  const handleSignParentContract = (name: string, img?: string) => {
    const updated = storageService.signParentContract(name, img);
    setFamilyData({ ...updated });
  };

  const handleSignStudentContract = (name: string, img?: string) => {
    const updated = storageService.signStudentContract(name, img);
    setFamilyData({ ...updated });
  };

  const handlePaymentSuccess = (planId: 'monthly' | 'yearly' | 'grade_span') => {
    const updated = storageService.completePayment(planId);
    setFamilyData({ ...updated });
    setCurrentView('first_setup');
  };

  const handleSavePassword = (role: UserRole, pwd: string) => {
    const updated = storageService.setPassword(role, pwd);
    setFamilyData({ ...updated });
  };

  const handleSaveParentSurvey = (survey: ParentSurvey) => {
    const updated = storageService.saveParentSurvey(survey);
    setFamilyData({ ...updated });
  };

  const handleSaveStudentSurvey = (survey: StudentSurvey) => {
    const updated = storageService.saveStudentSurvey(survey);
    setFamilyData({ ...updated });
  };

  const handleSaveAIAnalysis = (analysis: AIAnalysisResult) => {
    const updated = storageService.saveAIAnalysis(analysis);
    setFamilyData({ ...updated });
  };

  const handleToggleUnit = (unitId: string) => {
    const updated = storageService.toggleUnitComplete(unitId);
    setFamilyData({ ...updated });
  };

  const handleUpdateUnitStatus = (unitId: string, status: UnitStatus, notes?: string) => {
    const updated = storageService.updateUnitStatus(unitId, status, notes);
    setFamilyData({ ...updated });
  };

  const handleSaveUnitNotes = (unitId: string, notes: string) => {
    const updated = storageService.saveUnitNotes(unitId, notes);
    setFamilyData({ ...updated });
  };

  const handleAddNewWish = (wish: { title: string; category: RewardCategory; effortCommitment: string; emotionalQuestion?: string }) => {
    const updated = storageService.addWish(wish);
    setFamilyData({ ...updated });
  };

  const handleApproveWish = (wishId: string, customNote?: string) => {
    const updated = storageService.approveWishDirectly(wishId, customNote);
    setFamilyData({ ...updated });
  };

  const handleSetWishRequirement = (wishId: string, req: { requiredUnitRange?: string; customNote?: string }) => {
    const updated = storageService.updateWishRequirement(wishId, req);
    setFamilyData({ ...updated });
  };

  const handleClaimWish = (wishId: string, emotionalAnswer?: string) => {
    const updated = storageService.claimWish(wishId, emotionalAnswer);
    setFamilyData({ ...updated });
  };

  const handleResetDemo = () => {
    const demoData = storageService.resetToDemo();
    setFamilyData({ ...demoData });
    setCurrentView(activeRole === 'parent' ? 'parent_dash' : 'student_dash');
  };

  const handleResetFresh = () => {
    const fresh = storageService.resetToFresh();
    setFamilyData({ ...fresh });
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeRole={activeRole}
        onSwitchRole={handleSwitchRole}
        familyData={familyData}
        onOpenAIReport={() => setShowGlobalHeartToHeart(true)}
        onResetDemo={handleResetDemo}
        onResetFresh={handleResetFresh}
      />

      {/* Main View Router */}
      <main>
        {currentView === 'landing' && (
          <LandingAuthView
            onSelectRoleAndStart={handleSelectRoleAndStart}
            onQuickLogin={handleQuickLogin}
            familyData={familyData}
          />
        )}

        {currentView === 'contracts' && (
          <ContractFlowView
            familyData={familyData}
            activeRole={activeRole}
            onSignParent={handleSignParentContract}
            onSignStudent={handleSignStudentContract}
            onProceedToPayment={() => setCurrentView('subscription')}
          />
        )}

        {currentView === 'subscription' && (
          <SubscriptionPaymentView
            familyData={familyData}
            onPaymentSuccess={handlePaymentSuccess}
            onProceedToFirstSetup={() => setCurrentView('first_setup')}
          />
        )}

        {currentView === 'first_setup' && (
          <FirstTimeSetupSurveyView
            familyData={familyData}
            activeRole={activeRole}
            onSwitchRole={handleSwitchRole}
            onSavePassword={handleSavePassword}
            onSaveParentSurvey={handleSaveParentSurvey}
            onSaveStudentSurvey={handleSaveStudentSurvey}
            onSaveAIAnalysis={handleSaveAIAnalysis}
            onProceedToDashboard={(role) => {
              setCurrentView(role === 'parent' ? 'parent_dash' : 'student_dash');
            }}
          />
        )}

        {currentView === 'parent_dash' && (
          <ParentDashboardView
            familyData={familyData}
            onApproveWish={handleApproveWish}
            onSetWishRequirement={handleSetWishRequirement}
            onClaimWish={handleClaimWish}
          />
        )}

        {currentView === 'student_dash' && (
          <StudentDashboardView
            familyData={familyData}
            onToggleUnit={handleToggleUnit}
            onUpdateUnitStatus={handleUpdateUnitStatus}
            onSaveUnitNotes={handleSaveUnitNotes}
            onAddNewWish={handleAddNewWish}
            onClaimWish={handleClaimWish}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-4 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-1 text-slate-600 font-bold">
          <span>Our+</span>
          <span>•</span>
          <span>用最輕鬆的方式給這個家最貼心的溫度</span>
        </div>
        <p>雙向開明誠實條約 ｜ LINE Pay 安心方案 ｜ 家庭心靈默契卡與真心話 ｜ 108 課綱學科自主打卡選單與許願池</p>
      </footer>

      {/* Global Heart-to-Heart Modal */}
      <FamilyAIReportModal
        isOpen={showGlobalHeartToHeart}
        onClose={() => setShowGlobalHeartToHeart(false)}
        analysis={familyData.aiAnalysis}
        parentSurvey={familyData.parentSurvey}
        studentSurvey={familyData.studentSurvey}
      />
    </div>
  );
}
