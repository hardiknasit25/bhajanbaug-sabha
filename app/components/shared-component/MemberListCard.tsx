import { ChartColumn, Check, Percent, X } from "lucide-react";
import type { MemberData } from "~/types/members.interface";
import ImageComponent from "./ImageComponent";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import { Separator } from "../ui/separator";
import { useSabha } from "~/hooks/useSabha";
import type { SabhaData } from "~/types/sabha.interface";
import { localJsonStorageService } from "~/lib/localStorage";
import { ABSENT_MEMBER, PRESENT_MEMBER } from "~/constant/constant";

function MemberListCard({
  member,
  from,
  selectedSabha,
  totalSabha,
}: {
  member: MemberData;
  from: "attendance" | "members" | "report";
  selectedSabha?: SabhaData | null;
  totalSabha?: number;
}) {
  const { doMemberPresent, doMemberAbsenent } = useSabha();
  const navigate = useNavigate();

  const handlePresentClick = (id: number) => {
    // 1. Update Redux
    doMemberPresent(id);
  };

  const handleAbsentClick = (id: number) => {
    // 1. Update Redux
    doMemberAbsenent(id);
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
          <span className="text-gray-600 font-semibold">
            {member.smk_no !== null && member.smk_no !== "NA"
              ? member.smk_no
              : "No SMK"}
          </span>
        </p>

        {/* Status Icons Row */}
        {from === "attendance" && (
          <div className="w-full flex justify-start items-center gap-12 mt-0.5 pl-4">
            {/* 1. Present / Green Check */}
            <button
              onClick={() => handlePresentClick(member?.id)}
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
              onClick={() => handleAbsentClick(member?.id)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-transform",
                (member?.is_present === false ||
                  (selectedSabha?.status === "completed" &&
                    !member?.is_present)) &&
                  "bg-red-500"
              )}
              aria-label="Mark Absent"
            >
              <X
                size={24}
                className={cn(
                  "text-redTextColor",
                  (member?.is_present === false ||
                    (selectedSabha?.status === "completed" &&
                      !member?.is_present)) &&
                    "text-white"
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
              <span className="text-green-700">
                {member.total_present}/{totalSabha}
              </span>
            </div>
            <div className="flex justify-start items-center gap-2 border-r border-r-borderColor px-4">
              <p className="bg-red-200 size-5 flex justify-center items-center text-xs rounded-full text-redTextColor">
                A
              </p>
              <span className="text-red-700">
                {member.total_absent}/{totalSabha}
              </span>
            </div>
            <div className="flex justify-start items-center gap-2 px-4">
              <ChartColumn size={16} className="text-blueTextColor" />
              <span className="text-blue-700">
                {totalSabha
                  ? Math.round((member.total_present / totalSabha) * 100)
                  : 0}
                %
              </span>
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
