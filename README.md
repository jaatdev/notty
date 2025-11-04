# 📚 Notty — World-class Notes

> Data-driven, crisp, recall-ready notes with flashcards, quizzes, and spaced repetition learning.

A modern note-taking and learning platform built with Next.js 16, featuring:

- 🎯 **Spaced Repetition Learning** - SM-2 algorithm for optimal retention
- 🏆 **Achievement System** - 10 badges tracking your learning journey
- 🎨 **Beautiful Dark Theme** - Optimized for reading and studying
- ⚡ **High Performance** - PWA with offline support and optimized loading
- ♿ **Fully Accessible** - WCAG compliant with keyboard navigation
- 📱 **Mobile Ready** - Responsive design for all devices
- 🔍 **Smart Search** - Command palette with fuzzy search (Cmd/Ctrl+K)

## ✨ Features

### Learning & Study Tools
- **Flashcards** with flip animations and quality ratings
- **Quizzes** with multiple-choice questions
- **Progress Tracking** with real-time statistics
- **Study Streaks** - 3, 7, and 30-day achievements
- **Mastery Milestones** - Track cards mastered (10, 50, 100+)

### Reading Experience
- **Customizable Reading** - 3 font sizes, line heights, and widths
- **Dyslexia-friendly Font** - Toggle OpenDyslexic font
- **Focus Mode** - Distraction-free reading
- **Keyboard Navigation** - J/K for sections, G for top
- **Breadcrumb Trail** - Track your reading path

### Content Enhancement
- **Image Zoom** - Click to enlarge with lightbox
- **Code Blocks** - Syntax highlighting with copy button
- **Collapsible Sections** - Expandable content areas
- **Beautiful Typography** - Enhanced tables, lists, blockquotes
- **Smooth Animations** - Fade-in, slide-in effects

### Performance & PWA
- **Offline Support** - Previously viewed content works offline
- **Fast Loading** - Code splitting and lazy loading
- **Web Vitals** - Monitored for optimal performance
- **Smart Caching** - Service worker with intelligent strategies
- **Optimized Fonts** - next/font with automatic optimization

## 🚀 Getting Started

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

### Build for Production

```bash
npm run build
npm start
```

## 📖 Documentation

- **[Performance Optimization Guide](./PERFORMANCE_OPTIMIZATION.md)** - Detailed performance strategies
- **[Performance Budget](./PERFORMANCE_BUDGET.md)** - Target metrics and budgets

## 🎯 Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: 19.2.0
- **Styling**: Tailwind CSS v4
- **Fonts**: next/font (Inter, JetBrains Mono)
- **Search**: Fuse.js for fuzzy search
- **Markdown**: react-markdown with rehype/remark plugins
- **PWA**: next-pwa with workbox
- **Theme**: next-themes for dark mode

## 📂 Project Structure

```
notty/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Homepage
│   ├── web-vitals.tsx     # Performance monitoring
│   ├── offline/           # Offline fallback page
│   └── subjects/          # Subject pages
├── components/            # React components
│   ├── ui/               # UI components
│   ├── nodes/            # Content node renderers
│   ├── home/             # Homepage components
│   ├── layout/           # Layout components
│   └── command/          # Command palette
├── lib/                  # Utilities
│   ├── performance.ts    # Performance monitoring
│   ├── preload.ts        # Resource preloading
│   ├── learningProgress.ts # Spaced repetition
│   └── ...
├── data/                 # Content data
│   └── notes.json        # All subjects and nodes
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   └── icons/            # App icons
└── styles/               # Global styles
    └── globals.css       # CSS variables and themes
```

## 🎨 Customization

### Adding Content

Edit `data/notes.json` to add subjects and nodes:

```json
{
  "slug": "your-subject",
  "title": "Your Subject",
  "description": "Description here",
  "nodes": [
    {
      "id": "intro",
      "kind": "section",
      "title": "Introduction",
      "children": [...]
    }
  ]
}
```

### Theming

Customize colors in `styles/globals.css`:

```css
:root {
  --emerald-500: #10b981;  /* Primary color */
  --reading-font-size: 1.125rem;
  --reading-line-height: 1.75;
}
```

## ⚡ Performance

- **LCP Target**: < 2.5s
- **FID Target**: < 100ms
- **CLS Target**: < 0.1
- **PWA Score**: 100
- **Accessibility**: 100

See [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built with ❤️ using:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Fuse.js](https://fusejs.io/)

---

Made with 💚 by the Notty team
