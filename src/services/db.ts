import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

import { NewUser } from "./db.types";

type Success<T> = {
  success: true;
  message: string;
  payload?: T;
};

type Failure = {
  success: false;
  message: string;
};

type Response<T> = Success<T> | Failure;

class DbService {
  private prisma;

  constructor() {
    this.prisma = new PrismaClient().$extends(withAccelerate());
  }

  async createUser({
    id,
    name,
    username,
    email,
    createdAt,
  }: NewUser): Promise<Response<null>> {
    try {
      const user = await this.prisma.user.create({
        data: {
          id,
          name,
          username,
          email,
          createdAt,
        },
      });

      return {
        success: true,
        message: "User created successfully",
      };
    } catch (err) {
      return this.error(err);
    }
  }

  error(error: unknown): Failure {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Error
    ) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

const db = new DbService();

export default db;
