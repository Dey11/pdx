import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// import { ratelimit } from "@/lib/rate-limit";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ credits: user.credits });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const { success } = await ratelimit.limit(session.user.id!);

    // if (!success) {
    //   return NextResponse.json({ error: "Rate Limited", status: 429 });
    // }

    const body = await req.json();
    const code = body.code.toUpperCase();

    const findCoupon = await prisma.couponCode.findUnique({
      where: {
        code,
      },
    });

    if (!findCoupon) {
      return NextResponse.json({ error: "Invalid Coupon Code", credits: 0 });
    }

    if (
      findCoupon.currentRedemptions < findCoupon.maxRedemptions &&
      findCoupon.isActive
    ) {
      const isCouponValid = await isCouponRedeemable(
        findCoupon.id,
        session.user.id!
      );
      const currDate = new Date();

      if (findCoupon.expiresAt) {
        if (findCoupon.expiresAt > currDate) {
          if (isCouponValid) {
            await prisma.user.update({
              where: { id: session.user.id },
              data: { credits: { increment: findCoupon.credits } },
            });
            return NextResponse.json({ credits: findCoupon.credits });
          } else {
            return NextResponse.json({
              error: "Invalid Coupon Code",
              credits: 0,
            });
          }
        } else {
          return NextResponse.json({
            error: "Coupon Code Expired",
            credits: 0,
          });
        }
      } else {
        if (isCouponValid) {
          await prisma.user.update({
            where: { id: session.user.id },
            data: { credits: { increment: findCoupon.credits } },
          });
          return NextResponse.json({ credits: findCoupon.credits });
        } else {
          return NextResponse.json({
            error: "Invalid Coupon Code",
            credits: 0,
          });
        }
      }
    }

    return NextResponse.json({ credits: 0 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const isCouponRedeemable = async (couponId: string, id: string) => {
  const findIfUserAlreadyUsed = await prisma.couponRedemption.findFirst({
    where: { userId: id, couponId: couponId },
  });

  if (findIfUserAlreadyUsed) {
    return false;
  }

  await prisma.couponRedemption.create({
    data: { userId: id, couponId: couponId },
  });
  await prisma.couponCode.update({
    where: { id: couponId },
    data: { currentRedemptions: { increment: 1 } },
  });

  return true;
};
