import { CirclePlus, EllipsisVertical, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link, type MetaArgs } from "react-router";
import { Virtuoso } from "react-virtuoso";
import { ClientOnly } from "~/components/shared-component/ClientOnly";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import MemberListCard from "~/components/shared-component/MemberListCard";
import MemberSkeleton from "~/components/skeleton/MemberSkeleton";
import { useMembers } from "~/hooks/useMembers";

export function meta({}: MetaArgs) {
  return [
    { title: "Members" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function EventAttendance() {
  const { members, loading, error } = useMembers();
  const [searchText, setSearchText] = useState("");

  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "Attendance",
        iconName: "ArrowLeft",
        children: (
          <div className="flex justify-end items-center gap-2">
            <RotateCcw />
            <Link to="/members/create-member">
              <EllipsisVertical />
            </Link>
          </div>
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
      <div className="flex justify-around items-center p-2 shadow-sm">
        <div className="flex flex-col justify-center items-center">
          <span className="text-3xl text-green-500 font-medium font-poppins">
            137
          </span>
          <span className="text-base text-textColor font-medium font-poppins">
            Pesent
          </span>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <span className="text-3xl text-red-500 font-medium font-poppins">
            10
          </span>
          <span className="text-base text-textColor font-medium font-poppins">
            Absent
          </span>
        </div>
      </div>
      <ClientOnly
        fallback={
          <div className="">
            {Array.from({ length: 10 }).map((_, index) => (
              <MemberSkeleton key={index} />
            ))}
          </div>
        }
      >
        <Virtuoso
          totalCount={members.length}
          itemContent={(index) => {
            const member = members[index];
            return (
              <MemberListCard
                key={member.smk_no}
                member={member}
                from={"attendance"}
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
    </LayoutWrapper>
  );
}
