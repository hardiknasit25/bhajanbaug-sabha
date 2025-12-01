import type { MetaArgs } from "react-router";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";

export function meta({}: MetaArgs) {
  return [
    { title: "Sabha Report" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Report() {
  return (
    <LayoutWrapper
      headerConfigs={{
        title: "Report",
      }}
      className="p-4"
    >
      <div>Report Screen</div>
    </LayoutWrapper>
  );
}
