import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import superjson from "superjson";
import { prisma } from "db/client";

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAllUsers", {
    async resolve() {
      return await prisma.user.findMany();
    },
  })
  .query("getAllComments", {
    async resolve() {
      return await prisma.comment.findMany();
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
