export interface MemberData {
  id: number;
  role_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  img: string;
  email: string;
  mobile: string;
  password: string | null;
  birth_day?: string;
  satsang_day?: string;
  mulgam?: string;
  smk_no?: string;
  address?: string;
  is_married?: boolean;
  is_job?: boolean;
  occupation?: "job" | "study" | "business";
  occupation_field?: string;
  is_family_leader?: boolean;
  family_leader_id?: number;
  is_seva?: boolean;
  seva?: string;
  parichit_bhakt_name?: string;
  group_id?: number[];
  attendance_id?: number;
  is_present?: boolean;
  total_sabha: number;
  total_present: number;
}

export interface PoshakGroupData {
  id: number;
  poshak_leader_id: number;
  group_type: string;
  group_name: string;
  status: boolean;
}

export interface MemberPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email?: string;
  mobile: string;
  role_id: number;
  birth_day?: string | Date;
  satsang_day?: string;
  mulgam?: string;
  smk_no?: string;
  address?: string;
  is_married?: boolean;
  is_job?: boolean;
  occupation?: "job" | "study" | "business";
  occupation_field?: string;
  is_family_leader?: boolean;
  family_leader_id?: number;
  is_seva?: boolean;
  seva?: string;
  parichit_bhakt_name?: string;
  group_id?: number[];
}

export type MemberStatus = "present" | "absent";
