"""
Constants and configuration values for the Resume Standardizer.
Contains prompt templates, API settings, and constants.
"""

# Gemini API Configuration
GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_TEMPERATURE = 0.3

# File Configuration
SUPPORTED_FORMATS = {"pdf", "docx", "pptx", "doc"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB

# Resume Extract Prompt Template
RESUME_PROMPT = """
<objective>
Parse a text-formatted resume efficiently and extract diverse candidate's data into a structured JSON format.
</objective>

<input>
The following text is the candidate's resume in plain text format:
{resume_text}
</input>

<instructions>
## Follow these steps to extract and structure the resume information:

1. Analyze Structure:
- Examine the text-formatted resume to identify key sections (e.g., personal information, education, experience, skills, certifications).
- Note any unique formatting or organization within the resume.

2. Extract Information:
- Systematically parse each section, extracting relevant details.
- Pay attention to dates, titles, organizations, and descriptions.

3. Handle Variations:
- Account for different resume styles, formats, and section orders.
- Adapt the extraction process to accurately capture data from various layouts.

4. Optimize Output:
- Handle missing or incomplete information appropriately (use empty arrays/objects as needed).
- Standardize date formats, if applicable.
- have all the keys of JSON in titlecase.
- if there is more than one word in a key, convert them into camelCase.
- make professionalSummary as String.
- make professionalExperience as List of String and each String should be within 15 to 20 words. example "professionalExperience": [
"Delivered Finacle core customizations to prevent and monitor fraudulent transactions and anti-money laundering activities, integrating Finacle with Clari5 application.",
"Developed and implemented a pricing module in Finacle Core for a Tanzanian bank, decommissioning their legacy TBMS application for charge collection.",
"Customized CRM functionalities, coordinating client interaction and supporting UAT testing and production deployment for a Mauritian bank.",
"Worked in Agile methodology, developing PL/SQL packages, procedures, and functions for various backend programs, enhancing existing customizations and optimizing queries for Deutsche Bank.",
"Developed custom menus, batch jobs, and product customizations using Finacle scripting, JavaScript, JSP, and iReport, creating database objects using SQL and shell scripts for UCO Bank.",
"Developed custom menus, performed Finacle scripting and ONS customizations, debugged issues, and performed unit testing for Bank of India (BOI)." ]
- also add this json at first : "Headers": {
"candidateName": "candidate name",
"candidatePosition": "candidate's current position"
}

5. Validate:
- Review the extracted data for consistency and completeness.
- Ensure all required fields are populated if the information is available in the {resume_text}.

6. Title/Headers Handling:
- Maintain the order of clients in project experience.
- Identify the correct project names over general subheaders.

## Step to follow to write a JSON resume section of "professionalSummary" for the candidate.
1. Analyze my `professional summary` details from {resume_text} to match job requirements.
2. Create a JSON resume section that highlights strongest matches
3. Optimize JSON section for clarity and relevance to the {resume_text}.

Instructions:
1. Focus: Craft relevant `professional summary` aligned with the {resume_text}.
2. Content:
2.1. Paragraph: single paragraph with limit of 4-6 lines, closely mirroring {resume_text}.
2.2. Impact: Quantify paragraph point for measurable results.
2.3. Storytelling: Utilize STAR methodology (Situation, Task, Action, Result) implicitly within paragraph text.
2.4. Action Verbs: Showcase technical skills with strong, active verbs.
2.5. Structure: Each paragraph follows "XX+ years of experience..." format.
3. Honesty: Prioritize truthfulness and objective language.
4. Specificity: Prioritize relevance to the {resume_text} over general `professional summary` details.
5. Style:
5.1. Voice: Use active voice whenever possible.
5.2. Proofreading: Ensure impeccable spelling and grammar.
5.3. All JSON keys must follow camelCase format and start with lowercase. For example: `professionalSummary`, `personalInformation`, `employmentHistory`.
5.4.Do NOT use TitleCase or PascalCase for any key, regardless of how it appears in the resume.

<example>
"professional Summary": [
  {{
  "Seasoned Business Analyst/Project manager with over 10 years of consultancy expertise. Specializing in overseeing software development projects across Manufacturing, Banking, and Finance sectors. Proficient in both Waterfall and Agile methodologies. Effective in team management, stakeholder relations, and technology adaptation. Known for guiding teams to project success through coaching and mentoring."
  }},
  {{
  "As a Technical Lead with extensive experience in web application development, particularly in MERN stack projects, JavaScript, TypeScript and Next JS, I have worked across multiple domains, including assurance, telecom, IT infrastructure, and retail applications. I have participated in designing application architecture from the ground up and worked with Microsoft Azure DevOps and AWS services such as ECS, S3 for static site deployment and Elastic Beanstalk for Node JS applications."
  }},
  [and so on...]
]
</example>

## Step to follow to write a JSON resume section of "professionalExperience" for the candidate.
if `professional experience` section present in {resume_text}:
  {{
  1. Analyze my `professional experience` details from {resume_text} to match job requirements.
  2. Create a JSON resume section that highlights strongest matches
  3. Optimize JSON section for clarity and relevance to the {resume_text}.

  Instructions:
  1. Focus: Craft relevant `professional experience` aligned with the {resume_text}.
  2. Content:
  2.1. Bullet points: do not exceed 10 bullet points as per the {resume_text}.
  2.2. Impact: Quantify bullet points for measurable results.
  2.3. Storytelling: Utilize STAR methodology (Situation, Task, Action, Result) implicitly within each bullet point.
  2.4. Action Verbs: Showcase technical skills with strong, active verbs.
  2.5. Structure: Each bullet point follows "Did X by doing Y, achieved Z" format.
  2.6. Specificity: Prioritize relevance to the {resume_text} over general `professional experience`.
  3. Honesty: Prioritize truthfulness and objective language.
  4. Specificity: Prioritize relevance to the {resume_text} over general `professional experience` details.
  5. Style:
  5.1. Voice: Use active voice whenever possible.
  5.2. Proofreading: Ensure impeccable spelling and grammar.
  }}
else:
  {{
  1. Analyze {resume_text} for `professional experience` details.
  2. Create a JSON resume section that highlights strongest matches
  3. Optimize JSON section for clarity and relevance to the {resume_text}.

  Instructions:
  1. Focus: Craft relevant `professional experience` aligned with the {resume_text}.
  2. Content:
  2.1. Bullet points: design all possible bullet points as per the {resume_text}.
  2.2. Impact: Quantify bullet points for measurable results.
  2.3. Storytelling: Utilize STAR methodology (Situation, Task, Action, Result) implicitly within each bullet point.
  2.4. Action Verbs: Showcase technical skills with strong, active verbs.
  2.5. Structure: Each bullet point follows "Did X by doing Y, achieved Z" format.
  2.6. Specificity: Prioritize relevance to the {resume_text} over general `professional experience`.
  3. Honesty: Prioritize truthfulness and objective language.
  4. Specificity: Prioritize relevance to the {resume_text} over general `professional experience` details.
  5. Style:
  5.1. Voice: Use active voice whenever possible.
  5.2. Proofreading: Ensure impeccable spelling and grammar.}}

<example>
"professional Experience": [
  [
    "Skilled in the formulation and implementation of pioneering software solutions, substantially elevating business productivity.",
    "Proficient in utilizing a diverse set of programming languages, tools, databases for backend development, ensuring seamless integration and optimal performance.",
    "Renowned for successfully implementing strategies that amplify overall performance of the software systems.",
    "Exhibits resilient leadership characteristics, promoting team collaboration and propelling progress amidst intricate technical obstacles.",
    [and so on...],
  ],
  [
    "10 Years of BFSI industry experience in Banking (HDFC Bank) and Insurance (ICICI Lombard), with MBA background.",
    "Domain Knowledge: Retail and Corporate Banking - CASA, Term Deposits, Mortgages, Payments, Cards, Collections, Recoveries, Treasury, Insurance, Risk Management, Digital Banking, End-to-end Financial Processes.",
    "Proficiency Forte: Customer journeys, Operations and processes, Regulatory compliance, Applications and functionality, IT Product hands-on, Platform migration, Workflow management, Digital transformation, UI and UX Enhancements, Business readiness, Data and MI reporting, Investments and Portfolio management,",
    [and so on...]
  ],
  [
    "Requirement Elicitation",
    "Stakeholder Management",
    "Problem Solving",
    "Effective Communication",
    "Team Collaboration",
    "Data Analysis",
    "Risk Management",
    "Project Management",
    "Agile Methodologies",
    [and so on...]
  ],
  [and so on...]
]
</example>

## Step to follow to write a JSON resume section of "awards" for the candidate.
1. Analyze my achievements details to match job requirements.
2. Create a JSON resume section that highlights strongest matches
3. Optimize JSON section for clarity and relevance to the job description.

Instructions:
1. Focus: Craft relevant achievements aligned with the {resume_text}.
2. Honesty: Prioritize truthfulness and objective language.
3. Specificity: Prioritize relevance to the specific job over general achievements.
4. Style:
4.1. Voice: Use active voice whenever possible.
4.2. Proofreading: Ensure impeccable spelling and grammar.

<example>
"awards": [
  "Won E-yantra Robotics Competition 2018 - IITB.",
  "1st prize in “Prompt Engineering Hackathon 2023 for Humanities”",
  "Received the 'Extra Miller - 2021' award at Winjit Technologies for outstanding performance.",
  [and so on...]
]
</example>

## Step to follow to write a JSON resume section of "certifications" for an applicant applying for job posts.

1. Analyze my certification details to match job requirements.
2. Create a JSON resume section that highlights strongest matches.
3. Optimize JSON section for clarity and relevance to the job description.

Instructions:
1. Focus: Include relevant certifications aligned with the job description.
2. Proofreading: Ensure impeccable spelling and grammar.

<example>
"certifications": [
  "Deep Learning Specialization by DeepLearning.AI, Coursera Inc.",
  "Server-side Backend Development by The Hong Kong University of Science and Technology.",
  [and so on...]
],
</example>

## Step to follow to write a JSON resume section of "education" for an candidate:

1. Analyze my education details to match job requirements.
2. Create a JSON resume section that highlights strongest matches
3. Optimize JSON section for clarity and relevance to the job description.

Instructions:
- Keep education from Bachelor's degree onwards, ignore previous qualifications.
- Maintain truthfulness and objectivity in listing experience.
- Prioritize specificity - with respect to job - over generality.
- Proofread and Correct spelling and grammar errors.
- Aim for clear expression over impressiveness.
- Prefer active voice over passive voice.

<example>
"education": [
  "B.Tech in Information Technology, Full-time, Graduated in 2009",
  "M. Tech Integrated Software Engineering, Vellore Institute of Technology, Tamil Nādu, India, 2021",
  "Masters of Science - Computer Science (Thesis), Arizona State University, Tempe, USA, 2025",
  "Passed with 75% Marks in B. E (E.C. E) at K. Ramakrishnan College of Technology, Trichy",
[and so on...]
],
</example>

## Step to follow to write a JSON resume section of "credits" for an candidate:

1. Analyze my Credits details to match job requirements.
2. Create a JSON resume section that highlights strongest matches.
3. Optimize JSON section for clarity and relevance to the job description.
4. credits must be if List of object as {category: 'string', items: ['string', 'string'...] }.

Instructions:
- look under the `skills` or `key skills` section to find the credits.
- keep all the listed `skills` from extracted text.
- Specificity: Prioritize relevance to the specific job over general achievements.
- Proofreading: Ensure impeccable spelling and grammar.
- some examples of skills category `programming languages`, `cloud and devops`, `technical & IT operations`, `project & process management`, `banking & financial operations`

<example>
"credits": [
  {{
  "category": "Programming Languages",
  "items": ["Python", "JavaScript", "C#", "and so on..."]
  }},
  {{
  "category": "Cloud and DevOps",
  "items": [ "Azure", "AWS", "and so on..." ]
  }},
  {{
  "category": "Client Interaction & Communication",
  "items": ["Client Communication", "Maintaining Effective Communication", "Coordination Between Developers"]
  }}
  "and so on..."
]
</example>

## Step to follow to write a JSON resume section of "projectExperience" for an candidate:

1. Analyze my project details to match job requirements from {resume_text}.
2. Create a JSON resume section that highlights strongest matches
3. Optimize JSON section for clarity and relevance to the job description.

Instructions:
1. Focus: Craft all relevant project experiences present in the {resume_text}.
2. Content:
2.1. Bullet points: all per experiences, without making any modifications.
2.2. Impact: Quantify each bullet point for measurable results.
2.3. Storytelling: Utilize STAR methodology (Situation, Task, Action, Result) implicitly within each bullet point.
2.4. Action Verbs: Showcase soft skills with strong, active verbs.
2.5. Honesty: Prioritize truthfulness and objective language.
2.6. Structure: Each bullet point follows "Did X by doing Y, achieved Z" format.
2.7. Specificity: Prioritize the most recent projects at start followed by the prior project as per the duration in descending order like 2024 then 2023 and followed by the other past year.
3. Style:
3.1. Clarity: Clear expression trumps impressiveness.
3.2. Voice: Use active voice whenever possible.
3.3. Proofreading: Ensure impeccable spelling and grammar.

<example>
"projectExperience": [
  {{
  "projectDetails":[
    {{
      "key": "client",
      "value": "CustomerXPs Software Pvt Lmt"
    }},
    {{
      "key": "project",
      "value": "Search Engine for All file types - Sunhack Hackathon - Meta & Amazon Sponsored"
    }},
    {{
      "key": "role",
      "value": "Team Lead"
    }},
    {{
      "key": "location",
      "value": "Pune, Maharashtra"
    }},
    {{
      "key": "duration",
      "value": "Nov 2023 - Jan 2025"
    }},
    {{
      "key": "tools",
      "value": ["Node", "JS", ".NET", "Redux", "MSAL", "MongoDB", "so on..."]
    }}
  ],
  "description": "Automated data ingestion and market risk visualization using historical data for decision-making.",
  "responsibilities": [
    "Envisioned Solution Architecture and Design for modernization efforts",
    "Adopted DevOps practices including CI/CD, Test Automation, Deployment automation, etc.",
    "Participated in release review/requirement analysis and design review meetings"
  ]
  }}
]
</example>

## Step to follow to write a JSON resume section of "miscellaneous" for the candidate:
 1. Analyze any remaining sections in {resume_text} that don’t clearly belong to other defined categories.
 2. Create a JSON resume section that captures these.

 Instructions:
 - Include content such as hobbies, languages, volunteering, phone number, contact number, email, or missing part from the resume which ever is important even project details if missed.
 - Structure as list of strings in every case scenario.
 - Ensure consistency, accuracy, and preserve original formatting when possible.

 <example>
 "miscellaneous": [
   "Fluent in German and Japanese.",
   "Volunteered with Red Cross Society for 2 years.",
   "Member of IEEE and Toastmasters International.",
   [and so on...]
 ]
 </example>


</instructions>"""

# Raw Formatter Prompt Template
RAW_FORMATTER_PROMPT = """
	Extract the following resume text into a JSON object with exactly these top-level fields and subfields. Do **not** paraphrase, summarize, or alter any wording—take each section verbatim:

Resume text:
{resume_text}

Output JSON schema:
{
   "Headers": {
	 "candidateName": "string",         // full name from top of resume
	 "candidatePosition": "string"      // current role/title (if present; otherwise empty string)
   },
   "professionalSummary": "string",     // the entire “PROFESSIONAL SUMMARY” paragraph
   "professionalExperience": [          // list each bullet under “WORK EXPERIENCE” as a separate string
	 "string"
   ],
   "awards": [                          // list any awards (if none, output [])
	 "string"
   ],
   "certifications": [                  // list any certifications (if none, [])
	 "string"
   ],
   "education": [                       // list each education entry (institution + degree + dates) as a string
	 "string"
   ],
   "credits": [                         // list skill-categories and items
	 {
	   "category": "string",            // e.g., "Programming Languages"
	   "items": [ "string" ]            // e.g., ["Java", "Python"]
	 }
   ],
   "projectExperience": [               // if present, list each project as object
	 {
	   "projectDetails": [              // key-value pairs like client, project, duration, etc.
		 { "key": "string", "value": "string" },
		 { "key": "string", "value": "string" }
	   ],
	   "description": "string",         // short summary of the project
	   "responsibilities": [            // list of detailed bullet points
		 "string"
	   ]
	 }
   ],
   "miscellaneous": [                   // optional additional sections (e.g., languages, hobbies, cell, email, )
	   "string"           // list of strings under this section
   ]
 }
			

Rules:
1. Output **only** valid JSON matching this schema.
2. Use empty arrays (`[]`) or `""` for missing sections/fields.
3. Do **not** add any extra keys or commentary.
4. Preserve exact whitespace-trimmed text from the resume (no rewording).
5. Proofreading: Ensure impeccable spelling and grammar.

Provide the JSON object as your sole output."""

# Skill Extraction Prompt Template
SKILL_PROMPT = """
You are an expert resume parser and skill matcher. Analyze the following resume and job description.
Extract and match the skills from the resume against the required skills from the job description.

Resume Data (in JSON format):
{resume_json}

Job Description:
{job_description}

Please return a JSON response with exactly this structure:
{{
  "resume_skills": ["skill1", "skill2", ...],
  "required_skills": ["skill1", "skill2", ...],
  "matched_skills": ["skill1", "skill2", ...]
}}

Instructions:
1. Extract all technical and professional skills mentioned in the resume (resume_skills)
2. Extract all required skills mentioned in the job description (required_skills)
3. Find skills that appear in both lists and include them in matched_skills
4. Sort each list alphabetically
5. Return ONLY the JSON response, no additional text

Important rules:
- Use lowercase for all skills
- Be specific (e.g., "python" not "programming")
- Include both technical and soft skills
- Match skills semantically (e.g., "C#" and "C Sharp" are the same)
- Return ONLY valid JSON
"""

# DOCX Template File
DOCX_TEMPLATE_PATH = "templates/Maveric_Template.docx"

# HTTP Headers
EXPOSED_HEADERS = ["X-Filename"]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173"
]

# Error Messages
ERROR_MESSAGES = {
    "FILE_REQUIRED": "File is required",
    "FILE_TOO_LARGE": "File size exceeds maximum allowed size",
    "UNSUPPORTED_FORMAT": "Unsupported file format. Supported formats: {formats}",
    "FILE_EXTRACTION_ERROR": "Error extracting text from file: {error}",
    "GEMINI_API_ERROR": "Error calling Gemini API: {error}",
    "JSON_PARSE_ERROR": "Error parsing JSON response from Gemini API",
    "INVALID_RESUME_DATA": "Invalid resume data provided",
    "DOCX_GENERATION_ERROR": "Error generating DOCX file: {error}"
}

# File Extensions
PDF_EXTENSIONS = {".pdf"}
DOCX_EXTENSIONS = {".docx", ".doc"}
PPTX_EXTENSIONS = {".pptx", ".ppt"}
