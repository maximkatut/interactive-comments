import { User } from "@prisma/client";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "backend/router";
import { FC, FormEvent, useRef, useState } from "react";
import { trpc } from "utils/trpc";
import Button from "./button";

interface InputFormProps {
  user: User;
  reply?: boolean;
  origCommentId?: string | null;
  repliedCommentUserName?: string;
  setIsReplyMode?: (x: boolean) => void;
}

const InputForm: FC<InputFormProps> = ({ user, reply, origCommentId, setIsReplyMode, repliedCommentUserName }) => {
  const [error, setError] = useState<string>("");
  const client = trpc.useContext();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const trpcOptions = {
    onSuccess: () => {
      reply ? client.invalidateQueries(["replied-comments.get-all"]) : client.invalidateQueries(["comments.get-all"]);
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
    onError: (data: TRPCClientErrorLike<AppRouter>) => {
      setError(JSON.parse(data.message)[0].message);
    },
  };

  const createComment = trpc.useMutation("comments.create", trpcOptions);
  const createReply = trpc.useMutation("replied-comments.create", trpcOptions);

  const create = reply ? createReply : createComment;

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    const data = {
      body: inputRef.current ? inputRef.current.value : "",
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
    };
    e.preventDefault();
    if (user) {
      reply ? origCommentId && createReply.mutate({ ...data, ...{ origCommentId } }) : createComment.mutate(data);
    }
    if (setIsReplyMode) {
      setIsReplyMode(false);
    }
  };

  return (
    <>
      <form className="flex ml-6 w-full" onSubmit={handleFormSubmit}>
        <textarea
          placeholder="Add a comment..."
          className="p-1 w-full rounded-lg border-[1px] hover:border-[rgb(50,65,82)]"
          disabled={create.isLoading}
          ref={inputRef}
          rows={4}
          defaultValue={reply ? `@${repliedCommentUserName}` : ""}
        />

        <Button styles="self-start ml-4" isLoading={create.isLoading}>
          SEND
        </Button>
      </form>
      {create.isError && <p className="text-red-500 mt-1 w-full text-center">{error}</p>}
    </>
  );
};

export default InputForm;
