import { z } from "zod";

export const userCreateSchema = z.object({
  first_name: z.string().min(2).max(60),
  middle_name: z.string().min(1).max(60),
  last_name: z.string().min(2).max(60),
  email: z
    .string()
    .email("Invalid email")
    .min(5)
    .max(100)
    .regex(/@gmail\.com$/, "Invalid email domain")
    .or(z.literal(""))
    .nullable()
    .optional(),

  mobile: z
    .string()
    .regex(/^[0-9]{10,20}$/, "Invalid mobile number")
    .min(10)
    .max(20),

  birth_day: z.union([z.string(), z.date()]).nullable().optional(),
  satsang_day: z.string().or(z.literal("")).nullable().optional(),
  mulgam: z.string().or(z.literal("")).nullable().optional(),
  smk_no: z.string().or(z.literal("")).nullable().optional(),
  address: z.string().or(z.literal("")).nullable().optional(),

  is_married: z.boolean().optional().default(false),
  is_job: z.boolean().optional().default(false),
  occupation: z.enum(["job", "study", "business"]).optional(),
  occupation_field: z.string().or(z.literal("")).nullable().optional(),
  is_family_leader: z.boolean().optional().default(false),
  family_leader_id: z.number().int().nullable().optional(),
  is_seva: z.boolean().optional().default(false),
  seva: z.string().or(z.literal("")).nullable().optional(),
  parichit_bhakat_name: z.string().or(z.literal("")).nullable().optional(),
  group_id: z.array(z.number().int()).nullable().optional(),
  is_smruti: z.boolean().optional().default(false),
  groups: z
    .array(z.object({ id: z.number().int() }))
    .nullable()
    .optional(),
  user_type: z.enum(["yuva", "group"]),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
