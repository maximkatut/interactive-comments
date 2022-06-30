import CommentCard from "components/commentCard";
import InputForm from "components/inputForm";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Fragment } from "react";
import { trpc } from "utils/trpc";

const Home: NextPage = () => {
  const comments = trpc.useQuery(["comments.get-all"]);
  const user = trpc.useQuery(["user.get"]);

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

      <main className="flex flex-col p-12 mb-5">
        <ul className="mb-2 w-[730px] flex flex-col mx-auto items-center">
          {comments.data.map((comment) => {
            if (comment.repliedCommentId) {
              return;
            }

            return (
              <Fragment key={comment.id}>
                <CommentCard comment={comment} />
                {comments.data.map((repliedComment) => {
                  if (comment.id === repliedComment.repliedCommentId) {
                    return <CommentCard key={repliedComment.id} comment={repliedComment} reply />;
                  }
                })}
              </Fragment>
            );
          })}
        </ul>
        <div className="mx-auto w-[730px] p-6 bg-white flex rounded-lg items-start">
          {user.data && (
            <>
              <Image src={user.data.avatar} alt="avatar" width={40} height={40} />
              <InputForm user={user.data} />
            </>
          )}
        </div>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
