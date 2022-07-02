import { User } from "@prisma/client";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "backend/router";
import { FC, FormEvent, useRef, useState } from "react";
import { trpc } from "utils/trpc";
import Button, { BUTTON_OPTIONS } from "./button";
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
      className={`w-full relative mx-auto p-4 md:p-6 bg-white flex rounded-lg items-start ${
        reply
          ? "relative ml-4 w-[calc(100%-1rem)] md:ml-20 md:w-[calc(100%-5rem)] before:bg-[rgba(103,114,126,0.2)] before:w-[1px] before:h-[calc(100%+1.1rem)] before:absolute before:-left-4 md:before:-left-10 before:top-[-1.1rem]"
          : "md:w-[730px] my-[0.55rem]"
      }`}
    >
      <Image src={user.avatar} alt="avatar" width={40} height={40} />
      <form className={`flex flex-wrap md:flex-nowrap ml-6 w-full`} onSubmit={handleFormSubmit}>
        <textarea
          placeholder="Add a comment..."
          className="mb-3 md:mb-0 p-3 w-full rounded-lg border-[1px] hover:border-[rgb(50,65,82)]"
          disabled={isLoading}
          ref={inputRef}
          rows={3}
          defaultValue={setIsReplyMode ? `@${repliedCommentUserName}` : ""}
        />

        <Button styles={`ml-auto md:ml-4 self-start ${BUTTON_OPTIONS.SEND}`} isLoading={isLoading}>
          {setIsReplyMode ? "REPLY" : "SEND"}
        </Button>
      </form>
      {isError && <p className="absolute bottom-0 left-0 text-red-500 mt-1 w-full text-center">{error}</p>}
    </div>
  );
};

export default InputForm;
