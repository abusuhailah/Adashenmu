import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { PartnerBankModal } from './components/common/PartnerBankModal';
import { JoinGroupModal } from './components/common/JoinGroupModal';
import { RoleSelectionModal } from './components/common/RoleSelectionModal';
import { PaymentHistoryModal } from './components/common/PaymentHistoryModal';
import { GoogleAccountSelectModal } from './components/common/GoogleAccountSelectModal';
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
    toasts,
    removeToast,
    isPartnerBankModalOpen,
    setPartnerBankModalOpen,
    isJoinModalOpen,
    setJoinModalOpen,
    isRoleModalOpen,
    setRoleModalOpen,
    isPaymentHistoryModalOpen,
    setPaymentHistoryModalOpen,
    isGoogleAccountModalOpen,
    setGoogleAccountModalOpen,
    signInWithSelectedEmail,
    signInWithGoogle,
  } = useApp();

  const renderScreen = () => {
    switch (currentRoute) {
      case '/welcome':
      case '/sign-in':
        return <M01Welcome />;
      case '/verify':
        return <M04Home />;
      case '/home':
        return <M04Home />;
      case '/groups':
        return <M05MyGroups />;
      case '/groups/new/rules':
        return <M08CreateGroupRules />;
      case '/groups/new/order':
        return <M09CreateGroupPayoutOrder />;
      case '/groups/new/review':
        return <M10CreateGroupReview />;
      case '/groups/invite':
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
        if (currentRoute.startsWith('/join')) {
          return <W01InviteWebPage />;
        }
        if (currentRoute.includes('/calendar')) {
          return <M07PayoutCalendar />;
        }
        if (currentRoute.includes('/rules')) {
          return <M06GroupLedger />;
        }
        if (currentRoute.includes('/ledger') || currentRoute.startsWith('/groups/')) {
          return <M06GroupLedger />;
        }
        return <M04Home />;
    }
  };

  return (
    <DeviceFrame>
      {renderScreen()}



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

      {/* Modals for live testing */}
      <PartnerBankModal
        isOpen={isPartnerBankModalOpen}
        onClose={() => setPartnerBankModalOpen(false)}
      />

      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />

      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />

      <PaymentHistoryModal
        isOpen={isPaymentHistoryModalOpen}
        onClose={() => setPaymentHistoryModalOpen(false)}
      />

      <GoogleAccountSelectModal
        isOpen={isGoogleAccountModalOpen}
        onClose={() => setGoogleAccountModalOpen(false)}
        onSelectAccount={async (email, name) => {
          await signInWithSelectedEmail(email, name);
        }}
        onTriggerGooglePopup={async () => {
          await signInWithGoogle();
        }}
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
