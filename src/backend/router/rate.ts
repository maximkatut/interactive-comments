import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "db/client";

export const rateRouter = trpc
  .router()
  .query("get", {
    input: z.object({
      userId: z.string(),
      commentId: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.rate.findFirst({
        where: {
          userId: input.userId,
          commentId: input.commentId,
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      commentId: z.string(),
      userId: z.string(),
      status: z.number(),
    }),
    async resolve({ input }) {
      return await prisma.rate.create({
        data: {
          commentId: input.commentId,
          userId: input.userId,
          status: input.status,
        },
      });
    },
  })
  .mutation("edit", {
    input: z.object({
      rateId: z.number(),
      status: z.number(),
    }),
    async resolve({ input }) {
      return await prisma.rate.update({
        where: {
          id: input.rateId,
        },
        data: {
          status: input.status,
        },
      });
    },
  })
  .mutation("deleteRates", {
    input: z.object({
      commentId: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.rate.deleteMany({
        where: {
          commentId: input.commentId,
        },
      });
    },
  });
