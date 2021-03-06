import { withTRPC } from "@trpc/next";
import superjson from "superjson";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "backend/router";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = "/api/trpc";
    return {
      transformer: superjson,
      url,
    };
  },
  ssr: false,
})(MyApp);
