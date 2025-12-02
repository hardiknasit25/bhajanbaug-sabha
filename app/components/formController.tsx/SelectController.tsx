import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ErrorMessage from "../shared-component/ErrorMessage";
import { cn } from "~/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectControllerProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
}

function SelectController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  options,
  className,
  disabled = false,
}: SelectControllerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          {label && (
            <label
              htmlFor={name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              className={cn(
                error ? "border-red-500" : "",
                className || "",
                "outline-none ring-0",
                field.value ? "text-textColor" : "!text-textLightColor"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="pl-2"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <ErrorMessage error={error.message as string} />}
        </div>
      )}
    />
  );
}

export default SelectController;
