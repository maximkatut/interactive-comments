import type { NextPage } from "next";
import Head from "next/head";
import { prisma } from "../db/client";

const Home: NextPage = ({ comments }: any) => {
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

      <main>
        <div className="bg-red-200">{comments}</div>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const comments = await prisma.comment.findMany();
  return {
    props: {
      comments: JSON.stringify(comments),
    },
  };
};
