import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/candidate/page.tsx', 'utf8');

const endPart = `        <CandidateDashboardContent profile={profile} jobs={jobs || []} candidateData={candidateData} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}`;

const correctEndPart = `        <CandidateDashboardContent profile={profile} jobs={jobs || []} candidateData={candidateData} />
      </div>
    </PageContainer>
  );
}`;

content = content.replace(endPart, correctEndPart);
fs.writeFileSync('src/app/(app)/candidate/page.tsx', content, 'utf8');
console.log("Fixed JSX closing tags!");