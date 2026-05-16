# Collimation Circles

Camera-based collimation aid with live webcam video, concentric overlay circles, camera controls, presets, image scale, and zoom.

## Requirements

- Windows
- Node.js
- A webcam or telescope collimation camera
- A browser with camera permission support

## Start

Open PowerShell:

```powershell
cd D:\CollimationCircles
node current\server.js
```

Then open:

```text
http://localhost:8001
```

Click `Start Camera` and allow browser camera permission.

## Stop

In the PowerShell window running the server, press:

```text
Ctrl+C
```

## Presets

Presets are saved locally in the `presets` folder as JSON files. Preset files are ignored by Git so personal telescope settings stay local by default.

## Project Structure

- `current`: active runnable app
- `presets`: local saved presets
- `v*_...`: timestamped version snapshots
- `GOLDEN_FILE.md`: project rules and full version log

## Current Release

Version 16 - Final Release Instructions

This release keeps Version 15 application behavior and adds final project documentation and GitHub-ready repository files.
