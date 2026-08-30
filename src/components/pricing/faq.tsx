"use client";

import { useState } from "react";

import { H2 } from "../typography/h2";

const faqs = [
  {
    question: "Do I need to buy a PDX plan?",
    answer:
      "No. PDX is free to use, and the previous purchase options are disabled.",
  },
  {
    question: "What does BYOK mean?",
    answer:
      "Bring your own key. Connect an API key from a supported OpenAI-compatible provider in Settings before generating material.",
  },
  {
    question: "Who charges me for model usage?",
    answer:
      "Your selected AI provider may charge you directly under its own pricing and usage limits. PDX does not add a fee.",
  },
  {
    question: "How does PDX store my API key?",
    answer:
      "PDX encrypts your provider key before storing it and never includes it in generation jobs or generated documents.",
  },
] as const;

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <H2 className="mb-8 text-center text-3xl font-bold">
        Frequently Asked Questions
      </H2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={faq.question}
            className="rounded-2xl border bg-gradient-to-r from-black to-[#2C3133] p-4"
          >
            <button
              aria-expanded={openIndex === index}
              className="flex w-full items-center justify-between text-left"
              onClick={() => toggleAccordion(index)}
              type="button"
            >
              <span className="font-medium">{faq.question}</span>
              <span className="text-brand-yellow ml-4 transform transition-transform duration-200">
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
