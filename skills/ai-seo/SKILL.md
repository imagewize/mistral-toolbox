---
name: ai-seo
description: "Optimize content for AI search engines and LLM citations — AI Overviews, ChatGPT, Perplexity, Claude, Gemini. Use for GEO/LLMO/AEO, getting cited in AI-generated answers, and zero-click search optimization."
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "github.com/coreyhaines31/marketingskills skills/ai-seo @ 88c79f6528a9347420e57ceb1fff9a60de651768 (MIT; adapted and condensed for Vibe)"
---

# AI SEO (AEO / GEO / LLMO)

Optimize content so AI search engines and LLMs cite it, surface it, and recommend it in generated answers.

## When to use

- "Optimize for ChatGPT / Perplexity / Claude / Gemini"
- "AI Overviews", "AI citations", "AI visibility"
- "GEO", "LLMO", "AEO", "answer engine optimization"
- "Zero-click search", "how do I show up in AI answers"
- "LLM mentions", "generative engine optimization"

**Not for:** Traditional on-page SEO (use `seo-audit`), structured data markup (use `schema`).

## Core principles

### 1. Be the source LLMs can quote
- Publish original data, research, or first-hand experience
- Use clear, factual statements that are easy to extract verbatim
- Include statistics with sources, step-by-step instructions, and direct answers
- Structure content so an LLM can lift a paragraph and it stands alone

### 2. Entity clarity
- Define who you are, what you do, and where you operate in the first 2–3 paragraphs
- Use consistent naming (brand, product, person) across the web
- Include an About page, clear author bios, and organization info

### 3. Structured data helps machines parse
- FAQPage schema on Q&A content (see `schema` skill)
- Article schema with author, publisher, datePublished
- HowTo schema for tutorials
- Organization schema on the homepage

### 4. Content format that AI engines favor
- Direct answers to questions in the first sentence
- Lists, tables, and comparisons (easy to parse)
- Short paragraphs (2–3 sentences)
- Clear headings that match how people ask questions

### 5. Distribution beyond your site
- Publish on platforms LLMs crawl: LinkedIn, Medium, GitHub, YouTube transcripts
- Get mentioned in listicles, "best of" articles, and industry roundups
- Encourage reviews and mentions on third-party sites

## Audit checklist for AI visibility

| Check | Why it matters |
|---|---|
| FAQ sections with natural Q&A | LLMs lift Q&A verbatim into answers |
| Clear definitions of key terms | Reduces ambiguity in generated answers |
| Original data/statistics | Gives LLMs something unique to cite |
| Author bios with credentials | E-E-A-T signals |
| Consistent NAP (name, address, phone) | Entity recognition |
| llms.txt file in root | Directs AI crawlers to key content |
| Clean robots.txt allowing AI crawlers | GPTBot, ClaudeBot, PerplexityBot, etc. |

## Measuring AI visibility
- Track AI crawler traffic in server logs (GPTBot, ClaudeBot, PerplexityBot, Amazonbot, Meta-ExternalAgent)
- Monitor brand mentions in AI chat outputs (manual spot-checks)
- Check referral traffic from AI platforms (perplexity.ai, chat.openai.com)
- Use tools like Peec AI, Otterly, or Profound for AI search tracking
