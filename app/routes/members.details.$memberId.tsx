import { ChartColumn, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  type LoaderFunction,
} from "react-router";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import MemberDetailInfo from "~/components/shared-component/MemberDetailInfo";
import MemberQrDialog from "~/components/shared-component/MemberQrDialog";
import Can from "~/components/shared-component/Can";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useMembers } from "~/hooks/useMembers";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { memberId } = params;

  const token = getTokenFromRequest(request);

  if (!token) {
    return redirect("/login");
  }

  return {
    memberId: memberId,
  };
};
function MemberDetails() {
  const { memberId } = useLoaderData();
  const { loading, selectedMember, fetchMemberById, deleteMember } =
    useMembers();
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchMemberById(memberId);
  }, [memberId]);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteMember(Number(memberId)).unwrap();
      setDeleteOpen(false);
      navigate("/members");
    } catch (error) {
      setDeleteError(
        typeof error === "string" ? error : "Unable to delete this member."
      );
    } finally {
      setDeleting(false);
    }
  };

  function calculateAge(birthDateInput: string | Date | undefined | null) {
    if (!birthDateInput) return null;

    const birthDate = new Date(birthDateInput);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const hasNotHadBirthdayThisYear =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate());

    if (hasNotHadBirthdayThisYear) {
      age -= 1;
    }

    return age;
  }

  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "people",
        iconName: "ArrowLeft",
        children: (
          <div className="flex justify-center items-center gap-4 pr-2">
            <MemberQrDialog
              memberId={Number(memberId)}
              memberName={
                selectedMember
                  ? `${selectedMember.first_name ?? ""} ${
                      selectedMember.middle_name ?? ""
                    } ${selectedMember.last_name ?? ""}`
                  : undefined
              }
              smkNo={selectedMember?.smk_no}
              mobile={selectedMember?.mobile}
            />
            <ChartColumn
              size={18}
              onClick={() => navigate(`/members/report/${memberId}`)}
            />
            <Can module="member" action="update">
              <Edit
                size={18}
                onClick={() => navigate(`/members/update-member`)}
              />
            </Can>
            <Can module="member" action="delete">
              <Trash2
                size={18}
                className="cursor-pointer"
                onClick={() => {
                  setDeleteError(null);
                  setDeleteOpen(true);
                }}
              />
            </Can>
          </div>
        ),
      }}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <MemberDetailInfo />
          <div className="w-full flex flex-col">
            <MemberDetail
              title="Personal Info"
              details={[
                { title: "email", value: selectedMember?.email ?? null },
                { title: "mobile no.", value: selectedMember?.mobile ?? null },
                {
                  title: "birth date",
                  value: selectedMember?.birth_day ?? null,
                },
                {
                  title: "age",
                  value:
                    calculateAge(selectedMember?.birth_day)?.toString() ?? null,
                },
                {
                  title: "satsang day",
                  value: selectedMember?.satsang_day ?? null,
                },
                { title: "mulgam", value: selectedMember?.mulgam ?? null },
              ]}
            />
            <MemberDetail
              title="Address"
              details={[{ value: selectedMember?.address ?? null }]}
            />
            <MemberDetail
              title="Skills"
              details={[
                {
                  title: "occupation",
                  value: selectedMember?.occupation ?? null,
                },
                {
                  title: "occupation filed",
                  value: selectedMember?.occupation_field ?? null,
                },
              ]}
            />
            <MemberDetail
              title="Other"
              details={[
                {
                  title: "family leader",
                  value: selectedMember?.family_leader_id?.toString() ?? null,
                },
                {
                  title: "parichhit bhakt",
                  value: selectedMember?.parichit_bhakat_name ?? null,
                },
              ]}
            />
          </div>
        </>
      )}

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-textColor">Delete Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {deleteError && <p className="text-sm text-errorColor">{deleteError}</p>}

          <DialogFooter className="flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 rounded-full bg-deleteButtonColor text-white hover:bg-deleteButtonColor/90"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutWrapper>
  );
}

const MemberDetail = ({
  title,
  details,
}: {
  title: string;
  details: { title?: string; value: string | null }[];
}) => {
  return (
    <div className="w-full flex flex-col justify-start">
      {title && (
        <div className="w-full text-sm font-medium uppercase p-2 text-themeBlueColor">
          {title}
        </div>
      )}
      <div className="w-full flex flex-col justify-start items-start p-2 gap-2 bg-white border-t border-b border-borderColor">
        {details.map((detail) => {
          return (
            <div className="w-full flex flex-col uppercase text-sm">
              <span className="text-sm font-normal text-textColor">
                {detail.title}
              </span>
              <span className="text-sm font-normal text-textLightColor capitalize">
                {detail.value ?? "-"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberDetails;
