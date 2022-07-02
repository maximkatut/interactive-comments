import { Rate } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";
import { trpc } from "utils/trpc";
import iconMinus from "../../public/img/icons/icon-minus.svg";
import iconPlus from "../../public/img/icons/icon-plus.svg";

interface RateButtonProps {
  rating: number;
  commentId: string;
  commentUserId: string;
  userId?: string;
}

const RateButton: FC<RateButtonProps> = ({ rating, commentId, userId, commentUserId }) => {
  const client = trpc.useContext();
  const { mutate: createRate, isLoading } = trpc.useMutation("rate.create");
  const { mutate: updateRate } = trpc.useMutation("comments.updateRate", {
    onSuccess: () => {
      client.invalidateQueries(["comments.get-all"]);
      client.invalidateQueries(["rate.get"]);
    },
  });
  let rate: Rate | null | undefined;
  if (userId) {
    rate = trpc.useQuery(["rate.get", { userId, commentId }]).data;
  }

  const createRateAndUpdateRating = (newRating: number) => {
    if (!userId) {
      return;
    }
    if (rate) {
      return;
    }
    createRate({
      userId,
      commentId,
    });
    updateRate({
      id: commentId,
      rating: newRating,
    });
  };

  const handleMinusRateClick = () => {
    const newRating = rating - 1;
    createRateAndUpdateRating(newRating);
  };

  const handlePlusRateClick = () => {
    const newRating = rating + 1;
    createRateAndUpdateRating(newRating);
  };

  return (
    <div className="md:order-none order-1 mt-4 md:mt-0">
      <div className="bg-[rgb(245,246,250)] relative flex md:flex-col items-center justify-between px-3 md:px-4 py-2 rounded-xl md:h-24 w-24 md:w-auto">
        <button
          onClick={handlePlusRateClick}
          className={`w-[0.65rem] md:w-auto opacity-50 ${
            commentUserId === userId || !!rate ? "" : "hover:opacity-100"
          }`}
          disabled={isLoading || commentUserId === userId || !!rate}
        >
          <Image src={iconPlus} alt="plus" width={14} height={14} />
        </button>
        <span className="text-[rgb(84,87,182)] font-bold md:absolute top-[2.35rem]">{rating}</span>
        <button
          onClick={handleMinusRateClick}
          disabled={isLoading || commentUserId === userId || !!rate}
          className={`w-[0.65rem] mb-1 md:mb-0 md:w-auto opacity-50 ${
            commentUserId === userId || !!rate ? "" : "hover:opacity-100"
          }`}
        >
          <Image src={iconMinus} alt="minus" width={14} height={3} />
        </button>
      </div>
    </div>
  );
};

export default RateButton;
