import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "db/client";

export const commentsRouter = trpc
  .router()
  .query("get-all", {
    async resolve() {
      return await prisma.comment.findMany();
    },
  })
  .mutation("create", {
    input: z.object({
      comment: z.string().min(5),
      rating: z.number(),
      userId: z.string(),
      userName: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.comment.create({
        data: {
          comment: input.comment,
          rating: 0,
          userId: input.userId,
          userName: input.userName,
        },
      });
    },
  });
