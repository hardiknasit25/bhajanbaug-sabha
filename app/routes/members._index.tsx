import { CirclePlus } from "lucide-react";
import { useEffect } from "react";
import {
  Link,
  type LoaderFunctionArgs,
  type MetaArgs,
  redirect,
  useSearchParams,
} from "react-router";
import { Virtuoso } from "react-virtuoso";
import GroupAccordionMember from "~/components/shared-component/GroupAccordionMember";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import MemberListCard from "~/components/shared-component/MemberListCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useMembers } from "~/hooks/useMembers";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export function meta({}: MetaArgs) {
  return [
    { title: "Members" },
    { name: "description", content: "Members page" },
  ];
}

type MemberTabs = "all-members" | "by-group";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = getTokenFromRequest(request);

  if (!token) {
    return redirect("/login");
  }

  return null;
};

export default function Members() {
  const {
    filteredMembers,
    filteredMembersByPoshakGroups,
    loading,
    searchText,
    fetchMembers,
    setSearchText,
    fetchMembersByPoshakGroups,
  } = useMembers();

  // --------------------------
  // SEARCH PARAMS
  // --------------------------
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as MemberTabs) || "all-members";

  // --------------------------
  // FETCH MEMBERS BASED ON TAB
  // --------------------------
  useEffect(() => {
    setSearchText("");
    if (activeTab === "all-members") {
      fetchMembers().unwrap();
    } else {
      fetchMembersByPoshakGroups();
    }
  }, [activeTab]);

  // --------------------------
  // HANDLE SEARCH CHANGE
  // --------------------------
  const handleSearchChange = (value: string) => {
    setSearchText(value);
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
        onValueChange={(val) => setSearchParams({ tab: val })}
        className="w-full h-full flex flex-col justify-start"
      >
        <TabsList className="w-full bg-primaryColor rounded-none justify-evenly h-10 pb-2">
          <TabsTrigger value="all-members">All Members</TabsTrigger>
          <TabsTrigger value="by-group">Poshak Groups</TabsTrigger>
        </TabsList>

        {/* All Members */}
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
                    from="members"
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

        {/* Poshak Group */}
        <TabsContent value="by-group" className="h-full w-full overflow-hidden">
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
