import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, type MetaArgs } from "react-router";
import { Virtuoso } from "react-virtuoso";
import GroupAccordionMember from "~/components/shared-component/GroupAccordionMember";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import MemberListCard from "~/components/shared-component/MemberListCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useMembers } from "~/hooks/useMembers";

export function meta({}: MetaArgs) {
  return [
    { title: "Members" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

type MemberTabs = "all-members" | "by-group";

export default function Members() {
  const [activeTab, setActiveTab] = useState<MemberTabs>("all-members");
  const {
    filteredMembers,
    filteredMembersByPoshakGroups,
    loading,
    searchText,
    fetchMembers,
    setSearchText,
    fetchMembersByPoshakGroups,
  } = useMembers();

  //#region fetch member data
  const fetchMembersListData = async () => {
    const data = await fetchMembers().unwrap();
    return data.rows;
  };

  useEffect(() => {
    if (activeTab === "all-members") {
      fetchMembersListData();
    } else {
      fetchMembersByPoshakGroups();
    }
  }, [activeTab]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchText(value); // Update Redux state for filtering
  };

  return (
    <LayoutWrapper
      headerConfigs={{
        title: "Members",
        children: (
          <Link to="/members/create-member">
            <CirclePlus size={25} />
          </Link>
        ),
        className: "flex-col gap-2",
        description: `Total ${filteredMembers.length} Members`,
        showSearch: true,
        searchPlaceholder: "Search Members...",
        searchValue: searchText,
        onSearchChange: handleSearchChange,
        showSorting: activeTab === "all-members",
      }}
    >
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as MemberTabs)}
        className="w-full h-full flex flex-col justify-start"
      >
        <TabsList className="w-full bg-primaryColor rounded-none justify-evenly h-10 pb-2">
          <TabsTrigger value="all-members">All Members</TabsTrigger>
          <TabsTrigger value="by-group">Poshak Groups</TabsTrigger>
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
                    from={"members"}
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
        <TabsContent value="by-group" className="h-full w-full">
          {loading ? (
            <LoadingSpinner />
          ) : filteredMembersByPoshakGroups.length === 0 ? (
            <div className="text-center mt-2 text-textLightColor">
              No members found
            </div>
          ) : (
            <GroupAccordionMember
              groupData={filteredMembersByPoshakGroups}
              from="members"
            />
          )}
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  );
}
