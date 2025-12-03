import { CirclePlus } from "lucide-react";
import { Link } from "react-router";
import EventCard from "~/components/shared-component/EventCard";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Sabha() {
  return (
    <LayoutWrapper
      headerConfigs={{
        title: "Sabha",
        children: (
          <Link to="/sabha/create-event">
            <CirclePlus />
          </Link>
        ),
      }}
    >
      <Tabs defaultValue="upcoming-sabha" className="w-full">
        <TabsList className="w-full bg-primaryColor rounded-none justify-evenly h-10 pb-2">
          <TabsTrigger value="upcoming-sabha">Upcoming Sabha</TabsTrigger>
          <TabsTrigger value="completed-sabha">Completed Sabha</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming-sabha" className="p-4">
          <div className="w-full grid grid-cols-1 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <EventCard key={index} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed-sabha" className="p-4">
          <div className="w-full grid grid-cols-1 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <EventCard key={index} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  );
}
