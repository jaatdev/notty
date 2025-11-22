# 📝 NoteBox HTML Formatting Guide

## 🎯 Quick Reference

All NoteBox text fields now support HTML formatting! Use these tags to beautify your content.

---

## 📊 Supported HTML Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `<strong>` | **Bold text** | `<strong>Important</strong>` |
| `<em>` | *Italic text* | `<em>Emphasis</em>` |
| `<br>` | Line break | `Line 1<br>Line 2` |
| `<ul>` | Bullet list | `<ul><li>Item</li></ul>` |
| `<ol>` | Numbered list | `<ol><li>First</li></ol>` |
| `<li>` | List item | `<li>Point</li>` |
| `<p>` | Paragraph | `<p>Text here</p>` |
| `<h1>-<h6>` | Headings | `<h3>Subheading</h3>` |
| `<a>` | Link | `<a href="url">Link</a>` |
| `<code>` | Code | `<code>function()</code>` |
| `<pre>` | Preformatted | `<pre>Code block</pre>` |
| `<blockquote>` | Quote | `<blockquote>Quote</blockquote>` |
| `<span>` | Inline style | `<span>Text</span>` |
| `<div>` | Block container | `<div>Content</div>` |
| `<img>` | Image | `<img src="url" alt="desc">` |

---

## 🎨 Common Formatting Patterns

### 1. Bold and Italic
```html
<strong>Bold text</strong>
<em>Italic text</em>
<strong><em>Bold and italic</em></strong>
```

### 2. Lists
```html
<!-- Bullet List -->
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<!-- Numbered List -->
<ol>
  <li>Step one</li>
  <li>Step two</li>
  <li>Step three</li>
</ol>
```

### 3. Line Breaks
```html
First line<br>
Second line<br>
Third line
```

### 4. Headings
```html
<h3>Main Point</h3>
<h4>Sub Point</h4>
<h5>Detail</h5>
```

### 5. Links
```html
<a href="https://example.com">Click here</a>
Learn more at <a href="url">this link</a>
```

### 6. Code
```html
Use <code>console.log()</code> to debug
<pre>
function hello() {
  return "world";
}
</pre>
```

---

## 📦 Box-Specific Examples

### Warning Box
```json
{
  "type": "warning-box",
  "content": {
    "message": "<strong>⚠️ Critical:</strong> Do not skip this step!<br><br><ul><li>Check all connections</li><li>Verify settings</li><li>Test thoroughly</li></ul>"
  }
}
```

### Tip Box
```json
{
  "type": "tip-box",
  "content": {
    "tip": "<strong>💡 Pro Tip:</strong> Use <code>Ctrl+K</code> for quick search<br><br><em>This saves tons of time!</em>"
  }
}
```

### Definition Box
```json
{
  "type": "definition-box",
  "content": {
    "term": "Democracy",
    "definition": "A system of government by the <strong>whole population</strong>, typically through <em>elected representatives</em>",
    "examples": [
      "<strong>India:</strong> World's largest democracy",
      "<strong>USA:</strong> Federal democratic republic"
    ]
  }
}
```

### Summary Box
```json
{
  "type": "summary-box",
  "content": {
    "points": [
      "<strong>Point 1:</strong> Democracy ensures <em>equality</em>",
      "<strong>Point 2:</strong> Citizens have <em>fundamental rights</em>",
      "<strong>Point 3:</strong> Power lies with the <em>people</em>"
    ],
    "keyTakeaway": "<strong>🎯 Remember:</strong> Democracy = <em>Government of the people, by the people, for the people</em>"
  }
}
```

### Timeline Box
```json
{
  "type": "timeline-box",
  "content": {
    "events": [
      {
        "date": "1947",
        "event": "<strong>Independence</strong>",
        "description": "India gained <em>freedom</em> from British rule<br><br>Key leaders: <strong>Gandhi, Nehru, Patel</strong>"
      }
    ]
  }
}
```

### Comparison Box
```json
{
  "type": "comparison-box",
  "content": {
    "items": [
      {
        "name": "Democracy",
        "features": [
          "<strong>Power:</strong> People",
          "<strong>Elections:</strong> Free & fair",
          "<strong>Rights:</strong> Protected"
        ]
      }
    ],
    "conclusion": "<strong>Conclusion:</strong> Democracy provides <em>maximum freedom</em> to citizens"
  }
}
```

### Formula Box
```json
{
  "type": "formula-box",
  "content": {
    "name": "Quadratic Formula",
    "formula": "<strong>x</strong> = <sup>-b ± √(b² - 4ac)</sup>/<sub>2a</sub>",
    "variables": [
      {"symbol": "a", "meaning": "Coefficient of <strong>x²</strong>"},
      {"symbol": "b", "meaning": "Coefficient of <strong>x</strong>"}
    ],
    "example": "For <code>x² + 5x + 6 = 0</code><br>a=1, b=5, c=6"
  }
}
```

---

## 🎨 Advanced Formatting

### Nested Lists
```html
<ul>
  <li>Main point
    <ul>
      <li>Sub point 1</li>
      <li>Sub point 2</li>
    </ul>
  </li>
  <li>Another main point</li>
</ul>
```

### Mixed Formatting
```html
<strong>Important:</strong> This is <em>very</em> critical<br>
<br>
<ul>
  <li><strong>Step 1:</strong> Read carefully</li>
  <li><strong>Step 2:</strong> <em>Understand</em> thoroughly</li>
  <li><strong>Step 3:</strong> Apply <code>concepts</code></li>
</ul>
```

### Styled Text
```html
<span style="color: #10b981;">Success message</span>
<span style="color: #ef4444;">Error message</span>
<span style="color: #f59e0b;">Warning message</span>
```

### Tables (in comparison-box)
```html
<table>
  <tr>
    <th><strong>Feature</strong></th>
    <th><strong>Value</strong></th>
  </tr>
  <tr>
    <td>Speed</td>
    <td><em>Fast</em></td>
  </tr>
</table>
```

---

## ✅ Best Practices

### DO ✅
- Use semantic HTML (`<strong>`, `<em>`)
- Keep formatting simple and clean
- Use lists for multiple items
- Add line breaks for readability
- Combine tags for emphasis

### DON'T ❌
- Use inline styles excessively
- Nest too many tags
- Use deprecated tags (`<b>`, `<i>`, `<font>`)
- Add complex CSS
- Forget closing tags

---

## 🔒 Security Note

All HTML is automatically sanitized using the `sanitizeHtml` function to prevent:
- XSS attacks
- Script injection
- Malicious code
- Unsafe attributes

**Safe to use:** All standard HTML formatting tags  
**Blocked:** `<script>`, `<iframe>`, dangerous attributes

---

## 📱 Mobile Considerations

HTML formatting works perfectly on mobile:
- Lists stack vertically
- Line breaks work as expected
- Links are touch-friendly
- Images resize automatically
- Text wraps properly

---

## 🎯 Quick Examples by Use Case

### For Emphasis
```html
<strong>This is important</strong>
<em>This is emphasized</em>
<strong><em>This is very important</em></strong>
```

### For Structure
```html
<h3>Main Topic</h3>
<p>Explanation here</p>
<ul>
  <li>Point 1</li>
  <li>Point 2</li>
</ul>
```

### For Instructions
```html
<ol>
  <li><strong>First:</strong> Do this</li>
  <li><strong>Then:</strong> Do that</li>
  <li><strong>Finally:</strong> Complete</li>
</ol>
```

### For Definitions
```html
<strong>Term:</strong> <em>Definition here</em><br>
<br>
<strong>Example:</strong> Usage example
```

### For Warnings
```html
<strong>⚠️ Warning:</strong> Important notice<br>
<br>
<ul>
  <li>Consequence 1</li>
  <li>Consequence 2</li>
</ul>
```

---

## 🚀 Pro Tips

1. **Use `<br><br>` for paragraph spacing**
2. **Combine `<strong>` and `<em>` for maximum emphasis**
3. **Use lists for better readability**
4. **Add emojis for visual appeal** 🎯 ✨ 💡
5. **Keep HTML simple and semantic**
6. **Test on mobile devices**
7. **Use consistent formatting across boxes**

---

## 📊 HTML Support by Box Type

| Box Type | HTML Support | Best For |
|----------|--------------|----------|
| warning-box | ✅ Full | Formatted warnings |
| tip-box | ✅ Full | Rich tips |
| quote-box | ✅ Full | Styled quotes |
| summary-box | ✅ Full | Structured summaries |
| definition-box | ✅ Full | Detailed definitions |
| story-box | ✅ Full | Rich narratives |
| timeline-box | ✅ Full | Formatted events |
| comparison-box | ✅ Full | Styled comparisons |
| formula-box | ✅ Full | Math formatting |
| small-notes | ✅ Full | Formatted lists |
| big-notes | ✅ Full | Rich content |
| container-notes | ✅ Full | Complex layouts |

---

## 🎉 Conclusion

With HTML support, you can create:
- **Professional-looking notes** with proper formatting
- **Structured content** with lists and headings
- **Emphasized text** with bold and italic
- **Rich layouts** with multiple elements
- **Beautiful presentations** with styled content

**Start using HTML in your NoteBoxes today!** 🚀

---

**Version:** 2.0  
**HTML Support:** Full  
**Security:** Sanitized  
**Date:** January 2025
