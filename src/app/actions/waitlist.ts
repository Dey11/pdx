"use server";

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
    console.log("here i am");

    if (!parsedData.success) {
      console.log(parsedData.error);
      return {
        success: false,
        message: "Please fix the errors",
        errors: parsedData.error.flatten().fieldErrors,
        data: data,
      };
    }

    // console.log(parsedData.data);

    return {
      success: true,
      message: "You have been added to the waitlist",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
