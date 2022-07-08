import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "db/client";

export const userRouter = trpc.router().query("get", {
  input: z.object({
    userId: z.string(),
  }),
  async resolve({ input }) {
    return await prisma.user.findFirst({
      where: { id: input.userId },
    });
  },
});
