# Collimation Circles Golden File

This file is the project source of truth. Read this file first before any planning, design, code, file changes, or version updates.

## Golden Rules

1. Do not write code before intention is reviewed with the user and explicitly approved.
2. Work on one small thing at a time and build iteratively.
3. Do not suggest extra features outside of what the user asks for.
4. Keep this folder organized.
5. Maintain one source of truth for version changes and updates: this Golden File.
6. Every software iteration increments the version number by 1.
7. Every software update gets a new date/time-stamped folder for the newest version.
8. Every version-log entry must include date, time, version number, and a concise explanation of changes.
9. Keep one active app folder named `current` that matches the newest approved version.
10. Serve the app from `current` so the browser can stay on one local URL and refresh after each iteration.
11. Stop older local app servers when moving to a newer served version so only the active server remains running.
12. Every version must have a short descriptive name that represents the change made in that version.

## Version Folder Convention

Software version folders should use this format:

```text
v{version-number}_{yyyy-MM-dd}_{HH-mm-ss}_{version-name}
```

Example:

```text
v5_2026-05-16_09-38-01_named-version-rule
```

The version name should use lowercase words separated by hyphens.

## Active Folder Convention

The `current` folder is the active working copy served by the local development server. It must match the newest approved timestamped version folder.

Timestamped version folders are the permanent version history. The `current` folder is only the active served copy.

## Current Version

Version: 16
Name: Final Release Instructions

## Version Log

### Version 16 - Final Release Instructions - 2026-05-16 12:31:03 -07:00

Created `v16_2026-05-16_12-31-03_final-release-instructions` from `current`. Added `README.md` with startup, shutdown, preset, and project-structure instructions. Added `.gitignore` for GitHub upload readiness, including ignoring local preset JSON files while keeping the `presets` folder. No application behavior was changed.

### Version 15 - Responsive Wide Controls Pane - 2026-05-16 12:21:29 -07:00

Created `v15_2026-05-16_12-21-29_responsive-wide-controls-pane` from `current`. Updated the main layout so the right-hand controls pane grows responsively on wide screens using a bounded width range, giving sliders more room on ultrawide displays while preserving the existing compact and mobile behavior. Updated `current` to match Version 15.

### Version 14 - Slider Step Buttons - 2026-05-16 12:16:42 -07:00

Created `v14_2026-05-16_12-16-42_slider-step-buttons` from `current`. Added `-` and `+` buttons around every range slider so slider values can be fine-tuned by clicking their normal step amount. Applied this to camera controls, overlay alignment, image scale, zoom, circle size, and circle opacity while leaving drag and keyboard behavior unchanged. Updated `current` to match Version 14.

### Version 13 - Scrollable Controls Pane - 2026-05-16 12:13:21 -07:00

Created `v13_2026-05-16_12-13-21_scrollable-controls-pane` from `current`. Updated layout CSS so the page and app shell stay fixed to the browser viewport while the right-hand controls pane scrolls independently. The camera viewer no longer scrolls when navigating settings. Updated `current` to match Version 13.

### Version 12 - Zoom Control - 2026-05-16 12:10:17 -07:00

Created `v12_2026-05-16_12-10-17_zoom-control` from `current`. Added a Zoom slider separate from Image Scale. Image Scale changes the outer displayed image frame, while Zoom magnifies the video and overlay together inside that frame so the overlay stays locked to the zoomed camera image. Included zoom in saved presets so the value can be restored with a preset. Updated `current` to match Version 12.

### Version 11 - Image Scale Control - 2026-05-16 12:06:42 -07:00

Created `v11_2026-05-16_12-06-42_image-scale-control` from `current`. Added an Image Scale slider that makes the displayed camera image larger or smaller while keeping the overlay locked to the same scaled image frame. Included image scale in saved presets so the new slider value can be restored with a preset. Updated `current` to match Version 11.

### Version 10 - Video Locked Overlay - 2026-05-16 11:17:54 -07:00

Created `v10_2026-05-16_11-17-54_video-locked-overlay` from `current`. Updated overlay geometry so the overlay is positioned and sized to the actual displayed webcam image area instead of the full viewer area. Circle sizes and overlay X/Y offsets now scale with the displayed video frame so the circle overlay remains locked to the camera image when the browser window is resized. Updated `current` to match Version 10.

### Version 9 - Named Circle Presets - 2026-05-16 09:49:50 -07:00

Created `v9_2026-05-16_09-49-50_named-circle-presets` from `current`. Added named preset controls that save and load circle size, color, opacity, and overlay X/Y alignment values. Added a local Node server for reading and writing preset JSON files in the root `presets` folder. Updated `current` to match Version 9.

### Version 8 - Circle Transparency Controls - 2026-05-16 09:47:02 -07:00

Created `v8_2026-05-16_09-47-02_circle-transparency-controls` from `current`. Added an opacity value and opacity slider to each circle control so each overlay circle's transparency can be adjusted independently. Updated `current` to match Version 8.

### Version 7 - Overlay Center Alignment - 2026-05-16 09:43:27 -07:00

Created `v7_2026-05-16_09-43-27_overlay-center-alignment` from `current`. Added X Offset and Y Offset controls that move the entire circle overlay group together so the overlay can be centered on the camera's center point. Updated `current` to match Version 7.

### Version 6 - Camera Brightness Focus - 2026-05-16 09:39:23 -07:00

Created `v6_2026-05-16_09-39-23_camera-brightness-focus` from `current`. Added brightness and focus camera controls that enable only when the active browser/camera reports support through camera capabilities. Updated `current` to match Version 6.

### Version 5 - Named Version Rule - 2026-05-16 09:38:01 -07:00

Created `v5_2026-05-16_09-38-01_named-version-rule` from `current`. Updated the Golden Rules and version folder convention so every version has a short descriptive name that represents the change made in that version. No application behavior was changed.

### Version 4 - Stable Current Server - 2026-05-16 09:36:26 -07:00

Created `v4_2026-05-16_09-36-26` from Version 3 and created `current` to match Version 4. Updated the Golden Rules to require one active `current` folder, one stable local server URL served from `current`, and stopping older local app servers during iteration. No application behavior was changed.

### Version 3 - Camera Selector - 2026-05-16 09:33:12 -07:00

Created `v3_2026-05-16_09-33-12` from Version 2. Added a camera selector control that lists available video input devices after camera permission is granted and switches the live feed to the selected camera. No additional features were added beyond the approved camera-switching iteration.

### Version 2 - Webcam Circle Overlay - 2026-05-16 09:27:35 -07:00

Created `v2_2026-05-16_09-27-35` as the first application iteration. Added a static browser app with webcam video display, five named concentric overlay circles, and size/color controls for each circle. No additional features were added beyond the approved first iteration.

### Version 1 - Golden File - 2026-05-16 09:18:34 -07:00

Created the project Golden File. Added the required working rules, source-of-truth requirement, version increment rule, timestamped folder convention, and initial version log entry. No application code was written.
