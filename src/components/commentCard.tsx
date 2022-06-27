import Image from "next/image";
import { FC } from "react";
import OptionsButton from "./optionsButton";
import RateButton from "./rateButton";

interface CommentCardProps {
  reply?: boolean;
  userId?: string;
  comment: {
    id: string;
    body: string;
    rating: number;
    createdAt: Date;
    userName: string;
    userId: string;
    userAvatar: string;
  };
}

const CommentCard: FC<CommentCardProps> = ({ comment, reply, userId }) => {
  return (
    <li
      className={`
      flex
      w-full
      p-6 my-3
      rounded-lg
      bg-white
      ${
        reply
          ? "relative ml-20 w-[calc(100%-5rem)] before:bg-[rgba(103,114,126,0.2)] before:w-[1px] before:h-[calc(100%+1.5rem)] before:absolute before:-left-10 before:-top-6"
          : ""
      }`}
    >
      <RateButton rating={comment.rating} />
      <div className="flex flex-col pl-6 w-full">
        <div className="flex justify-between items-center pb-3">
          <div className="flex items-center">
            <span>
              <Image src={comment.userAvatar} alt="avatar" width={32} height={32} />
            </span>
            <span className="text-[rgb(50,65,82)] font-bold ml-4">{comment.userName}</span>
            <span className="ml-4">{JSON.stringify(comment.createdAt)}</span>
          </div>
          <div className="font-bold">
            <OptionsButton userId={comment.userId} authUserId={userId} />
          </div>
        </div>
        <p className="">{comment.body}</p>
      </div>
    </li>
  );
};

export default CommentCard;