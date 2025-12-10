import { z } from "zod";

export const userCreateSchema = z.object({
  first_name: z.string().min(2),
  middle_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email().optional(),

  mobile: z.string().regex(/^[0-9]{10,20}$/, "Invalid mobile number"),

  // role_id: z.number(),

  birth_day: z.union([z.string(), z.date()]),
  satsang_day: z.string().optional(),
  mulgam: z.string(),
  smk_no: z.string().optional(),
  address: z.string(),

  is_married: z.boolean().optional().default(false),

  occupation: z.enum(["job", "study", "business"]).optional(),
  occupation_field: z.string().optional(),

  is_family_leader: z.boolean().optional().default(false),

  is_seva: z.boolean().optional().default(false),
  seva: z.string().optional(),

  parichit_bhakt_name: z.string(),

  group_id: z.array(z.number().int()),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
