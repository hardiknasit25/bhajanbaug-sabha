import { CalendarDays, ChartColumn, Home, UsersRound } from "lucide-react";
import type { TabItem } from "~/types/tab.interface";

export const tabsConfig: TabItem[] = [
  // Each tab is treated as its own permission module (gated by `moduleKey`).
  // Gating is fail-open: a tab only hides once its module is created/assigned
  // and read is denied, so adding a key here never breaks the nav by itself.
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/",
    show: true,
    moduleKey: "home",
  },
  {
    id: "sabha",
    label: "Sabha",
    icon: CalendarDays,
    path: "/sabha",
    show: true,
    moduleKey: "sabha",
    // The "sabha" module exists on the backend, so enforce it strictly:
    // hidden unless the role is granted sabha read (admins bypass).
    strict: true,
  },
  {
    id: "members",
    label: "Members",
    icon: UsersRound,
    path: "/members",
    show: true,
    // The members data is governed by the existing "user" module on the backend.
    moduleKey: "user",
  },
  {
    id: "report",
    label: "Report",
    icon: ChartColumn,
    path: "/report",
    show: true,
    moduleKey: "report",
  },
];
