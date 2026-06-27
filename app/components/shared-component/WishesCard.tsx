import { Cake } from "lucide-react";
import type { Wish } from "~/types/wishes.interface";

function WishesCard({ wish }: { wish: Wish }) {
  const message = wish.is_today
    ? `${wish.name}'s Birthday is today! Please wish Happy Birthday!`
    : `${wish.name}'s Birthday is on ${wish.date_label}. Please wish Happy Birthday!`;

  return (
    <div className="w-full p-2 flex flex-col gap-1 justify-start items-start rounded-lg bg-white border border-borderColor shadow-md">
      <div className="w-full flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-base font-medium text-blue-600 capitalize">
          <Cake size={16} />
          Birthday Wishes
        </span>
        {wish.is_today && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium uppercase text-blue-600">
            Today
          </span>
        )}
      </div>
      <span className="text-textLightColor text-xs">{message}</span>
    </div>
  );
}

export default WishesCard;
