import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { DemoModal } from './components/common/DemoModal';
import { Icon } from './components/common/Icon';

// Screens
import { M01Welcome } from './screens/M01Welcome';
import { M02PhoneAndOtp } from './screens/M02PhoneAndOtp';
import { M03VerifyIdentity } from './screens/M03VerifyIdentity';
import { W01InviteWebPage } from './screens/W01InviteWebPage';
import { M04Home } from './screens/M04Home';
import { M05MyGroups } from './screens/M05MyGroups';
import { M06GroupLedger } from './screens/M06GroupLedger';
import { M07PayoutCalendar } from './screens/M07PayoutCalendar';
import { M08CreateGroupRules } from './screens/M08CreateGroupRules';
import { M09CreateGroupPayoutOrder } from './screens/M09CreateGroupPayoutOrder';
import { M10CreateGroupReview } from './screens/M10CreateGroupReview';
import { M11InviteMembers } from './screens/M11InviteMembers';
import { M12PayContribution } from './screens/M12PayContribution';
import { M13PayWithUSSD } from './screens/M13PayWithUSSD';
import { M14Receipt } from './screens/M14Receipt';
import { M15LatePaymentReminder } from './screens/M15LatePaymentReminder';
import { M16PayoutReleased } from './screens/M16PayoutReleased';
import { M17Activity } from './screens/M17Activity';
import { M18Profile } from './screens/M18Profile';

const AppContent: React.FC = () => {
  const {
    currentRoute,
    navigate,
    toasts,
    removeToast,
    isDemoModalOpen,
    setDemoModalOpen,
    resetAllData,
  } = useApp();
  const { language, setLanguage } = useLanguage();

  const renderScreen = () => {
    switch (currentRoute) {
      case '/welcome':
        return <M01Welcome />;
      case '/sign-in':
        return <M02PhoneAndOtp />;
      case '/verify':
        return <M03VerifyIdentity />;
      case '/join/kasuwa-stall-weekly':
        return <W01InviteWebPage />;
      case '/home':
        return <M04Home />;
      case '/groups':
        return <M05MyGroups />;
      case '/groups/g-kasuwa-atamfa/ledger':
      case '/groups/g-kasuwa-atamfa/rules':
      case '/groups/g-kasuwa-atamfa':
        return <M06GroupLedger />;
      case '/groups/g-kasuwa-atamfa/calendar':
        return <M07PayoutCalendar />;
      case '/groups/new/rules':
        return <M08CreateGroupRules />;
      case '/groups/new/order':
        return <M09CreateGroupPayoutOrder />;
      case '/groups/new/review':
        return <M10CreateGroupReview />;
      case '/groups/g-kasuwa-stall-weekly/invite':
        return <M11InviteMembers />;
      case '/pay':
        return <M12PayContribution />;
      case '/pay/ussd':
        return <M13PayWithUSSD />;
      case '/pay/receipt':
        return <M14Receipt />;
      case '/late':
        return <M15LatePaymentReminder />;
      case '/payout':
        return <M16PayoutReleased />;
      case '/activity':
        return <M17Activity />;
      case '/profile':
        return <M18Profile />;
      default:
        // Handle parameterized or unknown routes
        if (currentRoute.startsWith('/join/')) {
          return <W01InviteWebPage />;
        }
        if (currentRoute.includes('/ledger')) {
          return <M06GroupLedger />;
        }
        if (currentRoute.includes('/calendar')) {
          return <M07PayoutCalendar />;
        }
        if (currentRoute.includes('/invite')) {
          return <M11InviteMembers />;
        }
        return <M04Home />;
    }
  };

  return (
    <DeviceFrame>
      {renderScreen()}

      {/* Floating Demo Launcher & Language Switcher on mobile if not in desktop header */}
      <div className="md:hidden fixed bottom-28 right-4 flex flex-col gap-2 z-40">
        <button
          type="button"
          onClick={() => {
            const nextLang = language === 'en' ? 'ha' : language === 'ha' ? 'ar' : 'en';
            setLanguage(nextLang);
          }}
          title="Switch Language"
          className="w-11 h-11 rounded-full bg-white text-[#0B3D2E] shadow-lg flex items-center justify-center border border-[#E3DDCF] active:scale-95 text-[12px] font-bold"
        >
          {language.toUpperCase()}
        </button>
        <button
          type="button"
          onClick={() => setDemoModalOpen(true)}
          title="Prototype Navigator"
          className="w-11 h-11 rounded-full bg-[#0B3D2E] text-white shadow-lg flex items-center justify-center border border-white/20 active:scale-95"
        >
          <Icon name="list" size={20} />
        </button>
      </div>

      {/* Toast Notification Container */}
      {toasts.length > 0 && (
        <div className="absolute top-12 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              className={`p-3.5 rounded-[14px] shadow-lg border text-[13px] font-semibold flex items-center gap-2.5 pointer-events-auto transition-all animate-in fade-in slide-in-from-top-4 duration-200 ${
                toast.type === 'success'
                  ? 'bg-[#0B3D2E] text-white border-[#2FBF85]/30'
                  : toast.type === 'alert'
                  ? 'bg-[#FDECEA] text-[#B42318] border-[#B42318]/30'
                  : 'bg-white text-[#0B3D2E] border-[#E3DDCF]'
              }`}
            >
              {toast.type === 'success' ? (
                <Icon name="check" size={16} className="text-[#2FBF85] shrink-0" strokeWidth={2.5} />
              ) : toast.type === 'alert' ? (
                <Icon name="alert" size={16} className="text-[#B42318] shrink-0" strokeWidth={2.2} />
              ) : (
                <Icon name="info" size={16} className="text-[#0F8A5F] shrink-0" strokeWidth={2.2} />
              )}
              <span className="flex-1 leading-snug">{toast.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Prototype Navigator Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onNavigate={navigate}
        onResetData={resetAllData}
      />
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}
