# Bloomé 3D Ear — Beta 2A.1

Customer-facing mobile-first viewer built from the frozen Beta 1B.10 baseline.

Beta 2A.1 corrects the selector arrow encoding issue, retains the approved Brain presentation, and adds small accessibility and loading-fallback improvements.

## Use

Serve this folder from any static web host (including GitHub Pages). Open `index.html`, choose a point or area, then drag to rotate, pinch or scroll to zoom, and use Reset to return to that location's guided view.

## Frozen baseline

`data/coordinates-1b10-frozen.json` is copied unchanged from Beta 1B.10. It contains 10 locked points and 2 locked areas. Do not casually edit this file; future coordinate changes should be versioned as a new calibration baseline.

## Viewer behavior

- Ear 1 geometry only
- one selected point or area visible at a time
- location-specific guided camera views
- rotate, zoom, Focus location, Front view, and Reset
- no placement, boundary, coordinate, copy, or debugging controls
- Occiput and Ear Apex remain translucent areas
- warmer lighting, softer skin presentation, editorial cream/blush setting

The ear geometry was not altered for Beta 2A. Model credit and licence details are in `ATTRIBUTION.md`.

## GitHub Desktop

Summary: `Beta 2A.1 - Fix Selector And Refine Customer Viewer`

Description: `Fixed the corrupted selector arrow, retained the approved Brain marker presentation, added keyboard-focus and model-loading fallback improvements, and preserved the frozen 1B.10 coordinates and Ear 1 geometry exactly.`
