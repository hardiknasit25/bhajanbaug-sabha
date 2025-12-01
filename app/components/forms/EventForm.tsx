import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputController from "../formController.tsx/InputController";
import SelectController from "../formController.tsx/SelectController";
import TextAreaController from "../formController.tsx/TextAreaController";
import SubmitButton from "../shared-component/SubmitButton";
import { useNavigate } from "react-router";

// Zod schema for form validation
const eventFormSchema = z.object({
  sabhaName: z.string().min(1, "Sabha name is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

// Date options for select dropdown
const dateOptions = [
  { value: "2024-01-01", label: "January 1, 2024" },
  { value: "2024-01-15", label: "January 15, 2024" },
  { value: "2024-02-01", label: "February 1, 2024" },
  { value: "2024-02-15", label: "February 15, 2024" },
  { value: "2024-03-01", label: "March 1, 2024" },
  { value: "2024-03-15", label: "March 15, 2024" },
];

function EventForm() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      sabhaName: "YUVA SABHA",
      date: "",
      description: "",
    },
  });

  const onSubmit = (data: EventFormData) => {
    console.log("Form Data:", data);
    navigate("/events");
  };

  const handleCancel = () => {
    reset();
    navigate("/events");
  };

  return (
    <div className="w-full p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4 flex flex-col justify-between"
      >
        <InputController
          name="sabhaName"
          control={control}
          label="Sabha Name"
          placeholder="Enter sabha name"
          className="w-full"
        />
        <SelectController
          name="date"
          control={control}
          label="Select Date"
          placeholder="Choose a date"
          options={dateOptions}
          className="w-full"
        />
        <TextAreaController
          name="description"
          control={control}
          label="Description"
          placeholder="Enter event description"
          rows={4}
          className="w-full"
        />
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
          >
            Cancel
          </button>

          <SubmitButton
            buttonText="Create"
            loadingButtonText="Creating..."
            loading={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

export default EventForm;
