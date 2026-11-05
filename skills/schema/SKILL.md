---
name: schema
description: "Structured data (JSON-LD) for WordPress sites — FAQPage, Article, Service, Organization, BreadcrumbList. Use when adding schema markup, checking a live page's structured data, or when a draft has an FAQ section that needs its FAQPage block."
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "imagewize/mistral-toolbox (original, authored 2026-11-05)"
---

# Schema / Structured Data

Add and validate JSON-LD structured data on WordPress pages for search engines and AI answer engines.

## When to use

- "Add FAQ schema to this post"
- "Structured data", "JSON-LD", "schema markup"
- "Check the schema on this page"
- A draft has an FAQ section needing FAQPage markup
- Adding Service, Product, or Organization schema to a landing page

**Not for:** On-page SEO (use `seo-audit`), AI citation optimization strategy (use `ai-seo`).

## Common schema types for WordPress

### FAQPage (blog posts with Q&A)
- Must match the on-page FAQ text verbatim
- Useful for AI extraction even though Google deprecated FAQ rich results
- Validate with validator.schema.org

### Article / BlogPosting (blog posts)
- headline, author (Person), publisher (Organization), datePublished, dateModified
- image is recommended — use a verified upload URL, never guess

### Service (service pages)
- name, description, provider (Organization), areaServed, offers

### Organization (homepage / about)
- name, url, logo (verified URL only), sameAs (social profiles)

### BreadcrumbList
- Matches visible breadcrumb navigation

## Rules

- **Never guess URLs** — a wrong image or logo URL 404s and invalidates the schema
- **Schema must match visible content** — contradicting the page is worse than no schema
- **One logo URL** — use the same verified Organization logo everywhere
- **Validate after adding** — use validator.schema.org or Google Rich Results Test
- In WordPress, embed JSON-LD in a `wp:html` block or via the SEO plugin

## Validation checklist
1. Parse the JSON-LD (no syntax errors)
2. All URLs return 200 (check image, logo, mainEntityOfPage)
3. Text matches the on-page content verbatim (for FAQ especially)
4. Required properties present for the type
5. No deprecated properties
