# Schema Types Reference

## Required vs recommended properties

### Article
- Required: headline, author, publisher, datePublished
- Recommended: image, dateModified, mainEntityOfPage, wordCount

### FAQPage
- Required: mainEntity (array of Question objects)
- Each Question needs: name, acceptedAnswer (Answer with text)

### Service
- Required: name, provider
- Recommended: description, areaServed, offers, serviceType

### Organization
- Required: name, url
- Recommended: logo, sameAs, contactPoint

### BreadcrumbList
- Required: itemListElement (array of ListItem with position, name, item)

## Common mistakes
- Curly quotes (") vs escaped quotes (\") in JSON — causes parse errors
- Missing trailing commas are fine in JSON-LD but extra commas break it
- Using attachment page URLs instead of direct file URLs for images/logo
- Schema text that doesn't match visible page content
