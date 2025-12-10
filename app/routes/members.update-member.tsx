import MemberForm from "~/components/forms/MemberForm";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import { useMembers } from "~/hooks/useMembers";

function MemberUpdateForm() {
  const { selectedMember } = useMembers();

  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "Update Member",
        iconName: "ArrowLeft",
      }}
      className="p-4"
    >
      <MemberForm mode="update" initialData={selectedMember || undefined} />
    </LayoutWrapper>
  );
}

export default MemberUpdateForm;
