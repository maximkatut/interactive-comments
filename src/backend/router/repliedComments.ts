import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "db/client";

export const repliedCommentsRouter = trpc
  .router()
  .query("get-all", {
    async resolve() {
      return await prisma.repliedComment.findMany();
    },
  })
  .mutation("create", {
    input: z.object({
      body: z.string().min(5),
      userId: z.string(),
      userName: z.string(),
      commentId: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.repliedComment.create({
        data: {
          body: input.body,
          userId: input.userId,
          userName: input.userName,
          commentId: input.commentId,
        },
      });
    },
  });
