---
name: FanFest Note
description: A calm bilingual pocket field guide for reading, planning, and checking things off.
colors:
  ink: "#173f3b"
  muted: "#52655f"
  paper: "#f6f4ed"
  surface: "#fffefa"
  line: "#d6ddd2"
  accent: "#ad452d"
  mint: "#e5ede3"
  focus: "#b14b31"
  ink-hover: "#2c5750"
  button-active: "#d6e3d3"
  selection: "#c9ddc5"
  online: "#55764c"
  note-divider: "#bdcdbc"
  notice-bg: "#f2e7d5"
  notice-text: "#6f4828"
  empty-bg: "#f0f2e9"
  empty-border: "#b8c7ba"
  empty-icon: "#637e69"
  saved-bg: "#f3e3d8"
  error: "#922f23"
typography:
  display:
    fontFamily: 'FanFestGuideSerif, "Noto Serif CJK TC", serif'
    fontSize: "46px"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0.02em"
  headline:
    fontFamily: 'FanFestGuideSerif, "Noto Serif CJK TC", serif'
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.7
  title:
    fontFamily: '"Noto Sans TC", "Noto Sans JP", "PingFang TC", "Hiragino Kaku Gothic ProN", "Microsoft JhengHei", sans-serif'
    fontSize: "23px"
    fontWeight: 650
    lineHeight: 1.7
  body:
    fontFamily: '"Noto Sans TC", "Noto Sans JP", "PingFang TC", "Hiragino Kaku Gothic ProN", "Microsoft JhengHei", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: '"Noto Sans TC", "Noto Sans JP", "PingFang TC", "Hiragino Kaku Gothic ProN", "Microsoft JhengHei", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  caption:
    fontFamily: '"Noto Sans TC", "Noto Sans JP", "PingFang TC", "Hiragino Kaku Gothic ProN", "Microsoft JhengHei", sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.7
  time:
    fontFamily: '"Noto Sans TC", "Noto Sans JP", "PingFang TC", "Hiragino Kaku Gothic ProN", "Microsoft JhengHei", sans-serif'
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.5
  wordmark:
    fontFamily: 'FanFestGuideSerif, serif'
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.7
    letterSpacing: "0.02em"
rounded:
  tag: "4px"
  language-item: "5px"
  control: "8px"
  toast: "10px"
  surface: "14px"
  field-note: "2px 20px 20px 2px"
  count: "30px"
  circle: "50%"
spacing:
  compact: "8px"
  small: "12px"
  medium: "16px"
  large: "20px"
  row: "24px"
  section: "28px"
  navigation: "32px"
  desktop-gutter: "36px"
  columns: "40px"
  wide-columns: "48px"
  hero: "60px"
  footer: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "9px 17px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "9px 17px"
  button-secondary-hover:
    backgroundColor: "{colors.mint}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "9px 12px"
  navigation-item:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  navigation-item-current:
    textColor: "{colors.accent}"
  tag:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "25px"
  field-note:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field-note}"
    padding: "27px 30px"
  notice:
    backgroundColor: "{colors.notice-bg}"
    textColor: "{colors.notice-text}"
    rounded: "{rounded.surface}"
    padding: "18px 20px"
  empty-state:
    backgroundColor: "{colors.empty-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "42px 26px"
  save-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  save-button-saved:
    backgroundColor: "{colors.saved-bg}"
    textColor: "{colors.accent}"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.toast}"
    padding: "14px 24px"
  map-number:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "34px"
    height: "34px"
  legend-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "12px 7px"
  legend-row-selected:
    backgroundColor: "{colors.mint}"
  activity-summary:
    textColor: "{colors.ink}"
    padding: "20px 0"
  summary-preview:
    rounded: "{rounded.surface}"
    width: "100%"
---

# Design System: FanFest Note

## Overview

**Creative North Star: "The Pocket Field Guide"**

FanFest Note feels like a small festival booklet kept close at hand: warm paper, evergreen ink, quiet sage surfaces, and a restrained rust accent. Serif headings give the guide its editorial character; clear sans-serif text and line icons make repeated checking and planning easy.

The interface stays calm and practical. Lists use thin dividers and readable columns, with tonal panels reserved for useful groupings and status messages. This documents the implemented direction in `.impeccable/briefs/guide.md`; it does not claim that an image composition was approved.

**Key Characteristics:**

- Warm paper and evergreen ink with restrained rust emphasis.
- Bilingual reading hierarchy with compact supporting labels.
- Quiet tonal surfaces, thin dividers, and very little elevation.
- Horizontal desktop wayfinding and persistent phone navigation.
- Explicit visual states for saved items, completion, missing content, and errors.

## Colors

The palette combines botanical greens, warm off-whites, and a small amount of earthy rust. Frontmatter values are extracted from `styles.css` and are normative; descriptive names below explain their use.

### Primary

- **Evergreen Ink** (`ink`): default text, primary actions, selected language, toast background, and checkbox accent.
- **Lifted Evergreen** (`ink-hover`): primary action hover state.
- **Pale Sage** (`mint`): field notes, forms, tags, icon circles, secondary hover states, and current phone navigation.

### Secondary

- **Rust Emphasis** (`accent`): selected desktop navigation, selected bookmarks, heading emphasis, link hover, and text-entry caret.
- **Rust Focus** (`focus`): keyboard focus outline, kept distinct from selection state.
- **Blush Paper** (`saved-bg`): selected bookmark surface.

### Neutral

- **Warm Paper** (`paper`): the page canvas.
- **Ivory Sheet** (`surface`): header, controls, panels, and reversed primary text.
- **Quiet Evergreen** (`muted`): supporting descriptions, Japanese references, and metadata.
- **Sage Rule** (`line`): list dividers and control borders; `note-divider` gives sage field notes a stronger internal rule.
- **Soft Selection** (`selection`) and **Pressed Sage** (`button-active`): text selection and the global plain-button pressed state. Component-specific background rules can take precedence over that global state.

### Status colors

- `notice-bg` and `notice-text` identify the missing-official-content notice.
- `empty-bg`, `empty-border`, and `empty-icon` identify empty states without resembling populated content.
- `online` colors the connection indicator; offline uses the rust accent. The accompanying text carries the status meaning.
- `error` marks invalid form feedback.

**The State Has a Label Rule.** Color supports a visible label, icon, border, or text treatment; it never carries status by itself.

## Typography

**Display Font:** the CJK serif stack in `typography.display`, used for the opening headline and page titles.

**Body Font:** the CJK sans-serif stack in `typography.body`, used for reading text, controls, schedules, and metadata.

**Wordmark Font:** FanFestGuideSerif with a generic serif fallback. The first word is bold and NOTE uses regular weight.

The heading and wordmark serif is a bundled, licensed Noto Serif CJK subset, renamed FanFestGuideSerif; Japanese headings use FanFestGuideSerifJP with `"Noto Serif CJK JP", serif` fallbacks. Both WOFF files are cached for offline use and use `font-display: swap`. Uncovered glyphs fall back to local fonts. The sans-serif families remain local fallback stacks, so body glyph design depends on the device. There is no strict mathematical type scale.

### Hierarchy

- **Display:** the opening headline; balanced lines and rust emphasis. It reduces to (35px) at the tablet breakpoint and (34px), with line height (1.5), on phones.
- **Headline:** interior page titles; reduces to (30px) on tablets and (29px) on phones.
- **Title:** section headings; reduces to (21px) on phones. Panel headings use (19px), while empty-state and event titles use (18px).
- **Body:** the root reading baseline. Most descriptions and controls use the smaller label scale; home introduction text uses (15px), reducing to (13px) on phones.
- **Label / caption:** navigation and compact actions, followed by quiet metadata and Japanese title references. Tags use (11px); phone navigation uses (10px).
- **Time:** schedule times use tabular numerals and a separate column; their size reduces to (18px) on phones.

Reading measures vary by purpose: home introduction (44ch; 35ch on phones), empty-state explanation (52ch), information and activity text (75ch), and the notice explanation (88ch). Keep the verified Japanese titles alongside Traditional Chinese translations. Activity detail copy is (14px) at line-height (1.9), reducing to (13px) on phones; its heading is (20px), reducing to (18px). Map legend labels are (13px) with (10px) Japanese references. Calendar dates use (28px), reducing to (25px) on phones. Summary text uses (14px), reducing to (13px), with (20px) day headings and (16px) reminder headings. These observed responsive sizes coexist with the canonical frontmatter styles; there is no single ratio-based scale.

## Layout

The centered content shell has a maximum outer width of (1168px), including horizontal gutters of (36px). The header's outer maximum is (1240px). Desktop navigation is horizontal with a (68px) minimum link height and a thin bottom divider.

The home opening uses a (1.5fr / 1fr) split and (60px) gap. Its lower sections use (1.2fr / 1fr) and (48px); general paired sections use (1.45fr / 1fr) and (40px). Schedule rows reserve (90px) for time, then flexible content and an action column. Repeated content uses rows and thin rules, while forms and focused notes use tonal containers.

At (800px) and below, the shell gutters become (24px), paired-section gaps become (26px), and the connection indicator in the header is hidden. The opening keeps two columns at (1.3fr / 1fr).

At (600px) and below, the shell gutters become (20px), the opening stacks, and paired sections become one column. Navigation is fixed along the bottom, with safe-area padding, (56px) minimum link height, and icon-over-label alignment. The footer reserves (110px) bottom padding; toasts sit above the navigation at (88px) from the bottom. Schedule time columns reduce to (67px). Forms retain two columns for paired time fields, with long fields spanning both columns.

At (1100px) and above, the main content has a (60vh) minimum height. The map workspace uses (1.7fr / 1fr) columns with a (30px) gap and a minimum (260px) index column; it stacks at (800px). The image viewport is capped at (620px), then (55vh) below that breakpoint. It fits at 100% and supports zoom to 800% with scrolling and mouse dragging. Legend height is capped at (720px), (440px) on tablets and (360px) on phones. Timeline image and text blocks have a (900px) maximum width; download actions wrap on narrow screens. Print styles hide navigation and editing actions and avoid breaking event rows across pages.

## Elevation & Depth

Most depth comes from warm paper, ivory, and sage layers. Panels, notices, rows, and navigation have no box shadows. The sole shadow belongs to transient feedback: the toast uses `0 5px 25px #173f3b26`. Keep that shadow restricted to floating feedback rather than adding elevation to every content group.

**The Quiet Surface Rule.** Separate ordinary content with tone, spacing, and a thin divider before introducing a shadow.

## Shapes

Controls have gentle corners, larger containers use the surface radius, and compact labels use the tag radius. Source symbols and bookmark buttons are circles. The desktop field note has a nearly square left edge and rounded right corners, plus a short rule just outside the left edge; on phones it adopts the standard surface radius.

Borders are generally (1px) solid rules. Empty states use a dashed border. Active desktop navigation has a (3px) underline; phone selection uses a sage fill. Inline SVG icons use rounded caps and joins, (1.7px) strokes, and a typical (22px) box. Avoid simulated paper textures; the flat palette supplies the material character.

## Components

### Buttons

Primary actions use evergreen with ivory text; secondary actions are transparent with a sage border. Both use control corners and a minimum height of (44px). Primary hover uses lifted evergreen, while secondary hover uses pale sage. Language buttons, checklist labels, deletion buttons, and bookmark buttons also have a minimum height of (44px); deletion and bookmark buttons have a minimum width of (44px). Compact event actions retain a minimum height of (38px).

Keyboard focus is a (3px) rust outline with a (4px) offset. Disabled buttons have reduced opacity (0.5) and a not-allowed cursor. Color transitions last (0.18s) with `ease`; reduced-motion preferences disable transitions. Bookmark selection fills the icon and applies blush paper with rust text, alongside `aria-pressed`.

### Chips

Event-kind tags are small, noninteractive sage labels with ink text. They distinguish personal plans, official stage programs, music stages and intermittent broadcasts in words. Navigation count badges are rounded and remain visually subordinate to the destination label.

### Cards / Containers

Ivory panels use the surface radius and (25px) padding, reducing to (20px) on phones. The sage field note is a compact index with line-separated links. Missing-content notices use warm amber tones with an information icon and explanation. Empty states use a pale fill, dashed boundary, centered heading, short explanation, and an available next action. These containers remain flat.

### Inputs / Fields

Text, date, and time fields use ivory fill, a thin sage border, control corners, and a minimum height of (44px). Search wraps a line icon and borderless input inside a matching outlined container; its input and select controls have a minimum height of (46px). Placeholders use muted text, carets use rust, and keyboard focus remains clearly visible. Invalid personal time ranges produce nearby error text with an alert role.

### Navigation

Six destinations—overview, TL;DR, schedule, activities, maps and personal list—share the same navigation. Desktop links pair a line icon with a text label; the current destination gains rust text, bold weight, and an underline. On phones the same destinations form a persistent bottom bar, with sage fill and evergreen text on the current item. Language buttons sit inside a compact outlined group; the selected language reverses to ivory on evergreen. Use `aria-current` for destination state and `aria-pressed` for language state.

### Official maps and activity details

Official maps keep their original lettering, colors, image geometry and number labels. Transparent percentage-positioned hit areas preserve the printed numbers; hover, focus or selection displays a (30px) rust badge with a white border. The full-width number index provides large equivalent controls when map locations are crowded. Selecting an activity highlights its corresponding map position and brings it into view; the detail panel presents bilingual description, conditions and source links. A shared number can have multiple activity entries, and repeated locations retain their own hotspots.

Activity lists use native disclosure rows with a circular (34px) number badge, translated title, quiet Japanese reference and expanding details. Reservation and practical sections use disclosures to keep dense conditions available without filling the first viewport. Labels name the venue because numbers repeat between maps.

### Timeline summary

The TL;DR tab places language-specific and alternate-language download actions above a full-width image preview, constrained to (900px). The source image contains both days; the page has an expandable text timeline and reservation notes for readable selection and assistive technology. The generated image inherits paper, ink, sage, rust and tabular time hierarchy. Treat its exact text and dates as data, not decorative image-generation output.

### Schedule and checklist rows

Schedule rows align tabular times, a labeled event kind, title, metadata, and compact actions. Japanese title references are muted supporting lines in the Traditional Chinese view. Personal entries keep their own explicit label. Checklist completion combines a checked checkbox, muted text, and a strike-through. All rows preserve thin divider rhythm instead of becoming a stack of elevated cards.

## Do's and Don'ts

### Do:

- **Do** use the existing paper, ink, sage, and rust roles before adding colors.
- **Do** keep bilingual labels readable and let metadata remain quieter than titles.
- **Do** preserve visible keyboard focus and text alongside status colors.
- **Do** keep phone navigation and floating feedback clear of each other.
- **Do** show missing content as an explained empty state with a useful next action.

### Don't:

- **Don't** add simulated paper textures or ornamental gradients to the field-guide surfaces.
- **Don't** give ordinary rows and panels the toast's floating shadow.
- **Don't** replace explicit personal, official, saved, or unavailable labels with color alone.
- **Don't** assume body fallback fonts or glyphs outside the bundled serif subsets are available on every device.
- **Don't** treat synthesized sidecar tonal ramps as additional implemented colors.
