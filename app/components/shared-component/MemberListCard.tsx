import { Check, X } from "lucide-react";
import ImageComponent from "./ImageComponent";
import MemberStatusBadge from "./MemberStatusBadge";
import type { MemberStatus } from "~/types/members.interface";

function MemberListCard({
  name,
  smkId,
  imageApiUrl,
  status = "present",
  onStatusAction,
}: {
  name: string;
  smkId: string;
  imageApiUrl: string;
  status?: MemberStatus;
  onStatusAction?: (status: "present" | "late" | "absent" | "excused") => void;
}) {
  return (
    <div className="flex justify-center items-start gap-2 border border-borderColor/20 bg-white p-2 transition-all">
      {/* Avatar Section */}
      <div className="shrink-0">
        <ImageComponent src={imageApiUrl} alt={name} />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col">
        {/* Name */}
        <h3 className="text-sm font-bold text-textColor capitalize">{name}</h3>

        {/* ID Section */}
        <p className="text-xs font-medium text-gray-400">
          SMK ID: <span className="text-gray-600 font-semibold">{smkId}</span>
        </p>

        {/* Status Icons Row */}
        <div className="w-full flex justify-start items-center gap-8">
          {/* 1. Present / Green Check */}
          <button
            onClick={() => onStatusAction && onStatusAction("present")}
            className="flex items-center justify-center rounded-full transition-transform active:scale-95 p-2"
            aria-label="Mark Present"
          >
            <Check size={24} className="text-green-400" />
            <span className="sr-only">Present</span>
          </button>

          {/* 2. Late / Warning */}
          <button
            onClick={() => onStatusAction && onStatusAction("late")}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110"
            aria-label="Mark Late"
          >
            <span className="text-2xl font-bold text-amber-400">!</span>
          </button>

          {/* 3. Absent / Red Cross */}
          <button
            onClick={() => onStatusAction && onStatusAction("absent")}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110"
            aria-label="Mark Absent"
          >
            <X size={28} className="text-rose-500" />
          </button>

          {/* 4. Other / Grey Check */}
          <button
            onClick={() => onStatusAction && onStatusAction("excused")}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110"
            aria-label="Mark Excused"
          >
            <Check size={28} className="text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemberListCard;
