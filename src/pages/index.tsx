import Head from "next/head";
import { Fragment } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

import CommentCard from "components/commentCard";
import InputForm from "components/inputForm";
import Modal from "components/modal";
import Button, { BUTTON_OPTIONS } from "components/button";

import { trpc } from "utils/trpc";
import { useStore } from "store";

import spinner from "../../public/img/icons/spinner.svg";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const comments = trpc.useQuery(["comments.get-all"]);
  const user = trpc.useQuery(["user.get", { userId: session?.userId as string }]);
  const { modalIsShowed, deletingCommentId } = useStore();

  if (!comments.data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Image src={spinner} alt="spinner" width={36} height={36} />
      </div>
    );
  }

  return (
    <div className="relative">
      <header className="w-[730px] mx-auto p-2 px-10 bg-[#ffffff] rounded-b-lg flex items-center justify-between">
        {session ? (
          <div className="flex items-center">
            {session.user?.image && (
              <Image className="rounded-full" src={session.user.image} width={32} height={32} alt="Profile image" />
            )}
            <p className="ml-3 font-bold">Hello, {session.user?.name}!</p>
          </div>
        ) : (
          <p className="font-bold">Hi! Please, sign in to leave a comment.</p>
        )}
        <Button
          onClick={() => {
            session ? signOut() : signIn();
          }}
          styles={BUTTON_OPTIONS.LOGIN}
        >
          {session ? "Log out" : "Sign in"}
        </Button>
      </header>
      <Head>
        <title>Comments</title>
        <meta name="description" content="Interactive comments on NextJS" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      {modalIsShowed && deletingCommentId && <Modal commentId={deletingCommentId} />}
      <main className="flex flex-col p-4 md:p-12 mb-5">
        <h1 className="visually-hidden">Interactive Comments</h1>
        <ul className="md:w-[730px] flex flex-col mx-auto items-center">
          {comments.data.map((comment) => {
            if (comment.repliedCommentId) {
              return;
            }
            return (
              <Fragment key={comment.id}>
                <CommentCard comment={comment} reply={false} />
                {comments.data.map((repliedComment) => {
                  if (comment.id === repliedComment.repliedCommentId) {
                    return <CommentCard key={repliedComment.id} comment={repliedComment} reply />;
                  }
                })}
              </Fragment>
            );
          })}
        </ul>
        {user.data && <InputForm user={user.data} reply={false} />}
      </main>
      <footer></footer>
    </div>
  );
};

export default Home;
