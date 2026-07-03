# Handoff: Timestamp Foto (Photo Timestamp Overlay Tool)

## Overview
A single-page web tool that lets a user upload a photo, then overlay a "Timemark"-style timestamp watermark on it: time, Indonesian-formatted date, a location string, and a random verification code — styled like the geotag-camera watermark apps common in Indonesia. The user can edit all fields live and download the composited photo as a JPEG.

## About the Design Files
The bundled file (`Timestamp Foto.dc.html`) is a **design reference / working prototype** built in an internal HTML prototyping environment (a custom "DC" component runtime loaded via `support.js`, which is NOT included and will not run outside that environment). It is fully functional as a demo but **is not production code to copy directly** — the task is to recreate this design and behavior in your own codebase's stack (React, Vue, plain JS, mobile native, etc.), using your project's existing patterns, component library, and build tooling. Treat the HTML/CSS/JS inside as the spec for layout, styling values, and logic — not a drop-in file.

## Fidelity
**High-fidelity.** Colors, spacing, typography, and canvas-drawing logic below are final values used in the working prototype — recreate them precisely.

## Screens / Views

### Single screen: Editor
Two-column layout, full viewport height.

**Layout**
- Root: `display:flex`, `min-height:100vh`, background `oklch(0.16 0.01 260)` (near-black cool gray), font `Arial, Helvetica, sans-serif`, text color `#fff`.
- Left sidebar: fixed width `340px`, padding `28px 24px`, `display:flex; flex-direction:column; gap:20px`, background `oklch(0.19 0.012 260)`, right border `1px solid oklch(0.28 0.01 260)`.
- Right canvas area: `flex:1`, centers content (`align-items:center; justify-content:center`), padding `32px`, background `oklch(0.12 0.01 260)`.

**Left sidebar components (top to bottom):**
1. **Title block** — "Timestamp Foto" at `22px / 700 weight / color #FFB020`, subtitle "Pilih gambar lalu atur jam, tanggal, dan lokasi." at `13px`, color `oklch(0.7 0.01 260)`.
2. **Upload button** — styled `<label>` wrapping a hidden `<input type="file" accept="image/*">`. Full width, centered content, padding `12px 16px`, background `#FFB020`, text color `#1a1a1a`, weight `700`, size `14px`, `border-radius:8px`, `cursor:pointer`. Label text toggles: "Pilih Foto" (no image loaded) / "Ganti Foto" (image loaded).
3. **Jam (Time) field** — label above (`12px`, uppercase, letter-spacing `0.04em`, color `oklch(0.7 0.01 260)`), native `<input type="time">`, padding `10px 12px`, `border-radius:8px`, border `1px solid oklch(0.32 0.01 260)`, background `oklch(0.14 0.01 260)`, text `#fff`, `15px`. Default value `13:20`.
4. **Tanggal (Date) field** — same label style, native `<input type="date">` same styling as time. Below it, a preview line showing the formatted Indonesian date string at `13px`, color `oklch(0.75 0.02 80)` (warm amber-gray). Default = today's date.
5. **Lokasi (Location) field** — same label style, `<textarea rows="2">`, same input styling, `resize:vertical`. Default value: `Galala, Oba Utara, Kota Tidore Kepulauan, Maluku Utara`.
6. **Kode verifikasi (Verification code) field** — label, then a row (`display:flex; gap:8px`): a read-only display box (`flex:1`, same input styling, `14px`, `letter-spacing:0.05em`) showing a random 12-character code, plus an "Acak" (Randomize) button — padding `0 14px`, `border-radius:8px`, transparent background, border `1px solid oklch(0.32 0.01 260)`, `13px`.
7. **Footer (pinned via `margin-top:auto`)** — "Unduh Foto" (Download Photo) button, full width, padding `13px 16px`, `border-radius:8px`, no border, weight `700`, `15px`. Enabled state: background `#FFB020`, text `#1a1a1a`, `cursor:pointer`. Disabled state (no image yet): background `oklch(0.3 0.01 260)`, text `oklch(0.55 0.01 260)`, `cursor:not-allowed`. Below the button, helper text "Format JPEG, kualitas tinggi" at `12px`, color `oklch(0.55 0.01 260)`, centered.

**Right canvas area:**
- Empty state: a `360×480px` dashed box (`2px dashed oklch(0.32 0.01 260)`, `border-radius:12px`), centered text "Belum ada foto.<br/>Klik "Pilih Foto" di panel kiri untuk mulai." at `14px`, color `oklch(0.55 0.01 260)`.
- Loaded state: a `<canvas>` element sized to the uploaded image's natural pixel dimensions, displayed at `max-width:100%; max-height:calc(100vh - 64px)`, `border-radius:6px`, drop shadow `0 20px 60px rgba(0,0,0,0.5)`. The canvas is where the photo + overlay are composited and redrawn on every field change.

## Interactions & Behavior

- **Upload**: user clicks the upload label → native file picker → selected image is read via `FileReader.readAsDataURL`, loaded into an `Image` object, then drawn onto the canvas at its native resolution.
- **Live redraw**: every keystroke/change to time, date, or location — and every click of "Acak" — triggers a full re-draw of the base photo plus the overlay (not just a DOM update), so the watermark always matches current field values.
- **Randomize code**: generates a new 12-character code from charset `ABCDEFGHJKLMNPQRSTUVWXYZ0123456789` (uppercase letters minus visually-ambiguous ones like I/O, plus digits).
- **Download**: exports the canvas via `canvas.toDataURL('image/jpeg', 0.92)`, triggers a synthetic `<a download>` click. Filename: `timestamp-<original-file-name>.jpg`.
- No animations, no responsive breakpoints — this is a fixed two-column desktop tool. No loading or error states (file read is treated as always succeeding).
- No the actual GPS/EXIF-based timestamp verification — all values (time, date, location, code) are freely user-editable; there is no real cryptographic or GPS binding. This is purely a cosmetic watermark generator matching the visual style of "Timemark"-type apps.

## State Management
Component state:
- `imageEl` — the loaded `Image` object (`null` until upload)
- `fileName` — original uploaded filename, for the download filename
- `time` — string `HH:MM`, default `13:20`
- `dateInput` — string `YYYY-MM-DD`, default today
- `location` — free text, default `Galala, Oba Utara, Kota Tidore Kepulauan, Maluku Utara`
- `code` — random 12-char string, regenerated on mount and on "Acak" click

Derived (computed each render, not stored):
- `formattedDate` — Indonesian-locale formatted string from `dateInput`, e.g. `Rabu, 01 Juli 2026` (day name + zero-padded day + Indonesian month name + year). Day names: Minggu, Senin, Selasa, Rabu, Kamis, Jumat, Sabtu. Month names: Januari…Desember.
- `hasImage` — `!!imageEl`, drives upload label text, empty-state vs canvas, and download button enabled/disabled + color.

State transitions: every field's `onChange` sets that one state key and triggers a canvas redraw (via update lifecycle or explicit callback). Upload also redraws once the `Image` finishes loading.

## Canvas Overlay Drawing Spec (the core rendering logic)
All measurements below are expressed relative to a scale factor `s = canvasWidth / 1200` (i.e. values are tuned for a 1200px-wide reference image and scaled proportionally for other resolutions).

1. **Bottom scrim**: linear gradient from transparent at `55%` of height to `rgba(0,0,0,0.55)` at `100%` height, filled across full width from `55%`→`100%` height.
2. **Top scrim**: linear gradient from `rgba(0,0,0,0.35)` at top to transparent at `18%` height, filled across full width, `0`→`18%` height.
3. **Top-right brand lockup**: right-aligned text. "Timemark" — `700 weight`, font-size `34*s`, color `#FFB020`, drop shadow `rgba(0,0,0,0.5)` blur `4*s`, positioned at `(width-24*s, 44*s)`. Below it, "Foto 100% akurat" — `400 weight`, `19*s`px, white, at `(width-24*s, 68*s)`.
4. **Right-edge vertical text**: rotated -90°, anchored near `(width-12*s, height*0.62)`. Text: `© <code>   Timemark Verified`, `600 weight`, `15*s`px, `rgba(255,255,255,0.85)`, drop shadow `rgba(0,0,0,0.6)` blur `3*s`.
5. **Bottom-left stacked block** (built bottom-up from `y = height - 30*s`, each line's height subtracted before drawing the next above it):
   - Footer line: `✓  Timemark menjamin keaslian waktu` — `400 weight`, `15*s`px, `rgba(255,255,255,0.85)`.
   - Location text: `700 weight`, `23*s`px, white, word-wrapped to a max of **2 lines** within `width - 60*s` px, line height `30*s`.
   - Date line: `700 weight`, `26*s`px, white, preceded by a small vertical accent bar — a filled rect `4*s` wide, `30*s` tall, color `#FFB020`, positioned just left of the date text (text itself indented `38*s` from left edge vs. the bar at `26*s`).
   - Time badge: a rounded-rect (corner radius `4*s`) filled white, sized to fit the time text with `16*s` left/right internal padding, height `56*s`. Time text drawn in `700 weight`, `40*s`px, color `#1a1a1a`, vertically centered in the badge.
   - All bottom-left elements left-aligned at `x = 26*s` (date text at `38*s` to clear the accent bar).

## Design Tokens
Colors:
- Background (app shell): `oklch(0.16 0.01 260)`
- Sidebar background: `oklch(0.19 0.012 260)`
- Sidebar border: `oklch(0.28 0.01 260)`
- Canvas area background: `oklch(0.12 0.01 260)`
- Input background: `oklch(0.14 0.01 260)`
- Input border: `oklch(0.32 0.01 260)`
- Label / muted text: `oklch(0.7 0.01 260)`
- Amber accent (brand + CTA): `#FFB020`
- Amber-adjacent muted (date preview): `oklch(0.75 0.02 80)`
- Disabled button background: `oklch(0.3 0.01 260)`
- Disabled button text: `oklch(0.55 0.01 260)`
- Overlay text: `#ffffff`, `#1a1a1a` (on white badge)

Typography: Arial/Helvetica/sans-serif throughout (both UI chrome and canvas-drawn overlay text). Sidebar label size `12px` uppercase; body inputs `14–15px`; title `22px`; canvas overlay text scales with image width (see spec above).

Border radius: `8px` (inputs, buttons), `12px` (empty-state box), `6px` (canvas), `4px` (time badge, scaled).

Shadow: canvas drop shadow `0 20px 60px rgba(0,0,0,0.5)`.

## Assets
No external image/icon assets — everything is native form controls, inline styles, and canvas-drawn text/shapes. No custom fonts loaded (system Arial/Helvetica stack).

## Files
- `Timestamp Foto.dc.html` — the full working prototype (markup + component logic in one file). Read the `<script type="text/x-dc" data-dc-script">` block at the bottom for the exact JS logic (state, canvas drawing function `drawOverlay`, date formatting, code generation, download handler).

## Suggested Recreation Notes
- The core reusable piece of logic is `drawOverlay(ctx, w, h, {time, date, location, code})` — a pure function that takes a 2D canvas context and draws the watermark. This ports directly to any stack with `<canvas>` support (React, Vue, vanilla JS) with no changes needed beyond adapting how state feeds into it.
- Indonesian date formatting and random-code generation are also pure, stateless helper functions — straightforward to port as-is.
- If recreating in React, consider: `useRef` for the canvas, `useState` for time/dateInput/location/code, and a `useEffect` that redraws whenever the image or any field changes.
