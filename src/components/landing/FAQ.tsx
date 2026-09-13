"use client";

import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  { question: "What is Preplytic AI?", answer: "Preplytic AI is an AI-powered career companion that helps you match with jobs, optimize your resume, and prepare for interviews." },
  { question: "Can I customize my resume or cover letter?", answer: "Yes, you can easily customize both your resume and cover letter based on AI suggestions tailored to specific job descriptions." },
  { question: "How does the job matching work?", answer: "Our AI analyzes your skills and experience, comparing them against job requirements to provide a match percentage and highlight areas for improvement." },
  { question: "How accurate are the AI-generated suggestions?", answer: "Our suggestions are powered by advanced language models trained on successful career materials and industry best practices." },
  { question: "Can I use Preplytic AI for free?", answer: "Yes, we offer a free tier with core features. Premium features are available through our subscription plans." },
  { question: "Do you offer mobile support?", answer: "Our platform is fully responsive and works perfectly on mobile devices, tablets, and desktop computers." },
  { question: "Is my data safe and secure?", answer: "We take privacy seriously. Your data is encrypted and we never share your personal information with third parties without your consent." },
  { question: "How do I cancel my subscription?", answer: "You can cancel your subscription at any time from your account settings page." },
  { question: "What file formats are supported?", answer: "We currently support PDF and DOCX formats for resume uploads." },
  { question: "Who can I contact for help?", answer: "You can reach our support team through the Contact Us page or by emailing support@preplytic.ai." }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-zinc-50/50 dark:bg-zinc-950 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-mint-50/50 dark:bg-mint-900/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20 mb-6 font-medium text-sm">
            <HelpCircle className="w-4 h-4" />
            Quick Answers
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            Frequently <span className="text-teal-500">Asked</span> Questions
          </h2>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Find answers to common questions about Preplytic AI — <br className="hidden md:block" />
            from how it works to account and billing details.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={cn(
                "bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden transition-all duration-200",
                openIndex === index 
                  ? "border-teal-200 dark:border-teal-900 shadow-md shadow-teal-900/5" 
                  : "border-zinc-100 dark:border-zinc-800 hover:border-teal-100 dark:hover:border-teal-900/50"
              )}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
              >
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px]">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 text-teal-500 transition-transform duration-200 shrink-0 ml-4",
                    openIndex === index ? "rotate-180" : ""
                  )} 
                />
              </button>
              
              <div 
                className={cn(
                  "px-6 overflow-hidden transition-all duration-200 ease-in-out",
                  openIndex === index ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
