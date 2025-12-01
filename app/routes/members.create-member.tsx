import MemberForm from "~/components/forms/MemberForm";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";

function CreateMemberForm() {
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
      <MemberForm />
    </LayoutWrapper>
  );
}

export default CreateMemberForm;
