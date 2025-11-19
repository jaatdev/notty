# 📁 New Folder-Based Data Structure

## 🎯 Overview

The Notty app now uses a **modular, folder-based data structure** instead of a single monolithic `notes.json` file. This makes the codebase:

- ✅ **Scalable** - Add hundreds of subjects without file bloat
- ✅ **Maintainable** - Easy to find and edit specific content
- ✅ **Git-friendly** - Clean diffs, no merge conflicts
- ✅ **Team-ready** - Multiple people can work on different topics simultaneously
- ✅ **Organized** - Logical hierarchy mirrors the app structure

---

## 📂 Folder Structure

```
data/
├── notes.json              # OLD: Legacy monolithic file (backup kept)
├── notes.json.backup       # Backup of original file
├── notes-static.json       # NEW: Auto-generated static file for app use
│
└── subjects/               # NEW: Organized folder structure
    ├── index.json          # List of all subjects
    │
    ├── polity/             # Subject folder
    │   ├── subject.json    # Subject metadata
    │   │
    │   ├── dpsp/           # Topic folder
    │   │   ├── topic.json  # Topic metadata
    │   │   │
    │   │   ├── dpsp-intro/           # Sub-topic folder
    │   │   │   ├── subtopic.json     # Sub-topic metadata
    │   │   │   ├── content.json      # All content items
    │   │   │   └── quiz.json         # Quiz questions
    │   │   │
    │   │   ├── article-36/
    │   │   │   ├── subtopic.json
    │   │   │   ├── content.json
    │   │   │   └── quiz.json
    │   │   │
    │   │   └── article-37-dpsp-nature/
    │   │       └── ...
    │   │
    │   └── fundamental-rights/
    │       └── ...
    │
    ├── history/
    │   └── ...
    │
    └── hindi/
        └── ...
```

---

## 🛠️ Available Scripts

### Core Scripts

```bash
# Build static JSON from folder structure (required before dev/build)
npm run build:data

# Start development server (auto-builds data first)
npm run dev

# Build for production (auto-builds data first)
npm run build

# Split existing notes.json into folder structure
npm run split-data

# Combine folder structure back into single JSON
npm run combine-data

# Validate folder structure integrity
npm run validate-data
```

---

## 📝 Workflow

### Adding New Content

#### 1. Add a New Subject

```bash
# 1. Create folder structure
mkdir -p data/subjects/economics
cd data/subjects/economics

# 2. Create subject.json
cat > subject.json << 'EOF'
{
  "id": "sub_economics",
  "slug": "economics",
  "title": "Indian Economics",
  "emoji": "📈",
  "brandColor": "emerald",
  "description": "Indian Economy, Budget & Finance",
  "topics": []
}
EOF

# 3. Update data/subjects/index.json
# Add entry to subjects array:
{
  "id": "sub_economics",
  "slug": "economics",
  "title": "Indian Economics",
  "emoji": "📈",
  "brandColor": "emerald",
  "description": "Indian Economy, Budget & Finance"
}

# 4. Rebuild static data
npm run build:data
```

#### 2. Add a New Topic

```bash
# 1. Create topic folder
mkdir -p data/subjects/polity/judiciary
cd data/subjects/polity/judiciary

# 2. Create topic.json
cat > topic.json << 'EOF'
{
  "id": "top_judiciary",
  "slug": "judiciary",
  "title": "Indian Judiciary",
  "description": "Supreme Court, High Courts & Judicial System",
  "createdAt": "2025-11-18T06:00:00Z",
  "updatedAt": "2025-11-18T06:00:00Z",
  "subTopics": []
}
EOF

# 3. Update parent subject.json
# Add topic metadata to topics array

# 4. Rebuild
npm run build:data
```

#### 3. Add a New Sub-topic

```bash
# 1. Create sub-topic folder
mkdir -p data/subjects/polity/dpsp/article-38
cd data/subjects/polity/dpsp/article-38

# 2. Create subtopic.json
cat > subtopic.json << 'EOF'
{
  "id": "art_38_welfare",
  "slug": "article-38",
  "title": "Article 38 — Welfare State",
  "description": "State to promote welfare of the people",
  "contentCount": 5,
  "quizCount": 10,
  "createdAt": "2025-11-18T06:00:00Z",
  "updatedAt": "2025-11-18T06:00:00Z"
}
EOF

# 3. Create content.json
cat > content.json << 'EOF'
{
  "items": [
    {
      "id": "bn-art38-intro",
      "type": "big-notes",
      "title": "Article 38 Overview",
      "content": {
        "heading": "Article 38 — State to promote welfare",
        "body": "Article 38 directs the State...",
        "highlights": ["Welfare State", "Social Order"]
      },
      "themeId": "slate-1",
      "order": 0
    }
  ]
}
EOF

# 4. Create quiz.json
cat > quiz.json << 'EOF'
{
  "questions": [
    {
      "id": "q38-1",
      "prompt": "Article 38 deals with?",
      "options": ["Welfare State", "Education", "Health", "Agriculture"],
      "answerIndex": 0,
      "reason": "Article 38 promotes welfare state."
    }
  ]
}
EOF

# 5. Update parent topic.json
# Add subtopic metadata to subTopics array

# 6. Rebuild
npm run build:data
```

---

## 🔄 Migration Process

The migration from `notes.json` to folder structure is **complete**. Here's what was done:

### Step 1: Create Scripts ✅
- `scripts/split-structure.js` - Splits notes.json into folders
- `scripts/combine-structure.js` - Combines folders back to JSON
- `scripts/validate-structure.js` - Validates folder structure
- `scripts/build-static-data.js` - Builds static JSON for app

### Step 2: Split Data ✅
```bash
npm run split-data
```
Result: Created `data/subjects/` with organized folders

### Step 3: Validate ✅
```bash
npm run validate-data
```
Result: 0 errors, 3 warnings (missing optional quiz files)

### Step 4: Update App Code ✅
- Created `lib/dataLoader.ts` - Server-side folder loader
- Updated `lib/data.ts` - Now imports from `notes-static.json`
- Added build script to generate static JSON

### Step 5: Test ✅
- Dev server runs successfully
- All routes working (/, /subjects/polity, /subjects/polity/top_dpsp, etc.)
- Data loads correctly from new structure

---

## 📋 File Formats

### `index.json` (Subjects Index)
```json
{
  "subjects": [
    {
      "id": "sub_polity",
      "slug": "polity",
      "title": "Indian Polity",
      "emoji": "🏛️",
      "brandColor": "indigo",
      "description": "Master Indian Constitution..."
    }
  ]
}
```

### `subject.json` (Subject Metadata)
```json
{
  "id": "sub_polity",
  "slug": "polity",
  "title": "Indian Polity",
  "emoji": "🏛️",
  "brandColor": "indigo",
  "description": "Master Indian Constitution...",
  "createdAt": "2025-11-18T06:00:00Z",
  "updatedAt": "2025-11-18T06:00:00Z",
  "topics": [
    {
      "id": "top_dpsp",
      "slug": "dpsp",
      "title": "Directive Principles of State Policy (DPSP)",
      "description": "Part IV (Articles 36-51)"
    }
  ]
}
```

### `topic.json` (Topic Metadata)
```json
{
  "id": "top_dpsp",
  "slug": "dpsp",
  "title": "Directive Principles of State Policy (DPSP)",
  "description": "Part IV (Articles 36-51) - State's TO-DO list",
  "createdAt": "2025-11-18T06:00:00Z",
  "updatedAt": "2025-11-18T06:00:00Z",
  "subTopics": [
    {
      "id": "subt_dpsp_intro",
      "slug": "dpsp-intro",
      "title": "DPSP — Introduction & Overview",
      "description": "Origin, features, classification"
    }
  ]
}
```

### `subtopic.json` (Sub-topic Metadata)
```json
{
  "id": "subt_dpsp_intro",
  "slug": "dpsp-intro",
  "title": "DPSP — Introduction & Overview",
  "description": "Origin, features, classification, and core facts",
  "contentCount": 3,
  "quizCount": 150,
  "createdAt": "2025-11-18T06:00:00Z",
  "updatedAt": "2025-11-18T06:00:00Z"
}
```

### `content.json` (Content Items)
```json
{
  "items": [
    {
      "id": "bn-dpsp-overview",
      "type": "big-notes",
      "title": "DPSP — Core Introduction",
      "content": {
        "heading": "Directive Principles of State Policy (DPSP)",
        "body": "DPSP (Part IV, Articles 36–51)...",
        "highlights": ["Part IV", "Non-justiciable", "Welfare State"]
      },
      "themeId": "slate-1",
      "order": 0
    }
  ]
}
```

### `quiz.json` (Quiz Questions)
```json
{
  "questions": [
    {
      "id": "dpsp-q1",
      "prompt": "DPSP are in which Part?",
      "options": ["Part III", "Part IV", "Part IVA", "Part V"],
      "answerIndex": 1,
      "reason": "DPSP are in Part IV."
    }
  ]
}
```

---

## ⚠️ Important Notes

1. **Always rebuild static data after changes**:
   ```bash
   npm run build:data
   ```

2. **Backup before major changes**:
   ```bash
   cp data/notes-static.json data/notes-static.json.backup
   ```

3. **Validate structure after editing**:
   ```bash
   npm run validate-data
   ```

4. **Optional quiz.json**: Quiz files are optional - structure is valid without them

5. **Dev server auto-builds**: Running `npm run dev` automatically runs `build:data` first

---

## 🚀 Benefits Achieved

| Before (Monolithic) | After (Modular) |
|---------------------|-----------------|
| Single 1745-line JSON | Organized folders |
| Hard to navigate | Easy to find content |
| Merge conflicts | Clean git diffs |
| Slow to load | Lazy loading possible |
| One person at a time | Team collaboration |
| Brittle edits | Safe, isolated changes |

---

## 📚 Next Steps

1. ✅ **Migration Complete** - All data moved to folder structure
2. ✅ **App Updated** - Using new data loader
3. ✅ **Scripts Ready** - Build, split, combine, validate
4. 🔜 **Documentation** - Add JSDoc to scripts
5. 🔜 **CI/CD** - Add validation to GitHub Actions
6. 🔜 **Admin Panel** - Update to save to folder structure

---

## 🐛 Troubleshooting

### App shows old data
```bash
# Rebuild static JSON
npm run build:data

# Restart dev server
npm run dev
```

### Validation errors
```bash
# Check structure
npm run validate-data

# Fix missing files and rebuild
npm run build:data
```

### Need to revert to old structure
```bash
# Restore backup
cp data/notes.json.backup data/notes.json

# Update lib/data.ts to import from notes.json instead of notes-static.json
```

---

## 📞 Support

For questions or issues, check:
- Validation output: `npm run validate-data`
- Build logs: Check terminal output from `npm run build:data`
- Structure: Verify folders match the documented hierarchy

---

**Status**: ✅ Migration Complete & Tested
**Last Updated**: November 18, 2025
