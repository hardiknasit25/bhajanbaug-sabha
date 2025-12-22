import { RotateCcw, Send } from "lucide-react";
import { useEffect, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useNavigationType,
  type LoaderFunction,
  type MetaArgs,
} from "react-router";
import { Virtuoso } from "react-virtuoso";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import MemberListCard from "~/components/shared-component/MemberListCard";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ABSENT_MEMBER, PRESENT_MEMBER } from "~/constant/constant";
import { useSabha } from "~/hooks/useSabha";
import { localJsonStorageService } from "~/lib/localStorage";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export function meta({}: MetaArgs) {
  return [
    { title: "Members" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const token = getTokenFromRequest(request);

  if (!token) {
    return redirect("/login");
  }

  return {
    sabhaId: params.sabhaid,
  };
};

type DialogButton = {
  label: string;
  variant?: "default" | "outline";
  action: () => void | Promise<void>;
};

type DialogState = {
  open: boolean;
  title: string;
  message: string;
  buttons: DialogButton[];
};

export default function EventAttendance() {
  const { sabhaId } = useLoaderData() as { sabhaId: string };
  const navigate = useNavigate();
  const navType = useNavigationType();
  const {
    loading,
    selectedSabha,
    sabhaMembers,
    filteredSabhaMembers,
    searchText,
    totalPresentOnSelectedSabha,
    totalAbsentOnSelectedSabha,
    fetchSabhaById,
    setSabhaMemberSearchText,
    submitSabhaReport,
    syncSabhaAttendance,
  } = useSabha();
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    title: "",
    message: "",
    buttons: [],
  });

  const fetchSabhaMembers = () => {
    fetchSabhaById(Number(sabhaId));
  };

  const checkPendingChanges = () => {
    const present =
      localJsonStorageService.getItem<number[]>(PRESENT_MEMBER) || [];
    const absent =
      localJsonStorageService.getItem<number[]>(ABSENT_MEMBER) || [];

    setHasPendingChanges(present.length > 0 || absent.length > 0);
    return present.length > 0 || absent.length > 0;
  };

  const openDialog = (
    title: string,
    message: string,
    buttons: DialogButton[]
  ) => {
    setDialog({ open: true, title, message, buttons });
  };

  const handleRefreshSabha = async () => {
    const response = await syncSabhaAttendance(Number(sabhaId)).unwrap();

    if (!response) {
      return;
    }

    localJsonStorageService.setItem(PRESENT_MEMBER, []);
    localJsonStorageService.setItem(ABSENT_MEMBER, []);

    openDialog(
      "Synced Successfully!",
      "Your attendance data has been synced successfully.",
      [
        {
          label: "OK",
          action: () => setDialog((d) => ({ ...d, open: false })),
        },
      ]
    );
  };

  const handleSubmitSabha = async () => {
    const hasPending = await checkPendingChanges();

    if (hasPending) {
      openDialog(
        "Unsaved Changes?",
        "You have unsaved changes. Please sync them before submitting.",
        [
          {
            label: "Sync Now",
            action: async () => {
              setDialog((d) => ({ ...d, open: false }));

              handleRefreshSabha();
            },
          },
        ]
      );
    } else {
      openDialog(
        "Submit Attendance?",
        "Are you sure you want to submit? You can't edit after submission.",
        [
          {
            label: "Cancel",
            variant: "outline",
            action: () => setDialog((d) => ({ ...d, open: false })),
          },
          {
            label: "Yes, Submit",
            action: async () => {
              setDialog((d) => ({ ...d, open: false }));

              const res = await submitSabhaReport(Number(sabhaId));

              if (res) {
                openDialog(
                  "Submitted Successfully!",
                  "Attendance submission completed successfully.",
                  [
                    {
                      label: "OK",
                      action: () => setDialog((d) => ({ ...d, open: false })),
                    },
                  ]
                );
              }
            },
          },
        ]
      );
    }
  };

  useEffect(() => {
    fetchSabhaMembers();
  }, [sabhaId]);

  // useEffect(() => {
  //   if (!hasPendingChanges) {
  //     return;
  //   }

  //   openDialog(
  //     "Unsynced Changes",
  //     "You have unsynced attendance changes. Please sync before leaving. else, your changes may be lost.",
  //     [
  //       {
  //         label: "Cancel",
  //         variant: "outline",
  //         action: () => {
  //           setDialog((d) => ({ ...d, open: false }));
  //           navigate(-1);
  //         },
  //       },
  //       {
  //         label: "Sync & Leave",
  //         action: async () => {
  //           setDialog((d) => ({ ...d, open: false }));

  //           const res = await syncSabhaAttendance(Number(sabhaId));

  //           if (res) {
  //             localJsonStorageService.setItem(PRESENT_MEMBER, []);
  //             localJsonStorageService.setItem(ABSENT_MEMBER, []);
  //             navigate(-1);
  //           }
  //         },
  //       },
  //     ]
  //   );
  // }, [hasPendingChanges]);

  const openUnsyncedDialog = () => {
    openDialog(
      "Unsynced Changes",
      "You have unsynced attendance changes. Please sync before leaving.",
      [
        {
          label: "Cancel",
          variant: "outline",
          action: () => {
            setDialog((d) => ({ ...d, open: false }));
          },
        },
        {
          label: "Sync & Leave",
          action: async () => {
            setDialog((d) => ({ ...d, open: false }));

            const res = await syncSabhaAttendance(Number(sabhaId));
            if (res) {
              localJsonStorageService.setItem(PRESENT_MEMBER, []);
              localJsonStorageService.setItem(ABSENT_MEMBER, []);

              navigate("/sabha"); // Now allow back navigation
            }
          },
        },
      ]
    );
  };

  // useEffect(() => {
  //   window.history.pushState(null, "", window.location.href);

  //   const handleBack = () => {
  //     console.log("Back pressed - intercepted");
  //     const hasPendingChanges = checkPendingChanges();
  //     if (!hasPendingChanges) {
  //       navigate("/sabha");
  //     } else {
  //       openUnsyncedDialog();
  //     }
  //     window.history.pushState(null, "", window.location.href);
  //   };

  //   window.addEventListener("popstate", handleBack);

  //   return () => window.removeEventListener("popstate", handleBack);
  // }, []);

  useEffect(() => {
    return () => {
      const present =
        localJsonStorageService.getItem<number[]>(PRESENT_MEMBER) || [];
      const absent =
        localJsonStorageService.getItem<number[]>(ABSENT_MEMBER) || [];

      if (present.length || absent.length) {
        (async () => {
          try {
            const res = await syncSabhaAttendance(Number(sabhaId));
            if (res) {
              localJsonStorageService.setItem(PRESENT_MEMBER, []);
              localJsonStorageService.setItem(ABSENT_MEMBER, []);
              navigate("/sabha");
            }
          } catch (error) {
            console.error("Sync failed during unmount:", error);
          }
        })();
      }
    };
  }, []);

  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "Attendance",
        iconName: "ArrowLeft",
        children: (
          <div className="flex justify-end items-center gap-4 pr-3">
            <div
              className="relative cursor-pointer"
              onClick={handleRefreshSabha}
            >
              <RotateCcw size={22} />

              {((
                localJsonStorageService.getItem<number[]>(PRESENT_MEMBER) ?? []
              ).length > 0 ||
                (localJsonStorageService.getItem<number[]>(ABSENT_MEMBER) ?? [])
                  .length > 0) && (
                <span className="absolute -top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </div>

            {selectedSabha?.status === "running" && (
              <Send
                size={22}
                onClick={handleSubmitSabha}
                className="cursor-pointer"
              />
            )}
          </div>
        ),
        className: "flex-col gap-2",
        description: `Total ${filteredSabhaMembers.length} Members`,
        showSearch: true,
        searchPlaceholder: "Search Members...",
        searchValue: searchText,
        onSearchChange: setSabhaMemberSearchText,
      }}
    >
      {/* Summary Counts */}
      <div className="flex justify-around items-center p-2 shadow-sm">
        <div className="flex flex-col items-center">
          <span className="text-3xl text-green-500 font-medium font-poppins">
            {totalPresentOnSelectedSabha}
          </span>
          <span className="text-base text-textColor font-medium font-poppins">
            Present
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl text-red-500 font-medium font-poppins">
            {selectedSabha?.status !== "completed"
              ? totalAbsentOnSelectedSabha
              : sabhaMembers.length - totalPresentOnSelectedSabha}
          </span>
          <span className="text-base text-textColor font-medium font-poppins">
            Absent
          </span>
        </div>
      </div>

      {/* Members List */}
      {loading && sabhaMembers.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <Virtuoso
          totalCount={filteredSabhaMembers.length}
          itemContent={(index) => {
            const member = filteredSabhaMembers[index];
            return (
              <MemberListCard
                key={member.smk_no}
                member={member}
                from="attendance"
                selectedSabha={selectedSabha}
              />
            );
          }}
          components={{
            Footer: () =>
              sabhaMembers.length === 0 ? (
                <div className="text-center text-textLightColor mt-2">
                  No members found
                </div>
              ) : null,
          }}
        />
      )}

      {/* Universal Dialog */}
      <Dialog
        open={dialog.open}
        onOpenChange={(v) => setDialog((d) => ({ ...d, open: v }))}
      >
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle className="text-textColor font-semibold">
              {dialog.title}
            </DialogTitle>
          </DialogHeader>

          <p className="text-base text-textLightColor">{dialog.message}</p>

          <DialogFooter className="mt-4 flex gap-2">
            {dialog.buttons.map((btn, index) => (
              <Button
                key={index}
                variant={btn.variant || "default"}
                className="flex-1"
                onClick={btn.action}
              >
                {btn.label}
              </Button>
            ))}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutWrapper>
  );
}
