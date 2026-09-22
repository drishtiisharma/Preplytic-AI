"use client";

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuickApplyPage() {
  return (
    <PageContainer>
      <div className="max-w-[1400px] mx-auto space-y-8 pb-10">
        
        {/* Header Skeleton */}
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-[600px] max-w-full" />
        </div>

        {/* Steps Skeleton */}
        <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="flex-1 min-w-[240px] rounded-2xl border-slate-200 shadow-sm p-4 bg-white dark:bg-card flex items-center gap-4 shrink-0">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </Card>
          ))}
        </div>

        {/* Selectors Bar Skeleton */}
        <div className="flex flex-col lg:flex-row items-center gap-6 p-1">
          <div className="flex-1 w-full space-y-2">
            <Skeleton className="h-4 w-32 pl-1" />
            <div className="w-full h-16 rounded-2xl border border-slate-200 bg-white dark:bg-card px-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="w-5 h-5 rounded-md" />
            </div>
          </div>

          <div className="flex-1 w-full space-y-2">
            <Skeleton className="h-4 w-28 pl-1" />
            <div className="w-full h-16 rounded-2xl border border-slate-200 bg-white dark:bg-card px-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="w-5 h-5 rounded-md" />
            </div>
          </div>

          <div className="flex-none w-full lg:w-[220px] pt-6 space-y-2">
            <Skeleton className="w-full h-14 rounded-2xl" />
            <div className="flex justify-center mt-2">
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>

        {/* 4 Cards Grid - ATS Analysis Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col h-[280px]">
              <Skeleton className="h-4 w-32 mb-6" />
              <div className="flex flex-col items-center flex-1 justify-center space-y-4">
                <Skeleton className="w-32 h-32 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="w-full h-10 rounded-lg mt-auto" />
            </Card>
          ))}
        </div>

        {/* Application Method & Output Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
          
          {/* Method Selection (Cold Mail, Referral Message) */}
          <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col h-[400px]">
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="w-5 h-5 rounded-md" />
              <Skeleton className="h-5 w-40" />
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-6 flex-1">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 flex items-start gap-4">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full max-w-[200px]" />
                  </div>
                  <Skeleton className="w-4 h-4 rounded-full self-center" />
                </div>
              ))}
            </div>

            <Skeleton className="w-full h-10 rounded-lg mt-auto" />
          </Card>

          {/* Generated Message/Output Area */}
          <Card className="rounded-2xl border-slate-200 shadow-sm p-6 bg-white dark:bg-card flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="h-5 w-48" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            
            <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-6 space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4 mt-8" />
            </div>
            
            <div className="flex items-center gap-4 mt-6">
              <Skeleton className="flex-1 h-12 rounded-xl" />
              <Skeleton className="flex-1 h-12 rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}