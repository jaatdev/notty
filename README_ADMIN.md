# Admin Panel Documentation

## Overview
The Notty Admin Panel is a comprehensive content management system that allows you to create, edit, and manage all your educational content through an intuitive interface.

## Features

### 1. **Visual Editor**
- Rich text editing with TipTap
- Image uploads via Cloudinary
- Real-time formatting
- Support for lists, links, bold, italic, and more

### 2. **Code Editor**
- Direct JSON editing
- Syntax validation
- Full control over data structure

### 3. **Split View**
- Edit and preview simultaneously
- See changes in real-time
- Perfect for fine-tuning content

### 4. **Content Tree**
- Hierarchical view of all content
- Drag-and-drop reordering
- Quick navigation
- Add/delete items at any level

### 5. **File Management**
- Upload images directly
- Cloudinary integration
- Automatic optimization

## Setup

### 1. Environment Variables
Create a `.env.local` file with:

```env
# Admin access
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com

# Cloudinary (for uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Clerk (authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

### 2. Install Dependencies
```bash
npm install @hello-pangea/dnd
```

### 3. Access Admin Panel
Navigate to `/admin` after signing in with an authorized email.

## Usage

### Creating Content

1. **Add Subject**
   - Click "Add Subject" in the content tree
   - Fill in title, description, emoji, and brand color
   - Save changes

2. **Add Topic**
   - Select a subject
   - Click the "+" icon next to it
   - Choose "Add Topic"

3. **Add Subtopic**
   - Select a topic
   - Click the "+" icon
   - Choose "Add Subtopic"

4. **Add Content**
   - Select a subtopic
   - Click the "+" icon
   - Choose content type (big-notes, small-notes, etc.)
   - Edit in visual or code mode

### Editing Content

1. **Visual Mode**
   - Use the rich text editor
   - Format text with toolbar
   - Upload images
   - Add links

2. **Code Mode**
   - Edit JSON directly
   - Full control over structure
   - Validate syntax automatically

3. **Split Mode**
   - Edit on left, preview on right
   - See changes instantly
   - Best for complex content

### Reordering Content

1. Click and hold the grip icon (⋮⋮)
2. Drag to new position
3. Release to drop
4. Save changes

### Deleting Content

1. Click the trash icon next to any item
2. Confirm deletion
3. Save changes

## Content Types

### big-notes
```json
{
  "type": "big-notes",
  "title": "Title",
  "content": {
    "heading": "Heading",
    "body": "HTML content",
    "highlights": ["Point 1", "Point 2"]
  },
  "themeId": "slate-1"
}
```

### small-notes
```json
{
  "type": "small-notes",
  "title": "Title",
  "content": {
    "title": "Title",
    "points": ["Point 1", "Point 2"]
  },
  "themeId": "mint"
}
```

### mnemonic-magic
```json
{
  "type": "mnemonic-magic",
  "title": "Title",
  "content": {
    "title": "Mnemonic Title",
    "mnemonic": "ABC",
    "breakdown": [
      {
        "letter": "A",
        "word": "Apple",
        "meaning": "Description"
      }
    ]
  },
  "themeId": "pink-3"
}
```

### mnemonic-card (Flashcards)
```json
{
  "type": "mnemonic-card",
  "title": "Flashcards",
  "content": {
    "flashcards": [
      {
        "id": "fc1",
        "front": "Question",
        "back": "Answer"
      }
    ]
  },
  "themeId": "cyan-2"
}
```

## Import/Export

### Export Data
1. Click "Export" button
2. JSON file downloads automatically
3. Backup saved locally

### Import Data
1. Click "Import" button
2. Select JSON file
3. Data replaces current content
4. Review and save

## Best Practices

1. **Save Frequently**
   - Click "Save Changes" regularly
   - Avoid losing work

2. **Use Preview**
   - Check formatting before saving
   - Ensure content displays correctly

3. **Backup Data**
   - Export regularly
   - Keep multiple versions

4. **Test Changes**
   - Preview in split mode
   - Verify all links and images

5. **Organize Content**
   - Use clear naming
   - Maintain hierarchy
   - Keep structure logical

## Troubleshooting

### Can't Access Admin Panel
- Verify email in NEXT_PUBLIC_ADMIN_EMAILS
- Check Clerk authentication
- Clear browser cache

### Upload Fails
- Verify Cloudinary credentials
- Check file size (max 10MB)
- Ensure valid image format

### Changes Not Saving
- Check console for errors
- Verify file permissions
- Ensure valid JSON structure

### Preview Not Updating
- Refresh the page
- Check for JavaScript errors
- Verify content structure

## Security

- Admin access restricted by email
- Clerk authentication required
- API routes protected
- File uploads validated

## Support

For issues or questions:
1. Check console for errors
2. Verify environment variables
3. Review data structure
4. Contact support team
