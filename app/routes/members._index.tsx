import { CirclePlus } from "lucide-react";
import { Link, type MetaArgs } from "react-router";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import MemberListCard from "~/components/shared-component/MemberListCard";
import { useMembers } from "~/hooks/useMembers";
import type { MemberStatus } from "~/types/members.interface";

export function meta({}: MetaArgs) {
  return [
    { title: "Members" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Members() {
  const { members, loading, error, updateStatus } = useMembers();

  const handleStatusChange = (smkNo: string, status: MemberStatus) => {
    updateStatus(smkNo, status);
    console.log(`Member ${smkNo} status changed to ${status}`);
  };

  return (
    <LayoutWrapper
      headerConfigs={{
        title: "Members",
        children: (
          <Link to="/members/create-member">
            <CirclePlus size={20} />
          </Link>
        ),
      }}
    >
      <div className="w-full flex flex-col">
        {members.map((member) => (
          <MemberListCard
            key={member.smk_no}
            name={member.name}
            smkId={member.smk_no}
            imageApiUrl={member.img}
            status={member.status}
            onStatusAction={(status) =>
              handleStatusChange(member.smk_no, status as MemberStatus)
            }
          />
        ))}
      </div>
    </LayoutWrapper>
  );
}
