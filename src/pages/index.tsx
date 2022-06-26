import type { NextPage } from "next";
import Head from "next/head";
import { useRef } from "react";
import { trpc } from "utils/trpc";

const Home: NextPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const comments = trpc.useQuery(["comments.get-all"]);
  const user = trpc.useQuery(["user.get"]);
  const client = trpc.useContext();
  const { mutate, isError, isLoading, error } = trpc.useMutation("comments.create", {
    onSuccess: () => {
      client.invalidateQueries(["comments.get-all"]);
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });

  if (!comments.data) {
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

      <main className="bg-blue-100 flex flex-col p-10">
        <ul className="mb-10">
          {comments.data.map((item, index) => {
            return <li key={index}>- {item.comment}</li>;
          })}
        </ul>
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            if (user.data) {
              mutate({
                comment: inputRef.current ? inputRef.current.value : "",
                rating: 0,
                userId: user.data.id,
                userName: user.data.name,
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
