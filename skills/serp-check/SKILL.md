---
name: serp-check
description: "Analyze SERP competition before drafting content — who ranks on page 1, what search intent Google rewards, and which angle a site can realistically win. Run after picking a topic and before drafting."
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "imagewize/wp-vibe-toolbox (original; method borrows from aaron-he-zhu/aaron-marketing-skills serp-analysis, Apache-2.0, no text or code copied)"
---

# SERP Check

Before writing a blog post or page, analyze the search engine results page (SERP) for the target keyword to understand the competition and search intent.

## When to use

- "Can this rank?", "SERP analysis", "SERP check"
- "Who ranks for [keyword]?", "check the competition"
- "Is this topic worth writing?", "content brief"
- "Search intent for [keyword]"
- Before drafting any SEO-targeted content
- On a published post when keyword choice is in doubt

**Not for:** Auditing a finished draft (use `seo-audit`), finding new topics (use `keyword-gap-analysis`).

## Method

### 1. Define the target keyword
- Start with a specific, long-tail keyword (e.g., "wordpress maintenance cost for small business" not just "wordpress maintenance")
- Note search volume (use Google Keyword Planner, Ahrefs, or free alternatives)

### 2. Analyze page 1 (top 10 results)
For each result, note:
- Domain and domain authority (DA/DR)
- Content type: blog post, landing page, tool, video, forum (Reddit, Quora)
- Title pattern (how they phrase it)
- Content depth (estimated word count)
- Unique angle or format

### 3. Identify search intent
| Intent type | Signals | Content format |
|---|---|---|
| Informational | "how to", "what is", "guide" | Long-form guide, listicle |
| Commercial investigation | "best", "vs", "review", "comparison" | Comparison table, review |
| Transactional | "buy", "price", "cost", "hire" | Landing page, pricing page |
| Navigational | Brand name queries | Homepage, about page |

### 4. Find the winnable angle
Look for gaps:
- Weak content on page 1 (thin posts, outdated info, no first-hand data)
- Missing subtopics that searchers would want
- A format no one is using (calculator, template, checklist)
- A specific audience segment not addressed (e.g., "for agencies" vs "for solo devs")

### 5. Output a content brief
- Target keyword and variants
- Search intent
- Top 3 competitors and their angles
- Recommended angle for your content
- Content format and estimated length
- Internal links to include
