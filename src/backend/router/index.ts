import * as trpc from "@trpc/server";
import superjson from "superjson";
import { commentsRouter } from "./comments";

export const appRouter = trpc.router().transformer(superjson).merge("comments.", commentsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
