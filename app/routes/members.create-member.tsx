import MemberForm from "~/components/forms/MemberForm";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import type { UserCreateFormData } from "~/schemas/memberSchema";

function CreateMemberForm() {
  const handleCreateMember = async (data: UserCreateFormData) => {
    try {
      console.log("Creating member with data:", data);
      // TODO: Implement API call to create member
      // const response = await createMemberAPI(data);
      // Handle success - show toast, redirect, etc.
    } catch (error) {
      console.error("Failed to create member:", error);
      // TODO: Handle error - show error toast
    }
  };

  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "Create Member",
        iconName: "ArrowLeft",
        href: "/members",
      }}
      className="p-4"
    >
      <MemberForm mode="create" onSubmit={handleCreateMember} />
    </LayoutWrapper>
  );
}

export default CreateMemberForm;
