---
name: keyword-gap-analysis
description: "Find keyword and content gaps against competitors — what they rank for that you don't, underserved keywords, and prioritized content opportunities tied to your actual services."
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "imagewize/wp-vibe-toolbox (original, authored 2026-11-05)"
---

# Keyword Gap Analysis

Identify keywords and topics competitors rank for that your site doesn't, and prioritize the gaps worth closing.

## When to use

- "What should I write about next?"
- "Keyword research", "content gap analysis"
- "What are competitors ranking for?"
- "Underserved keywords", "competitor keywords"
- "How do we get ahead of competitors?"
- Quarterly content planning

**Not for:** Analyzing one specific keyword's SERP (use `serp-check`), auditing existing content (use `seo-audit`).

## Method

### 1. Define your competitor set
- 3–5 direct competitors (same services, same market)
- Use tools: Ahrefs, SEMrush, Ubersuggest, or free alternatives (Google Search Console, Search results)

### 2. Extract competitor keywords
- Use a tool to export all keywords each competitor ranks for (top 100–500)
- Filter for keywords relevant to your services

### 3. Compare against your keywords
- Export your own ranking keywords (GSC or tool)
- Find keywords competitors rank for (positions 1–20) that you don't rank for at all, or rank below position 20

### 4. Score each gap
| Factor | Weight | How to score |
|---|---|---|
| Search volume | High | Monthly searches |
| Keyword difficulty | High | Competitor DA, page 1 strength |
| Relevance to your services | Critical | Does it map to something you sell? |
| Content gap (no good result on page 1) | Medium | Is there a winnable angle? |

### 5. Prioritize
- High volume + low difficulty + high relevance = priority 1 (quick wins)
- High volume + high difficulty + high relevance = priority 2 (strategic bets)
- Low volume + low difficulty = priority 3 (long-tail, fill gaps)

### 6. Output
A prioritized table:

| Keyword | Volume | Difficulty | Competitors ranking | Our position | Priority | Content idea |
|---|---|---|---|---|---|---|

Tie each opportunity to a specific content piece or page update.
