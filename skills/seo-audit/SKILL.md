---
name: seo-audit
description: "Traditional on-page and technical SEO audit of a blog post, page, or website — keyword targeting, title tags, meta descriptions, heading hierarchy, internal linking, URL slugs, image alt text, and crawlability. Run on every blog post and page before deployment."
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "imagewize/mistral-toolbox (original, authored 2026-11-05)"
---

# SEO Audit

Run a traditional on-page and technical SEO audit on any WordPress page, blog post, or site. Use before publishing or deploying content.

## When to use

- "SEO audit this post", "is this page ready to publish?"
- "Check this page for SEO", "optimize this post"
- "Keyword optimization", "title tag", "meta description"
- "Internal linking check", "image alt text audit"
- Before deploying any new or updated page

**Not for:** AI/LLM citation optimization (use `ai-seo`), structured data (use `schema`), SERP analysis before drafting (use `serp-check`).

## Audit checklist

### 1. Keyword targeting
- Primary keyword present in title, first paragraph, at least one H2, and meta description
- Keyword density 0.5–2% (not stuffed)
- LSI/related keywords present naturally
- URL slug contains primary keyword, is short (<75 chars), lowercase, hyphen-separated

### 2. Title tag (SEO title)
- 50–60 characters (truncate-safe)
- Primary keyword near the front
- Brand name at the end (if space allows): "Primary Keyword | Brand"
- Unique across the site — no duplicates

### 3. Meta description
- 150–160 characters (under 155 recommended)
- Contains primary keyword
- Has a clear value proposition or CTA
- Unique across the site

### 4. Heading hierarchy
- Exactly one H1 (usually the post title)
- H2s for main sections, H3s for subsections — no skipped levels
- Headings contain relevant keywords where natural
- Logical reading order

### 5. Content quality
- Minimum 300 words for blog posts (800+ for competitive topics)
- Original content, not duplicated
- Paragraphs short (2–4 sentences)
- Lists and formatting for scannability

### 6. Internal linking
- 2–5 internal links to related content
- Descriptive anchor text (not "click here")
- Links to cornerstone/service pages where relevant
- No orphan pages (every page linked from at least one other page)

### 7. Images
- All images have descriptive alt text (not filenames)
- Featured image set
- Images compressed (WebP preferred, <100KB each)
- Lazy loading enabled (loading="lazy" except hero image)

### 8. Technical
- Page loads under 3 seconds
- Mobile-responsive (test at 375px width)
- Canonical tag set correctly
- No noindex on pages that should rank
- XML sitemap includes the page
- robots.txt does not block the page

### 9. URL structure
- Clean, readable URL: /services/wordpress-seo/
- No dates in URL unless it's a news post
- No stop words unless necessary
- HTTPS enforced

## Output format

Report findings as a table:

| Check | Status | Issue | Fix |
|---|---|---|---|
| Title tag | Pass/Fail | ... | ... |

End with a priority list: Critical fixes first, then Important, then Nice-to-have.
