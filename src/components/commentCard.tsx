import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import { trpc } from "utils/trpc";
import Button from "./button";
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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [body, setBody] = useState<string>("akljkfbykauhfsolis");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const client = trpc.useContext();
  const { mutate } = trpc.useMutation("comments.edit", {
    onSuccess: async () => {
      await client.invalidateQueries(["comments.get-all"]);
      setIsEditMode(false);
    },
  });
  const deleteComment = trpc.useMutation("comments.delete", {
    onSuccess: () => {
      client.invalidateQueries(["comments.get-all"]);
    },
  });

  const handleButtonClick = () => {
    mutate({
      body,
      id: comment.id,
    });
  };
  const handleReplyClick = () => {};

  const handleEditButtonClick = () => {
    setIsEditMode(true);
  };

  const handleDeleteButtonClick = () => {
    deleteComment.mutate({ id: comment.id });
  };

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
            <OptionsButton
              userId={comment.userId}
              authUserId={userId}
              onEditClick={handleEditButtonClick}
              onDeleteClick={handleDeleteButtonClick}
            />
          </div>
        </div>
        {isEditMode ? (
          <>
            <textarea
              onChange={(e) => {
                setBody(e.target.value);
              }}
              className=" py-2 mb-2 px-5 border-[1px] rounded-lg border-[rgb(50,65,82)]"
              defaultValue={comment.body}
              ref={textAreaRef}
              rows={4}
            />
            <Button onClick={handleButtonClick}>UPDATE</Button>
          </>
        ) : (
          <p className="">{comment.body}</p>
        )}
      </div>
    </li>
  );
};

export default CommentCard;
