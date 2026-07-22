import { headers } from "next/headers";
import { NextRequest } from "next/server";

import { Webhook } from "standardwebhooks";

import { products } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { WebhookPayload } from "@/lib/types/payment";

// Dodo Payments webhook receiver. Uses the standardwebhooks spec: the signature
// is computed over the raw request body plus the "webhook-id",
// "webhook-signature" and "webhook-timestamp" headers, and verify() throws
// (=> 400) on any mismatch, so the body must be read as raw text BEFORE JSON
// parsing. Only non-subscription one-time "Payment" events are handled here
// (subscription_id must be absent); everything else is acknowledged and
// ignored.
const getWebhook = () => {
  if (!process.env.WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET is required");
  }

  return new Webhook(process.env.WEBHOOK_SECRET);
};

export async function POST(request: NextRequest) {
  const headersList = await headers();

  try {
    const rawBody = await request.text();

    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };

    await getWebhook().verify(rawBody, webhookHeaders);

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

  // Idempotency: webhooks can be redelivered, so we key on payment_id.
  // Find-then-update-or-create — if a transaction already exists we only update
  // its status (crediting the user once it reaches "succeeded"); otherwise we
  // create the transaction record. Credits are incremented only on "succeeded".
  const findTransaction = await prisma.transaction.findFirst({
    where: { paymentId: payload.data.payment_id },
  });

  if (findTransaction) {
    await prisma.transaction.update({
      where: { id: findTransaction.id },
      data: { status: payload.data.status! },
    });

    if (payload.data.status === "succeeded") {
      const product = products.filter(
        (prod) => prod.id === payload.data.product_cart![0].product_id
      )[0];
      await prisma.user.update({
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

  await prisma.transaction.create({
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
    await prisma.user.update({
      where: { id: userInDb?.id },
      data: {
        credits: {
          increment: product.credits,
        },
      },
    });
  }
};
