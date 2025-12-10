import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useMembers } from "~/hooks/useMembers";
import { cn } from "~/lib/utils";
import {
  userCreateSchema,
  type UserCreateFormData,
} from "~/schemas/memberSchema";
import type { MemberPayload } from "~/types/members.interface";
import ChipController from "../formController.tsx/ChipController";
import DatePickerController from "../formController.tsx/DatePickerController";
import InputController from "../formController.tsx/InputController";
import MultiSelect from "../formController.tsx/MultiSelect";
import TextAreaController from "../formController.tsx/TextAreaController";
import ErrorMessage from "../shared-component/ErrorMessage";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface MemberFormProps {
  mode?: "create" | "update";
  initialData?: Partial<UserCreateFormData>;
}

const occupationOptions = [
  { value: "job", label: "Job" },
  { value: "study", label: "Study" },
  { value: "business", label: "Business" },
];

const roleOptions = [
  { value: "1", label: "Member" },
  { value: "2", label: "Admin" },
  { value: "3", label: "Coordinator" },
];

const satsangDayOptions = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

function MemberForm({ mode = "create", initialData }: MemberFormProps) {
  const { groupSelect, fetchGroupSelect, createMember } = useMembers();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      middle_name: initialData?.middle_name || "",
      email: initialData?.email || "",
      mobile: initialData?.mobile || "",
      birth_day: initialData?.birth_day || "",
      satsang_day: initialData?.satsang_day || "",
      mulgam: initialData?.mulgam || "",
      smk_no: initialData?.smk_no || "",
      address: initialData?.address || "",
      is_married: initialData?.is_married ?? false,
      is_family_leader: initialData?.is_family_leader ?? false,
      is_seva: initialData?.is_seva ?? false,
      occupation: initialData?.occupation,
      occupation_field: initialData?.occupation_field || "",
      seva: initialData?.seva || "",
      parichit_bhakt_name: initialData?.parichit_bhakt_name || "",
      group_id: initialData?.group_id || [],
    },
  }) as any;

  const handleFormSubmit: SubmitHandler<any> = async (
    data: UserCreateFormData
  ) => {
    const payload: MemberPayload = {
      ...data,
      is_job: data.occupation === "job",
      family_leader_id: null,
    };
    console.log("payload: ", payload);
    if (mode === "create") {
      await createMember(payload);
    }
  };

  useEffect(() => {
    fetchGroupSelect();
  }, []);

  return (
    <div className="w-full h-full">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="w-full space-y-4 pb-4"
      >
        {/* Name Section */}
        <InputController
          name="first_name"
          control={control}
          label="First Name"
          placeholder="Enter first name"
          required
        />

        <InputController
          name="middle_name"
          control={control}
          label="Middle Name"
          placeholder="Enter middle name"
          required
        />

        <InputController
          name="last_name"
          control={control}
          label="Last Name"
          placeholder="Enter last name"
          required
        />

        <InputController
          name="email"
          control={control}
          label="Email"
          type="email"
          placeholder="Enter email address"
          required
        />

        <InputController
          name="mobile"
          control={control}
          label="Mobile Number"
          placeholder="Enter 10 digit mobile number"
          required
        />

        {/* Role & Organization Section */}
        {/* <ChipController
          name="role_id"
          control={control}
          label="Role"
          placeholder="Select a role"
          options={roleOptions}
          multi={false}
          required
        /> */}

        <InputController
          name="smk_no"
          control={control}
          label="SMK Number"
          placeholder="Enter SMK number"
        />

        {/* Personal Information Section */}

        <DatePickerController
          name="birth_day"
          control={control}
          label="Birth Date"
          placeholder="Select birth date"
          required
          disablePastDates={false}
        />

        <DatePickerController
          name="satsang_day"
          control={control}
          label="Satsang Day"
          placeholder="Select satsang day"
          disablePastDates={false}
        />

        <InputController
          name="mulgam"
          control={control}
          label="Mulgam"
          placeholder="Enter mulgam"
          required
        />

        <TextAreaController
          name="address"
          control={control}
          label="Address"
          placeholder="Enter full address"
          rows={3}
          required
        />

        {/* poshak leader */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium">
            Select Poshak Group Leader{" "}
            <span className="text-red-500 ml-1"> *</span>
          </label>

          <Controller
            name="group_id"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <MultiSelect
                  options={groupSelect.map((group) => ({
                    value: String(group.id),
                    label: group.leader_name,
                  }))}
                  value={(field.value || []).map(String)}
                  onChange={(val) => field.onChange(val.map(Number))}
                  placeholder="Select group leaders"
                />
                {error && <ErrorMessage error={error.message as string} />}
              </>
            )}
          />
        </div>

        {/* Family Status Section */}

        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium">
            Married ? <span className="text-red-500 ml-1"> *</span>
          </label>
          <Controller
            name="is_married"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <RadioGroup
                  value={
                    field.value === true
                      ? "yes"
                      : field.value === false
                        ? "no"
                        : undefined
                  }
                  onValueChange={(val) => field.onChange(val === "yes")}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="yes" id="married-yes" />
                    <label htmlFor="married-yes">Yes</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="no" id="married-no" />
                    <label htmlFor="married-no">No</label>
                  </div>
                </RadioGroup>
                {error && <ErrorMessage error={error.message as string} />}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium">
            Family Leader ? <span className="text-red-500 ml-1"> *</span>
          </label>
          <Controller
            name="is_family_leader"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <RadioGroup
                  value={
                    field.value === true
                      ? "yes"
                      : field.value === false
                        ? "no"
                        : undefined
                  }
                  onValueChange={(val) => field.onChange(val === "yes")}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="yes" id="family-leader-yes" />
                    <label htmlFor="family-leader-yes">Yes</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="no" id="family-leader-no" />
                    <label htmlFor="family-leader-no">No</label>
                  </div>
                </RadioGroup>
                {error && <ErrorMessage error={error.message as string} />}
              </>
            )}
          />
        </div>

        {/* <InputController
          name="family_leader_id"
          control={control}
          label="Family Leader ID"
          type="number"
          placeholder="Enter family leader ID"
        /> */}

        {/* Occupation Section */}

        <ChipController
          name="occupation"
          control={control}
          label="Occupation Type"
          options={occupationOptions}
          multi={false}
          required
        />

        <InputController
          name="occupation_field"
          control={control}
          label="Occupation Field"
          placeholder="Enter occupation field"
        />

        {/* Seva Section */}

        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium">
            Seva ? <span className="text-red-500 ml-1"> *</span>
          </label>
          <Controller
            name="is_seva"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <RadioGroup
                  value={
                    field.value === true
                      ? "yes"
                      : field.value === false
                        ? "no"
                        : undefined
                  }
                  onValueChange={(val) => field.onChange(val === "yes")}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="yes" id="seva-yes" />
                    <label htmlFor="seva-yes">Yes</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="no" id="seva-no" />
                    <label htmlFor="seva-no">No</label>
                  </div>
                </RadioGroup>
                {error && <ErrorMessage error={error.message as string} />}
              </>
            )}
          />
        </div>

        <TextAreaController
          name="seva"
          control={control}
          label="Seva Details"
          placeholder="Enter seva details"
          rows={2}
        />

        <InputController
          name="parichit_bhakt_name"
          control={control}
          label="Parichit Bhakt Name"
          placeholder="Enter parichit bhakt name"
        />

        {/* Submit Button */}
        <div className="pt-4">
          {/* <SubmitButton

            buttonText={mode === "create" ? "Create Member" : "Update Member"}
            loadingButtonText={
              mode === "create" ? "Creating..." : "Updating..."
            }
            loading={isSubmitting}
          /> */}
          <button
            type="submit"
            className={cn(
              "w-full rounded-full bg-primaryColor text-white font-medium py-2 px-4 transition-colors duration-200"
            )}
          >
            {mode === "create" ? "Create Member" : "Update Member"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberForm;
