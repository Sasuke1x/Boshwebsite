# Bulk Photo Upload Folder

Drop your photos here and run the upload script!

## Quick Start

1. **Add your photos** to this folder
2. **Run the upload command:**
   ```bash
   npm run upload-photos -- --category="events" --location="Manhattan" --year=2024
   ```

## Options

- `--category="slug"` - Category slug (e.g., "events", "portraits")
- `--location="..."` - Location for all photos
- `--year=2024` - Year for all photos
- `--featured=true` - Mark all as featured
- `--title="..."` - Use same title for all (otherwise uses filename)
- `--alt="..."` - Use same alt text for all (otherwise uses filename)

## Examples

### Upload event photos:
```bash
npm run upload-photos -- --category="events" --location="Brooklyn" --year=2024
```

### Upload from a different folder:
```bash
node scripts/bulk-upload-photos.js ./path/to/photos --category="portraits"
```

### Just upload without options:
```bash
npm run upload-photos
```
(You'll need to add category/details in the CMS afterward)

## Setup Required

Make sure you have `SANITY_API_WRITE_TOKEN` in your `.env.local` file!

Get a token from: https://www.sanity.io/manage
→ Select project → API → Tokens → Add API token
→ Permission: "Editor" or "Administrator"

Then add to `.env.local`:
```
SANITY_API_WRITE_TOKEN=your_token_here
```

## Supported Formats

JPG, JPEG, PNG, GIF, WEBP

---

After upload completes, view your photos at http://localhost:3000/studio 🎉

