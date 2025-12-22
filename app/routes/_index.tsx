import { redirect, type LoaderFunctionArgs, type MetaArgs } from "react-router";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import WishesCard from "~/components/shared-component/WishesCard";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export function meta({}: MetaArgs) {
  return [
    { title: "Bhajanbaug Sabha" },
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
    <LayoutWrapper
      headerConfigs={{
        title: "Bhajan baug",
      }}
      className="p-4"
    >
      <div className="w-full aspect-video rounded-xl overflow-hidden mb-4">
        <img
          src="images/homePageChopai.jpg"
          alt="home_page_chopai"
          className="h-full w-full object-cover bg-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 30 }).map((_, index) => (
          <WishesCard key={index} />
        ))}
      </div>
    </LayoutWrapper>
  );
}
