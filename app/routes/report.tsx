import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { type MetaArgs } from "react-router";
import { Virtuoso } from "react-virtuoso";
import EventCard from "~/components/shared-component/EventCard";
import GroupAccordionMember from "~/components/shared-component/GroupAccordionMember";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import MemberListCard from "~/components/shared-component/MemberListCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useReport } from "~/hooks/useReport";
import { useSabha } from "~/hooks/useSabha";

export function meta({}: MetaArgs) {
  return [
    { title: "Members" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

type ReportTabs = "all-members" | "by-group" | "completed-sabha";

export default function Report() {
  const [activeTab, setActiveTab] = useState<ReportTabs>("all-members");
  const {
    loading,
    searchText,
    memberReport,
    filteredMembers,
    groupReport,
    sabhaCount,
    fetchMembersReport,
    fetchGroupReport,
    setSearchText,
  } = useReport();
  const {
    sabhaList,
    totalSabha,
    loading: sabhaLoading,
    fetchSabhaList,
  } = useSabha();

  useEffect(() => {
    if (activeTab === "all-members") {
      fetchMembersReport();
    } else if (activeTab === "by-group") {
      fetchGroupReport();
    } else if (activeTab === "completed-sabha") {
      fetchSabhaList("completed");
    }
  }, [activeTab]);

  return (
    <LayoutWrapper
      headerConfigs={{
        title: "Report",
        children: <Download size={20} className="text-white" />,
        className: "flex-col gap-2",
        description: `Total ${sabhaCount} Sabha`,
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
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Virtuoso
              totalCount={filteredMembers.length}
              itemContent={(index) => {
                const member = filteredMembers[index];
                return (
                  <MemberListCard
                    key={member.smk_no}
                    member={member}
                    totalSabha={sabhaCount}
                    from={"report"}
                  />
                );
              }}
              components={{
                Footer: () => {
                  return (
                    filteredMembers.length === 0 && (
                      <div className="text-center mt-2 text-textLightColor">
                        No members found
                      </div>
                    )
                  );
                },
              }}
            />
          )}
        </TabsContent>
        <TabsContent value="by-group" className="h-full w-full overflow-y-auto">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <GroupAccordionMember
              groupData={groupReport}
              from="report"
              totalSabha={sabhaCount}
            />
          )}
        </TabsContent>
        <TabsContent value="completed-sabha" className="p-4 w-full h-full">
          {sabhaLoading ? (
            <LoadingSpinner />
          ) : (
            <Virtuoso
              totalCount={totalSabha}
              data={sabhaList}
              itemContent={(index, sabha) => {
                return (
                  <div key={sabha?.id} className="w-full mb-4">
                    <EventCard sabha={sabha} />
                  </div>
                );
              }}
              components={{
                Footer: () => {
                  return sabhaList.length === 0 && <div>No sabha found</div>;
                },
              }}
              className="scrollbar-none"
            />
          )}
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  );
}
