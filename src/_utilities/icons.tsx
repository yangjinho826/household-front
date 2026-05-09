import {
  Briefcase,
  Building2,
  Car,
  Coffee,
  Gamepad2,
  Gift,
  Heart,
  Home,
  PiggyBank,
  ShoppingBag,
  TrendingUp,
  Utensils,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  home: Home,
  heart: Heart,
  shopping: ShoppingBag,
  gamepad: Gamepad2,
  briefcase: Briefcase,
  gift: Gift,
  building: Building2,
  piggy: PiggyBank,
  trending: TrendingUp,
};

export function getCategoryIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Coffee;
}
