import React from 'react';
import {
  Home,
  Users,
  Wallet,
  Activity,
  User,
  Shield,
  Clock,
  Check,
  AlertTriangle,
  ArrowUpRight,
  X,
  Undo2,
  Calendar,
  Lock,
  Landmark,
  Globe,
  Plus,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Vote,
  MessageSquare,
  LogOut,
  Phone,
  Send,
  MoreHorizontal,
  ArrowLeft,
  Filter,
  Shuffle,
  Copy,
  Bell,
  Share2,
  List,
  Hash,
  Download,
  CheckCircle2,
  HelpCircle,
  GripVertical
} from 'lucide-react';

export type IconName =
  | 'home'
  | 'users'
  | 'wallet'
  | 'activity'
  | 'user'
  | 'shield'
  | 'clock'
  | 'check'
  | 'alert'
  | 'arrow-up-right'
  | 'x'
  | 'undo'
  | 'calendar'
  | 'lock'
  | 'bank'
  | 'globe'
  | 'plus'
  | 'chevron-right'
  | 'chevron-down'
  | 'card'
  | 'vote'
  | 'message'
  | 'pot'
  | 'logout'
  | 'phone'
  | 'send'
  | 'more'
  | 'arrow-left'
  | 'filter'
  | 'shuffle'
  | 'copy'
  | 'bell'
  | 'share'
  | 'list'
  | 'hash'
  | 'download'
  | 'help'
  | 'grip';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName | string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = '',
  strokeWidth = 2,
  ...props
}) => {
  // Custom Adashe pot SVG icon from the design pack
  if (name === 'pot') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <path d="M8 5h8l-1 3c3 1.5 5 4 5 7 0 4-3.6 6-8 6s-8-2-8-6c0-3 2-5.5 5-7z" />
        <path d="M5 14c2 1 4.3 1.5 7 1.5s5-.5 7-1.5" />
      </svg>
    );
  }

  const iconProps = {
    size,
    className,
    strokeWidth,
    ...props,
  };

  switch (name) {
    case 'home':
      return <Home {...iconProps} />;
    case 'users':
      return <Users {...iconProps} />;
    case 'wallet':
      return <Wallet {...iconProps} />;
    case 'activity':
      return <Activity {...iconProps} />;
    case 'user':
      return <User {...iconProps} />;
    case 'shield':
      return <Shield {...iconProps} />;
    case 'clock':
      return <Clock {...iconProps} />;
    case 'check':
      return <Check {...iconProps} />;
    case 'check-circle':
      return <CheckCircle2 {...iconProps} />;
    case 'alert':
      return <AlertTriangle {...iconProps} />;
    case 'arrow-up-right':
      return <ArrowUpRight {...iconProps} />;
    case 'x':
      return <X {...iconProps} />;
    case 'undo':
      return <Undo2 {...iconProps} />;
    case 'calendar':
      return <Calendar {...iconProps} />;
    case 'lock':
      return <Lock {...iconProps} />;
    case 'bank':
      return <Landmark {...iconProps} />;
    case 'globe':
      return <Globe {...iconProps} />;
    case 'plus':
      return <Plus {...iconProps} />;
    case 'chevron-right':
      return <ChevronRight {...iconProps} />;
    case 'chevron-down':
      return <ChevronDown {...iconProps} />;
    case 'card':
      return <CreditCard {...iconProps} />;
    case 'vote':
      return <Vote {...iconProps} />;
    case 'message':
      return <MessageSquare {...iconProps} />;
    case 'logout':
      return <LogOut {...iconProps} />;
    case 'phone':
      return <Phone {...iconProps} />;
    case 'send':
      return <Send {...iconProps} />;
    case 'more':
      return <MoreHorizontal {...iconProps} />;
    case 'arrow-left':
      return <ArrowLeft {...iconProps} />;
    case 'filter':
      return <Filter {...iconProps} />;
    case 'shuffle':
      return <Shuffle {...iconProps} />;
    case 'copy':
      return <Copy {...iconProps} />;
    case 'bell':
      return <Bell {...iconProps} />;
    case 'share':
      return <Share2 {...iconProps} />;
    case 'list':
      return <List {...iconProps} />;
    case 'hash':
      return <Hash {...iconProps} />;
    case 'download':
      return <Download {...iconProps} />;
    case 'help':
      return <HelpCircle {...iconProps} />;
    case 'grip':
      return <GripVertical {...iconProps} />;
    default:
      return <span className={`inline-block ${className}`} style={{ width: size, height: size }} />;
  }
};
