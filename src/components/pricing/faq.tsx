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
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a trial plan - it is default and you get it automatically.",
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel anytime from your account settings.",
    },
    {
      question: "What does unlimited credits mean?",
      answer:
        "Unlimited credits mean you can use our services as much as you want without any restrictions. Note that we reserve the right to limit usage in case of abuse.",
    },
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
