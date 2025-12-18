import { Download, EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, type MetaArgs } from "react-router";
import { Virtuoso } from "react-virtuoso";
import EventCard from "~/components/shared-component/EventCard";
import GroupAccordionMember from "~/components/shared-component/GroupAccordionMember";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import MemberListCard from "~/components/shared-component/MemberListCard";
import { Button } from "~/components/ui/button";
import { DialogClose } from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useMembers } from "~/hooks/useMembers";
import { useReport } from "~/hooks/useReport";
import { useSabha } from "~/hooks/useSabha";
import axiosInstance from "~/interceptor/interceptor";
import type { filterType } from "~/services/reportService";

export function meta({}: MetaArgs) {
  return [
    { title: "Members" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

type ReportTabs = "all-members" | "by-group" | "completed-sabha";

const filters: { label: string; value: filterType }[] = [
  { label: "Last Sabha", value: "lastSabha" },
  { label: "Last Four Sabha", value: "lastFourSabha" },
  { label: "Last Month All Sabha", value: "lastMonthAllSabha" },
  { label: "Last Three Months All Sabha", value: "lastThreeMonthsAllSabha" },
  { label: "Last Six Months All Sabha", value: "lastSixMonthsAllSabha" },
  { label: "Last Year All Sabha", value: "lastYearAllSabha" },
  { label: "All Sabha With Duration", value: "allSabhaWithDuration" },
];

export default function Report() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<ReportTabs>("all-members");
  const [selectedFilter, setSelectedFilter] = useState<filterType>("lastSabha");

  const {
    loading,
    searchText,
    filteredMembers,
    filteredMembersByPoshakGroups,
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

  // Helper to update searchParams
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    setSearchParams(params);
  };

  const handleDownLoadClick = async () => {
    const filterParam = selectedFilter || "lastMonthAllSabha";
    try {
      let url = "";
      let filename = "";
      if (activeTab === "all-members") {
        // Download all members report
        const response = await axiosInstance.get(
          `report/download/user?filter=${filterParam}`,
          { responseType: "blob" }
        );
        url = window.URL.createObjectURL(new Blob([response.data]));
        filename = "user_attendance_report.xlsx";
      } else if (activeTab === "by-group") {
        // Download group report
        const response = await axiosInstance.get(
          `report/download/group?filter=${filterParam}`,
          { responseType: "blob" }
        );
        url = window.URL.createObjectURL(new Blob([response.data]));
        filename = "group_attendance_report.xlsx";
      } else if (activeTab === "completed-sabha") {
        // Download completed sabha report
        // (Implement as needed)
      }
      if (url && filename) {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error) {
      // Optionally show error to user
      throw error;
    }
  };

  // Sync with URL and call API
  useEffect(() => {
    const urlTab = (searchParams.get("tab") as ReportTabs) || "all-members";
    const urlFilter = (searchParams.get("filter") as filterType) || "lastSabha";

    setActiveTab(urlTab);
    setSelectedFilter(urlFilter);
    setSearchText("");

    if (urlTab === "all-members") {
      fetchMembersReport(urlFilter);
    } else if (urlTab === "by-group") {
      fetchGroupReport(urlFilter);
    } else if (urlTab === "completed-sabha") {
      fetchSabhaList("completed");
    }
  }, [searchParams]);

  return (
    <LayoutWrapper
      headerConfigs={{
        title: "Report",
        children: (
          <div className="flex justify-center items-center gap-4 pr-3">
            <Download
              size={22}
              className="text-white"
              onClick={handleDownLoadClick}
            />

            {/* Drawer For Filters */}
            <Drawer>
              <DrawerTrigger>
                <EllipsisVertical size={22} className="text-white" />
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader className="text-start">
                  <DrawerTitle>Select A Duration</DrawerTitle>
                  <DrawerDescription>
                    Select the duration for which you want to generate the
                    report.
                  </DrawerDescription>
                </DrawerHeader>

                {/* FILTER OPTIONS */}
                <div className="px-4 py-2 flex flex-col gap-2">
                  {filters.map((filter) => {
                    const isActive = selectedFilter === filter.value;
                    return (
                      <DialogClose
                        key={filter.value}
                        onClick={() => {
                          setSelectedFilter(filter.value);
                          updateParam("filter", filter.value);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                          isActive
                            ? "bg-primaryColor text-white border-primaryColor"
                            : "bg-white text-textColor border-borderColor"
                        }`}
                      >
                        {filter.label}
                      </DialogClose>
                    );
                  })}
                </div>

                {/* <DrawerFooter className="flex-row justify-between items-center px-4 pb-4">
                  <DrawerClose className="w-1/2 pr-2">
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </DrawerClose>

                  <DrawerClose className="w-1/2 pl-2">
                    <Button className="w-full">Submit</Button>
                  </DrawerClose>
                </DrawerFooter> */}
              </DrawerContent>
            </Drawer>
          </div>
        ),
        className: "flex-col gap-2",
        description: `Total ${sabhaCount} Sabha`,
        showSearch: true,
        searchPlaceholder: "Search Members...",
        searchValue: searchText,
        onSearchChange: (value: string) => {
          setSearchText(value);
        },
      }}
    >
      {/* TABS */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val as ReportTabs);
          updateParam("tab", val);
        }}
        className="w-full h-full flex flex-col justify-start"
      >
        <TabsList className="w-full flex justify-between items-center bg-primaryColor rounded-none h-10 pb-2">
          <TabsTrigger value="all-members">All Members</TabsTrigger>
          <TabsTrigger value="by-group">Poshak Groups</TabsTrigger>
          <TabsTrigger value="completed-sabha">Completed Sabha</TabsTrigger>
        </TabsList>

        {/* ALL MEMBERS */}
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
                Footer: () =>
                  filteredMembers.length === 0 && (
                    <div className="text-center mt-2 text-textLightColor">
                      No members found
                    </div>
                  ),
              }}
            />
          )}
        </TabsContent>

        {/* GROUP TAB */}
        <TabsContent value="by-group" className="h-full w-full overflow-y-auto">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <GroupAccordionMember
              groupData={filteredMembersByPoshakGroups}
              from="report"
              totalSabha={sabhaCount}
            />
          )}
        </TabsContent>

        {/* COMPLETED SABHA */}
        <TabsContent value="completed-sabha" className="p-4 w-full h-full">
          {sabhaLoading ? (
            <LoadingSpinner />
          ) : (
            <Virtuoso
              totalCount={totalSabha}
              data={sabhaList}
              itemContent={(index, sabha) => (
                <div key={sabha?.id} className="w-full mb-4">
                  <EventCard sabha={sabha} />
                </div>
              )}
              components={{
                Footer: () =>
                  sabhaList.length === 0 && <div>No sabha found</div>,
              }}
              className="scrollbar-none"
            />
          )}
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  );
}
