import * as trpc from "@trpc/server";
import superjson from "superjson";
import { commentsRouter } from "./comments";
import { rateRouter } from "./rate";
import { userRouter } from "./user";

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge("comments.", commentsRouter)
  .merge("user.", userRouter)
  .merge("rate.", rateRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
