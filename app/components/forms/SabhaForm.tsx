import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import InputController from "../formController.tsx/InputController";
import SubmitButton from "../shared-component/SubmitButton";

import { useSabha } from "~/hooks/useSabha";
import { useEffect } from "react";

// Zod Schema
const sabhaFormSchema = z.object({
  sabhaName: z.string().min(1, "Sabha name is required"),
});

type SabhaFormData = z.infer<typeof sabhaFormSchema>;

export default function SabhaFormDialog() {
  const { selectedSabha, sabhaFormDialog, closeSabhaFormDailog, createSabha } =
    useSabha();
  console.log("selectedSabha: ", selectedSabha);

  const DEFAULT_NAME = "Yuva Sabha";

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<SabhaFormData>({
    resolver: zodResolver(sabhaFormSchema),
    defaultValues: {
      sabhaName: selectedSabha ? selectedSabha?.title : DEFAULT_NAME,
    },
  });

  const onSubmit = (data: SabhaFormData) => {
    console.log("Form Data:", data);
    const title = data.sabhaName;
    if (!selectedSabha) {
      createSabha(title);
    }
    reset({
      sabhaName: DEFAULT_NAME,
    });
  };

  const handleCancel = () => {
    reset({
      sabhaName: DEFAULT_NAME,
    });
    closeSabhaFormDailog();
  };

  useEffect(() => {
    if (selectedSabha) {
      setValue("sabhaName", selectedSabha?.title);
    }
  }, [selectedSabha]);

  return (
    <Dialog open={sabhaFormDialog} onOpenChange={handleCancel}>
      <DialogContent className="rounded-none">
        <DialogHeader>
          <DialogTitle className="text-textColor font-semibold">
            {selectedSabha ? "Update" : "Create New"} Sabha
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <InputController
            name="sabhaName"
            control={control}
            label="Sabha Name"
            placeholder="Enter sabha name"
            required
          />

          <DialogFooter className="flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <SubmitButton
              buttonText={selectedSabha ? "Update" : "Create"}
              loadingButtonText="Creating..."
              loading={isSubmitting}
              className="flex-1"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
