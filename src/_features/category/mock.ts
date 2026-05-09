import { C } from "_styles/design-tokens";
import type { Category } from "./types";

export const INITIAL_CATEGORIES: Category[] = [
  { id: "c1", name: "식비", color: "#FF6B6B", icon: "utensils" },
  { id: "c2", name: "교통", color: "#339AF0", icon: "car" },
  { id: "c3", name: "주거", color: "#845EF7", icon: "home" },
  { id: "c4", name: "데이트", color: "#FF6B9D", icon: "heart" },
  { id: "c5", name: "쇼핑", color: "#FFA94D", icon: "shopping" },
  { id: "c6", name: "여가", color: "#51CF66", icon: "gamepad" },
  { id: "c7", name: "월급", color: C.blue, icon: "briefcase", isIncome: true },
  { id: "c8", name: "기타수입", color: C.green, icon: "gift", isIncome: true },
];
