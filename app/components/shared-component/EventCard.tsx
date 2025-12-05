import { Link, useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import type { SabhaData } from "~/types/sabha.interface";
import CircularProgress from "./CircularProgress";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useSabha } from "~/hooks/useSabha";

function EventCard({ sabha }: { sabha: SabhaData }) {
  const navigate = useNavigate();
  const status = sabha?.status;
  const totalPresents = sabha?.total_present ?? 0;
  const totalUsers = sabha?.total_users ?? 0;
  const totalAbsents = totalUsers - totalPresents;
  const attendancePercentage =
    totalUsers > 0 ? Math.round((totalPresents / totalUsers) * 100) : 0;
  const { startSabha } = useSabha();

  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between bg-eventCardColor rounded-xl shadow-sm overflow-hidden border-l-8 px-4",
        status === "upcoming" && "bg-blue-400/10 border-l-blue-500",
        status === "completed" && "bg-green-400/10 border-l-green-500",
        status === "running" && "bg-orange-400/10 border-l-orange-500"
      )}
    >
      <div className="w-full flex items-center justify-between">
        {/* Content */}
        <div className="flex flex-col flex-1 py-3">
          <h2 className="font-semibold text-lg text-textColor font-poppins capitalize">
            {sabha?.title}
          </h2>
          <p className="text-sm text-textLightColor">{sabha?.sabha_date}</p>
        </div>

        {/* Start Button */}
        <button
          onClick={() => {
            if (status === "completed" || status === "running") {
              return navigate(`/sabha/attendance/${sabha.id}`);
            }
            setOpen(true);
          }}
          className={cn(
            "block px-5 py-2 text-sm text-white font-medium rounded-full",
            status === "upcoming" && "bg-blue-500",
            status === "completed" && "bg-green-500 cursor-not-allowed",
            status === "running" && "bg-orange-500"
          )}
        >
          {status === "upcoming"
            ? "Start"
            : status === "running"
              ? "Join"
              : "Completed"}
        </button>
      </div>

      {status === "completed" && (
        <div className="w-full flex justify-around items-center py-2">
          <div className="flex flex-col justify-center items-center">
            <span className="text-greenTextColor text-2xl">
              {totalPresents}
            </span>
            <span className="text-greenTextColor text-sm">Presents</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <span className="text-redTextColor text-2xl">{totalAbsents}</span>
            <span className="text-redTextColor text-sm">Absents</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <CircularProgress
              size={50}
              strokeWidth={4}
              value={attendancePercentage}
            />
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {status === "upcoming" ? "Start Sabha?" : "Join Sabha?"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {status === "upcoming" ? "start" : "join"} this sabha?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row justify-center items-center gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                startSabha(sabha.id); // ⬅ wait for API
                setOpen(false);
                navigate(`/sabha/attendance/${sabha.id}`);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventCard;
