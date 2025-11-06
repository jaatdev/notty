# Rich Text Editor - Manual Testing Checklist

## ✅ Pre-Flight Checks

### Environment
- [ ] Dev server running (`npm run dev`)
- [ ] Browser console open (F12)
- [ ] No TypeScript errors in VS Code
- [ ] No console errors on page load

---

## 🧪 Test Cases

### 1. Modal Opening
- [ ] Navigate to any subject topic page
- [ ] Click **📝 Notes** floating button
- [ ] Verify NotesModal opens
- [ ] Verify RichTextEditor is in WYSIWYG mode by default
- [ ] Verify toolbar is visible with 17 buttons

### 2. WYSIWYG Toolbar Buttons
Test each button:
- [ ] **Bold** (B icon) - Select text, click, verify bold
- [ ] **Italic** (I icon) - Select text, click, verify italic
- [ ] **Underline** (U icon) - Select text, click, verify underline
- [ ] **Strikethrough** (S icon) - Select text, click, verify strikethrough
- [ ] **H1** - Place cursor, click, verify heading 1
- [ ] **H2** - Place cursor, click, verify heading 2
- [ ] **H3** - Place cursor, click, verify heading 3
- [ ] **Bullet List** - Place cursor, click, verify bullet list
- [ ] **Ordered List** - Place cursor, click, verify numbered list
- [ ] **Code Block** - Place cursor, click, verify code block
- [ ] **Quote** - Place cursor, click, verify blockquote
- [ ] **Link** - Select text, click, enter URL in prompt, verify link
- [ ] **HR** - Place cursor, click, verify horizontal rule
- [ ] **Undo** - Make change, click undo, verify reverted
- [ ] **Redo** - Undo, then click redo, verify restored

### 3. Keyboard Shortcuts (WYSIWYG Mode)
- [ ] `Ctrl+B` - Bold
- [ ] `Ctrl+I` - Italic
- [ ] `Ctrl+U` - Underline
- [ ] `Ctrl+Shift+X` - Strikethrough
- [ ] `Ctrl+Shift+K` - Insert Link (prompt appears)
- [ ] `Ctrl+Z` - Undo
- [ ] `Ctrl+Y` - Redo

### 4. Mode Toggle
- [ ] Click **Markdown** button (Code icon)
- [ ] Verify editor switches to plain textarea
- [ ] Verify content is in markdown format
- [ ] Type markdown: `**bold** *italic*`
- [ ] Click **WYSIWYG** button (Type icon)
- [ ] Verify editor switches back to TipTap
- [ ] Verify markdown is parsed (bold/italic visible)

### 5. Keyboard Shortcut: Mode Toggle
- [ ] Press `Ctrl+Shift+M`
- [ ] Verify mode switches (WYSIWYG ↔ Markdown)
- [ ] Press again, verify switches back

### 6. Preview Mode
- [ ] Write some content in WYSIWYG mode
- [ ] Click **Preview** button (Eye icon)
- [ ] Verify content rendered (no editor, read-only)
- [ ] Click **Edit** button
- [ ] Verify back to editor

### 7. Keyboard Shortcut: Preview
- [ ] Press `Ctrl+P`
- [ ] Verify preview mode activates
- [ ] Press again, verify back to edit mode

### 8. Content Persistence
- [ ] Type content in WYSIWYG mode
- [ ] Switch to Markdown mode
- [ ] Verify content converted to markdown
- [ ] Switch back to WYSIWYG
- [ ] Verify content restored

### 9. Save Functionality
- [ ] Enter title: "Test Note"
- [ ] Enter content in WYSIWYG: "This is **bold** and *italic*"
- [ ] Add tag: "test"
- [ ] Click **Save** OR press `Ctrl+S`
- [ ] Verify modal closes
- [ ] Re-open notes modal
- [ ] Search for "Test Note"
- [ ] Verify note appears with formatted content

### 10. Dark Mode Styling
- [ ] Toggle dark mode (if available)
- [ ] Verify RichTextEditor toolbar visible
- [ ] Verify text is readable
- [ ] Verify button hover states work

### 11. Syntax Highlighting (Code Blocks)
- [ ] In WYSIWYG mode, click **Code Block** button
- [ ] Type: 
   ```
   const hello = 'world';
   console.log(hello);
   ```
- [ ] Verify syntax highlighting appears (if JavaScript detected)

### 12. Link Insertion
- [ ] Select text: "Google"
- [ ] Click **Link** button OR press `Ctrl+Shift+K`
- [ ] Enter URL in prompt: `https://google.com`
- [ ] Click OK
- [ ] Verify link created (blue, underlined)
- [ ] Hover to verify URL

### 13. Edge Cases
- [ ] Empty content → Click Save → Verify validation (should show error)
- [ ] Very long content (1000+ words) → Verify scrolling works
- [ ] Copy/paste formatted text from Word → Verify formatting preserved
- [ ] Special characters: `<script>alert('xss')</script>` → Verify escaped

### 14. Performance
- [ ] Type continuously for 30 seconds
- [ ] Verify no lag or stuttering
- [ ] Switch modes rapidly 10 times
- [ ] Verify no crashes or errors

### 15. Mobile Responsiveness (if applicable)
- [ ] Resize browser to mobile width (375px)
- [ ] Verify toolbar wraps or scrolls horizontally
- [ ] Verify buttons are tappable
- [ ] Verify editor is usable

---

## 🐛 Bug Tracking

### Issues Found
| # | Description | Severity | Status |
|---|-------------|----------|--------|
|   |             |          |        |

### Expected Behavior
- All toolbar buttons should work
- All keyboard shortcuts should work
- Mode switching should preserve content
- Save should create note with markdown content
- No console errors
- Smooth 60fps animations

### Actual Behavior
(Fill in after testing)

---

## ✅ Sign-Off

**Tested By**: _________________  
**Date**: _________________  
**Browser**: _________________  
**OS**: _________________  
**Result**: ☐ PASS | ☐ FAIL  

**Notes**:
