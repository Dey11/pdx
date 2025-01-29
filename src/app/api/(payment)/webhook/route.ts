import { headers } from "next/headers";
import { NextRequest } from "next/server";

import { Webhook } from "standardwebhooks";

import { products } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { WebhookPayload } from "@/lib/types/payment";

const webhook = new Webhook(process.env.WEBHOOK_SECRET!);

export async function POST(request: NextRequest) {
  const headersList = await headers();

  try {
    const rawBody = await request.text();

    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };

    await webhook.verify(rawBody, webhookHeaders);

    const payload = JSON.parse(rawBody) as WebhookPayload;

    if (!payload.data?.customer?.email) {
      throw new Error("Missing customer email in payload");
    }
    const email = payload.data.customer.email;

    if (
      payload.data.payload_type === "Payment" &&
      !payload.data.subscription_id
    ) {
      await handleOneTimePayment(email, payload);
    }

    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing failed", error);
    return Response.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}

const handleOneTimePayment = async (email: string, payload: WebhookPayload) => {
  const userInDb = await prisma.user.findUnique({ where: { email } });

  const findTransaction = await prisma.transaction.findFirst({
    where: { paymentId: payload.data.payment_id },
  });

  if (findTransaction) {
    const updateTransaction = await prisma.transaction.update({
      where: { id: findTransaction.id },
      data: { status: payload.data.status! },
    });

    if (payload.data.status === "succeeded") {
      const product = products.filter(
        (prod) => prod.id === payload.data.product_cart![0].product_id
      )[0];
      const updateUser = await prisma.user.update({
        where: { id: userInDb?.id },
        data: {
          credits: {
            increment: product.credits,
          },
        },
      });
    }

    return;
  }

  const createTransaction = await prisma.transaction.create({
    data: {
      userId: userInDb?.id,
      dodoCustomerId: payload.data.customer.customer_id,
      type: "credits",
      status: payload.data.status!,
      amount: payload.data.total_amount / 100,
      tax: payload.data.tax! / 100,
      paymentId: payload.data.payment_id,
      currency: payload.data.currency,
      paymentLink: payload.data.payment_link,
      productId: payload.data.product_cart![0].product_id,
      quantity: 1,
    },
  });

  if (payload.data.status === "succeeded") {
    const product = products.filter(
      (prod) => prod.id === payload.data.product_cart![0].product_id
    )[0];
    const updateUser = await prisma.user.update({
      where: { id: userInDb?.id },
      data: {
        credits: {
          increment: product.credits,
        },
      },
    });
  }
};
