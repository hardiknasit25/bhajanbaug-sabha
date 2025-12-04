export interface SabhaData {
  id: number;
  title: string;
  sabha_date: string;
  status: SabhaStatus;
}

export type SabhaStatus = "upcoming" | "completed" | "running";
