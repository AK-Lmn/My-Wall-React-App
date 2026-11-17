---
name: Wall
description: A familiar blue-and-white space for short conversations.
colors:
  primary: "#2876d6"
  primary-deep: "#1d5fae"
  ink: "#263244"
  muted: "#657184"
  divider: "#e4e8ee"
  paper: "#ffffff"
  canvas: "#f3f5f8"
  composer-wash: "#f4f8fe"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "34px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-1.2px"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "27px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.5px"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "25px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.6px"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "15px"
    lineHeight: 1.6
  message:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
    lineHeight: 1.8
rounded:
  control: "4px"
  image: "5px"
  shell: "10px"
spacing:
  compact: "12px"
  inset: "24px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "7px 19px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  composer:
    backgroundColor: "{colors.composer-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.image}"
    padding: "18px 20px"
---

# Design System: Wall

## Overview

**Creative North Star: "The Familiar Wall"**

A nostalgic social profile with a calm, practical reading surface. A saturated blue masthead anchors the white page; the profile portrait gives it a human focal point. Light blue fields and fine dividers organize conversation without making each post a separate floating card.

This documents the implemented code, using the user-delegated direction and `.impeccable/references/reference-1.png`. The profile uses the photo and details supplied by Kim Lamano; posting remains unauthenticated.

**Key Characteristics:**
- Blue masthead and compact wall wordmark.
- Large desktop portrait beside an open conversation column.
- Generous pale composer and plainly separated feed rows.
- Strong author names, relaxed message text, quiet metadata.

## Colors

One blue accent family sits against cool neutral surfaces. The frontmatter records the eight root CSS colors.

### Primary
- **Wall Blue:** masthead, Share button, caret, and keyboard focus outlines.
- **Deep Wall Blue:** links, selected filters, and button hover.

### Neutral
- **Slate Ink:** primary text; **Quiet Slate:** supporting text.
- **Cool Divider:** sidebar boundary and feed separators.
- **White Paper:** app surface; **Cool Canvas:** surrounding page; **Composer Wash:** message field.

State-specific colors remain local: selected navigation uses pale blue (`#eaf2fd`) with deep blue text (`#215fae`); errors use a pale warm surface (`#fff6f3`) and dark rust text (`#8b3f32`).

## Typography

**Display Font:** Arial, Helvetica, sans-serif.
**Body Font:** Arial, Helvetica, sans-serif.

The single system-font stack keeps the familiar interface direct. Weight, size, and spacing create the hierarchy; there is no separate decorative or monospaced family.

### Hierarchy
- **Display:** the compact wordmark uses the display token; its terminal dot is pale blue.
- **Headline:** section headings use the headline token.
- **Title:** the profile name uses the title token.
- **Body:** the global body token supports the interface; feed messages use the message token and a maximum measure of (73ch).
- **Author:** bold (15px), line height (1.5), above the message.
- **Metadata:** timestamps (10px), actions (10px), and navigation labels (12px) remain quieter than names and messages.

## Layout

The centered page shell has a maximum width of (1220px), padding (32px 24px 0), and a blue navigation bar with minimum height (72px). The white app contains a (268px) sidebar and a flexible main column. Sidebar padding is (28px 24px); main padding is (32px 38px 0). The portrait fills the sidebar inset and is cropped to height (266px), with object position (50% 38%).

At widths up to (900px), the sidebar becomes (225px), the portrait height becomes (230px), and main horizontal padding becomes (26px). At widths up to (650px), the shell becomes edge-to-edge: the portrait is (80px by 101px), identity sits beside it, and four equal-width section tabs sit below. Extra sidebar information is hidden. The main column uses horizontal padding (22px); the composer spans that column. The wordmark, headings, messages, and controls shrink slightly. At widths from (1400px), shell top padding becomes (42px).

## Elevation & Depth

Depth comes mainly from white paper against the cool canvas, pale blue inset surfaces, and fine borders. The desktop shell has one ambient shadow (`0 5px 22px #26324405`). Mobile removes the shell shadow, border, and rounding. Posts remain flat rows with bottom dividers.

## Shapes

Corners are restrained: shell, image, and control radii use the frontmatter tokens. The composer shares the image radius; attachment and comment inputs use (3px). Only the small navigation initial and status dots are circular. Portraits and post photos crop within rounded rectangles.

## Components

### Buttons

The Share button is compact and solid blue, with bold (13px) text, minimum size (91px by 37px), and a matching (1px) border. Hover deepens the blue over (140ms). Disabled uses a cool gray fill and border (`#e6ebf2`) with muted text (`#7a879b`). Mobile minimum size is (76px by 35px). Other actions are text or icon buttons; post actions underline on hover.

### Cards / Containers

The app shell is the enclosing card. Feed rows use padding (25px 0 23px) and a single divider. Response areas use pale blue (`#f2f6fc`), control-radius corners, and padding (12px). Post photos have a maximum width of (440px), desktop height (225px), and mobile height (190px).

### Inputs / Fields

The composer starts with a dashed border (`#b5c9e1`), minimum height (145px), maximum height (420px), vertical resizing, and the composer token's surface and inset. Focus changes the border to solid and the surface to (`#f8fbff`). The author field sits below it as a small underlined input. Search uses a transparent field over the masthead with a bottom border that turns white on focus.

Keyboard-focused buttons and links receive a blue (2px) outline with offset (4px). Other focused inputs receive a pale blue (2px) outline with offset (2px). Composer border-color transitions last (140ms); the reduced-motion media query removes transitions.

### Navigation

The masthead places the wordmark left, search toward the right, then a circular initial and profile action. Sidebar tabs stack vertically; selected tabs use a pale blue fill and bold blue text. Hover adds a lighter blue wash. Mobile turns them into four columns and hides the selected arrow and profile action's text label.

### Feed

Author and timestamp share a baseline; the message sits (9px) below, retaining newlines and wrapping long words. Actions sit (11px) below the message. The toolbar has a bottom divider and text filters with bold blue selection. Local-preview, loading, empty, success, and error labels remain explicit text rather than color-only signals.

## Do's and Don'ts

### Do:
- **Do** preserve the blue masthead, pale composer, and white conversation surface.
- **Do** keep author names stronger than messages and metadata.
- **Do** compact the profile above four tabs on mobile and keep the composer full width within its column.
- **Do** retain visible focus treatments and explicit status text.

### Don't:
- **Don't** turn the separated feed rows into individually elevated cards.
- **Don't** present display names as authenticated account identities.
- **Don't** style browser-local preview status as an active Supabase connection; provisioning is deferred.

