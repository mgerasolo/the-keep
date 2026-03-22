---
title: Markdown Syntax Reference
type: reference
tags: [markdown, reference, syntax]
created: 2026-03-18
---

# Markdown Syntax Reference

Quick reference for supported markdown syntax.

## Text Formatting

- **Bold**: `**text**` or `__text__`
- *Italic*: `*text*` or `_text_`
- ~~Strikethrough~~: `~~text~~`
- `Inline code`: `` `code` ``

## Links

- External: `[text](url)`
- Internal: `[[page-name]]` or `[[page-name|Display Text]]`

## Images

```markdown
![Alt text](image-url)
```

## Code Blocks

Use triple backticks with optional language:

````markdown
```javascript
const x = 1;
```
````

Supported languages include: javascript, typescript, python, bash, json, yaml, markdown, and more.

## Task Lists

```markdown
- [ ] Unchecked task
- [x] Completed task
```

Renders as:
- [ ] Unchecked task
- [x] Completed task

## Horizontal Rule

Three or more dashes:

```markdown
---
```

---

## Footnotes

```markdown
Here is a footnote[^1].

[^1]: Footnote content.
```

## Math (if enabled)

Inline: `$E = mc^2$`
Block:
```markdown
$$
\int_0^1 x^2 dx = \frac{1}{3}
$$
```
