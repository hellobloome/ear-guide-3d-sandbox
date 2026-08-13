# Bloomé 3D Ear — Beta 2A

Customer-facing mobile-first viewer built from the frozen Beta 1B.10 baseline.

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

Summary: `Beta 2A - Build Clean Customer 3D Ear Viewer`

Description: `Built a mobile-first Bloomé customer 3D viewer from the frozen 1B.10 Ear 1 coordinate baseline, removed calibration controls, added single-location selection and guided camera focus, preserved Occiput and Ear Apex as translucent areas, and introduced softer editorial styling without changing geometry.`
