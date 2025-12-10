import MemberForm from "~/components/forms/MemberForm";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";

function CreateMemberForm() {
  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "Create Member",
        iconName: "ArrowLeft",
      }}
      className="p-4"
    >
      <div className="h-full w-full">
        <MemberForm mode="create" />
      </div>
    </LayoutWrapper>
  );
}

export default CreateMemberForm;
