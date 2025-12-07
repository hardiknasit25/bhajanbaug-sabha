import { CirclePlus, Download, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Link, type MetaArgs } from "react-router";
import { Virtuoso } from "react-virtuoso";
import { ClientOnly } from "~/components/shared-component/ClientOnly";
import EventCard from "~/components/shared-component/EventCard";
import GroupAccordionMember from "~/components/shared-component/GroupAccordionMember";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import MemberListCard from "~/components/shared-component/MemberListCard";
import MemberSkeleton from "~/components/skeleton/MemberSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useMembers } from "~/hooks/useMembers";

export function meta({}: MetaArgs) {
  return [
    { title: "Members" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

type ReportTabs = "all-members" | "by-group" | "completed-sabha";

export default function Report() {
  const [activeTab, setActiveTab] = useState<ReportTabs>("all-members");
  const { members, loading, error } = useMembers();
  const [searchText, setSearchText] = useState("");

  return (
    <LayoutWrapper
      headerConfigs={{
        title: "Report",
        children: <Download size={20} className="text-white" />,
        className: "flex-col gap-2",
        description: `Total ${members.length} Members`,
        showSearch: true,
        searchPlaceholder: "Search Members...",
        searchValue: searchText,
        onSearchChange: (value: string) => {
          setSearchText(value);
          console.log("Search value changed:", value);
        },
      }}
    >
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as ReportTabs)}
        className="w-full h-full flex flex-col justify-start"
      >
        <TabsList className="w-full flex justify-between items-center bg-primaryColor rounded-none h-10 pb-2">
          <TabsTrigger value="all-members">All Members</TabsTrigger>
          <TabsTrigger value="by-group">Poshak Groups</TabsTrigger>
          <TabsTrigger value="completed-sabha">Completed Sabha</TabsTrigger>
        </TabsList>
        <TabsContent value="all-members" className="h-full w-full">
          <Virtuoso
            totalCount={members.length}
            itemContent={(index) => {
              const member = members[index];
              return (
                <MemberListCard
                  key={member.smk_no}
                  member={member}
                  from={"report"}
                />
              );
            }}
            components={{
              Footer: () => (
                <div className="">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <MemberSkeleton key={index} />
                  ))}
                </div>
              ),
            }}
          />
        </TabsContent>
        <TabsContent value="by-group" className="h-full w-full overflow-y-auto">
          <GroupAccordionMember />
        </TabsContent>
        <TabsContent value="completed-sabha" className="p-4">
          <div className="w-full grid grid-cols-1 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <EventCard key={index} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  );
}
