"use server";

import { prisma } from "@/lib/db";
import { ActionResponse } from "@/lib/types/waitlist";
import { waitlistSchema } from "@/lib/zod";

export const addToWaitlist = async (
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> => {
  try {
    const data = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
    };

    const parsedData = waitlistSchema.safeParse(data);

    if (!parsedData.success) {
      console.log(parsedData.error);
      return {
        success: false,
        message: "Please fix the errors",
        errors: parsedData.error.flatten().fieldErrors,
        data: data,
      };
    }

    const isUserInDb = await prisma.waitlistUsers.findFirst({
      where: {
        email: data.email.trim(),
      },
      cacheStrategy: {
        swr: 0,
        ttl: 0,
      },
    });

    if (isUserInDb) {
      return {
        success: false,
        message: "You are already in the waitlist",
      };
    }

    const registerUser = await prisma.waitlistUsers.create({
      data: {
        email: data.email.trim(),
        name: data.name.trim(),
      },
    });

    return {
      success: true,
      message: "You have been added to the waitlist",
    };
  } catch (err) {
    // @ts-ignore
    console.error(err.stack);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
