import { useEffect } from "react";
import { useLoaderData, type LoaderFunction } from "react-router";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import MemberDetailInfo from "~/components/shared-component/MemberDetailInfo";
import { useMembers } from "~/hooks/useMembers";

export const loader: LoaderFunction = async ({ params }) => {
  const { memberId } = params;

  return {
    memberId: memberId,
  };
};
function MemberReport() {
  const { memberId } = useLoaderData();
  const { loading, selectedMember, fetchMemberById } = useMembers();

  useEffect(() => {
    fetchMemberById(memberId);
  }, [memberId]);

  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "people",
        iconName: "ArrowLeft",
      }}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <MemberDetailInfo />
          <div className="w-full flex flex-col"></div>
        </>
      )}
    </LayoutWrapper>
  );
}

export default MemberReport;
