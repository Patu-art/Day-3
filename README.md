# Artista Perfetto — Day 03

**Independent frontend concept · 100-Day Local Business Website Challenge**

[Live demo](https://patu-art.github.io/Day-3/) · [Portfolio](https://patu-art.github.io/Portfolio/)

An independently created, unofficial demonstration for Artista Perfetto in Ancoats, Manchester. This is not an official site, a paid commission or an endorsement by the café.

## What changed
- Removed the invented AP monogram/logo treatment.
- Cut page length and moved practical information directly below the hero.
- Kept only real Artista Perfetto Manchester photography.
- Stopped assigning unrelated photos to specific signature drinks.
- Each major photograph is used once.
- Replaced repeated poster imagery with a clean text-led link to the real Manchester's Finest video feature.
- Renamed the social section so it no longer pretends to be a live embed.
- Added keyboard-accessible drink tabs.
- Carousel now pauses during hover, focus and touch interaction.
- Added basic Open Graph metadata and LocalBusiness structured data.
- Avoided publishing disputed opening hours; visitors are sent to the official location page for the current listing.
- Reduced 3840px Urbanary requests to 1600px for a more reasonable demo payload.

## Files
- `index.html`
- `style.css`
- `script.js`

Frontend only. No framework, database or build process.

## Media / source notes
Public real-business media is loaded remotely from:
- Manchester's Finest / Artista Perfetto coverage (hero)
- Urbanary venue photography (three carousel images)
- Artista Perfetto official Shopify location image (Instagram / visit area)
- Manchester's Finest real video feature linked from the story section

No generated café imagery and no generic stock coffee video are used.

For a paid production launch, obtain the business's original media files / permission and self-host them rather than depending on third-party hotlinks.

## Public details used
- Artista Perfetto Ancoats: 130 Oldham Rd, Manchester M4 6BG.
- Signature drinks discussed publicly include The Dirty and Iced Blackcinno.
- Public coverage describes techniques influenced by Japan and Hong Kong.
- Public opening-hour sources currently conflict, so this demo links to the official location page instead of hard-coding a disputed schedule.

## GitHub Pages
Upload `index.html`, `style.css`, `script.js`, and `README.md` at repository root, then publish `main` / root in GitHub Pages settings.


## Media-safe fix
- Added verified fallback URLs to every remote photo.
- Added `referrerpolicy="no-referrer"` to reduce hotlink blocking.
- If all remote sources fail inside an attachment viewer, the layout shows a designed media fallback instead of a broken image icon.
- Manchester's Finest video is no longer embedded; it opens at the original source, with a second link to the real feature page.
- Remote images are requested at 1200px instead of 1600/3840 to improve mobile loading.


## Local media setup

This build is now **local-first**.

The HTML expects these files:

- `assets/images/hero.jpg`
- `assets/images/shop.jpg`
- `assets/images/coffee-1.jpg`
- `assets/images/coffee-2.jpg`
- `assets/images/official-storefront.jpg`

The current ChatGPT file runtime cannot fetch those third-party image hosts directly, so the real files are **not bundled in this ZIP yet**.

Two automatic fetchers are included:
- Windows: `fetch-assets.ps1`
- macOS/Linux/GitHub runner: `fetch-assets.sh`

Once those images exist, the website serves them locally. Until then, the HTML falls back to the verified remote sources instead of breaking.
