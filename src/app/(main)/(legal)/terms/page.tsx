import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import { H1 } from "@/components/typography/h1";
import { Para } from "@/components/typography/para";

export const metadata: Metadata = {
  title: "Terms of use | Pdx",
  description: "Under our terms of use",
};

const page = () => {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4">
      <div className="mx-auto mt-[15dvh] h-[2px] w-32 rounded-md bg-brand-green" />

      <H1 className="pt-2 text-center lg:text-5xl">Terms of Use</H1>
      <Para className="text-center text-xs">
        Learn more about how PDX collects and uses data and your rights as a PDX
        user
      </Para>

      <main className="pb-16 pt-10">
        <Para className="font-medium underline">UPDATED DECEMBER 31, 2024</Para>

        <Para className="mt-6">
          Welcome to PDX ("we," "our," or "us"). By accessing or using our
          platform, services, or products (collectively, the "Services"), you
          ("User," "you," or "your") agree to comply with and be bound by these
          Terms of Use ("Terms"). Please read these Terms carefully before using
          PDX. If you do not agree with these Terms, you must not use our
          Services.
        </Para>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              1. Acceptance of Terms
            </h2>
            <Para>
              By creating an account, accessing, or using our Services, you
              agree to these Terms, our Privacy Policy, and any other policies
              or guidelines we provide.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">2. Services Provided</h2>
            <Para className="mb-3">PDX offers tools to:</Para>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>Parse syllabi and generate study materials</li>
              <li>Create downloadable PDFs</li>
              <li>
                Provide access to a community marketplace for uploading and
                purchasing modules
              </li>
              <li>Enable cost-sharing features for collaborative purchases</li>
            </ul>
            <Para>
              While PDX strives to provide accurate and high-quality tools, we
              do not guarantee the accuracy, reliability, or completeness of
              syllabus parsing and study material generation. Users acknowledge
              that the generated content is intended for supplementary use and
              should be independently verified for academic purposes.
            </Para>
            <Para className="mt-3">
              The Services are subject to updates, and we reserve the right to
              modify or discontinue any aspect of our Services without prior
              notice.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">3. Eligibility</h2>
            <Para>
              You must be at least 13 years old to use PDX. By accessing our
              Services, you represent that you are of legal age and have the
              capacity to enter into a binding agreement.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              4. Account Responsibilities
            </h2>
            <div className="space-y-3">
              <p>
                You must provide accurate and complete information when creating
                an account. Providing false or misleading information may result
                in the suspension or termination of your account, and PDX
                reserves the right to pursue legal action if deemed necessary.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </p>
              <p>
                You agree to notify us immediately of any unauthorized access or
                use of your account.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              5. Usage Rights and Restrictions
            </h2>
            <div className="space-y-3">
              <p>
                Permitted Use: You may use the Services for personal or academic
                purposes only.
              </p>
              <p>Prohibited Use: You must not:</p>
              <ul className="mb-3 list-disc space-y-2 pl-6">
                <li>Use the Services for illegal activities.</li>
                <li>
                  Upload or share copyrighted, harmful, or misleading content.
                </li>
                <li>
                  Attempt to reverse-engineer, exploit, or interfere with our
                  platform.
                </li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that
                violate these Terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              6. Community Contributions
            </h2>
            <div className="space-y-3">
              <p>
                When uploading modules to the PDX community marketplace, you
                retain ownership of your content but grant PDX a non-exclusive,
                royalty-free, worldwide license to distribute, display, and sell
                the content. This license remains in effect for as long as the
                content is available on the marketplace or until you remove it.
              </p>
              <p>
                PDX reserves the right to review, modify, or remove content that
                violates our guidelines. Earnings from module sales will be
                shared according to the pricing plan under which the user
                operates.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              7. Payments and Refunds
            </h2>
            <div className="space-y-3">
              <p>
                Free Plan: Access is provided with limited features at no cost.
              </p>
              <p>
                Paid Plans: Payment is required to access Pro Learner and Elite
                Scholar plans. Details of benefits are available on our website.
              </p>
              <p>
                Refunds: Payments are non-refundable unless otherwise required
                by law or explicitly stated in a promotional offer. Refunds may
                only be considered in exceptional scenarios such as duplicate
                payments or billing errors, at the sole discretion of PDX. Users
                must provide documented evidence to support their claim within
                14 days of the transaction.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              8. Intellectual Property
            </h2>
            <div className="space-y-3">
              <p>
                All materials generated by PDX, including study guides and PDFs,
                are provided for personal use only. Redistribution or resale of
                generated content is prohibited.
              </p>
              <p>
                PDX retains all rights to its software, branding, and
                proprietary algorithms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              9. Liability Disclaimer
            </h2>
            <div className="space-y-3">
              <p>
                PDX provides study materials and resources as-is. While we
                strive to ensure accuracy and quality, we make no guarantees
                regarding the completeness, reliability, or suitability of the
                generated content.
              </p>
              <p>
                To the maximum extent permitted by law, PDX's liability for any
                claims, damages, or losses arising from your use of our Services
                is limited to the amount you have paid to PDX, if any, in the 12
                months preceding the claim.
              </p>
              <p>PDX is not liable for:</p>
              <ul className="mb-3 list-disc space-y-2 pl-6">
                <li>Errors or inaccuracies in study materials.</li>
                <li>Any damages resulting from the use of our Services.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">10. Privacy</h2>
            <Para>
              Your privacy is important to us. Please review our{" "}
              <Link href="/policy">Privacy Policy</Link>
              to understand how we collect, use, and protect your personal
              information.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              11. Modifications to Terms
            </h2>
            <Para>
              We reserve the right to update these Terms at any time. Changes
              will be effective upon posting. Your continued use of the Services
              after changes are posted constitutes acceptance of the revised
              Terms.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">12. Termination</h2>
            <Para>
              We may suspend or terminate your account if you violate these
              Terms or engage in conduct that disrupts the platform or infringes
              upon others' rights. Termination does not relieve you of
              obligations incurred under these Terms.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">13. Governing Law</h2>
            <Para>
              These Terms are governed by and construed in accordance with the
              laws of [Your Country/Region], without regard to conflict of law
              principles.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">14. Contact Us</h2>
            <Para>
              If you have questions or concerns about these Terms, please
              contact us at support-pdx@gmail.com.
            </Para>
          </section>

          <Para className="mt-8 font-medium">
            By using PDX, you acknowledge that you have read, understood, and
            agreed to these Terms of Use.
          </Para>
        </div>
      </main>
    </div>
  );
};

export default page;
