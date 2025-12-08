import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Virtuoso } from "react-virtuoso";
import SabhaFormDialog from "~/components/forms/SabhaForm";
import EventCard from "~/components/shared-component/EventCard";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSabha } from "~/hooks/useSabha";
import { cn } from "~/lib/utils";

type SabhaTabs = "upcoming-sabha" | "completed-sabha";

export default function Sabha() {
  const {
    sabhaList,
    loading: sabhaLoading,
    totalSabha,
    setSabhaList,
    fetchSabhaList,
    openSabhaFormDialog,
  } = useSabha();
  const [activeTab, setActiveTab] = useState<SabhaTabs>("upcoming-sabha");

  const fetchSabhaListData = async () => {
    setSabhaList([]);
    const data = await fetchSabhaList(
      activeTab === "upcoming-sabha" ? "upcoming" : "completed"
    ).unwrap();
    return data.rows;
  };

  useEffect(() => {
    fetchSabhaListData();
  }, [activeTab]);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      setSabhaList([]);
    };
  }, []);

  return (
    <LayoutWrapper
      headerConfigs={{
        title: "Sabha",
        children: (
          <CirclePlus
            onClick={() => {
              openSabhaFormDialog(null);
            }}
          />
        ),
      }}
    >
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as SabhaTabs)}
        className="w-full h-full flex flex-col justify-start"
      >
        <TabsList className="w-full bg-primaryColor rounded-none justify-evenly h-10 pb-2">
          <TabsTrigger value="upcoming-sabha">Upcoming Sabha</TabsTrigger>
          <TabsTrigger value="completed-sabha">Completed Sabha</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming-sabha" className="h-full w-full p-4">
          {sabhaLoading ? (
            <LoadingSpinner />
          ) : (
            <Virtuoso
              totalCount={sabhaList.length}
              data={sabhaList}
              itemContent={(index, sabha) => {
                return (
                  <div key={sabha?.id} className={cn("w-full mb-4")}>
                    <EventCard sabha={sabha} />
                  </div>
                );
              }}
              components={{
                Footer: () => {
                  return (
                    sabhaList.length === 0 && (
                      <div className="text-center mt-2 text-textLightColor">
                        No sabha found
                      </div>
                    )
                  );
                },
              }}
              className="scrollbar-none"
            />
          )}
        </TabsContent>
        <TabsContent value="completed-sabha" className="p-4 w-full h-full">
          {sabhaLoading ? (
            <LoadingSpinner />
          ) : (
            <Virtuoso
              totalCount={totalSabha}
              data={sabhaList}
              itemContent={(index, sabha) => {
                return (
                  <div key={sabha?.id} className="w-full mb-4">
                    <EventCard sabha={sabha} />
                  </div>
                );
              }}
              components={{
                Footer: () => {
                  return sabhaList.length === 0 && <div>No sabha found</div>;
                },
              }}
            />
          )}
        </TabsContent>
      </Tabs>
      <SabhaFormDialog />
    </LayoutWrapper>
  );
}
