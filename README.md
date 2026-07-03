# Timestamp Foto (Photo Timestamp Overlay Tool)

A single-page web tool that lets a user upload a photo, then overlay a "Timemark"-style timestamp watermark on it: time, Indonesian-formatted date, a location string, and a random verification code — styled like the geotag-camera watermark apps common in Indonesia. The user can edit all fields live and download the composited photo as a JPEG.

## Running it

Plain HTML/CSS/JS, no build step or dependencies.

- **Simplest**: open `index.html` directly in a browser (double-click it, or `open index.html` on macOS).
- **Or serve it locally**:
  ```bash
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`.

## Files

- `index.html` — page markup (sidebar form + canvas area).
- `styles.css` — layout, colors, typography.
- `app.js` — state, canvas overlay drawing (`drawOverlay`), Indonesian date formatting, random code generation, upload/download handlers.
- `Timestamp Foto.dc.html` — the original design prototype this was recreated from (built in an internal HTML prototyping runtime that won't execute outside that environment). Kept as a design reference only; not used by the app.

## Behavior

- **Upload**: pick an image via the "Pilih Foto" label → read via `FileReader` → drawn onto the canvas at its native resolution.
- **Live redraw**: every change to time, date, or location, and every click of "Acak", triggers a full redraw of the photo + watermark overlay.
- **Randomize code**: generates a new 12-character code from charset `ABCDEFGHJKLMNPQRSTUVWXYZ0123456789` (no ambiguous I/O).
- **Download**: exports the canvas via `canvas.toDataURL('image/jpeg', 0.92)`. Filename is `timestamp-<original-name-without-extension>.jpg` — the original extension is stripped before appending `.jpg` since the output is always re-encoded as JPEG.
- No animations, no responsive breakpoints — fixed two-column desktop layout. No loading/error states (file read is treated as always succeeding). No real GPS/EXIF binding — all overlay fields are freely user-editable; this is a cosmetic watermark generator only.

## Design tokens

Colors:
- Background (app shell): `oklch(0.16 0.01 260)`
- Sidebar background: `oklch(0.19 0.012 260)` / border: `oklch(0.28 0.01 260)`
- Canvas area background: `oklch(0.12 0.01 260)`
- Input background: `oklch(0.14 0.01 260)` / border: `oklch(0.32 0.01 260)`
- Label / muted text: `oklch(0.7 0.01 260)`
- Amber accent (brand + CTA): `#FFB020`
- Date preview text: `oklch(0.75 0.02 80)`
- Disabled button: background `oklch(0.3 0.01 260)`, text `oklch(0.55 0.01 260)`
- Overlay text: `#ffffff`, `#1a1a1a` (on white time badge)

Typography: Arial/Helvetica/sans-serif throughout, including canvas-drawn overlay text. Overlay text sizes scale with image width, relative to a `s = canvasWidth / 1200` factor (see `drawOverlay` in `app.js`).

Border radius: `8px` (inputs/buttons), `12px` (empty-state box), `6px` (canvas), `4px` (time badge, scaled).

Shadow: canvas drop shadow `0 20px 60px rgba(0,0,0,0.5)`.
