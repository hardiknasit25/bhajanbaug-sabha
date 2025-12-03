import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import MemberDetailInfo from "~/components/shared-component/MemberDetailInfo";

function MemberReport() {
  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "report",
        iconName: "ArrowLeft",
      }}
    >
      <MemberDetailInfo />
      <div className="w-full flex flex-col justify-start items-center"></div>
    </LayoutWrapper>
  );
}

export default MemberReport;
