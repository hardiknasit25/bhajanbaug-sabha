import { useMembers } from "~/hooks/useMembers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import CircularProgress from "./CircularProgress";
import MemberListCard from "./MemberListCard";
import { Download } from "lucide-react";
import { cn } from "~/lib/utils";
import type { PoshakGroupData } from "~/types/members.interface";

function GroupAccordionMember({
  groupData,
  from,
  totalSabha,
  showDownload,
}: {
  groupData: PoshakGroupData[];
  from: "report" | "members";
  totalSabha?: number;
  showDownload?: boolean;
}) {
  return (
    <div className="h-full w-full overflow-auto">
      {groupData.map((group, index) => {
        const poshakLeaderName = group?.leader_details
          ? `${group.leader_details.first_name} ${group.leader_details.middle_name} ${group.leader_details.last_name}`?.trim()
          : "Others";
        const groupAllMembersPresentCount = group?.users?.reduce(
          (acc, member) => acc + (member.total_present || 0),
          0,
        );

        const groupTotalPercentage =
          groupAllMembersPresentCount && totalSabha
            ? Math.round(
                (groupAllMembersPresentCount /
                  (group.users.length * totalSabha)) *
                  100,
              )
            : 0;
        return (
          <Accordion type="multiple">
            <AccordionItem value={`group-${index}`} key={`group-${index}`}>
              <AccordionTrigger
                className={cn(
                  "sticky top-0 z-10 w-full flex justify-center items-center py-2 rounded-none px-4 border-b border-t border-borderColor bg-gray-200",
                )}
              >
                <div className="w-full flex justify-between items-center">
                  <div className="w-full flex flex-col justify-start items-start">
                    <span className="text-sm font-semibold text-textColor">
                      {poshakLeaderName}
                    </span>
                    <span className="text-xs text-textLightColor">
                      Total {group?.users?.length} Members
                    </span>
                  </div>

                  {from === "report" && (
                    <div className="flex justify-center items-center gap-3">
                      <CircularProgress
                        size={45}
                        strokeWidth={2}
                        value={groupTotalPercentage}
                      />
                      {showDownload && (
                        <Download size={20} className="text-blueTextColor" />
                      )}
                    </div>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-0 bg-white">
                {group?.users?.map((member) => (
                  <MemberListCard
                    key={member.smk_no}
                    member={member}
                    from={from}
                    totalSabha={totalSabha}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}

export default GroupAccordionMember;
