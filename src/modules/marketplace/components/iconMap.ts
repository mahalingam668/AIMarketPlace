import {
  Brain, Image, Code, BarChart3, Mic, Video, FileText, Search, Bot,
  Activity, Link2, Users, ShoppingCart, Scale, Headphones, Database,
  Terminal, GitBranch, DollarSign, MapPin, UserCheck, Fingerprint, Server,
  Plug, Cpu, Settings, Megaphone, Film, ShieldCheck, ArrowRightLeft, Glasses,
  Truck, CheckSquare, TrendingUp, Shield, ListTodo, Globe, Sparkles,
  CheckCircle, Smartphone, Palette, Briefcase, type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Brain, Image, Code, BarChart3, Mic, Video, FileText, Search, Bot,
  Activity, Link2, Users, ShoppingCart, Scale, Headphones, Database,
  Terminal, GitBranch, DollarSign, MapPin, UserCheck, Fingerprint, Server,
  Plug, Cpu, Settings, Megaphone, Film, ShieldCheck, ArrowRightLeft, Glasses,
  Truck, CheckSquare, TrendingUp, Shield, ListTodo, Globe, Sparkles, CheckCircle,
  Smartphone, Palette, Briefcase,
};

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] || Sparkles;
}
