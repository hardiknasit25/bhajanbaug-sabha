export interface MemberData {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  mobile_no: number;
  birth_date: string;
  satsang_day: string;
  mulgam: string;
  smk_no: string;
  address: string;
  hajri_no: number;
  img: string;
  status: MemberStatus;
}

export type MemberStatus = "present" | "absent";
