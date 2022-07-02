import CommentCard from "components/commentCard";
import InputForm from "components/inputForm";
import type { NextPage } from "next";
import Head from "next/head";
import { Fragment } from "react";
import Modal from "components/modal";
import { trpc } from "utils/trpc";
import { useStore } from "store/imdex";

const Home: NextPage = () => {
  const comments = trpc.useQuery(["comments.get-all"]);
  const user = trpc.useQuery(["user.get"]);
  const { modalIsShowed, deletingCommentId } = useStore();
  if (!comments.data) {
    return <div>Loading...</div>;
  }

  if (!user.data) {
    return <div>Please login</div>;
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
