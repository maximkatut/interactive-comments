import Image from "next/image";
import { FC, useRef, useState } from "react";
import { trpc } from "utils/trpc";
import Button from "./button";
import OptionButton from "./optionButton";
import RateButton from "./rateButton";

import editImg from "../../public/img/icons/icon-edit.svg";
import deleteImg from "../../public/img/icons/icon-delete.svg";
import replyImg from "../../public/img/icons/icon-reply.svg";
import { formatDate } from "utils/formatDate";

const OPTION_BUTTONS = {
  delete: {
    img: deleteImg,
    title: "Delete",
    styles: "text-[rgb(237,100,104)]",
  },
  edit: {
    img: editImg,
    title: "Edit",
    styles: "ml-4 text-[rgb(84,87,182)]",
  },
  reply: {
    img: replyImg,
    title: "Reply",
    styles: "text-[rgb(84,87,182)]",
  },
};
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
  const [isReplyMode, setIsReplyMode] = useState<boolean>(false);
  const [body, setBody] = useState<string>("akljkfbykauhfsolis");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const client = trpc.useContext();
  const editComment = trpc.useMutation("comments.edit", {
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

  const handleUpdateButtonClick = () => {
    editComment.mutate({
      body,
      id: comment.id,
    });
  };
  const handleReplyButtonClick = () => {
    setIsReplyMode(true);
  };

  const handleEditButtonClick = () => {
    setIsEditMode(true);
    setBody(comment.body);
  };

  const handleDeleteButtonClick = () => {
    deleteComment.mutate({ id: comment.id });
  };

  return (
    <>
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
              {userId === comment.userId && (
                <span className="ml-1 text-xs py-[0.15rem] px-1 rounded-sm text-white bg-[rgb(84,87,182)]">you</span>
              )}
              <span className="ml-4">{formatDate(comment.createdAt)}</span>
            </div>
            <div className="font-bold">
              {comment.userId === userId ? (
                <>
                  <OptionButton
                    onClick={handleDeleteButtonClick}
                    img={OPTION_BUTTONS.delete.img}
                    title={OPTION_BUTTONS.delete.title}
                    styles={OPTION_BUTTONS.delete.styles}
                  />
                  <OptionButton
                    onClick={handleEditButtonClick}
                    img={OPTION_BUTTONS.edit.img}
                    title={OPTION_BUTTONS.edit.title}
                    styles={OPTION_BUTTONS.edit.styles}
                  />
                </>
              ) : (
                <OptionButton
                  onClick={handleReplyButtonClick}
                  img={OPTION_BUTTONS.reply.img}
                  title={OPTION_BUTTONS.reply.title}
                  styles={OPTION_BUTTONS.reply.styles}
                />
              )}
            </div>
          </div>
          {isEditMode ? (
            <>
              <textarea
                onChange={(e) => {
                  setBody(e.target.value);
                }}
                className=" py-2 mb-2 px-5 border-[1px] rounded-lg hover:border-[rgb(50,65,82)]"
                defaultValue={comment.body}
                ref={textAreaRef}
                rows={4}
              />
              <Button styles="self-end" onClick={handleUpdateButtonClick}>
                UPDATE
              </Button>
            </>
          ) : (
            <p className="">{comment.body}</p>
          )}
        </div>
      </li>
      {isReplyMode && <form>@{comment.userName}</form>}
    </>
  );
};

export default CommentCard;
