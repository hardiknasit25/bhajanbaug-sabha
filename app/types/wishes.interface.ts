export interface Wish {
  id: number;
  type: "birthday";
  name: string;
  smk_no: string | null;
  day: number;
  month: number;
  // Pretty label like "27 November".
  date_label: string;
  is_today: boolean;
  days_until: number;
}
