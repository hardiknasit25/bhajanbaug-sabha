import { EllipsisVertical, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  type LoaderFunction,
  type MetaArgs,
} from "react-router";
import { Virtuoso } from "react-virtuoso";
import { ClientOnly } from "~/components/shared-component/ClientOnly";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import MemberListCard from "~/components/shared-component/MemberListCard";
import MemberSkeleton from "~/components/skeleton/MemberSkeleton";
import { useMembers } from "~/hooks/useMembers";
import { useSabha } from "~/hooks/useSabha";
import { filterMembers } from "~/utils/filterMembers";

export function meta({}: MetaArgs) {
  return [
    { title: "Members" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader: LoaderFunction = async ({ params }) => {
  const { sabhaid } = params;

  return {
    sabhaId: sabhaid,
  };
};

export default function EventAttendance() {
  const { sabhaId } = useLoaderData();
  const {
    loading,
    selectedSabha,
    sabhaMembers,
    filteredSabhaMembers,
    searchText,
    totalPresentOnSelectedSabha,
    totalAbsentOnSelectedSabha,
    fetchSabhaById,
    setSabhaMemberSearchText,
  } = useSabha();

  useEffect(() => {
    fetchSabhaById(Number(sabhaId), {
      page: 1,
      limit: 2000,
    });
  }, [sabhaId]);

  const handleSearchChange = (value: string) => {
    setSabhaMemberSearchText(value); // Update Redux state for filtering
  };

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
        description: `Total ${filteredSabhaMembers.length} Members`,
        showSearch: true,
        searchPlaceholder: "Search Members...",
        searchValue: searchText,
        onSearchChange: handleSearchChange,
      }}
    >
      <div className="flex justify-around items-center p-2 shadow-sm">
        <div className="flex flex-col justify-center items-center">
          <span className="text-3xl text-green-500 font-medium font-poppins">
            {totalPresentOnSelectedSabha}
          </span>
          <span className="text-base text-textColor font-medium font-poppins">
            Pesent
          </span>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <span className="text-3xl text-red-500 font-medium font-poppins">
            {selectedSabha?.status !== "completed"
              ? totalAbsentOnSelectedSabha
              : sabhaMembers?.length - totalPresentOnSelectedSabha}
          </span>
          <span className="text-base text-textColor font-medium font-poppins">
            Absent
          </span>
        </div>
      </div>
      {loading && sabhaMembers.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <Virtuoso
          totalCount={filteredSabhaMembers.length}
          itemContent={(index) => {
            const member = filteredSabhaMembers[index];
            return (
              <MemberListCard
                key={member.smk_no}
                member={member}
                from={"attendance"}
                selectedSabha={selectedSabha}
              />
            );
          }}
          components={{
            Footer: () => (
              <>
                {sabhaMembers?.length === 0 && (
                  <div className="text-center text-textLightColor mt-2">
                    No members found
                  </div>
                )}
              </>
            ),
          }}
        />
      )}
    </LayoutWrapper>
  );
}
