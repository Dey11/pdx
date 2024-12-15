import { headers } from "next/headers";

import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { z } from "zod";

import db from "@/services/db";

const newUserObj = z.object({
  id: z.string(),
  name: z.string().optional(),
  username: z.string().min(0).optional(),
  email: z.string().email(),
  createdAt: z.coerce.date(),
});

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;

  // console.log(payload.data);
  const userObj = {
    id: payload.data.id,
    name: payload.data.first_name + " " + payload.data.last_name || "",
    username: payload.data.username || "",
    email: payload.data.email_addresses[0].email_address,
    createdAt: payload.data.created_at,
  };

  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  // console.log("Webhook payload:", body);

  if (evt.type === "user.created") {
    const res = newUserObj.safeParse(userObj);
    if (res.success) {
      const newUserCreated = await db.createUser(res.data);
    }
    console.log("userId:", evt.data.id);
  }

  return new Response("Webhook received", { status: 200 });
}
