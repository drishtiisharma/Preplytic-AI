"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useJobProfiles, JobProfile } from "@/hooks/useJobProfiles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Edit2,
  Trash2,
  Bookmark,
  Clock,
  Target,
  Search,
  ChevronDown,
  List,
  Grid,
  MoreVertical,
  Link as LinkIcon,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function JobProfilesPage() {
  const { profiles, deleteProfile } = useJobProfiles();
  const [selectedProfile, setSelectedProfile] = useState<JobProfile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!profileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProfile(profileToDelete);
      setProfileToDelete(null);
    } catch (error) {
      console.error("Failed to delete profile", error);
      alert("Failed to delete profile. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  
  return (
    <PageContainer>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Job Profiles</h1>
            <p className="text-muted-foreground text-sm max-w-lg">
              Create and save job profiles from job URLs or descriptions.
              <br />
              Use them for Quick Apply or Interview Preparation.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button className="h-10 bg-teal-500 hover:bg-teal-600 text-white font-medium" nativeButton={false} render={<Link href="/job-profiles/create" />}>

              <><Plus className="w-4 h-4 mr-2" />
                Create Job Profile</>

            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="flex items-center gap-5 p-5 bg-white border border-zinc-100 shadow-sm rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Total Job Profiles</p>
              <h3 className="text-2xl font-bold text-zinc-900 leading-none mb-1">{profiles.length}</h3>
              <p className="text-[11px] text-zinc-500">All saved profiles</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-5 bg-white border border-zinc-100 shadow-sm rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Active Profiles</p>
              <h3 className="text-2xl font-bold text-zinc-900 leading-none mb-1">{profiles.length}</h3>
              <p className="text-[11px] text-teal-600 font-medium">Ready for application</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-5 bg-white border border-zinc-100 shadow-sm rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Recently Added</p>
              <h3 className="text-2xl font-bold text-zinc-900 leading-none mb-1">{profiles.filter(p => new Date((p as any).created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</h3>
              <p className="text-[11px] text-zinc-500">In the last 7 days</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-5 bg-white border border-zinc-100 shadow-sm rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Avg. Match Score</p>
              <h3 className="text-2xl font-bold text-zinc-900 leading-none mb-1">{profiles.length > 0 ? "85%" : "0%"}</h3>
              <p className="text-[11px] text-teal-600 font-medium">Across all profiles</p>
            </div>
          </div>

        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search by job title, company, or keyword..."
              className="pl-9 h-11 bg-white border-zinc-200 w-full"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Button variant="outline" className="h-11 bg-white border-zinc-200 text-zinc-700 justify-between min-w-[130px] font-normal">
              All Status
              <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
            </Button>
            <Button variant="outline" className="h-11 bg-white border-zinc-200 text-zinc-700 justify-between min-w-[130px] font-normal">
              All Roles
              <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
            </Button>
            <Button variant="outline" className="h-11 bg-white border-zinc-200 text-zinc-700 justify-between min-w-[200px] font-normal">
              Sort by: Recently Added
              <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
            </Button>
            <div className="flex items-center gap-1 border border-zinc-200 rounded-lg p-1 bg-white h-11 shrink-0">
              <button className="w-8 h-8 flex items-center justify-center rounded-md bg-teal-50 text-teal-600 border border-teal-100">
                <List className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50">
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50/50 text-zinc-500 border-b border-zinc-100 font-medium">
                <tr>
                  <th className="px-6 py-4 font-medium w-[30%]">Job Profile</th>
                  <th className="px-6 py-4 font-medium w-[25%]">Role</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Match Score</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Added On</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5 ${profile.logoColor}`}>
                          {profile.logoChar}
                        </div>
                        <div onClick={() => setSelectedProfile(profile)}>
                          <div className="font-semibold text-zinc-900 mb-0.5 group-hover:text-teal-600 transition-colors cursor-pointer">{profile.title}</div>
                          <div className="text-zinc-500 text-xs mb-1 cursor-pointer hover:text-teal-600 transition-colors">{profile.company}</div>
                          <div className="text-zinc-400 text-[11px]">{profile.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-medium text-zinc-700 mb-1.5">{profile.role}</div>
                      <Badge variant="secondary" className="bg-teal-50 text-teal-600 hover:bg-teal-100 border-transparent font-medium text-[10px] px-2 py-0 h-5">
                        {profile.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 align-top hidden md:table-cell">
                      <div className="flex flex-col gap-1.5 pt-1 w-[120px]">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-zinc-700">0%</span>
                        </div>
                        <Progress value={0} className="h-1.5 bg-zinc-100 [&>div]:bg-teal-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top hidden sm:table-cell">
                      <div className="pt-1">
                        <div className="text-sm text-zinc-700 mb-0.5">{profile.addedOnDate}</div>
                        <div className="text-xs text-zinc-400">{profile.addedOnRelative}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <div className="pt-0.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-700">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/job-profiles/create?edit=${profile.id}`)}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setProfileToDelete(profile.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-zinc-500">
            Showing 1 to {profiles.length} of {profiles.length} profiles
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-zinc-200 text-zinc-400 hover:text-zinc-700 bg-white" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-teal-500 text-teal-600 bg-teal-50 hover:bg-teal-100">
              1
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-zinc-200 text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-50">
              2
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-zinc-200 text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-50">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

      <Dialog open={!!selectedProfile} onOpenChange={(open) => !open && setSelectedProfile(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedProfile?.title}</DialogTitle>
            <DialogDescription className="text-base font-medium text-teal-600">
              {selectedProfile?.company} • {selectedProfile?.location}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {selectedProfile?.jobDescription ? (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-900 border-b pb-1">Job Description</h4>
                <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">{selectedProfile.jobDescription}</p>
              </div>
            ) : (
              <div className="text-sm text-zinc-500 italic">No job description available for this profile.</div>
            )}

            {(selectedProfile?.requiredSkills || selectedProfile?.preferredSkills) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProfile?.requiredSkills && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-zinc-900 border-b pb-1">Required Skills</h4>
                    <p className="text-sm text-zinc-700 whitespace-pre-wrap">{selectedProfile.requiredSkills}</p>
                  </div>
                )}
                {selectedProfile?.preferredSkills && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-zinc-900 border-b pb-1">Preferred Skills</h4>
                    <p className="text-sm text-zinc-700 whitespace-pre-wrap">{selectedProfile.preferredSkills}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!profileToDelete} onOpenChange={(open) => !open && setProfileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </PageContainer>
  );
}

