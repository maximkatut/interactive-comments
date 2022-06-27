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
      body: z.string().min(5),
      userId: z.string(),
      userName: z.string(),
      userAvatar: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.comment.create({
        data: {
          body: input.body,
          userId: input.userId,
          userName: input.userName,
          userAvatar: input.userAvatar,
        },
      });
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string(),
      body: z.string().min(5),
    }),
    async resolve({ input }) {
      return await prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          body: input.body,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.comment.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
