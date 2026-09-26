const fs = require('fs');

// 1. Update ResumeUploader.tsx
let uploaderPath = 'src/components/candidate/ResumeUploader.tsx';
let uploaderContent = fs.readFileSync(uploaderPath, 'utf8');

if (!uploaderContent.includes('onParseSuccess?:')) {
    uploaderContent = uploaderContent.replace('existingStoragePath?: string | null;', 'existingStoragePath?: string | null;\n  onParseSuccess?: (parsedData: any, storagePath: string) => void;');
    uploaderContent = uploaderContent.replace('}: ResumeUploaderProps) {', ', onParseSuccess }: ResumeUploaderProps) {');
    
    const saveBlock = `            // Save parsed data to DB
            const saveRes = await saveParsedResumeData(parseData.data, storagePath);
            if (!saveRes.success) {
              console.error("Failed to save parsed data:", saveRes.error);
            } else {
              router.refresh();
              alert("Resume uploaded and parsed successfully!");
            }`;
            
    const newSaveBlock = `            if (onParseSuccess) {
              onParseSuccess(parseData.data, storagePath);
            } else {
              // Save parsed data to DB
              const saveRes = await saveParsedResumeData(parseData.data, storagePath);
              if (!saveRes.success) {
                console.error("Failed to save parsed data:", saveRes.error);
              } else {
                router.refresh();
                alert("Resume uploaded and parsed successfully!");
              }
            }`;
    uploaderContent = uploaderContent.replace(saveBlock, newSaveBlock);
    fs.writeFileSync(uploaderPath, uploaderContent, 'utf8');
    console.log("Updated ResumeUploader.tsx");
}

// 2. Update EditProfileDialog.tsx
let dialogPath = 'src/components/candidate/EditProfileDialog.tsx';
let dialogContent = fs.readFileSync(dialogPath, 'utf8');

if (!dialogContent.includes('trigger?: React.ReactNode;')) {
    dialogContent = dialogContent.replace('profile: CandidateProfile | null;', 'profile: CandidateProfile | null;\n  trigger?: React.ReactNode;\n  open?: boolean;\n  onOpenChange?: (open: boolean) => void;\n  onSaveSuccess?: () => void;');
    dialogContent = dialogContent.replace('export function EditProfileDialog({ profile }: EditProfileDialogProps) {', 'export function EditProfileDialog({ profile, trigger, open, onOpenChange, onSaveSuccess }: EditProfileDialogProps) {');
    
    dialogContent = dialogContent.replace('const [isOpen, setIsOpen] = useState(false);', 'const [internalIsOpen, setInternalIsOpen] = useState(false);\n  const isOpen = open !== undefined ? open : internalIsOpen;\n  const setIsOpen = onOpenChange || setInternalIsOpen;');
    
    // Also we need to sync formData if profile prop changes (e.g. from parsed data)
    const formDataInit = `  // Form state initialized with existing profile values
  const [formData, setFormData] = useState({`;
    const formDataNew = `  // Sync when profile changes
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        current_role: profile.current_role || "",
        summary: profile.summary || "",
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        certifications: profile.certifications || [],
      });
      setSkillsInput(profile.skills?.map((s: any) => typeof s === 'string' ? s : s?.name || '').join(", ") || "");
    }
  }, [profile]);

  // Form state initialized with existing profile values
  const [formData, setFormData] = useState({`;
    dialogContent = dialogContent.replace(formDataInit, formDataNew);
    
    const triggerOld = `<DialogTrigger render={<Button className="h-10 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-sm"><Edit className="w-4 h-4 mr-2" />Edit Profile</Button>} />`;
    const triggerNew = `        {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : <DialogTrigger asChild><Button className="h-10 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-sm"><Edit className="w-4 h-4 mr-2" />Edit Profile</Button></DialogTrigger>}`;
    dialogContent = dialogContent.replace(triggerOld, triggerNew);
    
    dialogContent = dialogContent.replace('setIsOpen(false);', 'setIsOpen(false);\n        if (onSaveSuccess) onSaveSuccess();');
    
    fs.writeFileSync(dialogPath, dialogContent, 'utf8');
    console.log("Updated EditProfileDialog.tsx");
}
