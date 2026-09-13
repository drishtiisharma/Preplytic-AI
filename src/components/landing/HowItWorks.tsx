"use client";

import { Sparkles, Link as LinkIcon, FileText, Brain, MessageSquare, Target, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: LinkIcon,
    title: "Add Job",
    description: "Paste a job URL or upload a job description. We extract key details and create a structured job profile."
  },
  {
    icon: FileText,
    title: "Upload Your Resume",
    description: "Add your resume (PDF/DOCX) and we parse your skills, experience and achievements."
  },
  {
    icon: Brain,
    title: "AI Analysis & Matching",
    description: "Our AI compares your profile with the job, finds matches, identifies gaps and suggests improvements."
  },
  {
    icon: MessageSquare,
    title: "Get Help & Prep",
    description: "Generate optimized resume, get cold emails & referral messages, and practice interview questions with our AI assistant."
  },
  {
    icon: Target,
    title: "Take Action",
    description: "Follow your personalized roadmap, stay consistent, and get closer to your dream job."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-black relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-teal-50/50 dark:bg-teal-900/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20 mb-6 font-medium text-sm">
            <Sparkles className="w-4 h-4" />
            Simple Steps, Big Impact
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            How <span className="text-teal-500">Preplytic AI</span> Works
          </h2>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Get from job link or description to a complete readiness plan — <br className="hidden md:block" />
            in just a few simple steps.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 items-stretch lg:items-center justify-between mt-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-center flex-1 relative group">
              <div className="bg-white dark:bg-zinc-900 border border-teal-100 dark:border-teal-900/50 rounded-2xl p-6 md:p-8 flex-1 w-full text-center hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 relative z-10 flex flex-col items-center">
                
                {/* Step Number Badge */}
                <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                
                <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">{step.title}</h3>
                
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center px-2 text-teal-200 dark:text-teal-900 z-0">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
