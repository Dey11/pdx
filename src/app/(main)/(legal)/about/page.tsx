import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import { H1 } from "@/components/typography/h1";
import { Para } from "@/components/typography/para";
import { EMAIL, INSTAGRAM, TWITTER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About | Pdx",
  description: "Learn more about PDX and our mission",
};

const page = () => {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4">
      <div className="mx-auto mt-[15dvh] h-[2px] w-32 rounded-md bg-brand-green" />

      <H1 className="pt-5 text-center lg:text-5xl">About PDX</H1>
      <Para className="text-center text-xs">
        Learn more about our mission and what drives us
      </Para>

      <main className="py-16">
        <Para className="font-medium underline">UPDATED DECEMBER 31, 2024</Para>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="mb-3 text-xl font-semibold">Who We Are</h2>
            <Para>
              At PDX, we believe in empowering students by transforming how they
              learn. Tackling vast syllabi and creating study materials is
              overwhelming, and that's where we come in. Our AI-driven platform
              generates well-structured, in-depth study guides tailored to your
              syllabus—saving time and boosting learning efficiency.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">Our Mission</h2>
            <Para>
              We aim to make high-quality education accessible and hassle-free.
              By combining cutting-edge AI technology with a deep understanding
              of student needs, we deliver comprehensive study resources in just
              a few clicks.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">What We Offer</h2>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                Custom Study Guides: Upload your syllabus, and let our AI
                generate detailed PDFs, ready for download.
              </li>
              <li>
                Flexible Pricing: Affordable credit-based system—pay only for
                what you need.
              </li>
              <li>
                Collaborative Learning: Share credits and materials with friends
                and learn together.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">Why Choose Us?</h2>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                Time-efficient: No more wasting hours gathering materials.
              </li>
              <li>
                Cost-effective: High-quality resources at student-friendly
                prices.
              </li>
              <li>Innovative: Harnessing AI to revolutionize learning.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">Get in Touch</h2>
            <Para className="mb-3">
              Have questions, feedback, or ideas? We'd love to hear from you.
            </Para>
            <div className="space-y-2">
              <Para>
                📧 Email: <span className="text-brand-green">{EMAIL}</span>
              </Para>
              <Para>
                Instagram:{" "}
                <Link
                  href={INSTAGRAM}
                  className="text-brand-green hover:underline"
                  target="_blank"
                >
                  @pdxstudios
                </Link>
              </Para>
              <Para>
                Twitter:{" "}
                <Link
                  href={TWITTER}
                  className="text-brand-green hover:underline"
                  target="_blank"
                >
                  @pdxstudios
                </Link>
              </Para>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default page;
