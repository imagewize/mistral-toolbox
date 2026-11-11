# Mobile navigation

Every HTML/CSS prototype that has a header navigation needs a mobile menu, and the block theme
built from it keeps one. A prototype whose nav only wraps onto its own row under 760px converts to a
theme with no hamburger (Kadewerk shipped that way: the header part got `"overlayMenu":"never"`).
Build the menu in the prototype, so the conversion has something to copy.

## 1. In the HTML/CSS prototype: a basic menu first

Start with the smallest thing that works: no JavaScript, one breakpoint, real links.

```html
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="#top">Brand</a>
    <details class="nav-toggle">
      <summary aria-label="Menu"><span class="nav-toggle__icon" aria-hidden="true"></span></summary>
      <nav class="site-nav" aria-label="Main menu">
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </nav>
    </details>
    <a class="btn btn-small" href="#contact">Get in touch</a>
  </div>
</header>
```

```css
.nav-toggle > summary { list-style: none; cursor: pointer; padding: .75rem; }  /* 44px tap target */
.nav-toggle > summary::-webkit-details-marker { display: none; }
.site-nav { display: grid; gap: .5rem; padding: 1rem 0; }
@media (min-width: 64rem) {                       /* 1024px: collapse below this width */
  .nav-toggle > summary { display: none; }
  .nav-toggle > .site-nav { display: flex; gap: 1.5rem; padding: 0; }
}
```

`<details>` is keyboard- and screen-reader-friendly. A closed `details` hides its content even on
desktop, so keep it open there with three lines of script (the only JavaScript the basic menu needs):

```js
const mq = matchMedia('(min-width: 64rem)'), d = document.querySelector('.nav-toggle');
const sync = () => { d.open = mq.matches; };
sync(); mq.addEventListener('change', sync);
```

In the block theme this script is dropped: `core/navigation` brings its own overlay.

Options, in the order to try them. Choose one for the prototype and name it in a comment:

| Option | Behaviour | Maps to core/navigation |
|--------|-----------|-------------------------|
| Collapse below a breakpoint (default) | Hamburger under 1024px, inline links above | `"overlayMenu":"mobile"` |
| Always a hamburger | Short, curated sites where the menu is secondary | `"overlayMenu":"always"` |
| Never collapse | 3 or fewer links that fit at 320px | `"overlayMenu":"never"` |

Icon: three lines (`"icon":"menu"`) or two lines (`"icon":"handle"`). Match the prototype's icon to the one
the theme will use.

Breakpoint: 1024px, not core's 600px. A masthead with wordmark, links and CTA does not fit between
600 and 1024px. Aviendha's `style.css` §2.7 restores the collapse across that band; keep it when forking.

## 2. The mobile check (run on the prototype, before converting)

At 375px, 800px and 1280px:
- Under the breakpoint there is a hamburger (visible, at least 44×44px), the links are not shown
  as a separate wrapped row, and opening it shows every link.
- From the breakpoint up there is no hamburger and the links are inline on one line.
- The header is one row tall at every width (no CTA wrapped into a narrow column). If the wordmark,
  CTA and hamburger do not fit at 375px, hide the CTA under 480px when the hero repeats it.
- No horizontal scroll.

Check the same three widths again on the converted theme. `html-page-review` carries the same check.

## 3. Converting to blocks

- Header navigation: `"overlayMenu":"mobile","icon":"menu"` (or the option chosen above). Footer
  navigation: `"never"`.
- Source order in the header's actions group: CTA first, navigation last, so the hamburger is the
  rightmost item on phones. A starter that reorders it for desktop (Aviendha: `.kadewerk-header__actions`
  in §2.6) needs the group to carry that class.
- Delete the prototype's mobile nav-row CSS. With an overlay it is dead weight, and it fights the
  overlay if it stays.
- `.site-nav ul { display: flex }` rules apply only to the closed state:
  `.site-nav .wp-block-navigation__responsive-container:not(.is-menu-open) ul`.
- After a CSS change, hard-reload before judging it: the browser keeps the old stylesheet and the
  old layout looks like a bug in the new one.
