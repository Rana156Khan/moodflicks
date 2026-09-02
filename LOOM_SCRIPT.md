# Loom Script — MoodFlicks (target: 6–7 minutes)

> Before recording: open the live app in one tab, the GitHub repo in another, and the Supabase dashboard (Table Editor) in a third. Sign out of the app so you can demo signup live. Delete any messy test data first.

---

## 1. The idea and the problem (≈1 min)

"Hi, I'm [name], and this is MoodFlicks.

The problem it solves is something everyone knows: you sit down to watch a movie and spend thirty minutes scrolling because you don't actually know what you're in the mood for. MoodFlicks fixes the *first* decision — not which film, but which *genre* fits your mood right now.

You answer a six-question quiz about your day, your energy, and what you want to feel afterwards. Each answer scores points toward six genres, and the highest score wins. One deliberate design rule: the quiz must be finished in one sitting — if you leave the page, it resets. That keeps the answers honest and in the moment."

## 2. Live demo — the full flow (≈2.5–3 min)

*(Share the live app tab. Narrate while clicking.)*

1. **Auth:** "This is the live deployed app on Vercel. I'll create an account right now." → Sign up with a fresh email, land inside. "Signup, login, and logout are handled by Supabase Auth."
2. **The reset rule:** Start the quiz, answer two questions, then refresh the page. "Notice the quiz is gone — answers live only in memory, never saved mid-quiz. That's the one-sitting rule working."
3. **Full quiz:** Take all six questions. "Each answer carries weighted points toward genres — I'll show that in the code in a minute."
4. **Result + Create:** "It's read my mood and recommended [genre], with three starter films. I'll add a note and save it — that's the Create in CRUD."
5. **Read / Update / Delete:** Open "My results." "Here's every saved result — Read. I'll edit this note — Update. And delete this older one — Delete."
6. **Security proof (optional but impressive):** Sign out, sign in as the test account `test@moodflicks.demo`. "Different user, different history — Supabase Row Level Security means users can only ever see their own rows."
7. Sign out. "That's the complete business flow: sign in → quiz in one sitting → genre → save → manage history."

## 3. How I built it — architecture and decisions (≈2 min)

*(Switch to the GitHub repo tab, scroll the file tree, open one or two files.)*

"The architecture is intentionally simple: a React frontend talking directly to Supabase — no custom server.

- **Frontend:** React 18 with Vite. I chose Vite over Next.js because this app doesn't need server-side rendering, and a simple single-page app keeps the build easy to reason about. Views are three components: Auth, Quiz, and History.
- **Backend:** Supabase gives me three things in one free service — email/password authentication, a Postgres database, and Row Level Security policies so the database itself enforces that users only access their own data. *(Open `supabase/schema.sql` and point at the policies.)*
- **Quiz logic:** *(Open `src/quizData.js`.)* Every answer maps to weighted points across six genres. The scoring function totals them and the top genre wins. Adding a question or genre is just editing this one data file — logic and content are separated.
- **The reset-on-exit rule** is implemented by keeping quiz answers only in React state, never in the database or local storage — the simplest possible implementation of the business rule.
- **Hosting:** the repo is on GitHub, and Vercel deploys automatically on every push, with the Supabase keys stored as environment variables."

## 4. Tools and stack recap (≈45 sec)

"To be specific about tools:

- **React + Vite** for the frontend, plain CSS with a custom design system — the theme is a movie-marquee-at-night palette.
- **Supabase** for auth, database, and row-level security — zero backend code written by hand.
- **Vercel** for hosting and CI-style auto-deploys from GitHub.
- **Claude by Anthropic** as my AI pair-programmer — I used it to generate the initial codebase, design the scoring system, and write the SQL policies, then I set up Supabase, tested every flow, and deployed it myself.

The repo is public at github.com/Rana156Khan/moodflicks with a README covering full setup, and test credentials are in the README. Thanks for watching."

---

**Timing check:** 1 + 3 + 2 + 0.75 ≈ 6.75 min. If you're running long, cut the Row Level Security demo (step 6) — mention it verbally instead.
