import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useRoles } from "~/hooks/useRoles";
import { cn } from "~/lib/utils";
import { roleSchema, type RoleFormData } from "~/schemas/roleSchema";
import type { Role, RolePayload } from "~/types/role.interface";
import ChipController from "../formController.tsx/ChipController";
import InputController from "../formController.tsx/InputController";
import ErrorMessage from "../shared-component/ErrorMessage";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface RoleFormProps {
  mode?: "create" | "update";
  initialData?: Role;
  // When provided, called after a successful save instead of navigating to
  // /role — lets the form be reused inside a dialog (e.g. the Roles tab).
  onSuccess?: () => void;
}

function RoleForm({ mode = "create", initialData, onSuccess }: RoleFormProps) {
  const navigate = useNavigate();
  const { createRole, updateRole } = useRoles();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      user_type: initialData?.user_type ?? "admin",
      role_level: initialData?.role_level ?? 1,
      same_level_edit: initialData?.same_level_edit ?? false,
    },
  }) as any;

  const handleFormSubmit: SubmitHandler<any> = async (data: RoleFormData) => {
    setServerError(null);
    const payload: RolePayload = {
      name: data.name,
      user_type: data.user_type,
      role_level: data.role_level,
      same_level_edit: data.same_level_edit,
    };

    try {
      if (mode === "create") {
        await createRole(payload).unwrap();
      } else if (initialData) {
        await updateRole(initialData.id, payload).unwrap();
      }
      if (onSuccess) onSuccess();
      else navigate("/role");
    } catch (error) {
      setServerError(
        typeof error === "string"
          ? error
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full space-y-4 pb-4"
    >
      <InputController
        name="name"
        control={control}
        label="Role Name"
        placeholder="Enter role name"
        required
      />

      <ChipController
        name="user_type"
        control={control}
        label="User Type"
        options={[
          { value: "admin", label: "Admin" },
          { value: "user", label: "User" },
        ]}
        multi={false}
        required
      />

      <InputController
        name="role_level"
        control={control}
        label="Role Level"
        type="number"
        placeholder="Enter role level (e.g. 1)"
        required
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-textColor">
          Same Level Edit
        </label>
        <Controller
          name="same_level_edit"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <RadioGroup
                value={field.value === true ? "yes" : "no"}
                onValueChange={(val) => field.onChange(val === "yes")}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="same-level-yes" />
                  <label htmlFor="same-level-yes">Yes</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="same-level-no" />
                  <label htmlFor="same-level-no">No</label>
                </div>
              </RadioGroup>
              {error && <ErrorMessage error={error.message as string} />}
            </>
          )}
        />
      </div>

      {serverError && <ErrorMessage error={serverError} />}

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full rounded-full bg-primaryColor px-4 py-2 font-medium text-white transition-colors duration-200",
            isSubmitting && "cursor-not-allowed opacity-60"
          )}
        >
          {mode === "create"
            ? isSubmitting
              ? "Creating..."
              : "Create Role"
            : isSubmitting
              ? "Updating..."
              : "Update Role"}
        </button>
      </div>
    </form>
  );
}

export default RoleForm;
