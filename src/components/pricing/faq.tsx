"use client";

import { useState } from "react";

import { H2 } from "../typography/h2";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards and UPI.",
    },
    // {
    //   question: "Can I switch plans later?",
    //   answer: "Yes, you can upgrade or downgrade your plan at any time.",
    // },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a trial plan - it is default and you get it automatically. You get 50 credits to start with.",
    },
    // {
    //   question: "How do I cancel my subscription?",
    //   answer: "You can cancel anytime from your account settings.",
    // },
    {
      question: "Do you not have any subscription models?",
      answer:
        "As of now we don't since we thought a one time model would be more suitable. But we are open to suggestions.",
    },
    {
      question: "Are the pricing models inclusive of tax?",
      answer:
        "No, the pricing models are exclusive of tax. You will be charged tax as per your region.",
    },
    {
      question: "I paid for credits but I don't see them in my account?",
      answer:
        "We update the transactions as soon as we receive confirmation from the payment gateway. If you have an email from Dodo Payments confirming your purchase and yet do not see the benefits in your account in 30 minutes to 1 hour, please contact us at support@usepdx.tech. We will make it our priority to help you asap.",
    },
    // {
    //   question: "What does unlimited credits mean?",
    //   answer:
    //     "Unlimited credits mean you can use our services as much as you want without any restrictions. Note that we reserve the right to limit usage in case of abuse.",
    // },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <H2 className="mb-8 text-center text-3xl font-bold">
        Frequently Asked Questions
      </H2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-gradient-to-r from-black to-[#2C3133] p-4"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="font-medium">{faq.question}</span>
              <span className="ml-4 transform text-brand-green transition-transform duration-200">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="mt-2 text-left text-sm text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
