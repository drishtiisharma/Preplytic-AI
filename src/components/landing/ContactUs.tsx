"use client";

import { Mail, MapPin, Clock, Send, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactUs() {
  return (
    <section id="contact" className="py-24 bg-white dark:bg-black relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-teal-50/50 dark:bg-teal-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20 mb-6 font-medium text-sm">
            <MessageSquare className="w-4 h-4" />
            Get In Touch
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            We'd Love to <span className="text-teal-500">Hear From You</span>
          </h2>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Have a question, suggestion, or need support? Fill out the form and <br className="hidden md:block" />
            we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-8 border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Contact Information</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">You can also reach us through the following channels:</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">Email</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">support@preplytic.ai</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">Location</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Indore, Madhya Pradesh, India</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">Support Hours</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Mon - Fri, 9:00 AM - 6:00 PM (IST)</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-teal-900/5">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Send Us a Message</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <Input placeholder="Your Name" className="pl-10 h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-zinc-400" />
                    </div>
                    <Input type="email" placeholder="Your Email" className="pl-10 h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-zinc-400" />
                  </div>
                  <Input placeholder="Subject" className="pl-10 h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-zinc-400" />
                  </div>
                  <Textarea placeholder="Your Message..." className="pl-10 min-h-[150px] resize-none bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 pt-3" />
                </div>
              </div>
              
              <Button type="button" className="w-full md:w-auto h-12 px-8 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 mt-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
