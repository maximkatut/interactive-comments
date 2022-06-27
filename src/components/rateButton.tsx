import Image from "next/image";
import { FC } from "react";
import iconMinus from "../../public/img/icons/icon-minus.svg";
import iconPlus from "../../public/img/icons/icon-plus.svg";

interface RateButtonProps {
  rating: number;
}

const RateButton: FC<RateButtonProps> = ({ rating }) => {
  return (
    <div>
      <div className="bg-[rgb(245,246,250)] flex flex-col items-center justify-between px-4 py-1 rounded-xl h-24">
        <button className="mb-1">
          <Image src={iconPlus} alt="plus" width={14} height={14} />
        </button>
        <span className="text-[rgb(84,87,182)] font-bold">{rating}</span>
        <button>
          <Image src={iconMinus} alt="minus" width={14} height={3} />
        </button>
      </div>
    </div>
  );
};

export default RateButton;
