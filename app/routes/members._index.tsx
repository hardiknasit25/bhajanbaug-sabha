import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, type MetaArgs } from "react-router";
import { Virtuoso } from "react-virtuoso";
import { ClientOnly } from "~/components/shared-component/ClientOnly";
import GroupAccordionMember from "~/components/shared-component/GroupAccordionMember";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
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

type MemberTabs = "all-members" | "by-group";

export default function Members() {
  const [activeTab, setActiveTab] = useState<MemberTabs>("all-members");
  const {
    filteredMembers,
    totalMembers,
    loading: memberLoading,
    searchText,
    fetchMembers,
    setSearchText,
  } = useMembers();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  //#region fetch member data
  const fetchMembersListData = async (pageNum: number = page) => {
    const data = await fetchMembers({
      page: pageNum,
      limit: 1000,
    }).unwrap();
    return data.rows;
  };

  const handleEndReached = async () => {
    if (loading || !hasMore || filteredMembers.length >= totalMembers) return;
    setLoading(true);

    const nextPage = page + 1;
    try {
      const data = await fetchMembersListData(nextPage);
      if (data && data.length > 0) {
        setPage(nextPage);
        if (filteredMembers.length + data.length >= totalMembers) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more sabha:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchMembersListData();
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
          {memberLoading ? (
            <LoadingSpinner />
          ) : (
            <Virtuoso
              totalCount={filteredMembers.length}
              endReached={handleEndReached}
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
          <GroupAccordionMember />
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  );
}
