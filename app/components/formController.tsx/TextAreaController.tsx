import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import ErrorMessage from "../shared-component/ErrorMessage";

interface TextAreaControllerProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
}

function TextAreaController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  className,
  disabled = false,
  rows = 4,
}: TextAreaControllerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          {label && (
            <label
              htmlFor={name}
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label} :
            </label>
          )}
          <textarea
            {...field}
            id={name}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            className={`flex w-full rounded-md border bg-white p-2 text-sm text-textColor outline-none ${
              error ? "border-red-500" : "border-borderColor"
            } ${className || ""}`}
          />
          {error && <ErrorMessage error={error.message as string} />}
        </div>
      )}
    />
  );
}

export default TextAreaController;
