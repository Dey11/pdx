import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { products } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login and try again." },
        { status: 401 }
      );
    }

    const { productId } = await params;
    const staticPaymentLink = (process.env.STATIC_PAYMENT_LINK as string)
      .replace(
        "productId",
        products.filter((product) => product.name === productId)[0].id
      )
      .replace("userEmail", session.user.email!);

    return NextResponse.json({ url: staticPaymentLink });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
