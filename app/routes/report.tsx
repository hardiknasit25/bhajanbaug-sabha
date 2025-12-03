import { CirclePlus, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Link, type MetaArgs } from "react-router";
import { Virtuoso } from "react-virtuoso";
import { ClientOnly } from "~/components/shared-component/ClientOnly";
import EventCard from "~/components/shared-component/EventCard";
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

export default function Report() {
  const { members, loading, error } = useMembers();
  const [searchText, setSearchText] = useState("");

  return (
    <LayoutWrapper
      headerConfigs={{
        title: "Report",
        children: (
          <Link to="/members/create-member">
            <EllipsisVertical />
          </Link>
        ),
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
      <Tabs defaultValue="all-members" className="w-full h-full">
        <TabsList className="w-full bg-primaryColor rounded-none justify-evenly h-10 pb-2">
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
        <TabsContent value="by-group" className="h-full w-full">
          <ClientOnly>
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
          </ClientOnly>
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
