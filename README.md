# Bloomé 3D Ear — Beta 2B

Customer-facing mobile-first viewer built from the frozen Beta 1B.10 baseline.

Beta 2B is the production-ready standalone viewer. It retains the approved presentation and adds direct location links for the next integration phase.

## Direct links

Append a location ID to open the viewer with that point or area selected:

- `?location=endocrine`
- `?location=pointZero`
- `?location=cervicalSpine`
- `?location=occiput`
- `?location=earApex`

The remaining IDs are `sympathetic`, `subcortex`, `thalamus`, `adrenal`, `brain`, `mouth`, and `shoulder`.

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

Summary: `Beta 2B - Finalize Production 3D Ear Viewer`

Description: `Finalized the responsive Bloomé 3D Ear Viewer with polished loading and fallback states, direct point and area links for future View in 3D integration, production-facing copy, and the unchanged frozen 1B.10 coordinates and Ear 1 geometry.`
