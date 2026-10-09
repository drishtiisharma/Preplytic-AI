import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// 1. Add AlertDialog Import
content = content.replace(
  'import { Card } from "@/components/ui/card";',
  'import { Card } from "@/components/ui/card";\nimport { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";'
);

// 2. Add State
content = content.replace(
  'const [isProcessingVoice, setIsProcessingVoice] = useState(false);',
  'const [isProcessingVoice, setIsProcessingVoice] = useState(false);\n  const [isEndInterviewDialogOpen, setIsEndInterviewDialogOpen] = useState<boolean>(false);'
);

// 3. Update the button
const oldButton = `<Button variant="destructive" className="h-10 rounded-xl font-medium shadow-sm">
              <StopCircle className="w-4 h-4 mr-2" />
              End Interview
            </Button>`;
const newButton = `<Button variant="destructive" className="h-10 rounded-xl font-medium shadow-sm" onClick={() => setIsEndInterviewDialogOpen(true)}>
              <StopCircle className="w-4 h-4 mr-2" />
              End Interview
            </Button>`;
content = content.replace(oldButton, newButton);

// 4. Inject Dialog at bottom of PageContainer
const oldEnd = `      </div>
    </PageContainer>
  );
}`;
const newEnd = `        <AlertDialog open={isEndInterviewDialogOpen} onOpenChange={setIsEndInterviewDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to end this interview?</AlertDialogTitle>
              <AlertDialogDescription>
                Your progress so far will be saved and you will be taken to the interview report page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsEndInterviewDialogOpen(false)}>Continue Interview</AlertDialogCancel>
              <AlertDialogAction onClick={completeInterview} className="bg-red-500 hover:bg-red-600">End Interview</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageContainer>
  );
}`;
content = content.replace(oldEnd, newEnd);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Added End Interview Dialog flow!");