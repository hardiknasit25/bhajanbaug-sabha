import { redirect, type LoaderFunctionArgs } from "react-router";
import MemberForm from "~/components/forms/MemberForm";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = getTokenFromRequest(request);

  if (!token) {
    return redirect("/login");
  }

  return null;
};

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
