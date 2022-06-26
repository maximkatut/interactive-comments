import { withTRPC } from "@trpc/next";
import superjson from "superjson";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "./api/trpc/[trpc]";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
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
