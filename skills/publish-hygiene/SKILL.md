---
name: publish-hygiene
description: "Pre-publish hygiene for drafts and images — strips invisible Unicode (zero-width spaces, bidi marks, homoglyphs) from HTML, Markdown, and social drafts, and checks images for C2PA, XMP AI tags, and EXIF metadata before upload."
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "imagewize/mistral-toolbox (original, authored 2026-11-05)"
---

# Publish Hygiene

Clean drafts and check images before publishing.

## When to use

- "Clean this draft", "check for invisible characters"
- Before uploading a featured image or social card
- "Check this image for AI metadata"
- Final step before publishing any post or page

## Invisible Unicode cleanup

Scan text for and remove:
- Zero-width spaces (U+200B)
- Zero-width non-joiners (U+200C) and joiners (U+200D)
- Word joiners (U+2060)
- Byte order marks (U+FEFF)
- Bidirectional marks: LTR (U+200E), RTL (U+200F), pop (U+202C)
- Soft hyphens (U+00AD)
- Space homoglyphs (non-breaking space U+00A0 used where regular space expected)
- Any character in the Cf (format) Unicode category

Apply to: blog post HTML, Markdown drafts, LinkedIn/Mastodon posts, meta descriptions.

## Image metadata check

Before uploading featured images, social cards, or posters:
- Check for C2PA (Content Authenticity Initiative) manifests
- Check for XMP AI training opt-out tags
- Strip EXIF data (GPS coordinates, camera info, timestamps)
- Verify image dimensions match the intended use
- Check file size (compress if over target)

## What this does NOT do

- Does not rewrite prose or reduce AI-detector scores (use `first-hand-proof` for originality)
- Does not fix SEO issues (use `seo-audit`)
