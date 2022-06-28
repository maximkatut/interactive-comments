import Button from "components/button";
import CommentCard from "components/commentCard";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Fragment, useRef } from "react";
import { trpc } from "utils/trpc";

const Home: NextPage = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const comments = trpc.useQuery(["comments.get-all"]);
  const repliedComments = trpc.useQuery(["replied-comments.get-all"]);
  //todo query replied comments by original comment id
  const user = trpc.useQuery(["user.get"]);
  const client = trpc.useContext();
  const { mutate, isError, isLoading, error } = trpc.useMutation("comments.create", {
    onSuccess: () => {
      client.invalidateQueries(["comments.get-all"]);
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });

  if (!comments.data || !repliedComments.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Comments</title>
        <meta name="description" content="Interactive comments on NextJS" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <main className="flex flex-col p-12">
        <ul className="mb-2 w-[730px] flex flex-col mx-auto items-center">
          {comments.data.map((comment) => {
            const replies = repliedComments.data.map((repliedComment) => {
              if (repliedComment.commentId === comment.id) {
                return <CommentCard key={repliedComment.id} comment={repliedComment} userId={user.data?.id} reply />;
              }
            });
            return (
              <Fragment key={comment.id}>
                <CommentCard comment={comment} userId={user.data?.id} />
                {replies}
              </Fragment>
            );
          })}
        </ul>
        <div className="mx-auto w-[730px] p-6 bg-white flex rounded-lg items-start">
          {user.data && <Image src={user.data.avatar} alt="avatar" width={40} height={40} />}
          <form
            className="flex ml-6 w-full"
            onSubmit={(e: any) => {
              e.preventDefault();
              if (user.data) {
                mutate({
                  body: inputRef.current ? inputRef.current.value : "",
                  userId: user.data.id,
                  userName: user.data.name,
                  userAvatar: user.data.avatar,
                });
              }
            }}
          >
            <textarea
              placeholder="Add a comment..."
              className="p-1 w-full rounded-lg border-[1px] hover:border-[rgb(50,65,82)]"
              disabled={isLoading}
              ref={inputRef}
              rows={4}
            />
            {isError && <p>{error.data?.code}</p>}
            <Button styles="self-start ml-4" isLoading={isLoading}>
              SEND
            </Button>
          </form>
        </div>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
