import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import ErrorMessage from "../shared-component/ErrorMessage";

interface InputControllerProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

function InputController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  className,
  disabled = false,
  required = false,
}: InputControllerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-1">
          {label && (
            <label
              htmlFor={name}
              className="text-sm font-medium text-textColor leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
              {required && <span className="text-errorColor ml-1">*</span>}
            </label>
          )}
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`flex w-full rounded-md border bg-white p-2 text-sm text-textColor outline-none ${
              error ? "border-deleteBorderColor" : "border-borderColor"
            } ${className || ""}`}
          />
          {error && <ErrorMessage error={error.message as string} />}
        </div>
      )}
    />
  );
}

export default InputController;
