import { useParams } from "react-router";
import { useState, useEffect } from "react";
import MemberForm from "~/components/forms/MemberForm";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import type { UserCreateFormData } from "~/schemas/memberSchema";

function MemberUpdateForm() {
  const { id } = useParams();
  const [memberData, setMemberData] =
    useState<Partial<UserCreateFormData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setIsLoading(true);
        // TODO: Implement API call to fetch member data
        // const response = await getMemberAPI(id);
        // setMemberData(response.data);

        // For now, just log the ID
        console.log("Fetching member data for ID:", id);
      } catch (err) {
        console.error("Failed to fetch member data:", err);
        setError("Failed to load member data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMemberData();
    }
  }, [id]);

  const handleUpdateMember = async (data: UserCreateFormData) => {
    try {
      console.log("Updating member with data:", data);
      // TODO: Implement API call to update member
      // const response = await updateMemberAPI(id, data);
      // Handle success - show toast, redirect, etc.
    } catch (err) {
      console.error("Failed to update member:", err);
      // TODO: Handle error - show error toast
    }
  };

  if (isLoading) {
    return (
      <LayoutWrapper
        showTab={false}
        headerConfigs={{
          title: "Update Member",
          iconName: "ArrowLeft",
        }}
        className="p-4"
      >
        <div className="flex items-center justify-center p-8">
          <p className="text-textLightColor">Loading member data...</p>
        </div>
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper
        showTab={false}
        headerConfigs={{
          title: "Update Member",
          iconName: "ArrowLeft",
          href: "/members",
        }}
        className="p-4"
      >
        <div className="flex items-center justify-center p-8">
          <p className="text-errorColor">{error}</p>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "Update Member",
        iconName: "ArrowLeft",
        href: "/members",
      }}
      className="p-4"
    >
      <MemberForm
        mode="update"
        initialData={memberData || undefined}
        onSubmit={handleUpdateMember}
      />
    </LayoutWrapper>
  );
}

export default MemberUpdateForm;
