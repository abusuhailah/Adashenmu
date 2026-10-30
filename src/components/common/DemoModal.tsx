import React from 'react';
import { Icon } from './Icon';

export interface ScreenRouteInfo {
  route: string;
  name: string;
  category: 'onboarding' | 'main' | 'group' | 'payment' | 'special';
}

export const allScreens: ScreenRouteInfo[] = [
  { route: '/welcome', name: 'M-01 Welcome (Dark)', category: 'onboarding' },
  { route: '/sign-in', name: 'M-02 Phone & OTP', category: 'onboarding' },
  { route: '/verify', name: 'M-03 Verify Identity (NIN)', category: 'onboarding' },
  { route: '/join/kasuwa-stall-weekly', name: 'W-01 Invite Web Page', category: 'onboarding' },
  { route: '/home', name: 'M-04 Home Dashboard', category: 'main' },
  { route: '/groups', name: 'M-05 My Groups', category: 'main' },
  { route: '/groups/g-kasuwa-atamfa/ledger', name: 'M-06 Group Ledger', category: 'group' },
  { route: '/groups/g-kasuwa-atamfa/calendar', name: 'M-07 Payout Calendar', category: 'group' },
  { route: '/groups/new/rules', name: 'M-08 Create Group: Rules (Step 1)', category: 'group' },
  { route: '/groups/new/order', name: 'M-09 Create Group: Order (Step 2)', category: 'group' },
  { route: '/groups/new/review', name: 'M-10 Create Group: Review (Step 3)', category: 'group' },
  { route: '/groups/g-kasuwa-stall-weekly/invite', name: 'M-11 Invite Members', category: 'group' },
  { route: '/pay', name: 'M-12 Pay Contribution', category: 'payment' },
  { route: '/pay/ussd', name: 'M-13 Pay with USSD', category: 'payment' },
  { route: '/pay/receipt', name: 'M-14 Payment Receipt & Timeline', category: 'payment' },
  { route: '/late', name: 'M-15 Late Payment Reminder (Safiya)', category: 'special' },
  { route: '/payout', name: 'M-16 Payout Released (Hauwa, Mon 30 Nov)', category: 'special' },
  { route: '/activity', name: 'M-17 Activity History', category: 'main' },
  { route: '/profile', name: 'M-18 Profile & Settings', category: 'main' },
];

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onResetData: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[360px] bg-white rounded-[20px] p-5 shadow-2xl border border-[#E3DDCF] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#E3DDCF]">
          <div>
            <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E]">
              Prototype Navigator
            </h3>
            <p className="text-[12px] text-[#4F5F57]">
              Jump to any of the 19 designed screens
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F0] flex items-center justify-center text-[#4F5F57] hover:bg-[#EFEAE0]"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Featured Story Screens */}
        <div className="my-3 p-3 rounded-[12px] bg-[#FFF4DB] border border-[#F2B33D]/40">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A5A00] mb-2">
            Story Milestone Screens
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('/late');
                onClose();
              }}
              className="px-2.5 py-2 rounded-[8px] bg-white border border-[#E3DDCF] text-left text-[12px] font-semibold text-[#B42318] hover:border-[#B42318] transition-colors"
            >
              M-15 Late Reminder
              <span className="block text-[10px] text-[#4F5F57] font-normal">Fri 30 Oct</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('/payout');
                onClose();
              }}
              className="px-2.5 py-2 rounded-[8px] bg-[#072A20] text-left text-[12px] font-semibold text-[#2FBF85] hover:opacity-90 transition-opacity"
            >
              M-16 Payout Released
              <span className="block text-[10px] text-[#F2B33D] font-normal">Mon 30 Nov</span>
            </button>
          </div>
        </div>

        {/* List of screens */}
        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-1.5 pr-1">
          {allScreens.map((screen) => (
            <button
              key={screen.route}
              type="button"
              onClick={() => {
                onNavigate(screen.route);
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-[10px] hover:bg-[#E3F4EC] text-[#0B3D2E] text-[13px] font-medium transition-colors flex items-center justify-between group"
            >
              <span className="truncate">{screen.name}</span>
              <span className="text-[10px] text-[#8A968F] font-mono group-hover:text-[#0F8A5F]">
                {screen.route}
              </span>
            </button>
          ))}
        </div>

        {/* Footer with Reset */}
        <div className="pt-3 border-t border-[#E3DDCF] flex items-center justify-between gap-2 mt-2">
          <button
            type="button"
            onClick={() => {
              onResetData();
              onClose();
            }}
            className="text-[12px] font-medium text-[#B42318] hover:underline"
          >
            Reset Mock Data
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-[10px] bg-[#0F8A5F] text-white text-[13px] font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
