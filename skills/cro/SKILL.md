---
name: cro
description: "Conversion rate optimization for marketing pages — homepage, landing pages, pricing, features, lead forms, contact pages. Diagnose why a page isn't converting and improve it. Use even when the user just shares a URL and asks for feedback."
user-invocable: true
license: MIT
metadata:
  version: "1.0.0"
  source: "github.com/coreyhaines31/marketingskills skills/cro @ 88c79f6528a9347420e57ceb1fff9a60de651768 (MIT; adapted and condensed for Vibe)"
---

# Conversion Rate Optimization (CRO)

Diagnose and improve conversion on any marketing page or form.

## When to use

- "CRO", "conversion rate optimization", "improve conversions"
- "This page isn't converting", "why isn't this page working"
- "My landing page sucks", "form abandonment", "nobody's converting"
- "Low conversion rate", "this page needs work"
- User shares a URL and asks for feedback

## Audit framework

### 1. Above the fold
- Is the value proposition clear in 3 seconds?
- Headline answers "what is this and why should I care?"
- One primary CTA visible without scrolling
- Social proof (logos, testimonials, numbers) near the CTA

### 2. Page structure
- Logical flow: problem → solution → proof → action
- Headings guide the eye (scannable in 5 seconds)
- White space between sections
- Mobile layout works (test at 375px)

### 3. CTA quality
- Button text is action-oriented and specific ("Get my free SEO audit" not "Submit")
- Contrasting color against background
- One primary CTA per section, one per page overall
- Friction removed: "No commitment", "Free", "2-minute setup"

### 4. Form optimization
- Minimum fields (each field reduces conversions ~10%)
- Inline validation with clear error messages
- No CAPTCHA if possible (use honeypot or Cloudflare Turnstile)
- Submit button text says what happens next
- Privacy reassurance near the submit button

### 5. Trust signals
- Testimonials with real names, photos, companies
- Case studies with measurable results
- Security badges (SSL, payment security)
- Guarantees or "no risk" statements
- FAQ addressing objections near the CTA

### 6. Performance
- Page loads under 3 seconds (ideally under 2)
- No layout shift (CLS < 0.1)
- Images optimized, lazy-loaded

## Output

Prioritized list of changes:
1. Critical (blocking conversion): ...
2. High impact (measurable lift expected): ...
3. Quick wins (easy to implement): ...

Include A/B test suggestions where relevant.
