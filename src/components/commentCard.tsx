import Image from "next/image";
import { FC, useRef, useState } from "react";
import { trpc } from "utils/trpc";
import Button, { BUTTON_OPTIONS } from "./button";
import OptionButton from "./optionButton";
import RateButton from "./rateButton";

import editImg from "../../public/img/icons/icon-edit.svg";
import deleteImg from "../../public/img/icons/icon-delete.svg";
import replyImg from "../../public/img/icons/icon-reply.svg";
import { formatDate } from "utils/formatDate";
import InputForm from "./inputForm";
import { Comment } from "@prisma/client";
import { useStore } from "store";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "backend/router";

const OPTION_BUTTONS = {
  delete: {
    img: deleteImg,
    title: "Delete",
    styles: "text-[rgb(237,100,104)] right-20",
  },
  edit: {
    img: editImg,
    title: "Edit",
    styles: "ml-4 text-[rgb(84,87,182)] right-6",
  },
  reply: {
    img: replyImg,
    title: "Reply",
    styles: "text-[rgb(84,87,182)] right-6",
  },
};
interface CommentCardProps {
  reply: boolean;
  comment: Comment;
}

const CommentCard: FC<CommentCardProps> = ({ comment, reply }) => {
  const { setModalIsShowed, setDeletingCommentId } = useStore();
  const [error, setError] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isReplyMode, setIsReplyMode] = useState<boolean>(false);
  const [body, setBody] = useState<string>("akljkfbykauhfsolis");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { data: user } = trpc.useQuery(["user.get"]);
  const client = trpc.useContext();
  const {
    mutate: editComment,
    isError,
    isLoading,
  } = trpc.useMutation("comments.edit", {
    onSuccess: async () => {
      await client.invalidateQueries(["comments.get-all"]);
      setIsEditMode(false);
    },
    onError: (data: TRPCClientErrorLike<AppRouter>) => {
      setError(JSON.parse(data.message)[0].message);
    },
  });

  const handleUpdateButtonClick = () => {
    editComment({
      body,
      id: comment.id,
    });
  };
  const handleReplyButtonClick = () => {
    setIsReplyMode(!isReplyMode);
  };

  const handleEditButtonClick = () => {
    setIsEditMode(true);
    setBody(comment.body);
  };

  const handleDeleteButtonClick = () => {
    setModalIsShowed(true);
    setDeletingCommentId(comment.id);
  };

  if (!user) {
    return <p>Please login...</p>;
  }

  return (
    <>
      <li
        className={`
      flex
      md:flex-row
      flex-col
      p-4
      w-full
      md:p-6 my-[0.55rem]
      rounded-lg
      bg-white
      relative
      ${
        reply
          ? "relative ml-4 w-[calc(100%-1rem)] md:ml-20 md:w-[calc(100%-5rem)] before:bg-[rgba(103,114,126,0.2)] before:w-[1px] before:h-[calc(100%+1.1rem)] before:absolute before:-left-4 md:before:-left-10 before:top-[-1.1rem]"
          : ""
      }`}
      >
        <RateButton rating={comment.rating} commentId={comment.id} userId={user.id} commentUserId={comment.userId} />
        <div className="flex flex-col pl-0 md:pl-6 w-full">
          <div className=" flex justify-between items-center pb-3">
            <div className="flex items-center">
              <span>
                <Image src={comment.userAvatar} alt="avatar" width={32} height={32} />
              </span>
              <span className="text-[rgb(50,65,82)] font-bold ml-4">{comment.userName}</span>
              {user && user.id === comment.userId && (
                <span className="ml-1 text-xs py-[0.15rem] px-1 rounded-sm text-white bg-[rgb(84,87,182)]">you</span>
              )}
              <span className="ml-4">{formatDate(comment.createdAt)}</span>
            </div>
            <div className="font-bold">
              {user && comment.userId === user.id ? (
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
                className="py-2 mb-2 px-5 border-[1px] rounded-lg hover:border-[rgb(50,65,82)]"
                defaultValue={comment.body}
                ref={textAreaRef}
                rows={4}
              />
              <Button
                styles={`self-end ${BUTTON_OPTIONS.SEND}`}
                onClick={handleUpdateButtonClick}
                isLoading={isLoading}
              >
                UPDATE
              </Button>
              {isError && <p className="absolute -bottom-60 left-0 text-red-500 mt-1 w-full text-center">{error}</p>}
            </>
          ) : (
            <p className="">{comment.body}</p>
          )}
        </div>
      </li>
      {isReplyMode && user && (
        <InputForm
          user={{
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          }}
          repliedCommentId={comment.repliedCommentId || comment.id}
          repliedCommentUserName={comment.userName}
          reply={true}
          setIsReplyMode={setIsReplyMode}
        />
      )}
    </>
  );
};

export default CommentCard;
