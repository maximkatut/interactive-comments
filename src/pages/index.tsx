import CommentCard from "components/commentCard";
import type { NextPage } from "next";
import Head from "next/head";
import { Fragment, useRef } from "react";
import { trpc } from "utils/trpc";

const Home: NextPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
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
        <ul className="mb-10 w-[730px] flex flex-col mx-auto items-center">
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
        <form
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
          <input disabled={isLoading} ref={inputRef} type="text" className="p-1" />
          {isError && <p>{error.data?.code}</p>}
          <button disabled={isLoading} className="ml-2 border-2 border-zinc-700 p-1" type="submit">
            Send
          </button>
        </form>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
