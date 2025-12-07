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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchSabhaListData = async (pageNum: number = page) => {
    const data = await fetchSabhaList({
      page: pageNum,
      limit: 1000,
      sabah_status: activeTab === "upcoming-sabha" ? "upcoming" : "completed",
    }).unwrap();
    return data.rows;
  };

  const handleEndReached = async () => {
    if (loading || !hasMore || sabhaList.length >= totalSabha) return;
    setLoading(true);

    const nextPage = page + 1;
    try {
      const data = await fetchSabhaListData(nextPage);
      if (data && data.length > 0) {
        setPage(nextPage);
        if (sabhaList.length + data.length >= totalSabha) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more sabha:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSabhaList([]);
    setPage(1);
    setHasMore(true);
    fetchSabhaListData();
  }, [activeTab]);

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
        <TabsContent value="upcoming-sabha" className="flex-1 px-4">
          {sabhaLoading ? (
            <LoadingSpinner />
          ) : (
            <Virtuoso
              totalCount={sabhaList.length}
              data={sabhaList}
              endReached={handleEndReached}
              itemContent={(index, sabha) => {
                return (
                  <div
                    key={sabha?.id}
                    className={cn("w-full mb-4", index === 0 && "pt-4")}
                  >
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
              endReached={handleEndReached}
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
