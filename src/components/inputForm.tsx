import { User } from "@prisma/client";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "backend/router";
import { FC, FormEvent, useRef, useState } from "react";
import { trpc } from "utils/trpc";
import Button from "./button";

interface InputFormProps {
  user: User;
  reply?: boolean;
  repliedCommentId?: string | null;
  repliedCommentUserName?: string;
  setIsReplyMode?: (x: boolean) => void;
}

const InputForm: FC<InputFormProps> = ({ user, reply, repliedCommentId, setIsReplyMode, repliedCommentUserName }) => {
  const [error, setError] = useState<string>("");
  const client = trpc.useContext();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { mutate, isLoading, isError } = trpc.useMutation("comments.create", {
    onSuccess: () => {
      client.invalidateQueries(["comments.get-all"]);
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
    onError: (data: TRPCClientErrorLike<AppRouter>) => {
      setError(JSON.parse(data.message)[0].message);
    },
  });

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    const data = {
      body: inputRef.current ? inputRef.current.value : "",
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
    };
    e.preventDefault();

    reply ? repliedCommentId && mutate({ ...data, ...{ repliedCommentId } }) : mutate(data);

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
          disabled={isLoading}
          ref={inputRef}
          rows={4}
          defaultValue={reply ? `@${repliedCommentUserName}` : ""}
        />

        <Button styles="self-start ml-4" isLoading={isLoading}>
          SEND
        </Button>
      </form>
      {isError && <p className="text-red-500 mt-1 w-full text-center">{error}</p>}
    </>
  );
};

export default InputForm;
