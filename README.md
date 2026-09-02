# MoodFlicks

MoodFlicks helps you decide what genre of film to watch tonight. Answer a six-question mood quiz in one sitting (leaving the page resets it), get a genre recommendation with three starter picks, and save the result to your personal history where you can edit notes or delete entries.

**Live app:** https://moodflicks-flame.vercel.app/

**Test credentials:**
- Email: `test@moodflicks.demo`
- Password: `Test1234`

## The three required components

1. **Authentication** — email/password sign up, sign in, and sign out via Supabase Auth.
2. **CRUD** — the core entity is a *saved recommendation* (genre + mood + note). Create (save a quiz result), Read (My results page), Update (edit the note), Delete (remove an entry). Row Level Security ensures each user only sees their own rows.
3. **Core business flow** — sign in → take the quiz in one sitting → receive a mood-matched genre → save it → manage your history.

## Stack

- **Frontend:** React 18 + Vite, plain CSS (no UI framework)
- **Backend:** Supabase (Auth + Postgres + Row Level Security) — no custom server code
- **Hosting:** Vercel
- **AI tools:** Built with Claude (Anthropic) for code generation and architecture decisions

## How the quiz works

Each answer carries weighted points toward one or more of six genres (Comedy, Thriller, Drama, Sci-Fi, Romance, Horror). After six questions the genre with the highest total wins. Quiz answers are held only in React state — never persisted mid-quiz — so refreshing or leaving the page restarts the quiz by design.

## Run it locally

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/Rana156Khan/moodflicks.git
   cd moodflicks
   npm install
   ```

2. Create a free project at [supabase.com](https://supabase.com). In the SQL Editor, run the contents of `supabase/schema.sql`.

3. In Supabase: **Authentication → Sign In / Up → Email** and turn **off** "Confirm email" (so demo accounts work instantly).

4. Copy `.env.example` to `.env` and fill in your values from Supabase **Project Settings → API**:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

## Deploy

Push to GitHub, import the repo on [vercel.com](https://vercel.com), and add the two environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings. Vercel auto-detects Vite and builds with `npm run build`.

## Project structure

```
├── index.html
├── package.json
├── vite.config.js
├── supabase/
│   └── schema.sql          # table + Row Level Security policies
└── src/
    ├── main.jsx            # entry point
    ├── App.jsx             # session handling + view routing
    ├── supabaseClient.js   # Supabase client
    ├── quizData.js         # questions, weights, scoring logic
    ├── styles.css          # design tokens + all styles
    └── components/
        ├── Auth.jsx        # sign up / sign in
        ├── Quiz.jsx        # quiz flow + save result (Create)
        └── History.jsx     # Read / Update / Delete
```
