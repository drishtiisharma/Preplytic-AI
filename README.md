# Preplytic AI

Preplytic AI helps job candidates organize application materials, compare their experience with job profiles, and prepare for interviews. The project includes a Next.js web app and a FastAPI service.

> **Project status:** Active development. The Next.js roadmap generation and roadmap version refresh routes still contain stubbed AI integrations.

## Features

- Manage a candidate profile, resumes, and saved job profiles.
- Parse uploaded PDF resumes and view extracted profile details.
- Generate application emails and referral messages with configured AI providers.
- Set up mock interviews, review interview reports, and manage interview preparation roadmaps.

## Technology

- **Web:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **API:** FastAPI and Python
- **Data and authentication:** Supabase
- **AI integrations:** Gemini, Groq, OpenRouter, Mistral, and Tavily clients

## Requirements

- Node.js 20.9 or later and npm
- Python 3.10 or later
- A Supabase project
- API credentials for the AI services used by the features you want to run

## Local setup

### 1. Install web dependencies

From the repository root, run:

```sh
npm ci
```

### 2. Configure Supabase

Create a Supabase project and apply the SQL files in `supabase/migrations/` in filename order using the Supabase SQL Editor. These migrations create the application tables, row-level security policies, and storage buckets.

In Supabase Authentication settings, allow the local callback URL:

```text
http://localhost:3000/auth/callback
```

Copy `.env.example` to `.env.local` and fill in the project URL and anon key from **Project Settings > API**:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The Supabase anon key is intended for use by the browser. Do not put a service-role key in a `NEXT_PUBLIC_` variable.

### 3. Configure the API service

Copy `backend/.env.example` to `backend/.env`. Set `SUPABASE_URL` and `SUPABASE_KEY` to the same project URL and anon key. Add credentials for the AI providers needed by the backend features you plan to use.

Create and activate a Python virtual environment from the repository root, then install the backend requirements.

**Windows PowerShell**

```powershell
py -3 -m venv backend\.venv
.\backend\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

**macOS or Linux**

```sh
python3 -m venv backend/.venv
source backend/.venv/bin/activate
python -m pip install -r backend/requirements.txt
```

The backend loads environment variables from `backend/.env`. Its embedding model may download on the first start when `sentence-transformers` is available.

### 4. Start both services

Run each service in a separate terminal from the repository root.

Start the API:

```sh
cd backend
python -m uvicorn main:app --reload --port 8000
```

Start the web app:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app currently calls the API at `http://localhost:8000`.

## Configuration reference

| Variable | Service | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Web | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Web | Supabase anon key used by the client |
| `SUPABASE_URL` | API | Supabase project URL used by resume parsing |
| `SUPABASE_KEY` | API | Supabase anon key used with the user's access token |
| `GEMINI_API_KEY` | API | Enables backend Gemini integrations |
| `GROQ_API_KEY` | API | Enables backend Groq integrations |
| `GROQ_ROADMAP_API_KEY` | API | Enables backend roadmap integrations |
| `OPENROUTER_API_KEY` | API | Enables backend OpenRouter integrations |
| `MISTRAL_API_KEY` | API | Enables backend Mistral integrations |
| `TAVILY_API_KEY` | API | Enables backend Tavily integrations |

The AI provider keys are optional for starting the services, but the backend features that depend on a provider will need its key. The model names have defaults in `backend/ai/config.py` and can be overridden with the corresponding environment variables.

## Development commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm run start` | Serve a production build |

## Current limitations

- Roadmap generation and roadmap version refresh are not complete; configuring an AI key does not enable those stubbed routes.
- The web app currently expects the API service at `http://localhost:8000`; update the client configuration before using a different host.
- Configure production CORS origins and service URLs before deploying. The current API CORS setup is intended for development.

## Repository layout

```text
src/                    Next.js app, routes, and components
backend/                FastAPI service and AI integrations
supabase/migrations/    Database schema and storage policies
public/                 Static assets
```
