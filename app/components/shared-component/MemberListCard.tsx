import { ChartColumn, Check, Percent, X } from "lucide-react";
import type { MemberData } from "~/types/members.interface";
import ImageComponent from "./ImageComponent";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import { Separator } from "../ui/separator";
import { useSabha } from "~/hooks/useSabha";
import type { SabhaData } from "~/types/sabha.interface";

function MemberListCard({
  member,
  from,
  selectedSabha,
}: {
  member: MemberData;
  from: "attendance" | "members" | "report";
  selectedSabha?: SabhaData | null;
}) {
  const { presetAttendance, absentAttendance } = useSabha();
  const navigate = useNavigate();

  const handleStatusAction = (status: string) => {
    if (status === "present") {
      // already present → no need to call API again
      if (member.is_present) return;

      // mark present
      presetAttendance(Number(selectedSabha?.id), member.id);
      return;
    }

    if (status === "absent") {
      // already absent → no need to call API again
      if (!member.is_present) return;

      // mark absent
      absentAttendance(Number(selectedSabha?.id), member.id);
    }
  };

  return (
    <div
      className={cn(
        "relative flex justify-center gap-2 p-2 pl-4 transition-all",
        from === "members" ? "items-center" : "items-start"
      )}
      onClick={() => {
        if (from === "attendance") return;
        else if (from === "report") navigate(`/members/report/${member.id}`);
        else navigate(`/members/details/${member.id}`);
      }}
    >
      {/* Avatar Section */}
      <div className="shrink-0 flex justify-center items-center">
        <ImageComponent src={member.img} alt={member.first_name} />
      </div>

      {/* Content Section */}
      <div
        className={cn("flex flex-1 flex-col justify-between items-start gap-1")}
      >
        {/* Name */}
        <h3 className="text-sm font-semibold text-textColor capitalize">{`${member.first_name} ${member.middle_name} ${member.last_name}`}</h3>

        {/* ID Section */}
        <p className="text-xs font-medium text-gray-400">
          SMK ID:{" "}
          <span className="text-gray-600 font-semibold">{member.smk_no}</span>
        </p>

        {/* Status Icons Row */}
        {from === "attendance" && (
          <div className="w-full flex justify-start items-center gap-12 mt-0.5 pl-4">
            {/* 1. Present / Green Check */}
            <button
              onClick={() => handleStatusAction("present")}
              className={cn(
                "flex items-center justify-center rounded-full transition-transform p-1",
                member.is_present && "bg-greenTextColor"
              )}
              aria-label="Mark Present"
            >
              <Check
                size={24}
                className={cn(
                  "text-greenTextColor",
                  member?.is_present && "text-white"
                )}
              />
              <span className="sr-only">Present</span>
            </button>

            {/* 2. Absent / Red Cross */}
            <button
              onClick={() => handleStatusAction("absent")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-transform",
                member?.is_present === false && "bg-red-500"
              )}
              aria-label="Mark Absent"
            >
              <X
                size={24}
                className={cn(
                  "text-redTextColor",
                  member?.is_present === false && "text-white"
                )}
              />
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
      <Separator
        orientation="vertical"
        className="absolute bg-borderColor/30 w-[95%] h-[1px] bottom-0 left-1/2 right-1/2 translate-x-[-50%]"
      />
    </div>
  );
}

export default MemberListCard;
