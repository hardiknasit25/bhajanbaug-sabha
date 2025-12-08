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

function GroupAccordionMember({ from }: { from: "report" | "members" }) {
  const { membersByPoshakGroups } = useMembers();
  return (
    <div className="h-full w-full overflow-auto">
      {membersByPoshakGroups.map((group, index) => {
        const poshakLeaderName = group?.leader_details
          ? `${group.leader_details.first_name} ${group.leader_details.middle_name} ${group.leader_details.last_name}`.trim()
          : "Others";
        return (
          <Accordion type="multiple" defaultValue={[`group-${index}`]}>
            <AccordionItem value={`group-${index}`} key={`group-${index}`}>
              <AccordionTrigger
                showArrow={false}
                className={cn(
                  "sticky top-0 z-10 w-full flex justify-center items-center py-2 rounded-none px-4 border-b border-t border-borderColor ring-0 bg-gray-100"
                )}
              >
                <div className="w-full flex justify-between items-center no-underline">
                  <div className="w-full flex flex-col justify-start items-start">
                    <span className="text-sm text-textColor no-underline">
                      {poshakLeaderName}
                    </span>
                    <span className="text-xs text-textLightColor font-normal">
                      Total {group?.users?.length} Members
                    </span>
                  </div>
                  {from === "report" && (
                    <div className="flex justify-center items-center gap-3">
                      <CircularProgress
                        size={45}
                        strokeWidth={2}
                        value={(index + 1) * 10}
                      />
                      <Download size={20} className="text-blueTextColor" />
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                {group?.users?.map((member) => (
                  <MemberListCard
                    key={member.smk_no}
                    member={member}
                    from={from}
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
