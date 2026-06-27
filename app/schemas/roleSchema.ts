import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  user_type: z.enum(["admin", "user"]),
  // Number inputs hand back strings; coerce so the payload is a real number.
  role_level: z.coerce
    .number()
    .int("Role level must be a whole number")
    .min(0, "Role level cannot be negative")
    .max(99, "Role level is too large"),
  same_level_edit: z.boolean(),
});

export type RoleFormData = z.infer<typeof roleSchema>;
