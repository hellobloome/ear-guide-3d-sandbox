# Bloomé 3D Ear Beta 1B.4

This is the current reusable 3D calibration sandbox.

## Locked point library
- Endocrine
- Sympathetic
- Subcortex
- Thalamus
- Adrenal

## Point calibration
Use **Turn on point placement mode** for another single-point location.
The temporary marker does not alter the five locked points.

## Occiput area calibration
1. Rotate to the antitragus / Occiput region.
2. Click **Turn on Occiput area mode**.
3. Tap around the boundary in order.
4. Aim for roughly 4–6 boundary taps.
5. Use **Undo last** if one tap is wrong.
6. Use **Clear area** to start over.
7. Click **Copy Occiput area data**.
8. Send the copied block and a screenshot to ChatGPT.

The numbered boundary markers are calibration handles only. A later beta can turn
the approved boundary into a cleaner highlighted region.

## Coordinate source
`data/3d-points-beta.json`

## Important
Bloomé Guide Package 31.2 remains untouched.

## GitHub Desktop summary
`Beta 1B.4 - Lock Adrenal + Add Occiput Area Calibration`


## Beta 1B.5 update
- Occiput is now loaded as a locked area using 4 approved boundary points.
- Use **Focus Occiput area** to jump the camera closer to that region.
- Use **Copy locked Occiput data** if you want to review the approved area coordinates.
- Area calibration mode is still empty by default and can be reused for future area tracing.


## Beta 1B.6 update
- Front view is corrected and should no longer open on the back of the ear.
- Occiput is now loaded from 10 approved boundary points.
- The locked Occiput region is shown as a translucent patch with a dashed outline.
- Boundary markers remain visible for checking the shape.


## Beta 1B.7 update
- Brain is now loaded as a locked point.
- Ear Apex is now loaded as a locked area with 10 boundary points.
- Occiput boundary markers are hidden, while the Occiput patch stays visible.
- Both area patches remain visible while rotating the ear.


## Beta 1B.8 update
- Area calibration mode now supports up to 20 boundary points.
- Point Zero and Mouth are now loaded as locked points.
- Occiput and Ear Apex remain locked translucent area patches.


## Beta 1B.9 update
- Point Zero and Mouth now include visible on-model hotspots and labels.
- Ear Apex locked area now uses the approved 20-boundary-point shape.
- Area calibration mode still supports up to 20 points.


## Beta 1B.10 update
- Shoulder and Cervical Spine are now locked as 3D points.
- The current mapping round now contains 10 locked points and 2 locked areas.
- This is the recommended coordinate-freeze candidate before moving into the clean customer 3D viewer phase.
