# Notty Authoring Guide — Best Practices for Notes, Content Boxes, and Questions

Last updated: 2025-11-19

Purpose: This guide explains the folder-based data structure, every content "box" type we use, how to add questions/flashcards, naming conventions, examples, common pitfalls, and a recommended authoring workflow. Read this once and use it as your single reference when creating or editing notes for Notty.

---

## Quick navigation
- **Folder structure**: `data/subjects/...`
- **Build/validation scripts**: `scripts/build-static-data.js`, `scripts/validate-structure.js`, `scripts/split-structure.js`
- **Static file for app**: `data/notes-static.json` (auto-generated)

---

## 1. High-level folder structure

Root: `data/subjects`

- `index.json` — list of subjects (id, slug, title, emoji, brandColor, description)
- `<subject>/subject.json` — subject metadata and `topics` array (id/slug/title/description)
- `<subject>/<topic>/topic.json` — topic metadata and `subTopics` array
- `<subject>/<topic>/<subtopic>/subtopic.json` — subtopic metadata (counts, timestamps)
- `<subject>/<topic>/<subtopic>/content.json` — content items (array: `items`)
- `<subject>/<topic>/<subtopic>/quiz.json` — quiz questions (array: `questions`)

Why this layout? Each logical unit (subject, topic, subtopic) is isolated so authors can work in parallel without editing a large monolithic JSON. Files are small, git diffs are easy to read, and CI can validate each folder independently.

---

## 2. File responsibilities and schemas (author-oriented)

Note: The repository includes helper scripts to split/merge/validate. Use them rather than hand-editing the main `notes-static.json`.

### `index.json` (subjects/index)
- Purpose: App-level list of subjects used to build navigation.
- Minimal schema example:

```json
{
  "subjects": [
    {"id":"sub_polity","slug":"polity","title":"Indian Polity","emoji":"🏛️","brandColor":"indigo","description":"Constitution & Governance"}
  ]
}
```

Requirements:
- `id` and `slug` must be unique across subjects.
- `slug` used in URLs — lowercase, hyphen-separated.

---

### `subject.json` (per subject)
- Purpose: Metadata plus a lightweight list of topics (only metadata).
- Fields: `id, slug, title, description, emoji, brandColor, topics[]`.
- Example `topics` entry:

```json
{
  "id": "top_dpsp",
  "slug": "top_dpsp",
  "title": "Directive Principles of State Policy (DPSP)",
  "description": "Part IV — Articles 36-51"
}
```

Note: `topics` contains only metadata (id, slug, title, description) — the real content lives in each `topic` folder.

---

### `topic.json` (per topic)
- Purpose: Topic metadata and list of subtopics (metadata-only).
- Fields: `id, slug, title, description, subTopics[]`
- `subTopics` entries should include `id, slug, title, description`.

---

### `subtopic.json` (per subtopic)
- Purpose: Subtopic metadata and summary counts for UI
- Recommended fields:
  - `id`, `slug`, `title`, `description`
  - `contentCount`: number
  - `quizCount`: number
  - `createdAt`, `updatedAt` (ISO strings)

Example:

```json
{
  "id": "subt_dpsp_intro",
  "slug": "dpsp-intro",
  "title": "DPSP — Introduction & Overview",
  "description": "Origin, classification, examples",
  "contentCount": 5,
  "quizCount": 150,
  "createdAt": "2025-11-18T06:00:00Z",
  "updatedAt": "2025-11-18T06:00:00Z"
}
```

Keep `contentCount` and `quizCount` updated when you add/remove files; `build-static-data.js` will update counts automatically when run.

---

### `content.json` (per subtopic)
- Structure:
```json
{ "items": [ /* content nodes */ ] }
```
- Each content node is an object representing a "box" in the UI. Order in the array is the display order; boxes can also have an `order` property for explicit control.

We support the following content "box" types (see section 3):
- `big-notes`
- `small-notes`
- `mnemonic-magic`
- `mnemonic-card`
- `quick-reference`
- `right-wrong`
- `container-notes` (grouping)
- `mnemonic-card` (flashcards)
- `diagram` (diagram flag inside big-notes)

Each node must include: `id`, `type`, `title` (optional), `content` (object), `themeId`, `order`, and timestamp fields.

---

### `quiz.json` (per subtopic)
- Structure:
```json
{ "questions": [ /* question objects */ ] }
```
- Question object fields (recommended):
  - `id`: unique string (e.g., `q-dpsp-001`)
  - `prompt`: string
  - `options`: array of strings
  - `answerIndex`: integer (0-based index into `options`)
  - `explanation` or `reason`: optional string with answer rationale
  - `difficulty`: optional ("easy"|"medium"|"hard")
  - `tags`: optional array of tag strings

Example:

```json
{
  "id": "dpsp-q1",
  "prompt": "DPSP are enshrined in which Part?",
  "options": ["Part III","Part IV","Part IVA","Part V"],
  "answerIndex": 1,
  "reason": "DPSP are in Part IV."
}
```

Notes:
- Keep `id` unique across the subtopic.
- Use `answerIndex`, not `answerText`, so frontends can show randomized options safely.

---

## 3. Content box types — detailed explanation with examples

This section explains every content box available in Notty and recommended fields and usage. Treat these as best-practice templates.

### A. `big-notes`
Use for long-form explanations, full paragraphs, diagrams, and deep conceptual content.

Required fields:
- `id`, `type: "big-notes"`, `title`, `content` object with `heading`, `body`, optional `diagram` boolean and `highlights` array.
- `themeId` (visual color theme)

Example:

```json
{
  "id":"bn-dpsp-overview",
  "type":"big-notes",
  "title":"DPSP — Core Introduction",
  "content":{
    "heading":"Directive Principles (Overview)",
    "body":"Detailed paragraph(s) explaining DPSP...",
    "highlights":["Part IV: Articles 36-51","Non-justiciable"]
  },
  "themeId":"slate-1",
  "order":0
}
```

When to use:
- Syllabus-level explanation
- Exam mains answers
- Case-law discussions

When not to use:
- Don't use for single-line tips — use `small-notes` instead.


### B. `small-notes`
Short, bullet-style points, quick facts, or checklists.

Example:

```json
{
  "id":"sn-dpsp-keypoints",
  "type":"small-notes",
  "title":"Quick Facts",
  "content":{
    "title":"Key Points",
    "points":["Part IV: Articles 36-51","DPSP are non-justiciable"]
  },
  "themeId":"mint",
  "order":1
}
```

Good for revision cards and quick recall.


### C. `mnemonic-magic`
A structured mnemonic node (supports labelled breakdowns and multiple mnemonic units).

Fields: `title`, `mnemonic`, `breakdown` (array of small objects), `additionalMnemonics` optional.

Example:

```json
{
  "id":"mn-thinkers",
  "type":"mnemonic-magic",
  "title":"Thinkers Mnemonic (RNALS)",
  "content":{
    "title":"R-N-A-L-S",
    "mnemonic":"RNALS",
    "breakdown":[{"letter":"R","word":"Rau","meaning":"Non-justiciable"}]
  },
  "themeId":"pink-3",
  "order":2
}
```


### D. `mnemonic-card` (Flashcards)
Used for flashcard sets. `content.flashcards` is an array of `{id, front, back}` objects.

Example:

```json
{
  "id":"fc-hindi-15-qa",
  "type":"mnemonic-card",
  "title":"15 Flashcards",
  "content":{
    "flashcards":[{"id":"v1","front":"राजभाषा का अर्थ?","back":"Official Language"}]
  },
  "themeId":"mint",
  "order":4
}
```

Best practice:
- Keep card text short (one idea per card).
- Use `id` prefixes (`fc-<subtopic>-001`) for easy cross-reference.


### E. `quick-reference`
Compact Q&A pairs or definitions used as a cheat-sheet.

Example:

```json
{
  "id":"qr-dpsp",
  "type":"quick-reference",
  "title":"Quick Reference",
  "content":{
    "items":[{"term":"Article 36","value":"Definition of State for DPSP"}]
  },
  "themeId":"cyan-2",
  "order":3
}
```


### F. `right-wrong`
True/false style checks. Good for quick self-test.

Structure: `content.statements` array of `{id, statement, isCorrect, explanation}`.

Example:

```json
{
  "id":"rw-hindi-quickcheck",
  "type":"right-wrong",
  "title":"True/False",
  "content":{ "statements":[{"id":"t1","statement":"Hindi is a national language.","isCorrect":false,"explanation":"No, India has no national language."}]},
  "themeId":"ruby",
  "order":3
}
```


### G. `container-notes` (Grouping)
A container groups related boxes for visual grouping (e.g., a set of flashcards + quick reference). It includes a `content` array referencing nested nodes. Use sparingly.

Example:

```json
{
  "id":"container-intro-hindi",
  "type":"container-notes",
  "title":"Hindi Intro — Bundle",
  "content":{
    "items":[{"ref":"bn-hindi-origin"},{"ref":"fc-hindi-15-qa"}]
  },
  "themeId":"amber-3",
  "order":5
}
```

Note: `container-notes` only references `id` of other nodes; it does not duplicate content.

---

## 4. IDs, slugs, naming conventions and ordering
- `id`: internal unique string. Use prefix patterns to avoid collisions, e.g. `bn-` for big-notes, `sn-` for small-notes, `q-` for quiz questions, `fc-` for flashcards.
- `slug`: URL-friendly lowercase hyphen-separated identifier (no spaces). Keep stable once published.
- `order`: integer; smaller numbers show first. If omitted, array position decides order.
- `themeId`: visual theme token (e.g., `slate-1`, `mint`) to keep UI consistent.

Examples:
- `bn-dpsp-overview`, `sn-art36-keypoints`, `q-art36-1`, `fc-hindi-v1`.

---

## 5. How to add a question to a subtopic — step-by-step

Goal: Add an MCQ to `subjects/polity/dpsp/dpsp-intro/quiz.json`.

1. Open `data/subjects/polity/dpsp/dpsp-intro/quiz.json`.
2. Append a new question object to `questions` array.
3. Give it a unique `id` (prefer `q-<subtopic>-nnn`).
4. Provide `prompt`, `options` (array), `answerIndex` (0-based), and `reason`.
5. Save the file, run `npm run build:data`, then `npm run dev` (or the dev script auto-runs build).

Example append:

```json
{
  "id": "dpsp-q151",
  "prompt": "Which Article declares DPSP as 'fundamental in governance'?",
  "options": ["Article 36","Article 37","Article 38","Article 39"],
  "answerIndex": 1,
  "reason": "Article 37 declares them fundamental in governance."
}
```

After adding questions, update `subtopic.json.quizCount` or just run the build script which recalculates counts.

---

## 6. Examples — end-to-end: add a new subtopic with content and quiz

Create new subtopic folder `data/subjects/polity/dpsp/article-38`:

1. Create `subtopic.json` (metadata)
2. Create `content.json` with `items` array including `big-notes` nodes
3. Create `quiz.json` with `questions` array
4. Edit `topic.json` to add the new `subTopic` metadata
5. Run `npm run build:data` and `npm run validate-data`.

Example `subtopic.json` (minimal):

```json
{
  "id":"art_38_welfare",
  "slug":"article-38",
  "title":"Article 38 — Welfare State",
  "description":"State to promote welfare",
  "contentCount":1,
  "quizCount":1,
  "createdAt":"2025-11-19T06:00:00Z",
  "updatedAt":"2025-11-19T06:00:00Z"
}
```

---

## 7. Common errors & how to fix them

1. JSON syntax errors (missing comma, trailing comma):
   - Symptom: dev server fails to compile; console shows `Module parse failed: Cannot parse JSON`.
   - Fix: Use editor JSON linter or run `node -e "JSON.parse(fs.readFileSync('path','utf8'))"` to find the parse error line.

2. Missing `id`/duplicate `id`:
   - Symptom: UI features depending on unique ids (bookmarks, flashcards) misbehave.
   - Fix: Ensure unique ids using prefixes. Run a script to list duplicates (not included by default).

3. Invalid `answerIndex` (out of range):
   - Symptom: Quiz shows undefined answer or throws at runtime.
   - Fix: Make sure `answerIndex >= 0 && answerIndex < options.length`.

4. Client-side `fs` usage: importing server-only modules in client components causes build errors (`Can't resolve 'fs'`).
   - Fix: Use `scripts/build-static-data.js` to produce `data/notes-static.json` and import that in client code. Keep `lib/dataLoader.ts` server-side only.

5. Wrong slug naming:
   - Symptom: Broken links/404s.
   - Fix: Use lowercase hyphen-separated slugs consistently.

6. Out-of-sync `contentCount`/`quizCount`:
   - Symptom: UI counters incorrect.
   - Fix: Run `npm run build:data` which rebuilds static JSON and recalculates counts.

7. Large content inside flashcard `back` or `front` (too long):
   - Symptom: UI overflow or poor flashcard UX.
   - Fix: Keep flashcards concise; link to `big-notes` for deep explanations.

---

## 8. UX & authoring best practices (practical tips)

- Single idea per box: keep boxes focused (one concept per `big-notes`, one fact per `small-notes`).
- Prefer bullets over long paragraphs for `small-notes`.
- Use `highlights` array in `big-notes` to store exam-focused one-liners.
- Flashcards: limit to 10–20 cards per set for effective spaced repetition.
- Use `mnemonic-magic` for memory frameworks (labels and small breakdown arrays).
- Tagging: add `tags` in quizzes to allow filtered practice later (e.g., `tags:["case-law","landmark"]`).
- Use `order` to control rendering when mixing types.
- For diagrams, set `content.diagram: true` and keep a short caption and alt-text for accessibility.

---

## 9. Workflow recommendations (author-friendly)

1. Create or edit files in a branch.
2. Run `npm run validate-data` locally to check structure.
3. Run `npm run build:data` to generate `data/notes-static.json` and update counts.
4. Run `npm run dev` and preview pages.
5. Commit only the changed subtopic folder(s) and `data/notes-static.json` if you changed content. Avoid committing the entire `notes-static.json` if many unrelated entries changed — prefer merging with care.

CI suggestion: Add a GitHub Action step to run `npm run validate-data` on PRs and fail when validation errors occur.

---

## 10. When to split vs. keep together

- Keep content in the same subtopic if it is conceptually part of the same learning objective.
- Split into a new subtopic when:
  - It covers a distinct Article or concept (e.g., Article 36 vs Article 37).
  - It has many questions (e.g., > 100) — put large banks in `quiz.json` and link from the subtopic.

When not to split:
- Avoid creating too many micro subtopics for trivial distinctions — it increases navigation overhead.

---

## 11. Examples of good vs bad notes (side-by-side)

Good (big-notes + highlights):
```json
{
  "id":"bn-example",
  "type":"big-notes",
  "title":"Article 37 — Nature of DPSP",
  "content":{
    "heading":"Article 37 — Summary",
    "body":"Article 37 states DPSP are fundamental in governance but not enforceable by courts.",
    "highlights":["Fundamental in governance","Not enforceable by courts"]
  }
}
```

Bad (everything in one big paragraph, no structure):
```json
{
  "id":"bn-bad",
  "type":"big-notes",
  "content": { "body":"Very long 600-word paragraph mixing cases, definitions, mnemonics, and examples with no highlights..." }
}
```

Why good is better: highlights and small-notes allow quick revision; big-notes provide depth.

---

## 12. Automation & scripts recap

- `npm run split-data` — split old `data/notes.json` into folder structure (one-time or for migration)
- `npm run build:data` — generate and refresh `data/notes-static.json` used by the app (run before dev/build)
- `npm run validate-data` — structural validation (run on PRs)
- `npm run combine-data` — combine folders back into a single JSON (for export)

Example local test commands:

```powershell
cd c:\Users\Kapil Chaudhary\Desktop\notty
npm run validate-data
npm run build:data
npm run dev
```

---

## 13. Appendix — checklist for publishing a subtopic

- [ ] `subtopic.json` created and populated
- [ ] `content.json` created and every node has valid `id` and `type`
- [ ] `quiz.json` created (if applicable) and every `question.id` unique
- [ ] Run `npm run validate-data` — no errors
- [ ] Run `npm run build:data` — `notes-static.json` updated
- [ ] Preview routes in dev server

---

If you want, I can now:
- Generate a short PR template to standardize authoring contributions.
- Create a simple CLI for generating new subtopic skeletons.
- Add GitHub Action config to auto-validate PRs.

Tell me which you'd like next and I'll implement it.
