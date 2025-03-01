import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import { H1 } from "@/components/typography/h1";
import { Para } from "@/components/typography/para";
import { EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy policy | Pdx",
  description: "Under our privacy policy",
};

const page = () => {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4">
      <div className="mx-auto mt-[15dvh] h-[2px] w-32 rounded-md bg-brand-yellow" />

      <H1 className="pt-5 text-center text-brand-heading lg:text-5xl">
        Privacy Policy
      </H1>
      <Para className="text-center text-xs">
        Learn how PDX collects, uses, and protects your personal information
      </Para>

      <main className="py-16">
        <Para className="font-medium text-brand-blue underline underline-offset-2">
          UPDATED DECEMBER 25, 2024
        </Para>

        <Para className="mt-6">
          At PDX ("we," "our," "us"), we value your privacy and are committed to
          protecting your personal information. This Privacy Policy ("Policy")
          explains how we collect, use, disclose, and protect information
          obtained through your use of our platform, products, and services
          (collectively, the "Services"). By accessing or using our Services,
          you consent to the practices described in this Policy.
        </Para>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              1. Information We Collect
            </h2>
            <Para className="mb-3">
              We collect the following types of information:
            </Para>
            <h3 className="mb-2 font-medium">a. Personal Information</h3>
            <Para className="mb-2">
              Information you provide directly to us, such as:
            </Para>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>Name</li>
              <li>Email address</li>
              <li>
                Payment information (e.g., billing address, transaction details)
              </li>
              <li>Account credentials (e.g., username, password)</li>
            </ul>

            <h3 className="mb-2 font-medium">b. Usage Data</h3>
            <Para className="mb-2">
              Automatically collected information, including:
            </Para>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                Device information (e.g., IP address, browser type, operating
                system)
              </li>
              <li>
                Usage patterns (e.g., pages visited, time spent on the platform)
              </li>
              <li>Log data (e.g., timestamps, access errors)</li>
            </ul>

            <h3 className="mb-2 font-medium">c. Uploaded Content</h3>
            <Para>
              Any files, syllabi, or modules you upload to our platform.
            </Para>

            <h3 className="mb-2 mt-3 font-medium">
              d. Community Marketplace Data
            </h3>
            <Para>
              Information related to content shared, sold, or purchased through
              the marketplace, including sales earnings and pricing data.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              2. How We Use Your Information
            </h2>
            <Para className="mb-3">We use the collected information to:</Para>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>Provide, operate, and improve our Services</li>
              <li>Process transactions and manage accounts</li>
              <li>Personalize user experiences and recommendations</li>
              <li>
                Communicate updates, promotions, or customer support responses
              </li>
              <li>
                Enforce our Terms of Use and prevent fraudulent activities
              </li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              3. Sharing Your Information
            </h2>
            <Para className="mb-3">
              We do not sell or rent your personal information to third parties.
              However, we may share information with:
            </Para>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                Service Providers: Third-party vendors who assist in payment
                processing, cloud storage, or analytics
              </li>
              <li>
                Legal Authorities: When required by law, subpoena, or to protect
                our legal rights
              </li>
              <li>
                Community Marketplace Users: Limited profile information may be
                visible to other users for transactions
              </li>
              <li>
                Business Transfers: In the event of a merger, acquisition, or
                sale of assets
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">4. Data Retention</h2>
            <Para>
              We retain your information for as long as necessary to provide our
              Services, comply with legal obligations, resolve disputes, and
              enforce agreements. Upon account closure, we may retain certain
              data for legal or legitimate business purposes.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">5. Your Rights</h2>
            <Para className="mb-3">
              Depending on your jurisdiction, you may have the following rights:
            </Para>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>
                Access and Correction: Request access to or correction of your
                personal data
              </li>
              <li>
                Data Portability: Obtain a copy of your information in a
                portable format
              </li>
              <li>Deletion: Request the deletion of your data</li>
              <li>
                Objection and Restriction: Object to or restrict certain data
                processing activities
              </li>
              <li>Withdrawal of Consent: Revoke previously granted consent</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">6. Security Measures</h2>
            <Para className="mb-3">
              We implement industry-standard security measures to protect your
              information, including:
            </Para>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>Data encryption (in transit and at rest)</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Regular security audits and vulnerability assessments</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              7. Cookies and Tracking Technologies
            </h2>
            <Para className="mb-3">
              We use cookies and similar technologies to enhance your
              experience, including:
            </Para>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>Essential Cookies: Necessary for platform functionality</li>
              <li>
                Analytical Cookies: To understand user behavior and improve
                Services
              </li>
            </ul>
            <Para>
              You can manage cookie preferences through your browser settings.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              8. Children's Privacy
            </h2>
            <Para>
              Our Services are not intended for individuals under the age of 13.
              We do not knowingly collect personal information from children. If
              we become aware of such data collection, we will delete it
              promptly.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">9. Third-Party Links</h2>
            <Para>
              Our platform may contain links to third-party websites or
              services. PDX is not responsible for the privacy practices, data
              collection, or content of these third-party services. We encourage
              users to review the privacy policies of any external websites they
              engage with to understand how their data may be collected and
              used.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              10. International Data Transfers
            </h2>
            <Para>
              Your information may be transferred to and processed in countries
              outside your own, where data protection laws may differ. To ensure
              compliance with data protection regulations such as GDPR, we use
              mechanisms like Standard Contractual Clauses (SCCs) or rely on
              adequacy decisions approved by the European Commission for such
              transfers. By using our Services, you consent to such transfers.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              11. Changes to This Policy
            </h2>
            <Para>
              We reserve the right to update this Policy at any time. In the
              event of significant changes, we will notify users via email or
              prominently announce the updates on our platform. Users are
              encouraged to periodically review this Policy to stay informed
              about how we protect their data. Changes will be effective upon
              posting, and the "Last Updated" date will reflect the latest
              revision. Continued use of our Services constitutes acceptance of
              the updated Policy.
            </Para>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">12. Contact Us</h2>
            <Para>
              If you have questions or concerns about this Privacy Policy,
              please contact us at:{" "}
              <span className="text-brand-yellow">{EMAIL}</span>
            </Para>
          </section>

          <Para className="mt-8 font-medium">
            By using PDX, you acknowledge that you have read, understood, and
            agreed to this Privacy Policy.
          </Para>
        </div>
      </main>
    </div>
  );
};

export default page;
