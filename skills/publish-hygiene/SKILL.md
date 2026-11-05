---
name: publish-hygiene
description: "Pre-publish hygiene for drafts and images — strips invisible Unicode (zero-width spaces, bidi marks, homoglyphs) from HTML, Markdown, and social drafts, and checks images for C2PA, XMP AI tags, and EXIF metadata before upload."
user-invocable: true
license: MIT
metadata:
  version: "1.0.1"
  source: "github.com/guillaumemeyer/watermarks-remover skills/clean-user-facing-text @ 5a62be6338d2812372b1da440e55c82922f97d53 (MIT; rewrite, stylometry and detector scripts removed)"
---

# Publish Hygiene

Clean drafts and check images before publishing.

## When to use

- "Clean this draft", "check for invisible characters"
- Before uploading a featured image or social card
- "Check this image for AI metadata"
- Final step before publishing any post or page

## Invisible Unicode cleanup

Characters to find and remove:
- Zero-width space, non-joiner and joiner (U+200B, U+200C, U+200D), word joiner (U+2060), BOM (U+FEFF)
- Bidirectional marks (U+200E, U+200F, U+202A–U+202E), soft hyphen (U+00AD)
- Non-breaking space (U+00A0) where a regular space is expected

Keep U+200D when it joins an emoji sequence, and keep U+00A0 when it is intentional (e.g. before a unit). Review the hits before cleaning.

Apply to blog post HTML, Markdown drafts, LinkedIn/Mastodon posts and meta descriptions. Run the sequence inspect → clean → inspect, one file per command:

1. Inspect (prints matching lines with line numbers; no output means clean):
   `rg -n "[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}\x{FEFF}\x{00AD}\x{00A0}]" path/to/draft.md`
2. Clean (edits the file in place; commit or copy it first):
   `perl -CSD -pi -e 's/[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}\x{FEFF}\x{00AD}]//g' path/to/draft.md`
3. Inspect again and confirm there is no output.

## Image metadata check

For featured images, social cards and posters before upload:

1. Inspect all metadata (EXIF, XMP, C2PA/JUMBF entries are listed when present):
   `exiftool -a -G1 -s path/to/image.jpg`
2. Look for GPS coordinates, camera and software tags, timestamps, XMP AI-generation or training tags, and C2PA/Content Credentials entries.
3. Strip EXIF and XMP: `exiftool -all= -overwrite_original path/to/image.jpg`. Then re-run step 1: if C2PA/JUMBF data is still listed, re-export the image from an editor instead of keeping the file.
4. Check dimensions and file size against the intended use (`exiftool -ImageSize -FileSize path/to/image.jpg`) and compress if over target.

If `exiftool` or `rg` is missing, say so and ask the user to install them rather than skipping the check.

## What this does NOT do

- Does not rewrite prose or reduce AI-detector scores (use `first-hand-proof` for originality)
- Does not fix SEO issues (use `seo-audit`)
