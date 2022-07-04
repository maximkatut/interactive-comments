import { Rate } from "@prisma/client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { trpc } from "utils/trpc";
import iconMinus from "../../public/img/icons/icon-minus.svg";
import iconPlus from "../../public/img/icons/icon-plus.svg";

interface RateButtonProps {
  rating: number;
  commentId: string;
  commentUserId: string;
  userId: string;
}

const RateButton: FC<RateButtonProps> = ({ rating, commentId, userId, commentUserId }) => {
  const [rate, setRate] = useState<Rate>();
  const [status, setStatus] = useState<number>(0);
  const [newRating, setNewRating] = useState<number>(rating);
  const initialRate = trpc.useQuery(["rate.get", { userId, commentId }]).data;
  const { mutate: createRate } = trpc.useMutation("rate.create");
  const { mutate: editRate } = trpc.useMutation("rate.edit");
  const { mutate: updateRating } = trpc.useMutation("comments.updateRating");

  useEffect(() => {
    if (initialRate) {
      setRate(initialRate);
      setStatus(initialRate.status);
    }
  }, [initialRate]);

  const createOrUpdateRate = (status: number) => {
    if (rate) {
      editRate({
        status,
        rateId: rate.id,
      });
    } else {
      createRate({
        commentId,
        userId,
        status,
      });
    }
  };

  const handleMinusRateClick = () => {
    if (status === 1) {
      setStatus(0);
      createOrUpdateRate(0);
      setNewRating((prevRating) => {
        updateRating({
          id: commentId,
          rating: prevRating - 1,
        });
        return prevRating - 1;
      });
    } else {
      setStatus(-1);
      createOrUpdateRate(-1);
      setNewRating((prevRating) => {
        updateRating({
          id: commentId,
          rating: status === 0 ? prevRating - 1 : prevRating,
        });
        return status === 0 ? prevRating - 1 : prevRating;
      });
    }
  };

  const handlePlusRateClick = () => {
    if (status === -1) {
      setStatus(0);
      createOrUpdateRate(0);
      setNewRating((prevRating) => {
        updateRating({
          id: commentId,
          rating: prevRating + 1,
        });
        return prevRating + 1;
      });
    } else {
      setStatus(1);
      createOrUpdateRate(1);
      setNewRating((prevRating) => {
        updateRating({
          id: commentId,
          rating: status === 0 ? prevRating + 1 : prevRating,
        });
        return status === 0 ? prevRating + 1 : prevRating;
      });
    }
  };

  return (
    <div className="md:order-none order-1 mt-4 md:mt-0">
      <div className="bg-[rgb(245,246,250)] relative flex md:flex-col items-center justify-between px-3 md:px-4 py-2 rounded-xl md:h-24 w-24 md:w-auto">
        <button
          onClick={handlePlusRateClick}
          className={`w-[0.65rem] md:w-auto opacity-50 ${
            commentUserId === userId || status === 1 ? "" : "hover:opacity-100"
          }`}
          disabled={commentUserId === userId || status === 1}
        >
          <Image src={iconPlus} alt="plus" width={14} height={14} />
        </button>
        <span className="text-[rgb(84,87,182)] font-bold md:absolute top-[2.35rem]">{newRating}</span>
        <button
          onClick={handleMinusRateClick}
          disabled={commentUserId === userId || status === -1}
          className={`w-[0.65rem] mb-1 md:mb-0 md:w-auto opacity-50 ${
            commentUserId === userId || status === -1 ? "" : "hover:opacity-100"
          }`}
        >
          <Image src={iconMinus} alt="minus" width={14} height={3} />
        </button>
      </div>
    </div>
  );
};

export default RateButton;
