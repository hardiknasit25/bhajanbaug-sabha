import { redirect, type LoaderFunctionArgs, type MetaArgs } from "react-router";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";
import { Welcome } from "../welcome/welcome";

export function meta({}: MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = getTokenFromRequest(request);

  if (!token) {
    return redirect("/login");
  }

  return null;
};

export default function Home() {
  return (
    <LayoutWrapper>
      <Welcome />
    </LayoutWrapper>
  );
}
