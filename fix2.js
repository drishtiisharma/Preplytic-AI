const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

// 1. Add error state
content = content.replace(
  'const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Hard");',
  'const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Hard");\n  const [errors, setErrors] = useState<{ [key: string]: string }>({});'
);

// 2. Add validation logic
content = content.replace(
  '  return (',
    const handleStartInterview = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedJobId) newErrors.job = "Job Profile is required";
    if (!selectedResumeId) newErrors.resume = "Resume is required";
    if (!selectedDuration) newErrors.duration = "Duration is required";
    if (!selectedDifficulty) newErrors.difficulty = "Difficulty is required";
    if (selectedJobTopics.length === 0 && selectedResumeTopics.length === 0) {
      newErrors.topics = "At least one topic (JD or Resume) must be selected";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Validation passed! Starting interview...");
    }
  };

  return (
);

// 3. Add Job Profile Error
content = content.replace(
  'placeholder="Select Job Profile" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      {jobProfiles.map((job: any) => (\n                        <SelectItem key={job.id} value={job.id}>{job.title} at {job.company}</SelectItem>\n                      ))}\n                    </SelectContent>\n                  </Select>\n                </div>',
  'placeholder="Select Job Profile" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      {jobProfiles.map((job: any) => (\n                        <SelectItem key={job.id} value={job.id}>{job.title} at {job.company}</SelectItem>\n                      ))}\n                    </SelectContent>\n                  </Select>\n                  {errors.job && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.job}</p>}\n                </div>'
);

// 4. Add Resume Error
content = content.replace(
  'placeholder="Select Resume" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      {resumes.map((res: any) => (\n                        <SelectItem key={res.id} value={res.id}>{res.file_name}</SelectItem>\n                      ))}\n                    </SelectContent>\n                  </Select>\n                </div>',
  'placeholder="Select Resume" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      {resumes.map((res: any) => (\n                        <SelectItem key={res.id} value={res.id}>{res.file_name}</SelectItem>\n                      ))}\n                    </SelectContent>\n                  </Select>\n                  {errors.resume && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.resume}</p>}\n                </div>'
);

// 5. Add Duration Error
content = content.replace(
  'placeholder="Select Duration" /></div>\n                        </SelectTrigger>\n                        <SelectContent>\n                          <SelectItem value="15 Minutes">15 Minutes</SelectItem>\n                          <SelectItem value="30 Minutes">30 Minutes</SelectItem>\n                          <SelectItem value="45 Minutes">45 Minutes</SelectItem>\n                          <SelectItem value="60 Minutes">60 Minutes</SelectItem>\n                        </SelectContent>\n                      </Select>\n                    </div>',
  'placeholder="Select Duration" /></div>\n                        </SelectTrigger>\n                        <SelectContent>\n                          <SelectItem value="15 Minutes">15 Minutes</SelectItem>\n                          <SelectItem value="30 Minutes">30 Minutes</SelectItem>\n                          <SelectItem value="45 Minutes">45 Minutes</SelectItem>\n                          <SelectItem value="60 Minutes">60 Minutes</SelectItem>\n                        </SelectContent>\n                      </Select>\n                      {errors.duration && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.duration}</p>}\n                    </div>'
);

// 6. Add Difficulty Error
content = content.replace(
  'placeholder="Select Difficulty" /></div>\n                        </SelectTrigger>\n                        <SelectContent>\n                          <SelectItem value="Easy">Easy</SelectItem>\n                          <SelectItem value="Medium">Medium</SelectItem>\n                          <SelectItem value="Hard">Hard</SelectItem>\n                        </SelectContent>\n                      </Select>\n                    </div>',
  'placeholder="Select Difficulty" /></div>\n                        </SelectTrigger>\n                        <SelectContent>\n                          <SelectItem value="Easy">Easy</SelectItem>\n                          <SelectItem value="Medium">Medium</SelectItem>\n                          <SelectItem value="Hard">Hard</SelectItem>\n                        </SelectContent>\n                      </Select>\n                      {errors.difficulty && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.difficulty}</p>}\n                    </div>'
);

// 7. Add Topics Error & onClick to Button
content = content.replace(
  '                      );\n                    })}\n                  </div>\n                </div>\n\n                <Button className="w-full h-12 rounded-xl bg-teal-500 hover:bg-teal-600 text-white shadow-sm font-bold text-[14px] mt-2">\n                  <Play className="w-4 h-4 mr-2 fill-current" />\n                  Start Interview\n                </Button>',
  '                      );\n                    })}\n                  </div>\n                  {errors.topics && <p className="text-red-500 text-[11px] font-medium mt-1">{errors.topics}</p>}\n                </div>\n\n                <Button onClick={handleStartInterview} className="w-full h-12 rounded-xl bg-teal-500 hover:bg-teal-600 text-white shadow-sm font-bold text-[14px] mt-2">\n                  <Play className="w-4 h-4 mr-2 fill-current" />\n                  Start Interview\n                </Button>'
);

fs.writeFileSync('src/app/(app)/interview/page.tsx', content, 'utf8');
console.log("Validation added successfully.");