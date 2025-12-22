import { Edit, SaveIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { redirect, useLoaderData, type LoaderFunction } from "react-router";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import MemberDetailInfo from "~/components/shared-component/MemberDetailInfo";
import { useMembers } from "~/hooks/useMembers";
import { cn } from "~/lib/utils";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { memberId } = params;

  const token = getTokenFromRequest(request);

  if (!token) {
    return redirect("/login");
  }

  return {
    memberId: memberId,
  };
};
function MemberReport() {
  const { memberId } = useLoaderData();
  const { loading, selectedMember, fetchMemberById, enterSabhaReason } =
    useMembers();
  const [enableReasonSabhaId, setEnableReasonSabhaId] = useState<number | null>(
    null
  );
  const [editedReasons, setEditedReasons] = useState<Record<number, string>>(
    {}
  );

  const handleReasonChange = (sabhaId: number, value: string) => {
    setEditedReasons((prev) => ({
      ...prev,
      [sabhaId]: value,
    }));
  };

  const handleSaveReason = async (sabhaId: number) => {
    const reason = editedReasons[sabhaId];
    console.log("Saving reason:", {
      memberId,
      sabhaId,
      reason,
    });
    const response = await enterSabhaReason(sabhaId, memberId, reason).unwrap();

    if (response.sabha_id) {
      // TODO: Call API to save reason
      setEnableReasonSabhaId(null);
    }
  };

  const handleCancelEdit = (sabhaId: number, originalReason: string | null) => {
    setEditedReasons((prev) => ({
      ...prev,
      [sabhaId]: originalReason || "",
    }));
    setEnableReasonSabhaId(null);
  };

  const handleStartEdit = (sabhaId: number, currentReason: string | null) => {
    setEditedReasons((prev) => ({
      ...prev,
      [sabhaId]: currentReason || "",
    }));
    setEnableReasonSabhaId(sabhaId);
  };

  useEffect(() => {
    fetchMemberById(memberId);
  }, [memberId]);

  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "people",
        description: `Total ${selectedMember?.total_sabha} Sabha`,
        iconName: "ArrowLeft",
      }}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <MemberDetailInfo />
          <div className="w-full flex flex-col p-4">
            {selectedMember?.attendance_by_sabha?.map((sabha) => (
              <div
                className={cn(
                  "flex flex-col justify-start rounded-lg",
                  sabha?.present
                    ? "bg-green-100  border-green-500"
                    : "bg-red-100 border-red-500",
                  "p-3 mb-2 rounded-md border-l-4"
                )}
                key={sabha.sabha_id}
              >
                <div className="flex flex-col justify-start items-start">
                  <span className="font-medium text-base text-textColor capitalize">
                    {sabha?.title}
                  </span>
                  <span className="text-sm text-textLightColor">
                    {sabha?.sabha_date}
                  </span>
                </div>
                {!sabha?.present && (
                  <div className="w-full flex flex-col gap-1 justify-start items-start text-sm mt-2">
                    <span className="text-redTextColor">Reason:</span>
                    <div
                      aria-disabled={enableReasonSabhaId !== sabha?.sabha_id}
                      className="w-full bg-white p-2 rounded-md flex justify-between items-center disabled:opacity-50"
                    >
                      <input
                        type="text"
                        disabled={enableReasonSabhaId !== sabha?.sabha_id}
                        value={
                          enableReasonSabhaId === sabha?.sabha_id
                            ? (editedReasons[sabha?.sabha_id] ?? "")
                            : sabha?.reason || ""
                        }
                        onChange={(e) =>
                          handleReasonChange(sabha?.sabha_id, e.target.value)
                        }
                        className="w-full bg-white outline-none placeholder:text-textLightColor"
                        placeholder="Enter reason..."
                      />
                      {enableReasonSabhaId === sabha?.sabha_id ? (
                        <>
                          <X
                            size={16}
                            className="ml-2 cursor-pointer text-red-500"
                            onClick={() =>
                              handleCancelEdit(sabha?.sabha_id, sabha?.reason)
                            }
                          />
                          <SaveIcon
                            size={16}
                            className="ml-2 cursor-pointer text-green-500"
                            onClick={() => handleSaveReason(sabha?.sabha_id)}
                          />
                        </>
                      ) : (
                        <Edit
                          size={16}
                          className="ml-2 cursor-pointer text-themeBlueColor"
                          onClick={() =>
                            handleStartEdit(sabha?.sabha_id, sabha?.reason)
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </LayoutWrapper>
  );
}

export default MemberReport;
