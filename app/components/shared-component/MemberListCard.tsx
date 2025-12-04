import { ChartColumn, Check, Percent, X } from "lucide-react";
import type { MemberData } from "~/types/members.interface";
import ImageComponent from "./ImageComponent";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";

function MemberListCard({
  member,
  from,
}: {
  member: MemberData;
  from: "attendance" | "members" | "report";
}) {
  const navigate = useNavigate();
  const handleStatusAction = (status: string) => {
    console.log(`Member ${member.first_name} marked as ${status}`);
  };

  return (
    <div
      className={cn(
        "flex justify-center gap-2 border border-borderColor/20 p-2 transition-all",
        from === "members" ? "items-center" : "items-start"
      )}
      onClick={() => {
        if (from === "attendance") return;
        else if (from === "report") navigate(`/members/report/${member.id}`);
        else navigate(`/members/details/${member.id}`);
      }}
    >
      {/* Avatar Section */}
      <div className="shrink-0">
        <ImageComponent src={member.img} alt={member.first_name} />
      </div>

      {/* Content Section */}
      <div className={cn("flex flex-1 flex-col justify-between items-start")}>
        {/* Name */}
        <h3 className="text-sm font-semibold text-textColor capitalize">{`${member.first_name} ${member.middle_name} ${member.last_name}`}</h3>

        {/* ID Section */}
        <p className="text-xs font-medium text-gray-400">
          SMK ID:{" "}
          <span className="text-gray-600 font-semibold">{member.smk_no}</span>
        </p>

        {/* Status Icons Row */}
        {from === "attendance" && (
          <div className="w-full flex justify-start items-center gap-8">
            {/* 1. Present / Green Check */}
            <button
              onClick={() => handleStatusAction("present")}
              className="flex items-center justify-center rounded-full transition-transform active:scale-95 p-2"
              aria-label="Mark Present"
            >
              <Check size={24} className="text-green-400" />
              <span className="sr-only">Present</span>
            </button>

            {/* 2. Late / Warning */}
            <button
              onClick={() => handleStatusAction("late")}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110"
              aria-label="Mark Late"
            >
              <span className="text-2xl font-bold text-amber-400">!</span>
            </button>

            {/* 3. Absent / Red Cross */}
            <button
              onClick={() => handleStatusAction("absent")}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110"
              aria-label="Mark Absent"
            >
              <X size={28} className="text-rose-500" />
            </button>

            {/* 4. Other / Grey Check */}
            <button
              onClick={() => handleStatusAction("excused")}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110"
              aria-label="Mark Excused"
            >
              <Check size={28} className="text-gray-300" />
            </button>
          </div>
        )}

        {from === "report" && (
          <div className="w-full flex justify-start items-center mt-1">
            <div className="flex justify-start items-center gap-2 border-r border-r-borderColor pr-4">
              <p className="bg-green-200 size-5 flex justify-center items-center text-xs rounded-full text-greenTextColor">
                P
              </p>
              <span className="text-green-700">4/5</span>
            </div>
            <div className="flex justify-start items-center gap-2 border-r border-r-borderColor px-4">
              <p className="bg-red-200 size-5 flex justify-center items-center text-xs rounded-full text-redTextColor">
                A
              </p>
              <span className="text-red-700">1/5</span>
            </div>
            <div className="flex justify-start items-center gap-2 px-4">
              <ChartColumn size={16} className="text-blueTextColor" />
              <span className="text-blue-700">90%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberListCard;
