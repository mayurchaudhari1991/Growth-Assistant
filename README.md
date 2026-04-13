# 🚀 Growth Assistant

> Fully automated LinkedIn content engine — fetches trending tech news, generates AI-written posts using a local LLM, attaches images, and publishes to LinkedIn on a randomised schedule. Runs 100% locally with no paid APIs required.

![Tech Stack](https://img.shields.io/badge/Node.js-Express-green) ![React](https://img.shields.io/badge/Frontend-React%20%2B%20MUI-blue) ![AI](https://img.shields.io/badge/AI-Ollama%20%2B%20Gemma-orange) ![LinkedIn](https://img.shields.io/badge/LinkedIn-OAuth%202.0-0A66C2)

---

## ✨ Features

- 📰 Fetches fresh articles from TechCrunch, Hacker News, Dev.to, The Verge every 3 hours
- 🤖 Generates LinkedIn posts using **Gemma 2b** running locally via Ollama (no OpenAI cost)
- 🖼️ Automatically finds relevant images via Unsplash
- 📅 Auto-publishes **3 times per day** at random times (morning / afternoon / evening) to avoid automation detection
- ✅ Manual approval dashboard — review, edit, publish, or skip any post
- 📊 Post history with stats

---

## 🛠️ Prerequisites

Install all of these before starting:

| Tool                  | Download                                           | Notes                                  |
| --------------------- | -------------------------------------------------- | -------------------------------------- |
| **Node.js 18+**       | https://nodejs.org                                 | Required for both frontend and backend |
| **MongoDB Community** | https://www.mongodb.com/try/download/community     | Local database                         |
| **Redis**             | https://github.com/microsoftarchive/redis/releases | Windows: download the `.msi` installer |
| **Ollama**            | https://ollama.com/download                        | Local AI model runner                  |

After installing Ollama, pull the AI model:

```bash
ollama pull gemma:2b
```

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/mayurchaudhari1991/Growth-Assistant.git
cd Growth-Assistant

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## 🔑 Environment Variables

Copy the example file and fill in your keys:

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in each value:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/growth-assistant
REDIS_URL=redis://localhost:6379

OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma:2b

UNSPLASH_ACCESS_KEY=your_key_here

LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:5000/auth/linkedin/callback
LINKEDIN_ACCESS_TOKEN=        ← filled automatically after OAuth
LINKEDIN_PERSON_URN=          ← filled automatically after OAuth
```

---

## 🔑 Getting Each API Key

### 1. Unsplash Access Key (Free)

Used to fetch relevant images for posts.

1. Go to **https://unsplash.com/developers**
2. Click **"Your apps"** → **"New Application"**
3. Accept the terms → fill in app name and description
4. Copy the **Access Key** (not the Secret Key)
5. Paste it as `UNSPLASH_ACCESS_KEY` in `.env`

> Free tier allows 50 requests/hour — more than enough.

---

### 2. LinkedIn API Keys (Free)

Used to publish posts to your LinkedIn profile.

#### Step 1 — Create a LinkedIn App

1. Go to **https://www.linkedin.com/developers/apps**
2. Click **"Create app"**
3. Fill in:
   - **App name**: Growth Assistant (or any name)
   - **LinkedIn Page**: Select your personal profile page or create one
   - **App logo**: Upload any image
4. Click **"Create app"**

#### Step 2 — Get Client ID and Secret

1. Open your newly created app
2. Go to the **Auth** tab
3. Copy **Client ID** → paste as `LINKEDIN_CLIENT_ID`
4. Click the eye icon next to **Primary Client Secret** → copy it → paste as `LINKEDIN_CLIENT_SECRET`
5. Under **"Authorized redirect URLs for your app"** → click **"Add redirect URL"** → enter:
   ```
   http://localhost:5000/auth/linkedin/callback
   ```
6. Click **"Update"**

#### Step 3 — Add Required Products

In the **Products** tab of your app, request access to these two products (both are self-serve and approved instantly):

| Product                                        | Why needed                                                  |
| ---------------------------------------------- | ----------------------------------------------------------- |
| **Share on LinkedIn**                          | Grants `w_member_social` scope to publish posts             |
| **Sign In with LinkedIn using OpenID Connect** | Grants `openid` + `profile` scopes to identify your account |

Click **"Request access"** for each. They are approved automatically (no manual review).

#### Step 4 — Connect via the App

1. Start the server and open **http://localhost:5173/settings**
2. Click **"Connect LinkedIn Account"**
3. Authorize in the LinkedIn popup
4. You'll be redirected back — `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_PERSON_URN` are saved to `.env` automatically

> **Note:** `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_PERSON_URN` are written automatically by the app after OAuth. You do not need to fill them manually.

---

## ▶️ Running the App

Open **two terminals**:

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📖 How to Use

### Dashboard

- See all pending posts waiting for your approval
- Click **"Post to LinkedIn"** to publish immediately
- Click **"Edit"** to modify content before posting
- Click **"Skip"** to discard

### Auto-Posting Schedule

The app automatically:

- Generates new post drafts **every 3 hours** from fresh news
- Auto-publishes **3 posts per day** at random times:
  - 🌅 Morning: 8–11 AM
  - ☀️ Afternoon: 1–4 PM
  - 🌙 Evening: 7–10 PM

The exact minute within each window is randomised daily to avoid LinkedIn automation detection.

### Settings

- View system status (AI, Unsplash, LinkedIn connection, scheduler)
- Disconnect / Reconnect LinkedIn OAuth

### History

- Browse all posted, pending, and skipped content

---

## 🏗️ Architecture

```
Growth-Assistant/
├── server/                      ← Express API (port 5000)
│   ├── modules/
│   │   ├── Posts/               ← Post CRUD, publish to LinkedIn
│   │   ├── News/                ← RSS feed fetcher (TechCrunch, HN, Dev.to, Verge)
│   │   ├── AI/                  ← Ollama/Gemma integration + markdown cleaner
│   │   ├── Images/              ← Unsplash image search
│   │   └── LinkedIn/            ← OAuth 2.0 + REST API posting
│   ├── cron/jobs/               ← Content pipeline + auto-publish scheduler
│   ├── lib/config/              ← Constants, env config
│   └── .env.example             ← Template — copy to .env and fill in keys
│
└── client/                      ← React + MUI (port 5173)
    ├── features/dashboard/      ← Pending post approval UI
    ├── features/history/        ← Post history
    └── features/settings/       ← LinkedIn OAuth connect + system status
```

---

## 🔧 Tech Stack

| Layer     | Technology                           |
| --------- | ------------------------------------ |
| Frontend  | React, Material UI, Vite             |
| Backend   | Node.js, Express                     |
| Database  | MongoDB (local)                      |
| Cache     | Redis (local)                        |
| AI        | Ollama + Gemma 2b (local, free)      |
| Images    | Unsplash API (free tier)             |
| LinkedIn  | OAuth 2.0, LinkedIn REST API v202601 |
| Scheduler | node-cron                            |

---

## 📄 License

MIT
