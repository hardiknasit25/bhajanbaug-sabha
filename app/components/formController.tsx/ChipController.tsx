import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { X } from "lucide-react";
import ErrorMessage from "../shared-component/ErrorMessage";
import { cn } from "~/lib/utils";

interface ChipOption {
  value: string;
  label: string;
}

interface ChipControllerProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  options: ChipOption[];
  className?: string;
  disabled?: boolean;
  multi?: boolean;
  required?: boolean;
}

function ChipController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  options,
  className,
  disabled = false,
  multi = false,
  required = false,
}: ChipControllerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValues: string[] = multi
          ? Array.isArray(field.value)
            ? field.value
            : []
          : field.value
            ? [field.value]
            : [];

        const handleChipClick = (value: string) => {
          if (multi) {
            const newValues = selectedValues.includes(value)
              ? selectedValues.filter((v) => v !== value)
              : [...selectedValues, value];
            field.onChange(newValues);
          } else {
            field.onChange(selectedValues.includes(value) ? null : value);
          }
        };

        return (
          <div className="space-y-2">
            {label && (
              <label
                htmlFor={name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
                {required && <span className="text-errorColor ml-1">*</span>}
              </label>
            )}

            {/* Options Grid */}
            <div
              className={cn(
                "flex gap-2 border rounded-md border-none",
                error ? "border-red-500" : "border-borderColor",
                className || ""
              )}
            >
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChipClick(option.value)}
                    disabled={disabled}
                    className={cn(
                      "px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                      isSelected
                        ? "bg-primaryColor text-white border-primaryColor"
                        : "bg-white text-textColor border-borderColor hover:border-primaryColor"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {error && <ErrorMessage error={error.message as string} />}
          </div>
        );
      }}
    />
  );
}

export default ChipController;
