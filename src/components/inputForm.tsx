import { User } from "@prisma/client";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "backend/router";
import { FC, FormEvent, useRef, useState } from "react";
import { trpc } from "utils/trpc";
import Button from "./button";
import Image from "next/image";

interface InputFormProps {
  user: User;
  reply: boolean;
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
    <div
      className={`mx-auto p-6 bg-white flex rounded-lg items-start ${
        reply
          ? "relative ml-20 w-[calc(100%-5rem)] before:bg-[rgba(103,114,126,0.2)] before:w-[1px] before:h-[calc(100%+1.1rem)] before:absolute before:-left-10 before:top-[-1.1rem]"
          : "w-[730px] my-[0.55rem]"
      }`}
    >
      <Image src={user.avatar} alt="avatar" width={40} height={40} />
      <form className={`flex ml-6 w-full`} onSubmit={handleFormSubmit}>
        <textarea
          placeholder="Add a comment..."
          className="p-3 w-full rounded-lg border-[1px] hover:border-[rgb(50,65,82)]"
          disabled={isLoading}
          ref={inputRef}
          rows={3}
          defaultValue={reply ? `@${repliedCommentUserName}` : ""}
        />

        <Button styles="self-start ml-4" isLoading={isLoading}>
          {setIsReplyMode ? "REPLY" : "SEND"}
        </Button>
      </form>
      {isError && <p className="text-red-500 mt-1 w-full text-center">{error}</p>}
    </div>
  );
};

export default InputForm;
