import { Controller, type Control } from "react-hook-form";
import { Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface DatePickerControllerProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

function DatePickerController({
  name,
  control,
  label,
  placeholder = "Pick a date",
  className,
  disabled = false,
  required = false,
}: DatePickerControllerProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className={`flex flex-col space-y-2 ${className || ""}`}>
          {label && (
            <label className="text-base font-medium text-textColor">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="default"
                disabled={disabled}
                className={cn(
                  "flex w-full justify-between items-center !rounded-md !p-2 text-sm text-textColor shadow-none font-normal !bg-white border border-borderColor",
                  !value && "text-textLightColor",
                  error && "border-red-500"
                )}
              >
                {value
                  ? new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })
                  : placeholder}
                <Calendar className="mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    onChange(`${year}-${month}-${day}`);
                  }
                }}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
          {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}

export default DatePickerController;
